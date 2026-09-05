import type { Locale } from "@/lib/i18n/locale";

const LOCALE_TAG: Record<Locale, string> = { en: "en-US", fr: "fr-FR" };

export function formatPrice(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAG[locale]).format(amount);
}
