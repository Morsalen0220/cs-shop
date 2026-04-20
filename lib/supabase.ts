import { createClient } from "@supabase/supabase-js";
import type { Billboard, Category, Color, Product, Size } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type BillboardRow = {
  id: string;
  label: string;
  image_url: string;
};

type OneOrMany<T> = T | T[] | null;

type CategoryRow = {
  id: string;
  name: string;
  billboards: OneOrMany<BillboardRow>;
};

type SizeRow = {
  id: string;
  name: string;
  value: string;
};

type ColorRow = {
  id: string;
  name: string;
  value: string;
};

type ProductImageRow = {
  id: string;
  url: string;
};

type ProductRow = {
  id: string;
  name: string;
  description: string;
  is_archived?: boolean | null;
  is_featured?: boolean | null;
  price: string;
  categories: OneOrMany<CategoryRow>;
  sizes: OneOrMany<SizeRow>;
  colors: OneOrMany<ColorRow>;
  product_images: ProductImageRow[] | null;
};

const firstRelation = <T>(value: OneOrMany<T>): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
};

export const mapBillboard = (row: BillboardRow): Billboard => ({
  id: row.id,
  label: row.label,
  imageUrl: row.image_url,
});

export const mapCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name,
  billboard: firstRelation(row.billboards)
    ? mapBillboard(firstRelation(row.billboards) as BillboardRow)
    : { id: "", label: "", imageUrl: "" },
});

export const mapSize = (row: SizeRow): Size => ({
  id: row.id,
  name: row.name,
  value: row.value,
});

export const mapColor = (row: ColorRow): Color => ({
  id: row.id,
  name: row.name,
  value: row.value,
});

export const mapProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  isArchived: Boolean(row.is_archived),
  isFeatured: Boolean(row.is_featured),
  price: row.price,
  category: firstRelation(row.categories)
    ? mapCategory(firstRelation(row.categories) as CategoryRow)
    : {
        id: "",
        name: "",
        billboard: { id: "", label: "", imageUrl: "" },
      },
  size: firstRelation(row.sizes)
    ? mapSize(firstRelation(row.sizes) as SizeRow)
    : { id: "", name: "", value: "" },
  color: firstRelation(row.colors)
    ? mapColor(firstRelation(row.colors) as ColorRow)
    : { id: "", name: "", value: "" },
  images: row.product_images ?? [],
});
