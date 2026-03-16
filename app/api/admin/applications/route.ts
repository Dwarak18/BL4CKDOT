import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest } from "@/lib/auth";
import { User } from "@/models/User";

const VALID_STATUSES = ["pending", "reviewing", "accepted", "rejected"];

export async function GET(req: NextRequest) {
  const user = getAuthFromRequest(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const applications = await User.find({ role: { $ne: "admin" } })
    .select("-password")
    .sort({ created_at: -1 });

  return NextResponse.json({ applications });
}

export async function PATCH(req: NextRequest) {
  const user = getAuthFromRequest(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const { userId, status } = body;

  if (!userId || !status) {
    return NextResponse.json({ error: "userId and status are required" }, { status: 400 });
  }
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const updated = await User.findByIdAndUpdate(userId, { status }, { new: true }).select("-password");
  if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ ok: true, user: updated });
}
