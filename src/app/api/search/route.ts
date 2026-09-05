import { NextResponse } from "next/server";
import type { ParsedCriteria, SearchRequest } from "@/lib/types";
import { runKoriloSearch, matchForCriteria } from "@/lib/ai";
import { localeFromAcceptLanguage } from "@/lib/i18n/locale";

interface CriteriaRequest {
  criteria: ParsedCriteria;
}

function isCriteriaRequest(body: unknown): body is CriteriaRequest {
  return (
    !!body &&
    typeof body === "object" &&
    "criteria" in body &&
    !!(body as CriteriaRequest).criteria
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // The browser sends Accept-Language on fetch() the same as on the
  // page load, so the language stays consistent without the client
  // needing to send it explicitly.
  const locale = localeFromAcceptLanguage(request.headers.get("accept-language"));

  // Editing a criteria chip re-scores directly, with no new free-text
  // query to parse.
  if (isCriteriaRequest(body)) {
    return NextResponse.json(matchForCriteria(body.criteria, locale));
  }

  const { query, previousCriteria } = body as SearchRequest;
  if (!query || typeof query !== "string" || !query.trim()) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const result = runKoriloSearch({ query, previousCriteria }, locale);
  return NextResponse.json(result);
}
