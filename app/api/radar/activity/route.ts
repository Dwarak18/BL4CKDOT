import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { Research } from "@/models/Research";
import { InnovationSubmission } from "@/models/InnovationSubmission";

function toAngle(i: number) {
  return (i * 67) % 360;
}

function toDist(i: number) {
  const vals = [0.3, 0.42, 0.54, 0.66, 0.78, 0.58];
  return vals[i % vals.length];
}

export async function GET() {
  await connectDB();

  const [projects, research, innovations] = await Promise.all([
    Project.find().sort({ created_at: -1 }).limit(5),
    Research.find().sort({ created_at: -1 }).limit(5),
    InnovationSubmission.find().sort({ created_at: -1 }).limit(5),
  ]);

  const combined = [
    ...projects.map((p: { name: string }) => ({ label: p.name, kind: "project", color: "#22D3EE" })),
    ...research.map((r: { title: string }) => ({ label: r.title, kind: "research", color: "#22C55E" })),
    ...innovations.map((i: { title: string }) => ({ label: i.title, kind: "innovation", color: "#F59E0B" })),
  ].slice(0, 10);

  const blips = combined.map((item, i) => ({
    label: item.label,
    type: item.kind,
    angleDeg: toAngle(i + 1),
    dist: toDist(i),
    color: item.color,
  }));

  return NextResponse.json({ blips });
}
