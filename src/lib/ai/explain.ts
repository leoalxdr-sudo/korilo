import type { MatchFactor, ParsedCriteria, Recommendation } from "@/lib/types";
import type { ScoredProduct } from "@/lib/ai/matchProducts";
import type { Locale } from "@/lib/i18n/locale";
import { labelForTag, requirementLabel } from "@/lib/ai/keywords";
import { formatNumber, formatPrice } from "@/lib/i18n/format";

const PRO_PHRASES: Record<Locale, Record<string, string>> = {
  en: {
    "noise-cancellation": "Excellent noise cancellation",
    "long-battery": "Long battery life",
    lightweight: "Lightweight and easy to carry",
    "great-camera": "Strong camera quality",
    "video-editing": "Handles video editing comfortably",
    budget: "Priced well below premium alternatives",
    premium: "Premium build quality",
    durable: "Built to last",
    cushioned: "Plush, comfortable cushioning",
    "long-distance": "Well suited to long-distance use",
    comfortable: "Comfortable for extended use",
    "fast-charging": "Charges quickly",
    gaming: "Strong gaming performance",
    "high-performance": "High overall performance",
    "water-resistant": "Water-resistant design",
    "sweat-resistant": "Sweat-resistant for workouts",
    compact: "Compact, easy to carry",
    "5g": "5G-ready",
  },
  fr: {
    "noise-cancellation": "Excellente réduction de bruit",
    "long-battery": "Longue autonomie",
    lightweight: "Léger et facile à transporter",
    "great-camera": "Très bonne qualité photo",
    "video-editing": "À l'aise pour le montage vidéo",
    budget: "Prix bien en dessous des alternatives premium",
    premium: "Finitions haut de gamme",
    durable: "Conçu pour durer",
    cushioned: "Amorti moelleux et confortable",
    "long-distance": "Bien adapté à la longue distance",
    comfortable: "Confortable sur de longues périodes",
    "fast-charging": "Se recharge rapidement",
    gaming: "Bonnes performances gaming",
    "high-performance": "Performances globales élevées",
    "water-resistant": "Conception résistante à l'eau",
    "sweat-resistant": "Résistant à la transpiration",
    compact: "Compact et facile à transporter",
    "5g": "Compatible 5G",
  },
};

function formatLabel(label: string): string {
  return label.charAt(0).toLowerCase() + label.slice(1);
}

function buildHeadline(
  scored: ScoredProduct,
  isBestMatch: boolean,
  locale: Locale
): string {
  // A deal breaker outranks every other framing, including "best
  // match" — a good price or high score should never read as an
  // endorsement of a product that fails a stated hard requirement.
  if (scored.unmetRequirements.length > 0) {
    if (locale === "fr") {
      return isBestMatch
        ? "Le plus proche, mais ne coche pas tout"
        : "Proche, mais manque une exigence";
    }
    return isBestMatch ? "Closest match, but doesn't check every box" : "Close, but misses one requirement";
  }

  if (locale === "fr") {
    if (isBestMatch) return "Le meilleur choix pour vos besoins";
    if (scored.budgetFit === "over") return "Au-dessus de votre budget, mais à considérer";
    if (scored.unmatchedPreferences.length === 0 && scored.matchedPreferences.length > 0) {
      return "Correspond exactement à votre demande";
    }
    return "Bonne alternative à votre meilleur match";
  }

  if (isBestMatch) return "Best overall for your needs";
  if (scored.budgetFit === "over") return "A step above your budget, but worth a look";
  if (scored.unmatchedPreferences.length === 0 && scored.matchedPreferences.length > 0) {
    return "Matches everything you asked for";
  }
  return "Strong alternative to your top match";
}

