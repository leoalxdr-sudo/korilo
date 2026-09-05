import type { Product, ProductCategory, Retailer } from "@/lib/types";
import { retailers } from "@/lib/data/retailers";
import { seedFromString } from "@/lib/data/seededRandom";

// Which fictional retailers plausibly carry each category, mirroring
// the groupings already used when assigning each product's own
// retailer in lib/data/*.ts — keeps "you can also find it at X" from
// suggesting a running-shoe store sells laptops.
const CATEGORY_RETAILERS: Record<ProductCategory, Retailer[]> = {
  laptop: [retailers.technova, retailers.brightbox, retailers.clickstore],
  headphones: [retailers.soundhaus, retailers.audiomart, retailers.clickstore, retailers.mobileday],
  smartphone: [retailers.clickstore, retailers.mobileday, retailers.ringo],
  "running-shoes": [retailers.runlab, retailers.strideco],
  "office-chairs": [retailers.homenest, retailers.comfortcraft],
  "coffee-makers": [retailers.brewhouse, retailers.baristahome],
  backpacks: [retailers.packrunner, retailers.urbanpack],
  "hair-dryers": [retailers.glowtech, retailers.purebeauty],
};

export interface OtherOffer {
  retailer: Retailer;
  price: number;
  url: string;
}

function slugFromUrl(url: string): string {
  return url.split("/").filter(Boolean).pop() ?? "";
}

// Mocks "also listed at these other sites" the way a real price-
// comparison feed would eventually supply it — no live pricing data
// here, just plausible variation around the product's own price.
export function getOtherOffers(product: Product): OtherOffer[] {
  const pool = (CATEGORY_RETAILERS[product.category] ?? []).filter(
    (retailer) => retailer.id !== product.retailer.id
  );
  if (pool.length === 0) return [];

  const seed = seedFromString(product.id);
  const count = Math.min(pool.length, 2 + (seed % 2));
  const offset = seed % pool.length;
  const rotated = [...pool.slice(offset), ...pool.slice(0, offset)];
  const slug = slugFromUrl(product.productUrl);

  return rotated.slice(0, count).map((retailer, index) => {
    // Roughly ±12% around the listed price, so offers land on both
    // sides — some cheaper, some pricier. Unsigned shift avoids sign
    // extension turning this into a much larger negative swing.
    const variance = ((seed >>> (index * 4)) % 25) - 12;
    const price = Math.max(1, Math.round((product.price * (100 + variance)) / 100));
    return { retailer, price, url: `https://${retailer.id}.example/products/${slug}` };
  });
}
