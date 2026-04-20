import { NextResponse } from "next/server";
import { mapBillboard, supabase } from "@/lib/supabase";
import { billboards } from "@/lib/mock-data";

interface RouteProps {
  params: {
    billboardId: string;
  };
}

export async function GET(_request: Request, { params }: RouteProps) {
  const { data, error } = await supabase
    .from("billboards")
    .select("id, label, image_url")
    .eq("id", params.billboardId)
    .single();

  if (error || !data) {
    const billboard = billboards.find((item) => item.id === params.billboardId);

    if (billboard) {
      return NextResponse.json(billboard);
    }

    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(mapBillboard(data));
}
