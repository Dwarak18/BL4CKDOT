import { NextRequest, NextResponse } from "next/server";

/** Decode JWT payload without signature verification (Edge-safe).
 *  Full crypto verification happens inside each API route. */
function decodeJwt(token: string): { userId?: string; role?: string } | null {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padding = "=".repeat((4 - (base64.length % 4)) % 4);
    const padded = base64 + padding;
    const json = atob(padded);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return req.cookies.get("bl4ckdot_token")?.value ?? null;
}

const ROLE_ROUTES: Record<string, string[]> = {
  "/dashboard/student":   ["student"],
  "/dashboard/innovator": ["innovator"],
  "/dashboard/company":   ["company"],
  "/admin":               ["admin"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const allowedRoles = Object.entries(ROLE_ROUTES).find(([path]) =>
    pathname === path || pathname.startsWith(path + "/"),
  )?.[1];

  if (!allowedRoles) return NextResponse.next();

  const token = getToken(req);
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = decodeJwt(token);
  if (!payload?.role || !allowedRoles.includes(payload.role)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/student/:path*",
    "/dashboard/innovator/:path*",
    "/dashboard/company/:path*",
    "/admin/:path*",
  ],
};
