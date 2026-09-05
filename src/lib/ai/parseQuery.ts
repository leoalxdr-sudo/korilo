import type { ParsedCriteria, ProductCategory } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import {
  CATEGORY_KEYWORDS,
  FEATURE_KEYWORDS,
  USE_CASE_KEYWORDS,
} from "@/lib/ai/keywords";

// Deterministic, heuristic natural-language parser. It stands in for a
// real LLM call today (see ai/index.ts) but returns the same shape one
// would, so the rest of the app never needs to know it's mocked. Every
// pattern set below is keyed by locale so the same logic understands
// both English and French queries.

// Accepts comma, dot, or any whitespace (\s matches regular and
// no-break spaces, covering the French "1 200" thousands grouping) as
// a thousands separator — or a plain unseparated run of digits ("1200",
// "800"). The lookaround assertions stop the engine from matching a
// trailing fragment of a larger number (e.g. reading "1000" as "000").
const MONEY = String.raw`(?<!\d)(\d{1,3}(?:[,.\s]\d{3})+|\d+)(?!\d)`;

const BUDGET_PATTERNS: Record<Locale, RegExp[]> = {
  en: [
    new RegExp(String.raw`(?:my )?budget(?:\s+(?:of|is|around))?\s*(?:€|eur)?\s*${MONEY}`, "i"),
    new RegExp(String.raw`(?:under|below|less than)\s*(?:€|eur)?\s*${MONEY}`, "i"),
    new RegExp(String.raw`max(?:imum)?\s*(?:€|eur)?\s*${MONEY}`, "i"),
    new RegExp(String.raw`(?:€|eur)\s*${MONEY}`, "i"),
    new RegExp(String.raw`${MONEY}\s*(?:€|eur)`, "i"),
  ],
  fr: [
    new RegExp(String.raw`(?:mon )?budget(?:\s+(?:de|est|autour de))?\s*(?:€|eur)?\s*${MONEY}`, "i"),
    new RegExp(String.raw`(?:moins de|sous|maximum|max)\s*(?:€|eur)?\s*${MONEY}`, "i"),
    new RegExp(String.raw`(?:€|eur|euros?)\s*${MONEY}`, "i"),
    new RegExp(String.raw`${MONEY}\s*(?:€|eur|euros?)`, "i"),
  ],
};

// GB/Go units both accepted regardless of locale — no ambiguity risk.
const RAM_PATTERN = /(\d{1,3})\s*(?:gb|go)\s*(?:of\s*|de\s*)?ram\b|ram\s*(?:of\s*|de\s*)?(\d{1,3})\s*(?:gb|go)/i;

function ramRequirementLabel(amount: string, locale: Locale): string {
  return locale === "fr" ? `${amount} Go de RAM minimum` : `${amount}GB RAM minimum`;
}

