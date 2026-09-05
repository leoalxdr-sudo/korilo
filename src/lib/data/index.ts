import type { Product, ProductCategory } from "@/lib/types";
import { laptops } from "@/lib/data/laptops";
import { headphones } from "@/lib/data/headphones";
import { smartphones } from "@/lib/data/smartphones";
import { runningShoes } from "@/lib/data/running-shoes";
import { officeChairs } from "@/lib/data/office-chairs";
import { coffeeMakers } from "@/lib/data/coffee-makers";
import { backpacks } from "@/lib/data/backpacks";
import { hairDryers } from "@/lib/data/hair-dryers";

// Single source of truth for which categories exist — UI components
// that need to list every category (the guided quiz, the shopping
// planner) read this instead of hand-maintaining their own copy, so a
// newly added category shows up there automatically.
export const ALL_CATEGORIES: ProductCategory[] = [
  "laptop",
  "headphones",
  "smartphone",
  "running-shoes",
  "office-chairs",
  "coffee-makers",
  "backpacks",
  "hair-dryers",
];

const allProducts: Product[] = [
  ...laptops,
  ...headphones,
  ...smartphones,
  ...runningShoes,
  ...officeChairs,
  ...coffeeMakers,
  ...backpacks,
  ...hairDryers,
];

export function getAllProducts(): Product[] {
  return allProducts;
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return allProducts.filter((product) => product.category === category);
}

export function getProductById(id: string): Product | undefined {
  return allProducts.find((product) => product.id === id);
}

// Placeholder "trending" pool for the demo catalog — genuinely random
// each call, standing in for a real popularity signal (view/search
// counts from an actual backend) once one exists.
export function getRandomProducts(count: number): Product[] {
  const shuffled = [...allProducts].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
