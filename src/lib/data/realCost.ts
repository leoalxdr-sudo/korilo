import type { Product, ProductCategory } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import { seedFromString } from "@/lib/data/seededRandom";

export interface RealCostItem {
  labelKey: string;
  price: number;
}

export interface RealCost {
  items: RealCostItem[];
  total: number;
}

interface ExtraDefinition {
  labelKey: string;
  min: number;
  max: number;
  /** Bit-shift so each extra on the same product draws an independent
   * slice of the seed instead of all moving together. */
  shift: number;
}

// Only genuinely common add-ons per category — no filler line just to
// keep every category "covered".
const CATEGORY_EXTRAS: Record<ProductCategory, ExtraDefinition[]> = {
  laptop: [
    { labelKey: "protectiveSleeve", min: 25, max: 45, shift: 0 },
    { labelKey: "wirelessMouse", min: 25, max: 45, shift: 12 },
  ],
  smartphone: [
    { labelKey: "phoneCase", min: 20, max: 35, shift: 0 },
    { labelKey: "screenProtector", min: 10, max: 20, shift: 4 },
    { labelKey: "wirelessCharger", min: 20, max: 35, shift: 8 },
  ],
  headphones: [
    { labelKey: "carryingCase", min: 15, max: 30, shift: 0 },
    { labelKey: "replacementEarPads", min: 15, max: 25, shift: 4 },
  ],
  "running-shoes": [
    { labelKey: "performanceSocks", min: 12, max: 20, shift: 0 },
    { labelKey: "insoles", min: 20, max: 35, shift: 4 },
  ],
  "office-chairs": [
    { labelKey: "seatCushion", min: 20, max: 35, shift: 0 },
    { labelKey: "floorMat", min: 25, max: 40, shift: 4 },
  ],
  "coffee-makers": [
    { labelKey: "descalingKit", min: 8, max: 15, shift: 0 },
    { labelKey: "filterPack", min: 10, max: 18, shift: 4 },
  ],
  backpacks: [
    { labelKey: "rainCover", min: 12, max: 20, shift: 0 },
    { labelKey: "packingCubes", min: 15, max: 25, shift: 4 },
  ],
  "hair-dryers": [
    { labelKey: "diffuserAttachment", min: 10, max: 18, shift: 0 },
    { labelKey: "travelPouch", min: 8, max: 15, shift: 4 },
  ],
};

function priceFor(product: Product, def: ExtraDefinition): number {
  const seed = seedFromString(`${product.id}:realcost:${def.labelKey}`);
  const range = def.max - def.min;
  return def.min + ((seed >>> def.shift) % (range + 1));
}

function weightKg(product: Product): number | null {
  const spec = product.specifications.find((s) => s.labelKey === "weight");
  if (!spec) return null;
  const match = spec.value.en.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

export function getRealCost(product: Product): RealCost | null {
  const extras = [...CATEGORY_EXTRAS[product.category]];
  if (extras.length === 0) return null;

  // Thin ultrabooks typically drop full-size ports, so a USB-C hub is a
  // genuinely common add-on for those specifically, not laptops broadly.
  if (product.category === "laptop") {
    const weight = weightKg(product);
    if (weight !== null && weight < 1.4) {
      extras.push({ labelKey: "usbHub", min: 25, max: 40, shift: 8 });
    }
  }

  const items = extras.map((def) => ({ labelKey: def.labelKey, price: priceFor(product, def) }));
  const total = product.price + items.reduce((sum, item) => sum + item.price, 0);

  return { items, total };
}

const EXTRA_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    protectiveSleeve: "Protective sleeve",
    usbHub: "USB-C hub",
    wirelessMouse: "Wireless mouse",
    phoneCase: "Phone case",
    screenProtector: "Screen protector",
    wirelessCharger: "Wireless charger",
    carryingCase: "Carrying case",
    replacementEarPads: "Replacement ear pads",
    performanceSocks: "Performance socks",
    insoles: "Insoles",
    seatCushion: "Seat cushion",
    floorMat: "Floor mat",
    descalingKit: "Descaling kit",
    filterPack: "Filter pack",
    rainCover: "Rain cover",
    packingCubes: "Packing cubes",
    diffuserAttachment: "Diffuser attachment",
    travelPouch: "Travel pouch",
  },
  fr: {
    protectiveSleeve: "Housse de protection",
    usbHub: "Hub USB-C",
    wirelessMouse: "Souris sans fil",
    phoneCase: "Coque de protection",
    screenProtector: "Verre trempé",
    wirelessCharger: "Chargeur sans fil",
    carryingCase: "Étui de transport",
    replacementEarPads: "Coussinets de rechange",
    performanceSocks: "Chaussettes techniques",
    insoles: "Semelles",
    seatCushion: "Coussin d'assise",
    floorMat: "Tapis de protection",
    descalingKit: "Kit détartrant",
    filterPack: "Lot de filtres",
    rainCover: "Housse de pluie",
    packingCubes: "Cubes de rangement",
    diffuserAttachment: "Embout diffuseur",
    travelPouch: "Pochette de voyage",
  },
};

export function realCostItemLabel(labelKey: string, locale: Locale): string {
  return EXTRA_LABELS[locale][labelKey] ?? labelKey;
}
