import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toast";
import { getLocale } from "@/lib/i18n/locale";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return locale === "fr"
    ? {
        title: "KORILO — Votre conseiller d'achat IA",
        description:
          "Dites à Korilo ce qu'il vous faut. Korilo trouve, compare et explique les produits qui vous correspondent vraiment.",
      }
    : {
        title: "KORILO — Your AI shopping advisor",
        description:
          "Tell Korilo what you need. Korilo finds, compares, and explains the products that actually fit you.",
      };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TooltipProvider delay={150}>{children}</TooltipProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
