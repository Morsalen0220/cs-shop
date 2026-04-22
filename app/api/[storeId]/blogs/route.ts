import { NextResponse } from "next/server";
import { mockBlogPosts } from "@/lib/mock-blog-posts";
import { mapBlogPost, supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const mergeWithDemoPosts = <T extends { slug: string }>(posts: T[], demoPosts: T[]) => {
  const usedSlugs = new Set(posts.map((post) => post.slug));
  const remainingDemoPosts = demoPosts.filter((post) => !usedSlugs.has(post.slug));

  return [...posts, ...remainingDemoPosts];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get("includeUnpublished") === "true";
  const page = Math.max(Number(searchParams.get("page") || "1"), 1);
  const pageSize = Math.max(Number(searchParams.get("limit") || "10"), 1);
  const useMockData = !process.env.NEXT_PUBLIC_SUPABASE_URL;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  if (useMockData) {
    const allPosts = includeUnpublished
      ? mockBlogPosts
      : mockBlogPosts.filter((post) => post.isPublished);

    return NextResponse.json({
      page,
      pageSize,
      posts: allPosts.slice(start, end),
      totalPages: Math.max(1, Math.ceil(allPosts.length / pageSize)),
      totalPosts: allPosts.length,
    });
  }

  let query = supabase
    .from("blogs")
    .select(
      "id, slug, title, excerpt, content, category, cover_image_url, read_time, is_published, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false });

  if (!includeUnpublished) {
    query = query.eq("is_published", true);
  }

  query = query.range(start, end - 1);

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mappedPosts = (data ?? []).map(mapBlogPost);
  const publishedDemoPosts = mockBlogPosts.filter((post) => post.isPublished);
  const totalRealPosts = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalRealPosts / pageSize));
  const posts =
    includeUnpublished || page > 1 || mappedPosts.length >= pageSize
      ? mappedPosts
      : mergeWithDemoPosts(mappedPosts, publishedDemoPosts).slice(0, pageSize);

  return NextResponse.json({
    page,
    pageSize,
    posts,
    totalPages,
    totalPosts: totalRealPosts,
  });
}
