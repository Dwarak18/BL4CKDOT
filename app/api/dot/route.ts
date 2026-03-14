import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { Research } from "@/models/Research";
import { InnovationSubmission } from "@/models/InnovationSubmission";
import { scoreItems } from "@/lib/search";

const FAQ: Record<string, string> = {
  what_is_bl4ckdot: "BL4CKDOT is an innovation ecosystem where students, innovators, and companies build real AI, IoT, and cybersecurity systems together.",
  apprenticeship: "Apply via the Apprenticeship page: submit your profile, track, resume link, and statement of purpose.",
  submit_idea: "Use Innovation Lab Submissions. Choose student, innovator, or company tab and submit your concept.",
  active_projects: "I can search active projects for you. Try: 'show AI research projects' or 'IoT prototypes'.",
};

function faqReply(input: string) {
  const q = input.toLowerCase();
  if (q.includes("what is") && q.includes("bl4ckdot")) return FAQ.what_is_bl4ckdot;
  if (q.includes("join") || q.includes("apprenticeship")) return FAQ.apprenticeship;
  if (q.includes("submit") && q.includes("idea")) return FAQ.submit_idea;
  if (q.includes("active") && q.includes("project")) return FAQ.active_projects;
  return null;
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const input = (body.message || "").trim();

  if (!input) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const quick = faqReply(input);

  const [projects, research, innovations] = await Promise.all([
    Project.find().limit(60),
    Research.find().limit(60),
    InnovationSubmission.find().limit(60),
  ]);

  const indexed = [
    ...projects.map((p: { _id: string; name: string; description: string; tech_stack?: string[] }) => ({ id: String(p._id), type: "project" as const, title: p.name, summary: p.description, tags: p.tech_stack || [] })),
    ...research.map((r: { _id: string; title: string; abstract: string; domain: string }) => ({ id: String(r._id), type: "research" as const, title: r.title, summary: r.abstract, tags: [r.domain] })),
    ...innovations.map((i: { _id: string; title: string; description: string; technology_stack?: string[]; category?: string }) => ({ id: String(i._id), type: "innovation" as const, title: i.title, summary: i.description, tags: i.technology_stack || [i.category || "innovation"] })),
  ];

  const top = scoreItems(input, indexed).slice(0, 3);

  let message = quick || "I searched our internal innovation data for that request.";
  if (top.length > 0) {
    message += "\n\nRelevant results:\n";
    top.forEach((item, idx) => {
      message += `${idx + 1}. [${item.type.toUpperCase()}] ${item.title}\n`;
    });
  }

  return NextResponse.json({ message, results: top });
}
