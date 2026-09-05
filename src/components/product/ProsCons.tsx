import { Check, X } from "lucide-react";

export function ProsCons({
  pros,
  cons,
  maxItems,
}: {
  pros: string[];
  cons: string[];
  maxItems?: number;
}) {
  const shownPros = maxItems ? pros.slice(0, maxItems) : pros;
  const shownCons = maxItems ? cons.slice(0, maxItems) : cons;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <ul className="flex flex-col gap-1.5">
        {shownPros.map((pro) => (
          <li key={pro} className="flex items-start gap-2 text-sm">
            <Check
              className="mt-0.5 size-3.5 shrink-0 text-success"
              aria-hidden="true"
            />
            <span className="text-foreground/90">{pro}</span>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-1.5">
        {shownCons.map((con) => (
          <li key={con} className="flex items-start gap-2 text-sm">
            <X
              className="mt-0.5 size-3.5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{con}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
