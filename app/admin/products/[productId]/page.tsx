import getCategories from "@/actions/get-categories";
import getColors from "@/actions/get-colors";
import getProduct from "@/actions/get-product";
import getSizes from "@/actions/get-sizes";
import PageHeading from "@/components/admin/page-heading";
import ProductForm from "@/components/admin/product-form";
import { notFound } from "next/navigation";

export const revalidate = 0;

interface ProductEditPageProps {
  params: {
    productId: string;
  };
}

const ProductEditPage: React.FC<ProductEditPageProps> = async ({ params }) => {
  const [product, categories, sizes, colors] = await Promise.all([
    getProduct(params.productId),
    getCategories(),
    getSizes(),
    getColors(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeading
        backHref="/admin/products"
        title="Edit product"
        description="Update product details and choose if it appears as Normal, New Arrival, or Sale."
      />
      <ProductForm
        categories={categories}
        colors={colors}
        product={product}
        sizes={sizes}
      />
    </div>
  );
};

export default ProductEditPage;
