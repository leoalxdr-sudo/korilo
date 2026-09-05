import { headers } from "next/headers";

export type Locale = "en" | "fr";

// Auto-detects the visitor's language from an Accept-Language header —
// no manual switcher yet ("site in French for now, if we're in
// France"). Pure so it can be used identically from a Server Component
// (via getLocale) or a Route Handler reading request.headers directly.
export function localeFromAcceptLanguage(value: string | null): Locale {
  const primary = (value ?? "").split(",")[0]?.trim().toLowerCase() ?? "";
  return primary.startsWith("fr") ? "fr" : "en";
}

// Safe to call from any Server Component/layout/page.
export async function getLocale(): Promise<Locale> {
  const headersList = await headers();
  return localeFromAcceptLanguage(headersList.get("accept-language"));
}
