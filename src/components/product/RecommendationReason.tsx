import { Sparkles } from "lucide-react";

export function RecommendationReason({
  headline,
  reasoning,
}: {
  headline: string;
  reasoning: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-accent/60 px-3 py-2.5">
      <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        <Sparkles className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
        {headline}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">{reasoning}</p>
    </div>
  );
}
