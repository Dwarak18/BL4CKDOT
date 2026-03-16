import { Schema, model, models, Types } from "mongoose";

const CompanyProfileSchema = new Schema(
  {
    userId:             { type: Types.ObjectId, ref: "User", required: true, unique: true },
    companyName:        { type: String, required: true },
    website:            { type: String },
    industry:           { type: String, required: true },
    contactPerson:      { type: String, required: true },
    contactEmail:       { type: String, required: true },
    contactPhone:       { type: String },
    projectDescription: { type: String, required: true, minlength: 50 },
    technologyInterest: [{ type: String }],
    budgetRange: {
      type: String,
      enum: ["Under $5k", "$5k–$20k", "$20k–$100k", "Enterprise"],
      required: true,
    },
    partnershipType: {
      type: String,
      enum: ["Research Collaboration", "Prototype Development", "Full Product Engineering"],
      required: true,
    },
  },
  { timestamps: true },
);

export const CompanyProfile =
  models.CompanyProfile || model("CompanyProfile", CompanyProfileSchema);
