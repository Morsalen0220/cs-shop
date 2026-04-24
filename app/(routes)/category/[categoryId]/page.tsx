import getCategory from "@/actions/get-category";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import { Billboard } from "@/components/billboard";
import Container from "@/components/ui/container";
import { BRAND_FILTER_ITEMS, inferBrandFromProduct } from "@/lib/catalog";
import Filter from "./components/filter";
import NoResults from "@/components/ui/no-results";
import ProductCard from "@/components/ui/product-card";
import MobileFilters from "./components/mobile-filters";

export const revalidate = 0;

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams: {
    brand?: string;
    colorId: string;
    sizeId: string;
  };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({
  params,
  searchParams,
}) => {
  const products = await getProducts({
    categoryId: params.categoryId,
    colorId: searchParams.colorId,
    sizeId: searchParams.sizeId,
  });
  const sizes = await getSizes();
  const colors = await getColors();
  const category = await getCategory(params.categoryId);
  const filteredProducts = searchParams.brand
    ? products.filter(
        (product) => inferBrandFromProduct(product) === searchParams.brand
      )
    : products;

  if (!category) {
    return (
      <div className="bg-white">
        <Container>
          <div className="px-4 sm:px-6 lg:px-8 py-24">
            <NoResults />
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Container>
        <Billboard data={category.billboard} />
        <div className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            <MobileFilters
              colors={colors}
              selectedBrand={searchParams.brand}
              selectedColorId={searchParams.colorId}
              selectedSizeId={searchParams.sizeId}
              sizes={sizes}
            />
            <div className="hidden lg:block">
              <Filter
                data={BRAND_FILTER_ITEMS}
                name="Brand"
                selectedValue={searchParams.brand}
                valueKey="brand"
              />
              <Filter valueKey="sizeId" name="Sizes" data={sizes} />
              <Filter valueKey="colorId" name="Colors" data={colors} />
            </div>
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              {filteredProducts.length === 0 && <NoResults />}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {filteredProducts.map((item) => (
                  <ProductCard key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CategoryPage;
