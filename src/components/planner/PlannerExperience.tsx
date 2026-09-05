"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import type { PlannerItem } from "@/lib/planner";
import { planKit } from "@/lib/planner";
import type { ProductCategory } from "@/lib/types";
import { ALL_CATEGORIES, getProductsByCategory } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/product/ProductImage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORIES: ProductCategory[] = ALL_CATEGORIES;

const BUDGET_MIN = 300;
const BUDGET_MAX = 3500;
const BUDGET_STEP = 100;
const DEFAULT_BUDGET = 1500;

export function PlannerExperience({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [selected, setSelected] = useState<ProductCategory[]>([]);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [items, setItems] = useState<PlannerItem[] | null>(null);
  const [feasible, setFeasible] = useState(true);
  const [shortfall, setShortfall] = useState(0);
  const [submittedBudget, setSubmittedBudget] = useState(0);

  function toggleCategory(category: ProductCategory) {
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  }

  function submit() {
    if (selected.length === 0) return;
    const result = planKit(selected, budget);
    setItems(result.items);
    setFeasible(result.feasible);
    setShortfall(result.shortfall);
    setSubmittedBudget(budget);
  }

  function swap(category: ProductCategory, productId: string) {
    setItems((prev) =>
      prev
        ? prev.map((item) =>
            item.category === category
              ? {
                  ...item,
                  product:
                    getProductsByCategory(category).find((p) => p.id === productId) ??
                    item.product,
                }
              : item
          )
        : prev
    );
  }

  const total = items ? items.reduce((sum, item) => sum + item.product.price, 0) : 0;
  const diff = submittedBudget - total;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{dict.planner.title}</h1>
        <p className="text-muted-foreground">{dict.planner.subtitle}</p>
      </div>

      {!items && (
        <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-foreground">
              {dict.planner.categoriesLabel}
            </span>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-5">
              {CATEGORIES.map((category) => (
                <label key={category} className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selected.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  {dict.category[category]}
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">
                {dict.planner.budgetLabel}
              </span>
              <span className="text-sm text-muted-foreground">
                {formatPrice(budget, locale)}
              </span>
            </div>
            <Slider
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={[budget]}
              onValueChange={(value) => setBudget(Array.isArray(value) ? value[0] : value)}
            />
          </div>

          <Button
            type="button"
            size="lg"
            disabled={selected.length === 0}
            onClick={submit}
            className="w-full gap-1.5 sm:w-auto sm:self-end"
          >
            {dict.planner.submit}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          {selected.length === 0 && (
            <p className="text-xs text-muted-foreground">{dict.planner.selectAtLeastOne}</p>
          )}
        </div>
      )}

      {items && (
        <div className="flex flex-col gap-6">
          <h2 className="text-lg font-semibold">{dict.planner.resultsTitle}</h2>

          {!feasible && (
            <div className="flex flex-col gap-1 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
              <p className="text-sm font-semibold text-destructive">
                {dict.planner.infeasibleTitle}
              </p>
              <p className="text-sm text-destructive/90">
                {dict.planner.infeasibleMessage(formatPrice(shortfall, locale))}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
            <div>
              <p className="text-sm text-muted-foreground">{dict.planner.totalLabel}</p>
              <p className="text-xl font-semibold">{formatPrice(total, locale)}</p>
            </div>
            <p
              className={cn(
                "text-sm font-medium",
                diff >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {diff >= 0
                ? dict.planner.remainingLabel(formatPrice(diff, locale))
                : dict.planner.overBudgetLabel(formatPrice(Math.abs(diff), locale))}
            </p>
            <Button variant="outline" size="sm" onClick={() => setItems(null)}>
              {dict.planner.startOver}
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((item) => {
              const options = [...getProductsByCategory(item.category)].sort(
                (a, b) => a.price - b.price
              );

              return (
                <div
                  key={item.category}
                  className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {dict.category[item.category]}
                  </p>
                  <div className="flex items-center gap-3">
                    <ProductImage
                      id={item.product.id}
                      category={item.product.category}
                      brand={item.product.brand}
                      name={item.product.name}
                      className="size-16 shrink-0 rounded-lg"
                    />
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.id}`}
                        className="text-sm font-medium leading-snug hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm font-semibold">
                        {formatPrice(item.product.price, locale)}
                      </p>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3 fill-current text-primary" aria-hidden="true" />
                        {item.product.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <Select
                    value={item.product.id}
                    onValueChange={(value) => swap(item.category, String(value))}
                  >
                    <SelectTrigger className="w-full" aria-label={dict.planner.swapLabel}>
                      <SelectValue>
                        {(id: string) => {
                          const product = options.find((p) => p.id === id);
                          return product
                            ? `${product.name} — ${formatPrice(product.price, locale)}`
                            : id;
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {options.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} — {formatPrice(product.price, locale)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
