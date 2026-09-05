import type { Product, Recommendation } from "@/lib/types";
import { ProductImage } from "@/components/product/ProductImage";
import { RetailerBadge } from "@/components/product/RetailerBadge";
import { MatchScore } from "@/components/product/MatchScore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatNumber, formatPrice } from "@/lib/i18n/format";
import { specLabel } from "@/lib/data/specLabels";

function collectSpecLabelKeys(products: Product[]): string[] {
  const seen: string[] = [];
  for (const product of products) {
    for (const spec of product.specifications) {
      if (!seen.includes(spec.labelKey)) seen.push(spec.labelKey);
    }
  }
  return seen;
}

export function ComparisonTable({
  products,
  recommendations,
  locale,
}: {
  products: Product[];
  recommendations?: Recommendation[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const specLabelKeys = collectSpecLabelKeys(products);
  const recommendationFor = (id: string) =>
    recommendations?.find((r) => r.product.id === id);

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40">
            <th className="w-40 px-4 py-3 text-left font-medium text-muted-foreground">
              &nbsp;
            </th>
            {products.map((product) => (
              <th key={product.id} className="min-w-48 px-4 py-3 text-left align-top">
                <div className="flex flex-col gap-2">
                  <ProductImage
                    id={product.id}
                    category={product.category}
                    brand={product.brand}
                    name={product.name}
                    className="h-20 w-full rounded-lg"
                    iconClassName="h-1/2 w-1/2"
                  />
                  <span className="font-semibold leading-snug">{product.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {product.brand}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recommendations && (
            <tr className="border-b border-border">
              <td className="px-4 py-3 font-medium text-muted-foreground">
                {dict.compareTable.koriloMatch}
              </td>
              {products.map((product) => {
                const rec = recommendationFor(product.id);
                return (
                  <td key={product.id} className="px-4 py-3">
                    {rec ? (
                      <div className="flex flex-col items-start gap-1.5">
                        <MatchScore score={rec.matchScore} locale={locale} size="sm" />
                        {rec.dealBreakers.length > 0 && (
                          <Badge variant="destructive">{dict.productCard.dealBreakerBadge}</Badge>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                );
              })}
            </tr>
          )}

          <Row
            label={dict.compareTable.price}
            products={products}
            render={(p) => formatPrice(p.price, locale)}
            emphasize
          />
          <Row
            label={dict.compareTable.retailer}
            products={products}
            render={(p) => <RetailerBadge retailer={p.retailer} />}
          />
          <Row
            label={dict.compareTable.rating}
            products={products}
            render={(p) => `${p.rating.toFixed(1)}/5 (${formatNumber(p.reviewCount, locale)})`}
          />
          <Row
            label={dict.compareTable.availability}
            products={products}
            render={(p) =>
              p.availability === "in-stock"
                ? dict.compareTable.inStock
                : p.availability === "limited"
                  ? dict.compareTable.limitedStock
                  : dict.compareTable.outOfStock
            }
          />

          {specLabelKeys.map((labelKey) => (
            <Row
              key={labelKey}
              label={specLabel(labelKey, locale)}
              products={products}
              render={(p) =>
                p.specifications.find((s) => s.labelKey === labelKey)?.value[locale] ?? "—"
              }
            />
          ))}

          {recommendations && (
            <tr>
              <td className="px-4 py-3 align-top font-medium text-muted-foreground">
                {dict.compareTable.bestFor}
              </td>
              {products.map((product) => {
                const rec = recommendationFor(product.id);
                return (
                  <td key={product.id} className="px-4 py-3 align-top text-muted-foreground">
                    {rec?.headline ?? "—"}
                  </td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function Row({
  label,
  products,
  render,
  emphasize,
}: {
  label: string;
  products: Product[];
  render: (product: Product) => React.ReactNode;
  emphasize?: boolean;
}) {
  return (
    <tr className="border-b border-border last:border-b-0">
      <td className="px-4 py-3 font-medium text-muted-foreground">{label}</td>
      {products.map((product) => (
        <td
          key={product.id}
          className={cn("px-4 py-3", emphasize && "font-semibold")}
        >
          {render(product)}
        </td>
      ))}
    </tr>
  );
}
