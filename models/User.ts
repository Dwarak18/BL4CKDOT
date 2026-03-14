import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "innovator", "company", "admin"],
      default: "student",
      required: true,
    },
    skills: [{ type: String }],
    profileInfo: {
      bio: String,
      organization: String,
      portfolio: String,
      links: [String],
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

export const User = models.User || model("User", UserSchema);
