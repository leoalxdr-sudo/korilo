import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function Footer() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const footerLinks = [
    { href: "/#about", label: dict.footer.about },
    { href: "/how-it-works#how-it-works", label: dict.footer.howItWorks },
    { href: "/privacy", label: dict.footer.privacy },
    { href: "/terms", label: dict.footer.terms },
    { href: "/#about", label: dict.footer.contact },
  ];

  return (
    <footer id="about" className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            {dict.footer.tagline}
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {footerLinks.map((link, i) => (
            <Link
              key={`${link.label}-${i}`}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-border py-4">
        <p className="mx-auto max-w-6xl px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          {dict.footer.copyright(new Date().getFullYear())}
        </p>
      </div>
    </footer>
  );
}
