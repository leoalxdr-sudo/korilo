import type { ParsedCriteria, Product } from "@/lib/types";
import { RAM_REQUIREMENT_PATTERN, USE_CASE_RELEVANT_TAGS } from "@/lib/ai/keywords";

function getSpecNumber(product: Product, labelKey: string): number | null {
  const spec = product.specifications.find((s) => s.labelKey === labelKey);
  if (!spec) return null;
  // Values are locale-keyed but the leading number is identical in both
  // (e.g. "16GB" / "16 Go"), so either locale's string works here.
  const match = spec.value.en.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export function meetsRequirement(product: Product, requirement: string): boolean {
  const ramMatch = requirement.match(RAM_REQUIREMENT_PATTERN);
  if (ramMatch) {
    const needed = parseInt(ramMatch[1], 10);
    const actual = getSpecNumber(product, "ram");
    return actual !== null && actual >= needed;
  }
  return product.tags.includes(requirement);
}

export interface ScoredProduct {
  product: Product;
  score: number;
  matchedRequirements: string[];
  unmetRequirements: string[];
  matchedPreferences: string[];
  unmatchedPreferences: string[];
  matchedUseCases: string[];
  budgetFit: "under" | "at-ceiling" | "over" | "unknown";
}

// Deterministic weighted scoring, standing in for an LLM's judgement.
// Weights sum to 100: budget 25, requirements 25, preferences 25,
// use cases 15, rating 10. This is a Korilo compatibility score, not a
// scientific measurement — see MatchScore's tooltip copy in the UI.
function scoreProduct(product: Product, criteria: ParsedCriteria): ScoredProduct {
  let score = 0;

  let budgetFit: ScoredProduct["budgetFit"] = "unknown";
  if (criteria.budget) {
    const ratio = product.price / criteria.budget.max;
    if (ratio <= 1) {
      budgetFit = ratio >= 0.85 ? "at-ceiling" : "under";
      score += 25;
    } else {
      budgetFit = "over";
      score += Math.max(0, 25 - (ratio - 1) * 100);
    }
  } else {
    score += 20;
  }

  const matchedRequirements: string[] = [];
  const unmetRequirements: string[] = [];
  for (const req of criteria.requirements) {
    if (meetsRequirement(product, req)) matchedRequirements.push(req);
    else unmetRequirements.push(req);
  }
  score +=
    criteria.requirements.length > 0
      ? (matchedRequirements.length / criteria.requirements.length) * 25
      : 25;

  const matchedPreferences = criteria.preferences.filter((p) =>
    product.tags.includes(p)
  );
  const unmatchedPreferences = criteria.preferences.filter(
    (p) => !product.tags.includes(p)
  );
  score +=
    criteria.preferences.length > 0
      ? (matchedPreferences.length / criteria.preferences.length) * 25
      : 18;

  const matchedUseCases = criteria.useCases.filter((useCase) => {
    const relevant = USE_CASE_RELEVANT_TAGS[useCase] ?? [];
    return (
      relevant.some((tag) => product.tags.includes(tag)) ||
      product.tags.includes(useCase)
    );
  });
  score +=
    criteria.useCases.length > 0
      ? (matchedUseCases.length / criteria.useCases.length) * 15
      : 10;

  const ratingScore = Math.max(
    0,
    Math.min(10, ((product.rating - 3.5) / 1.5) * 10)
  );
  score += ratingScore;

  return {
    product,
    score: Math.round(Math.max(0, Math.min(100, score))),
    matchedRequirements,
    unmetRequirements,
    matchedPreferences,
    unmatchedPreferences,
    matchedUseCases,
    budgetFit,
  };
}

export function scoreProducts(
  criteria: ParsedCriteria,
  products: Product[]
): ScoredProduct[] {
  return products
    .map((product) => scoreProduct(product, criteria))
    .sort((a, b) => b.score - a.score);
}

// Prefer products that strictly satisfy hard requirements and stay near
// budget; fall back to the full, score-ranked list if that's too strict
// to return anything (better an imperfect answer than an empty page).
export function selectCandidates(
  scored: ScoredProduct[],
  limit: number
): ScoredProduct[] {
  const strict = scored.filter(
    (s) => s.unmetRequirements.length === 0 && s.budgetFit !== "over"
  );
  const pool = strict.length > 0 ? strict : scored;
  return pool.slice(0, limit);
}
