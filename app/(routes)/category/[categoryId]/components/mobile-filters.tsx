"use client";

import Button from "@/components/ui/button";
import IconButton from "@/components/ui/icon-button";
import { BRAND_FILTER_ITEMS } from "@/lib/catalog";
import { Color, Size } from "@/types";
import { Dialog } from "@headlessui/react";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import Filter from "./filter";

interface MobileFiltersProps {
  onBrandChange?: (value: string | null) => void;
  selectedBrand?: string | null;
  colors: Color[];
  onColorChange?: (value: string | null) => void;
  onSizeChange?: (value: string | null) => void;
  selectedColorId?: string | null;
  selectedSizeId?: string | null;
  sizes: Size[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  sizes,
  colors,
  onBrandChange,
  selectedBrand,
  onColorChange,
  onSizeChange,
  selectedColorId,
  selectedSizeId,
}) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <>
      <Button
        onClick={onOpen}
        className="flex items-center gap-x-2 bg-white text-[#111111] border border-black/10 lg:hidden"
      >
        Filters
        <Plus size={20} />
      </Button>

      <Dialog
        open={open}
        as="div"
        className="relative z-40 lg:hidden"
        onClose={onClose}
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />

        <div className="fixed inset-0 z-40 flex">
          <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
            <div className="flex items-center justify-end px-4">
              <IconButton icon={<X size={15} onClick={onClose} />} />
            </div>

            <div className="p-4">
              <div className="mb-5">
                <p className="text-lg font-semibold text-[#111111]">Filters</p>
                <p className="text-sm text-gray-500">
                  Narrow down by size, color and brand
                </p>
              </div>
              <Filter
                data={sizes}
                name="Sizes"
                onValueChange={(value) => {
                  onSizeChange?.(value);
                  if (onSizeChange) {
                    onClose();
                  }
                }}
                selectedValue={selectedSizeId}
                valueKey="sizeId"
              />
              <Filter
                data={BRAND_FILTER_ITEMS}
                name="Brand"
                onValueChange={(value) => {
                  onBrandChange?.(value);
                  if (onBrandChange) {
                    onClose();
                  }
                }}
                selectedValue={selectedBrand}
                valueKey="brand"
              />
              <Filter
                data={colors}
                name="Colors"
                onValueChange={(value) => {
                  onColorChange?.(value);
                  if (onColorChange) {
                    onClose();
                  }
                }}
                selectedValue={selectedColorId}
                valueKey="colorId"
              />
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default MobileFilters;
