import type { ParsedCriteria } from "@/lib/types";

// Criteria travels between pages (search -> compare, search -> product
// detail) as a compact JSON query param, so those pages can recompute a
// Korilo match/explanation for products the user already saw scored
// once, without re-running the natural-language parser.

export function encodeCriteriaParam(criteria: ParsedCriteria): string {
  return encodeURIComponent(JSON.stringify(criteria));
}

export function parseCriteriaParam(raw: string | undefined): ParsedCriteria | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      Array.isArray(parsed.requirements) &&
      Array.isArray(parsed.preferences) &&
      Array.isArray(parsed.useCases) &&
      Array.isArray(parsed.lowPriorities)
    ) {
      return parsed as ParsedCriteria;
    }
  } catch {
    // Ignore malformed/tampered criteria params.
  }
  return null;
}
