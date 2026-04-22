"use client";

import Countdown from "@/components/home/countdown";
import ProductCard from "@/components/ui/product-card";
import { defaultHomeSettings, readHomeSettings } from "@/lib/home-settings";
import { HomeSettings, Product, ProductSectionSettings } from "@/types";
import { ArrowRight, BadgePercent, Clock3, PackageOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type CollectionVariant = "new-arrivals" | "sale";

interface CollectionLandingProps {
  products: Product[];
  variant: CollectionVariant;
}

const variantContent = {
  "new-arrivals": {
    sectionKey: "newArrivalsSection" as const,
    eyebrow: "New arrival edit",
    kicker: "Freshly landed",
    pageLabel: "New Arrivals",
    accent: "cyan",
    heroClass:
      "bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.22),_transparent_32%),linear-gradient(135deg,_#07111f_0%,_#101827_54%,_#e8fbff_54%,_#f8feff_100%)]",
    cardClass: "border-cyan-500/20 bg-cyan-500/10 text-cyan-700",
    highlights: ["Latest drops", "Street-ready pairs", "New-season energy"],
  },
  sale: {
    sectionKey: "flashSaleSection" as const,
    eyebrow: "Limited sale edit",
    kicker: "Deals moving fast",
    pageLabel: "Sale",
    accent: "orange",
    heroClass:
      "bg-[radial-gradient(circle_at_top_right,_rgba(255,90,31,0.24),_transparent_34%),linear-gradient(135deg,_#1f1208_0%,_#2b160c_52%,_#fff1e8_52%,_#fffaf6_100%)]",
    cardClass: "border-[#ff5a1f]/20 bg-[#ff5a1f]/10 text-[#c2410c]",
    highlights: ["Limited markdowns", "Member-worthy value", "Countdown picks"],
  },
};

const CollectionLanding: React.FC<CollectionLandingProps> = ({
  products,
  variant,
}) => {
  const [settings, setSettings] = useState<HomeSettings>(defaultHomeSettings);
  const content = variantContent[variant];
  const section = settings[content.sectionKey] as ProductSectionSettings;

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

  const fallbackProducts = useMemo(() => {
    if (variant === "new-arrivals") {
      return [...products].reverse().slice(0, 8);
    }

    return products.slice(0, 8);
  }, [products, variant]);

  const pageProducts = useMemo(() => {
    const selected = section.productIds
      .map((id) => productMap.get(id))
      .filter((product): product is Product => Boolean(product));
    const merged = [...selected];

    for (const product of fallbackProducts) {
      if (!merged.some((item) => item.id === product.id)) {
        merged.push(product);
      }
    }

    return merged.slice(0, Math.max(section.productIds.length, 8));
  }, [fallbackProducts, productMap, section.productIds]);

  return (
    <div className="bg-[linear-gradient(180deg,_#f8f5f1_0%,_#ffffff_34%)]">
      <div className="px-4 pb-24 pt-4 sm:px-6 lg:px-8">
        <section
          className={`overflow-hidden rounded-[40px] border border-black/10 p-5 shadow-[0_28px_80px_rgba(17,17,17,0.10)] sm:p-8 ${content.heroClass}`}
        >
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="max-w-3xl">
              <div
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${content.cardClass}`}
              >
                {variant === "sale" ? (
                  <BadgePercent className="h-4 w-4" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {section.badgeText || content.kicker}
              </div>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.34em] text-white/55">
                {content.eyebrow}
              </p>
              <h1 className="mt-4 max-w-[10ch] text-5xl font-semibold leading-[0.9] text-white sm:text-6xl lg:text-7xl">
                {section.title || content.pageLabel}
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                {section.description}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                {content.highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/78 backdrop-blur"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[32px] border border-black/10 bg-white/90 p-5 text-[#111111] shadow-[0_24px_70px_rgba(17,17,17,0.10)] backdrop-blur sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                    Admin controlled
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight">
                    Website panel theke ei page control kora jay.
                  </h2>
                </div>
                <div className="rounded-2xl bg-[#111111] p-3 text-white">
                  <PackageOpen className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-gray-500">
                Admin Website settings-e title, description, badge, section visibility
                and product selection update korlei ei page automatically update hobe.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f7f4ef] p-4">
                  <p className="text-2xl font-semibold">{pageProducts.length}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Selected items
                  </p>
                </div>
                <div className="rounded-2xl bg-[#111111] p-4 text-white">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <Clock3 className="h-4 w-4" />
                    {section.enabled ? "Live page" : "Hidden by admin"}
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/60">
                    Toggle section visibility from admin.
                  </p>
                </div>
              </div>
              {variant === "sale" && settings.promoSection.countdownEnabled ? (
                <div className="mt-5">
                  <Countdown target={settings.promoSection.countdownTarget} />
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                Product collection
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-[#111111] sm:text-4xl">
                {section.enabled ? section.title : `${content.pageLabel} hidden`}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                {section.enabled
                  ? section.description
                  : "Admin panel-e section off kora ache. On korle selected products ekhane dekhabe."}
              </p>
            </div>
            <Link
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#111111] px-6 text-sm font-semibold text-white transition hover:opacity-75"
              href="/shop"
            >
              Explore all products
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          {section.enabled && pageProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  badge={section.badgeText}
                  data={product}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[32px] border border-dashed border-black/10 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-[#111111]">
                No products to show right now.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Admin Website settings theke products select korlei ei page ready.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CollectionLanding;
