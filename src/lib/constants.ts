import type { Locale } from "@/lib/i18n/locale";

// Real, parseable example queries in each language — not just translated
// labels. These feed directly into the AI parser when clicked, so they
// have to use vocabulary the French/English pattern sets actually match.
export const EXAMPLE_PROMPTS: Record<Locale, string[]> = {
  en: [
    "I need a laptop for university under €1,200, lightweight with good battery life",
    "I need an ergonomic office chair with lumbar support, budget under €300",
    "A durable, water-resistant backpack for travel with a laptop compartment",
    "Find me running shoes for long-distance training",
    "I need headphones with great noise cancellation under €300 for commuting",
    "A smartphone with a great camera under €800",
    "A quiet, ionic hair dryer that's fast-drying, under €100",
    "A premium coffee machine with a milk frother, budget €400",
    "A lightweight gaming laptop with at least 16GB RAM",
  ],
  fr: [
    "J'ai besoin d'un ordinateur portable pour la fac sous 1 200 €, léger avec une bonne autonomie",
    "J'ai besoin d'une chaise de bureau ergonomique avec support lombaire, budget sous 300 €",
    "Un sac à dos durable et résistant à l'eau pour voyager, avec compartiment ordinateur",
    "Trouve-moi des chaussures de running pour l'entraînement longue distance",
    "J'ai besoin d'un casque avec une excellente réduction de bruit sous 300 €, pour les trajets domicile-travail",
    "Un smartphone avec un bon appareil photo sous 800 €",
    "Un sèche-cheveux ionique, silencieux et à séchage rapide, sous 100 €",
    "Une machine à café premium avec mousseur à lait, budget 400 €",
    "Un ordinateur portable gaming léger avec au moins 16 Go de RAM",
  ],
};

// Placeholder partner-network size shown alongside real search stats
// ("Korilo compared X products across Y stores"). The demo catalog only
// has 9 fictional retailers — this stands in for the real count once
// Korilo integrates actual retailer partners, so bump it then rather
// than pretending the current 9 is impressive.
export const PARTNER_STORE_COUNT = 47;
