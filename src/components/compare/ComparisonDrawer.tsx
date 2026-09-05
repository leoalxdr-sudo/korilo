"use client";

import Link from "next/link";
import { X } from "lucide-react";
import type { ParsedCriteria, Product } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import { Button } from "@/components/ui/button";
import { encodeCriteriaParam } from "@/lib/criteriaParam";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export function ComparisonDrawer({
  products,
  criteria,
  locale,
  onRemove,
  onClear,
}: {
  products: Product[];
  criteria?: ParsedCriteria;
  locale: Locale;
  onRemove: (id: string) => void;
  onClear: () => void;
}) {
  const dict = getDictionary(locale);
  if (products.length === 0) return null;

  const canCompare = products.length >= 2;
  const idsParam = products.map((p) => p.id).join(",");
  const compareHref = criteria
    ? `/compare?ids=${idsParam}&c=${encodeCriteriaParam(criteria)}`
    : `/compare?ids=${idsParam}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/90">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative flex shrink-0 items-center gap-2 rounded-lg border border-border bg-background py-1 pl-1 pr-2"
            >
              <ProductImage
                id={product.id}
                category={product.category}
                brand={product.brand}
                name={product.name}
                className="size-8 rounded-md"
                iconClassName="h-1/2 w-1/2"
              />
              <span className="max-w-28 truncate text-xs font-medium">
                {product.name}
              </span>
              <button
                type="button"
                onClick={() => onRemove(product.id)}
                aria-label={dict.compareDrawer.removeAria(product.name)}
                className="rounded-full p-0.5 text-muted-foreground hover:bg-muted"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <Button variant="ghost" size="sm" onClick={onClear}>
            {dict.compareDrawer.clear}
          </Button>
          <Button
            size="sm"
            disabled={!canCompare}
            nativeButton={canCompare ? false : undefined}
            render={canCompare ? <Link href={compareHref} /> : undefined}
            title={canCompare ? undefined : dict.compareDrawer.selectAtLeastTwo}
          >
            {dict.compareDrawer.compare(products.length)}
          </Button>
        </div>
      </div>
    </div>
  );
}
