"use client";

import {
  BRAND_OPTIONS,
  inferBrandFromProduct,
  normalizeCategories,
  normalizeCategoryLabel,
} from "@/lib/catalog";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import { defaultHomeSettings, readHomeSettings } from "@/lib/home-settings";
import { cn } from "@/lib/utils";
import { Category, Color, HomeSettings, Product, Size } from "@/types";
import { ArrowRight, Heart, Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface NewArrivalsExperienceProps {
  categories: Category[];
  colors: Color[];
  products: Product[];
  sizes: Size[];
}

const sortOptions = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const NewArrivalsExperience: React.FC<NewArrivalsExperienceProps> = ({
  categories,
  colors,
  products,
  sizes,
}) => {
  const normalizedCategories = useMemo(() => normalizeCategories(categories), [categories]);
  const [settings, setSettings] = useState<HomeSettings>(defaultHomeSettings);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedColorId, setSelectedColorId] = useState("");
  const [selectedSizeId, setSelectedSizeId] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("latest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const section = settings.newArrivalsSection;
  const hero = settings.newArrivalsHero;

  const collectionProducts = useMemo(() => {
    const productMap = new Map(products.map((product) => [product.id, product]));
    const selected = section.productIds
      .map((id) => productMap.get(id))
      .filter((product): product is Product => Boolean(product));
    const fallback = [...products].reverse();
    const seen = new Set(selected.map((product) => product.id));
    const merged = [...selected];

    for (const product of fallback) {
      if (!seen.has(product.id)) {
        seen.add(product.id);
        merged.push(product);
      }
    }

    return merged;
  }, [products, section.productIds]);

  const priceValues = collectionProducts.map((product) => Number(product.price));
  const maxPrice = Math.max(...priceValues, 0);
  const [priceLimit, setPriceLimit] = useState(maxPrice);

  useEffect(() => {
    setPriceLimit(maxPrice);
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const latestOrder = new Map(
      collectionProducts.map((product, index) => [product.id, index])
    );

    const matchingProducts = collectionProducts.filter((product) => {
      const price = Number(product.price);

      if (selectedCategoryId && product.category.id !== selectedCategoryId) {
        return false;
      }

      if (selectedColorId && product.color.id !== selectedColorId) {
        return false;
      }

      if (selectedSizeId && product.size.id !== selectedSizeId) {
        return false;
      }

      if (selectedBrand && inferBrandFromProduct(product) !== selectedBrand) {
        return false;
      }

      if (priceLimit > 0 && price > priceLimit) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        product.name,
        product.description,
        normalizeCategoryLabel(product.category),
        inferBrandFromProduct(product),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });

    return [...matchingProducts].sort((first, second) => {
      const firstPrice = Number(first.price);
      const secondPrice = Number(second.price);

      if (sort === "price-asc") {
        return firstPrice - secondPrice;
      }

      if (sort === "price-desc") {
        return secondPrice - firstPrice;
      }

      if (sort === "name-asc") {
        return first.name.localeCompare(second.name);
      }

      if (sort === "popular") {
        return Number(second.isFeatured) - Number(first.isFeatured);
      }

      return (latestOrder.get(first.id) ?? 0) - (latestOrder.get(second.id) ?? 0);
    });
  }, [
    collectionProducts,
    priceLimit,
    searchTerm,
    selectedBrand,
    selectedCategoryId,
    selectedColorId,
    selectedSizeId,
    sort,
  ]);

  const categoryCounts = useMemo(
    () =>
      normalizedCategories.map((category) => ({
        ...category,
        count: collectionProducts.filter(
          (product) => product.category.id === category.id
        ).length,
      })),
    [normalizedCategories, collectionProducts]
  );

  const heroProducts = collectionProducts.slice(0, 2);
  const heroImages = [
    hero.imageUrl || heroProducts[0]?.images?.[0]?.url || "/images/nike-reactx.png",
    hero.secondaryImageUrl || heroProducts[1]?.images?.[0]?.url || "/images/image-1.jpg",
  ].filter(Boolean);

  const resetFilters = () => {
    setSelectedCategoryId("");
    setSelectedColorId("");
    setSelectedSizeId("");
    setSelectedBrand("");
    setSearchTerm("");
    setSort("latest");
    setPriceLimit(maxPrice);
  };

  return (
    <div className="new-arrivals-page bg-[#f7f5f0] px-2 pb-16 pt-3 sm:px-6 sm:pb-24 lg:px-8 lg:pt-4">
      <section className="new-arrivals-hero relative overflow-hidden rounded-[24px] bg-[#e9e5dd] px-4 py-6 sm:rounded-[10px] sm:px-10 sm:py-8 lg:px-12">
        <div className="relative z-10 grid min-h-[220px] gap-5 sm:min-h-[280px] lg:grid-cols-[0.9fr_1.1fr_90px] lg:items-center">
          <div>
            <h1 className="max-w-[8ch] text-[clamp(3rem,17vw,4.2rem)] font-black uppercase leading-[0.92] tracking-[-0.08em] text-[#111111] sm:text-7xl lg:text-8xl">
              {hero.title || section.title || "New Arrivals"}
            </h1>
            {hero.eyebrow ? (
              <p className="mt-3 text-xs font-black uppercase tracking-[0.22em] text-[#8a5a44]">
                {hero.eyebrow}
              </p>
            ) : null}
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#1f1f1f] sm:mt-5 sm:text-base">
              {hero.description ||
                section.description ||
                "Fresh styles. Latest trends. Step into the new."}
            </p>
            <a
              className="mt-6 inline-flex w-full items-center justify-center gap-4 rounded-full bg-[#050505] px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-white sm:w-auto sm:px-7"
              href="#new-arrival-products"
            >
              {hero.ctaLabel || "Shop now"}
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#111111]">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>

          <div className="relative h-[190px] overflow-hidden sm:h-[300px]">
            {heroImages.map((imageUrl, index) => (
              <div
                key={`${imageUrl}-${index}`}
                className={cn(
                  "absolute top-1/2 h-[170px] w-[230px] -translate-y-1/2 sm:h-[250px] sm:w-[360px]",
                  index === 0
                    ? "left-0 rotate-[-10deg]"
                    : "right-0 rotate-[10deg]"
                )}
              >
                <Image
                  alt={`${hero.title || "New arrivals"} hero ${index + 1}`}
                  className="object-contain drop-shadow-[0_32px_34px_rgba(17,17,17,0.26)]"
                  fill
                  sizes="(max-width: 768px) 80vw, 360px"
                  src={imageUrl}
                />
              </div>
            ))}
          </div>

          <div className="hidden justify-self-end lg:block">
            <p className="[writing-mode:vertical-rl] text-xs font-semibold uppercase tracking-[0.52em] text-[#111111]">
              {hero.sideLabel || "2026 Collection"}
            </p>
          </div>
        </div>
      </section>

      <div
        className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[240px_minmax(0,1fr)]"
        id="new-arrival-products"
      >
        <button
          aria-label="Open filters"
          className="mobile-floating-filter fixed left-0 top-[46%] z-50 inline-flex h-12 w-11 -translate-y-1/2 items-center justify-center rounded-r-2xl border border-l-0 border-black/10 bg-white text-[#111111] shadow-[0_14px_34px_rgba(17,17,17,0.16)] lg:hidden"
          onClick={() => setMobileFiltersOpen(true)}
          type="button"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

        {mobileFiltersOpen ? (
          <button
            aria-label="Close filters"
            className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
            type="button"
          />
        ) : null}

        <aside
          className={cn(
            "new-arrivals-sidebar space-y-5 rounded-[22px] bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:block lg:self-start lg:rounded-[10px]",
            mobileFiltersOpen
              ? "fixed inset-y-0 left-0 z-[70] block w-[min(86vw,340px)] overflow-y-auto rounded-none border-r border-black/10 shadow-[0_24px_70px_rgba(17,17,17,0.26)]"
              : "hidden lg:block"
          )}
        >
          <div className="flex items-center justify-between border-b border-black/10 pb-4 lg:hidden">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#111111]">
                New Arrival Filters
              </p>
              <p className="mt-1 text-sm text-gray-500">Choose category, size, price</p>
            </div>
            <button
              aria-label="Close filters"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10"
              onClick={() => setMobileFiltersOpen(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#111111]">
              Category
            </p>
            <div className="mt-4 space-y-3">
              {categoryCounts.map((category) => (
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-1 py-1 text-left text-sm transition",
                    selectedCategoryId === category.id
                      ? "font-black text-[#111111]"
                      : "text-gray-600 hover:text-[#111111]"
                  )}
                  key={category.id}
                  onClick={() =>
                    setSelectedCategoryId((current) =>
                      current === category.id ? "" : category.id
                    )
                  }
                  type="button"
                >
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-400">{category.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-black/10 pt-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#111111]">
              Size
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  className={cn(
                    "h-9 rounded-md border text-sm transition",
                    selectedSizeId === size.id
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-black/10 bg-white text-gray-600 hover:border-[#111111]"
                  )}
                  key={size.id}
                  onClick={() =>
                    setSelectedSizeId((current) => (current === size.id ? "" : size.id))
                  }
                  type="button"
                >
                  {size.value || size.name}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-black/10 pt-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#111111]">
              Price range
            </p>
            <input
              className="mt-5 w-full accent-[#111111]"
              max={maxPrice}
              min="0"
              onChange={(event) => setPriceLimit(Number(event.target.value))}
              type="range"
              value={priceLimit}
            />
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>{priceLimit.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t border-black/10 pt-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#111111]">
              Color
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  aria-label={`Filter by ${color.name}`}
                  className={cn(
                    "h-6 w-6 rounded-full border transition",
                    selectedColorId === color.id
                      ? "scale-110 border-[#111111] ring-2 ring-[#111111]/20"
                      : "border-black/10"
                  )}
                  key={color.id}
                  onClick={() =>
                    setSelectedColorId((current) =>
                      current === color.id ? "" : color.id
                    )
                  }
                  style={{ backgroundColor: color.value }}
                  type="button"
                />
              ))}
            </div>
          </div>

          <div className="border-t border-black/10 pt-5">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#111111]">
              Brand
            </p>
            <div className="mt-4 space-y-2">
              {BRAND_OPTIONS.map((brand) => (
                <label
                  className="flex items-center gap-2 text-sm text-gray-600"
                  key={brand}
                >
                  <input
                    checked={selectedBrand === brand}
                    onChange={() =>
                      setSelectedBrand((current) => (current === brand ? "" : brand))
                    }
                    type="checkbox"
                  />
                  {brand}
                </label>
              ))}
            </div>
          </div>

          <button
            className="h-11 w-full rounded-lg border border-black/10 text-xs font-black uppercase tracking-[0.12em] transition hover:bg-[#111111] hover:text-white"
            onClick={resetFilters}
            type="button"
          >
            Clear all
          </button>
        </aside>

        <section className="min-w-0">
          <div className="new-arrivals-toolbar mb-5 flex flex-col gap-4 rounded-[18px] bg-[#f7f5f0] lg:flex-row lg:items-center lg:justify-between lg:rounded-[10px]">
            <div className="flex items-center gap-3 overflow-auto">
              <button
                className={cn(
                  "border-b-2 px-3 py-3 text-sm font-semibold transition",
                  !selectedCategoryId
                    ? "border-[#111111] text-[#111111]"
                    : "border-transparent text-gray-500"
                )}
                onClick={() => setSelectedCategoryId("")}
                type="button"
              >
                All
              </button>
              {normalizedCategories.map((category) => (
                <button
                  className={cn(
                    "whitespace-nowrap border-b-2 px-3 py-3 text-sm font-semibold transition",
                    selectedCategoryId === category.id
                      ? "border-[#111111] text-[#111111]"
                      : "border-transparent text-gray-500 hover:text-[#111111]"
                  )}
                  key={category.id}
                  onClick={() => setSelectedCategoryId(category.id)}
                  type="button"
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none sm:w-[260px]"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search new arrivals"
                  type="search"
                  value={searchTerm}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm text-[#111111]">Sort by:</span>
                <select
                  className="h-11 min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 text-sm font-semibold outline-none sm:flex-none sm:px-4"
                  onChange={(event) => setSort(event.target.value)}
                  value={sort}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
            <span className="new-arrivals-pill inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {filteredProducts.length} items
            </span>
            {section.enabled ? (
              <span className="rounded-full bg-[#111111] px-3 py-2 text-white">
                Admin controlled
              </span>
            ) : (
              <span className="rounded-full bg-red-50 px-3 py-2 text-red-600">
                Hidden from admin
              </span>
            )}
          </div>

          {!section.enabled ? (
            <div className="rounded-[10px] border border-dashed border-black/10 bg-white p-10 text-center">
              <p className="text-lg font-black text-[#111111]">
                New Arrivals page is hidden.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Admin Website settings theke section on korlei products show korbe.
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <NoResults />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
              {filteredProducts.map((product, index) => (
                <div className="relative" key={product.id}>
                  <div className="new-arrivals-heart absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-[#111111] shadow-sm">
                    <Heart className="h-4 w-4" />
                  </div>
                  <ProductCard
                    badge={index % 3 === 2 ? "Trending" : section.badgeText || "New"}
                    data={product}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="new-arrivals-newsletter mt-10 overflow-hidden rounded-[24px] bg-[#e9ecef] px-4 py-6 sm:mt-12 sm:rounded-[10px] sm:px-10 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1fr_0.7fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-black uppercase leading-none tracking-[-0.04em] text-[#111111] sm:text-3xl">
              Get 10% off
              <br />
              your first order
            </h2>
            <p className="mt-4 text-sm leading-6 text-[#333333]">
              Subscribe to our newsletter and get exclusive deals and new arrival updates.
            </p>
          </div>
          <div className="new-arrivals-subscribe flex flex-col overflow-hidden rounded-lg bg-white sm:flex-row">
            <input
              className="h-12 min-w-0 flex-1 px-4 text-sm outline-none sm:h-14 sm:px-5"
              placeholder="Enter your email"
              type="email"
            />
            <button
              className="inline-flex h-12 items-center justify-center gap-2 bg-[#111111] px-7 text-xs font-black uppercase tracking-[0.12em] text-white sm:h-14"
              type="button"
            >
              Subscribe
              <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
          <div className="hidden h-[150px] lg:block">
            {heroProducts[0] ? (
              <Image
                alt={heroProducts[0].name}
                className="h-full w-full object-contain object-right drop-shadow-[0_22px_24px_rgba(17,17,17,0.22)]"
                height={180}
                src={heroProducts[0].images?.[0]?.url || "/images/image-1.jpg"}
                width={320}
              />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewArrivalsExperience;
