"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export function WishlistNavLink({ locale }: { locale: Locale }) {
  const { ids } = useWishlist();
  const dict = getDictionary(locale);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={dict.nav.wishlist}
      className="relative"
      nativeButton={false}
      render={<Link href="/wishlist" />}
    >
      <Heart className="size-5" aria-hidden="true" />
      {ids.length > 0 && (
        <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
          {ids.length}
        </span>
      )}
    </Button>
  );
}
