import Link from "next/link";
import { ArrowUpRight, PiggyBank } from "lucide-react";
import type { ValueAlternative } from "@/lib/ai/valueComparison";
import type { ParsedCriteria } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";
import { encodeCriteriaParam } from "@/lib/criteriaParam";
import { ProductImage } from "@/components/product/ProductImage";
import { Badge } from "@/components/ui/badge";

function alternativeHref(alt: ValueAlternative, criteria: ParsedCriteria | null) {
  return criteria
    ? `/product/${alt.product.id}?c=${encodeCriteriaParam(criteria)}`
    : `/product/${alt.product.id}`;
}

export function ValueComparison({
  bestValue,
  worthMore,
  criteria,
  locale,
  bare = false,
}: {
  bestValue: ValueAlternative | null;
  worthMore: ValueAlternative | null;
  criteria: ParsedCriteria | null;
  locale: Locale;
  /** Skip the outer section/margin — used when this is already inside
   * a tab that provides its own spacing. */
  bare?: boolean;
}) {
  const dict = getDictionary(locale);
  if (!bestValue && !worthMore) return null;

  const Wrapper = bare ? "div" : "section";

  return (
    <Wrapper
      className={
        bare
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
          : "mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2"
      }
    >
      {bestValue && (
        <Link
          href={alternativeHref(bestValue, criteria)}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
        >
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <PiggyBank className="size-4 text-success" aria-hidden="true" />
            {dict.productPage.bestValueTitle}
          </p>
          <div className="flex items-center gap-3">
            <ProductImage
              id={bestValue.product.id}
              category={bestValue.product.category}
              brand={bestValue.product.brand}
              name={bestValue.product.name}
              className="size-14 shrink-0 rounded-lg"
            />
            <div className="flex-1">
              <p className="text-sm font-medium leading-snug">{bestValue.product.name}</p>
              <p className="text-sm font-semibold">
                {formatPrice(bestValue.product.price, locale)}
              </p>
            </div>
            {bestValue.matchScore !== null && (
              <Badge className="bg-success-muted text-success">
                {dict.productPage.bestValueMatch(bestValue.matchScore)}
              </Badge>
            )}
          </div>
          {bestValue.reasons.length > 0 && (
            <ul className="flex flex-col gap-0.5 text-sm text-muted-foreground">
              {bestValue.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          )}
          <p className="text-sm text-muted-foreground">
            {dict.productPage.bestValueSavings(
              formatPrice(Math.abs(bestValue.priceDiff), locale)
            )}
          </p>
        </Link>
      )}

      {worthMore && (
        <Link
          href={alternativeHref(worthMore, criteria)}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
        >
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <ArrowUpRight className="size-4 text-primary" aria-hidden="true" />
            {dict.productPage.worthMoreTitle}
          </p>
          <div className="flex items-center gap-3">
            <ProductImage
              id={worthMore.product.id}
              category={worthMore.product.category}
              brand={worthMore.product.brand}
              name={worthMore.product.name}
              className="size-14 shrink-0 rounded-lg"
            />
            <div className="flex-1">
              <p className="text-sm font-medium leading-snug">{worthMore.product.name}</p>
              <p className="text-sm font-semibold">
                {formatPrice(worthMore.product.price, locale)}
              </p>
            </div>
            <Badge variant="outline">
              {dict.productPage.worthMorePriceDiff(formatPrice(worthMore.priceDiff, locale))}
            </Badge>
          </div>
          <div className="flex flex-col gap-0.5 text-sm text-muted-foreground">
            {worthMore.specDeltas.map((delta) => (
              <span key={delta}>{delta}</span>
            ))}
            {worthMore.ratingDelta >= 0.2 && (
              <span>{dict.productPage.worthMoreRating(worthMore.ratingDelta.toFixed(1))}</span>
            )}
          </div>
        </Link>
      )}
    </Wrapper>
  );
}
