import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    tech_stack: [{ type: String }],
    team_members: [{ type: String }],
    status: { type: String, required: true },
    repository_link: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const Project = models.Project || model("Project", ProjectSchema);
