import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PlannerExperience } from "@/components/planner/PlannerExperience";
import { getLocale } from "@/lib/i18n/locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "fr" ? "Planificateur d'achat — KORILO" : "Shopping planner — KORILO",
  };
}

export default async function PlannerPage() {
  const locale = await getLocale();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <PlannerExperience locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
