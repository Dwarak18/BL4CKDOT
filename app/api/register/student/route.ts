import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { isValidEmail, isStrongPassword, isLongEnough, isPdfFile } from "@/lib/validators";
import { User } from "@/models/User";
import { StudentProfile } from "@/models/StudentProfile";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name       = formData.get("name")?.toString().trim() ?? "";
    const email      = formData.get("email")?.toString().toLowerCase().trim() ?? "";
    const password   = formData.get("password")?.toString() ?? "";
    const university = formData.get("university")?.toString().trim() ?? "";
    const degree     = formData.get("degree")?.toString().trim() ?? "";
    const year       = formData.get("year")?.toString() ?? "";
    const domain     = formData.get("domain")?.toString() ?? "";
    const skillsRaw  = formData.get("skills")?.toString() ?? "[]";
    const portfolio  = formData.get("portfolio")?.toString().trim() ?? "";
    const motivation = formData.get("motivation")?.toString().trim() ?? "";
    const resumeFile = formData.get("resume") as File | null;

    // Validate required
    if (!name || !email || !password || !university || !degree || !year || !domain || !motivation) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }
    if (!isValidEmail(email)) return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    if (!isStrongPassword(password)) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    if (!isLongEnough(motivation)) return NextResponse.json({ error: "Motivation must be at least 50 characters" }, { status: 400 });
    if (resumeFile && !isPdfFile(resumeFile.name)) {
      return NextResponse.json({ error: "Resume must be a PDF file" }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    let skills: string[] = [];
    try { skills = JSON.parse(skillsRaw); } catch { /* ignore */ }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword, role: "student" });

    // Resume: store filename (S3/Cloudinary upload would replace this)
    const resumePath = resumeFile ? `uploads/resumes/${(user._id as string).toString()}_${resumeFile.name}` : "";

    await StudentProfile.create({
      userId: user._id,
      university,
      degree,
      year,
      domain,
      skills,
      portfolio,
      resume: resumePath,
      motivation,
    });

    const token = signToken({ userId: String(user._id), email: user.email, role: "student", name: user.name });

    const res = NextResponse.json(
      { token, user: { id: user._id, name: user.name, email: user.email, role: "student" } },
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
    console.error("/api/register/student error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
