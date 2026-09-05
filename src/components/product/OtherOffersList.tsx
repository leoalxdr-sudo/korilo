import { ExternalLink } from "lucide-react";
import type { Product } from "@/lib/types";
import type { OtherOffer } from "@/lib/data/otherOffers";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";
import { RetailerBadge } from "@/components/product/RetailerBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function OtherOffersList({
  product,
  offers,
  locale,
  bare = false,
}: {
  product: Product;
  offers: OtherOffer[];
  locale: Locale;
  /** Skip the outer section/title — used when this is already inside
   * a tab whose label says what it is. */
  bare?: boolean;
}) {
  const dict = getDictionary(locale);
  if (offers.length === 0) return null;

  return (
    <div className={bare ? "flex flex-col gap-3" : "mt-12 flex flex-col gap-3"}>
      {!bare ? (
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">{dict.productPage.otherOffersTitle}</h2>
          <p className="text-sm text-muted-foreground">{dict.productPage.otherOffersSubtitle}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{dict.productPage.otherOffersSubtitle}</p>
      )}
      <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
        {offers.map((offer) => (
          <div
            key={offer.retailer.id}
            className="flex flex-wrap items-center justify-between gap-3 p-4"
          >
            <div className="flex items-center gap-2">
              <RetailerBadge retailer={offer.retailer} />
              {offer.price < product.price && (
                <Badge className="bg-success-muted text-success">
                  {dict.productPage.cheaper}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-semibold">
                {formatPrice(offer.price, locale)}
              </span>
              <Button
                size="sm"
                variant="outline"
                nativeButton={false}
                render={<a href={offer.url} target="_blank" rel="noopener noreferrer" />}
                className="gap-1.5"
              >
                {dict.productPage.visit(offer.retailer.name)}
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
