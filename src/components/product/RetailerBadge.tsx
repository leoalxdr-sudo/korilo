import type { Retailer } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function RetailerBadge({
  retailer,
  className,
}: {
  retailer: Retailer;
  className?: string;
}) {
  return (
    <Badge variant="outline" className={cn("gap-1.5 text-muted-foreground", className)}>
      <span className="size-1.5 rounded-full bg-muted-foreground/50" aria-hidden="true" />
      {retailer.name}
    </Badge>
  );
}
