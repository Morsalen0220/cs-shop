"use client";

import Filter from "@/app/(routes)/category/[categoryId]/components/filter";
import { BRAND_FILTER_ITEMS, normalizeCategories } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { Category, Color, Size } from "@/types";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface ShopSidebarDrawerProps {
  categories: Category[];
  colors: Color[];
  onBrandChange?: (value: string | null) => void;
  onCategoryChange: (value: string | null) => void;
  onColorChange: (value: string | null) => void;
  onSizeChange: (value: string | null) => void;
  selectedBrand?: string | null;
  selectedCategoryId?: string | null;
  selectedColorId?: string | null;
  selectedSizeId?: string | null;
  sizes: Size[];
}

const ShopSidebarDrawer: React.FC<ShopSidebarDrawerProps> = ({
  categories,
  colors,
  onBrandChange,
  onCategoryChange,
  onColorChange,
  onSizeChange,
  selectedBrand,
  selectedCategoryId,
  selectedColorId,
  selectedSizeId,
  sizes,
}) => {
  const [open, setOpen] = useState(false);
  const normalizedCategories = normalizeCategories(categories);

  return (
    <>
      <button
        aria-controls="shop-sidebar-drawer"
        aria-expanded={open}
        aria-label={open ? "Close filters panel" : "Open filters panel"}
        className={cn(
          "fixed top-1/2 z-[60] hidden -translate-y-1/2 items-center gap-2 rounded-r-full border border-l-0 border-black/10 bg-white px-3 py-3 text-[#111111] shadow-[0_18px_45px_rgba(17,17,17,0.14)] transition hover:scale-[1.02] lg:flex",
          open ? "left-[340px]" : "left-0"
        )}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
        <span className="text-sm font-semibold">{open ? "Close" : "Filters"}</span>
      </button>

      <div
        className={cn(
          "pointer-events-none fixed inset-0 z-40 hidden bg-black/20 opacity-0 transition lg:block",
          open && "pointer-events-auto opacity-100"
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 hidden h-screen w-[340px] border-r border-black/10 bg-[#fcfaf7] px-5 py-6 shadow-[0_24px_70px_rgba(17,17,17,0.12)] transition-transform duration-300 ease-out lg:block",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        id="shop-sidebar-drawer"
      >
        <div className="flex h-full flex-col">
          <div className="mb-5 flex items-center justify-between gap-3 border-b border-black/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#fff2e8] p-3 text-[#ff5a1f]">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111111]">
                  Browse categories
                </p>
                <p className="text-xs text-gray-500">
                  Switch collections quickly
                </p>
              </div>
            </div>

            <button
              aria-label="Close filters panel"
              className="rounded-full border border-black/10 bg-white p-2 text-[#111111] transition hover:bg-[#111111] hover:text-white"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto pr-2">
            <div className="rounded-[30px] border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
              <div className="space-y-2">
                <button
                  className={cn(
                    "block w-full rounded-[22px] px-4 py-4 text-left transition",
                    !selectedCategoryId
                      ? "bg-[#111111] text-white shadow-[0_14px_35px_rgba(17,17,17,0.16)]"
                      : "bg-[#faf7f3] text-[#111111] hover:bg-[#f4ede6]"
                  )}
                  onClick={() => {
                    onCategoryChange(null);
                    setOpen(false);
                  }}
                  type="button"
                >
                  <p className="text-sm font-semibold">All products</p>
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      !selectedCategoryId ? "text-white/65" : "text-gray-500"
                    )}
                  >
                    Full storefront collection
                  </p>
                </button>

                {normalizedCategories.map((item) => {
                  const isActive = item.id === selectedCategoryId;

                  return (
                    <button
                      key={item.id}
                      className={cn(
                        "block w-full rounded-[22px] px-4 py-4 text-left transition",
                        isActive
                          ? "bg-[#111111] text-white shadow-[0_14px_35px_rgba(17,17,17,0.16)]"
                          : "bg-[#faf7f3] text-[#111111] hover:bg-[#f4ede6]"
                      )}
                      onClick={() => {
                        onCategoryChange(isActive ? null : item.id);
                        setOpen(false);
                      }}
                      type="button"
                    >
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p
                        className={cn(
                          "mt-1 text-xs",
                          isActive ? "text-white/65" : "text-gray-500"
                        )}
                      >
                        {item.billboard.label}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[30px] border border-black/10 bg-white p-5 shadow-[0_18px_60px_rgba(17,17,17,0.05)]">
              <Filter
                data={BRAND_FILTER_ITEMS}
                name="Brand"
                onValueChange={onBrandChange}
                selectedValue={selectedBrand}
                valueKey="brand"
              />
              <Filter
                data={sizes}
                name="Sizes"
                onValueChange={onSizeChange}
                selectedValue={selectedSizeId}
                valueKey="sizeId"
              />
              <Filter
                data={colors}
                name="Colors"
                onValueChange={onColorChange}
                selectedValue={selectedColorId}
                valueKey="colorId"
              />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default ShopSidebarDrawer;
