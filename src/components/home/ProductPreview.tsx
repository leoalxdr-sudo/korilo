import Link from "next/link";
import type { ParsedCriteria, Recommendation } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

// Purely presentational — the illustrative search itself runs once,
// server-side, in Hero.tsx and is handed down as props, so this can be
// shown from the client HomeExperience (swapped out once the visitor
// has run their own search) without re-fetching anything.
export function ProductPreview({
  criteria,
  recommendations,
  locale,
}: {
  criteria: ParsedCriteria;
  recommendations: Recommendation[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const preview = recommendations.slice(0, 3);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.productPreview.title}
        </h2>
        <p className="mt-3 text-balance text-muted-foreground">
          {dict.productPreview.subtitle}
        </p>
      </div>

      <div className="mt-10 w-full">
        <ProductGrid recommendations={preview} criteria={criteria} locale={locale} />
      </div>

      <div className="mt-10">
        <Button variant="outline" nativeButton={false} render={<Link href="/#try-korilo" />}>
          {dict.productPreview.cta}
        </Button>
      </div>
    </div>
  );
}
