import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: locale === "fr" ? "Conditions — KORILO" : "Terms — KORILO" };
}

export default async function TermsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <LegalPage title={dict.terms.title}>
      {dict.terms.paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </LegalPage>
  );
}
