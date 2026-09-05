"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { ParsedCriteria, ProductCategory } from "@/lib/types";
import { labelForTag } from "@/lib/ai/keywords";
import { ALL_CATEGORIES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";

const CATEGORIES: (ProductCategory | null)[] = [null, ...ALL_CATEGORIES];

const BUDGET_MIN = 100;
const BUDGET_MAX = 2000;
const BUDGET_STEP = 100;

const PRIORITY_TAGS = [
  "lightweight",
  "long-battery",
  "durable",
  "premium",
  "budget",
  "comfortable",
  "water-resistant",
  "fast-charging",
  "great-camera",
  "noise-cancellation",
  "compact",
  "high-performance",
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground/80 hover:border-primary/40 hover:bg-accent hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function QuizPanel({
  locale,
  disabled = false,
  onSubmit,
}: {
  locale: Locale;
  disabled?: boolean;
  onSubmit: (criteria: ParsedCriteria) => void;
}) {
  const dict = getDictionary(locale);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [budget, setBudget] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function submit() {
    if (disabled) return;
    onSubmit({
      category,
      budget: budget ? { max: budget, currency: "EUR" } : null,
      requirements: [],
      preferences: tags,
      useCases: [],
      lowPriorities: [],
    });
  }

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">
          {dict.quiz.categoryLabel}
        </span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((value) => (
            <Chip key={value ?? "any"} active={category === value} onClick={() => setCategory(value)}>
              {value ? dict.category[value] : dict.quiz.anyCategory}
            </Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-foreground">{dict.quiz.budgetLabel}</span>
          <span className="text-sm text-muted-foreground">
            {budget === null ? dict.quiz.anyBudget : `< ${formatPrice(budget, locale)}`}
          </span>
        </div>
        <Slider
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          step={BUDGET_STEP}
          value={[budget ?? BUDGET_MAX]}
          onValueChange={(value) =>
            setBudget(Array.isArray(value) ? value[0] : value)
          }
        />
        {budget !== null && (
          <button
            type="button"
            onClick={() => setBudget(null)}
            className="self-start text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {dict.quiz.anyBudget}
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">
          {dict.quiz.prioritiesLabel}
        </span>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_TAGS.map((tag) => (
            <Chip key={tag} active={tags.includes(tag)} onClick={() => toggleTag(tag)}>
              {labelForTag(tag, locale)}
            </Chip>
          ))}
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        disabled={disabled}
        onClick={submit}
        className="w-full gap-1.5 sm:w-auto sm:self-end"
      >
        {dict.quiz.submit}
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
    </div>
  );
}
