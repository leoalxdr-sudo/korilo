import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
