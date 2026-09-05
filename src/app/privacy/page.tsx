import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: locale === "fr" ? "Confidentialité — KORILO" : "Privacy — KORILO" };
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <LegalPage title={dict.privacy.title}>
      {dict.privacy.paragraphs.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
    </LegalPage>
  );
}
