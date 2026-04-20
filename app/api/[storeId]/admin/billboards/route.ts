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
  const label = String(body.name || "");
  const imageUrl = String(body.imageUrl || "/images/nike-just-do-it.jpg");
  const id = createId(label);

  if (!id) {
    return NextResponse.json({ error: "Label is required" }, { status: 400 });
  }

  const { error } = await supabase.from("billboards").insert({
    id,
    label,
    image_url: imageUrl,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id });
}
