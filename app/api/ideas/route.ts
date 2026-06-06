import { NextRequest, NextResponse } from "next/server";
import { getAllIdeas } from "@/lib/data";
import { queryIdeas } from "@/lib/ideas";
import { ALL_TOPICS, DEFAULT_BUCKET } from "@/lib/topics";

// Random selection per request — never cache.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const topic = sp.get("topic") ?? ALL_TOPICS;
  const time = sp.get("time") ?? DEFAULT_BUCKET;
  const result = queryIdeas(await getAllIdeas(), topic, time, 3);
  return NextResponse.json(result);
}
