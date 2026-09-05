import Link from "next/link";
import type { ParsedCriteria, Recommendation } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import { MatchScore } from "@/components/product/MatchScore";
import { encodeCriteriaParam } from "@/lib/criteriaParam";
import type { Locale } from "@/lib/i18n/locale";
import { formatPrice } from "@/lib/i18n/format";

// A compact card for horizontally scrolling rows (search history), as
// opposed to ProductCard's full detail used in grids.
export function ProductRowCard({
  recommendation,
  criteria,
  locale,
}: {
  recommendation: Recommendation;
  criteria: ParsedCriteria;
  locale: Locale;
}) {
  const { product, matchScore, headline } = recommendation;
  const detailHref = `/product/${product.id}?c=${encodeCriteriaParam(criteria)}`;

  return (
    <Link
      href={detailHref}
      className="flex w-48 shrink-0 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative">
        <ProductImage
          id={product.id}
          category={product.category}
          brand={product.brand}
          name={product.name}
          className="h-28 w-full rounded-lg"
          iconClassName="h-1/3 w-1/3"
        />
        <div className="absolute right-1.5 top-1.5">
          <MatchScore score={matchScore} locale={locale} size="sm" />
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-sm font-medium leading-snug">
          {product.name}
        </span>
        <span className="text-sm font-semibold">
          {formatPrice(product.price, locale)}
        </span>
        <span className="truncate text-xs text-muted-foreground">{headline}</span>
      </div>
    </Link>
  );
}
