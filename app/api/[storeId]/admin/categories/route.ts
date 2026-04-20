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

  if (!id || !body.billboardId) {
    return NextResponse.json(
      { error: "Name and billboard are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("categories").insert({
    id,
    name,
    billboard_id: String(body.billboardId),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id });
}
