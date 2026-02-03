import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminFromRequest, getSessionCookieName } from "@/lib/auth";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  const admin = await getAdminFromRequest(token);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.newsItem.update({
    where: { id: params.id },
    data: { status: "APPROVED" }
  });

  return NextResponse.redirect(new URL("/admin/news", request.url));
}
