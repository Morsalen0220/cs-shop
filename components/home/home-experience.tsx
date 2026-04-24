"use client";

import Button from "@/components/ui/button";
import { Formatter } from "@/components/ui/currency";
import { defaultHomeSettings, readHomeSettings } from "@/lib/home-settings";
import {
  BRAND_OPTIONS,
  inferBrandFromProduct,
  normalizeCategoryLabel,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { HomeSettings, Product } from "@/types";
import {
  ArrowRight,
  BadgePercent,
  Clock3,
  Headphones,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Countdown from "./countdown";

interface HomeExperienceProps {
  heroFontClassName: string;
  products: Product[];
}

const serviceItems = [
  { icon: Truck, title: "Free Shipping", description: "On orders over $99" },
  { icon: ShieldCheck, title: "Secure Payment", description: "100% secure checkout" },
  { icon: RotateCcw, title: "Easy Returns", description: "30 day return policy" },
  { icon: Headphones, title: "24/7 Support", description: "Always here to help" },
];

const featureItems = [
  {
    icon: BadgePercent,
    title: "Exclusive Deals",
    text: "Members-only offers with sharper markdowns and better timing.",
  },
  {
    icon: ShoppingBag,
    title: "New Arrivals",
    text: "Fresh pairs and cleaner collections highlighted every week.",
  },
];

const ProductTile = ({
  badge,
  product,
}: {
  badge?: string;
  product: Product;
}) => {
  const router = useRouter();
  const imageUrl = product.images?.[0]?.url || "/images/image-1.jpg";
  const brandLabel = inferBrandFromProduct(product);
  const productHref = `/product/${product.id}`;

  const handleNavigate = () => {
    router.push(productHref);
  };

  const handlePrefetch = () => {
    router.prefetch(productHref);
  };

  return (
    <article
      className="home-product-tile group cursor-pointer overflow-hidden rounded-[26px] border border-black/8 bg-white shadow-[0_18px_42px_rgba(17,17,17,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(17,17,17,0.08)]"
      onClick={handleNavigate}
      onFocus={handlePrefetch}
      onMouseEnter={handlePrefetch}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNavigate();
        }
      }}
    >
      <div className="relative aspect-[1/1] overflow-hidden bg-[linear-gradient(180deg,_#f7f3ee_0%,_#f0e8df_100%)]">
        {badge ? (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-[#ff6a1a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
            {badge}
          </span>
        ) : null}
        <Image
          alt={product.name}
          className="object-cover transition duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 50vw, 240px"
          src={imageUrl}
        />
      </div>
      <div className="space-y-2 p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ff6a1a]">
          {brandLabel}
        </p>
        <h3 className="line-clamp-1 text-[15px] font-semibold text-[#111111]">
          {product.name}
        </h3>
        <div className="flex flex-col gap-2">
          <span className="block min-w-0 break-words text-lg font-semibold leading-none text-[#111111]">
            {Formatter.format(Number(product.price))}
          </span>
          <div className="flex flex-wrap items-center gap-1 text-[#f59e0b]">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-3.5 w-3.5 fill-current" />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

const SectionHeading = ({
  title,
  description,
  href,
}: {
  title: string;
  description?: string;
  href: string;
}) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="text-[28px] font-semibold uppercase tracking-[0.06em] text-[#111111]">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">{description}</p>
      ) : null}
    </div>
    <Link
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#111111]"
      href={href}
    >
      View All
      <ArrowRight className="h-4 w-4" />
    </Link>
  </div>
);

