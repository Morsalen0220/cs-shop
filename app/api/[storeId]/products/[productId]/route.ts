import { NextResponse } from "next/server";
import { mapProduct, supabase } from "@/lib/supabase";
import { products } from "@/lib/mock-data";

interface RouteProps {
  params: {
    productId: string;
  };
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { data, error } = await supabase
    .from("products")
    .select(`
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
    `)
    .eq("id", params.productId)
    .single();

  if (error || !data) {
    const product = products.find((item) => item.id === params.productId);

    if (product) {
      return NextResponse.json(product);
    }

    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(mapProduct(data));
}
