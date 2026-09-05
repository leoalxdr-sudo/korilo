import type { ProductCategory } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";

// Shared vocabulary used by both the query parser and the matching/
// explanation engine, so a tag means the same thing everywhere: a word
// found in a user's query, a product's tag list, and a sentence Korilo
// shows back to the user. Every pattern set and label is keyed by
// locale so the same tag-based architecture understands and explains
// itself in either English or French.

type LocalePatterns = Record<Locale, RegExp[]>;

export const CATEGORY_KEYWORDS: Array<{
  category: ProductCategory;
  patterns: LocalePatterns;
}> = [
  {
    category: "laptop",
    patterns: {
      en: [/\blaptops?\b/i, /\bnotebooks?\b/i, /\bmacbooks?\b/i, /\bultrabooks?\b/i, /\bchromebooks?\b/i],
      fr: [/ordinateurs? portables?/i, /\bpc portables?\b/i, /macbooks?/i, /ultrabooks?/i, /chromebooks?/i],
    },
  },
  {
    category: "headphones",
    patterns: {
      en: [/\bheadphones?\b/i, /\bearbuds?\b/i, /\bearphones?\b/i, /\bairpods?\b/i, /\bheadset\b/i],
      fr: [/casques?(?:\s+audio)?/i, /écouteurs?/i, /airpods?/i],
    },
  },
  {
    category: "smartphone",
    patterns: {
      en: [/\bsmartphones?\b/i, /\bphones?\b/i, /\biphone\b/i, /\bandroid phone\b/i],
      fr: [/smartphones?/i, /téléphones?/i, /iphone/i],
    },
  },
  {
    category: "running-shoes",
    patterns: {
      en: [/\brunning shoes?\b/i, /\bsneakers?\b/i, /\btrainers?\b/i, /\brunners?\b/i, /\bjogging shoes?\b/i],
      fr: [/chaussures? de (?:course|running)/i, /baskets? de running/i, /runnings?\b/i],
    },
  },
  {
    category: "office-chairs",
    patterns: {
      en: [/\boffice chairs?\b/i, /\bdesk chairs?\b/i, /\bergonomic chairs?\b/i, /\bgaming chairs?\b/i],
      fr: [/chaises? de bureau/i, /fauteuils? de bureau/i, /chaises? ergonomiques?/i, /chaises? gaming/i],
    },
  },
  {
    category: "coffee-makers",
    patterns: {
      en: [/\bcoffee machines?\b/i, /\bcoffee makers?\b/i, /\bespresso machines?\b/i, /\bcafetières?\b/i],
      fr: [/machines? à café/i, /cafetières?/i, /machines? (?:à |)expresso/i],
    },
  },
  {
    category: "backpacks",
    patterns: {
      en: [/\bbackpacks?\b/i, /\brucksacks?\b/i, /\bschool bags?\b/i],
      fr: [/sacs? à dos/i],
    },
  },
  {
    category: "hair-dryers",
    patterns: {
      en: [/\bhair dryers?\b/i, /\bblow.?dryers?\b/i, /\bhairdryers?\b/i],
      fr: [/sèche.?cheveux/i, /sèchoirs? à cheveux/i],
    },
  },
];

export interface FeatureKeyword {
  tag: string;
  patterns: LocalePatterns;
}

