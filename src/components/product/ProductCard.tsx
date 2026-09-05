import Link from "next/link";
import type { ParsedCriteria, Recommendation } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import { MatchScore } from "@/components/product/MatchScore";
import { RecommendationReason } from "@/components/product/RecommendationReason";
import { DealBreakerBanner } from "@/components/product/DealBreakerBanner";
import { ProsCons } from "@/components/product/ProsCons";
import { RetailerBadge } from "@/components/product/RetailerBadge";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { encodeCriteriaParam } from "@/lib/criteriaParam";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";

export function ProductCard({
  recommendation,
  criteria,
  locale,
  selected = false,
  onToggleSelect,
  compact = false,
  className,
}: {
  recommendation: Recommendation;
  criteria?: ParsedCriteria;
  locale: Locale;
  selected?: boolean;
  onToggleSelect?: (id: string, next: boolean) => void;
  compact?: boolean;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const { product, matchScore, headline, reasoning, pros, cons, dealBreakers, isBestMatch } =
    recommendation;
  const hasDealBreaker = dealBreakers.length > 0;
  const detailHref = criteria
    ? `/product/${product.id}?c=${encodeCriteriaParam(criteria)}`
    : `/product/${product.id}`;

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="relative">
        <ProductImage
          id={product.id}
          category={product.category}
          brand={product.brand}
          name={product.name}
          className={compact ? "h-28 w-full" : "h-44 w-full"}
        />
        {isBestMatch && !hasDealBreaker && (
          <Badge className="absolute left-3 top-3 bg-success text-success-foreground">
            {dict.productCard.bestMatch}
          </Badge>
        )}
        {hasDealBreaker && (
          <Badge variant="destructive" className="absolute left-3 top-3">
            {dict.productCard.dealBreakerBadge}
          </Badge>
        )}
        <div className="absolute right-2 top-2">
          <MatchScore score={matchScore} locale={locale} size="sm" />
        </div>
        <div className={cn("absolute right-2", compact ? "bottom-2" : "bottom-3")}>
          <WishlistButton productId={product.id} productName={product.name} locale={locale} />
        </div>
        {onToggleSelect && !compact && (
          <label className="absolute bottom-3 left-3 flex items-center gap-2 rounded-md bg-background/90 px-2 py-1.5 text-xs font-medium shadow-sm backdrop-blur-sm">
            <Checkbox
              checked={selected}
              onCheckedChange={(checked) => onToggleSelect(product.id, checked)}
              aria-label={dict.productCard.selectAria(product.name)}
            />
            {dict.productCard.compare}
          </label>
        )}
      </div>

      {compact ? (
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          <h3 className="text-sm font-semibold leading-snug">{product.name}</h3>
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <p className="text-sm font-semibold">{formatPrice(product.price, locale)}</p>
          <Link
            href={detailHref}
            className="mt-auto pt-1 text-xs font-medium text-primary hover:underline"
          >
            {dict.productCard.viewDetails}
          </Link>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold leading-snug">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
            </div>
            <p className="whitespace-nowrap text-lg font-semibold">
              {formatPrice(product.price, locale)}
            </p>
          </div>

          <RetailerBadge retailer={product.retailer} className="self-start" />

          <DealBreakerBanner dealBreakers={dealBreakers} locale={locale} />

          <RecommendationReason headline={headline} reasoning={reasoning} />

          <ProsCons pros={pros} cons={cons} maxItems={2} />

          <div className="mt-auto flex items-center gap-2 pt-2">
            <Button nativeButton={false} render={<Link href={detailHref} />} className="flex-1">
              {dict.productCard.viewDetails}
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
