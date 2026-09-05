import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export default async function NotFound() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <p className="text-sm font-medium text-primary">{dict.notFound.code}</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {dict.notFound.title}
        </h1>
        <p className="text-muted-foreground">{dict.notFound.subtitle}</p>
        <Button nativeButton={false} render={<Link href="/" />}>
          {dict.notFound.cta}
        </Button>
      </main>
      <Footer />
    </div>
  );
}
