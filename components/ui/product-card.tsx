"use client";

import { inferBrandFromProduct, normalizeCategoryLabel } from "@/lib/catalog";
import Image from "next/image";
import { MouseEventHandler, useMemo } from "react";
import { Expand, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";

interface ProductCard {
  data: Product;
  badge?: string;
}

const ProductCard: React.FC<ProductCard> = ({ data, badge }) => {
  const previewModal = usePreviewModal();
  const cart = useCart();
  const router = useRouter();
  const imageUrl = data.images?.[0]?.url || "/images/image-1.jpg";
  const productHref = useMemo(() => `/product/${data?.id}`, [data?.id]);
  const categoryLabel = normalizeCategoryLabel(data.category);
  const brandLabel = inferBrandFromProduct(data);

  const handleClick = () => {
    router.push(productHref);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    previewModal.onOpen(data);
  };

  const onAddToCart: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    cart.addItem(data);
  };

  const handlePrefetch = () => {
    router.prefetch(productHref);
  };

  return (
    <div
      onClick={handleClick}
      onFocus={handlePrefetch}
      onMouseEnter={handlePrefetch}
      className="group cursor-pointer space-y-3 rounded-[18px] border bg-white p-2.5 transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(17,17,17,0.08)] sm:space-y-4 sm:rounded-xl sm:p-3"
    >
      {/* Image & actions */}
      <div className="relative aspect-square overflow-hidden rounded-[16px] bg-gray-100 sm:rounded-xl">
        {badge ? (
          <div className="absolute left-2 top-2 z-10 rounded-full bg-[#111111] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white sm:left-3 sm:top-3 sm:px-3 sm:text-[11px]">
            {badge}
          </div>
        ) : null}
        <Image
          src={imageUrl}
          alt={data.name}
          fill
          className="rounded-md object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute bottom-3 w-full px-3 opacity-100 transition sm:bottom-5 sm:px-6 sm:opacity-0 sm:group-hover:opacity-100">
          <div className="flex justify-center gap-x-3 sm:gap-x-6">
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} className="text-gray-600" />}
            />
            <IconButton
              onClick={onAddToCart}
              icon={<ShoppingCart size={20} className="text-gray-600" />}
            />
          </div>
        </div>
      </div>
      {/* Description */}
      <div>
        <p className="line-clamp-2 min-h-[2.4em] text-[13px] font-semibold leading-tight sm:min-h-0 sm:text-lg">
          {data.name}
        </p>
        <p className="mt-1 line-clamp-1 text-[11px] text-gray-500 sm:text-sm">
          {brandLabel} / {categoryLabel}
        </p>
      </div>
      {/* Price & Reiew */}
      <div className="flex items-center justify-between">
        <Currency value={data?.price} />
      </div>
    </div>
  );
};

export default ProductCard;
