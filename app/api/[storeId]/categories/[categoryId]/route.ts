import { NextResponse } from "next/server";
import { mapCategory, supabase } from "@/lib/supabase";
import { categories } from "@/lib/mock-data";

interface RouteProps {
  params: {
    categoryId: string;
  };
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, billboards(id, label, image_url)")
    .eq("id", params.categoryId)
    .single();

  if (error || !data) {
    const category = categories.find((item) => item.id === params.categoryId);

    if (category) {
      return NextResponse.json(category);
    }

    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(mapCategory(data));
}
