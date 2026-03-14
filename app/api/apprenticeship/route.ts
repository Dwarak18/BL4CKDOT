import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ApprenticeshipApplication } from "@/models/ApprenticeshipApplication";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const { name, email, track, resume_link, motivation, user_id } = body;

  if (!name || !email || !track || !resume_link || !motivation) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const created = await ApprenticeshipApplication.create({
    user_id,
    name,
    email,
    track,
    resume_link,
    motivation,
    status: "pending",
  });

  return NextResponse.json({ ok: true, id: created._id, status: created.status });
}
