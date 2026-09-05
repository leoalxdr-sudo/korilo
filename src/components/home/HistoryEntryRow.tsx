import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import type { HistoryEntry } from "@/lib/searchHistory";
import { ProductRowCard } from "@/components/product/ProductRowCard";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export function HistoryEntryRow({
  entry,
  locale,
  onRemove,
}: {
  entry: HistoryEntry;
  locale: Locale;
  onRemove: (id: string) => void;
}) {
  const dict = getDictionary(locale);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium leading-snug">
          &ldquo;{entry.query}&rdquo;
        </p>
        <button
          type="button"
          onClick={() => onRemove(entry.id)}
          aria-label={dict.history.removeAria(entry.query)}
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-muted"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {entry.recommendations.map((recommendation) => (
          <ProductRowCard
            key={recommendation.product.id}
            recommendation={recommendation}
            criteria={entry.criteria}
            locale={locale}
          />
        ))}
      </div>

      <Link
        href={`/search?q=${encodeURIComponent(entry.query)}`}
        className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary hover:underline"
      >
        {dict.history.seeAllResults}
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
