import type { Locale } from "@/lib/i18n/locale";
import type { ProductCategory } from "@/lib/types";

export interface Dictionary {
  nav: {
    howItWorks: string;
    explore: string;
    about: string;
    signIn: string;
    comingSoon: string;
    openMenu: string;
    wishlist: string;
    planner: string;
  };
  footer: {
    tagline: string;
    about: string;
    howItWorks: string;
    privacy: string;
    terms: string;
    contact: string;
    copyright: (year: number) => string;
  };
  hero: { title: string; subtitle: string };
  searchInput: { ariaLabel: string; submit: string };
  examplePrompt: { label: string };
  howItWorks: {
    title: string;
    steps: { number: string; title: string; description: string }[];
  };
  productPreview: {
    previewQuery: string;
    title: string;
    subtitle: string;
    cta: string;
  };
  trust: { title: string; subtitle: string; factors: string[] };
  finalCta: { title: string; subtitle: string; cta: string };
  history: {
    title: string;
    seeAllResults: string;
    clearAll: string;
    removeAria: (query: string) => string;
    errorMessage: string;
  };
  recentlyViewed: {
    title: string;
  };
  trending: {
    title: string;
  };
  wishlist: {
    pageTitle: string;
    empty: string;
    startSearch: string;
    addAria: (name: string) => string;
    removeAria: (name: string) => string;
  };
  quiz: {
    freeTextTab: string;
    guidedTab: string;
    swipeHint: string;
    categoryLabel: string;
    anyCategory: string;
    budgetLabel: string;
    anyBudget: string;
    prioritiesLabel: string;
    submit: string;
    resultsLabel: string;
  };
  searchExperience: {
    yourRequest: string;
    recommendsSubtitle: string;
    searchStats: (considered: string, stores: string) => string;
    alsoLikeTitle: string;
    alsoLikeSubtitle: string;
    errorMessage: string;
    retry: string;
    noResults: string;
  };
  criteria: {
    searching: string;
    allCategories: string;
    budget: string;
    requires: string;
    priority: string;
    use: string;
    lowPriority: string;
    remove: (prefix: string, label: string) => string;
  };
  filters: {
    title: string;
    reset: string;
    sortBy: string;
    sortMatch: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    sortRating: string;
    price: string;
    brand: string;
    minRating: string;
    anyRating: string;
    inStockOnly: string;
    showFilters: string;
    hideFilters: string;
    apply: string;
    noResults: string;
  };
  productCard: {
    bestMatch: string;
    viewDetails: string;
    compare: string;
    selectAria: (name: string) => string;
    dealBreakerTitle: string;
    dealBreakerBadge: string;
  };
  matchScore: { ariaLabel: (score: number) => string; tooltip: string };
  compareDrawer: {
    removeAria: (name: string) => string;
    clear: string;
    compare: (count: number) => string;
    selectAtLeastTwo: string;
  };
  compareTable: {
    koriloMatch: string;
    price: string;
    retailer: string;
    rating: string;
    availability: string;
    bestFor: string;
    inStock: string;
    limitedStock: string;
    outOfStock: string;
  };
  comparePage: {
    title: string;
    emptyMessage: string;
    startSearch: string;
    summaryTitle: string;
    convinceMeTitle: string;
    reasonsForTitle: (name: string) => string;
    reasonsAgainstTitle: string;
    verdictLabel: string;
  };
  productPage: {
    back: string;
    visit: (retailer: string) => string;
    inStock: string;
    limitedStock: string;
    outOfStock: string;
    prosAndCons: string;
    specifications: string;
    alsoLike: string;
    verdictTitle: string;
    notRecommendedTitle: string;
    notRecommendedHeadline: string;
    priceHistoryTitle: string;
    priceHistoryToday: string;
    priceHistoryLowest: string;
    priceHistoryAverage: string;
    buyTimingGood: (percent: string) => string;
    buyTimingWait: (percent: string) => string;
    otherOffersTitle: string;
    otherOffersSubtitle: string;
    cheaper: string;
    bestValueTitle: string;
    bestValueMatch: (percent: number) => string;
    bestValueSavings: (price: string) => string;
    worthMoreTitle: string;
    worthMorePriceDiff: (price: string) => string;
    worthMoreRating: (delta: string) => string;
    realCostTitle: string;
    realCostSubtitle: string;
    realCostHint: string;
    realCostBasePrice: string;
    realCostTotal: string;
    priceHistoryTab: string;
    realCostTab: string;
    priceAlertTab: string;
    comparisonTitle: string;
    comparisonAlternativesTab: string;
  };
  productQA: {
    title: string;
    subtitle: string;
    placeholder: string;
    ariaLabel: string;
    submit: string;
  };
  priceAlert: {
    title: string;
    subtitle: string;
    create: string;
    active: (price: string) => string;
    remove: string;
    removed: string;
    metTitle: string;
    metDescription: (price: string) => string;
    savedTitle: string;
    savedDescription: (price: string) => string;
    manageTitle: string;
    manageEmpty: string;
  };
  planner: {
    title: string;
    subtitle: string;
    categoriesLabel: string;
    budgetLabel: string;
    submit: string;
    selectAtLeastOne: string;
    resultsTitle: string;
    totalLabel: string;
    remainingLabel: (amount: string) => string;
    overBudgetLabel: (amount: string) => string;
    infeasibleTitle: string;
    infeasibleMessage: (shortfall: string) => string;
    swapLabel: string;
    startOver: string;
  };
  notFound: { code: string; title: string; subtitle: string; cta: string };
  privacy: { title: string; paragraphs: string[] };
  terms: { title: string; paragraphs: string[] };
  category: Record<ProductCategory, string>;
}

