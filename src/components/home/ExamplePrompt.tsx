"use client";

import { EXAMPLE_PROMPTS } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export function ExamplePrompt({
  locale,
  disabled = false,
  onSelect,
}: {
  locale: Locale;
  disabled?: boolean;
  onSelect: (prompt: string) => void;
}) {
  const dict = getDictionary(locale);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-sm text-muted-foreground">{dict.examplePrompt.label}</span>
      {EXAMPLE_PROMPTS[locale].slice(0, 3).map((prompt) => (
        <button
          key={prompt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(prompt)}
          className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground/80 transition-colors hover:border-primary/40 hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          {prompt.length > 48 ? `${prompt.slice(0, 48)}…` : prompt}
        </button>
      ))}
    </div>
  );
}
