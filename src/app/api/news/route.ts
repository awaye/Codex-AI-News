import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const scopeParam = request.nextUrl.searchParams.get("scope");
  const scope = scopeParam === "GLOBAL" ? "GLOBAL" : scopeParam === "AFRICA" ? "AFRICA" : null;

  if (!scope) {
    return NextResponse.json({ error: "scope must be AFRICA or GLOBAL" }, { status: 400 });
  }

  const items = await prisma.newsItem.findMany({
    where: {
      status: "APPROVED",
      scope
    },
    include: {
      source: true
    },
    orderBy: {
      publishedAt: "desc"
    },
    take: 100
  });

  return NextResponse.json({ items });
}
