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

type IndexedItem = {
  id: string;
  type: "project" | "research" | "innovation";
  title: string;
  summary: string;
  tags: string[];
  score?: number;
};

async function generateWithGPT(input: string, top: IndexedItem[], quick: string | null) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const context = top.length
    ? top
        .map(
          (item, idx) =>
            `${idx + 1}. [${item.type.toUpperCase()}] ${item.title}\nSummary: ${item.summary}\nTags: ${item.tags.join(", ")}`,
        )
        .join("\n\n")
    : "No indexed items matched strongly.";

  const faqHint = quick ? `Relevant predefined answer:\n${quick}` : "No predefined FAQ match.";

  const systemPrompt = [
    "You are DOT, the BL4CKDOT AI assistant.",
    "Answer with a precise, helpful tone in plain text.",
    "Use the BL4CKDOT context below as ground truth when relevant.",
    "If context is limited, be transparent and suggest next page/action.",
    "Keep replies concise and practical.",
  ].join(" ");

  const userPrompt = [
    `User question: ${input}`,
    "",
    "BL4CKDOT context:",
    context,
    "",
    "FAQ hint:",
    faqHint,
  ].join("\n");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`GPT request failed (${response.status}): ${details.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = json.choices?.[0]?.message?.content?.trim();
  return content || null;
}

async function generateWithGemini(input: string, top: IndexedItem[], quick: string | null) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const context = top.length
    ? top
        .map(
          (item, idx) =>
            `${idx + 1}. [${item.type.toUpperCase()}] ${item.title}\nSummary: ${item.summary}\nTags: ${item.tags.join(", ")}`,
        )
        .join("\n\n")
    : "No indexed items matched strongly.";

  const faqHint = quick ? `Relevant predefined answer:\n${quick}` : "No predefined FAQ match.";
  const prompt = [
    "You are DOT, the BL4CKDOT AI assistant.",
    "Answer with a precise, helpful tone in plain text.",
    "Use the BL4CKDOT context below as ground truth when relevant.",
    "If context is limited, be transparent and suggest next page/action.",
    "Keep replies concise and practical.",
    "",
    `User question: ${input}`,
    "",
    "BL4CKDOT context:",
    context,
    "",
    "FAQ hint:",
    faqHint,
  ].join("\n");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
        },
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${details.slice(0, 300)}`);
  }

  const json = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const content = json.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n").trim();
  return content || null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const input = (body.message || "").trim();

  if (!input) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const quick = faqReply(input);

  let top: IndexedItem[] = [];
  try {
    await connectDB();
    const [projects, research, innovations] = await Promise.all([
      Project.find().limit(60),
      Research.find().limit(60),
      InnovationSubmission.find().limit(60),
    ]);

    const indexed: IndexedItem[] = [
      ...projects.map((p: { _id: string; name: string; description: string; tech_stack?: string[] }) => ({ id: String(p._id), type: "project" as const, title: p.name, summary: p.description, tags: p.tech_stack || [] })),
      ...research.map((r: { _id: string; title: string; abstract: string; domain: string }) => ({ id: String(r._id), type: "research" as const, title: r.title, summary: r.abstract, tags: [r.domain] })),
      ...innovations.map((i: { _id: string; title: string; description: string; technology_stack?: string[]; category?: string }) => ({ id: String(i._id), type: "innovation" as const, title: i.title, summary: i.description, tags: i.technology_stack || [i.category || "innovation"] })),
    ];

    top = scoreItems(input, indexed).slice(0, 3);
  } catch (error) {
    console.error("/api/dot DB context error:", error);
  }

  try {
    const aiMessage = await generateWithGPT(input, top, quick);
    if (aiMessage) {
      return NextResponse.json({
        message: aiMessage,
        results: top,
        source: "gpt-api",
      });
    }
  } catch (error) {
    console.error("/api/dot GPT error:", error);
  }

  try {
    const geminiMessage = await generateWithGemini(input, top, quick);
    if (geminiMessage) {
      return NextResponse.json({
        message: geminiMessage,
        results: top,
        source: "gemini-api",
      });
    }
  } catch (error) {
    console.error("/api/dot Gemini error:", error);
  }

  let message = quick || "I searched our internal innovation data for that request.";
  if (top.length > 0) {
    message += "\n\nRelevant results:\n";
    top.forEach((item, idx) => {
      message += `${idx + 1}. [${item.type.toUpperCase()}] ${item.title}\n`;
    });
  }

  return NextResponse.json({ message, results: top, source: "fallback" });
}
