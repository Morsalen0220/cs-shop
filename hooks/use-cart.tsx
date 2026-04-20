import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

import { Product } from "@/types";

interface CartStore {
  items: Product[];
  appliedPromoCode: string;
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  setAppliedPromoCode: (code: string) => void;
  clearAppliedPromoCode: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],
      appliedPromoCode: "",
      addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return toast.error("Item already in cart.");
        }

        set({ items: [...get().items, data] });
        toast.success("Item added to cart.");
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("Item removed from cart.");
      },
      removeAll: () => set({ items: [], appliedPromoCode: "" }),
      setAppliedPromoCode: (code: string) => set({ appliedPromoCode: code }),
      clearAppliedPromoCode: () => set({ appliedPromoCode: "" }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;
