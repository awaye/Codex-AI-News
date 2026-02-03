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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = typeof body.name === "string" ? normalizeText(body.name) : undefined;
  const feedUrl = typeof body.feedUrl === "string" ? normalizeText(body.feedUrl) : undefined;
  const scope = body.scope === "GLOBAL" || body.scope === "AFRICA" ? body.scope : undefined;
  const tags = typeof body.tags === "string" ? parseTags(body.tags) : Array.isArray(body.tags) ? body.tags : undefined;
  const active = typeof body.active === "boolean" ? body.active : undefined;

  const updated = await prisma.source.update({
    where: { id: params.id },
    data: {
      ...(name ? { name } : {}),
      ...(feedUrl ? { feedUrl } : {}),
      ...(scope ? { scope } : {}),
      ...(tags ? { tags } : {}),
      ...(active !== undefined ? { active } : {})
    }
  });

  return NextResponse.json({ source: updated });
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

  await prisma.source.update({
    where: { id: params.id },
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
