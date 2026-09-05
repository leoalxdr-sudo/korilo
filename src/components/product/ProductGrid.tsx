import type { ParsedCriteria, Recommendation } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import type { Locale } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

export function ProductGrid({
  recommendations,
  criteria,
  locale,
  selectedIds,
  onToggleSelect,
  compact = false,
}: {
  recommendations: Recommendation[];
  criteria?: ParsedCriteria;
  locale: Locale;
  selectedIds?: string[];
  onToggleSelect?: (id: string, next: boolean) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-5",
        compact
          ? "sm:grid-cols-3 xl:grid-cols-4"
          : "sm:grid-cols-2 xl:grid-cols-3"
      )}
    >
      {recommendations.map((recommendation) => (
        <ProductCard
          key={recommendation.product.id}
          recommendation={recommendation}
          criteria={criteria}
          locale={locale}
          selected={selectedIds?.includes(recommendation.product.id)}
          onToggleSelect={onToggleSelect}
          compact={compact}
        />
      ))}
    </div>
  );
}
