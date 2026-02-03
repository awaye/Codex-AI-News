import { NextRequest, NextResponse } from "next/server";
import { ingestAllSources } from "@/lib/ingest";

export const runtime = "nodejs";
// Force dynamic rendering to prevent build-time errors
export const dynamic = "force-dynamic";

function authorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return true;
  }
  return request.headers.get("x-cron-secret") === secret;
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await ingestAllSources();
  return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
  return POST(request);
}
