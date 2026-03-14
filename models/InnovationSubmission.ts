import { Schema, model, models } from "mongoose";

const InnovationSubmissionSchema = new Schema(
  {
    submission_type: {
      type: String,
      enum: ["student", "innovator", "company"],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["AI", "IoT", "security", "software"],
      required: true,
    },
    submitted_by: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      organization: String,
      contact_person: String,
    },
    target_users: {
      type: String,
      enum: ["students", "innovators", "companies"],
      required: true,
    },
    technology_stack: [{ type: String }],
    status: {
      type: String,
      enum: ["idea", "review", "prototype", "development"],
      default: "idea",
      required: true,
    },
    details: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const InnovationSubmission =
  models.InnovationSubmission || model("InnovationSubmission", InnovationSubmissionSchema);
