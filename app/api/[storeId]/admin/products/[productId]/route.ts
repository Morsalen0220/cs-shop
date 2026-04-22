import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface RouteProps {
  params: {
    productId: string;
  };
}

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

export async function PATCH(request: Request, { params }: RouteProps) {
  const body = await request.json();
  const productId = params.productId;
  const imageUrls = normalizeImageUrls(body.imageUrls ?? body.imageUrl);

  if (!productId) {
    return NextResponse.json({ error: "Product id is required" }, { status: 400 });
  }

  const { error: productError } = await supabase
    .from("products")
    .update({
      name: String(body.name || ""),
      description: String(body.description || ""),
      price: String(body.price || "0"),
      category_id: String(body.categoryId || ""),
      size_id: String(body.sizeId || ""),
      color_id: String(body.colorId || ""),
      is_archived: Boolean(body.isArchived),
      is_featured: Boolean(body.isFeatured),
    })
    .eq("id", productId);

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  const { error: deleteImageError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId);

  if (deleteImageError) {
    return NextResponse.json(
      { error: deleteImageError.message },
      { status: 500 }
    );
  }

  const imageRows = (imageUrls.length > 0
    ? imageUrls
    : ["/images/nike-reactx.png"]).map((url, index) => ({
    id: `${productId}-image-${index + 1}`,
    product_id: productId,
    url,
  }));

  const { error: imageError } = await supabase.from("product_images").insert(imageRows);

  if (imageError) {
    return NextResponse.json({ error: imageError.message }, { status: 500 });
  }

  return NextResponse.json({ id: productId });
}
