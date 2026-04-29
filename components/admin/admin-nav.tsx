"use client";

import { cn } from "@/lib/utils";
import {
  Boxes,
  BadgePercent,
  ChevronRight,
  Home,
  LayoutDashboard,
  MonitorSmartphone,
  Package,
  Palette,
  PanelTop,
  Settings,
  Shirt,
  Sparkles,
  Store,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const workspaceRoutes = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/website", label: "Nikeshop", icon: MonitorSmartphone },
  { href: "/admin/header", label: "Header", icon: PanelTop },
  { href: "/admin/footer", label: "Footer", icon: PanelTop },
  { href: "/admin/new-arrivals", label: "New Arrivals Page", icon: Sparkles },
  { href: "/admin/sale", label: "Sale Page", icon: BadgePercent },
  { href: "/admin/blogs", label: "Blog Posts", icon: PanelTop },
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
  const router = useRouter();

  useEffect(() => {
    [...workspaceRoutes, ...commerceRoutes].forEach((route) => {
      router.prefetch(route.href);
    });
  }, [router]);

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[linear-gradient(180deg,_#111111_0%,_#171717_48%,_#0b0b0b_100%)] px-4 py-3 text-white xl:hidden">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#111111]">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
              Nikeshop
            </p>
            <p className="text-sm font-semibold text-white">Admin Panel</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {[...workspaceRoutes, ...commerceRoutes].map((route) => {
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
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-medium transition",
                  active
                    ? "border-white bg-white text-[#111111]"
                    : "border-white/15 bg-white/5 text-white/80"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {route.label}
              </Link>
            );
          })}
        </div>
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-[292px] shrink-0 border-r border-white/10 bg-[linear-gradient(180deg,_#111111_0%,_#171717_48%,_#0b0b0b_100%)] p-5 text-white xl:block">
        <div className="flex h-full flex-col">
          <Link
            href="/admin"
            prefetch
            className="rounded-[28px] border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#111111]">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/45">
                  Nikeshop
                </p>
                <p className="mt-1 text-lg font-semibold text-white">Nikeshop Admin</p>
              </div>
            </div>
          </Link>

          <div className="mt-8 flex-1 space-y-7 overflow-y-auto pr-1">
            <NavSection pathname={pathname} routes={workspaceRoutes} title="Workspace" />
            <NavSection pathname={pathname} routes={commerceRoutes} title="Commerce" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminNav;
