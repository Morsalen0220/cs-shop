"use client";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import { HeroSliderSettings, Product } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeroSliderProps {
  products: Product[];
  settings: HeroSliderSettings;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ products, settings }) => {
  const slides = products.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (slides.length <= 1 || !settings.autoplay) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [settings.autoplay, slides.length]);

  if (!settings.enabled || slides.length === 0) {
    return null;
  }

  const activeSlide = slides[activeIndex];
  const activeImage = activeSlide.images?.[0]?.url || "/images/image-1.jpg";

  const moveSlide = (direction: "next" | "prev") => {
    setActiveIndex((current) => {
      if (direction === "next") {
        return (current + 1) % slides.length;
      }

      return (current - 1 + slides.length) % slides.length;
    });
  };

  return (
    <div className="relative w-full min-w-0 overflow-hidden rounded-[34px] border border-white/60 bg-white/75 p-4 shadow-[0_24px_80px_rgba(17,17,17,0.12)] sm:p-6">
      <div className="relative overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,_#121212_0%,_#1d1d1d_42%,_#fff6ee_42%,_#fff2e7_100%)] p-6 sm:p-7">
        <div className="absolute inset-y-0 left-1/2 hidden w-px bg-white/10 xl:block" />
        <div className="grid gap-6 xl:grid-cols-[1fr_0.88fr] xl:items-end">
          <div className="max-w-none xl:max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.34em] text-white/55">
              {settings.eyebrow}
            </p>
            <p className="mt-4 max-w-[11ch] text-4xl font-semibold leading-[0.93] text-white sm:text-5xl">
              {settings.title}
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
              <span className="rounded-full border border-white/12 bg-white/5 px-3 py-2">
                Limited edit
              </span>
              <span className="rounded-full border border-white/12 bg-white/5 px-3 py-2">
                Premium picks
              </span>
            </div>
          </div>

          <div className="rounded-[28px] border border-black/10 bg-white/72 p-5 backdrop-blur-sm sm:p-6 xl:justify-self-end xl:w-full xl:max-w-[340px]">
            <p className="text-[11px] uppercase tracking-[0.34em] text-gray-500">
              {settings.spotlightLabel}
            </p>
            <p className="mt-4 max-w-sm text-3xl font-semibold leading-[1.02] text-[#111111] sm:text-[2.15rem]">
              {activeSlide.category.name} {settings.spotlightText}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="min-w-[136px] rounded-[20px] bg-white px-4 py-4 shadow-[0_12px_35px_rgba(17,17,17,0.06)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                  Tone
                </p>
                <p className="mt-2 text-lg font-semibold text-[#111111]">
                  {activeSlide.color.name}
                </p>
              </div>
              <div className="min-w-[136px] rounded-[20px] bg-white px-4 py-4 shadow-[0_12px_35px_rgba(17,17,17,0.06)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                  Category
                </p>
                <p className="mt-2 text-lg font-semibold text-[#111111]">
                  {activeSlide.category.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,_#ffffff_0%,_#f7e7dd_46%,_#edf3ff_100%)]">
        <div className="grid gap-6 px-5 pb-20 pt-16 sm:px-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-center xl:px-8 xl:pb-24">
          <div className="space-y-5">
            <div className="inline-flex w-fit rounded-full border border-black/10 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
              {activeSlide.category.name}
            </div>
            <div>
              <h3 className="max-w-lg text-3xl font-semibold leading-[1] text-[#111111] sm:text-5xl">
                {activeSlide.name}
              </h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
                {activeSlide.description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-2xl font-semibold text-[#111111]">
                <Currency value={activeSlide.price} />
              </div>
              <div className="rounded-full bg-[#111111] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                {activeSlide.color.name}
              </div>
            </div>
            <Button
              className="flex items-center gap-2 bg-[#111111] px-6"
              onClick={() => router.push(`/product/${activeSlide.id}`)}
            >
              {settings.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-x-6 bottom-6 top-6 rounded-[30px] bg-[radial-gradient(circle_at_center,_rgba(255,90,31,0.22),_transparent_62%)] blur-3xl" />
            <div className="relative mx-auto flex min-h-[280px] max-w-[440px] items-center justify-center rounded-[30px] border border-white/40 bg-white/35 px-6 py-8 backdrop-blur-sm sm:min-h-[340px]">
              <Image
                alt={activeSlide.name}
                className="h-auto w-full max-w-md object-contain transition-transform duration-500 hover:scale-[1.03]"
                height={760}
                priority
                src={activeImage}
                width={920}
              />
            </div>
          </div>
        </div>

        <div className="absolute left-5 top-5 rounded-full border border-black/10 bg-white/90 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
          Just dropped
        </div>

        <div className="absolute bottom-5 left-5 flex items-center gap-3">
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/85 text-[#111111] transition hover:bg-white"
            onClick={() => moveSlide("prev")}
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/85 text-[#111111] transition hover:bg-white"
            onClick={() => moveSlide("next")}
            type="button"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="absolute bottom-6 right-5 flex items-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to ${slide.name}`}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-10 bg-[#111111]" : "w-2.5 bg-black/20"
              }`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
