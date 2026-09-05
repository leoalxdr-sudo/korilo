import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

function scoreColor(score: number): string {
  if (score >= 85) return "var(--success)";
  if (score >= 70) return "var(--primary)";
  return "var(--muted-foreground)";
}

export function MatchScore({
  score,
  locale,
  size = "md",
  className,
}: {
  score: number;
  locale: Locale;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dict = getDictionary(locale);
  const dimension = size === "lg" ? 72 : size === "md" ? 56 : 44;
  const fontSize = size === "lg" ? "text-lg" : size === "md" ? "text-sm" : "text-xs";
  const color = scoreColor(score);

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={dict.matchScore.ariaLabel(score)}
        className={cn("shrink-0 cursor-help rounded-full", className)}
      >
        <div
          className="relative grid place-items-center rounded-full"
          style={{
            width: dimension,
            height: dimension,
            background: `conic-gradient(${color} ${score * 3.6}deg, var(--border) 0deg)`,
          }}
        >
          <div className="absolute inset-[3px] grid place-items-center rounded-full bg-card">
            <span className={cn("font-semibold tabular-nums", fontSize)}>
              {score}%
            </span>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-56 text-balance">
        {dict.matchScore.tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
