"use client";

import MainNav from "@/components/main-nav";
import NavbarActions from "@/components/navbar-actions";
import NavbarPromoPill from "@/components/navbar-promo-pill";
import { defaultHomeSettings, readHomeSettings } from "@/lib/home-settings";
import { Category, HomeSettings } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavbarContentProps {
  categories: Category[];
}

const NavbarContent: React.FC<NavbarContentProps> = ({ categories }) => {
  const [settings, setSettings] = useState<HomeSettings>(defaultHomeSettings);
  const pathname = usePathname();
  const router = useRouter();
  const isShopPage = pathname.startsWith("/shop");

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
      ...categories.map((category) => `/category/${category.id}`),
    ];

    Array.from(new Set(routes))
      .filter((route) => route.startsWith("/") && route !== pathname)
      .forEach((route) => router.prefetch(route));
  }, [categories, pathname, router, settings.header.menuItems]);

  return (
    <div
      className={`relative px-3 sm:px-6 lg:px-8 ${
        isShopPage ? "py-2" : "py-3"
      }`}
    >
      <div
        className={`flex items-center gap-3 ${
          isShopPage ? "min-h-[60px]" : "min-h-[72px]"
        }`}
      >
        <Link
          aria-label="Nike home page"
          href="/"
          prefetch
          className="group flex shrink-0 items-center gap-3"
          onMouseEnter={() => prefetchRoute("/")}
        >
          <div
            className={`flex items-center justify-center rounded-full border border-black/10 bg-white shadow-sm transition group-hover:scale-105 ${
              isShopPage
                ? "h-[40px] w-[40px] md:h-[48px] md:w-[48px]"
                : "h-[44px] w-[44px] md:h-[56px] md:w-[56px]"
            }`}
          >
            <svg
              aria-hidden="true"
              className={`transition-transform group-hover:scale-110 ${
                isShopPage
                  ? "h-[22px] w-[22px] md:h-[26px] md:w-[26px]"
                  : "h-[24px] w-[24px] md:h-[30px] md:w-[30px]"
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
          <div className="sm:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
              {settings.header.brandLabel}
            </p>
            <p
              className={`font-semibold leading-tight text-[#111111] ${
                isShopPage ? "text-sm sm:text-base" : "text-base sm:text-lg"
              }`}
            >
              {settings.header.tagline}
            </p>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <NavbarPromoPill />
          <NavbarActions />
        </div>
      </div>

      <div className={`${isShopPage ? "mt-2" : "mt-3"} hidden lg:flex`}>
        <MainNav
          className={`w-full justify-center ${isShopPage ? "px-3 py-2" : "px-3 py-3"}`}
          data={categories}
          menuItems={settings.header.menuItems}
        />
      </div>

      <div className={`${isShopPage ? "mt-2" : "mt-3"} space-y-2 lg:hidden`}>
        <div className="flex items-center gap-2 overflow-auto whitespace-nowrap">
          {mobilePrimaryLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              prefetch
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#111111]"
              onMouseEnter={() => prefetchRoute(item.href)}
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
              prefetch
              className="rounded-full bg-[#f6f1eb] px-4 py-2 text-sm font-medium text-gray-700"
              onMouseEnter={() => prefetchRoute(`/category/${category.id}`)}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavbarContent;
