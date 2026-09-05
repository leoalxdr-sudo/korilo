"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import { useWishlist } from "@/lib/wishlist";
import { usePriceAlerts, removePriceAlert } from "@/lib/priceAlerts";
import { getProductById } from "@/lib/data";
import { getOtherOffers } from "@/lib/data/otherOffers";
import { PlainProductCard } from "@/components/product/PlainProductCard";
import { RetailerBadge } from "@/components/product/RetailerBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";

export function WishlistExperience({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const { ids } = useWishlist();
  const products = ids
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));

  const alerts = usePriceAlerts();

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-semibold tracking-tight">{dict.wishlist.pageTitle}</h1>

        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">{dict.wishlist.empty}</p>
            <Button render={<Link href="/#try-korilo" />} nativeButton={false}>
              {dict.wishlist.startSearch}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <PlainProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}
      </div>

      {alerts.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">{dict.priceAlert.manageTitle}</h2>
          <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
            {alerts.map((alert) => {
              const product = getProductById(alert.productId);
              if (!product) return null;
              const bestPrice = Math.min(
                product.price,
                ...getOtherOffers(product).map((o) => o.price)
              );
              const met = bestPrice < alert.referencePrice;

              return (
                <div
                  key={alert.productId}
                  className="flex flex-wrap items-center justify-between gap-3 p-4"
                >
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                    <RetailerBadge retailer={product.retailer} />
                    {met && (
                      <Badge className="bg-success-muted text-success">
                        {dict.priceAlert.metTitle}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {dict.priceAlert.active(formatPrice(alert.referencePrice, locale))}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePriceAlert(alert.productId)}
                      className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      {dict.priceAlert.remove}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
