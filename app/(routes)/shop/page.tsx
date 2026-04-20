import getCategories from "@/actions/get-categories";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import Container from "@/components/ui/container";
import Filter from "../category/[categoryId]/components/filter";
import MobileFilters from "../category/[categoryId]/components/mobile-filters";
import Link from "next/link";
import { ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";

export const revalidate = 0;

interface ShopPageProps {
  searchParams: {
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    q?: string;
    sort?: string;
  };
}

const buildShopUrl = (
  searchParams: ShopPageProps["searchParams"],
  overrides: Partial<ShopPageProps["searchParams"]> = {}
) => {
  const params = new URLSearchParams();
  const nextQuery = {
    ...searchParams,
    ...overrides,
  };

  Object.entries(nextQuery).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const queryString = params.toString();

  return `/shop${queryString ? `?${queryString}` : ""}`;
};

const ShopPage: React.FC<ShopPageProps> = async ({ searchParams }) => {
  const [products, sizes, colors, categories] = await Promise.all([
    getProducts({
      categoryId: searchParams.categoryId,
      colorId: searchParams.colorId,
      sizeId: searchParams.sizeId,
    }),
    getSizes(),
    getColors(),
    getCategories(),
  ]);

  const selectedCategory =
    categories.find((item) => item.id === searchParams.categoryId) ?? null;
  const searchTerm = searchParams.q?.trim().toLowerCase() ?? "";
  const sort = searchParams.sort ?? "featured";

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) {
      return true;
    }

    return [product.name, product.description, product.category.name]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm);
  });

  const sortedProducts = [...filteredProducts].sort((first, second) => {
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

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
  ];

  return (
    <div className="bg-[linear-gradient(180deg,_#f8f5f1_0%,_#ffffff_28%)]">
      <Container>
        <div className="px-4 pb-24 pt-8 sm:px-6 lg:px-8">
          <section className="overflow-hidden rounded-[36px] border border-black/10 bg-[linear-gradient(135deg,_#111111_0%,_#1a1a1a_45%,_#f9efe7_45%,_#fff8f3_100%)] p-6 shadow-[0_22px_70px_rgba(17,17,17,0.08)] sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/55">
                  Shop page
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-[0.95] text-white sm:text-5xl lg:text-6xl">
                  {selectedCategory?.name ?? "All products"} picks built for everyday
                  movement.
                </h1>
                <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 sm:text-base">
                  Search quickly, sort the collection, and jump between categories
                  from one clean storefront page.
                </p>
              </div>

              <div className="rounded-[28px] border border-black/10 bg-white/85 p-5 backdrop-blur-sm sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gray-400">
                  Current view
                </p>
                <p className="mt-3 text-3xl font-semibold leading-tight text-[#111111]">
                  {selectedCategory?.name ?? "All products"}
                </p>
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {selectedCategory?.billboard.label ??
                    "Browse the full store collection with quick search and sorting."}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <div className="rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    {sortedProducts.length} products
                  </div>
                  <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Curated shop
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)] lg:items-start lg:overflow-hidden lg:[height:calc(100vh-11rem)]">
            <aside className="space-y-5 lg:sticky lg:top-0 lg:max-h-full lg:overflow-y-auto lg:pr-2">
              <div className="rounded-[30px] border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
                <div className="flex items-center gap-2">
                  <div className="rounded-2xl bg-[#fff2e8] p-3 text-[#ff5a1f]">
                    <SlidersHorizontal className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">
                      Browse categories
                    </p>
                    <p className="text-xs text-gray-500">
                      Switch collections quickly
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <Link
                    href={buildShopUrl(searchParams, { categoryId: undefined, q: undefined })}
                    className={`block rounded-[22px] px-4 py-4 transition ${
                      !selectedCategory
                        ? "bg-[#111111] text-white shadow-[0_14px_35px_rgba(17,17,17,0.16)]"
                        : "bg-[#faf7f3] text-[#111111] hover:bg-[#f4ede6]"
                    }`}
                  >
                    <p className="text-sm font-semibold">All products</p>
                    <p className={`mt-1 text-xs ${!selectedCategory ? "text-white/65" : "text-gray-500"}`}>
                      Full storefront collection
                    </p>
                  </Link>

                  {categories.map((item) => {
                    const isActive = item.id === selectedCategory?.id;

                    return (
                      <Link
                        key={item.id}
                        href={buildShopUrl(searchParams, {
                          categoryId: item.id,
                          q: undefined,
                        })}
                        className={`block rounded-[22px] px-4 py-4 transition ${
                          isActive
                            ? "bg-[#111111] text-white shadow-[0_14px_35px_rgba(17,17,17,0.16)]"
                            : "bg-[#faf7f3] text-[#111111] hover:bg-[#f4ede6]"
                        }`}
                      >
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p
                          className={`mt-1 text-xs ${
                            isActive ? "text-white/65" : "text-gray-500"
                          }`}
                        >
                          {item.billboard.label}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[30px] border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
                <Filter valueKey="sizeId" name="Sizes" data={sizes} />
                <Filter valueKey="colorId" name="Colors" data={colors} />
              </div>
            </aside>

            <section className="space-y-5 lg:h-full lg:overflow-y-auto lg:pr-2">
              <div className="rounded-[30px] border border-black/10 bg-white p-4 shadow-[0_18px_60px_rgba(17,17,17,0.05)] sm:p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <form className="flex-1" action="/shop" method="get">
                    <div className="flex flex-col gap-3 lg:flex-row">
                      <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          className="h-12 w-full rounded-full border border-black/10 bg-[#faf7f3] pl-11 pr-4 text-sm text-[#111111] outline-none transition focus:border-black/20"
                          defaultValue={searchParams.q ?? ""}
                          name="q"
                          placeholder="Search the shop"
                          type="search"
                        />
                      </div>
                      <input name="categoryId" type="hidden" value={searchParams.categoryId ?? ""} />
                      <input name="sizeId" type="hidden" value={searchParams.sizeId ?? ""} />
                      <input name="colorId" type="hidden" value={searchParams.colorId ?? ""} />
                      <input name="sort" type="hidden" value={sort} />
                      <button
                        className="h-12 rounded-full bg-[#111111] px-6 text-sm font-semibold text-white transition hover:opacity-90"
                        type="submit"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <MobileFilters sizes={sizes} colors={colors} />
                    <form action="/shop" method="get">
                      <input name="q" type="hidden" value={searchParams.q ?? ""} />
                      <input name="categoryId" type="hidden" value={searchParams.categoryId ?? ""} />
                      <input name="sizeId" type="hidden" value={searchParams.sizeId ?? ""} />
                      <input name="colorId" type="hidden" value={searchParams.colorId ?? ""} />
                      <div className="flex gap-2">
                        <div className="relative">
                          <ArrowUpDown className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <select
                            className="h-12 min-w-[220px] appearance-none rounded-full border border-black/10 bg-[#faf7f3] pl-11 pr-10 text-sm font-medium text-[#111111] outline-none"
                            defaultValue={sort}
                            name="sort"
                          >
                            {sortOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          className="h-12 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-[#111111] transition hover:bg-[#111111] hover:text-white"
                          type="submit"
                        >
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {searchParams.q ? (
                    <div className="rounded-full border border-black/10 bg-[#faf7f3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      Search: {searchParams.q}
                    </div>
                  ) : null}
                  {searchParams.sizeId ? (
                    <div className="rounded-full border border-black/10 bg-[#faf7f3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      Size filter active
                    </div>
                  ) : null}
                  {searchParams.colorId ? (
                    <div className="rounded-full border border-black/10 bg-[#faf7f3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                      Color filter active
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
                    Collection results
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                    {selectedCategory?.name ?? "All products"} shop
                  </h2>
                </div>
                <p className="text-sm text-gray-500">
                  {sortedProducts.length} item{sortedProducts.length === 1 ? "" : "s"}
                </p>
              </div>

              {sortedProducts.length === 0 ? <NoResults /> : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {sortedProducts.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ShopPage;
