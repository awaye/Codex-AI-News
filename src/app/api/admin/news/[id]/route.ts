import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest, getSessionCookieName } from "@/lib/auth";
import { parseTags, normalizeText } from "@/lib/utils";

async function requireAdmin(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  const admin = await getAdminFromRequest(token);
  if (!admin) {
    return null;
  }
  return admin;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const summary = typeof body.summary === "string" ? normalizeText(body.summary) : undefined;
  const tags = typeof body.tags === "string" ? parseTags(body.tags) : Array.isArray(body.tags) ? body.tags : undefined;
  const country = typeof body.country === "string" ? normalizeText(body.country) : undefined;
  const scope = body.scope === "AFRICA" || body.scope === "GLOBAL" ? body.scope : undefined;

  const updated = await prisma.newsItem.update({
    where: { id: params.id },
    data: {
      ...(summary !== undefined ? { summary: summary || null } : {}),
      ...(tags !== undefined ? { tags } : {}),
      ...(country !== undefined ? { country: country || null } : {}),
      ...(scope ? { scope } : {})
    }
  });

  return NextResponse.json({ item: updated });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const summary = normalizeText(formData.get("summary")?.toString());
  const tags = parseTags(formData.get("tags")?.toString());
  const country = normalizeText(formData.get("country")?.toString());
  const scope = formData.get("scope")?.toString();

  await prisma.newsItem.update({
    where: { id: params.id },
    data: {
      summary: summary || null,
      tags,
      country: country || null,
      scope: scope === "GLOBAL" ? "GLOBAL" : "AFRICA"
    }
  });

  return NextResponse.redirect(new URL(`/admin/news/${params.id}`, request.url));
}
