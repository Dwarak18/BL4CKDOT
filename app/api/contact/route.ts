import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const created = await ContactMessage.create({ name, email, subject, message });

  return NextResponse.json({
    ok: true,
    id: created._id,
    reference: `BL4CK-${Math.floor(1000 + Math.random() * 9000)}`,
    submitted_at: created.submitted_at,
  });
}
