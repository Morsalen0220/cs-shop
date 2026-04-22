import { NextResponse } from "next/server";
import { mockBlogPosts } from "@/lib/mock-blog-posts";
import { mapBlogPost, supabase } from "@/lib/supabase";

interface RouteProps {
  params: {
    slug: string;
  };
}

export async function GET(_request: Request, { params }: RouteProps) {
  const useMockData = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (useMockData) {
    const post = mockBlogPosts.find((item) => item.slug === params.slug) ?? null;
    return NextResponse.json(post, { status: post ? 200 : 404 });
  }

  const { data, error } = await supabase
    .from("blogs")
    .select(
      "id, slug, title, excerpt, content, category, cover_image_url, read_time, is_published, created_at"
    )
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    const mockPost = mockBlogPosts.find((item) => item.slug === params.slug) ?? null;
    return NextResponse.json(mockPost, { status: mockPost ? 200 : 404 });
  }

  return NextResponse.json(mapBlogPost(data));
}
