"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";

export function WishlistButton({
  productId,
  productName,
  locale,
  size = "sm",
  className,
}: {
  productId: string;
  productName: string;
  locale: Locale;
  size?: "sm" | "lg";
  className?: string;
}) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(productId);
  const dict = getDictionary(locale);

  return (
    <button
      type="button"
      onClick={(e) => {
        // WishlistButton is often nested inside a card-level <Link>.
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-pressed={active}
      aria-label={active ? dict.wishlist.removeAria(productName) : dict.wishlist.addAria(productName)}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-background",
        size === "sm" ? "size-7" : "size-10",
        className
      )}
    >
      <Heart
        className={cn(
          size === "sm" ? "size-3.5" : "size-5",
          active ? "fill-destructive text-destructive" : "text-foreground"
        )}
        aria-hidden="true"
      />
    </button>
  );
}
