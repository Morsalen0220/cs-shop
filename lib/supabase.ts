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

type CategoryRow = {
  id: string;
  name: string;
  billboards: BillboardRow | null;
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
  categories: CategoryRow | null;
  sizes: SizeRow | null;
  colors: ColorRow | null;
  product_images: ProductImageRow[] | null;
};

export const mapBillboard = (row: BillboardRow): Billboard => ({
  id: row.id,
  label: row.label,
  imageUrl: row.image_url,
});

export const mapCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name,
  billboard: row.billboards
    ? mapBillboard(row.billboards)
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
  category: row.categories
    ? mapCategory(row.categories)
    : {
        id: "",
        name: "",
        billboard: { id: "", label: "", imageUrl: "" },
      },
  size: row.sizes ? mapSize(row.sizes) : { id: "", name: "", value: "" },
  color: row.colors ? mapColor(row.colors) : { id: "", name: "", value: "" },
  images: row.product_images ?? [],
});
