import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WishlistExperience } from "@/components/wishlist/WishlistExperience";
import { getLocale } from "@/lib/i18n/locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: locale === "fr" ? "Vos favoris — KORILO" : "Your wishlist — KORILO" };
}

export default async function WishlistPage() {
  const locale = await getLocale();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <WishlistExperience locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