const HARD_SIGNAL_PREFIX: Record<Locale, RegExp> = {
  en: /(?:must have|must be|needs? to have|need to be|require[sd]?|has to have|essential(?:ly)?)\s+(?:a |an |the |to be )?/i,
  fr: /(?:doit avoir|doit être|(?:j’|j')?ai besoin de|nécessite|essentiel(?:lement)?)\s+(?:d’|d'|de |du |des |un |une |le |la |les )?/i,
};

const NEGATION_EN = /(?:don'?t|do not|doesn'?t|does not)/.source;

const LOW_PRIORITY_PATTERNS: Record<Locale, RegExp[]> = {
  en: [
    new RegExp(`${NEGATION_EN} care (?:really |much |that much )?about ([^.,;!?]+)`, "gi"),
    /no need for ([^.,;!?]+)/gi,
    new RegExp(`${NEGATION_EN} need ([^.,;!?]+)`, "gi"),
    /not (?:really |that )?(?:bothered|fussed) about ([^.,;!?]+)/gi,
  ],
  fr: [
    /(?:je )?me fiche (?:pas mal |un peu )?de ([^.,;!?]+)/gi,
    /(?:je n['’]|je ne )?ai pas besoin de ([^.,;!?]+)/gi,
    /peu importe (?:d['’]|de |du |des |le |la |les )?([^.,;!?]+)/gi,
    /pas besoin de ([^.,;!?]+)/gi,
  ],
};

function detectCategory(text: string, locale: Locale): ProductCategory | null {
  for (const { category, patterns } of CATEGORY_KEYWORDS) {
    if (patterns[locale].some((p) => p.test(text))) return category;
  }
  return null;
}

function detectBudget(
  text: string,
  locale: Locale
): { amount: number; span: string } | null {
  for (const pattern of BUDGET_PATTERNS[locale]) {
    const match = text.match(pattern);
    if (match?.[1]) {
      const value = parseInt(match[1].replace(/[,.\s]/g, ""), 10);
      if (!Number.isNaN(value)) return { amount: value, span: match[0] };
    }
  }
  return null;
}

function extractLowPrioritySpans(
  text: string,
  locale: Locale
): { tags: Set<string>; maskedText: string } {
  const tags = new Set<string>();
  let masked = text;

  for (const pattern of LOW_PRIORITY_PATTERNS[locale]) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const span = match[1] ?? "";
      for (const feature of FEATURE_KEYWORDS) {
        if (feature.patterns[locale].some((p) => p.test(span))) tags.add(feature.tag);
      }
      for (const useCase of USE_CASE_KEYWORDS) {
        if (useCase.patterns[locale].some((p) => p.test(span))) tags.add(useCase.tag);
      }
      // Blank out the whole matched phrase so it isn't re-picked up as a
      // preference or requirement by the passes below.
      masked = masked.replace(match[0], " ".repeat(match[0].length));
    }
  }

  return { tags, maskedText: masked };
}

function extractFeatures(text: string, excludeTags: Set<string>, locale: Locale) {
  const requirements = new Set<string>();
  const preferences = new Set<string>();

  for (const feature of FEATURE_KEYWORDS) {
    if (excludeTags.has(feature.tag)) continue;

    const hardPattern = new RegExp(
      HARD_SIGNAL_PREFIX[locale].source +
        `(?:[a-zà-ÿ\\s]{0,20})?(?:${feature.patterns[locale].map((p) => p.source).join("|")})`,
      "i"
    );

    if (hardPattern.test(text)) {
      requirements.add(feature.tag);
    } else if (feature.patterns[locale].some((p) => p.test(text))) {
      preferences.add(feature.tag);
    }
  }

  return { requirements, preferences };
}

function extractUseCases(text: string, excludeTags: Set<string>, locale: Locale): Set<string> {
  const useCases = new Set<string>();
  for (const useCase of USE_CASE_KEYWORDS) {
    if (excludeTags.has(useCase.tag)) continue;
    if (useCase.patterns[locale].some((p) => p.test(text))) useCases.add(useCase.tag);
  }
  return useCases;
}

export function parseQuery(
  query: string,
  previousCriteria: ParsedCriteria | null,
  locale: Locale
): ParsedCriteria {
  const text = query.trim();

  const category = detectCategory(text, locale) ?? previousCriteria?.category ?? null;
  const detectedBudget = detectBudget(text, locale);
  const budget = detectedBudget
    ? { max: detectedBudget.amount, currency: "EUR" as const }
    : previousCriteria?.budget ?? null;

  // Remove the budget phrase (e.g. "my budget is €1,200") before feature
  // detection, so the word "budget" isn't misread as a "budget-friendly"
  // preference.
  const textWithoutBudget = detectedBudget
    ? text.replace(detectedBudget.span, " ".repeat(detectedBudget.span.length))
    : text;

  const { tags: lowPriorityTags, maskedText } = extractLowPrioritySpans(
    textWithoutBudget,
    locale
  );
  const { requirements: hardTags, preferences: softTags } = extractFeatures(
    maskedText,
    lowPriorityTags,
    locale
  );
  const useCaseTags = extractUseCases(maskedText, lowPriorityTags, locale);

  const ramMatch = text.match(RAM_PATTERN);
  const requirements = new Set<string>(previousCriteria?.requirements ?? []);
  if (ramMatch) {
    const amount = ramMatch[1] ?? ramMatch[2];
    requirements.add(ramRequirementLabel(amount, locale));
  }
  for (const tag of hardTags) requirements.add(tag);

  const preferences = new Set<string>(previousCriteria?.preferences ?? []);
  for (const tag of softTags) preferences.add(tag);

  const useCases = new Set<string>(previousCriteria?.useCases ?? []);
  for (const tag of useCaseTags) useCases.add(tag);

  const lowPriorities = new Set<string>(previousCriteria?.lowPriorities ?? []);
  for (const tag of lowPriorityTags) {
    lowPriorities.add(tag);
    // A previously stated preference that the user now deprioritizes
    // should stop counting as a preference.
    preferences.delete(tag);
    requirements.delete(tag);
  }

  return {
    category,
    budget,
    requirements: [...requirements],
    preferences: [...preferences],
    useCases: [...useCases],
    lowPriorities: [...lowPriorities],
  };
}
