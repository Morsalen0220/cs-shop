import getCategories from "@/actions/get-categories";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import SaleExperience from "@/components/sale-experience";
import Container from "@/components/ui/container";

export const revalidate = 0;

const SalePage = async () => {
  const [products, categories, colors, sizes] = await Promise.all([
    getProducts({ includeArchived: true }),
    getCategories(),
    getColors(),
    getSizes(),
  ]);

  return (
    <Container>
      <SaleExperience
        categories={categories}
        colors={colors}
        products={products}
        sizes={sizes}
      />
    </Container>
  );
};

export default SalePage;
