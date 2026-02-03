import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

const SESSION_COOKIE = "ai_news_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type SessionPayload = {
  sub: string;
  role: "ADMIN";
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export { hashPassword, verifyPassword };

export function signSession(payload: SessionPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as SessionPayload;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) {
    redirect("/admin/login");
  }

  const payload = verifySession(token);
  if (!payload) {
    redirect("/admin/login");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return user;
}

export async function getAdminFromRequest(token: string | undefined) {
  if (!token) {
    return null;
  }
  const payload = verifySession(token);
  if (!payload) {
    return null;
  }
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE
  };
}