const HomeExperience: React.FC<HomeExperienceProps> = ({
  heroFontClassName,
  products,
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

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const resolveProducts = (ids: string[], fallback: Product[], limit: number) => {
    const selected = ids
      .map((id) => productMap.get(id))
      .filter((product): product is Product => Boolean(product));
    const merged = [...selected];

    for (const product of fallback) {
      if (!merged.some((item) => item.id === product.id)) {
        merged.push(product);
      }
    }

    return merged.slice(0, limit);
  };

  const heroProducts = resolveProducts(
    settings.bestSellerSection.productIds,
    products,
    2
  );
  const newArrivals = resolveProducts(
    settings.newArrivalsSection.productIds,
    [...products].reverse(),
    4
  );
  const bestSellers = resolveProducts(
    settings.bestSellerSection.productIds,
    products.filter((product) => product.isFeatured),
    4
  );

  const categoryCollections = useMemo(() => {
    const categories = ["Men", "Women", "Kids"];

    return categories.map((label, index) => {
      const categoryProducts = products.filter(
        (product) => normalizeCategoryLabel(product.category) === label
      );

      return {
        label,
        product:
          categoryProducts[0] ??
          products[index] ??
          heroProducts[0] ??
          null,
        href: `/shop?categoryId=${categoryProducts[0]?.category.id ?? ""}`,
        tone:
          index === 0
            ? "from-[#f4f3f6] to-[#e8eaee]"
            : index === 1
            ? "from-[#ffe8e6] to-[#ffd8d0]"
            : "from-[#eef5e3] to-[#dde8cf]",
      };
    });
  }, [heroProducts, products]);

  const heroProduct = heroProducts[0] ?? products[0] ?? null;
  const accentProduct = heroProducts[1] ?? products[1] ?? heroProduct;
  const heroBrand = heroProduct ? inferBrandFromProduct(heroProduct) : settings.header.brandLabel;
  const marqueeBrands = [...BRAND_OPTIONS, ...BRAND_OPTIONS];

  return (
    <div className="home-experience space-y-5 pb-10 sm:space-y-6 sm:pb-12">
      <section className="home-surface home-hero-shell overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_28px_72px_rgba(17,17,17,0.08)] sm:rounded-[34px]">
        <div className="home-hero-inner relative overflow-hidden bg-[radial-gradient(circle_at_72%_28%,_rgba(255,106,26,0.12),_transparent_18%),linear-gradient(180deg,_#fffdfb_0%,_#fbf1e8_100%)] px-3 py-3.5 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
          <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#ffede2]" />
          <div className="absolute right-20 top-16 h-64 w-64 rounded-full border border-[#f2ddd0]" />

          <div className="relative grid gap-5 sm:gap-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-center">
            <div className="space-y-3.5 sm:space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#ff6a1a]/20 bg-[#fff1e8] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ff6a1a]">
                  New Arrival
                </span>
                <span className="rounded-full bg-white/90 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#111111] shadow-sm">
                  {heroBrand}
                </span>
              </div>

              <div>
                <h1
                  className={cn(
                    "max-w-[8.5ch] text-[2.45rem] leading-[0.88] text-[#111111] sm:text-[4.1rem] lg:text-[4.8rem]",
                    heroFontClassName
                  )}
                >
                  BUILT FOR
                  <span className="block text-[#ff6a1a]">EVERY STEP</span>
                </h1>
                <p className="mt-2.5 max-w-lg text-[13px] leading-6 text-gray-600 sm:mt-4 sm:text-[15px] sm:leading-7">
                  A cleaner premium storefront with sharper promotions, calmer spacing,
                  and faster paths into your catalog.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/new-arrivals">
                  <Button className="group h-11 w-full rounded-[16px] bg-[#111111] px-6 text-sm font-semibold text-white hover:opacity-100 sm:w-auto">
                    Shop New Arrivals
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button className="h-11 w-full rounded-[16px] border border-[#111111] bg-white px-6 text-sm font-semibold text-[#111111] hover:bg-[#111111] hover:text-white sm:w-auto">
                    Explore Collection
                  </Button>
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[20px] border border-black/6 bg-white/78 p-3.5 shadow-[0_16px_30px_rgba(17,17,17,0.04)] sm:rounded-[22px] sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Starting From
                  </p>
                  <p className="mt-2 break-words text-[2rem] font-semibold leading-none text-[#111111] sm:text-2xl">
                    {heroProduct ? Formatter.format(Number(heroProduct.price)) : "$89.99"}
                  </p>
                </div>
                <div className="rounded-[20px] border border-black/6 bg-white/78 p-3.5 shadow-[0_16px_30px_rgba(17,17,17,0.04)] sm:rounded-[22px] sm:p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Best For
                  </p>
                  <p className="mt-2 text-[14px] font-semibold text-[#111111] sm:text-[15px]">
                    Daily comfort and premium essentials
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
              <div className="relative min-h-[250px] overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_52%_32%,_rgba(255,160,122,0.22),_transparent_34%),linear-gradient(180deg,_#fff9f4_0%,_#f7ede4_100%)] sm:min-h-[360px] sm:rounded-[32px]">
                <div className="absolute inset-x-10 top-10 h-[280px] rounded-full bg-[#f3e6db] blur-3xl" />
                <div className="absolute bottom-0 left-[12%] h-28 w-44 rounded-[36px_36px_0_0] bg-[linear-gradient(180deg,_#5d544f_0%,_#2a2320_100%)] opacity-90 shadow-[0_-10px_30px_rgba(0,0,0,0.16)] [transform:perspective(500px)_rotateX(66deg)_rotateZ(-24deg)]" />
                {heroProduct ? (
                  <Image
                    alt={heroProduct.name}
                    className="relative z-10 object-contain p-3 drop-shadow-[0_28px_30px_rgba(0,0,0,0.18)] sm:p-4"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 520px"
                    src={heroProduct.images?.[0]?.url || "/images/nike-reactx.png"}
                  />
                ) : null}
              </div>

              <div className="space-y-4">
                <div className="home-accent-card rounded-[24px] bg-[#ff6a1a] px-4 py-5 text-white shadow-[0_24px_54px_rgba(255,106,26,0.22)] sm:rounded-[28px] sm:px-5 sm:py-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/80">
                    Up to 50% Off
                  </p>
                  <p className="mt-3 text-[26px] font-semibold leading-none sm:text-[30px]">Fresh sale picks</p>
                  <p className="mt-3 text-sm leading-6 text-white/80">
                    Stronger focus on the key offer without clutter.
                  </p>
                </div>

                <div className="rounded-[24px] border border-[#efdcd0] bg-[linear-gradient(180deg,_#fff8f2_0%,_#fff1e5_100%)] p-3.5 sm:rounded-[28px] sm:p-5 shadow-[0_18px_36px_rgba(17,17,17,0.06)]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#111111]">
                      Limited Time Only
                    </p>
                    <Clock3 className="h-4 w-4 text-[#ff6a1a]" />
                  </div>
                  <div className="mt-4 overflow-hidden">
                    <Countdown target={settings.promoSection.countdownTarget} />
                  </div>
                  <Link className="mt-5 block" href="/sale">
                    <Button className="h-12 w-full rounded-[18px] bg-[#111111] text-sm font-semibold text-white hover:bg-[#1f1f1f]">
                      Shop Sale
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-surface home-service-strip grid gap-3 rounded-[24px] border border-black/8 bg-white px-3 py-3 shadow-[0_18px_50px_rgba(17,17,17,0.04)] sm:grid-cols-2 sm:gap-3 sm:px-4 sm:py-4 lg:grid-cols-4 lg:px-6">
        {serviceItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              className="home-service-card flex items-center gap-3 rounded-[18px] border border-black/5 bg-[#fcfaf7] p-3"
              key={item.title}
            >
              <div className="home-service-icon rounded-2xl bg-[#fff2e8] p-2.5 text-[#111111]">
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#111111]">{item.title}</p>
                <p className="text-[13px] text-gray-500">{item.description}</p>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-3 sm:gap-4 lg:grid-cols-[1fr_1fr_1fr]">
        {categoryCollections.map((collection) => (
          <Link
            className={cn(
              "home-category-card group relative overflow-hidden rounded-[28px] bg-gradient-to-br p-5 shadow-[0_20px_50px_rgba(17,17,17,0.05)]",
              collection.tone
            )}
            href={collection.href || "/shop"}
            key={collection.label}
          >
            <div className="relative z-10">
              <p className="home-category-label text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                {collection.label}&apos;s
              </p>
              <h3 className="home-category-title mt-2 text-[26px] font-semibold uppercase leading-none text-[#111111]">
                Collection
              </h3>
              <span className="home-category-link mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#111111]">
                Shop Now
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
            {collection.product ? (
              <div className="relative mt-6 h-48">
                <Image
                  alt={collection.product.name}
                  className="object-contain object-bottom drop-shadow-[0_24px_30px_rgba(17,17,17,0.18)]"
                  fill
                  sizes="(max-width: 1024px) 40vw, 240px"
                  src={collection.product.images?.[0]?.url || "/images/image-1.jpg"}
                />
              </div>
            ) : null}
          </Link>
        ))}
      </section>

      <section>
        <SectionHeading
          description={settings.newArrivalsSection.description}
          href="/new-arrivals"
          title={settings.newArrivalsSection.title}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {newArrivals.map((product, index) => (
            <ProductTile
              badge={index < 3 ? settings.newArrivalsSection.badgeText || "New" : undefined}
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="home-promo-dark overflow-hidden rounded-[26px] bg-[linear-gradient(135deg,_#191919_0%,_#0f0f0f_68%,_#333333_100%)] px-5 py-6 text-white shadow-[0_18px_36px_rgba(17,17,17,0.12)] sm:px-7">
          <div className="grid gap-5 md:grid-cols-[0.88fr_1.12fr] md:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ffb17a]">
                Performance Edit
              </p>
              <h3 className="mt-4 text-[34px] font-semibold uppercase leading-none">
                Run Further.
                <span className="mt-2 block">Dream Bigger.</span>
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/72">
                Cleaner campaign space for featured collections and seasonal promos.
              </p>
              <Link href="/shop">
                <Button className="mt-6 h-11 rounded-[16px] bg-white px-6 text-sm font-semibold text-[#111111] hover:bg-[#ffede2]">
                  Shop Running
                </Button>
              </Link>
            </div>

            <div className="relative h-52 sm:h-64">
              {heroProduct ? (
                <Image
                  alt={heroProduct.name}
                  className="object-contain drop-shadow-[0_28px_36px_rgba(0,0,0,0.34)]"
                  fill
                  sizes="(max-width: 768px) 90vw, 420px"
                  src={heroProduct.images?.[0]?.url || "/images/image-1.jpg"}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="home-promo-sale overflow-hidden rounded-[26px] bg-[linear-gradient(135deg,_#fff3ea_0%,_#fffdf9_100%)] px-5 py-6 shadow-[0_18px_36px_rgba(17,17,17,0.06)] sm:px-7">
          <div className="grid gap-5 md:grid-cols-[0.85fr_1.15fr] md:items-center">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#ff6a1a]">
                Summer Sale
              </p>
              <h3 className="mt-3 text-[34px] font-semibold uppercase leading-none text-[#ff6a1a] sm:text-[42px]">
                Sale
              </h3>
              <p className="mt-2 text-xl font-semibold text-[#111111]">Up to 40% off</p>
              <p className="mt-2 text-sm text-gray-600">On selected styles</p>
              <Link href="/sale">
                <Button className="mt-6 h-11 rounded-[16px] bg-[#111111] px-6 text-sm font-semibold text-white hover:bg-[#ff6a1a]">
                  Shop Now
                </Button>
              </Link>
            </div>

            <div className="relative h-48 overflow-hidden rounded-[18px] sm:h-56">
              {accentProduct ? (
                <Image
                  alt={accentProduct.name}
                  className="object-cover drop-shadow-[0_20px_24px_rgba(17,17,17,0.16)]"
                  fill
                  sizes="(max-width: 768px) 90vw, 360px"
                  src={accentProduct.images?.[0]?.url || "/images/image-2.jpg"}
                />
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          description={settings.bestSellerSection.description}
          href="/shop"
          title={settings.bestSellerSection.title}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductTile
              badge={settings.bestSellerSection.badgeText || "Best Seller"}
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      <section className="home-surface rounded-[30px] border border-black/8 bg-white px-3 py-4 shadow-[0_18px_40px_rgba(17,17,17,0.04)] sm:px-5 sm:py-5">
        <div className="brand-marquee">
          <div className="brand-marquee-track gap-3">
            {marqueeBrands.map((brand, index) => (
              <div
                className="flex min-w-[170px] items-center justify-center rounded-[20px] border border-black/6 bg-[#faf7f3] px-6 py-5 text-center text-base font-semibold uppercase tracking-[0.08em] text-[#111111]"
                key={`${brand}-${index}`}
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="home-newsletter-card rounded-[26px] bg-[#121212] px-5 py-5 text-white shadow-[0_14px_32px_rgba(17,17,17,0.12)] sm:px-6 sm:py-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/60">
            {settings.newsletterSection.title}
          </p>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
            {settings.newsletterSection.description}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              className="h-11 flex-1 rounded-[16px] border border-white/10 bg-[#1d1d1d] px-4 text-sm text-white outline-none placeholder:text-white/40"
              placeholder={settings.newsletterSection.placeholder}
              type="email"
            />
            <Button className="h-11 rounded-[16px] bg-[#ff6a1a] px-5 text-sm font-semibold text-white hover:bg-[#ff7f38]">
              {settings.newsletterSection.buttonLabel}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {featureItems.map((item) => {
            const Icon = item.icon;

            return (
              <div
                className="home-feature-card rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_12px_28px_rgba(17,17,17,0.04)]"
                key={item.title}
              >
                <div className="home-feature-icon inline-flex rounded-2xl bg-[#fff2e8] p-3 text-[#111111]">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="mt-4 text-[15px] font-semibold uppercase leading-6 tracking-[0.08em] text-[#111111]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-500">{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HomeExperience;