function buildReasoning(
  scored: ScoredProduct,
  criteria: ParsedCriteria,
  locale: Locale
): string {
  const parts: string[] = [];
  const topPreferences = scored.matchedPreferences
    .slice(0, 2)
    .map((tag) => labelForTag(tag, locale));

  if (locale === "fr") {
    if (topPreferences.length > 0) {
      parts.push(
        `Correspond à vos priorités sur ${topPreferences.map(formatLabel).join(" et ")}`
      );
    } else if (scored.matchedRequirements.length > 0) {
      parts.push("Répond aux exigences que vous avez fixées");
    } else {
      parts.push("Un choix raisonnable au vu de la qualité et du prix");
    }

    const useCaseLabel =
      scored.matchedUseCases.length > 0
        ? formatLabel(labelForTag(scored.matchedUseCases[0], locale))
        : null;
    if (useCaseLabel && !topPreferences.some((p) => formatLabel(p) === useCaseLabel)) {
      parts.push(`bien adapté pour ${useCaseLabel}`);
    }

    if (criteria.budget) {
      const price = formatPrice(criteria.budget.max, locale);
      if (scored.budgetFit === "under") {
        parts.push(`confortablement dans votre budget de ${price}`);
      } else if (scored.budgetFit === "at-ceiling") {
        parts.push(`tout juste dans votre budget de ${price}`);
      } else if (scored.budgetFit === "over") {
        parts.push(`bien qu'il dépasse votre budget de ${price}`);
      }
    }

    return parts.join(", ") + ".";
  }

  if (topPreferences.length > 0) {
    parts.push(
      `Matches your priorities on ${topPreferences.map(formatLabel).join(" and ")}`
    );
  } else if (scored.matchedRequirements.length > 0) {
    parts.push("Meets the requirements you set");
  } else {
    parts.push("A reasonable fit based on overall quality and price");
  }

  const useCaseLabel =
    scored.matchedUseCases.length > 0
      ? formatLabel(labelForTag(scored.matchedUseCases[0], locale))
      : null;
  if (useCaseLabel && !topPreferences.some((p) => formatLabel(p) === useCaseLabel)) {
    parts.push(`well suited for ${useCaseLabel}`);
  }

  if (criteria.budget) {
    const price = formatPrice(criteria.budget.max, locale);
    if (scored.budgetFit === "under") {
      parts.push(`comfortably within your ${price} budget`);
    } else if (scored.budgetFit === "at-ceiling") {
      parts.push(`right at your ${price} budget ceiling`);
    } else if (scored.budgetFit === "over") {
      parts.push(`though it runs above your ${price} budget`);
    }
  }

  return parts.join(", ") + ".";
}

function buildPros(scored: ScoredProduct, locale: Locale): string[] {
  const pros: string[] = [];
  const phrases = PRO_PHRASES[locale];

  for (const req of scored.matchedRequirements) {
    pros.push(
      locale === "fr"
        ? `Répond à votre exigence : ${requirementLabel(req, locale)}`
        : `Meets your requirement: ${requirementLabel(req, locale)}`
    );
  }
  for (const pref of scored.matchedPreferences) {
    pros.push(
      phrases[pref] ??
        (locale === "fr"
          ? `Bon point sur ${formatLabel(labelForTag(pref, locale))}`
          : `Strong on ${formatLabel(labelForTag(pref, locale))}`)
    );
  }
  if (scored.product.rating >= 4.6) {
    const rating = scored.product.rating.toFixed(1);
    const reviews = formatNumber(scored.product.reviewCount, locale);
    pros.push(
      locale === "fr"
        ? `Très bien noté : ${rating}/5 sur ${reviews} avis`
        : `Highly rated: ${rating}/5 from ${reviews} reviews`
    );
  }
  if (scored.budgetFit === "under") {
    pros.push(
      locale === "fr"
        ? "Confortablement dans votre budget"
        : "Comfortably within your stated budget"
    );
  }

  return [...new Set(pros)].slice(0, 4);
}

