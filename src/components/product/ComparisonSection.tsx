"use client";

import type { ParsedCriteria, Product } from "@/lib/types";
import type { ValueAlternative } from "@/lib/ai/valueComparison";
import type { OtherOffer } from "@/lib/data/otherOffers";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { ValueComparison } from "@/components/product/ValueComparison";
import { OtherOffersList } from "@/components/product/OtherOffersList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// "Other products worth considering" and "same product, other stores"
// are both answers to "should I look elsewhere before buying this?" —
// one section with two tabs instead of two separate ones.
export function ComparisonSection({
  product,
  bestValue,
  worthMore,
  otherOffers,
  criteria,
  locale,
}: {
  product: Product;
  bestValue: ValueAlternative | null;
  worthMore: ValueAlternative | null;
  otherOffers: OtherOffer[];
  criteria: ParsedCriteria | null;
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const hasAlternatives = Boolean(bestValue || worthMore);
  const hasOffers = otherOffers.length > 0;

  if (!hasAlternatives && !hasOffers) return null;

  return (
    <section className="mt-12 flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{dict.productPage.comparisonTitle}</h2>
      <Tabs defaultValue={hasAlternatives ? "alternatives" : "offers"} className="w-full">
        <TabsList variant="line">
          {hasAlternatives && (
            <TabsTrigger value="alternatives">
              {dict.productPage.comparisonAlternativesTab}
            </TabsTrigger>
          )}
          {hasOffers && (
            <TabsTrigger value="offers">{dict.productPage.otherOffersTitle}</TabsTrigger>
          )}
        </TabsList>

        {hasAlternatives && (
          <TabsContent value="alternatives" className="mt-4">
            <ValueComparison
              bestValue={bestValue}
              worthMore={worthMore}
              criteria={criteria}
              locale={locale}
              bare
            />
          </TabsContent>
        )}
        {hasOffers && (
          <TabsContent value="offers" className="mt-4">
            <OtherOffersList product={product} offers={otherOffers} locale={locale} bare />
          </TabsContent>
        )}
      </Tabs>
    </section>
  );
}
