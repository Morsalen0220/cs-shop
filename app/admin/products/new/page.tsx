import getCategories from "@/actions/get-categories";
import getColors from "@/actions/get-colors";
import getSizes from "@/actions/get-sizes";
import PageHeading from "@/components/admin/page-heading";
import ProductForm from "@/components/admin/product-form";

export const revalidate = 0;

const NewProductPage = async () => {
  const [categories, sizes, colors] = await Promise.all([
    getCategories(),
    getSizes(),
    getColors(),
  ]);

  return (
    <div className="space-y-8">
      <PageHeading
        title="Create a new product"
        description="Add a new product"
      />
      <ProductForm categories={categories} sizes={sizes} colors={colors} />
    </div>
  );
};

export default NewProductPage;
