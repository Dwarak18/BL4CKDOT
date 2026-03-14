import { Schema, model, models } from "mongoose";

const TimelineEventSchema = new Schema(
  {
    year: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const TimelineEvent = models.TimelineEvent || model("TimelineEvent", TimelineEventSchema);
