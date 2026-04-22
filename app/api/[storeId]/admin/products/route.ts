import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const createId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const normalizeImageUrls = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  const fallback = String(value || "").trim();
  return fallback ? [fallback] : [];
};

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "");
  const id = createId(name);
  const imageUrls = normalizeImageUrls(body.imageUrls ?? body.imageUrl);

  if (!id) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const { error: productError } = await supabase.from("products").insert({
    id,
    name,
    description: String(body.description || ""),
    price: String(body.price || "0"),
    category_id: String(body.categoryId || ""),
    size_id: String(body.sizeId || ""),
    color_id: String(body.colorId || ""),
    is_archived: Boolean(body.isArchived),
    is_featured: Boolean(body.isFeatured),
  });

  if (productError) {
    return NextResponse.json(
      { error: productError.message },
      { status: 500 }
    );
  }

  const imageRows = (imageUrls.length > 0
    ? imageUrls
    : ["/images/nike-reactx.png"]).map((url, index) => ({
    id: `${id}-image-${index + 1}`,
    product_id: id,
    url,
  }));

  const { error: imageError } = await supabase.from("product_images").insert(imageRows);

  if (imageError) {
    return NextResponse.json({ error: imageError.message }, { status: 500 });
  }

  return NextResponse.json({ id });
}