export const FEATURE_KEYWORDS: FeatureKeyword[] = [
  {
    tag: "lightweight",
    patterns: {
      en: [/light\s?weight/i, /very light\b/i, /easy to carry/i],
      fr: [/légers?\b/i, /légères?\b/i, /poids plume/i],
    },
  },
  {
    tag: "long-battery",
    patterns: {
      en: [/good battery/i, /battery life/i, /long.?lasting battery/i, /battery lasts/i, /great battery/i],
      fr: [/bonne autonomie/i, /longue autonomie/i, /\bautonomie\b/i, /batterie.*durée/i],
    },
  },
  {
    tag: "video-editing",
    patterns: {
      en: [/video editing/i, /edit(?:ing)? videos?/i],
      fr: [/montage vidéo/i],
    },
  },
  {
    tag: "noise-cancellation",
    patterns: {
      en: [/noise.?cancel\w*/i, /\banc\b/i, /block(?:s|ing)? (?:out )?noise/i],
      fr: [/réduction (?:de |du )?bruit/i, /anti.?bruit/i, /suppression du bruit/i, /\banc\b/i],
    },
  },
  {
    tag: "gaming",
    patterns: {
      en: [/\bgaming\b/i, /play games/i, /for games/i],
      fr: [/\bgaming\b/i, /jeux vidéo/i, /pour jouer/i],
    },
  },
  {
    tag: "gaming-performance",
    patterns: {
      en: [/gaming performance/i],
      fr: [/performances? gaming/i],
    },
  },
  {
    tag: "great-camera",
    patterns: {
      en: [/(?:good|great|best|excellent) camera/i, /camera quality/i, /\bphotography\b/i],
      fr: [/(?:bon|excellent|bonne|excellente) (?:appareil photo|caméra)/i, /qualité (?:photo|appareil photo)/i, /photographie/i],
    },
  },
  {
    tag: "compact",
    patterns: {
      en: [/\bcompact\b/i, /small (?:size|phone|form)/i, /pocket.?friendly/i],
      fr: [/compactes?\b/i, /petit format/i],
    },
  },
  {
    tag: "durable",
    patterns: {
      en: [/\bdurable\b/i, /\brugged\b/i, /\btough\b/i, /withstand/i],
      fr: [/durable/i, /robuste/i, /\bsolide\b/i],
    },
  },
  {
    tag: "water-resistant",
    patterns: {
      en: [/water.?resistant/i, /waterproof/i],
      fr: [/résistante? à l'eau/i, /étanche/i],
    },
  },
  {
    tag: "fast-charging",
    patterns: {
      en: [/fast charg\w*/i, /quick charg\w*/i, /rapid charg\w*/i],
      fr: [/charge rapide/i, /recharge rapide/i],
    },
  },
  {
    tag: "premium",
    patterns: {
      en: [/\bpremium\b/i, /high.?end/i, /\bflagship\b/i],
      fr: [/\bpremium\b/i, /haut de gamme/i],
    },
  },
  {
    tag: "budget",
    patterns: {
      en: [/\bbudget\b/i, /\bcheap\b/i, /\baffordable\b/i, /inexpensive/i, /low cost/i],
      fr: [/abordable/i, /pas cher/i, /économique/i, /petit budget/i, /bon marché/i],
    },
  },
  {
    tag: "comfortable",
    patterns: {
      en: [/comfortable/i, /\bcomfy\b/i, /\bcomfort\b/i],
      fr: [/confortable/i, /\bconfort\b/i],
    },
  },
  {
    tag: "cushioned",
    patterns: {
      en: [/\bcushion\w*/i, /soft landing/i, /\bplush\b/i],
      fr: [/amorti/i, /rembourré/i],
    },
  },
  {
    tag: "long-distance",
    patterns: {
      en: [/long.?distance/i, /\bmarathon\b/i, /long runs?\b/i, /high mileage/i],
      fr: [/longue distance/i, /marathon/i, /endurance/i, /longs? trajets?/i],
    },
  },
  {
    tag: "trail",
    patterns: {
      en: [/\btrail\b/i, /off.?road/i],
      fr: [/\btrail\b/i, /hors piste/i],
    },
  },
  {
    tag: "stability",
    patterns: {
      en: [/\bstability\b/i, /stable ride/i, /overpronation/i],
      fr: [/stabilité/i],
    },
  },
  {
    tag: "large-screen",
    patterns: {
      en: [/large screen/i, /big screen/i, /large display/i],
      fr: [/grand écran/i],
    },
  },
  {
    tag: "touchscreen",
    patterns: {
      en: [/touch\s?screen/i],
      fr: [/écran tactile/i],
    },
  },
  {
    tag: "high-performance",
    patterns: {
      en: [/high performance/i, /\bpowerful\b/i, /fast processor/i],
      fr: [/haute performance/i, /\bpuissant/i],
    },
  },
  {
    tag: "5g",
    patterns: {
      en: [/\b5g\b/i],
      fr: [/\b5g\b/i],
    },
  },
  {
    tag: "oled-display",
    patterns: {
      en: [/\boled\b/i],
      fr: [/\boled\b/i],
    },
  },
  {
    tag: "carbon-plate",
    patterns: {
      en: [/carbon plate/i, /carbon.?plated/i],
      fr: [/plaque (?:en )?carbone/i],
    },
  },
  {
    tag: "sweat-resistant",
    patterns: {
      en: [/sweat.?resistant/i, /sweat.?proof/i],
      fr: [/résistante? à la transpiration/i, /anti.?transpiration/i],
    },
  },
  {
    tag: "wide-fit",
    patterns: {
      en: [/wide fit/i, /wide feet/i, /wide toe box/i],
      fr: [/pied large/i, /ajustement large/i],
    },
  },
  {
    tag: "ergonomic",
    patterns: {
      en: [/\bergonomic\b/i, /good posture/i, /back support/i],
      fr: [/ergonomique/i, /bonne posture/i, /soutien du dos/i],
    },
  },
  {
    tag: "lumbar-support",
    patterns: {
      en: [/lumbar support/i, /lower.?back support/i],
      fr: [/support lombaire/i, /soutien lombaire/i],
    },
  },
  {
    tag: "adjustable",
    patterns: {
      en: [/\badjustable\b/i, /fully adjustable/i],
      fr: [/réglable/i, /ajustable/i],
    },
  },
  {
    tag: "programmable",
    patterns: {
      en: [/programmable/i, /\btimer\b/i],
      fr: [/programmable/i, /avec minuterie/i],
    },
  },
  {
    tag: "milk-frother",
    patterns: {
      en: [/milk frother/i, /\bfrother\b/i, /steam wand/i],
      fr: [/mousseur à lait/i, /buse vapeur/i],
    },
  },
  {
    tag: "silent",
    patterns: {
      en: [/\bquiet\b/i, /\bsilent\b/i, /low noise/i],
      fr: [/\bsilencieux\b/i, /peu bruyant/i, /faible bruit/i],
    },
  },
  {
    tag: "ionic",
    patterns: {
      en: [/\bionic\b/i],
      fr: [/\bionique\b/i],
    },
  },
  {
    tag: "fast-drying",
    patterns: {
      en: [/fast.?drying/i, /dries? (?:hair )?quickly/i],
      fr: [/séchage rapide/i, /sèche rapidement/i],
    },
  },
];

export interface UseCaseKeyword {
  tag: string;
  patterns: LocalePatterns;
}

export const USE_CASE_KEYWORDS: UseCaseKeyword[] = [
  {
    tag: "university",
    patterns: {
      en: [/\buniversity\b/i, /\bcollege\b/i, /\bstudent\b/i, /\bstudying\b/i],
      fr: [/\bfac\b/i, /université/i, /faculté/i, /étudiants?/i],
    },
  },
  {
    tag: "video-editing",
    patterns: {
      en: [/video editing/i, /edit(?:ing)? videos?/i, /content creation/i],
      fr: [/montage vidéo/i, /création de contenu/i],
    },
  },
  {
    tag: "commuting",
    patterns: {
      en: [/\bcommut\w*/i],
      fr: [/trajets? domicile.travail/i, /\bnavette\b/i, /trajets? quotidiens?/i],
    },
  },
  {
    tag: "travel",
    patterns: {
      en: [/\btravel\w*/i, /\bflights?\b/i, /frequent flyer/i],
      fr: [/voyages?/i, /voyager/i, /\bvols?\b/i],
    },
  },
  {
    tag: "workout",
    patterns: {
      en: [/\bworkouts?\b/i, /\bgym\b/i, /\bexercis\w*/i],
      fr: [/\bsport\b/i, /entraînement/i, /salle de sport/i, /exercices?/i],
    },
  },
  {
    tag: "gaming",
    patterns: {
      en: [/\bgaming\b/i],
      fr: [/\bgaming\b/i, /\bjeux\b/i],
    },
  },
  {
    tag: "business",
    patterns: {
      en: [/\bwork\b/i, /\bbusiness\b/i, /\boffice\b/i],
      fr: [/\btravail\b/i, /\bbureau\b/i, /professionnel/i],
    },
  },
  {
    tag: "race-day",
    patterns: {
      en: [/\brac(?:e|ing)\b/i],
      fr: [/\bcourses?\b/i, /compétition/i],
    },
  },
  {
    tag: "daily-trainer",
    patterns: {
      en: [/everyday runs?/i, /daily runs?/i, /daily mileage/i],
      fr: [/courses? quotidiennes?/i, /entraînement quotidien/i],
    },
  },
];

// Which product tags are relevant to a given use case, used to give a
// contextual scoring boost even when the user never named the feature
// directly (e.g. "for commuting" implicitly favors noise cancellation).
// Locale-independent — these are internal product tags, not user text.
export const USE_CASE_RELEVANT_TAGS: Record<string, string[]> = {
  university: ["lightweight", "long-battery", "budget", "student", "portable"],
  business: ["business", "durable", "premium"],
  "video-editing": ["video-editing", "high-performance", "high-res-display", "oled-display"],
  commuting: ["noise-cancellation", "compact", "long-battery", "portable"],
  travel: ["long-battery", "compact", "lightweight", "noise-cancellation"],
  workout: ["sweat-resistant", "durable", "workout"],
  gaming: ["gaming", "gaming-performance", "high-performance"],
  "race-day": ["race-day", "carbon-plate", "lightweight"],
  "daily-trainer": ["daily-trainer", "cushioned", "beginner-friendly"],
};

const TAG_LABELS: Record<Locale, Record<string, string>> = {
  en: {
    lightweight: "Lightweight",
    "long-battery": "Long battery life",
    "video-editing": "Video editing",
    "noise-cancellation": "Noise cancellation",
    gaming: "Gaming performance",
    "gaming-performance": "Gaming performance",
    "great-camera": "Camera quality",
    compact: "Compact size",
    durable: "Durability",
    "water-resistant": "Water resistance",
    "fast-charging": "Fast charging",
    premium: "Premium build",
    budget: "Budget-friendly",
    comfortable: "Comfort",
    cushioned: "Cushioning",
    "long-distance": "Long-distance performance",
    trail: "Trail-ready",
    stability: "Stability",
    "large-screen": "Large display",
    touchscreen: "Touchscreen",
    "high-performance": "High performance",
    "5g": "5G connectivity",
    "oled-display": "OLED display",
    "carbon-plate": "Carbon plate",
    "sweat-resistant": "Sweat resistance",
    "wide-fit": "Wide fit",
    university: "University",
    commuting: "Commuting",
    travel: "Travel",
    workout: "Workouts",
    business: "Work / business",
    "race-day": "Racing",
    "daily-trainer": "Everyday training",
    student: "Student-friendly",
    portable: "Portable",
    silent: "Silent operation",
    "high-res-display": "High-resolution display",
    "multipoint-bluetooth": "Multi-device Bluetooth",
    "studio-quality": "Studio-quality audio",
    "over-ear": "Over-ear fit",
    "in-ear": "In-ear fit",
    "night-photography": "Night photography",
    "beginner-friendly": "Beginner-friendly",
    road: "Road running",
    "2-in-1": "2-in-1 convertible",
    "upgradeable-ram": "Upgradeable RAM",
    ergonomic: "Ergonomic design",
    "lumbar-support": "Lumbar support",
    adjustable: "Adjustable",
    programmable: "Programmable",
    "milk-frother": "Milk frother",
    ionic: "Ionic technology",
    "fast-drying": "Fast drying",
  },
  fr: {
    lightweight: "Léger",
    "long-battery": "Bonne autonomie",
    "video-editing": "Montage vidéo",
    "noise-cancellation": "Réduction de bruit",
    gaming: "Jeux",
    "gaming-performance": "Performances gaming",
    "great-camera": "Qualité photo",
    compact: "Compact",
    durable: "Durabilité",
    "water-resistant": "Résistance à l'eau",
    "fast-charging": "Charge rapide",
    premium: "Haut de gamme",
    budget: "Économique",
    comfortable: "Confort",
    cushioned: "Amorti",
    "long-distance": "Longue distance",
    trail: "Trail",
    stability: "Stabilité",
    "large-screen": "Grand écran",
    touchscreen: "Écran tactile",
    "high-performance": "Haute performance",
    "5g": "5G",
    "oled-display": "Écran OLED",
    "carbon-plate": "Plaque carbone",
    "sweat-resistant": "Résistance à la transpiration",
    "wide-fit": "Ajustement large",
    university: "Université",
    commuting: "Trajets",
    travel: "Voyage",
    workout: "Sport",
    business: "Travail",
    "race-day": "Course",
    "daily-trainer": "Course quotidienne",
    student: "Adapté aux étudiants",
    portable: "Portable",
    silent: "Fonctionnement silencieux",
    "high-res-display": "Écran haute résolution",
    "multipoint-bluetooth": "Bluetooth multi-appareils",
    "studio-quality": "Son qualité studio",
    "over-ear": "Circum-aural",
    "in-ear": "Intra-auriculaire",
    "night-photography": "Photo de nuit",
    "beginner-friendly": "Adapté aux débutants",
    road: "Route",
    "2-in-1": "Convertible 2-en-1",
    "upgradeable-ram": "RAM évolutive",
    ergonomic: "Design ergonomique",
    "lumbar-support": "Support lombaire",
    adjustable: "Réglable",
    programmable: "Programmable",
    "milk-frother": "Mousseur à lait",
    ionic: "Technologie ionique",
    "fast-drying": "Séchage rapide",
  },
};

export function labelForTag(tag: string, locale: Locale): string {
  return TAG_LABELS[locale][tag] ?? tag.replace(/-/g, " ");
}

// Requirements are either a feature tag (looked up via labelForTag) or a
// synthesized numeric constraint like "16GB RAM minimum"/"16 Go de RAM
// minimum", which is already human-readable as-is.
export const RAM_REQUIREMENT_PATTERN = /^(\d+)\s*(?:GB|Go) (?:RAM|de RAM) minimum$/i;

export function requirementLabel(requirement: string, locale: Locale): string {
  if (RAM_REQUIREMENT_PATTERN.test(requirement)) return requirement;
  return labelForTag(requirement, locale);
}
