"use client";

import { normalizeCategories } from "@/lib/catalog";
import MainNav from "@/components/main-nav";
import NavbarActions from "@/components/navbar-actions";
import { defaultHomeSettings, readHomeSettings } from "@/lib/home-settings";
import { Category, HomeSettings } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

interface NavbarContentProps {
  categories: Category[];
}

const NavbarContent: React.FC<NavbarContentProps> = ({ categories }) => {
  const [settings, setSettings] = useState<HomeSettings>(defaultHomeSettings);
  const pathname = usePathname();
  const router = useRouter();
  const isShopPage = pathname.startsWith("/shop");
  const normalizedCategories = normalizeCategories(categories);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncSettings = () => setSettings(readHomeSettings());

    syncSettings();
    window.addEventListener("storage", syncSettings);
    window.addEventListener("home-settings-updated", syncSettings);

    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener("home-settings-updated", syncSettings);
    };
  }, []);

  const mobilePrimaryLinks = settings.header.menuItems.filter(
    (item) => item.type === "link"
  );

  const prefetchRoute = (href: string) => {
    const route = href.split("#")[0];

    if (route && route.startsWith("/")) {
      router.prefetch(route);
    }
  };

  useEffect(() => {
    const routes = [
      "/",
      ...settings.header.menuItems
        .filter((item) => item.type === "link")
        .map((item) => item.href.split("#")[0]),
      ...normalizedCategories.map((category) => `/category/${category.id}`),
    ];

    Array.from(new Set(routes))
      .filter((route) => route.startsWith("/") && route !== pathname)
      .forEach((route) => router.prefetch(route));
  }, [normalizedCategories, pathname, router, settings.header.menuItems]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div
      data-navbar-content
      className={`relative px-2 sm:px-6 lg:px-8 ${
        isShopPage ? "py-1" : "py-1.5"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          isShopPage ? "min-h-[44px] md:min-h-[56px]" : "min-h-[48px] md:min-h-[60px]"
        }`}
      >
        <Link
          aria-label="Nike home page"
          href="/"
          prefetch
          className="group flex min-w-0 shrink items-center gap-2 sm:gap-3"
          onMouseEnter={() => prefetchRoute("/")}
        >
          <div
            className={`navbar-brand-chip flex items-center justify-center rounded-full border border-black/10 bg-white shadow-sm transition group-hover:scale-105 ${
              isShopPage
                ? "h-[28px] w-[28px] md:h-[42px] md:w-[42px]"
                : "h-[30px] w-[30px] md:h-[46px] md:w-[46px]"
            }`}
          >
            <svg
              aria-hidden="true"
              className={`transition-transform group-hover:scale-110 ${
                isShopPage
                  ? "h-[14px] w-[14px] md:h-[23px] md:w-[23px]"
                  : "h-[15px] w-[15px] md:h-[25px] md:w-[25px]"
              }`}
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
          <div className="navbar-brand-copy min-w-0 max-w-[82px] sm:block sm:max-w-[180px] md:max-w-none">
            <p className="navbar-brand-label truncate text-[8px] font-semibold uppercase tracking-[0.14em] text-gray-500 md:text-[10px] md:tracking-[0.24em]">
              {settings.header.brandLabel}
            </p>
            <p
              className={`navbar-brand-tagline truncate font-semibold leading-tight text-[#111111] ${
                isShopPage ? "text-[10px] sm:text-[15px]" : "text-[11px] sm:text-base"
              }`}
            >
              {settings.header.tagline}
            </p>
          </div>
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="navbar-action-btn inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] transition hover:border-black/20 hover:bg-black hover:text-white lg:hidden"
            onClick={() => setMobileMenuOpen((current) => !current)}
            type="button"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <NavbarActions />
        </div>
      </div>

      <div className={`${isShopPage ? "mt-2" : "mt-2.5"} hidden lg:flex`}>
        <MainNav
          className={`navbar-menu-shell w-full justify-center ${isShopPage ? "px-2 py-1.5" : "px-2 py-1.5"}`}
          data={categories}
          menuItems={settings.header.menuItems}
        />
      </div>

      {mobileMenuOpen ? (
        <div className={`${isShopPage ? "mt-2" : "mt-2.5"} lg:hidden`}>
          <div className="navbar-mobile-panel overflow-hidden rounded-[22px] border border-black/8 bg-white shadow-[0_16px_40px_rgba(17,17,17,0.08)]">
            <div className="border-b border-black/8 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                Menu
              </p>
            </div>
            <div className="space-y-4 p-3.5">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {mobilePrimaryLinks.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    prefetch
                    className="min-h-[44px] rounded-[16px] border border-black/10 bg-[#faf7f3] px-3 py-3 text-center text-[13px] font-semibold text-[#111111] transition hover:bg-[#111111] hover:text-white"
                    onMouseEnter={() => prefetchRoute(item.href)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500">
                  Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {normalizedCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.id}`}
                      prefetch
                      className="min-h-[40px] rounded-full bg-[#f6f1eb] px-4 py-2 text-[13px] font-semibold text-[#111111] transition hover:bg-[#111111] hover:text-white"
                      onMouseEnter={() => prefetchRoute(`/category/${category.id}`)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavbarContent;
