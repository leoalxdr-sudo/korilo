"use client";

import { Bell, BellRing } from "lucide-react";
import type { Product } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";
import { getOtherOffers } from "@/lib/data/otherOffers";
import { setPriceAlert, removePriceAlert, useAlertForProduct } from "@/lib/priceAlerts";
import { toastManager } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function PriceAlertWidget({
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
  const alert = useAlertForProduct(product.id);

  function handleCreate() {
    setPriceAlert(product.id, product.price);

    const bestPrice = Math.min(product.price, ...getOtherOffers(product).map((o) => o.price));
    if (bestPrice < product.price) {
      toastManager.add({
        title: dict.priceAlert.metTitle,
        description: dict.priceAlert.metDescription(formatPrice(bestPrice, locale)),
      });
    } else {
      toastManager.add({
        title: dict.priceAlert.savedTitle,
        description: dict.priceAlert.savedDescription(formatPrice(product.price, locale)),
      });
    }
  }

  function handleRemove() {
    removePriceAlert(product.id);
    toastManager.add({ description: dict.priceAlert.removed });
  }

  return (
    <div
      className={
        bare ? "flex flex-col gap-2.5" : "flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4"
      }
    >
      {!bare && (
        <div className="flex items-center gap-2">
          <Bell className="size-4 text-primary" aria-hidden="true" />
          <p className="text-sm font-semibold">{dict.priceAlert.title}</p>
        </div>
      )}
      <p className="text-xs text-muted-foreground">{dict.priceAlert.subtitle}</p>

      {alert ? (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-sm font-medium text-success">
            <BellRing className="size-4" aria-hidden="true" />
            {dict.priceAlert.active(formatPrice(alert.referencePrice, locale))}
          </span>
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {dict.priceAlert.remove}
          </button>
        </div>
      ) : (
        <Button type="button" size="sm" onClick={handleCreate} className="self-start gap-1.5">
          <Bell className="size-4" aria-hidden="true" />
          {dict.priceAlert.create}
        </Button>
      )}
    </div>
  );
}
