"use client";

import {
  BRAND_OPTIONS,
  inferBrandFromProduct,
  normalizeCategories,
  normalizeCategoryLabel,
} from "@/lib/catalog";
import NoResults from "@/components/ui/no-results";
import { Formatter } from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import { defaultHomeSettings, readHomeSettings } from "@/lib/home-settings";
import { cn } from "@/lib/utils";
import { Category, Color, HomeSettings, Product, Size } from "@/types";
import {
  ArrowRight,
  CreditCard,
  Heart,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Tag,
  Truck,
  X,
} from "lucide-react";
import Image from "next/image";
import { MouseEventHandler, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import useCart from "@/hooks/use-cart";
import usePreviewModal from "@/hooks/use-preview-modal";

interface SaleExperienceProps {
  categories: Category[];
  colors: Color[];
  products: Product[];
  sizes: Size[];
}

const discountOptions = [10, 20, 30, 40, 50];
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "discount-desc", label: "Biggest Discount" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

const discountForIndex = (index: number) => [50, 40, 30, 25, 20, 30, 20, 35, 45][index % 9];

const serviceItems = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over 59",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    description: "30 days return policy",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Guaranteed original products",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "100% secure payment",
  },
];

const SaleProductCard = ({
  discount,
  product,
}: {
  discount: number;
  product: Product;
}) => {
  const router = useRouter();
  const productHref = useMemo(() => `/product/${product.id}`, [product.id]);
  const cart = useCart();
  const previewModal = usePreviewModal();
  const price = Number(product.price);
  const salePrice = Math.max(price - (price * discount) / 100, 0);
  const imageUrl = product.images?.[0]?.url || "/images/image-1.jpg";

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    cart.addItem({ ...product, price: String(salePrice) });
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    previewModal.onOpen({ ...product, price: String(salePrice) });
  };

  const handlePrefetch = () => {
    router.prefetch(productHref);
  };

  return (
    <div
      className="sale-product-card group cursor-pointer overflow-hidden rounded-[18px] border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(17,17,17,0.08)] sm:rounded-[10px]"
      onClick={() => router.push(productHref)}
      onFocus={handlePrefetch}
      onMouseEnter={handlePrefetch}
    >
      <div className="relative aspect-square bg-[#f4f4f4] sm:aspect-[1.12]">
        <div className="absolute left-2 top-2 z-10 rounded-full bg-[#8a5a44] px-2.5 py-1 text-[10px] font-black text-white sm:left-4 sm:top-4 sm:rounded sm:px-3 sm:text-xs">
          -{discount}%
        </div>
        <button
          aria-label={`Preview ${product.name}`}
          className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-2 text-[#111111] transition hover:bg-white sm:right-4 sm:top-4"
          onClick={onPreview}
          type="button"
        >
          <Heart className="h-4 w-4" />
        </button>
        <Image
          alt={product.name}
          className="object-contain p-4 drop-shadow-[0_18px_22px_rgba(17,17,17,0.16)] transition duration-300 group-hover:scale-105 sm:p-7"
          fill
          sizes="(max-width: 768px) 90vw, 280px"
          src={imageUrl}
        />
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="line-clamp-2 min-h-[2.4em] text-[13px] font-black leading-tight text-[#111111] sm:min-h-0 sm:text-base">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-[11px] text-gray-500 sm:text-sm">{product.category?.name}</p>
        <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] text-gray-400 line-through sm:text-sm">
                {Formatter.format(price)}
              </span>
          <span className="text-[13px] font-black text-[#8a5a44] sm:text-base">
                {Formatter.format(salePrice)}
              </span>
            </div>
            <p className="mt-2 text-[11px] text-gray-500 sm:text-xs">
              <span className="text-[#8a5a44]">★</span> 4.{discount % 9} ({80 + discount})
            </p>
          </div>
          <IconButton
            icon={<ShoppingCart className="h-4 w-4 text-white" />}
            onClick={onAddToCart}
          />
        </div>
      </div>
    </div>
  );
};

