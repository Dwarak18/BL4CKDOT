import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { isValidEmail, isStrongPassword, isLongEnough } from "@/lib/validators";
import { User } from "@/models/User";
import { InnovatorProfile } from "@/models/InnovatorProfile";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const {
      name, email, password, location, startupName,
      problem, solution, technologyDomain, stage,
      supportNeeded = [],
    } = body;

    if (!name || !email || !password || !location || !startupName || !problem || !solution || !technologyDomain || !stage) {
      return NextResponse.json({ error: "All required fields must be filled" }, { status: 400 });
    }
    if (!isValidEmail(email)) return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    if (!isStrongPassword(password)) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    if (!isLongEnough(problem)) return NextResponse.json({ error: "Problem statement must be at least 50 characters" }, { status: 400 });
    if (!isLongEnough(solution)) return NextResponse.json({ error: "Solution must be at least 50 characters" }, { status: 400 });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name: name.trim(), email: email.toLowerCase().trim(), password: hashedPassword, role: "innovator" });

    await InnovatorProfile.create({
      userId: user._id,
      startupName: startupName.trim(),
      location: location.trim(),
      problem: problem.trim(),
      solution: solution.trim(),
      technologyDomain,
      stage,
      supportNeeded: Array.isArray(supportNeeded) ? supportNeeded : [],
    });

    const token = signToken({ userId: String(user._id), email: user.email, role: "innovator", name: user.name });

    const res = NextResponse.json(
      { token, user: { id: user._id, name: user.name, email: user.email, role: "innovator" } },
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
    console.error("/api/register/innovator error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
