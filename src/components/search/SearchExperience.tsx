"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { AlertCircle, SlidersHorizontal } from "lucide-react";
import type { ParsedCriteria, Recommendation, SearchResult } from "@/lib/types";
import { fetchSearchByCriteria } from "@/lib/api-client";
import { CriteriaSummary } from "@/components/search/CriteriaSummary";
import {
  FilterSidebar,
  DEFAULT_FILTERS,
  type FilterState,
} from "@/components/search/FilterSidebar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ComparisonDrawer } from "@/components/compare/ComparisonDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatNumber } from "@/lib/i18n/format";
import { addHistoryEntry, loadHistory } from "@/lib/searchHistory";
import { PARTNER_STORE_COUNT } from "@/lib/constants";

function ResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-4"
        >
          <Skeleton className="h-44 w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-16 w-full" />
        </div>
      ))}
    </div>
  );
}

function applyFilters(
  recommendations: Recommendation[],
  filters: FilterState
): Recommendation[] {
  let list = recommendations;

  if (filters.maxPrice !== null) {
    list = list.filter((r) => r.product.price <= filters.maxPrice!);
  }
  if (filters.brands.length > 0) {
    list = list.filter((r) => filters.brands.includes(r.product.brand));
  }
  if (filters.minRating > 0) {
    list = list.filter((r) => r.product.rating >= filters.minRating);
  }
  if (filters.inStockOnly) {
    list = list.filter((r) => r.product.availability !== "out-of-stock");
  }

  const sorted = [...list];
  switch (filters.sort) {
    case "price-asc":
      sorted.sort((a, b) => a.product.price - b.product.price);
      break;
    case "price-desc":
      sorted.sort((a, b) => b.product.price - a.product.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.product.rating - a.product.rating);
      break;
    default:
      sorted.sort((a, b) => b.matchScore - a.matchScore);
  }

  return sorted;
}

export function SearchExperience({
  originalQuery,
  initialResult,
  locale,
}: {
  originalQuery: string;
  initialResult: SearchResult;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const [criteria, setCriteria] = useState<ParsedCriteria>(initialResult.criteria);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(
    initialResult.recommendations
  );
  const [alsoLike, setAlsoLike] = useState<Recommendation[]>(initialResult.alsoLike);
  const [consideredCount, setConsideredCount] = useState(initialResult.consideredCount);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    // Records this as a "search you made" for when you come back to the
    // homepage later — a snapshot of the entry-point query, not every
    // refinement made afterwards.
    addHistoryEntry(loadHistory(), {
      query: originalQuery,
      criteria: initialResult.criteria,
      recommendations: initialResult.recommendations,
    });
  }, [originalQuery, initialResult]);

  function applyResult(result: SearchResult) {
    setCriteria(result.criteria);
    setRecommendations(result.recommendations);
    setAlsoLike(result.alsoLike);
    setConsideredCount(result.consideredCount);
    setFilters(DEFAULT_FILTERS);
    setSelectedIds((prev) =>
      prev.filter(
        (id) =>
          result.recommendations.some((r) => r.product.id === id) ||
          result.alsoLike.some((r) => r.product.id === id)
      )
    );
  }

  async function handleCriteriaChange(next: ParsedCriteria) {
    setLoading(true);
    setError(null);
    try {
      applyResult(await fetchSearchByCriteria(next));
    } catch {
      setError(dict.searchExperience.errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function toggleSelect(id: string, next: boolean) {
    setSelectedIds((prev) =>
      next ? [...prev, id] : prev.filter((existing) => existing !== id)
    );
  }

  const filteredRecommendations = useMemo(
    () => applyFilters(recommendations, filters),
    [recommendations, filters]
  );

  const selectedProducts = [...recommendations, ...alsoLike]
    .filter((r) => selectedIds.includes(r.product.id))
    .map((r) => r.product);

  return (
    <div className="flex flex-col gap-8 pb-24">
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="font-heading text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
          <Link href="/" className="transition-opacity hover:opacity-80">
            KORILO
          </Link>
        </h1>
        <p className="text-sm italic text-muted-foreground">
          {dict.searchExperience.recommendsSubtitle}
        </p>
        <p className="text-xs text-muted-foreground">
          {dict.searchExperience.searchStats(
            formatNumber(consideredCount, locale),
            formatNumber(PARTNER_STORE_COUNT, locale)
          )}
        </p>
      </div>

      <section className="flex flex-col gap-3 rounded-xl border border-border bg-secondary/40 p-4">
        <CriteriaSummary criteria={criteria} onChange={handleCriteriaChange} locale={locale} />
      </section>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => handleCriteriaChange(criteria)}
          >
            {dict.searchExperience.retry}
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {filtersOpen && (
          <aside className="lg:w-64 lg:shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={setFilters}
              recommendations={recommendations}
              locale={locale}
            />
          </aside>
        )}

        <section className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => setFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal className="size-4" aria-hidden="true" />
              {filtersOpen ? dict.filters.hideFilters : dict.filters.showFilters}
            </Button>
          </div>

          {loading ? (
            <ResultsSkeleton />
          ) : filteredRecommendations.length > 0 ? (
            <ProductGrid
              recommendations={filteredRecommendations}
              criteria={criteria}
              locale={locale}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
            />
          ) : (
            <div className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
              {recommendations.length > 0
                ? dict.filters.noResults
                : dict.searchExperience.noResults}
            </div>
          )}
        </section>
      </div>

      {!loading && alsoLike.length > 0 && (
        <section className="flex flex-col gap-4 border-t border-border pt-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">{dict.searchExperience.alsoLikeTitle}</h2>
            <p className="text-sm text-muted-foreground">
              {dict.searchExperience.alsoLikeSubtitle}
            </p>
          </div>
          <ProductGrid
            recommendations={alsoLike}
            criteria={criteria}
            locale={locale}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            compact
          />
        </section>
      )}

      <ComparisonDrawer
        products={selectedProducts}
        criteria={criteria}
        locale={locale}
        onRemove={(id) => toggleSelect(id, false)}
        onClear={() => setSelectedIds([])}
      />
    </div>
  );
}
