import getCategories from "@/actions/get-categories";
import getColors from "@/actions/get-colors";
import getProducts from "@/actions/get-products";
import getSizes from "@/actions/get-sizes";
import NewArrivalsExperience from "@/components/new-arrivals-experience";
import Container from "@/components/ui/container";

export const revalidate = 0;

const NewArrivalsPage = async () => {
  const [products, categories, colors, sizes] = await Promise.all([
    getProducts({ includeArchived: true }),
    getCategories(),
    getColors(),
    getSizes(),
  ]);

  return (
    <Container>
      <NewArrivalsExperience
        categories={categories}
        colors={colors}
        products={products}
        sizes={sizes}
      />
    </Container>
  );
};

export default NewArrivalsPage;
