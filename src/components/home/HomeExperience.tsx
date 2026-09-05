"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ParsedCriteria, Product, Recommendation } from "@/lib/types";
import { SearchModeSwitcher } from "@/components/home/SearchModeSwitcher";
import { ExamplePrompt } from "@/components/home/ExamplePrompt";
import { ProductPreview } from "@/components/home/ProductPreview";
import { HistoryEntryRow } from "@/components/home/HistoryEntryRow";
import { ProductRowCardPlain } from "@/components/product/ProductRowCardPlain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  clearHistory,
  loadHistory,
  removeHistoryEntry,
  type HistoryEntry,
} from "@/lib/searchHistory";
import { loadRecentlyViewed } from "@/lib/recentlyViewed";
import { getProductById } from "@/lib/data";
import { encodeCriteriaParam } from "@/lib/criteriaParam";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export function HomeExperience({
  locale,
  previewCriteria,
  previewRecommendations,
  trendingProducts,
}: {
  locale: Locale;
  previewCriteria: ParsedCriteria;
  previewRecommendations: Recommendation[];
  trendingProducts: Product[];
}) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    // localStorage isn't available during SSR, so history has to start
    // empty and hydrate client-side after mount — reading it during
    // render would desync from the server-rendered HTML. This also means
    // the compact history rows only ever appear once someone is back on
    // the homepage after a search, never as a live replacement for the
    // one they're about to make.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory());
    setRecentlyViewed(
      loadRecentlyViewed()
        .map((id) => getProductById(id))
        .filter((p): p is Product => Boolean(p))
    );
  }, []);

  function goToSearch(query: string) {
    setNavigating(true);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  function goToGuidedSearch(criteria: ParsedCriteria) {
    setNavigating(true);
    router.push(`/search?c=${encodeCriteriaParam(criteria)}`);
  }

  function renderHistory() {
    if (history.length === 0) {
      return (
        <ProductPreview
          criteria={previewCriteria}
          recommendations={previewRecommendations}
          locale={locale}
        />
      );
    }

    return (
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{dict.history.title}</h2>
          <button
            type="button"
            onClick={() => setHistory(clearHistory())}
            className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {dict.history.clearAll}
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {history.map((entry) => (
            <HistoryEntryRow
              key={entry.id}
              entry={entry}
              locale={locale}
              onRemove={(id) => setHistory((prev) => removeHistoryEntry(prev, id))}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {dict.hero.title}
        </h1>
        <p className="text-balance text-lg text-muted-foreground sm:text-xl">
          {dict.hero.subtitle}
        </p>
      </div>

      <div className="w-full max-w-2xl">
        <SearchModeSwitcher
          locale={locale}
          loading={navigating}
          onSubmitQuery={goToSearch}
          onSubmitCriteria={goToGuidedSearch}
        />
      </div>

      {history.length === 0 && (
        <ExamplePrompt locale={locale} disabled={navigating} onSelect={goToSearch} />
      )}

      {trendingProducts.length > 0 && (
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-lg font-semibold">{dict.trending.title}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {trendingProducts.map((product) => (
              <ProductRowCardPlain key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </div>
      )}

      {/* Découvrir/example illustration for a first-time visitor, replaced
          by their own search history once they've been back after
          searching at least once. */}
      <div id="recommendations-preview" className="w-full scroll-mt-20 pt-8">
        {recentlyViewed.length > 0 ? (
          <Tabs defaultValue="history" className="w-full">
            <TabsList variant="line">
              <TabsTrigger value="history">{dict.history.title}</TabsTrigger>
              <TabsTrigger value="recent">{dict.recentlyViewed.title}</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-4">
              {renderHistory()}
            </TabsContent>

            <TabsContent value="recent" className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {recentlyViewed.map((product) => (
                <ProductRowCardPlain key={product.id} product={product} locale={locale} />
              ))}
            </TabsContent>
          </Tabs>
        ) : (
          renderHistory()
        )}
      </div>
    </section>
  );
}
