"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EXAMPLE_PROMPTS } from "@/lib/constants";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export function SearchInput({
  locale,
  loading = false,
  onSubmit,
}: {
  locale: Locale;
  loading?: boolean;
  onSubmit: (query: string) => void;
}) {
  const dict = getDictionary(locale);
  const rotatingPlaceholders = EXAMPLE_PROMPTS[locale].slice(0, 3);

  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (value) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % rotatingPlaceholders.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [value, rotatingPlaceholders.length]);

  function submit(query: string) {
    const trimmed = query.trim();
    if (!trimmed || loading) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <form
      id="try-korilo"
      className="w-full scroll-mt-24"
      onSubmit={(e) => {
        e.preventDefault();
        submit(value);
      }}
    >
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition-shadow focus-within:shadow-md sm:flex-row sm:items-end sm:p-3">
        <div className="flex flex-1 items-start gap-2 px-2 py-2">
          <Sparkles
            className="mt-2.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(value);
              }
            }}
            placeholder={rotatingPlaceholders[placeholderIndex]}
            aria-label={dict.searchInput.ariaLabel}
            rows={2}
            className="min-h-0 resize-none border-none px-0 text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full gap-1.5 sm:w-auto"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <>
              {dict.searchInput.submit}
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
