import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-seed-secret");
  if (!process.env.ADMIN_SEED_SECRET || adminSecret !== process.env.ADMIN_SEED_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const email = process.env.ADMIN_EMAIL || "admin@bl4ckdot.dev";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const hashed = await bcrypt.hash(password, 10);

  const user = await User.findOneAndUpdate(
    { email },
    {
      name: "BL4CKDOT Admin",
      email,
      password: hashed,
      role: "admin",
      skills: ["platform-admin"],
    },
    { upsert: true, new: true },
  );

  return NextResponse.json({ ok: true, id: user._id, email: user.email });
}
