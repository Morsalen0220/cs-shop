import { NextResponse } from "next/server";
import { mockBlogPosts } from "@/lib/mock-blog-posts";
import { mapBlogPost, supabase } from "@/lib/supabase";

interface RouteProps {
  params: {
    blogId: string;
  };
}

const createSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export async function GET(_request: Request, { params }: RouteProps) {
  const useMockData = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (useMockData) {
    const post = mockBlogPosts.find((item) => item.id === params.blogId) ?? null;
    return NextResponse.json(post, { status: post ? 200 : 404 });
  }

  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, slug, title, excerpt, content, category, cover_image_url, read_time, is_published, created_at"
    )
    .eq("id", params.blogId)
    .single();

  if (error || !data) {
    return NextResponse.json(null, { status: 404 });
  }

  return NextResponse.json(mapBlogPost(data));
}

export async function PATCH(request: Request, { params }: RouteProps) {
  const body = await request.json();

  const { error } = await supabase
    .from("blogs")
    .update({
      slug: createSlug(String(body.slug || body.title || "")),
      title: String(body.title || ""),
      excerpt: String(body.excerpt || ""),
      content: String(body.content || ""),
      category: String(body.category || "Blog"),
      cover_image_url: String(body.coverImageUrl || "/images/image-1.jpg"),
      read_time: String(body.readTime || "5 min read"),
      is_published: Boolean(body.isPublished),
    })
    .eq("id", params.blogId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: params.blogId });
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  const { error } = await supabase.from("blogs").delete().eq("id", params.blogId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: params.blogId });
}
