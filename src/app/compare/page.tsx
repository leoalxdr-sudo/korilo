import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ComparisonTable } from "@/components/compare/ComparisonTable";
import { Button } from "@/components/ui/button";
import { Sparkles, Check, X } from "lucide-react";
import { getProductById } from "@/lib/data";
import { recommendForProducts } from "@/lib/ai";
import { buildComparisonSummary } from "@/lib/ai/comparisonSummary";
import { buildConvinceMe } from "@/lib/ai/convinceMe";
import { parseCriteriaParam } from "@/lib/criteriaParam";
import type { Recommendation } from "@/lib/types";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: locale === "fr" ? "Comparer — KORILO" : "Compare — KORILO" };
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string; c?: string }>;
}) {
  const { ids, c } = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const productIds = (ids ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const products = productIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const criteria = parseCriteriaParam(c);
  const recommendations: Recommendation[] | undefined = criteria
    ? recommendForProducts(criteria, products, locale)
    : undefined;
  const summary = products.length >= 2 ? buildComparisonSummary(products, locale) : "";
  const convinceMe =
    products.length >= 2 ? buildConvinceMe(products, recommendations, locale) : null;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          {dict.comparePage.title}
        </h1>

        {products.length < 2 ? (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">
              {dict.comparePage.emptyMessage}
            </p>
            <Button render={<Link href="/#try-korilo" />} nativeButton={false}>
              {dict.comparePage.startSearch}
            </Button>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-8">
            {summary && (
              <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-accent/50 p-4">
                <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{dict.comparePage.summaryTitle}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-foreground">{summary}</p>
                </div>
              </div>
            )}

            <ComparisonTable
              products={products}
              recommendations={recommendations}
              locale={locale}
            />

            {convinceMe && (
              <div className="flex flex-col gap-4 rounded-xl border border-primary/20 bg-accent/60 p-5">
                <h2 className="text-sm font-semibold text-foreground">
                  {dict.comparePage.convinceMeTitle}
                </h2>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {dict.comparePage.reasonsForTitle(convinceMe.winner.name)}
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {convinceMe.reasonsFor.map((reason) => (
                        <li key={reason} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-success" aria-hidden="true" />
                          <span className="text-foreground/90">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      {dict.comparePage.reasonsAgainstTitle}
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {convinceMe.reasonsAgainst.map((reason) => (
                        <li key={reason} className="flex items-start gap-2 text-sm">
                          <X className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <span className="text-muted-foreground">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-border/70 pt-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    {dict.comparePage.verdictLabel}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">
                    {convinceMe.verdict}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
