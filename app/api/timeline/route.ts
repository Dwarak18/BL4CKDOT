import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ensureTimelineSeed } from "@/lib/seed";
import { TimelineEvent } from "@/models/TimelineEvent";

export async function GET() {
  await connectDB();
  await ensureTimelineSeed();
  const events = await TimelineEvent.find().sort({ year: 1 });
  return NextResponse.json({ events });
}
