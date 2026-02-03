import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest, getSessionCookieName } from "@/lib/auth";
import { parseTags, normalizeText } from "@/lib/utils";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  return getAdminFromRequest(token);
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sources = await prisma.source.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ sources });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const name = normalizeText(formData.get("name")?.toString());
  const feedUrl = normalizeText(formData.get("feedUrl")?.toString());
  const scope = formData.get("scope")?.toString() === "GLOBAL" ? "GLOBAL" : "AFRICA";
  const tags = parseTags(formData.get("tags")?.toString());
  const active = formData.get("active") === "on";

  if (!name || !feedUrl) {
    return NextResponse.redirect(new URL("/admin/sources", request.url));
  }

  await prisma.source.create({
    data: {
      name,
      feedUrl,
      scope,
      tags,
      active
    }
  });

  return NextResponse.redirect(new URL("/admin/sources", request.url));
}
