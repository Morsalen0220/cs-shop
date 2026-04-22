"use client";

import Button from "@/components/ui/button";
import ProductCard from "@/components/ui/product-card";
import { defaultHomeSettings, readHomeSettings } from "@/lib/home-settings";
import { cn } from "@/lib/utils";
import { HomeSettings, Product } from "@/types";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Star,
  TimerReset,
  Truck,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Countdown from "./countdown";
import HeroSlider from "./hero-slider";

interface HomeExperienceProps {
  heroFontClassName: string;
  products: Product[];
}

const offerHighlights = [
  "Members-first markdowns",
  "Same-day style picks",
  "Fresh drops every week",
];
const icons = [Truck, TimerReset, ShieldCheck];
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

  const resolveProducts = (ids: string[], fallback: Product[]) => {
    const selected = ids
      .map((id) => productMap.get(id))
      .filter((product): product is Product => Boolean(product));

    const merged = [...selected];

    for (const product of fallback) {
      if (merged.some((item) => item.id === product.id)) {
        continue;
      }

      merged.push(product);
    }

    return merged.slice(0, Math.max(ids.length, fallback.length));
  };

  const bestSellerProducts = resolveProducts(
    settings.bestSellerSection.productIds,
    products.filter((product) => product.isFeatured).slice(0, 4)
  );
  const newArrivalProducts = resolveProducts(
    settings.newArrivalsSection.productIds,
    [...products].reverse().slice(0, 4)
  );
  const flashSaleProducts = resolveProducts(
    settings.flashSaleSection.productIds,
    products.slice(0, 3)
  );

  return (
    <div className="pb-16">
      <section className="overflow-hidden rounded-[36px] border border-black/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,109,56,0.18),_transparent_33%),linear-gradient(135deg,_#fff4ec_0%,_#ffffff_45%,_#eef2ff_100%)] px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
        <div className="overflow-hidden rounded-[36px] border border-white/70 bg-[radial-gradient(circle_at_bottom_left,_rgba(0,186,211,0.1),_transparent_24%),linear-gradient(135deg,_rgba(255,255,255,0.96)_0%,_rgba(248,252,255,0.98)_58%,_rgba(239,247,250,0.98)_100%)] px-5 py-8 text-[#111111] shadow-[0_26px_70px_rgba(4,12,18,0.08)] backdrop-blur sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
            <div className="space-y-8">
            {settings.promoSection.enabled ? (
              <div className="space-y-7">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 shadow-[0_12px_26px_rgba(34,211,238,0.10)]">
                    <Sparkles className="h-3.5 w-3.5" />
                    {settings.promoSection.badgeText}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-[#4b5563]">
                    Curated weekly offers
                  </div>
                </div>
                <div className="space-y-5">
                  <h1
                    className={cn(
                      "max-w-[8.5ch] text-5xl font-semibold leading-[0.92] text-[#111111] sm:text-6xl lg:text-7xl",
                      heroFontClassName
                    )}
                  >
                    {settings.promoSection.title}
                  </h1>
                  <p className="max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                    {settings.promoSection.description}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {offerHighlights.map((item) => (
                      <div
                        key={item}
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3.5 py-2 text-xs font-medium text-[#334155] shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                    <Button className="group h-14 rounded-[18px] bg-[linear-gradient(135deg,_#0891b2_0%,_#06b6d4_100%)] px-8 text-base text-white shadow-[0_20px_40px_rgba(8,145,178,0.24)] transition-all duration-300 hover:translate-y-[-1px] hover:opacity-100 hover:shadow-[0_24px_48px_rgba(8,145,178,0.30)]">
                      {settings.promoSection.ctaLabel}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  <div className="flex min-h-[56px] items-center rounded-[20px] border border-black/10 bg-white/85 px-4 py-3 shadow-[0_16px_34px_rgba(15,23,42,0.08)] backdrop-blur">
                    <div className="flex flex-wrap items-center gap-3 text-[#111111]">
                      <div className="flex items-center gap-1 text-[#ffd34d]">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-base font-semibold">4.8</p>
                      <p className="text-sm text-gray-500">(11.6k total reviews)</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            </div>

            <div className="relative min-w-0">
              <HeroSlider products={products} settings={settings.heroSlider} />
            </div>
          </div>
        </div>
      </section>

      {settings.newsletterSection.enabled ? (
        <section className="mt-8 rounded-[32px] border border-black/10 bg-white px-5 py-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                Newsletter
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-[#111111]">
                {settings.newsletterSection.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                {settings.newsletterSection.description}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:max-w-md sm:flex-row">
              <input
                className="h-12 flex-1 rounded-full border border-black/10 bg-white px-5 text-sm text-[#111111] outline-none"
                placeholder={settings.newsletterSection.placeholder}
                type="email"
              />
              <Button className="h-12 whitespace-nowrap rounded-full bg-[#111111] px-6 text-white hover:opacity-90">
                {settings.newsletterSection.buttonLabel}
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {settings.bestSellerSection.enabled ? (
        <section className="mt-14 space-y-6" id="shop">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
                Highlight items
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[#111111] sm:text-4xl">
                {settings.bestSellerSection.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                {settings.bestSellerSection.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {["Fast-moving", "Top rated", "Street favorite"].map((item) => (
                <div
                  key={item}
                  className="rounded-3xl border border-black/10 bg-white px-4 py-4 text-sm font-semibold text-[#111111]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {bestSellerProducts.map((product) => (
              <ProductCard
                key={product.id}
                badge={settings.bestSellerSection.badgeText}
                data={product}
              />
            ))}
          </div>
        </section>
      ) : null}

      {settings.newArrivalsSection.enabled ? (
        <section
          className="mt-14 rounded-[36px] border border-black/10 bg-[linear-gradient(135deg,_#0f172a_0%,_#1f2937_60%,_#111111_100%)] px-5 py-8 text-white sm:px-8"
          id="new-arrivals"
        >
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
                Latest products
              </p>
              <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">
                {settings.newArrivalsSection.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70 sm:text-base">
                {settings.newArrivalsSection.description}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Fresh this week
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {newArrivalProducts.map((product) => (
              <ProductCard
                key={product.id}
                badge={settings.newArrivalsSection.badgeText}
                data={product}
              />
            ))}
          </div>
        </section>
      ) : null}

      {settings.flashSaleSection.enabled ? (
        <section
          className="mt-14 rounded-[36px] border border-[#ff5a1f]/20 bg-[linear-gradient(135deg,_#fff7f0_0%,_#ffffff_45%,_#fff1f2_100%)] px-5 py-8 sm:px-8"
          id="flash-sale"
        >
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ff5a1f]">
                Limited time deals
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[#111111] sm:text-4xl">
                {settings.flashSaleSection.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                {settings.flashSaleSection.description}
              </p>
            </div>
            {settings.promoSection.countdownEnabled ? (
              <div className="max-w-md">
                <Countdown target={settings.promoSection.countdownTarget} />
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {flashSaleProducts.map((product) => (
              <ProductCard
                key={product.id}
                badge={settings.flashSaleSection.badgeText}
                data={product}
              />
            ))}
          </div>
        </section>
      ) : null}

      {settings.whyChooseUsSection.enabled ? (
        <section className="mt-14">
          <div className="mb-6 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
              Service promise
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-[#111111] sm:text-4xl">
              {settings.whyChooseUsSection.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              {settings.whyChooseUsSection.description}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {settings.whyChooseUsSection.items.map((item, index) => {
              const Icon = icons[index] ?? ShieldCheck;

              return (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(17,17,17,0.05)]"
                >
                  <div className="inline-flex rounded-2xl bg-[#fff3ed] p-3 text-[#ff5a1f]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[#111111]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default HomeExperience;
