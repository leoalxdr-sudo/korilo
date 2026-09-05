"use client";

import { useRef, useState } from "react";
import type { ParsedCriteria } from "@/lib/types";
import { SearchInput } from "@/components/home/SearchInput";
import { QuizPanel } from "@/components/home/QuizPanel";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

type Mode = "text" | "quiz";

const SWIPE_THRESHOLD = 50;

export function SearchModeSwitcher({
  locale,
  loading = false,
  onSubmitQuery,
  onSubmitCriteria,
}: {
  locale: Locale;
  loading?: boolean;
  onSubmitQuery: (query: string) => void;
  onSubmitCriteria: (criteria: ParsedCriteria) => void;
}) {
  const dict = getDictionary(locale);
  const [mode, setMode] = useState<Mode>("text");
  const pointerStartX = useRef<number | null>(null);

  function handlePointerDown(e: React.PointerEvent) {
    pointerStartX.current = e.clientX;
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (pointerStartX.current === null) return;
    const delta = e.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (delta <= -SWIPE_THRESHOLD) setMode("quiz");
    else if (delta >= SWIPE_THRESHOLD) setMode("text");
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="w-full touch-pan-y"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <div
          key={mode}
          className={cn(
            "animate-in fade-in duration-200",
            mode === "quiz" ? "slide-in-from-right-6" : "slide-in-from-left-6"
          )}
        >
          {mode === "text" ? (
            <SearchInput locale={locale} loading={loading} onSubmit={onSubmitQuery} />
          ) : (
            <QuizPanel locale={locale} disabled={loading} onSubmit={onSubmitCriteria} />
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => setMode("text")}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            mode === "text" ? "bg-secondary text-foreground" : "hover:text-foreground"
          )}
        >
          {dict.quiz.freeTextTab}
        </button>
        <span aria-hidden="true">·</span>
        <button
          type="button"
          onClick={() => setMode("quiz")}
          className={cn(
            "rounded-full px-2.5 py-1 transition-colors",
            mode === "quiz" ? "bg-secondary text-foreground" : "hover:text-foreground"
          )}
        >
          {dict.quiz.guidedTab}
        </button>
        <span className="hidden sm:inline">— {dict.quiz.swipeHint}</span>
      </div>
    </div>
  );
}
