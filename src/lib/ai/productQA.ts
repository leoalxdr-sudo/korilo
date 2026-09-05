import type { Locale } from "@/lib/i18n/locale";
import type { Product } from "@/lib/types";
import { FEATURE_KEYWORDS, USE_CASE_KEYWORDS, labelForTag } from "@/lib/ai/keywords";
import { specLabel } from "@/lib/data/specLabels";
import { formatNumber, formatPrice } from "@/lib/i18n/format";

// Deterministic, heuristic Q&A over a single product's own data — the
// product-page equivalent of parseQuery/matchProducts/explain. Same
// mocked-LLM philosophy: keyword-match the question, answer from data
// that's already on the page, never invent anything.

type LocalePatterns = Record<Locale, RegExp[]>;

// Maps a question topic to the spec labelKey(s) that answer it. Several
// categories use different labelKeys for the same idea (batteryLife vs
// battery), so a topic can cover more than one.
const SPEC_TOPICS: Array<{ labelKeys: string[]; patterns: LocalePatterns }> = [
  {
    labelKeys: ["ram"],
    patterns: {
      en: [/\bram\b/i, /\bmemory\b/i],
      fr: [/\bram\b/i, /mémoire/i],
    },
  },
  {
    labelKeys: ["storage"],
    patterns: {
      en: [/storage/i, /\bssd\b/i, /disk space/i, /hard drive/i],
      fr: [/stockage/i, /\bssd\b/i, /espace disque/i],
    },
  },
  {
    labelKeys: ["batteryLife", "battery"],
    patterns: {
      en: [/battery/i, /how long.*(?:last|charge)/i],
      fr: [/autonomie/i, /batterie/i, /combien de temps.*(?:dure|tient)/i],
    },
  },
  {
    labelKeys: ["weight"],
    patterns: {
      en: [/\bweight\b/i, /how heavy/i, /how much does it weigh/i],
      fr: [/\bpoids\b/i, /combien (?:pèse|il pèse)/i, /\blourd/i],
    },
  },
  {
    labelKeys: ["display"],
    patterns: {
      en: [/\bscreen\b/i, /\bdisplay\b/i],
      fr: [/écran/i],
    },
  },
  {
    labelKeys: ["processor", "chip"],
    patterns: {
      en: [/\bprocessor\b/i, /\bcpu\b/i, /which chip/i],
      fr: [/processeur/i, /quelle puce/i],
    },
  },
  {
    labelKeys: ["gpu"],
    patterns: {
      en: [/\bgpu\b/i, /graphics card/i],
      fr: [/carte graphique/i, /\bgpu\b/i],
    },
  },
  {
    labelKeys: ["noiseCancellation"],
    patterns: {
      en: [/noise.?cancel\w*/i, /\banc\b/i],
      fr: [/réduction (?:de |du )?bruit/i, /anti.?bruit/i],
    },
  },
  {
    labelKeys: ["connectivity"],
    patterns: {
      en: [/\bbluetooth\b/i, /connectivity/i, /wireless/i],
      fr: [/connectivité/i, /bluetooth/i, /sans fil/i],
    },
  },
  {
    labelKeys: ["camera"],
    patterns: {
      en: [/\bcamera\b/i, /\bphoto\b/i],
      fr: [/appareil photo/i, /\bcaméra\b/i, /\bphoto\b/i],
    },
  },
  {
    labelKeys: ["charging"],
    patterns: {
      en: [/charging/i, /how (?:fast|quickly) does it charge/i],
      fr: [/charge\b/i, /recharge/i],
    },
  },
  {
    labelKeys: ["cushioning"],
    patterns: {
      en: [/cushion\w*/i],
      fr: [/amorti/i],
    },
  },
  {
    labelKeys: ["drop"],
    patterns: {
      en: [/\bdrop\b/i, /heel.to.toe/i],
      fr: [/\bdrop\b/i],
    },
  },
  {
    labelKeys: ["type"],
    patterns: {
      en: [/what type/i, /what kind/i],
      fr: [/quel type/i, /quel genre/i],
    },
  },
];

const PRICE_PATTERNS: LocalePatterns = {
  en: [/\bprice\b/i, /\bcost\b/i, /how much/i],
  fr: [/\bprix\b/i, /\bcoûte\b/i, /combien ça coûte/i, /combien il coûte/i],
};

const STOCK_PATTERNS: LocalePatterns = {
  en: [/in stock/i, /\bavailable\b/i, /availability/i],
  fr: [/en stock/i, /\bdisponible\b/i, /disponibilité/i],
};

