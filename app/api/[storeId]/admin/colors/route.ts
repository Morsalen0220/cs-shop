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
    return NextResponse.json({ error: "Color ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("colors")
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
  const value = String(body.value || "");
  const id = createId(name);

  if (!id || !value) {
    return NextResponse.json({ error: "Name and value are required" }, { status: 400 });
  }

  const { error } = await supabase.from("colors").insert({
    id,
    name,
    value,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, value } = body;

  if (!id || !name || !value) {
    return NextResponse.json(
      { error: "ID, name and value are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("colors")
    .update({ name, value })
    .eq("id", id)
    .select();

  if (error) {
    console.error("Color update error:", error);
    return NextResponse.json({
      error: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Color ID is required" }, { status: 400 });
  }

  const { error } = await supabase.from("colors").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
