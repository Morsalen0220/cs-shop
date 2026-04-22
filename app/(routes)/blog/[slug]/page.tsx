import getBlog from "@/actions/get-blog";
import getBlogs from "@/actions/get-blogs";
import Container from "@/components/ui/container";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

const formatDateLabel = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const BlogPostPage: React.FC<BlogPostPageProps> = async ({ params }) => {
  const [post, blogFeed] = await Promise.all([
    getBlog(params.slug),
    getBlogs({ limit: 4, page: 1 }),
  ]);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogFeed.posts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 3);

  return (
    <Container>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#111111]"
          href="/blog"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <article className="mt-5 overflow-hidden rounded-[34px] border border-black/8 bg-white shadow-[0_22px_70px_rgba(17,17,17,0.06)]">
          <div className="relative aspect-[1.9] bg-[#f3ece3]">
            <Image alt={post.title} className="object-cover" fill priority src={post.coverImageUrl} />
          </div>
          <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b67b55]">
              {post.category}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-[#111111] sm:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              <span>{formatDateLabel(post.createdAt)}</span>
              <span>{post.readTime}</span>
            </div>
            <p className="mt-6 text-lg leading-8 text-gray-500">{post.excerpt}</p>
            <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-base leading-8 text-gray-700">
              {post.content}
            </div>
          </div>
        </article>

        {relatedPosts.length > 0 ? (
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#111111]">More Stories</h2>
              <Link
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#111111]"
                href="/blog"
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((item) => (
                <Link
                  className="overflow-hidden rounded-[26px] border border-black/8 bg-white shadow-[0_16px_40px_rgba(17,17,17,0.05)]"
                  href={`/blog/${item.slug}`}
                  key={item.id}
                >
                  <div className="relative aspect-[1.2] bg-[#f3ece3]">
                    <Image alt={item.title} className="object-cover" fill src={item.coverImageUrl} />
                  </div>
                  <div className="space-y-3 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#b67b55]">
                      {item.category}
                    </p>
                    <h3 className="text-xl font-semibold leading-8 text-[#111111]">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-6 text-gray-500">{item.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Container>
  );
};

export default BlogPostPage;
