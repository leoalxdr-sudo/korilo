import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchExperience } from "@/components/search/SearchExperience";
import { runKoriloSearch, matchForCriteria } from "@/lib/ai";
import { parseCriteriaParam } from "@/lib/criteriaParam";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: locale === "fr" ? "Vos matchs — KORILO" : "Your matches — KORILO" };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; c?: string }>;
}) {
  const { q, c } = await searchParams;
  const query = (q ?? "").trim();
  const guidedCriteria = parseCriteriaParam(c);
  // The homepage is now the search entry point — no query and no guided
  // criteria means someone landed here directly (stale link, typed
  // URL), so send them there.
  if (!query && !guidedCriteria) redirect("/");

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const result = guidedCriteria
    ? matchForCriteria(guidedCriteria, locale)
    : runKoriloSearch({ query }, locale);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar showLogo={false} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <SearchExperience
          originalQuery={guidedCriteria ? dict.quiz.resultsLabel : query}
          initialResult={result}
          locale={locale}
        />
      </main>
      <Footer />
    </div>
  );
}
