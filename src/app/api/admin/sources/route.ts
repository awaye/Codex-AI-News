import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest, getSessionCookieName } from "@/lib/auth";
import { parseTags, normalizeText } from "@/lib/utils";
import { buildGoogleNewsQuery, buildGoogleNewsUrl } from "@/lib/google-news";

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
  const type = formData.get("type")?.toString() === "GOOGLE_NEWS" ? "GOOGLE_NEWS" : "RSS";
  const query = normalizeText(formData.get("query")?.toString());
  const feedUrl =
    type === "GOOGLE_NEWS"
      ? buildGoogleNewsUrl(buildGoogleNewsQuery(query))
      : normalizeText(formData.get("feedUrl")?.toString());
  const scope = formData.get("scope")?.toString() === "GLOBAL" ? "GLOBAL" : "AFRICA";
  const tags = parseTags(formData.get("tags")?.toString());
  const active = formData.get("active") === "on";

  if (!name || (type === "RSS" && !feedUrl) || (type === "GOOGLE_NEWS" && !query)) {
    return NextResponse.redirect(new URL("/admin/sources", request.url));
  }

  await prisma.source.create({
    data: {
      name,
      feedUrl,
      type,
      query: type === "GOOGLE_NEWS" ? query : null,
      scope,
      tags,
      active
    }
  });

  return NextResponse.redirect(new URL("/admin/sources", request.url));
}
