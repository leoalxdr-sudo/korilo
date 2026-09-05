"use client";

import type { Recommendation } from "@/lib/types";
import type { Locale } from "@/lib/i18n/locale";
import { getDictionary } from "@/lib/i18n/dictionary";
import { formatPrice } from "@/lib/i18n/format";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "match" | "price-asc" | "price-desc" | "rating";

export interface FilterState {
  sort: SortOption;
  maxPrice: number | null;
  brands: string[];
  minRating: number;
  inStockOnly: boolean;
}

export const DEFAULT_FILTERS: FilterState = {
  sort: "match",
  maxPrice: null,
  brands: [],
  minRating: 0,
  inStockOnly: false,
};

export function isDefaultFilters(filters: FilterState): boolean {
  return (
    filters.sort === "match" &&
    filters.maxPrice === null &&
    filters.brands.length === 0 &&
    filters.minRating === 0 &&
    !filters.inStockOnly
  );
}

export function priceBounds(recommendations: Recommendation[]): {
  min: number;
  max: number;
} {
  if (recommendations.length === 0) return { min: 0, max: 0 };
  const prices = recommendations.map((r) => r.product.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function availableBrands(recommendations: Recommendation[]): string[] {
  return [...new Set(recommendations.map((r) => r.product.brand))].sort((a, b) =>
    a.localeCompare(b)
  );
}

const RATING_STEPS = [4.5, 4, 3.5, 3];

export function FilterSidebar({
  filters,
  onChange,
  recommendations,
  locale,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  recommendations: Recommendation[];
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const bounds = priceBounds(recommendations);
  const brands = availableBrands(recommendations);
  const sliderValue = filters.maxPrice ?? bounds.max;

  const sortLabels: Record<SortOption, string> = {
    match: dict.filters.sortMatch,
    "price-asc": dict.filters.sortPriceAsc,
    "price-desc": dict.filters.sortPriceDesc,
    rating: dict.filters.sortRating,
  };
  const ratingLabels: Record<string, string> = { "0": dict.filters.anyRating };
  for (const rating of RATING_STEPS) ratingLabels[String(rating)] = `${rating}+`;

  function toggleBrand(brand: string, checked: boolean) {
    onChange({
      ...filters,
      brands: checked
        ? [...filters.brands, brand]
        : filters.brands.filter((b) => b !== brand),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-base font-semibold">{dict.filters.title}</h2>
        {!isDefaultFilters(filters) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto px-2 py-1 text-xs text-muted-foreground"
            onClick={() => onChange(DEFAULT_FILTERS)}
          >
            {dict.filters.reset}
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sort-select">{dict.filters.sortBy}</Label>
        <Select
          value={filters.sort}
          onValueChange={(value) => onChange({ ...filters, sort: value as SortOption })}
        >
          <SelectTrigger id="sort-select" className="w-full">
            <SelectValue>
              {(value: SortOption) => sortLabels[value]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">{dict.filters.sortMatch}</SelectItem>
            <SelectItem value="price-asc">{dict.filters.sortPriceAsc}</SelectItem>
            <SelectItem value="price-desc">{dict.filters.sortPriceDesc}</SelectItem>
            <SelectItem value="rating">{dict.filters.sortRating}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {bounds.max > bounds.min && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>{dict.filters.price}</Label>
            <span className="text-sm text-muted-foreground">
              ≤ {formatPrice(sliderValue, locale)}
            </span>
          </div>
          <Slider
            min={bounds.min}
            max={bounds.max}
            value={[sliderValue]}
            onValueChange={(value) =>
              onChange({
                ...filters,
                maxPrice: Array.isArray(value) ? value[0] : value,
              })
            }
          />
        </div>
      )}

      {brands.length > 1 && (
        <div className="flex flex-col gap-2.5">
          <Label>{dict.filters.brand}</Label>
          <div className="flex flex-col gap-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={(checked) => toggleBrand(brand, checked === true)}
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="rating-select">{dict.filters.minRating}</Label>
        <Select
          value={String(filters.minRating)}
          onValueChange={(value) => onChange({ ...filters, minRating: Number(value) })}
        >
          <SelectTrigger id="rating-select" className="w-full">
            <SelectValue>{(value: string) => ratingLabels[value]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">{dict.filters.anyRating}</SelectItem>
            {RATING_STEPS.map((rating) => (
              <SelectItem key={rating} value={String(rating)}>
                {rating}+
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <label className="flex items-center justify-between gap-2">
        <Label htmlFor="in-stock-switch">{dict.filters.inStockOnly}</Label>
        <Switch
          id="in-stock-switch"
          checked={filters.inStockOnly}
          onCheckedChange={(checked) => onChange({ ...filters, inStockOnly: checked })}
        />
      </label>
    </div>
  );
}
