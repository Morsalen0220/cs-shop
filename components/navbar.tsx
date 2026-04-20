import getCategories from "@/actions/get-categories";
import NavbarContent from "@/components/navbar-content";
import Container from "@/components/ui/container";

const Navbar = async () => {
  const categories = await getCategories();

  return (
    <div className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur-xl">
      <Container>
        <NavbarContent categories={categories} />
      </Container>
    </div>
  );
};

export default Navbar;
