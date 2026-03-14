import { Schema, model, models } from "mongoose";

const ResearchSchema = new Schema(
  {
    title: { type: String, required: true },
    abstract: { type: String, required: true },
    domain: { type: String, required: true },
    publication_link: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const Research = models.Research || model("Research", ResearchSchema);
