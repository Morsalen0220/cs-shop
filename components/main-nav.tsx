"use client";

import { cn } from "@/lib/utils";
import { Category, HeaderMenuItem } from "@/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface MainNavProps {
  data: Category[];
  className?: string;
  menuItems: HeaderMenuItem[];
}

const MainNav: React.FC<MainNavProps> = ({ data, className, menuItems }) => {
  const pathName = usePathname();
  const router = useRouter();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const categoryRoutes = useMemo(
    () =>
      data.map((route) => ({
        href: `/category/${route.id}`,
        label: route.name,
        description: route.billboard?.label || "Explore the latest edit",
        active: pathName === `/category/${route.id}`,
      })),
    [data, pathName]
  );

  const resolveActiveState = (href: string) => {
    if (href === "/") {
      return pathName === "/";
    }

    if (href.startsWith("/#")) {
      return pathName === "/";
    }

    const basePath = href.split("#")[0];

    return pathName === basePath;
  };

  const prefetchRoute = (href: string) => {
    const route = href.split("#")[0];

    if (route && route.startsWith("/")) {
      router.prefetch(route);
    }
  };

  useEffect(() => {
    const routes = [
      ...menuItems
        .filter((item) => item.type === "link")
        .map((item) => item.href.split("#")[0]),
      ...categoryRoutes.map((route) => route.href),
    ];

    Array.from(new Set(routes))
      .filter((route) => route.startsWith("/") && route !== pathName)
      .forEach((route) => router.prefetch(route));
  }, [categoryRoutes, menuItems, pathName, router]);

  return (
    <nav
      className={cn(
        "hidden items-center gap-1 rounded-full border border-black/10 bg-white/90 px-2 py-2 shadow-[0_10px_30px_rgba(17,17,17,0.06)] lg:flex",
        className
      )}
    >
      {menuItems.map((item) => {
        if (item.type === "categories") {
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button
                type="button"
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  categoryRoutes.some((route) => route.active)
                    ? "bg-[#111111] text-white shadow-[0_10px_20px_rgba(17,17,17,0.16)]"
                    : "text-neutral-500 hover:bg-black/5 hover:text-black"
                )}
                onClick={() => setIsCategoryOpen((current) => !current)}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isCategoryOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              {isCategoryOpen ? (
                <div className="absolute left-0 top-[calc(100%+12px)] w-[320px] rounded-[28px] border border-black/10 bg-white p-3 shadow-[0_26px_70px_rgba(17,17,17,0.14)]">
                  <div className="mb-2 px-3 pt-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                      Shop by category
                    </p>
                  </div>
                  <div className="space-y-1">
                    {categoryRoutes.map((route) => (
                      <Link
                        key={route.label}
                        href={route.href}
                        prefetch
                        className={cn(
                          "block rounded-[20px] px-4 py-3 transition-colors",
                          route.active
                            ? "bg-[#111111] text-white"
                            : "text-[#111111] hover:bg-[#f7f4ef]"
                        )}
                        onClick={() => setIsCategoryOpen(false)}
                        onMouseEnter={() => prefetchRoute(route.href)}
                      >
                        <p className="text-sm font-semibold">{route.label}</p>
                        <p
                          className={cn(
                            "mt-1 text-xs",
                            route.active ? "text-white/65" : "text-gray-500"
                          )}
                        >
                          {route.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        }

        const isActive = resolveActiveState(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
            prefetch
            className={cn(
              "inline-block rounded-full px-4 py-2 text-center text-sm font-medium transition-colors",
              isActive
                ? "bg-[#111111] text-white shadow-[0_10px_20px_rgba(17,17,17,0.16)]"
                : "text-neutral-500 hover:bg-black/5 hover:text-black"
            )}
            onMouseEnter={() => prefetchRoute(item.href)}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
