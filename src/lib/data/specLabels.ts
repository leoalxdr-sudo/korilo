import type { Locale } from "@/lib/i18n/locale";
import type { Specification } from "@/lib/types";

// Centralizes the ~20 recurring spec label keys used across the catalog
// (RAM, battery life, weight...) so each one is translated once instead
// of duplicated per product.
const SPEC_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    processor: "Processor",
    ram: "RAM",
    storage: "Storage",
    display: "Display",
    batteryLife: "Battery life",
    weight: "Weight",
    gpu: "GPU",
    type: "Type",
    noiseCancellation: "Noise cancellation",
    connectivity: "Connectivity",
    chip: "Chip",
    battery: "Battery",
    camera: "Camera",
    charging: "Charging",
    drop: "Drop",
    cushioning: "Cushioning",
    bestFor: "Best for",
    capacity: "Capacity",
    power: "Power",
    material: "Material",
    warranty: "Warranty",
    technology: "Technology",
    attachments: "Attachments",
    noiseLevel: "Noise level",
    laptopCompartment: "Laptop compartment",
    adjustability: "Adjustability",
    maxWeight: "Max. weight",
  },
  fr: {
    processor: "Processeur",
    ram: "RAM",
    storage: "Stockage",
    display: "Écran",
    batteryLife: "Autonomie",
    weight: "Poids",
    gpu: "GPU",
    type: "Type",
    noiseCancellation: "Réduction de bruit",
    connectivity: "Connectivité",
    chip: "Puce",
    battery: "Batterie",
    camera: "Appareil photo",
    charging: "Charge",
    drop: "Drop",
    cushioning: "Amorti",
    bestFor: "Idéal pour",
    capacity: "Capacité",
    power: "Puissance",
    material: "Matériau",
    warranty: "Garantie",
    technology: "Technologie",
    attachments: "Accessoires",
    noiseLevel: "Niveau sonore",
    laptopCompartment: "Compartiment ordinateur",
    adjustability: "Réglages",
    maxWeight: "Poids max.",
  },
};

export function specLabel(labelKey: string, locale: Locale): string {
  return SPEC_LABELS[locale][labelKey] ?? labelKey;
}

export interface ResolvedSpecification {
  label: string;
  value: string;
}

export function resolveSpecifications(
  specifications: Specification[],
  locale: Locale
): ResolvedSpecification[] {
  return specifications.map((spec) => ({
    label: specLabel(spec.labelKey, locale),
    value: spec.value[locale],
  }));
}
