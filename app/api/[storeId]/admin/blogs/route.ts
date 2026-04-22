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
  const title = String(body.title || "").trim();
  const slug = createId(String(body.slug || title));
  const id = createId(title);

  if (!title || !slug || !id) {
    return NextResponse.json(
      { error: "Title and slug are required" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("blogs").insert({
    id,
    slug,
    title,
    excerpt: String(body.excerpt || ""),
    content: String(body.content || ""),
    category: String(body.category || "Blog"),
    cover_image_url: String(body.coverImageUrl || "/images/image-1.jpg"),
    read_time: String(body.readTime || "5 min read"),
    is_published: Boolean(body.isPublished),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id, slug });
}
