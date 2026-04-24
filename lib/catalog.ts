import { Category, Product } from "@/types";

export const BRAND_OPTIONS = [
  "Nike",
  "Adidas",
  "Puma",
  "New Balance",
  "Asics",
  "Reebok",
  "Skechers",
  "Vans",
];

export const BRAND_FILTER_ITEMS = BRAND_OPTIONS.map((brand) => ({
  id: brand,
  name: brand,
}));

const CATEGORY_KEYWORDS: Array<{ label: string; patterns: RegExp[] }> = [
  { label: "Men", patterns: [/men/i, /running/i, /sport/i] },
  { label: "Women", patterns: [/women/i, /lifestyle/i, /casual/i] },
  { label: "Kids", patterns: [/kids?/i, /youth/i, /basketball/i] },
];

export const inferBrandFromProduct = (product: Pick<Product, "brand" | "name">) => {
  if (product.brand?.trim()) {
    return product.brand.trim();
  }

  const match = BRAND_OPTIONS.find((brand) =>
    product.name.toLowerCase().includes(brand.toLowerCase())
  );

  return match ?? "Solezi";
};

export const normalizeCategoryLabel = (
  category: Pick<Category, "id" | "name">,
  index?: number
) => {
  const directMatch = CATEGORY_KEYWORDS.find(({ patterns }) =>
    patterns.some(
      (pattern) => pattern.test(category.name) || pattern.test(category.id)
    )
  );

  if (directMatch) {
    return directMatch.label;
  }

  if (typeof index === "number") {
    return ["Men", "Women", "Kids"][index] ?? category.name;
  }

  return category.name;
};

export const normalizeCategories = (categories: Category[]) =>
  categories.map((category, index) => ({
    ...category,
    name: normalizeCategoryLabel(category, index),
  }));
