"use client";

import {
  BRAND_OPTIONS,
  inferBrandFromProduct,
  normalizeCategories,
  normalizeCategoryLabel,
} from "@/lib/catalog";
import NoResults from "@/components/ui/no-results";
import { Formatter } from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import usePreviewModal from "@/hooks/use-preview-modal";
import { cn } from "@/lib/utils";
import { Category, Color, Product, Size } from "@/types";
import {
  ChevronRight,
  Grid,
  LayoutGrid,
  Heart,
  List,
  Search,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useEffect, useMemo, useState } from "react";

interface ShopProductBrowserProps {
  categories: Category[];
  colors: Color[];
  initialBrand?: string;
  initialCategoryId?: string;
  initialColorId?: string;
  initialSearch?: string;
  initialSizeId?: string;
  initialSort?: string;
  products: Product[];
  sizes: Size[];
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const discountCycle = [20, 0, 25, 0, 0, 30, 0, 15];

const ShopGridProductCard = ({
  discount,
  isNew,
  product,
}: {
  discount: number;
  isNew: boolean;
  product: Product;
}) => {
  const cart = useCart();
  const previewModal = usePreviewModal();
  const router = useRouter();
  const productHref = useMemo(() => `/product/${product.id}`, [product.id]);
  const price = Number(product.price);
  const salePrice = discount ? Math.max(price - (price * discount) / 100, 0) : price;
  const imageUrl = product.images?.[0]?.url || "/images/image-1.jpg";
  const brandLabel = inferBrandFromProduct(product);
  const categoryLabel = normalizeCategoryLabel(product.category);

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
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[18px] border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(17,17,17,0.08)] sm:rounded-[10px]"
      onClick={() => router.push(productHref)}
      onFocus={handlePrefetch}
      onMouseEnter={handlePrefetch}
    >
      <div className="relative aspect-square overflow-hidden rounded-[16px] bg-[#f7f7f7] sm:aspect-[1.05] sm:rounded-[12px]">
        {discount ? (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-[#ef1d1d] px-2.5 py-1 text-[10px] font-bold text-white sm:left-4 sm:top-4 sm:rounded sm:px-3 sm:text-xs">
            -{discount}%
          </span>
        ) : isNew ? (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-[#60ad4f] px-2.5 py-1 text-[10px] font-bold text-white sm:left-4 sm:top-4 sm:rounded sm:px-3 sm:text-xs">
            NEW
          </span>
        ) : null}
        <button
          aria-label={`Preview ${product.name}`}
          className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-2 text-[#111111] transition hover:bg-white sm:right-4 sm:top-4"
          onClick={onPreview}
          type="button"
        >
          <Heart className="h-5 w-5" />
        </button>
        <Image
          alt={product.name}
          className="rounded-[12px] object-cover transition duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 90vw, 280px"
          src={imageUrl}
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-bold leading-tight text-[#111111] sm:min-h-[3rem] sm:text-[1.1rem]">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-[11px] text-gray-500 sm:text-sm">
          {brandLabel} / {categoryLabel}
        </p>

        <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span
            className={cn(
              "max-w-full break-words text-[14px] font-bold leading-none sm:text-[1.1rem]",
              discount ? "text-[#ef1d1d]" : "text-[#111111]"
            )}
          >
            {Formatter.format(salePrice)}
          </span>
          {discount ? (
            <span className="max-w-full break-words text-[12px] text-gray-400 line-through sm:text-sm">
              {Formatter.format(price)}
            </span>
          ) : null}
        </div>

        <p className="mt-2 text-[11px] text-gray-600 sm:text-xs">
          <span className={discount ? "text-[#ef1d1d]" : "text-[#111111]"}>★</span>{" "}
          4.{(product.name.length + discount) % 9} ({60 + product.name.length})
        </p>

        <button
          className="mt-auto inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-[#050505] text-[12px] font-semibold text-white transition hover:bg-[#222222] sm:h-10 sm:rounded-md sm:text-sm"
          onClick={onAddToCart}
          type="button"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
};

const ShopProductBrowser: React.FC<ShopProductBrowserProps> = ({
  categories,
  colors,
  initialBrand = "",
  initialCategoryId,
  initialColorId,
  initialSearch = "",
  initialSizeId,
  initialSort = "featured",
  products,
  sizes,
}) => {
  const normalizedCategories = useMemo(() => normalizeCategories(categories), [categories]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId ?? "");
  const [selectedColorId, setSelectedColorId] = useState(initialColorId ?? "");
  const [selectedSizeId, setSelectedSizeId] = useState(initialSizeId ?? "");
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sort, setSort] = useState(initialSort);
  const [viewMode, setViewMode] = useState<"compact" | "grid" | "list">("grid");

  const maxPrice = Math.max(...products.map((product) => Number(product.price)), 0);
  const [priceLimit, setPriceLimit] = useState(maxPrice);

  useEffect(() => {
    setSelectedCategoryId(initialCategoryId ?? "");
  }, [initialCategoryId]);

  useEffect(() => {
    setSelectedColorId(initialColorId ?? "");
  }, [initialColorId]);

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setSelectedSizeId(initialSizeId ?? "");
  }, [initialSizeId]);

  useEffect(() => {
    setSelectedBrand(initialBrand);
  }, [initialBrand]);

  useEffect(() => {
    setSort(initialSort);
  }, [initialSort]);

  useEffect(() => {
    setPriceLimit(maxPrice);
  }, [maxPrice]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (searchTerm.trim()) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }

    if (selectedCategoryId) {
      params.set("categoryId", selectedCategoryId);
    } else {
      params.delete("categoryId");
    }

    if (selectedColorId) {
      params.set("colorId", selectedColorId);
    } else {
      params.delete("colorId");
    }

    if (selectedSizeId) {
      params.set("sizeId", selectedSizeId);
    } else {
      params.delete("sizeId");
    }

    if (selectedBrand) {
      params.set("brand", selectedBrand);
    } else {
      params.delete("brand");
    }

    if (sort && sort !== "featured") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    const queryString = params.toString();
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;

    window.history.replaceState({}, "", nextUrl);
  }, [searchTerm, selectedCategoryId, selectedColorId, selectedSizeId, selectedBrand, sort]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matchingProducts = products.filter((product) => {
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

      if (priceLimit > 0 && Number(product.price) > priceLimit) {
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

      if (sort === "name-desc") {
        return second.name.localeCompare(first.name);
      }

      return Number(second.isFeatured) - Number(first.isFeatured);
    });
  }, [
    priceLimit,
    products,
    searchTerm,
    selectedBrand,
    selectedCategoryId,
    selectedColorId,
    selectedSizeId,
    sort,
  ]);

  const resetFilters = () => {
    setSelectedCategoryId("");
    setSelectedColorId("");
    setSelectedSizeId("");
    setSelectedBrand("");
    setSearchTerm("");
    setSort("featured");
    setPriceLimit(maxPrice);
  };

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();

    for (const product of products) {
      counts.set(product.category.id, (counts.get(product.category.id) ?? 0) + 1);
    }

    return normalizedCategories.map((category) => ({
      ...category,
      count: counts.get(category.id) ?? 0,
    }));
  }, [normalizedCategories, products]);

  return (
    <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-6">
      <aside className="rounded-[22px] border border-black/10 bg-white p-4 lg:sticky lg:top-6 lg:self-start lg:rounded-[10px] lg:p-6">
        <div className="flex items-center justify-between border-b border-black/10 pb-5">
          <h2 className="text-xl font-bold text-[#111111] sm:text-2xl">Filter By</h2>
          <button
            className="text-sm font-medium text-gray-500 transition hover:text-[#111111]"
            onClick={resetFilters}
            type="button"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-6 pt-5">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
                Category
              </p>
              <span>−</span>
            </div>
            <div className="mt-4 space-y-3">
              {categoryCounts.map((category) => (
                <label
                  className="flex items-center justify-between text-sm text-gray-700"
                  key={category.id}
                >
                  <span className="flex items-center gap-3">
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
                  <span className="text-xs text-gray-500">({category.count})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-t border-black/10 pt-5">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
              Price Range
            </p>
            <input
              className="mt-5 w-full accent-[#050505]"
              max={maxPrice}
              min="0"
              onChange={(event) => setPriceLimit(Number(event.target.value))}
              type="range"
              value={priceLimit}
            />
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>0</span>
              <span>{priceLimit.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t border-black/10 pt-5">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
              Size (US)
            </p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {sizes.map((size) => (
                <button
                  className={cn(
                    "h-9 rounded-md border text-sm transition",
                    selectedSizeId === size.id
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-black/10 bg-white text-gray-700 hover:border-[#111111]"
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
            <button className="mt-3 text-sm text-gray-600" type="button">
              + More Sizes
            </button>
          </div>

          <div className="border-t border-black/10 pt-5">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
              Brand
            </p>
            <div className="mt-4 space-y-3">
              {BRAND_OPTIONS.map((brand) => (
                <label className="flex items-center gap-3 text-sm text-gray-700" key={brand}>
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
            <button className="mt-3 text-sm text-gray-600" type="button">
              + More Brands
            </button>
          </div>

          <div className="border-t border-black/10 pt-5">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-[#111111]">
              Color
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  aria-label={`Filter by ${color.name}`}
                  className={cn(
                    "h-7 w-7 rounded-full border transition",
                    selectedColorId === color.id
                      ? "scale-110 border-[#111111] ring-2 ring-black/15"
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

          <button
            className="h-12 w-full rounded-md bg-[#050505] text-sm font-bold uppercase tracking-[0.08em] text-white transition hover:bg-[#222222]"
            type="button"
          >
            Apply Filters
          </button>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-5 flex flex-col gap-4 lg:mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-[#111111]">
              Showing 1-{filteredProducts.length} of {products.length} results
            </p>
            <div className="relative mt-3 w-full max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="h-11 w-full rounded-xl border border-black/10 bg-white pl-11 pr-4 text-sm outline-none"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search products"
                type="search"
                value={searchTerm}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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
            <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
              {[
                { icon: Grid, value: "compact" as const },
                { icon: LayoutGrid, value: "grid" as const },
                { icon: List, value: "list" as const },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    className={cn(
                      "inline-flex h-10 w-full items-center justify-center rounded-md border border-black/10 transition sm:w-10",
                      viewMode === item.value
                        ? "bg-[#050505] text-white"
                        : "bg-white text-[#111111]"
                    )}
                    key={item.value}
                    onClick={() => setViewMode(item.value)}
                    type="button"
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? <NoResults /> : null}

        <div
          className={cn(
            "grid gap-5",
            viewMode === "compact"
              ? "grid-cols-2 sm:grid-cols-2 xl:grid-cols-5"
              : viewMode === "list"
              ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-2 sm:grid-cols-2 xl:grid-cols-4"
          )}
        >
          {filteredProducts.map((product, index) => (
            <ShopGridProductCard
              discount={discountCycle[index % discountCycle.length]}
              isNew={Boolean(product.isFeatured) || index % 5 === 1}
              key={product.id}
              product={product}
            />
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="mt-10 flex justify-center gap-3">
            {[1, 2, 3].map((page) => (
              <button
                className={cn(
                  "h-10 w-10 rounded-md border text-sm font-semibold",
                  page === 1
                    ? "border-[#050505] bg-[#050505] text-white"
                    : "border-black/10 bg-white text-[#111111]"
                )}
                key={page}
                type="button"
              >
                {page}
              </button>
            ))}
            <span className="flex h-10 items-center px-2 text-sm text-gray-500">...</span>
            <button
              className="h-10 w-10 rounded-md border border-black/10 bg-white text-sm font-semibold text-[#111111]"
              type="button"
            >
              21
            </button>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white text-[#111111]"
              type="button"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </section>
    </div>
  );
};

export default ShopProductBrowser;
