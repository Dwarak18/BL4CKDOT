import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { isValidEmail, isLongEnough } from "@/lib/validators";
import { User } from "@/models/User";
import { CompanyProfile } from "@/models/CompanyProfile";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      companyName, website, industry, contactPerson, contactEmail,
      contactPhone, projectDescription, technologyInterest = [],
      budgetRange, partnershipType,
    } = body;

    if (!companyName || !industry || !contactPerson || !contactEmail || !projectDescription || !budgetRange || !partnershipType) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }
    if (!isValidEmail(contactEmail)) return NextResponse.json({ error: "Invalid contact email format" }, { status: 400 });
    if (!isLongEnough(projectDescription)) return NextResponse.json({ error: "Project description must be at least 50 characters" }, { status: 400 });

    const normalizedEmail = contactEmail.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    // Companies don't set a password in the form — generate a secure temp password
    const tempPassword = randomBytes(20).toString("hex");
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const user = await User.create({
      name: contactPerson.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "company",
    });

    await CompanyProfile.create({
      userId: user._id,
      companyName: companyName.trim(),
      website: website?.trim() ?? "",
      industry: industry.trim(),
      contactPerson: contactPerson.trim(),
      contactEmail: normalizedEmail,
      contactPhone: contactPhone?.trim() ?? "",
      projectDescription: projectDescription.trim(),
      technologyInterest: Array.isArray(technologyInterest) ? technologyInterest : [],
      budgetRange,
      partnershipType,
    });

    const token = signToken({ userId: String(user._id), email: user.email, role: "company", name: user.name });

    const res = NextResponse.json(
      {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: "company" },
        tempPassword, // returned once so the company can set a real password later
      },
      { status: 201 },
    );

    res.cookies.set("bl4ckdot_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    console.error("/api/register/company error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
