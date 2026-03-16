import { Schema, model, models, Types } from "mongoose";

const InnovatorProfileSchema = new Schema(
  {
    userId:           { type: Types.ObjectId, ref: "User", required: true, unique: true },
    startupName:      { type: String, required: true },
    location:         { type: String, required: true },
    problem:          { type: String, required: true, minlength: 50 },
    solution:         { type: String, required: true, minlength: 50 },
    technologyDomain: {
      type: String,
      enum: ["AI", "IoT", "Cybersecurity", "Software Platform", "Other"],
      required: true,
    },
    stage: {
      type: String,
      enum: ["Idea", "Prototype", "MVP", "Existing Product"],
      required: true,
    },
    supportNeeded: [{ type: String }],
  },
  { timestamps: true },
);

export const InnovatorProfile =
  models.InnovatorProfile || model("InnovatorProfile", InnovatorProfileSchema);
