import type { Product, ProductCategory } from "@/lib/types";
import { getProductsByCategory } from "@/lib/data";

export interface PlannerItem {
  category: ProductCategory;
  product: Product;
  allocatedBudget: number;
}

export interface PlannerResult {
  items: PlannerItem[];
  total: number;
  budget: number;
  /** False when the budget can't even cover the cheapest product in
   * every selected category. */
  feasible: boolean;
  /** How much more budget would be needed to reach feasible, 0 otherwise. */
  shortfall: number;
}

function pickBest(products: Product[], maxPrice: number): Product {
  const affordable = products.filter((p) => p.price <= maxPrice);
  const pool = affordable.length > 0 ? affordable : products;
  return [...pool].sort((a, b) => b.rating - a.rating || a.price - b.price)[0];
}

// Splits a total budget across the selected categories and picks the
// best-rated product each can afford — never an equal split, since a
// laptop and a pair of running socks don't occupy the same price
// bracket. Every category is guaranteed its cheapest product first;
// only the leftover surplus is distributed, weighted by how much
// price range (i.e. upgrade room) each category actually has.
export function planKit(categories: ProductCategory[], budget: number): PlannerResult {
  const catalogs = categories.map((category) => {
    const products = getProductsByCategory(category);
    const prices = products.map((p) => p.price);
    return {
      category,
      products,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  });

  const totalMin = catalogs.reduce((sum, c) => sum + c.minPrice, 0);

  if (totalMin > budget) {
    const items = catalogs.map((c) => ({
      category: c.category,
      product: [...c.products].sort((a, b) => a.price - b.price)[0],
      allocatedBudget: c.minPrice,
    }));
    return { items, total: totalMin, budget, feasible: false, shortfall: totalMin - budget };
  }

  const surplus = budget - totalMin;
  const totalRange = catalogs.reduce((sum, c) => sum + (c.maxPrice - c.minPrice), 0);

  const items = catalogs.map((c) => {
    const range = c.maxPrice - c.minPrice;
    const share = totalRange > 0 ? range / totalRange : 1 / catalogs.length;
    const allocatedBudget = c.minPrice + surplus * share;
    return {
      category: c.category,
      product: pickBest(c.products, allocatedBudget),
      allocatedBudget,
    };
  });

  const total = items.reduce((sum, item) => sum + item.product.price, 0);

  return { items, total, budget, feasible: true, shortfall: 0 };
}
