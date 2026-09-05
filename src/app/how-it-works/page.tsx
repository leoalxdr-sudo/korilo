import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";
import { FinalCta } from "@/components/home/FinalCta";
import { getLocale } from "@/lib/i18n/locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title:
      locale === "fr"
        ? "Comment ça marche — KORILO"
        : "How it works — KORILO",
  };
}

export default function HowItWorksPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <HowItWorks />
        <TrustSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
