import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthFromRequest, hasRole } from "@/lib/auth";
import { User } from "@/models/User";
import { ApprenticeshipApplication } from "@/models/ApprenticeshipApplication";
import { InnovationSubmission } from "@/models/InnovationSubmission";
import { Project } from "@/models/Project";
import { Research } from "@/models/Research";
import { TimelineEvent } from "@/models/TimelineEvent";
import { ContactMessage } from "@/models/ContactMessage";

export async function GET(req: NextRequest) {
  const user = getAuthFromRequest(req);
  if (!hasRole(user, ["admin"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const [
    users,
    apprenticeship,
    innovations,
    projects,
    research,
    timeline,
    contacts,
  ] = await Promise.all([
    User.countDocuments(),
    ApprenticeshipApplication.find().sort({ submitted_at: -1 }).limit(20),
    InnovationSubmission.find().sort({ created_at: -1 }).limit(20),
    Project.find().sort({ created_at: -1 }).limit(20),
    Research.find().sort({ created_at: -1 }).limit(20),
    TimelineEvent.find().sort({ year: 1 }).limit(30),
    ContactMessage.find().sort({ submitted_at: -1 }).limit(20),
  ]);

  return NextResponse.json({
    summary: {
      users,
      apprenticeship: apprenticeship.length,
      innovations: innovations.length,
      projects: projects.length,
      research: research.length,
      timeline: timeline.length,
      contacts: contacts.length,
    },
    apprenticeship,
    innovations,
    projects,
    research,
    timeline,
    contacts,
  });
}

export async function PATCH(req: NextRequest) {
  const user = getAuthFromRequest(req);
  if (!hasRole(user, ["admin"])) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();
  const { type, id, status } = body;

  if (!type || !id || !status) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (type === "apprenticeship") {
    await ApprenticeshipApplication.findByIdAndUpdate(id, { status });
  } else if (type === "innovation") {
    await InnovationSubmission.findByIdAndUpdate(id, { status });
  } else {
    return NextResponse.json({ error: "Unsupported type" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
