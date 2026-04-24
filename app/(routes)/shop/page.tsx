import getCategories from "@/actions/get-categories";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import Container from "@/components/ui/container";
import ShopProductBrowser from "@/components/shop-product-browser";

export const revalidate = 0;

interface ShopPageProps {
  searchParams: {
    brand?: string;
    categoryId?: string;
    colorId?: string;
    sizeId?: string;
    q?: string;
    sort?: string;
  };
}

const ShopPage: React.FC<ShopPageProps> = async ({ searchParams }) => {
  const [products, sizes, colors, categories] = await Promise.all([
    getProducts({
      categoryId: searchParams.categoryId,
      colorId: searchParams.colorId,
      sizeId: searchParams.sizeId,
      q: searchParams.q,
    }),
    getSizes(),
    getColors(),
    getCategories(),
  ]);

  const selectedCategory =
    categories.find((item) => item.id === searchParams.categoryId) ?? null;

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 pb-24 pt-6 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 border-b border-black/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm text-gray-500">Home / Shop</p>
              <h1 className="mt-2 text-4xl font-bold text-[#111111]">
                {selectedCategory?.name ?? "Shop"}
              </h1>
              <p className="mt-2 text-base text-gray-500">
                Discover our wide range of sneakers for every style and performance.
              </p>
            </div>
            <p className="rounded-full bg-[#f6f1eb] px-4 py-2 text-sm font-semibold text-[#111111]">
              {products.length} products
            </p>
          </div>

          <div>
            <ShopProductBrowser
              categories={categories}
              colors={colors}
              initialBrand={searchParams.brand}
              initialCategoryId={searchParams.categoryId}
              initialColorId={searchParams.colorId}
              initialSearch={searchParams.q}
              initialSizeId={searchParams.sizeId}
              initialSort={searchParams.sort}
              products={products}
              sizes={sizes}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ShopPage;