const dictionary: Record<Locale, Dictionary> = {
  en: {
    nav: {
      howItWorks: "How it works",
      explore: "Explore",
      about: "About",
      signIn: "Sign in",
      comingSoon: "Coming soon",
      openMenu: "Open menu",
      wishlist: "Wishlist",
      planner: "Planner",
    },
    footer: {
      tagline: "Your AI shopping advisor. Tell us what you need — we'll find what fits.",
      about: "About",
      howItWorks: "How it works",
      privacy: "Privacy",
      terms: "Terms",
      contact: "Contact",
      copyright: (year: number) =>
        `© ${year} Korilo. Product data shown is illustrative and for demonstration purposes.`,
    },
    hero: {
      title: "Tell us what you're looking for.",
      subtitle:
        "Your AI shopping advisor that finds and compares products based on what actually matters to you.",
    },
    searchInput: {
      ariaLabel: "Describe what you're looking for",
      submit: "Find my match",
    },
    examplePrompt: {
      label: "Try:",
    },
    howItWorks: {
      title: "How Korilo works",
      steps: [
        {
          number: "01",
          title: "Tell us what you need",
          description: "Describe your needs naturally, in your own words.",
        },
        {
          number: "02",
          title: "Korilo does the research",
          description: "Korilo analyzes your criteria and compares relevant products.",
        },
        {
          number: "03",
          title: "Get your best matches",
          description: "See the products that best fit your needs, and why.",
        },
      ],
    },
    productPreview: {
      previewQuery:
        "I need an ergonomic office chair with lumbar support, budget under €300.",
      title: "Your best matches",
      subtitle:
        "A real example: someone asked Korilo for an ergonomic office chair with lumbar support, under €300 — not a laptop. Here's what it found.",
      cta: "Try your own request",
    },
    trust: {
      title: "More than just the lowest price",
      subtitle:
        "Korilo weighs the factors that actually determine whether a product is right for you — not just which one is cheapest.",
      factors: [
        "Budget",
        "Performance",
        "Quality",
        "Reviews",
        "Features",
        "Durability & availability",
        "Personal preferences",
      ],
    },
    finalCta: {
      title: "Stop searching. Start finding.",
      subtitle: "Let Korilo find what fits you.",
      cta: "Try Korilo",
    },
    history: {
      title: "Your previous searches",
      seeAllResults: "See all results",
      clearAll: "Clear history",
      removeAria: (query: string) => `Remove search: ${query}`,
      errorMessage: "Couldn't run that search. Please try again.",
    },
    recentlyViewed: {
      title: "Recently viewed",
    },
    trending: {
      title: "Trending",
    },
    wishlist: {
      pageTitle: "Your wishlist",
      empty: "No products saved yet. Tap the heart on a product to save it here.",
      startSearch: "Start a search",
      addAria: (name: string) => `Add ${name} to wishlist`,
      removeAria: (name: string) => `Remove ${name} from wishlist`,
    },
    quiz: {
      freeTextTab: "Free text",
      guidedTab: "Guided quiz",
      swipeHint: "Swipe or tap to switch",
      categoryLabel: "Category",
      anyCategory: "Any category",
      budgetLabel: "Budget",
      anyBudget: "No limit",
      prioritiesLabel: "What matters to you",
      submit: "See my matches",
      resultsLabel: "Guided search",
    },
    searchExperience: {
      yourRequest: "Your request",
      recommendsSubtitle: "recommends this for you:",
      searchStats: (considered: string, stores: string) =>
        `Compared ${considered} products across ${stores}+ partner stores.`,
      alsoLikeTitle: "You might also like",
      alsoLikeSubtitle: "Not quite as close a match, but still worth a look.",
      errorMessage: "Couldn't update your results. Please try again.",
      retry: "Retry",
      noResults: "No products matched those criteria. Try removing a filter above.",
    },
    criteria: {
      searching: "Searching:",
      allCategories: "All categories",
      budget: "Budget",
      requires: "Requires",
      priority: "Priority",
      use: "Use",
      lowPriority: "Low priority",
      remove: (prefix: string, label: string) => `Remove ${prefix.toLowerCase()}: ${label}`,
    },
    filters: {
      title: "Filters",
      reset: "Reset filters",
      sortBy: "Sort by",
      sortMatch: "Best match",
      sortPriceAsc: "Price: low to high",
      sortPriceDesc: "Price: high to low",
      sortRating: "Rating",
      price: "Price",
      brand: "Brand",
      minRating: "Minimum rating",
      anyRating: "Any rating",
      inStockOnly: "In stock only",
      showFilters: "Show filters",
      hideFilters: "Hide filters",
      apply: "Show results",
      noResults: "No products match these filters. Try loosening one.",
    },
    productCard: {
      bestMatch: "Best match",
      viewDetails: "View details",
      compare: "Compare",
      selectAria: (name: string) => `Select ${name} to compare`,
      dealBreakerTitle: "Deal breaker",
      dealBreakerBadge: "Deal breaker",
    },
    matchScore: {
      ariaLabel: (score: number) => `${score} percent Korilo match score. See explanation.`,
      tooltip:
        "Korilo compatibility score, based on how well this product fits the budget, requirements, and preferences you told us — not an independent or scientific rating.",
    },
    compareDrawer: {
      removeAria: (name: string) => `Remove ${name} from comparison`,
      clear: "Clear",
      compare: (count: number) => (count > 0 ? `Compare (${count})` : "Compare"),
      selectAtLeastTwo: "Select at least 2 products to compare",
    },
    compareTable: {
      koriloMatch: "Korilo match",
      price: "Price",
      retailer: "Retailer",
      rating: "Rating",
      availability: "Availability",
      bestFor: "Best for",
      inStock: "In stock",
      limitedStock: "Limited stock",
      outOfStock: "Out of stock",
    },
    comparePage: {
      title: "Compare products",
      emptyMessage: "Select at least two products from your search results to compare them here.",
      startSearch: "Start a search",
      summaryTitle: "Korilo's comparison summary",
      convinceMeTitle: "Convince me",
      reasonsForTitle: (name: string) => `Why buy the ${name}`,
      reasonsAgainstTitle: "Why you might regret it",
      verdictLabel: "Verdict",
    },
    productPage: {
      back: "Back",
      visit: (retailer: string) => `Visit ${retailer}`,
      inStock: "In stock at retailer",
      limitedStock: "Limited stock at retailer",
      outOfStock: "Currently out of stock",
      prosAndCons: "Pros & cons",
      specifications: "Specifications",
      alsoLike: "You might also like",
      verdictTitle: "Quick verdict",
      notRecommendedTitle: "We wouldn't recommend this one",
      notRecommendedHeadline: "Doesn't fit what you're looking for",
      priceHistoryTitle: "Price history (90 days)",
      priceHistoryToday: "Today",
      priceHistoryLowest: "Lowest",
      priceHistoryAverage: "Average",
      buyTimingGood: (percent: string) => `Good time to buy — ${percent} below its 90-day average.`,
      buyTimingWait: (percent: string) => `Unusually high right now — ${percent} above its 90-day average.`,
      otherOffersTitle: "You can also find it here",
      otherOffersSubtitle: "Other sites list this same product, sometimes at a different price.",
      cheaper: "Cheaper",
      bestValueTitle: "Best value",
      bestValueMatch: (percent: number) => `${percent}% match`,
      bestValueSavings: (price: string) => `${price} less than this one`,
      worthMoreTitle: "Worth spending more?",
      worthMorePriceDiff: (price: string) => `+${price}`,
      worthMoreRating: (delta: string) => `+${delta}★ rating`,
      realCostTitle: "Estimated real cost",
      realCostSubtitle: "Accessories commonly bought alongside this product.",
      realCostHint: "Uncheck anything you don't need.",
      realCostBasePrice: "Listed price",
      realCostTotal: "Estimated total",
      priceHistoryTab: "History",
      realCostTab: "Real cost",
      priceAlertTab: "Price alert",
      comparisonTitle: "Compare",
      comparisonAlternativesTab: "Alternatives",
    },
    productQA: {
      title: "Ask about this product",
      subtitle: "Want a specific detail? Ask and Korilo will answer using what it knows about this product.",
      placeholder: "e.g. \"How much RAM does it have?\" or \"Is it good for travel?\"",
      ariaLabel: "Ask a question about this product",
      submit: "Ask",
    },
    priceAlert: {
      title: "Price alert",
      subtitle: "We'll flag it if the price drops — no need to guess a target.",
      create: "Notify me on a drop",
      active: (price: string) => `Alert active — we'll flag anything below ${price}`,
      remove: "Remove",
      removed: "Alert removed",
      metTitle: "Good news!",
      metDescription: (price: string) =>
        `Already found cheaper at ${price} — check the other retailers below.`,
      savedTitle: "Alert activated",
      savedDescription: (price: string) =>
        `We'll flag it if the price drops under ${price}. (Demo: checked once now, not tracked live yet.)`,
      manageTitle: "Your price alerts",
      manageEmpty: "No price alerts yet. Set one from any product page.",
    },
    planner: {
      title: "Shopping planner",
      subtitle: "Pick what you need and a total budget — Korilo splits it and builds the kit.",
      categoriesLabel: "What do you need?",
      budgetLabel: "Total budget",
      submit: "Build my kit",
      selectAtLeastOne: "Select at least one category.",
      resultsTitle: "Your kit",
      totalLabel: "Kit total",
      remainingLabel: (amount: string) => `${amount} left in your budget`,
      overBudgetLabel: (amount: string) => `${amount} over your budget`,
      infeasibleTitle: "That budget is a bit tight",
      infeasibleMessage: (shortfall: string) =>
        `Even the cheapest option in each category needs ${shortfall} more. Here's that minimal kit anyway.`,
      swapLabel: "Swap this pick",
      startOver: "Start over",
    },
    notFound: {
      code: "404",
      title: "We couldn't find that page",
      subtitle: "The page you're looking for doesn't exist, or the link may be out of date.",
      cta: "Back to Korilo",
    },
    privacy: {
      title: "Privacy",
      paragraphs: [
        "Korilo is currently an early-stage product demo. The searches you run are used only to generate your recommendations in the moment — this preview build does not create accounts, store purchase history, or share your queries with third parties.",
        "When Korilo integrates real retailer and affiliate partners, this page will describe exactly what data is collected and how it is used.",
      ],
    },
    terms: {
      title: "Terms",
      paragraphs: [
        "Korilo is an early-stage product demo. Product listings, prices, and retailers shown are illustrative mock data used to demonstrate the recommendation experience, not live offers.",
        "Match scores are a Korilo compatibility estimate based on your stated preferences — not a guarantee of product suitability, availability, or price accuracy. Always verify details with the retailer before purchasing.",
      ],
    },
    category: {
      laptop: "Laptops",
      headphones: "Headphones",
      smartphone: "Smartphones",
      "running-shoes": "Running shoes",
      "office-chairs": "Office chairs",
      "coffee-makers": "Coffee makers",
      backpacks: "Backpacks",
      "hair-dryers": "Hair dryers",
    },
  },
  fr: {
    nav: {
      howItWorks: "Comment ça marche",
      explore: "Découvrir",
      about: "À propos",
      signIn: "Connexion",
      comingSoon: "Bientôt disponible",
      openMenu: "Ouvrir le menu",
      wishlist: "Favoris",
      planner: "Planificateur",
    },
    footer: {
      tagline: "Votre conseiller d'achat IA. Dites-nous ce qu'il vous faut — on trouve ce qui vous convient.",
      about: "À propos",
      howItWorks: "Comment ça marche",
      privacy: "Confidentialité",
      terms: "Conditions",
      contact: "Contact",
      copyright: (year: number) =>
        `© ${year} Korilo. Les données produits affichées sont illustratives et à but de démonstration.`,
    },
    hero: {
      title: "Dites-nous ce que vous cherchez.",
      subtitle:
        "Votre conseiller d'achat IA qui trouve et compare les produits selon ce qui compte vraiment pour vous.",
    },
    searchInput: {
      ariaLabel: "Décrivez ce que vous recherchez",
      submit: "Trouver mon match",
    },
    examplePrompt: {
      label: "Essayez :",
    },
    howItWorks: {
      title: "Comment fonctionne Korilo",
      steps: [
        {
          number: "01",
          title: "Dites-nous ce qu'il vous faut",
          description: "Décrivez vos besoins naturellement, avec vos propres mots.",
        },
        {
          number: "02",
          title: "Korilo fait la recherche",
          description: "Korilo analyse vos critères et compare les produits pertinents.",
        },
        {
          number: "03",
          title: "Découvrez vos meilleurs choix",
          description: "Voyez les produits qui correspondent le mieux à vos besoins, et pourquoi.",
        },
      ],
    },
    productPreview: {
      previewQuery:
        "J'ai besoin d'une chaise de bureau ergonomique avec support lombaire, budget sous 300 €.",
      title: "Vos meilleurs matchs",
      subtitle:
        "Un exemple concret : quelqu'un a demandé à Korilo une chaise de bureau ergonomique avec support lombaire, sous 300 € — pas un ordinateur. Voici ce qu'il a trouvé.",
      cta: "Essayez votre propre recherche",
    },
    trust: {
      title: "Bien plus que le prix le plus bas",
      subtitle:
        "Korilo pondère les facteurs qui déterminent vraiment si un produit vous convient — pas juste lequel est le moins cher.",
      factors: [
        "Budget",
        "Performance",
        "Qualité",
        "Avis",
        "Fonctionnalités",
        "Durabilité et disponibilité",
        "Préférences personnelles",
      ],
    },
    finalCta: {
      title: "Arrêtez de chercher. Commencez à trouver.",
      subtitle: "Laissez Korilo trouver ce qui vous convient.",
      cta: "Essayer Korilo",
    },
    history: {
      title: "Vos recherches précédentes",
      seeAllResults: "Voir tous les résultats",
      clearAll: "Effacer l'historique",
      removeAria: (query: string) => `Supprimer la recherche : ${query}`,
      errorMessage: "Impossible d'effectuer cette recherche. Veuillez réessayer.",
    },
    recentlyViewed: {
      title: "Vus récemment",
    },
    trending: {
      title: "Tendances",
    },
    wishlist: {
      pageTitle: "Vos favoris",
      empty: "Aucun produit enregistré pour l'instant. Appuyez sur le cœur d'un produit pour l'ajouter ici.",
      startSearch: "Lancer une recherche",
      addAria: (name: string) => `Ajouter ${name} aux favoris`,
      removeAria: (name: string) => `Retirer ${name} des favoris`,
    },
    quiz: {
      freeTextTab: "Texte libre",
      guidedTab: "Questionnaire guidé",
      swipeHint: "Glissez ou appuyez pour basculer",
      categoryLabel: "Catégorie",
      anyCategory: "Toutes catégories",
      budgetLabel: "Budget",
      anyBudget: "Peu importe",
      prioritiesLabel: "Ce qui compte pour vous",
      submit: "Voir mes résultats",
      resultsLabel: "Recherche guidée",
    },
    searchExperience: {
      yourRequest: "Votre demande",
      recommendsSubtitle: "vous recommande :",
      searchStats: (considered: string, stores: string) =>
        `${considered} produits comparés chez plus de ${stores} enseignes partenaires.`,
      alsoLikeTitle: "Vous pourriez aussi aimer",
      alsoLikeSubtitle: "Ces articles correspondent un peu moins à votre recherche, mais restent intéressants.",
      errorMessage: "Impossible de mettre à jour vos résultats. Veuillez réessayer.",
      retry: "Réessayer",
      noResults: "Aucun produit ne correspond à ces critères. Essayez de retirer un filtre ci-dessus.",
    },
    criteria: {
      searching: "Recherche :",
      allCategories: "Toutes catégories",
      budget: "Budget",
      requires: "Requis",
      priority: "Priorité",
      use: "Usage",
      lowPriority: "Peu important",
      remove: (prefix: string, label: string) => `Retirer ${prefix.toLowerCase()} : ${label}`,
    },
    filters: {
      title: "Filtres",
      reset: "Réinitialiser les filtres",
      sortBy: "Trier par",
      sortMatch: "Meilleur match",
      sortPriceAsc: "Prix croissant",
      sortPriceDesc: "Prix décroissant",
      sortRating: "Note",
      price: "Prix",
      brand: "Marque",
      minRating: "Note minimale",
      anyRating: "Toutes notes",
      inStockOnly: "En stock uniquement",
      showFilters: "Afficher les filtres",
      hideFilters: "Masquer les filtres",
      apply: "Afficher les résultats",
      noResults: "Aucun produit ne correspond à ces filtres. Essayez d'en assouplir un.",
    },
    productCard: {
      bestMatch: "Meilleur match",
      viewDetails: "Voir les détails",
      compare: "Comparer",
      selectAria: (name: string) => `Sélectionner ${name} pour comparer`,
      dealBreakerTitle: "Point bloquant",
      dealBreakerBadge: "Point bloquant",
    },
    matchScore: {
      ariaLabel: (score: number) => `Score de compatibilité Korilo de ${score} pour cent. Voir l'explication.`,
      tooltip:
        "Score de compatibilité Korilo, basé sur l'adéquation entre ce produit et le budget, les exigences et les préférences que vous avez indiqués — ce n'est pas une note indépendante ou scientifique.",
    },
    compareDrawer: {
      removeAria: (name: string) => `Retirer ${name} de la comparaison`,
      clear: "Effacer",
      compare: (count: number) => (count > 0 ? `Comparer (${count})` : "Comparer"),
      selectAtLeastTwo: "Sélectionnez au moins 2 produits pour comparer",
    },
    compareTable: {
      koriloMatch: "Match Korilo",
      price: "Prix",
      retailer: "Revendeur",
      rating: "Note",
      availability: "Disponibilité",
      bestFor: "Idéal pour",
      inStock: "En stock",
      limitedStock: "Stock limité",
      outOfStock: "Rupture de stock",
    },
    comparePage: {
      title: "Comparer les produits",
      emptyMessage: "Sélectionnez au moins deux produits depuis vos résultats de recherche pour les comparer ici.",
      startSearch: "Lancer une recherche",
      summaryTitle: "Le résumé de Korilo",
      convinceMeTitle: "Convaincs-moi",
      reasonsForTitle: (name: string) => `Pourquoi choisir le ${name}`,
      reasonsAgainstTitle: "Pourquoi tu pourrais le regretter",
      verdictLabel: "Verdict",
    },
    productPage: {
      back: "Retour",
      visit: (retailer: string) => `Visiter ${retailer}`,
      inStock: "En stock chez le revendeur",
      limitedStock: "Stock limité chez le revendeur",
      outOfStock: "Actuellement en rupture de stock",
      prosAndCons: "Avantages et inconvénients",
      specifications: "Caractéristiques",
      alsoLike: "Vous pourriez aussi aimer",
      verdictTitle: "Verdict rapide",
      notRecommendedTitle: "On ne recommande pas ce produit",
      notRecommendedHeadline: "Ne correspond pas à ce que vous recherchez",
      priceHistoryTitle: "Historique de prix (90 jours)",
      priceHistoryToday: "Aujourd'hui",
      priceHistoryLowest: "Le plus bas",
      priceHistoryAverage: "Moyenne",
      buyTimingGood: (percent: string) => `Bon moment pour acheter — ${percent} sous sa moyenne sur 90 jours.`,
      buyTimingWait: (percent: string) => `Prix inhabituellement élevé — ${percent} au-dessus de sa moyenne sur 90 jours.`,
      otherOffersTitle: "Vous pourrez aussi le trouver ici",
      otherOffersSubtitle: "D'autres sites proposent ce même produit, parfois à un prix différent.",
      cheaper: "Moins cher",
      bestValueTitle: "Meilleur rapport qualité-prix",
      bestValueMatch: (percent: number) => `${percent}% de match`,
      bestValueSavings: (price: string) => `${price} de moins que celui-ci`,
      worthMoreTitle: "Vaut le coût supplémentaire ?",
      worthMorePriceDiff: (price: string) => `+${price}`,
      worthMoreRating: (delta: string) => `+${delta}★ de note`,
      realCostTitle: "Coût réel estimé",
      realCostSubtitle: "Accessoires couramment achetés avec ce produit.",
      realCostHint: "Décochez ce dont vous n'avez pas besoin.",
      realCostBasePrice: "Prix affiché",
      realCostTotal: "Total estimé",
      priceHistoryTab: "Historique",
      realCostTab: "Coût réel",
      priceAlertTab: "Alerte prix",
      comparisonTitle: "Comparer",
      comparisonAlternativesTab: "Alternatives",
    },
    productQA: {
      title: "Posez une question sur ce produit",
      subtitle: "Besoin d'un détail précis ? Posez votre question, Korilo répond avec ce qu'il sait sur ce produit.",
      placeholder: "ex. « Combien de RAM a-t-il ? » ou « Est-il adapté au voyage ? »",
      ariaLabel: "Poser une question sur ce produit",
      submit: "Demander",
    },
    priceAlert: {
      title: "Alerte de prix",
      subtitle: "On vous prévient si le prix baisse — pas besoin de deviner un montant.",
      create: "M'alerter en cas de baisse",
      active: (price: string) => `Alerte active — on vous prévient sous ${price}`,
      remove: "Supprimer",
      removed: "Alerte supprimée",
      metTitle: "Bonne nouvelle !",
      metDescription: (price: string) =>
        `Déjà moins cher à ${price} — regardez les autres revendeurs ci-dessous.`,
      savedTitle: "Alerte activée",
      savedDescription: (price: string) =>
        `On vous préviendra si le prix passe sous ${price}. (Démo : vérifié une fois à la création, pas de suivi en temps réel.)`,
      manageTitle: "Vos alertes de prix",
      manageEmpty: "Aucune alerte de prix pour l'instant. Créez-en une depuis une fiche produit.",
    },
    planner: {
      title: "Planificateur d'achat",
      subtitle: "Choisissez ce qu'il vous faut et un budget total — Korilo le répartit et construit le kit.",
      categoriesLabel: "Qu'est-ce qu'il vous faut ?",
      budgetLabel: "Budget total",
      submit: "Construire mon kit",
      selectAtLeastOne: "Sélectionnez au moins une catégorie.",
      resultsTitle: "Votre kit",
      totalLabel: "Total du kit",
      remainingLabel: (amount: string) => `${amount} restants sur votre budget`,
      overBudgetLabel: (amount: string) => `${amount} au-dessus de votre budget`,
      infeasibleTitle: "Ce budget est un peu juste",
      infeasibleMessage: (shortfall: string) =>
        `Même l'option la moins chère de chaque catégorie demande ${shortfall} de plus. Voici quand même ce kit minimal.`,
      swapLabel: "Changer ce choix",
      startOver: "Recommencer",
    },
    notFound: {
      code: "404",
      title: "Page introuvable",
      subtitle: "La page que vous cherchez n'existe pas, ou le lien n'est plus valide.",
      cta: "Retour à Korilo",
    },
    privacy: {
      title: "Confidentialité",
      paragraphs: [
        "Korilo est actuellement une démo de produit en phase précoce. Les recherches que vous effectuez ne servent qu'à générer vos recommandations sur le moment — cette version de démonstration ne crée pas de compte, ne conserve pas d'historique d'achat et ne partage pas vos requêtes avec des tiers.",
        "Lorsque Korilo intégrera de vrais revendeurs et partenaires d'affiliation, cette page décrira précisément quelles données sont collectées et comment elles sont utilisées.",
      ],
    },
    terms: {
      title: "Conditions",
      paragraphs: [
        "Korilo est une démo de produit en phase précoce. Les produits, prix et revendeurs affichés sont des données fictives utilisées pour illustrer l'expérience de recommandation, pas de vraies offres.",
        "Les scores de match sont une estimation de compatibilité Korilo basée sur les préférences que vous avez indiquées — pas une garantie d'adéquation du produit, de disponibilité ou d'exactitude du prix. Vérifiez toujours les détails auprès du revendeur avant d'acheter.",
      ],
    },
    category: {
      laptop: "Ordinateurs portables",
      headphones: "Casques audio",
      smartphone: "Smartphones",
      "running-shoes": "Chaussures de running",
      "office-chairs": "Chaises de bureau",
      "coffee-makers": "Machines à café",
      backpacks: "Sacs à dos",
      "hair-dryers": "Sèche-cheveux",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionary[locale];
}
