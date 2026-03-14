import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { Research } from "@/models/Research";
import { InnovationSubmission } from "@/models/InnovationSubmission";
import { scoreItems } from "@/lib/search";

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const query = (body.query || "").trim();

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const [projects, research, innovations] = await Promise.all([
    Project.find().limit(100),
    Research.find().limit(100),
    InnovationSubmission.find().limit(100),
  ]);

  const indexed = [
    ...projects.map((p: { _id: string; name: string; description: string; tech_stack?: string[] }) => ({
      id: String(p._id),
      type: "project" as const,
      title: p.name,
      summary: p.description,
      tags: p.tech_stack || [],
    })),
    ...research.map((r: { _id: string; title: string; abstract: string; domain: string }) => ({
      id: String(r._id),
      type: "research" as const,
      title: r.title,
      summary: r.abstract,
      tags: [r.domain],
    })),
    ...innovations.map((i: { _id: string; title: string; description: string; technology_stack?: string[]; category?: string }) => ({
      id: String(i._id),
      type: "innovation" as const,
      title: i.title,
      summary: i.description,
      tags: i.technology_stack || [i.category || "innovation"],
    })),
  ];

  const results = scoreItems(query, indexed);
  return NextResponse.json({ query, results });
}
