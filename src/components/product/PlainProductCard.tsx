import Link from "next/link";
import { Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import { RetailerBadge } from "@/components/product/RetailerBadge";
import { WishlistButton } from "@/components/product/WishlistButton";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";

// A full-size grid card for a product with no search context behind it
// (the wishlist) — no match score or AI reasoning, just what's
// objectively true about the product. See ProductCard for the scored
// equivalent shown in search results.
export function PlainProductCard({ product, locale }: { product: Product; locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <ProductImage
          id={product.id}
          category={product.category}
          brand={product.brand}
          name={product.name}
          className="h-44 w-full"
        />
        <div className="absolute right-2 top-2">
          <WishlistButton productId={product.id} productName={product.name} locale={locale} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold leading-snug">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>
          <p className="whitespace-nowrap text-lg font-semibold">
            {formatPrice(product.price, locale)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <RetailerBadge retailer={product.retailer} />
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-3.5 fill-current text-primary" aria-hidden="true" />
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Button
            nativeButton={false}
            render={<Link href={`/product/${product.id}`} />}
            className="flex-1"
          >
            {dict.productCard.viewDetails}
          </Button>
        </div>
      </div>
    </article>
  );
}