const RATING_PATTERNS: LocalePatterns = {
  en: [/\brating\b/i, /\breviews?\b/i, /how good is it/i],
  fr: [/\bnote\b/i, /\bavis\b/i, /est.ce que c'est bien/i],
};

const RETAILER_PATTERNS: LocalePatterns = {
  en: [/where.*buy/i, /\bretailer\b/i, /\bseller\b/i, /who sells/i],
  fr: [/où.*acheter/i, /revendeur/i, /qui (?:le |la )?vend/i],
};

// A generic "why should I want this" question — distinct from asking
// about one specific feature, this needs a synthesized answer pulled
// from everything known about the product (tags, rating, description),
// the same way a human giving a recommendation would.
const WHY_GOOD_PATTERNS: LocalePatterns = {
  en: [
    /why.*(?:for me|buy (?:this|it)|choose (?:this|it)|get (?:this|it)|recommend)/i,
    /what makes (?:this|it) (?:a )?good/i,
    /why (?:is|would) (?:this|it) (?:suit|fit) me/i,
    /should i (?:buy|get) (?:this|it)/i,
    /is (?:this|it) (?:a )?good (?:choice|product|option) for me/i,
    /\bpros\b/i,
  ],
  fr: [
    /pourquoi.*(?:pour moi|l'acheter|le choisir|le prendre|me le)/i,
    /pourquoi (?:ce|cet|cette) produit/i,
    /pourquoi (?:il|elle) (?:me )?(?:convient|conviendrait|serait)/i,
    /qu'est-ce qui (?:le |la )?rend (?:bien|bon|intéressant|adapté)/i,
    /devrais.je (?:l'|le |la )?(?:acheter|prendre|choisir)/i,
    /\bavantages?\b/i,
  ],
};

function matchesAny(patterns: RegExp[], text: string): boolean {
  return patterns.some((p) => p.test(text));
}

function specAnswer(product: Product, labelKeys: string[], locale: Locale): string | null {
  const spec = product.specifications.find((s) => labelKeys.includes(s.labelKey));
  if (!spec) return null;
  return `${specLabel(spec.labelKey, locale)} : ${spec.value[locale]}.`;
}

function whyGoodAnswer(product: Product, locale: Locale): string {
  const labels = [...new Set(product.tags.map((tag) => labelForTag(tag, locale)))].slice(0, 4);
  const rating = product.rating.toFixed(1);
  const reviews = formatNumber(product.reviewCount, locale);

  if (locale === "fr") {
    const parts: string[] = [];
    parts.push(
      labels.length > 0
        ? `Ses points forts : ${labels.join(", ")}`
        : `Un choix raisonnable au vu de la qualité et du prix (${formatPrice(product.price, locale)})`
    );
    if (product.rating >= 4.5) {
      parts.push(`il est aussi très bien noté (${rating}/5 sur ${reviews} avis)`);
    }
    return `${parts.join(", ")}. ${product.description.fr}`;
  }

  const parts: string[] = [];
  parts.push(
    labels.length > 0
      ? `Its strengths: ${labels.join(", ")}`
      : `A reasonable pick for the quality and price (${formatPrice(product.price, locale)})`
  );
  if (product.rating >= 4.5) {
    parts.push(`it's also highly rated (${rating}/5 from ${reviews} reviews)`);
  }
  return `${parts.join(", ")}. ${product.description.en}`;
}

function availabilityAnswer(product: Product, locale: Locale): string {
  if (locale === "fr") {
    if (product.availability === "in-stock") {
      return `Oui, il est actuellement en stock chez ${product.retailer.name}.`;
    }
    if (product.availability === "limited") {
      return `Il reste un stock limité chez ${product.retailer.name}.`;
    }
    return `Il est actuellement en rupture de stock chez ${product.retailer.name}.`;
  }
  if (product.availability === "in-stock") {
    return `Yes, it's currently in stock at ${product.retailer.name}.`;
  }
  if (product.availability === "limited") {
    return `Only limited stock left at ${product.retailer.name}.`;
  }
  return `It's currently out of stock at ${product.retailer.name}.`;
}

export function answerProductQuestion(
  product: Product,
  question: string,
  locale: Locale
): string {
  const text = question.trim();

  for (const topic of SPEC_TOPICS) {
    if (matchesAny(topic.patterns[locale], text)) {
      const answer = specAnswer(product, topic.labelKeys, locale);
      if (answer) return answer;
    }
  }

  if (matchesAny(PRICE_PATTERNS[locale], text)) {
    const price = formatPrice(product.price, locale);
    return locale === "fr"
      ? `Le prix actuel est de ${price} chez ${product.retailer.name}.`
      : `The current price is ${price} at ${product.retailer.name}.`;
  }

  if (matchesAny(STOCK_PATTERNS[locale], text)) {
    return availabilityAnswer(product, locale);
  }

  if (matchesAny(RATING_PATTERNS[locale], text)) {
    const rating = product.rating.toFixed(1);
    const reviews = formatNumber(product.reviewCount, locale);
    return locale === "fr"
      ? `Il est noté ${rating}/5 sur ${reviews} avis.`
      : `It's rated ${rating}/5 from ${reviews} reviews.`;
  }

  if (matchesAny(RETAILER_PATTERNS[locale], text)) {
    return locale === "fr"
      ? `Il est vendu par ${product.retailer.name}.`
      : `It's sold by ${product.retailer.name}.`;
  }

  if (matchesAny(WHY_GOOD_PATTERNS[locale], text)) {
    return whyGoodAnswer(product, locale);
  }

  for (const feature of FEATURE_KEYWORDS) {
    if (matchesAny(feature.patterns[locale], text)) {
      const has = product.tags.includes(feature.tag);
      const label = labelForTag(feature.tag, locale);
      if (locale === "fr") {
        return has
          ? `Oui, ce produit se distingue par : ${label}.`
          : "Ce n'est pas vraiment le point fort de ce produit — on n'a pas d'information précise là-dessus.";
      }
      return has
        ? `Yes — this product stands out for: ${label}.`
        : "That's not something this product is specifically known for.";
    }
  }

  for (const useCase of USE_CASE_KEYWORDS) {
    if (matchesAny(useCase.patterns[locale], text)) {
      const fits = product.tags.includes(useCase.tag);
      const label = labelForTag(useCase.tag, locale);
      if (locale === "fr") {
        return fits
          ? `Oui, c'est un bon choix pour : ${label}.`
          : "Ce n'est pas l'usage pour lequel ce produit est le plus recommandé.";
      }
      return fits
        ? `Yes, it's a good fit for: ${label}.`
        : "That's not the main use case this product is recommended for.";
    }
  }

  return locale === "fr"
    ? `Je n'ai pas de réponse précise à cette question, mais voici ce qu'on sait sur ce produit : ${product.description.fr}`
    : `I don't have a precise answer to that, but here's what we know about this product: ${product.description.en}`;
}
