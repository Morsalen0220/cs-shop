import { NextResponse } from "next/server";
import { mapCategory, supabase } from "@/lib/supabase";
import { categories } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const useMockData = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (useMockData) {
    return NextResponse.json(categories);
  }

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, billboards(id, label, image_url)");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map(mapCategory));
}
