import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest, getSessionCookieName } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  const admin = await getAdminFromRequest(token);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const action = body?.action === "APPROVE" || body?.action === "REJECT" ? body.action : null;
  const ids = Array.isArray(body?.ids)
    ? body.ids.map((value: unknown) => value?.toString()).filter(Boolean)
    : [];

  if (!action || ids.length === 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await prisma.newsItem.updateMany({
    where: { id: { in: ids } },
    data: { status: action === "APPROVE" ? "APPROVED" : "REJECTED" }
  });

  return NextResponse.json({ updatedCount: result.count });
}
