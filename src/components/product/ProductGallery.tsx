"use client";

import { useState } from "react";
import type { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/product/ProductImage";

// Stand-in gallery for the MVP's brand-mark placeholder art (see
// ProductImage.tsx — no real product photography available yet). Each
// "view" is the same generated brand mark reframed with a CSS
// transform, so the page doesn't read as a single lonely square next
// to a much taller info column. The click-to-swap wiring is already
// real, so dropping in actual photo URLs later is just a data change.
const VIEWS = [
  { key: "front", iconClassName: "h-1/4 w-1/4" },
  { key: "detail", iconClassName: "h-1/3 w-1/3 scale-125" },
  { key: "angle", iconClassName: "h-1/4 w-1/4 rotate-6" },
  { key: "wide", iconClassName: "h-1/5 w-1/5 -translate-x-8" },
];

export function ProductGallery({
  id,
  category,
  brand,
  name,
}: {
  id: string;
  category: ProductCategory;
  brand: string;
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <ProductImage
        id={id}
        category={category}
        brand={brand}
        name={name}
        className="aspect-square w-full rounded-2xl"
        iconClassName={VIEWS[active].iconClassName}
      />
      <div className="grid grid-cols-4 gap-3">
        {VIEWS.map((view, index) => (
          <button
            key={view.key}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`${name} ${index + 1}`}
            aria-pressed={active === index}
            className={cn(
              "overflow-hidden rounded-xl border-2 transition-colors",
              active === index
                ? "border-primary"
                : "border-transparent hover:border-border"
            )}
          >
            <ProductImage
              id={id}
              category={category}
              brand={brand}
              name={name}
              className="aspect-square w-full"
              iconClassName={view.iconClassName}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
