import { NextResponse } from "next/server";
import { mapColor, supabase } from "@/lib/supabase";
import { colors } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const useMockData = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (useMockData) {
    return NextResponse.json(colors);
  }

  const { data, error } = await supabase.from("colors").select("id, name, value");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data.map(mapColor));
}
