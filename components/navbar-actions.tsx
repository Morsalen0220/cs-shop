"use client";

import Button from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { Search, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cart = useCart();
  const router = useRouter();

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-x-3">
      <button
        aria-label="Search products"
        className="hidden h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#111111] transition hover:border-black/20 hover:bg-black hover:text-white md:inline-flex"
        onClick={() => router.push("/")}
        type="button"
      >
        <Search size={18} />
      </button>
      <Button
        onClick={() => router.push("/cart")}
        className="flex items-center rounded-full bg-[#111111] px-4 py-2 shadow-[0_14px_35px_rgba(17,17,17,0.16)]"
      >
        <ShoppingBag size={20} color="white" />
        <span className="ml-2 text-sm font-medium text-white">
          {cart.items.length}
        </span>
      </Button>
    </div>
  );
};

export default NavbarActions;
