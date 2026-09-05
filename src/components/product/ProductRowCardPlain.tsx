import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import type { Locale } from "@/lib/i18n/locale";
import { formatPrice } from "@/lib/i18n/format";

// A compact card for horizontally scrolling rows of plain products —
// no match score or reasoning, since these (recently viewed, etc.)
// aren't tied to any particular search. See ProductRowCard for the
// scored equivalent used by search history.
export function ProductRowCardPlain({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="flex w-48 shrink-0 flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <ProductImage
        id={product.id}
        category={product.category}
        brand={product.brand}
        name={product.name}
        className="h-28 w-full rounded-lg"
        iconClassName="h-1/3 w-1/3"
      />
      <div className="flex flex-col gap-0.5">
        <span className="truncate text-sm font-medium leading-snug">
          {product.name}
        </span>
        <span className="text-sm font-semibold">
          {formatPrice(product.price, locale)}
        </span>
        <span className="truncate text-xs text-muted-foreground">{product.brand}</span>
      </div>
    </Link>
  );
}
