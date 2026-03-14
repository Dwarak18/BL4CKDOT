import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { InnovationSubmission } from "@/models/InnovationSubmission";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();

  const {
    submission_type,
    title,
    description,
    category,
    submitted_by,
    target_users,
    technology_stack,
    details,
  } = body;

  if (!submission_type || !title || !description || !category || !submitted_by || !target_users) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const created = await InnovationSubmission.create({
    submission_type,
    title,
    description,
    category,
    submitted_by,
    target_users,
    technology_stack: technology_stack || [],
    details,
    status: "idea",
  });

  return NextResponse.json({ ok: true, id: created._id, status: created.status });
}

export async function GET() {
  await connectDB();
  const items = await InnovationSubmission.find().sort({ created_at: -1 }).limit(50);
  return NextResponse.json({ items });
}
