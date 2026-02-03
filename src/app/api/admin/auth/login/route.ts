import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionCookieName, getSessionCookieOptions, signSession, verifyPassword } from "@/lib/auth";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }

  const token = signSession({ sub: user.id, role: "ADMIN" });
  const response = NextResponse.redirect(new URL("/admin/news", request.url));
  response.cookies.set(getSessionCookieName(), token, getSessionCookieOptions());
  return response;
}
