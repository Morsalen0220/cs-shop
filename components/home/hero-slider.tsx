"use client";

import Currency from "@/components/ui/currency";
import { HeroSliderSettings, Product } from "@/types";
import Image from "next/image";
import { useMemo } from "react";

interface HeroSliderProps {
  products: Product[];
  settings: HeroSliderSettings;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ products, settings }) => {
  const activeSlide = useMemo(() => products[0], [products]);

  if (!settings.enabled || !activeSlide) {
    return null;
  }

  const activeImage = activeSlide.images?.[0]?.url || "/images/image-1.jpg";

  return (
    <div className="relative min-w-0 overflow-hidden rounded-[40px] border border-black/10 bg-[radial-gradient(circle_at_top_right,_rgba(33,198,255,0.14),_transparent_22%),radial-gradient(circle_at_bottom_left,_rgba(0,163,173,0.10),_transparent_18%),linear-gradient(145deg,_#ffffff_0%,_#f8fcff_58%,_#eef7fa_100%)] p-5 shadow-[0_30px_80px_rgba(15,23,42,0.10)] sm:p-7">
      <div className="pointer-events-none absolute inset-x-10 bottom-4 h-20 rounded-[999px] bg-cyan-950/10 blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-8 h-52 w-52 rounded-full border border-dashed border-cyan-950/12 sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute left-6 top-20 h-24 w-24 rounded-full border border-dashed border-cyan-950/10 sm:h-36 sm:w-36" />
      <div className="pointer-events-none absolute right-4 top-1/4 h-28 w-28 rounded-full bg-cyan-400/12 blur-3xl sm:h-44 sm:w-44" />
      <div className="pointer-events-none absolute left-1/3 top-6 h-px w-24 bg-gradient-to-r from-transparent via-cyan-950/20 to-transparent" />

      <div className="relative flex min-h-[420px] items-center justify-center sm:min-h-[520px]">
        <div className="absolute right-[9%] top-[15%] h-24 w-24 rounded-full bg-[linear-gradient(135deg,_#71e3ff_0%,_#157f97_100%)] shadow-[0_18px_50px_rgba(28,180,212,0.26)] sm:h-36 sm:w-36" />
        <div className="absolute right-[25%] top-[31%] h-20 w-20 rounded-full bg-[linear-gradient(135deg,_#d9d2ff_0%,_#7db6ff_100%)] opacity-85 shadow-[0_18px_40px_rgba(125,182,255,0.2)] sm:h-32 sm:w-32" />
        <div className="absolute bottom-[17%] right-[12%] h-24 w-24 rounded-full bg-[linear-gradient(135deg,_#243a8f_0%,_#101827_100%)] shadow-[0_18px_50px_rgba(37,65,166,0.28)] sm:h-36 sm:w-36" />
        <div className="absolute bottom-[24%] right-[30%] h-16 w-16 rounded-full bg-[linear-gradient(135deg,_#84e0ff_0%,_#d8f6ff_100%)] shadow-[0_14px_35px_rgba(132,224,255,0.18)] sm:h-24 sm:w-24" />

        <div className="relative z-10 mx-auto flex w-full max-w-[560px] items-center justify-center">
          <div className="absolute inset-x-16 bottom-8 h-14 rounded-[999px] bg-cyan-500/10 blur-2xl" />
          <Image
            alt={activeSlide.name}
            className="relative z-10 h-auto w-full max-w-[430px] rotate-[-9deg] object-contain drop-shadow-[0_24px_45px_rgba(15,23,42,0.26)] transition-transform duration-500 hover:translate-y-[-6px] hover:scale-[1.03] sm:max-w-[520px]"
            height={760}
            priority
            src={activeImage}
            width={920}
          />
        </div>
      </div>

      <div className="relative mt-2 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-gray-500">
            {settings.spotlightLabel}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[#111111]">
            <p className="text-xl font-semibold tracking-tight sm:text-2xl">{activeSlide.name}</p>
            <div className="rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">
              {activeSlide.category.name}
            </div>
            <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 shadow-[0_10px_24px_rgba(34,211,238,0.10)]">
              <Currency value={activeSlide.price} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
