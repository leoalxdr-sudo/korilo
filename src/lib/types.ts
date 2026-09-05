// Core domain types for Korilo. Kept independent of any UI or mock-data
// concerns so the product/AI layers can later be swapped for real
// retailer APIs and a real LLM without touching these shapes.

import type { Locale } from "@/lib/i18n/locale";

export type ProductCategory =
  | "laptop"
  | "headphones"
  | "smartphone"
  | "running-shoes"
  | "office-chairs"
  | "coffee-makers"
  | "backpacks"
  | "hair-dryers";

export interface Retailer {
  id: string;
  name: string;
  logo?: string;
}

export interface Specification {
  /** Key into lib/data/specLabels.ts, e.g. "ram", "batteryLife". */
  labelKey: string;
  value: Record<Locale, string>;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  /** Local placeholder illustration key, e.g. "laptop-silver". */
  image: string;
  price: number;
  currency: "EUR";
  retailer: Retailer;
  /** Direct link to the product on the retailer's site. */
  productUrl: string;
  /** Affiliate-wrapped link, used in place of productUrl once available. */
  affiliateUrl?: string;
  specifications: Specification[];
  rating: number;
  reviewCount: number;
  availability: "in-stock" | "limited" | "out-of-stock";
  description: Record<Locale, string>;
  /** Feature/attribute keywords used by the matching engine. */
  tags: string[];
}

export interface Budget {
  max: number;
  currency: "EUR";
}

export interface SearchRequest {
  query: string;
  /** Present when refining an existing search rather than starting fresh. */
  previousCriteria?: ParsedCriteria;
}

export interface ParsedCriteria {
  category: ProductCategory | null;
  budget: Budget | null;
  /** Hard constraints — a product that fails these shouldn't be recommended. */
  requirements: string[];
  /** Nice-to-haves that boost match score but aren't disqualifying. */
  preferences: string[];
  useCases: string[];
  /** Things the user explicitly said they don't care about. */
  lowPriorities: string[];
}

export type UserPreferences = ParsedCriteria;

export interface MatchFactor {
  label: string;
  detail: string;
  impact: "positive" | "negative" | "neutral";
}

export interface Recommendation {
  product: Product;
  matchScore: number;
  headline: string;
  reasoning: string;
  factors: MatchFactor[];
  pros: string[];
  cons: string[];
  /** Explicit hard requirements this product fails to meet, if any —
   * shown as a prominent warning rather than buried in cons, so a good
   * price never quietly outweighs something the user said was a must. */
  dealBreakers: string[];
  isBestMatch: boolean;
}

export interface SearchResult {
  criteria: ParsedCriteria;
  recommendations: Recommendation[];
  /** Lower-scoring products just outside the main cut, still worth a look. */
  alsoLike: Recommendation[];
  /** How many catalog products were actually scored for this search. */
  consideredCount: number;
}

export interface ComparisonRow {
  label: string;
  values: string[];
}
