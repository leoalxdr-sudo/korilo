"use client";

import { useEffect } from "react";
import { addRecentlyViewed, loadRecentlyViewed } from "@/lib/recentlyViewed";

// Invisible — just records that this product page was opened, so the
// homepage can show a "recently viewed" row on the next visit.
export function RecordProductView({ productId }: { productId: string }) {
  useEffect(() => {
    addRecentlyViewed(loadRecentlyViewed(), productId);
  }, [productId]);

  return null;
}
