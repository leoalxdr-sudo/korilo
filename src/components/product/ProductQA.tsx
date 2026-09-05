"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { answerProductQuestion } from "@/lib/ai/productQA";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Exchange {
  question: string;
  answer: string;
}

export function ProductQA({ product, locale }: { product: Product; locale: Locale }) {
  const dict = getDictionary(locale);
  const [value, setValue] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);

  function submit(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;
    const answer = answerProductQuestion(product, trimmed, locale);
    setExchanges((prev) => [...prev, { question: trimmed, answer }]);
    setValue("");
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">{dict.productQA.title}</h2>
        <p className="text-sm text-muted-foreground">{dict.productQA.subtitle}</p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
        >
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(value);
              }
            }}
            placeholder={dict.productQA.placeholder}
            aria-label={dict.productQA.ariaLabel}
            rows={1}
            className="min-h-0 resize-none text-sm"
          />
          <Button type="submit" size="sm" className="gap-1.5 sm:w-auto">
            {dict.productQA.submit}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </form>

        {exchanges.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-border pt-4">
            {exchanges.map((exchange, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex justify-end">
                  <p className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                    {exchange.question}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span
                    className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10"
                    aria-hidden="true"
                  >
                    <Sparkles className="size-3.5 text-primary" />
                  </span>
                  <p className="max-w-[80%] rounded-2xl rounded-tl-md bg-secondary px-4 py-2.5 text-sm leading-relaxed text-secondary-foreground">
                    {exchange.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
