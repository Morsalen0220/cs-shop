import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const createId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.name || "");
  const id = createId(name);

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

  const { error: imageError } = await supabase.from("product_images").insert({
    id: `${id}-image-1`,
    product_id: id,
    url: String(body.imageUrl || "/images/nike-reactx.png"),
  });

  if (imageError) {
    return NextResponse.json({ error: imageError.message }, { status: 500 });
  }

  return NextResponse.json({ id });
}
