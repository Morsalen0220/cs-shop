"use client";

import Button from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import useCart from "@/hooks/use-cart";
import { Search, ShoppingBag, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();
  const router = useRouter();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (trimmedQuery) {
      router.push(`/shop?q=${encodeURIComponent(trimmedQuery)}`);
      setSearchOpen(false);
      return;
    }

    setSearchOpen((current) => !current);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="relative flex items-center gap-x-1 md:gap-x-2.5">
      <ThemeToggle />
      <button
        aria-label="My account"
        className="navbar-action-btn hidden h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] transition hover:border-black/20 hover:bg-black hover:text-white md:inline-flex md:h-10 md:w-10"
        onClick={() => router.push("/my-account")}
        type="button"
      >
        <User size={16} />
      </button>
      <button
        aria-label="Search products"
        className="navbar-action-btn inline-flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] transition hover:border-black/20 hover:bg-black hover:text-white md:h-10 md:w-10"
        onClick={() => setSearchOpen((current) => !current)}
        type="button"
      >
        <Search size={16} />
      </button>
      {searchOpen ? (
        <form
          className="absolute right-3 top-[calc(100%+10px)] z-50 flex w-[min(320px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_18px_45px_rgba(17,17,17,0.14)] md:right-8"
          onSubmit={handleSearch}
        >
          <input
            autoFocus
            className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-[#111111] outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            type="search"
            value={query}
          />
          <button
            className="inline-flex h-12 w-12 items-center justify-center bg-[#111111] text-white"
            type="submit"
          >
            <Search size={16} />
          </button>
        </form>
      ) : null}
      <Button
        onClick={() => router.push("/cart")}
        className="navbar-cart-btn hidden h-8 items-center rounded-full bg-[#111111] px-2.5 py-2 shadow-[0_14px_35px_rgba(17,17,17,0.16)] sm:flex sm:h-9 sm:px-3 md:h-auto md:px-4"
      >
        <ShoppingBag size={16} color="white" />
        <span className="ml-1 text-[11px] font-medium text-white md:ml-2 md:text-[13px]">
          {cart.items.length}
        </span>
      </Button>
    </div>
  );
};

export default NavbarActions;