const SaleExperience: React.FC<SaleExperienceProps> = ({
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
  const [selectedDiscount, setSelectedDiscount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("featured");
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

  const section = settings.flashSaleSection;
  const hero = settings.saleHero;

  const saleProducts = useMemo(() => {
    const productMap = new Map(products.map((product) => [product.id, product]));
    const selected = section.productIds
      .map((id) => productMap.get(id))
      .filter((product): product is Product => Boolean(product));
    const seen = new Set(selected.map((product) => product.id));
    const merged = [...selected];

    for (const product of products) {
      if (!seen.has(product.id)) {
        seen.add(product.id);
        merged.push(product);
      }
    }

    return merged.map((product, index) => ({
      discount: discountForIndex(index),
      product,
    }));
  }, [products, section.productIds]);

  const priceValues = saleProducts.map(({ product }) => Number(product.price));
  const maxPrice = Math.max(...priceValues, 0);
  const [priceLimit, setPriceLimit] = useState(maxPrice);

  useEffect(() => {
    setPriceLimit(maxPrice);
  }, [maxPrice]);

  const filteredSaleProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchingProducts = saleProducts.filter(({ discount, product }) => {
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

      if (selectedDiscount && discount < selectedDiscount) {
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
      const firstPrice = Number(first.product.price);
      const secondPrice = Number(second.product.price);
      const firstSalePrice = firstPrice - (firstPrice * first.discount) / 100;
      const secondSalePrice = secondPrice - (secondPrice * second.discount) / 100;

      if (sort === "discount-desc") {
        return second.discount - first.discount;
      }

      if (sort === "price-asc") {
        return firstSalePrice - secondSalePrice;
      }

      if (sort === "price-desc") {
        return secondSalePrice - firstSalePrice;
      }

      if (sort === "name-asc") {
        return first.product.name.localeCompare(second.product.name);
      }

      return Number(second.product.isFeatured) - Number(first.product.isFeatured);
    });
  }, [
    priceLimit,
    saleProducts,
    searchTerm,
    selectedBrand,
    selectedCategoryId,
    selectedColorId,
    selectedDiscount,
    selectedSizeId,
    sort,
  ]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const { product } of saleProducts) {
      counts.set(product.category.id, (counts.get(product.category.id) ?? 0) + 1);
    }

    return counts;
  }, [saleProducts]);

  const categoryTiles = [
    { id: "", label: "All Sale", product: saleProducts[0]?.product },
    ...normalizedCategories.map((category) => ({
      id: category.id,
      label: category.name,
      product: saleProducts.find(({ product }) => product.category.id === category.id)?.product,
    })),
  ];

  const resetFilters = () => {
    setSelectedCategoryId("");
    setSelectedColorId("");
    setSelectedSizeId("");
    setSelectedBrand("");
    setSelectedDiscount(0);
    setSearchTerm("");
    setSort("featured");
    setPriceLimit(maxPrice);
  };

  const heroProduct = saleProducts[0]?.product;
  const heroImageUrl =
    hero.imageUrl || heroProduct?.images?.[0]?.url || "/images/nike-reactx.png";
  const sideLabelParts = (hero.sideLabel || "Limited time offer").split(" ");

  return (
    <div className="sale-page bg-white px-2 pb-16 pt-3 sm:px-6 sm:pb-20 lg:px-8 lg:pt-4">
      <section className="sale-hero relative overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_58%_48%,_rgba(244,222,209,0.42),_transparent_24%),linear-gradient(115deg,_#090909_0%,_#151515_42%,_#d8b5a3_42%,_#f4ded1_100%)] px-4 py-6 text-white sm:rounded-[10px] sm:px-10 sm:py-8 lg:px-14">
        <div className="absolute inset-y-0 right-[11%] hidden text-[160px] font-black uppercase leading-none tracking-[-0.12em] text-white/5 lg:block">
          SALE
        </div>
        <div className="relative z-10 grid min-h-[240px] gap-6 sm:min-h-[300px] lg:grid-cols-[0.9fr_1fr_150px] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-[#f4ded1]">
              {hero.eyebrow || "Biggest sale of the season"}
            </p>
            <h1 className="mt-4 text-[clamp(2.7rem,15vw,4rem)] font-black uppercase leading-[0.92] tracking-[-0.05em] sm:mt-5 sm:text-7xl">
              {hero.title || "Up to"}
              <span className="block text-[#f4ded1]">
                {hero.highlightText || "50% off"}
              </span>
              <span className="block text-xl tracking-normal text-white sm:text-2xl">
                {hero.subtitle || "On selected items"}
              </span>
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/82 sm:mt-5 sm:text-base">
              {hero.description ||
                section.description ||
                "Top brands. Best styles. Limited time only!"}
            </p>
            <a
              className="mt-6 inline-flex w-full items-center justify-center gap-4 rounded-2xl bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.08em] text-[#111111] sm:mt-7 sm:w-auto sm:rounded-md sm:px-7 sm:py-4"
              href="#sale-products"
            >
              {hero.ctaLabel || "Shop sale"}
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#8a5a44] text-white">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>

          <div className="relative h-[210px] sm:h-[330px]">
            {heroImageUrl ? (
              <Image
                alt={`${hero.title || "Sale"} hero`}
                className="object-contain drop-shadow-[0_42px_32px_rgba(0,0,0,0.45)]"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 520px"
                src={heroImageUrl}
              />
            ) : null}
          </div>

          <div className="hidden justify-self-end lg:block">
            <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border-2 border-white/35 bg-black/45 text-center">
              <p className="text-xs font-black uppercase leading-tight">
                {sideLabelParts.slice(0, -1).join(" ") || "Limited time"}
              </p>
              <p className="text-2xl font-black uppercase text-[#f4ded1]">
                {sideLabelParts.at(-1) || "Offer"}
              </p>
              <Tag className="mt-2 h-6 w-6" />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:grid-cols-4 sm:gap-4 xl:grid-cols-7">
        {categoryTiles.slice(0, 7).map((tile) => (
          <button
            className={cn(
              "rounded-[18px] border bg-[#f7f7f7] px-3 py-3 text-center transition sm:rounded-[10px] sm:px-4 sm:py-4",
              selectedCategoryId === tile.id
                ? "border-[#d8b5a3] bg-[#fff5ef] text-[#8a5a44]"
                : "border-transparent text-[#111111] hover:border-black/10"
            )}
            key={`${tile.label}-${tile.id}`}
            onClick={() => setSelectedCategoryId(tile.id)}
            type="button"
          >
            <div className="relative mx-auto h-12 w-20">
              {tile.product ? (
                <Image
                  alt={tile.label}
                  className="object-contain"
                  fill
                  sizes="80px"
                  src={tile.product.images?.[0]?.url || "/images/image-1.jpg"}
                />
              ) : (
                <Tag className="mx-auto mt-2 h-8 w-8 text-[#8a5a44]" />
              )}
            </div>
            <p className="mt-2 text-sm font-black">{tile.label}</p>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]" id="sale-products">
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
            "space-y-5 rounded-[22px] border border-black/10 bg-white p-4 lg:sticky lg:top-6 lg:block lg:self-start lg:rounded-[10px]",
            mobileFiltersOpen
              ? "fixed inset-y-0 left-0 z-[70] block w-[min(86vw,340px)] overflow-y-auto rounded-none border-y-0 border-l-0 shadow-[0_24px_70px_rgba(17,17,17,0.26)]"
              : "hidden lg:block"
          )}
        >
          <div className="flex items-center justify-between border-b border-black/10 pb-4 lg:hidden">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#111111]">
                Sale Filters
              </p>
              <p className="mt-1 text-sm text-gray-500">Find the best offer fast</p>
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
          <div className="flex items-center justify-between border-b border-black/10 pb-4">
            <p className="text-xl font-black text-[#111111]">Filter By</p>
            <span className="text-lg">−</span>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#111111]">
              Category
            </p>
            <div className="mt-4 space-y-2">
              {normalizedCategories.map((category) => (
                <label className="flex items-center justify-between text-sm text-gray-600" key={category.id}>
                  <span className="flex items-center gap-2">
                    <input
                      checked={selectedCategoryId === category.id}
                      onChange={() =>
                        setSelectedCategoryId((current) =>
                          current === category.id ? "" : category.id
                        )
                      }
                      type="checkbox"
                    />
                    {category.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({categoryCounts.get(category.id) ?? 0})
                  </span>
                </label>
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
                    "h-8 rounded border text-sm",
                    selectedSizeId === size.id
                      ? "border-[#8a5a44] bg-[#8a5a44] text-white"
                      : "border-black/10 text-gray-600"
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
              className="mt-5 w-full accent-[#8a5a44]"
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
              Discount
            </p>
            <div className="mt-4 space-y-2">
              {discountOptions.map((discount) => (
                <label className="flex items-center gap-2 text-sm text-gray-600" key={discount}>
                  <input
                    checked={selectedDiscount === discount}
                    onChange={() =>
                      setSelectedDiscount((current) => (current === discount ? 0 : discount))
                    }
                    type="checkbox"
                  />
                  {discount}% and above
                </label>
              ))}
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
                    "h-6 w-6 rounded-full border",
                    selectedColorId === color.id
                      ? "scale-110 border-[#111111] ring-2 ring-[#f4ded1]"
                      : "border-black/10"
                  )}
                  key={color.id}
                  onClick={() =>
                    setSelectedColorId((current) => (current === color.id ? "" : color.id))
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
                <label className="flex items-center gap-2 text-sm text-gray-600" key={brand}>
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
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-[#111111]">
                Showing 1-{filteredSaleProducts.length} of {saleProducts.length} results
              </p>
              {!section.enabled ? (
                <p className="mt-1 text-sm font-semibold text-[#8a5a44]">
                  Sale page is hidden from admin settings.
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  className="h-12 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none sm:w-[260px]"
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search sale products"
                  type="search"
                  value={searchTerm}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-sm text-[#111111]">Sort by:</span>
                <select
                  className="h-12 min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 text-sm outline-none sm:flex-none sm:px-4"
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

          {!section.enabled ? (
            <div className="rounded-[10px] border border-dashed border-black/10 bg-white p-10 text-center">
              <p className="text-lg font-black text-[#111111]">Sale page is hidden.</p>
              <p className="mt-2 text-sm text-gray-500">
                Admin Website settings theke Sale Page on korlei products show korbe.
              </p>
            </div>
          ) : filteredSaleProducts.length === 0 ? (
            <NoResults />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4">
              {filteredSaleProducts.map(({ discount, product }) => (
                <SaleProductCard
                  discount={discount}
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-8 grid gap-3 rounded-[22px] bg-[#f1f1f1] px-4 py-4 sm:mt-10 sm:grid-cols-2 sm:gap-4 sm:rounded-[10px] sm:px-6 sm:py-5 xl:grid-cols-4">
        {serviceItems.map((item) => {
          const Icon = item.icon;

          return (
            <div className="flex items-center gap-4" key={item.title}>
              <Icon className="h-7 w-7 text-[#111111]" />
              <div>
                <p className="font-black text-[#111111]">{item.title}</p>
                <p className="text-sm text-gray-500">{item.description}</p>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};

export default SaleExperience;
