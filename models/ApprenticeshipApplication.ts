import { Schema, model, models } from "mongoose";

const ApprenticeshipApplicationSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    track: {
      type: String,
      enum: ["AI", "IoT", "cybersecurity", "fullstack"],
      required: true,
    },
    resume_link: { type: String, required: true },
    motivation: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: { createdAt: "submitted_at", updatedAt: "updated_at" } },
);

export const ApprenticeshipApplication =
  models.ApprenticeshipApplication || model("ApprenticeshipApplication", ApprenticeshipApplicationSchema);
