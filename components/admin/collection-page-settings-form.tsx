"use client";

import Button from "@/components/ui/button";
import {
  defaultHomeSettings,
  readHomeSettings,
  saveHomeSettings,
} from "@/lib/home-settings";
import {
  CollectionHeroSettings,
  HomeSettings,
  Product,
  ProductSectionSettings,
} from "@/types";
import { ExternalLink, ImagePlus, Save, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

type CollectionPageVariant = "new-arrivals" | "sale";

interface CollectionPageSettingsFormProps {
  products: Product[];
  variant: CollectionPageVariant;
}

const variantConfig = {
  "new-arrivals": {
    heroKey: "newArrivalsHero" as const,
    previewHref: "/new-arrivals",
    sectionKey: "newArrivalsSection" as const,
    title: "New Arrivals Page",
  },
  sale: {
    heroKey: "saleHero" as const,
    previewHref: "/sale",
    sectionKey: "flashSaleSection" as const,
    title: "Sale Page",
  },
};

const cardClass =
  "rounded-3xl border border-black/10 bg-white p-6 shadow-sm space-y-5";

const CollectionPageSettingsForm: React.FC<CollectionPageSettingsFormProps> = ({
  products,
  variant,
}) => {
  const config = variantConfig[variant];
  const [isMounted, setIsMounted] = useState(false);
  const [settings, setSettings] = useState<HomeSettings>(defaultHomeSettings);
  const [uploading, setUploading] = useState(false);
  const hero = settings[config.heroKey] as CollectionHeroSettings;
  const section = settings[config.sectionKey] as ProductSectionSettings;

  useEffect(() => {
    setIsMounted(true);
    setSettings(readHomeSettings());
  }, []);

  const updateHero = <F extends keyof CollectionHeroSettings>(
    field: F,
    value: CollectionHeroSettings[F]
  ) => {
    setSettings((current) => ({
      ...current,
      [config.heroKey]: {
        ...current[config.heroKey],
        [field]: value,
      },
    }));
  };

  const updateSection = <F extends keyof ProductSectionSettings>(
    field: F,
    value: ProductSectionSettings[F]
  ) => {
    setSettings((current) => ({
      ...current,
      [config.sectionKey]: {
        ...current[config.sectionKey],
        [field]: value,
      },
    }));
  };

  const uploadHeroImage = async (
    field: "imageUrl" | "secondaryImageUrl",
    file: File
  ) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    setUploading(true);

    try {
      const response = await fetch("/api/demo-store/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      updateHero(field, data.url as string);
      toast.success("Hero image uploaded");
    } catch {
      toast.error("Hero image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const toggleProduct = (productId: string) => {
    const exists = section.productIds.includes(productId);

    updateSection(
      "productIds",
      exists
        ? section.productIds.filter((id) => id !== productId)
        : [...section.productIds, productId]
    );
  };

  const handleSave = () => {
    saveHomeSettings(settings);
    toast.success(`${config.title} settings saved`);
  };

  const handleReset = () => {
    setSettings((current) => ({
      ...current,
      [config.heroKey]: defaultHomeSettings[config.heroKey],
      [config.sectionKey]: defaultHomeSettings[config.sectionKey],
    }));
    toast.success(`${config.title} settings reset locally. Click save to publish.`);
  };

  if (!isMounted) {
    return (
      <div className="space-y-4 pb-28">
        <div className="h-40 animate-pulse rounded-[32px] border border-black/10 bg-white" />
        <div className="h-72 animate-pulse rounded-3xl border border-black/10 bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-28">
      <section className="overflow-hidden rounded-[32px] border border-black/10 bg-[radial-gradient(circle_at_top_left,_rgba(244,222,209,0.55),_transparent_35%),linear-gradient(135deg,_#ffffff_0%,_#fff7f1_55%,_#f6efe8_100%)] p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              <Sparkles className="h-4 w-4" />
              Dedicated page editor
            </div>
            <h2 className="mt-4 text-3xl font-semibold text-[#111111]">
              Control the {config.title} hero, products, and page visibility here.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              Changes are stored with the same website settings, but this page keeps
              the controls focused and easy to find from the admin sidebar.
            </p>
          </div>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
            href={config.previewHref}
          >
            <ExternalLink className="h-4 w-4" />
            Preview page
          </Link>
        </div>
      </section>

      <section className={cardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            Hero Banner
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-950">
            Text and image controls
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Eyebrow text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateHero("eyebrow", event.target.value)}
              value={hero.eyebrow}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Side / offer label</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateHero("sideLabel", event.target.value)}
              value={hero.sideLabel}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Main title</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateHero("title", event.target.value)}
              value={hero.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Highlight text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateHero("highlightText", event.target.value)}
              placeholder={variant === "sale" ? "50% off" : "Optional"}
              value={hero.highlightText}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateHero("subtitle", event.target.value)}
              value={hero.subtitle}
            />
          </div>
          <div>
            <label className="text-sm font-medium">CTA button</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateHero("ctaLabel", event.target.value)}
              value={hero.ctaLabel}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="mt-2 min-h-[110px] w-full rounded-2xl border px-3 py-3 text-sm"
            onChange={(event) => updateHero("description", event.target.value)}
            value={hero.description}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[24px] border border-black/10 bg-[#faf9f6] p-4">
            <label className="text-sm font-medium">Main hero image</label>
            <input
              accept="image/*"
              className="mt-3 block w-full text-sm"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  uploadHeroImage("imageUrl", file);
                }
              }}
              type="file"
            />
            <input
              className="mt-3 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateHero("imageUrl", event.target.value)}
              placeholder="/images/nike-reactx.png"
              value={hero.imageUrl}
            />
          </div>

          {variant === "new-arrivals" ? (
            <div className="rounded-[24px] border border-black/10 bg-[#faf9f6] p-4">
              <label className="text-sm font-medium">Second hero image</label>
              <input
                accept="image/*"
                className="mt-3 block w-full text-sm"
                disabled={uploading}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    uploadHeroImage("secondaryImageUrl", file);
                  }
                }}
                type="file"
              />
              <input
                className="mt-3 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateHero("secondaryImageUrl", event.target.value)
                }
                placeholder="/images/image-1.jpg"
                value={hero.secondaryImageUrl}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-[24px] border border-dashed border-black/10 bg-[#faf9f6] p-4 text-sm text-gray-500">
              <ImagePlus className="h-5 w-5" />
              Sale page uses one large hero image.
            </div>
          )}
        </div>
      </section>

      <section className={cardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            Page Products
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-950">
            Visibility, section text, and selected products
          </h2>
        </div>

        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            checked={section.enabled}
            onChange={(event) => updateSection("enabled", event.target.checked)}
            type="checkbox"
          />
          Show this page collection
        </label>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Collection title</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateSection("title", event.target.value)}
              value={section.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Badge text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateSection("badgeText", event.target.value)}
              value={section.badgeText}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Collection description</label>
          <textarea
            className="mt-2 min-h-[110px] w-full rounded-2xl border px-3 py-3 text-sm"
            onChange={(event) => updateSection("description", event.target.value)}
            value={section.description}
          />
        </div>

        <div>
          <p className="text-sm font-medium">Choose products</p>
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <label
                className="flex items-start gap-3 rounded-2xl border p-4 text-sm"
                key={`${config.sectionKey}-${product.id}`}
              >
                <input
                  checked={section.productIds.includes(product.id)}
                  onChange={() => toggleProduct(product.id)}
                  type="checkbox"
                />
                <span>
                  <span className="block font-semibold text-gray-950">
                    {product.name}
                  </span>
                  <span className="block text-gray-500">
                    {product.category.name}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap gap-3 rounded-[28px] border border-black/10 bg-white/90 p-3 shadow-[0_18px_40px_rgba(17,17,17,0.08)] backdrop-blur">
        <Button className="bg-[#111111]" onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save {config.title}
        </Button>
        <Button
          className="border border-black/10 bg-white text-[#111111]"
          onClick={handleReset}
        >
          Reset this page
        </Button>
      </div>
    </div>
  );
};

export default CollectionPageSettingsForm;
