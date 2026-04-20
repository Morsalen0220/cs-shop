import getCategories from "@/actions/get-categories";
import MainNav from "@/components/main-nav";
import NavbarActions from "@/components/navbar-actions";
import NavbarPromoPill from "@/components/navbar-promo-pill";
import Container from "@/components/ui/container";
import Link from "next/link";

const Navbar = async () => {
  const categories = await getCategories();
  const mobilePrimaryLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/#new-arrivals", label: "New Arrivals" },
    { href: "/#flash-sale", label: "Sale" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur-xl">
      <Container>
        <div className="relative flex min-h-[84px] flex-col justify-center px-3 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              aria-label="Nike home page"
              href="/"
              className="group flex items-center gap-3"
            >
              <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-black/10 bg-white shadow-sm transition group-hover:scale-105 md:h-[56px] md:w-[56px]">
                <svg
                  aria-hidden="true"
                  className="h-[24px] w-[24px] transition-transform group-hover:scale-110 md:h-[30px] md:w-[30px]"
                  fill="none"
                  focusable="false"
                  height="24px"
                  role="img"
                  viewBox="0 0 24 24"
                  width="24px"
                >
                  <path
                    clipRule="evenodd"
                    d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <div className="hidden sm:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
                  Nike Shop
                </p>
                <p className="text-lg font-semibold text-[#111111]">
                  Move with intention
                </p>
              </div>
            </Link>

            <MainNav data={categories} />

            <div className="ml-auto flex items-center gap-3">
              <NavbarPromoPill />
              <NavbarActions />
            </div>
          </div>

          <div className="mt-3 space-y-2 lg:hidden">
            <div className="flex items-center gap-2 overflow-auto whitespace-nowrap">
              {mobilePrimaryLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#111111]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 overflow-auto whitespace-nowrap">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.id}`}
                  className="rounded-full bg-[#f6f1eb] px-4 py-2 text-sm font-medium text-gray-700"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Navbar;