function buildCons(scored: ScoredProduct, locale: Locale): string[] {
  const cons: string[] = [];

  for (const req of scored.unmetRequirements) {
    cons.push(
      locale === "fr"
        ? `Ne répond pas à : ${requirementLabel(req, locale)}`
        : `Doesn't meet: ${requirementLabel(req, locale)}`
    );
  }
  for (const pref of scored.unmatchedPreferences.slice(0, 2)) {
    cons.push(
      locale === "fr"
        ? `Ne met pas particulièrement l'accent sur ${formatLabel(labelForTag(pref, locale))}`
        : `Doesn't particularly emphasize ${formatLabel(labelForTag(pref, locale))}`
    );
  }
  if (scored.budgetFit === "over") {
    const price = formatPrice(scored.product.price, locale);
    cons.push(
      locale === "fr"
        ? `Prix au-dessus de votre budget (${price})`
        : `Priced above your stated budget (${price})`
    );
  }
  if (scored.product.rating < 4.3) {
    const rating = scored.product.rating.toFixed(1);
    cons.push(
      locale === "fr"
        ? `Un peu moins bien noté que les alternatives (${rating}/5)`
        : `Rated a little lower than alternatives (${rating}/5)`
    );
  }

  if (cons.length === 0) {
    cons.push(
      locale === "fr"
        ? "Aucun inconvénient notable pour ce que vous recherchez"
        : "No significant drawbacks for what you're looking for"
    );
  }

  return [...new Set(cons)].slice(0, 3);
}

function buildFactors(
  scored: ScoredProduct,
  criteria: ParsedCriteria,
  locale: Locale
): MatchFactor[] {
  const factors: MatchFactor[] = [];
  const price = formatPrice(scored.product.price, locale);

  if (criteria.budget) {
    const budget = formatPrice(criteria.budget.max, locale);
    factors.push({
      label: locale === "fr" ? "Adéquation budget" : "Budget fit",
      detail:
        locale === "fr"
          ? scored.budgetFit === "over"
            ? `${price} dépasse votre budget de ${budget}`
            : `${price} correspond à votre budget de ${budget}`
          : scored.budgetFit === "over"
            ? `${price} is above your ${budget} budget`
            : `${price} fits within your ${budget} budget`,
      impact: scored.budgetFit === "over" ? "negative" : "positive",
    });
  }

  if (criteria.requirements.length > 0) {
    factors.push({
      label: locale === "fr" ? "Exigences" : "Requirements",
      detail:
        locale === "fr"
          ? scored.unmetRequirements.length === 0
            ? "Répond à toutes vos exigences"
            : `Manque ${scored.unmetRequirements.length} exigence(s) sur ${criteria.requirements.length}`
          : scored.unmetRequirements.length === 0
            ? "Meets all of your stated requirements"
            : `Misses ${scored.unmetRequirements.length} of ${criteria.requirements.length} requirements`,
      impact: scored.unmetRequirements.length === 0 ? "positive" : "negative",
    });
  }

  if (criteria.preferences.length > 0) {
    factors.push({
      label: locale === "fr" ? "Préférences" : "Preferences",
      detail:
        locale === "fr"
          ? `Correspond à ${scored.matchedPreferences.length} préférence(s) sur ${criteria.preferences.length}`
          : `Matches ${scored.matchedPreferences.length} of ${criteria.preferences.length} stated preferences`,
      impact: scored.matchedPreferences.length > 0 ? "positive" : "neutral",
    });
  }

  const rating = scored.product.rating.toFixed(1);
  const reviews = formatNumber(scored.product.reviewCount, locale);
  factors.push({
    label: locale === "fr" ? "Qualité" : "Quality",
    detail:
      locale === "fr" ? `${rating}/5 sur ${reviews} avis` : `${rating}/5 from ${reviews} reviews`,
    impact: scored.product.rating >= 4.4 ? "positive" : "neutral",
  });

  return factors;
}

export function buildRecommendation(
  scored: ScoredProduct,
  criteria: ParsedCriteria,
  isBestMatch: boolean,
  locale: Locale
): Recommendation {
  return {
    product: scored.product,
    matchScore: scored.score,
    headline: buildHeadline(scored, isBestMatch, locale),
    reasoning: buildReasoning(scored, criteria, locale),
    factors: buildFactors(scored, criteria, locale),
    pros: buildPros(scored, locale),
    cons: buildCons(scored, locale),
    dealBreakers: scored.unmetRequirements.map((req) => requirementLabel(req, locale)),
    isBestMatch,
  };
}
