import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Sparkles, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackLink } from "@/components/layout/BackLink";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductGallery } from "@/components/product/ProductGallery";
import { MatchScore } from "@/components/product/MatchScore";
import { RecommendationReason } from "@/components/product/RecommendationReason";
import { DealBreakerBanner } from "@/components/product/DealBreakerBanner";
import { NotRecommendedBanner } from "@/components/product/NotRecommendedBanner";
import { ProsCons } from "@/components/product/ProsCons";
import { ProductQA } from "@/components/product/ProductQA";
import { RetailerBadge } from "@/components/product/RetailerBadge";
import { WishlistButton } from "@/components/product/WishlistButton";
import { PriceInfoCard } from "@/components/product/PriceInfoCard";
import { ComparisonSection } from "@/components/product/ComparisonSection";
import { RecordProductView } from "@/components/product/RecordProductView";
import { Button } from "@/components/ui/button";
import { getProductById, getProductsByCategory } from "@/lib/data";
import { getOtherOffers } from "@/lib/data/otherOffers";
import { recommendForProducts } from "@/lib/ai";
import { buildQuickVerdict } from "@/lib/ai/verdict";
import { buildNotRecommendedReason } from "@/lib/ai/notRecommended";
import { getBestValueAlternative, getWorthMoreAlternative } from "@/lib/ai/valueComparison";
import { parseCriteriaParam, encodeCriteriaParam } from "@/lib/criteriaParam";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatNumber, formatPrice } from "@/lib/i18n/format";
import { resolveSpecifications } from "@/lib/data/specLabels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  const locale = await getLocale();
  const fallback = locale === "fr" ? "Produit — KORILO" : "Product — KORILO";
  return { title: product ? `${product.name} — KORILO` : fallback };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ c?: string }>;
}) {
  const { id } = await params;
  const { c } = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const product = getProductById(id);
  if (!product) notFound();

  const criteria = parseCriteriaParam(c);
  const recommendation = criteria
    ? recommendForProducts(criteria, [product], locale)[0]
    : undefined;

  const similar = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 3);

  const verdict = buildQuickVerdict(product, locale);
  const notRecommendedReason = recommendation
    ? buildNotRecommendedReason(product, recommendation, locale)
    : null;
  const otherOffers = getOtherOffers(product);
  const bestValue = getBestValueAlternative(product, criteria, locale);
  const worthMore = getWorthMoreAlternative(product, criteria, locale);
  const buyUrl = product.affiliateUrl ?? product.productUrl;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <RecordProductView productId={product.id} />
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <BackLink locale={locale} />

        <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <ProductGallery
              id={product.id}
              category={product.category}
              brand={product.brand}
              name={product.name}
            />
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm text-muted-foreground">
                {dict.category[product.category]} · {product.brand}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                {product.name}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-2xl font-semibold">
                {formatPrice(product.price, locale)}
              </span>
              <RetailerBadge retailer={product.retailer} />
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="size-3.5 fill-current text-primary" aria-hidden="true" />
                {product.rating.toFixed(1)} ({formatNumber(product.reviewCount, locale)}{" "}
                {locale === "fr" ? "avis" : "reviews"})
              </span>
              <WishlistButton
                productId={product.id}
                productName={product.name}
                locale={locale}
                size="lg"
                className="ml-auto border border-border"
              />
            </div>

            {!recommendation && (
              <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-accent/50 p-4">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{dict.productPage.verdictTitle}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-foreground">{verdict}</p>
                </div>
              </div>
            )}

            {recommendation && (
              <>
                <DealBreakerBanner dealBreakers={recommendation.dealBreakers} locale={locale} />
                <NotRecommendedBanner reason={notRecommendedReason} locale={locale} />
                <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-4">
                  <MatchScore score={recommendation.matchScore} locale={locale} size="lg" />
                  <div className="flex-1">
                    <RecommendationReason
                      headline={
                        notRecommendedReason
                          ? dict.productPage.notRecommendedHeadline
                          : recommendation.headline
                      }
                      reasoning={recommendation.reasoning}
                    />
                  </div>
                </div>
              </>
            )}

            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description[locale]}
            </p>

            <Button
              size="lg"
              nativeButton={false}
              render={
                <a href={buyUrl} target="_blank" rel="noopener noreferrer" />
              }
              className="gap-1.5"
            >
              {dict.productPage.visit(product.retailer.name)}
              <ExternalLink className="size-4" aria-hidden="true" />
            </Button>
            <p className="text-xs text-muted-foreground">
              {product.availability === "in-stock"
                ? dict.productPage.inStock
                : product.availability === "limited"
                  ? dict.productPage.limitedStock
                  : dict.productPage.outOfStock}
            </p>

            <PriceInfoCard product={product} locale={locale} />
          </div>
        </div>

        {recommendation && (
          <section className="mt-12 flex flex-col gap-3">
            <h2 className="text-lg font-semibold">{dict.productPage.prosAndCons}</h2>
            <ProsCons pros={recommendation.pros} cons={recommendation.cons} />
          </section>
        )}

        <section className="mt-12 flex flex-col gap-3">
          <h2 className="text-lg font-semibold">{dict.productPage.specifications}</h2>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 rounded-xl border border-border p-5 sm:grid-cols-2">
            {resolveSpecifications(product.specifications, locale).map((spec) => (
              <div key={spec.label} className="flex justify-between gap-4 border-b border-border/70 pb-2 sm:border-none sm:pb-0">
                <dt className="text-sm text-muted-foreground">{spec.label}</dt>
                <dd className="text-sm font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ComparisonSection
          product={product}
          bestValue={bestValue}
          worthMore={worthMore}
          otherOffers={otherOffers}
          criteria={criteria}
          locale={locale}
        />

        <div className="mt-12">
          <ProductQA product={product} locale={locale} />
        </div>

        {similar.length > 0 && (
          <section className="mt-12 flex flex-col gap-4">
            <h2 className="text-lg font-semibold">{dict.productPage.alsoLike}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {similar.map((item) => (
                <Link
                  key={item.id}
                  href={
                    criteria
                      ? `/product/${item.id}?c=${encodeCriteriaParam(criteria)}`
                      : `/product/${item.id}`
                  }
                  className="flex flex-col gap-2 rounded-xl border border-border p-3 transition-shadow hover:shadow-md"
                >
                  <ProductImage
                    id={item.id}
                    category={item.category}
                    brand={item.brand}
                    name={item.name}
                    className="h-28 w-full rounded-lg"
                  />
                  <span className="text-sm font-medium leading-snug">
                    {item.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatPrice(item.price, locale)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
