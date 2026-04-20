import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const createId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

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

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, billboardId } = body;

  if (!id || !name || !billboardId) {
    return NextResponse.json(
      { error: "ID, name and billboard are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("categories")
    .update({ name, billboard_id: billboardId })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
