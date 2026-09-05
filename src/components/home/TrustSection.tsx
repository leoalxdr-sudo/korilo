import {
  Wallet,
  Gauge,
  ShieldCheck,
  Star,
  Sparkles,
  PackageCheck,
  Heart,
} from "lucide-react";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

const FACTOR_ICONS = [Wallet, Gauge, ShieldCheck, Star, Sparkles, PackageCheck, Heart];

export async function TrustSection() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {dict.trust.title}
          </h2>
          <p className="mt-3 text-balance text-muted-foreground">
            {dict.trust.subtitle}
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {dict.trust.factors.map((label, i) => {
            const Icon = FACTOR_ICONS[i];
            return (
              <div key={label} className="flex flex-col items-center gap-2.5 text-center">
                <div className="grid size-11 place-items-center rounded-full bg-background ring-1 ring-border">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-foreground/90">
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
