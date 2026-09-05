import { TriangleAlert } from "lucide-react";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export function DealBreakerBanner({
  dealBreakers,
  locale,
}: {
  dealBreakers: string[];
  locale: Locale;
}) {
  if (dealBreakers.length === 0) return null;
  const dict = getDictionary(locale);

  return (
    <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-destructive">
          {dict.productCard.dealBreakerTitle}
        </p>
        <p className="text-sm text-destructive/90">{dealBreakers.join(", ")}</p>
      </div>
    </div>
  );
}
