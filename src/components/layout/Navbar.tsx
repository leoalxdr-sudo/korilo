import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { WishlistNavLink } from "@/components/layout/WishlistNavLink";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getLocale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export async function Navbar({ showLogo = true }: { showLogo?: boolean } = {}) {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const navLinks = [
    { href: "/how-it-works#how-it-works", label: dict.nav.howItWorks },
    { href: "/#recommendations-preview", label: dict.nav.explore },
    { href: "/planner", label: dict.nav.planner },
    { href: "/#about", label: dict.nav.about },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-3 items-center px-4 sm:px-6 lg:px-8">
        <nav className="hidden items-center gap-5 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="col-start-2 flex justify-center">
          {showLogo && <Logo />}
        </div>

        <div className="col-start-3 flex items-center justify-end gap-2">
          <WishlistNavLink locale={locale} />

          <Button
            title={dict.nav.comingSoon}
            className="hidden md:inline-flex"
          >
            {dict.nav.signIn}
          </Button>

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={dict.nav.openMenu}
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-md px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
                <Button title={dict.nav.comingSoon}>
                  {dict.nav.signIn}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
