import getProducts from "@/actions/get-products";
import HomeExperience from "@/components/home/home-experience";
import Container from "@/components/ui/container";
import localFont from "next/font/local";

const FuturaCondensedExtraBold = localFont({
  src: "../fonts/Futura-Condensed-Extra-Bold.woff2",
  display: "swap",
});

export const revalidate = 0;

const HomePage = async () => {
  const products = await getProducts({ includeArchived: true });

  return (
    <Container>
      <div className="px-2 py-3 sm:px-6 lg:px-8 lg:py-8">
        <HomeExperience
          heroFontClassName={FuturaCondensedExtraBold.className}
          products={products}
        />
      </div>
    </Container>
  );
};

export default HomePage;
