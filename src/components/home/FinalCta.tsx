import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function FinalCta() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <section className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {dict.finalCta.title}
          </h2>
          <p className="text-balance text-muted-foreground">
            {dict.finalCta.subtitle}
          </p>
        </div>
        <Button size="lg" nativeButton={false} render={<Link href="/#try-korilo" />}>
          {dict.finalCta.cta}
        </Button>
      </div>
    </section>
  );
}
