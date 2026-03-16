import { Schema, model, models, Types } from "mongoose";

const StudentProfileSchema = new Schema(
  {
    userId:     { type: Types.ObjectId, ref: "User", required: true, unique: true },
    university: { type: String, required: true },
    degree:     { type: String, required: true },
    year: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"],
      required: true,
    },
    domain: {
      type: String,
      enum: ["AI Engineering", "Cybersecurity", "IoT Development", "Full Stack Development"],
      required: true,
    },
    skills:     [{ type: String }],
    portfolio:  { type: String },
    resume:     { type: String },
    motivation: { type: String, required: true, minlength: 50 },
  },
  { timestamps: true },
);

export const StudentProfile =
  models.StudentProfile || model("StudentProfile", StudentProfileSchema);
