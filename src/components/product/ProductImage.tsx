import { Laptop, Headphones, Smartphone, Footprints, Armchair, Coffee, Backpack, Wind } from "lucide-react";
import type { ProductCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BRAND_ICONS } from "@/components/product/brandIcons";

// MVP mock data has no real product photography (per product spec: no
// scraped or copyrighted images, and no legitimate source to hotlink
// from for a fictional retailer catalog). This shows the product's
// brand mark instead, with a small category glyph for context — same
// product id always renders the same background swatch, so cards stay
// visually stable. Once real retailer data is wired in, Product.image
// will carry a real photo URL and this component goes away.

const CATEGORY_ICONS: Record<ProductCategory, typeof Laptop> = {
  laptop: Laptop,
  headphones: Headphones,
  smartphone: Smartphone,
  "running-shoes": Footprints,
  "office-chairs": Armchair,
  "coffee-makers": Coffee,
  backpacks: Backpack,
  "hair-dryers": Wind,
};

const PALETTE = [
  { bg: "#EDEAE3", fg: "#8A8478" },
  { bg: "#E4E8E3", fg: "#748577" },
  { bg: "#E1E6EC", fg: "#6E7C8C" },
  { bg: "#EAE3EA", fg: "#8A7C8A" },
  { bg: "#EDE6DC", fg: "#8C7C63" },
  { bg: "#E0E7E9", fg: "#6C8286" },
  { bg: "#E8E1DC", fg: "#8A7468" },
  { bg: "#DEE3EA", fg: "#66788C" },
];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function brandInitials(brand: string): string {
  const words = brand.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return brand.slice(0, 2).toUpperCase();
}

export function ProductImage({
  id,
  category,
  brand,
  name,
  className,
  iconClassName,
}: {
  id: string;
  category: ProductCategory;
  brand: string;
  name: string;
  className?: string;
  iconClassName?: string;
}) {
  const CategoryIcon = CATEGORY_ICONS[category];
  const BrandIcon = BRAND_ICONS[brand];
  const swatch = PALETTE[hashString(id) % PALETTE.length];

  return (
    <div
      role="img"
      aria-label={name}
      className={cn("relative flex items-center justify-center", className)}
      style={{ backgroundColor: swatch.bg }}
    >
      {BrandIcon ? (
        <BrandIcon
          className={cn("h-1/4 w-1/4", iconClassName)}
          style={{ color: swatch.fg }}
        />
      ) : (
        <span
          className={cn(
            "select-none text-2xl font-semibold tracking-tight",
            iconClassName
          )}
          style={{ color: swatch.fg }}
        >
          {brandInitials(brand)}
        </span>
      )}
      <CategoryIcon
        className="absolute bottom-2 right-2 size-4 opacity-60"
        style={{ color: swatch.fg }}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </div>
  );
}
