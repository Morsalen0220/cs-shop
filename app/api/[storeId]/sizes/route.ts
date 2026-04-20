import { NextResponse } from "next/server";
import { mapSize, supabase } from "@/lib/supabase";
import { sizes } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const useMockData = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (useMockData) {
    return NextResponse.json(sizes);
  }

  const { data, error } = await supabase.from("sizes").select("id, name, value");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map(mapSize));
}
