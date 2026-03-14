import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export type UserRole = "student" | "innovator" | "company" | "admin";

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  name: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_only_change_me";

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function getAuthFromRequest(req: NextRequest): JwtPayload | null {
  const authHeader = req.headers.get("authorization") || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  const cookieToken = req.cookies.get("bl4ckdot_token")?.value;
  const token = bearer || cookieToken;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export function hasRole(user: JwtPayload | null, allowed: UserRole[]) {
  if (!user) return false;
  return allowed.includes(user.role);
}
