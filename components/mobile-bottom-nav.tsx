"use client";

import useCart from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { Home, ShoppingBag, Sparkles, Tag, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/new-arrivals", label: "New", icon: Sparkles },
  { href: "/sale", label: "Sale", icon: Tag },
];

const MobileBottomNav = () => {
  const pathname = usePathname();
  const cart = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="mobile-bottom-nav fixed inset-x-2 bottom-2 z-50 rounded-[24px] border border-black/10 bg-white/92 p-1.5 shadow-[0_18px_48px_rgba(17,17,17,0.18)] backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              aria-label={item.label}
              className={cn(
                "flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-[18px] text-[10px] font-semibold transition",
                active
                  ? "bg-[#111111] text-white"
                  : "text-gray-500 active:bg-[#f6f1eb]"
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <Link
          aria-label="Cart"
          className={cn(
            "relative flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-[18px] text-[10px] font-semibold transition",
            pathname.startsWith("/cart")
              ? "bg-[#111111] text-white"
              : "text-gray-500 active:bg-[#f6f1eb]"
          )}
          href="/cart"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Cart</span>
          {isMounted && cart.items.length > 0 ? (
            <span className="absolute right-2 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff6a1a] px-1 text-[10px] font-bold text-white">
              {cart.items.length}
            </span>
          ) : null}
        </Link>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
