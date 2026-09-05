"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { getRealCost, realCostItemLabel } from "@/lib/data/realCost";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";
import { Checkbox } from "@/components/ui/checkbox";

export function RealCostCard({
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
  const realCost = useMemo(() => getRealCost(product), [product]);
  const [excluded, setExcluded] = useState<Set<string>>(() => new Set());

  if (!realCost) return null;

  const total =
    product.price +
    realCost.items
      .filter((item) => !excluded.has(item.labelKey))
      .reduce((sum, item) => sum + item.price, 0);

  function toggle(labelKey: string, checked: boolean) {
    setExcluded((prev) => {
      const next = new Set(prev);
      if (checked) next.delete(labelKey);
      else next.add(labelKey);
      return next;
    });
  }

  return (
    <div
      className={
        bare ? "flex flex-col gap-2.5" : "flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4"
      }
    >
      <div className="flex flex-col gap-0.5">
        {!bare && <p className="text-sm font-semibold">{dict.productPage.realCostTitle}</p>}
        <p className="text-xs text-muted-foreground">{dict.productPage.realCostSubtitle}</p>
      </div>
      <div className="flex flex-col gap-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{dict.productPage.realCostBasePrice}</span>
          <span className="font-medium">{formatPrice(product.price, locale)}</span>
        </div>
        {realCost.items.map((item) => (
          <label
            key={item.labelKey}
            className="flex items-center justify-between gap-2 text-muted-foreground"
          >
            <span className="flex items-center gap-2">
              <Checkbox
                checked={!excluded.has(item.labelKey)}
                onCheckedChange={(checked) => toggle(item.labelKey, checked === true)}
              />
              + {realCostItemLabel(item.labelKey, locale)}
            </span>
            <span className="font-medium">{formatPrice(item.price, locale)}</span>
          </label>
        ))}
        <p className="text-xs text-muted-foreground">{dict.productPage.realCostHint}</p>
        <div className="mt-1 flex justify-between border-t border-border pt-1.5">
          <span className="font-semibold">{dict.productPage.realCostTotal}</span>
          <span className="font-semibold">{formatPrice(total, locale)}</span>
        </div>
      </div>
    </div>
  );
}
