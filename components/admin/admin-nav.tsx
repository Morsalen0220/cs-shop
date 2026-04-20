"use client";

import { cn } from "@/lib/utils";
import {
  Boxes,
  ChevronRight,
  Home,
  LayoutDashboard,
  MonitorSmartphone,
  Package,
  Palette,
  Settings,
  Shirt,
  Store,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const workspaceRoutes = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/website", label: "Website Studio", icon: MonitorSmartphone },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/billboards", label: "Billboards", icon: Home },
];

const commerceRoutes = [
  { href: "/admin/colors", label: "Colors", icon: Palette },
  { href: "/admin/sizes", label: "Sizes", icon: Shirt },
  { href: "/admin/orders", label: "Orders", icon: Boxes },
  { href: "/admin/settings", label: "Store Settings", icon: Settings },
];

const NavSection = ({
  pathname,
  routes,
  title,
}: {
  pathname: string;
  routes: Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
  title: string;
}) => (
  <div className="space-y-3">
    <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">
      {title}
    </p>
    <div className="space-y-1.5">
      {routes.map((route) => {
        const active =
          route.href === "/admin"
            ? pathname === route.href
            : pathname.startsWith(route.href);
        const Icon = route.icon;

        return (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition",
              active
                ? "bg-white text-[#111111] shadow-[0_20px_40px_rgba(255,255,255,0.08)]"
                : "text-white/65 hover:bg-white/8 hover:text-white"
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              {route.label}
            </span>
            <ChevronRight className="h-4 w-4 opacity-50" />
          </Link>
        );
      })}
    </div>
  </div>
);

const AdminNav = () => {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[292px] shrink-0 border-r border-white/10 bg-[linear-gradient(180deg,_#111111_0%,_#171717_48%,_#0b0b0b_100%)] p-5 text-white xl:block">
      <div className="flex h-full flex-col">
        <Link
          href="/admin"
          className="rounded-[28px] border border-white/10 bg-white/5 p-4"
        >
          <div className="flex items-center gap-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#111111]">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                Nike Shop
              </p>
              <p className="mt-1 text-lg font-semibold text-white">Admin Studio</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-white/60">
            Manage storefront content, inventory, and merchandising from one premium workspace.
          </p>
        </Link>

        <div className="mt-8 space-y-7">
          <NavSection pathname={pathname} routes={workspaceRoutes} title="Workspace" />
          <NavSection pathname={pathname} routes={commerceRoutes} title="Commerce" />
        </div>

        <div className="mt-auto rounded-[28px] border border-white/10 bg-white/5 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-white/40">
            Live Preview
          </p>
          <p className="mt-2 text-sm leading-6 text-white/65">
            Open the storefront and instantly review homepage changes from Website Studio.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#111111]"
          >
            <MonitorSmartphone className="h-4 w-4" />
            Open Storefront
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default AdminNav;
