import { TimelineEvent } from "@/models/TimelineEvent";

export async function ensureTimelineSeed() {
  const count = await TimelineEvent.countDocuments();
  if (count > 0) return;

  await TimelineEvent.insertMany([
    {
      year: 2026,
      title: "BL4CKDOT founded",
      description: "BL4CKDOT founded as a student innovation initiative.",
    },
    {
      year: 2027,
      title: "Innovation lab launch",
      description: "Launch of innovation lab platform.",
    },
    {
      year: 2028,
      title: "First AI and IoT prototypes",
      description: "First AI and IoT prototype released.",
    },
    {
      year: 2029,
      title: "Research partnerships",
      description: "Partnerships with research organizations.",
    },
    {
      year: 2030,
      title: "Incubation expansion",
      description: "Expansion into full-scale technology incubation platform.",
    },
  ]);
}
