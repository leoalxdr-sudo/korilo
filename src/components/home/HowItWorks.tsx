import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function HowItWorks() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-border bg-secondary/40"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
          {dict.howItWorks.title}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {dict.howItWorks.steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-primary">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
