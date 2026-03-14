import { Schema, model, models } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: "submitted_at", updatedAt: "updated_at" } },
);

export const ContactMessage = models.ContactMessage || model("ContactMessage", ContactMessageSchema);
