import type {
  ParsedCriteria,
  Product,
  Recommendation,
  SearchRequest,
  SearchResult,
} from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import { parseQuery } from "@/lib/ai/parseQuery";
import { scoreProducts, selectCandidates } from "@/lib/ai/matchProducts";
import { buildRecommendation } from "@/lib/ai/explain";
import { getAllProducts, getProductsByCategory } from "@/lib/data";

const MAX_RECOMMENDATIONS = 6;
// Deliberately more than MAX_RECOMMENDATIONS so there's always plenty
// left to browse, even once someone's scrolled past the main matches.
const ALSO_LIKE_COUNT = 9;

// Scores and explains a fixed, explicit list of products against
// criteria — used by the comparison page, where the product set is the
// user's own selection rather than a fresh category search.
export function recommendForProducts(
  criteria: ParsedCriteria,
  products: Product[],
  locale: Locale
): Recommendation[] {
  const scored = scoreProducts(criteria, products);
  return scored.map((scoredProduct, index) =>
    buildRecommendation(scoredProduct, criteria, index === 0, locale)
  );
}

// Re-runs matching/explanation for an already-parsed criteria object,
// skipping the natural-language step entirely. Used both by a fresh
// search and by in-place criteria edits (e.g. removing a chip in
// CriteriaSummary) that don't involve any new free-text query.
export function matchForCriteria(
  criteria: ParsedCriteria,
  locale: Locale
): SearchResult {
  const candidateProducts = criteria.category
    ? getProductsByCategory(criteria.category)
    : getAllProducts();

  const scored = scoreProducts(criteria, candidateProducts);
  const selected = selectCandidates(scored, MAX_RECOMMENDATIONS);
  const selectedIds = new Set(selected.map((s) => s.product.id));

  const recommendations = selected.map((scoredProduct, index) =>
    buildRecommendation(scoredProduct, criteria, index === 0, locale)
  );

  // Broaden the pool beyond the matched category so there's always
  // plenty to browse, even when that category is thin on stock — the
  // next best-scoring products overall, not a great match individually,
  // but still worth a glance.
  const alsoLikePool = criteria.category
    ? scoreProducts(criteria, getAllProducts())
    : scored;
  const alsoLike = alsoLikePool
    .filter((s) => !selectedIds.has(s.product.id))
    .slice(0, ALSO_LIKE_COUNT)
    .map((scoredProduct) => buildRecommendation(scoredProduct, criteria, false, locale));

  return { criteria, recommendations, alsoLike, consideredCount: scored.length };
}

// Single entry point the API route calls for a natural-language query.
// Everything above this line in the module graph is mock/heuristic
// logic; everything below (the route handler) only ever talks to this
// function and matchForCriteria. Swapping in a real LLM later means
// reimplementing parseQuery/matchProducts/explain (or replacing this
// whole file with an API call) without touching the route or any UI.
export function runKoriloSearch(
  request: SearchRequest,
  locale: Locale
): SearchResult {
  const criteria: ParsedCriteria = parseQuery(
    request.query,
    request.previousCriteria ?? null,
    locale
  );

  return matchForCriteria(criteria, locale);
}
