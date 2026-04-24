"use client";

import { defaultHomeSettings, readHomeSettings } from "@/lib/home-settings";
import { BlogPost, HomeSettings } from "@/types";
import { ArrowLeft, ArrowRight, BookOpen, CreditCard, Headphones, Search, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const iconMap = [Truck, ArrowRight, CreditCard, Headphones];

interface BlogExperienceProps {
  currentPage: number;
  posts: BlogPost[];
  totalPages: number;
}

const formatDateLabel = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const BlogExperience: React.FC<BlogExperienceProps> = ({
  currentPage,
  posts,
  totalPages,
}) => {
  const [settings, setSettings] = useState<HomeSettings>(defaultHomeSettings);

  useEffect(() => {
    const syncSettings = () => setSettings(readHomeSettings());

    syncSettings();
    window.addEventListener("storage", syncSettings);
    window.addEventListener("home-settings-updated", syncSettings);

    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener("home-settings-updated", syncSettings);
    };
  }, []);

  const blog = settings.blog;

  const categoryTiles = useMemo(() => {
    const grouped = new Map<
      string,
      { label: string; count: number; imageUrl: string }
    >();

    for (const post of posts) {
      const existing = grouped.get(post.category);

      grouped.set(post.category, {
        label: post.category,
        count: (existing?.count ?? 0) + 1,
        imageUrl: existing?.imageUrl ?? post.coverImageUrl,
      });
    }

    return [
      {
        id: "all",
        label: "All Articles",
        countLabel: `${posts.length} Posts`,
        imageUrl: posts[0]?.coverImageUrl || "/images/image-1.jpg",
      },
      ...Array.from(grouped.entries()).slice(0, 5).map(([key, value]) => ({
        id: key,
        label: value.label,
        countLabel: `${value.count} Posts`,
        imageUrl: value.imageUrl,
      })),
    ];
  }, [posts]);

  const featuredPosts = posts.slice(0, 3);
  const explorePosts = posts.slice(3, 7).length > 0 ? posts.slice(3, 7) : posts.slice(0, 4);
  const trendingPosts = posts.slice(0, 4);
  const [primaryArticle, ...secondaryArticles] = featuredPosts;
  const paginationPages = Array.from({ length: totalPages }, (_, index) => index + 1).filter(
    (page) =>
      totalPages <= 7 ||
      page === 1 ||
      page === totalPages ||
      Math.abs(page - currentPage) <= 1
  );

  if (!blog.enabled) {
    return (
      <div className="rounded-[32px] border border-dashed border-black/10 bg-white p-12 text-center">
        <p className="text-2xl font-semibold text-[#111111]">Blog page is hidden.</p>
        <p className="mt-3 text-sm text-gray-500">
          Admin Website settings theke Blog page on korlei eta storefront-e show korbe.
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-[32px] border border-dashed border-black/10 bg-white p-12 text-center">
        <p className="text-2xl font-semibold text-[#111111]">No blog posts yet.</p>
        <p className="mt-3 text-sm text-gray-500">
          Admin panel theke new blog post add korle ekhane automatically show korbe.
        </p>
      </div>
    );
  }

  return (
    <div className="blog-page bg-[linear-gradient(180deg,_#f8f4ee_0%,_#fdfbf8_34%,_#ffffff_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="blog-hero overflow-hidden rounded-[38px] border border-black/8 bg-[radial-gradient(circle_at_left,_rgba(198,141,101,0.10),_transparent_28%),linear-gradient(135deg,_#ffffff_0%,_#fff9f3_52%,_#f7f1ea_100%)] p-6 shadow-[0_26px_80px_rgba(17,17,17,0.06)] sm:p-8">
          <div className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr] xl:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#b67b55]">
                {blog.heroEyebrow}
              </p>
              <h1 className="mt-5 max-w-[10ch] text-5xl font-semibold leading-[0.92] text-[#111111] sm:text-6xl lg:text-7xl">
                {blog.heroTitleStart}{" "}
                <span className="text-[#b67b55]">{blog.heroTitleAccent}</span>{" "}
                {blog.heroTitleEnd}
              </h1>
              <p className="mt-5 max-w-lg text-base leading-8 text-gray-500">
                {blog.heroDescription}
              </p>
              <Link
                href="#featured-stories"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {blog.heroCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-[34px] bg-[radial-gradient(circle_at_top,_rgba(198,141,101,0.16),_transparent_20%),linear-gradient(135deg,_#f7f0e8_0%,_#fffdfa_48%,_#f4ece1_100%)]">
              <div className="absolute right-6 top-6 flex h-24 w-24 items-center justify-center rounded-full border border-[#c79e7d]/25 bg-white/85 px-4 text-center text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8b5e3c] shadow-sm">
                {blog.heroBadgeText}
              </div>
              <div className="absolute inset-x-8 bottom-0 top-12">
                <Image
                  alt="Blog hero sneaker"
                  className="object-contain object-bottom"
                  fill
                  priority
                  src={blog.heroImageUrl}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="blog-surface mt-6 rounded-[32px] border border-black/8 bg-white/90 p-5 shadow-[0_20px_55px_rgba(17,17,17,0.05)] backdrop-blur">
          <div className="flex gap-4 overflow-auto pb-1">
            {categoryTiles.map((category, index) => (
              <div
                className={`flex min-w-[128px] flex-col items-center rounded-[26px] border border-black/10 bg-white px-4 py-4 text-center shadow-sm ${
                  index === 0 ? "border-[#c88d65] bg-[#fffaf4]" : ""
                }`}
                key={category.id}
              >
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-[#f7f1ea]">
                  <Image alt={category.label} className="object-cover" fill src={category.imageUrl} />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#111111]">{category.label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-400">
                  {category.countLabel}
                </p>
              </div>
            ))}

            <div className="flex min-w-[240px] items-center gap-4 rounded-[28px] bg-[#faf6f1] px-5 py-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#f1e3d5] text-[#b67b55]">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold text-[#111111]">New Here?</p>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Start exploring our most popular sneaker stories.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_340px]" id="featured-stories">
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b67b55]">
                  Editorial
                </p>
                <h2 className="mt-2 text-3xl font-semibold text-[#111111]">
                  {blog.featuredHeading}
                </h2>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.06fr_0.94fr]">
              {primaryArticle ? (
                <Link
                  className="blog-surface overflow-hidden rounded-[30px] border border-black/10 bg-white shadow-[0_20px_60px_rgba(17,17,17,0.06)]"
                  href={`/blog/${primaryArticle.slug}`}
                >
                  <div className="relative aspect-[1.04] bg-[#efe5db]">
                    <Image
                      alt={primaryArticle.title}
                      className="object-cover"
                      fill
                      src={primaryArticle.coverImageUrl}
                    />
                    <span className="absolute left-5 top-5 rounded-full border border-[#c88d65]/30 bg-[#fff4eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a8673d]">
                      {primaryArticle.category}
                    </span>
                  </div>
                  <div className="space-y-4 p-6">
                    <h3 className="max-w-[13ch] text-4xl font-semibold leading-tight text-[#111111]">
                      {primaryArticle.title}
                    </h3>
                    <p className="max-w-2xl text-base leading-7 text-gray-500">
                      {primaryArticle.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                      <span>{formatDateLabel(primaryArticle.createdAt)}</span>
                      <span>{primaryArticle.readTime}</span>
                    </div>
                  </div>
                </Link>
              ) : null}

              <div className="space-y-5">
                {secondaryArticles.map((article) => (
                  <Link
                    className="blog-surface block overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_18px_45px_rgba(17,17,17,0.06)]"
                    href={`/blog/${article.slug}`}
                    key={article.id}
                  >
                    <div className="relative aspect-[1.3] bg-[#f4efe9]">
                      <Image alt={article.title} className="object-cover" fill src={article.coverImageUrl} />
                      <span className="absolute left-4 top-4 rounded-full border border-[#c88d65]/30 bg-[#fff4eb] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a8673d]">
                        {article.category}
                      </span>
                    </div>
                    <div className="space-y-3 p-5">
                      <h3 className="text-2xl font-semibold leading-tight text-[#111111]">
                        {article.title}
                      </h3>
                      <p className="text-sm leading-6 text-gray-500">{article.excerpt}</p>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">
                        {formatDateLabel(article.createdAt)} • {article.readTime}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-2xl font-semibold text-[#111111]">More to Explore</h3>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {explorePosts.map((article) => (
                  <Link
                    className="blog-surface overflow-hidden rounded-[26px] border border-black/8 bg-white shadow-[0_14px_40px_rgba(17,17,17,0.05)]"
                    href={`/blog/${article.slug}`}
                    key={article.id}
                  >
                    <div className="relative aspect-[1.15] bg-[#f2ebe4]">
                      <Image
                        alt={article.title}
                        className="object-cover"
                        fill
                        src={article.coverImageUrl}
                      />
                    </div>
                    <div className="space-y-3 p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[#b67b55]">
                        {article.category}
                      </p>
                      <h4 className="text-lg font-semibold leading-7 text-[#111111]">
                        {article.title}
                      </h4>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                        {formatDateLabel(article.createdAt)} • {article.readTime}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div className="blog-surface rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(17,17,17,0.05)]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  className="h-12 w-full rounded-2xl border border-black/10 bg-[#fbf8f5] pl-11 pr-4 text-sm outline-none"
                  placeholder="Search articles..."
                  type="search"
                />
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-semibold text-[#111111]">Trending Now</h3>
                <div className="mt-4 space-y-3">
                  {trendingPosts.map((article, index) => (
                    <Link
                      className="blog-surface flex items-center gap-3 rounded-[24px] border border-black/8 bg-white px-3 py-3"
                      href={`/blog/${article.slug}`}
                      key={article.id}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#111111] text-xs font-semibold text-white">
                        {index + 1}
                      </div>
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#f4efe9]">
                        <Image alt={article.title} className="object-cover" fill src={article.coverImageUrl} />
                      </div>
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-semibold leading-5 text-[#111111]">
                          {article.title}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-400">
                          {formatDateLabel(article.createdAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="blog-newsletter overflow-hidden rounded-[30px] border border-black/8 bg-[linear-gradient(135deg,_#fffdfb_0%,_#faf3ea_100%)] shadow-[0_18px_50px_rgba(17,17,17,0.05)]">
              <div className="relative h-44 bg-[#f4eadf]">
                <Image
                  alt={blog.newsletter.title}
                  className="object-cover object-right"
                  fill
                  src={blog.newsletter.imageUrl}
                />
              </div>
              <div className="space-y-4 p-5">
                <h3 className="text-2xl font-semibold text-[#111111]">
                  {blog.newsletter.title}
                </h3>
                <p className="text-sm leading-7 text-gray-500">
                  {blog.newsletter.description}
                </p>
                <input
                  className="h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm outline-none"
                  placeholder={blog.newsletter.placeholder}
                  type="email"
                />
                <button className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-[#111111] px-5 text-sm font-semibold text-white transition hover:opacity-90">
                  {blog.newsletter.buttonLabel}
                </button>
              </div>
            </div>
          </aside>
        </section>

        <section className="blog-surface mt-6 rounded-[32px] border border-black/8 bg-white px-5 py-6 shadow-[0_18px_50px_rgba(17,17,17,0.04)] sm:px-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {blog.promises.map((item, index) => {
              const Icon = iconMap[index] ?? Truck;

              return (
                <div className="flex items-center gap-4" key={item.id}>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8f1e8] text-[#b67b55]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {totalPages > 1 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Link
              aria-disabled={currentPage === 1}
              className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                currentPage === 1
                  ? "pointer-events-none border-black/8 bg-white text-gray-300"
                  : "border-black/10 bg-white text-[#111111] hover:bg-[#111111] hover:text-white"
              }`}
              href={currentPage > 1 ? `/blog?page=${currentPage - 1}` : "/blog"}
            >
              <ArrowLeft className="h-4 w-4" />
              Prev
            </Link>

            {paginationPages.map((page, index) => {
              const previousPage = paginationPages[index - 1];
              const showEllipsis = previousPage && page - previousPage > 1;

              return (
                <div className="flex items-center gap-2" key={page}>
                  {showEllipsis ? (
                    <span className="px-2 text-sm font-semibold text-gray-400">...</span>
                  ) : null}
                  <Link
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition ${
                      currentPage === page
                        ? "border-[#111111] bg-[#111111] text-white"
                        : "border-black/10 bg-white text-[#111111] hover:bg-[#111111] hover:text-white"
                    }`}
                    href={page === 1 ? "/blog" : `/blog?page=${page}`}
                  >
                    {page}
                  </Link>
                </div>
              );
            })}

            <Link
              aria-disabled={currentPage === totalPages}
              className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
                currentPage === totalPages
                  ? "pointer-events-none border-black/8 bg-white text-gray-300"
                  : "border-black/10 bg-white text-[#111111] hover:bg-[#111111] hover:text-white"
              }`}
              href={`/blog?page=${currentPage + 1}`}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BlogExperience;
