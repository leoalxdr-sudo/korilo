import { CircleCheck, CircleAlert } from "lucide-react";
import type { Product } from "@/lib/types";
import { getPriceHistory, getBuyTiming } from "@/lib/data/priceHistory";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";

export function PriceHistoryCard({
  product,
  locale,
  bare = false,
}: {
  product: Product;
  locale: Locale;
  /** Skip the outer card and title — used when this is already inside
   * a tab whose label says what it is. */
  bare?: boolean;
}) {
  const dict = getDictionary(locale);
  const history = getPriceHistory(product);
  const timing = getBuyTiming(product, history);
  const percent = `${Math.round(
    (Math.abs(product.price - history.average90Days) / history.average90Days) * 100
  )}%`;

  return (
    <div
      className={
        bare ? "flex flex-col gap-2.5" : "flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4"
      }
    >
      {!bare && <p className="text-sm font-semibold">{dict.productPage.priceHistoryTitle}</p>}
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
        <span>
          <span className="text-muted-foreground">{dict.productPage.priceHistoryToday} : </span>
          <span className="font-semibold">{formatPrice(product.price, locale)}</span>
        </span>
        <span>
          <span className="text-muted-foreground">{dict.productPage.priceHistoryLowest} : </span>
          <span className="font-semibold">{formatPrice(history.lowest90Days, locale)}</span>
        </span>
        <span>
          <span className="text-muted-foreground">{dict.productPage.priceHistoryAverage} : </span>
          <span className="font-semibold">{formatPrice(history.average90Days, locale)}</span>
        </span>
      </div>
      {timing !== "typical" && (
        <p
          className={
            timing === "good"
              ? "flex items-center gap-1.5 text-sm text-success"
              : "flex items-center gap-1.5 text-sm text-muted-foreground"
          }
        >
          {timing === "good" ? (
            <CircleCheck className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
          )}
          {timing === "good"
            ? dict.productPage.buyTimingGood(percent)
            : dict.productPage.buyTimingWait(percent)}
        </p>
      )}
    </div>
  );
}
