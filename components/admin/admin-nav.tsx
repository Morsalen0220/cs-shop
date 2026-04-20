"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Moon, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/billboards", label: "Billboards" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/sizes", label: "Sizes" },
  { href: "/admin/colors", label: "Colors" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/settings", label: "Settings" },
];

const AdminNav = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="flex h-14 items-center gap-4 px-6">
        <Link
          href="/admin"
          className="flex h-9 min-w-[170px] items-center justify-between rounded-md border px-3 text-sm"
        >
          <span className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Nike
          </span>
          <span className="text-gray-400">⌄</span>
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {routes.map((route) => {
            const active =
              route.href === "/admin"
                ? pathname === route.href
                : pathname.startsWith(route.href);

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm text-gray-600 transition hover:text-black",
                  active && "font-semibold text-black"
                )}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/"
          className="hidden items-center gap-2 rounded-md border px-3 py-2 text-sm md:flex"
        >
          <LayoutDashboard className="h-4 w-4" />
          Storefront
        </Link>
        <button
          aria-label="Toggle theme"
          className="flex h-9 w-9 items-center justify-center rounded-md border"
        >
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default AdminNav;
