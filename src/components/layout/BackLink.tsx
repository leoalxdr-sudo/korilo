"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export function BackLink({
  locale,
  fallbackHref = "/",
}: {
  locale: Locale;
  fallbackHref?: string;
}) {
  const router = useRouter();
  const dict = getDictionary(locale);

  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.back();
        else router.push(fallbackHref);
      }}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {dict.productPage.back}
    </button>
  );
}
