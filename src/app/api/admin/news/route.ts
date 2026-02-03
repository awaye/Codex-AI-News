import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest, getSessionCookieName } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  const admin = await getAdminFromRequest(token);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const scope = request.nextUrl.searchParams.get("scope");
  const sourceId = request.nextUrl.searchParams.get("sourceId");

  const items = await prisma.newsItem.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(scope ? { scope: scope as any } : {}),
      ...(sourceId ? { sourceId } : {})
    },
    include: { source: true },
    orderBy: { publishedAt: "desc" }
  });

  return NextResponse.json({ items });
}
