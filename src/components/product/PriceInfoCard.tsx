"use client";

import type { Product } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { PriceHistoryCard } from "@/components/product/PriceHistoryCard";
import { RealCostCard } from "@/components/product/RealCostCard";
import { PriceAlertWidget } from "@/components/product/PriceAlertWidget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// One card instead of three stacked ones — history, real cost, and the
// price alert are all "price" in different framings, so they share a
// tab strip rather than each claiming their own bordered box.
export function PriceInfoCard({ product, locale }: { product: Product; locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <Tabs defaultValue="history" className="w-full">
        <TabsList variant="line">
          <TabsTrigger value="history">{dict.productPage.priceHistoryTab}</TabsTrigger>
          <TabsTrigger value="realCost">{dict.productPage.realCostTab}</TabsTrigger>
          <TabsTrigger value="alert">{dict.productPage.priceAlertTab}</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-3">
          <PriceHistoryCard product={product} locale={locale} bare />
        </TabsContent>
        <TabsContent value="realCost" className="mt-3">
          <RealCostCard product={product} locale={locale} bare />
        </TabsContent>
        <TabsContent value="alert" className="mt-3">
          <PriceAlertWidget product={product} locale={locale} bare />
        </TabsContent>
      </Tabs>
    </div>
  );
}
