"use client";

import { X } from "lucide-react";
import type { ParsedCriteria } from "@/lib/types";
import { labelForTag, requirementLabel } from "@/lib/ai/keywords";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";

interface Chip {
  key: string;
  prefix: string;
  label: string;
  remove: () => ParsedCriteria;
  tone: "default" | "muted";
}

export function CriteriaSummary({
  criteria,
  onChange,
  locale,
  className,
}: {
  criteria: ParsedCriteria;
  onChange: (next: ParsedCriteria) => void;
  locale: Locale;
  className?: string;
}) {
  const dict = getDictionary(locale);
  const chips: Chip[] = [];

  if (criteria.budget) {
    chips.push({
      key: "budget",
      prefix: dict.criteria.budget,
      label: `≤ ${formatPrice(criteria.budget.max, locale)}`,
      remove: () => ({ ...criteria, budget: null }),
      tone: "default",
    });
  }

  for (const requirement of criteria.requirements) {
    chips.push({
      key: `req-${requirement}`,
      prefix: dict.criteria.requires,
      label: requirementLabel(requirement, locale),
      remove: () => ({
        ...criteria,
        requirements: criteria.requirements.filter((r) => r !== requirement),
      }),
      tone: "default",
    });
  }

  for (const preference of criteria.preferences) {
    chips.push({
      key: `pref-${preference}`,
      prefix: dict.criteria.priority,
      label: labelForTag(preference, locale),
      remove: () => ({
        ...criteria,
        preferences: criteria.preferences.filter((p) => p !== preference),
      }),
      tone: "default",
    });
  }

  for (const useCase of criteria.useCases) {
    chips.push({
      key: `use-${useCase}`,
      prefix: dict.criteria.use,
      label: labelForTag(useCase, locale),
      remove: () => ({
        ...criteria,
        useCases: criteria.useCases.filter((u) => u !== useCase),
      }),
      tone: "muted",
    });
  }

  for (const lowPriority of criteria.lowPriorities) {
    chips.push({
      key: `low-${lowPriority}`,
      prefix: dict.criteria.lowPriority,
      label: labelForTag(lowPriority, locale),
      remove: () => ({
        ...criteria,
        lowPriorities: criteria.lowPriorities.filter((l) => l !== lowPriority),
      }),
      tone: "muted",
    });
  }

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          {dict.criteria.searching}
        </span>
        <span className="text-sm font-semibold">
          {criteria.category ? dict.category[criteria.category] : dict.criteria.allCategories}
        </span>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                chip.tone === "default"
                  ? "border-primary/25 bg-accent text-accent-foreground"
                  : "border-border bg-secondary text-secondary-foreground"
              )}
            >
              <span className="text-muted-foreground">{chip.prefix}:</span>
              {chip.label}
              <button
                type="button"
                onClick={() => onChange(chip.remove())}
                aria-label={dict.criteria.remove(chip.prefix, chip.label)}
                className="rounded-full p-0.5 text-current/70 hover:bg-foreground/10"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
