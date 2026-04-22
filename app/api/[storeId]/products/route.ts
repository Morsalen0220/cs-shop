import { NextResponse } from "next/server";
import { mapProduct, supabase } from "@/lib/supabase";
import { products } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("categoryId");
  const colorId = searchParams.get("colorId");
  const sizeId = searchParams.get("sizeId");
  const q = searchParams.get("q")?.trim().toLowerCase();
  const includeArchived = searchParams.get("includeArchived") === "true";
  const isFeatured = searchParams.get("isFeatured");
  const useMockData = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (useMockData) {
    const filteredProducts = products.filter((product) => {
      if (!includeArchived && product.isArchived) {
        return false;
      }

      if (isFeatured && product.isFeatured !== (isFeatured === "true")) {
        return false;
      }

      if (categoryId && product.category.id !== categoryId) {
        return false;
      }

      if (colorId && product.color.id !== colorId) {
        return false;
      }

      if (sizeId && product.size.id !== sizeId) {
        return false;
      }

      if (
        q &&
        ![product.name, product.description, product.category.name]
          .join(" ")
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }

      return true;
    });

    return NextResponse.json(filteredProducts);
  }

  let query = supabase.from("products").select(`
    id,
    name,
    description,
    is_archived,
    is_featured,
    price,
    categories(id, name, billboards(id, label, image_url)),
    sizes(id, name, value),
    colors(id, name, value),
    product_images(id, url)
  `);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  if (colorId) {
    query = query.eq("color_id", colorId);
  }

  if (sizeId) {
    query = query.eq("size_id", sizeId);
  }

  if (isFeatured) {
    query = query.eq("is_featured", isFeatured === "true");
  }

  if (q) {
    const escapedQuery = q.replace(/,/g, "\\,");
    query = query.or(
      `name.ilike.%${escapedQuery}%,description.ilike.%${escapedQuery}%`
    );
  }

  if (!includeArchived) {
    query = query.not("is_archived", "is", "true");
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map(mapProduct));
}
