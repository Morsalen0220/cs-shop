"use client";

import Button from "@/components/ui/button";
import {
  defaultHomeSettings,
  readHomeSettings,
  saveHomeSettings,
} from "@/lib/home-settings";
import {
  BlogPageSettings,
  CollectionHeroSettings,
  FooterSettings,
  HomeSettings,
  Product,
  ProductSectionSettings,
  PromoCodeSettings,
} from "@/types";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

interface HomeSettingsFormProps {
  products: Product[];
}

const sectionCardClass =
  "rounded-[30px] border border-black/10 bg-white/90 p-6 shadow-[0_18px_50px_rgba(17,17,17,0.045)] space-y-5";

const productSections = [
  {
    key: "bestSellerSection" as const,
    eyebrow: "Best Seller Section",
    helper: "Most popular products and highlight items",
  },
  {
    key: "newArrivalsSection" as const,
    eyebrow: "New Arrivals Page",
    helper: "Latest products for homepage and /new-arrivals",
  },
  {
    key: "flashSaleSection" as const,
    eyebrow: "Sale Page",
    helper: "Limited-time deals for homepage and /sale",
  },
];

const HomeSettingsForm: React.FC<HomeSettingsFormProps> = ({ products }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [settings, setSettings] = useState<HomeSettings>(defaultHomeSettings);
  const [uploadingHeroKey, setUploadingHeroKey] = useState<
    "newArrivalsHero" | "saleHero" | null
  >(null);
  const [uploadingBlogTarget, setUploadingBlogTarget] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setSettings(readHomeSettings());
  }, []);

  const updateSection = <
    K extends keyof HomeSettings,
    F extends keyof HomeSettings[K]
  >(
    key: K,
    field: F,
    value: HomeSettings[K][F]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [field]: value,
      },
    }));
  };

  const updateWhyChooseItem = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      whyChooseUsSection: {
        ...current.whyChooseUsSection,
        items: current.whyChooseUsSection.items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const updateHeroSection = <
    K extends "newArrivalsHero" | "saleHero",
    F extends keyof CollectionHeroSettings
  >(
    key: K,
    field: F,
    value: CollectionHeroSettings[F]
  ) => {
    setSettings((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [field]: value,
      },
    }));
  };

  const updateBlogField = <F extends keyof BlogPageSettings>(
    field: F,
    value: BlogPageSettings[F]
  ) => {
    setSettings((current) => ({
      ...current,
      blog: {
        ...current.blog,
        [field]: value,
      },
    }));
  };

  const updateBlogCategory = (
    index: number,
    field: keyof BlogPageSettings["categories"][number],
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      blog: {
        ...current.blog,
        categories: current.blog.categories.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const updateBlogArticle = (
    key: "featuredPosts" | "explorePosts",
    index: number,
    field: keyof BlogPageSettings["featuredPosts"][number],
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      blog: {
        ...current.blog,
        [key]: current.blog[key].map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const updateTrendingPost = (
    index: number,
    field: keyof BlogPageSettings["trendingPosts"][number],
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      blog: {
        ...current.blog,
        trendingPosts: current.blog.trendingPosts.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const updateBlogNewsletter = (
    field: keyof BlogPageSettings["newsletter"],
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      blog: {
        ...current.blog,
        newsletter: {
          ...current.blog.newsletter,
          [field]: value,
        },
      },
    }));
  };

  const updateFooterField = <F extends keyof FooterSettings>(
    field: F,
    value: FooterSettings[F]
  ) => {
    setSettings((current) => ({
      ...current,
      footer: {
        ...current.footer,
        [field]: value,
      },
    }));
  };

  const updateFooterLink = (
    index: number,
    field: "label" | "href",
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      footer: {
        ...current.footer,
        links: current.footer.links.map((link, linkIndex) =>
          linkIndex === index ? { ...link, [field]: value } : link
        ),
      },
    }));
  };

  const addFooterLink = () => {
    setSettings((current) => ({
      ...current,
      footer: {
        ...current.footer,
        links: [
          ...current.footer.links,
          {
            id: `footer-link-${Date.now()}`,
            label: "New link",
            href: "/",
            type: "link",
          },
        ],
      },
    }));
  };

  const removeFooterLink = (index: number) => {
    setSettings((current) => ({
      ...current,
      footer: {
        ...current.footer,
        links: current.footer.links.filter((_, linkIndex) => linkIndex !== index),
      },
    }));
  };

  const updateBlogPromise = (
    index: number,
    field: keyof BlogPageSettings["promises"][number],
    value: string
  ) => {
    setSettings((current) => ({
      ...current,
      blog: {
        ...current.blog,
        promises: current.blog.promises.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [field]: value } : item
        ),
      },
    }));
  };

  const uploadHeroImage = async (
    key: "newArrivalsHero" | "saleHero",
    field: "imageUrl" | "secondaryImageUrl",
    file: File
  ) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    setUploadingHeroKey(key);

    try {
      const response = await fetch("/api/demo-store/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      updateHeroSection(key, field, data.url as string);
      toast.success("Hero image uploaded");
    } catch {
      toast.error("Hero image upload failed");
    } finally {
      setUploadingHeroKey(null);
    }
  };

  const uploadBlogImage = async (
    target: string,
    onComplete: (url: string) => void,
    file: File
  ) => {
    const uploadData = new FormData();
    uploadData.append("file", file);
    setUploadingBlogTarget(target);

    try {
      const response = await fetch("/api/demo-store/admin/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onComplete(data.url as string);
      toast.success("Blog image uploaded");
    } catch {
      toast.error("Blog image upload failed");
    } finally {
      setUploadingBlogTarget(null);
    }
  };

  const addPromoCode = () => {
    setSettings((current) => ({
      ...current,
      promoCodes: [
        ...current.promoCodes,
        {
          id: `promo-${Date.now()}`,
          code: "",
          label: "",
          value: 10,
          type: "percentage",
          enabled: true,
        },
      ],
    }));
  };

  const updatePromoCode = <
    K extends keyof PromoCodeSettings
  >(
    index: number,
    field: K,
    value: PromoCodeSettings[K]
  ) => {
    setSettings((current) => ({
      ...current,
      promoCodes: current.promoCodes.map((promo, promoIndex) =>
        promoIndex === index ? { ...promo, [field]: value } : promo
      ),
    }));
  };

  const removePromoCode = (index: number) => {
    setSettings((current) => ({
      ...current,
      promoCodes: current.promoCodes.filter((_, promoIndex) => promoIndex !== index),
    }));
  };

  const toggleProduct = (
    key: "bestSellerSection" | "newArrivalsSection" | "flashSaleSection",
    productId: string
  ) => {
    setSettings((current) => {
      const section = current[key] as ProductSectionSettings;
      const exists = section.productIds.includes(productId);

      return {
        ...current,
        [key]: {
          ...section,
          productIds: exists
            ? section.productIds.filter((id) => id !== productId)
            : [...section.productIds, productId],
        },
      };
    });
  };

  const handleSave = () => {
    saveHomeSettings(settings);
    toast.success("Website settings saved");
  };

  const handleReset = () => {
    setSettings(defaultHomeSettings);
    saveHomeSettings(defaultHomeSettings);
    toast.success("Website settings reset");
  };

  if (!isMounted) {
    return (
      <div className="space-y-4 pb-28">
        <div className="h-40 animate-pulse rounded-3xl border border-black/10 bg-white" />
        <div className="h-64 animate-pulse rounded-3xl border border-black/10 bg-white" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-28">
      <section className="grid gap-6 xl:grid-cols-2">
        <div className={sectionCardClass}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
              Navbar Promo
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">
              Top navigation highlight
            </h2>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              checked={settings.navbarPromo.enabled}
              onChange={(event) =>
                updateSection("navbarPromo", "enabled", event.target.checked)
              }
              type="checkbox"
            />
            Show navbar promo pill
          </label>
          <div>
            <label className="text-sm font-medium">Promo text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection("navbarPromo", "text", event.target.value)
              }
              value={settings.navbarPromo.text}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className={sectionCardClass}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
              Top Announcement Bar
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">
              Header promo strip
            </h2>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              checked={settings.announcementBar.enabled}
              onChange={(event) =>
                updateSection("announcementBar", "enabled", event.target.checked)
              }
              type="checkbox"
            />
            Show announcement bar
          </label>
          <div>
            <label className="text-sm font-medium">Free shipping info</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection("announcementBar", "primaryText", event.target.value)
              }
              value={settings.announcementBar.primaryText}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Offer text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection(
                  "announcementBar",
                  "secondaryText",
                  event.target.value
                )
              }
              value={settings.announcementBar.secondaryText}
            />
          </div>
        </section>

        <section className={sectionCardClass}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
              Promo / Offer Section
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">
              Hero offer content
            </h2>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              checked={settings.promoSection.enabled}
              onChange={(event) =>
                updateSection("promoSection", "enabled", event.target.checked)
              }
              type="checkbox"
            />
            Show promo section
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Discount banner</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateSection("promoSection", "discountText", event.target.value)
                }
                value={settings.promoSection.discountText}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Badge</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateSection("promoSection", "badgeText", event.target.value)
                }
                value={settings.promoSection.badgeText}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Offer title</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection("promoSection", "title", event.target.value)
              }
              value={settings.promoSection.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Offer text</label>
            <textarea
              className="mt-2 min-h-[110px] w-full rounded-2xl border px-3 py-3 text-sm"
              onChange={(event) =>
                updateSection("promoSection", "description", event.target.value)
              }
              value={settings.promoSection.description}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">CTA button</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateSection("promoSection", "ctaLabel", event.target.value)
                }
                value={settings.promoSection.ctaLabel}
              />
            </div>
            <div>
              <label className="flex items-center gap-3 pt-8 text-sm font-medium">
                <input
                  checked={settings.promoSection.countdownEnabled}
                  onChange={(event) =>
                    updateSection(
                      "promoSection",
                      "countdownEnabled",
                      event.target.checked
                    )
                  }
                  type="checkbox"
                />
                Countdown enabled
              </label>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Countdown target</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection(
                  "promoSection",
                  "countdownTarget",
                  event.target.value
                )
              }
              type="datetime-local"
              value={settings.promoSection.countdownTarget.slice(0, 16)}
            />
          </div>
        </section>
      </div>

      <section className={sectionCardClass}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
              Cart Promo Codes
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">
              Customer coupon settings
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">
              Add promo codes customers can enter on the cart page. Choose flat or percentage discounts and turn them on or off anytime.
            </p>
          </div>
          <Button className="bg-[#111111]" onClick={addPromoCode}>
            <Plus className="mr-2 h-4 w-4" />
            Add promo code
          </Button>
        </div>

        <div className="grid gap-4">
          {settings.promoCodes.map((promo, index) => (
            <div
              key={promo.id}
              className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="grid flex-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div>
                    <label className="text-sm font-medium">Promo code</label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updatePromoCode(index, "code", event.target.value.toUpperCase())
                      }
                      value={promo.code}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Customer label</label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updatePromoCode(index, "label", event.target.value)
                      }
                      value={promo.label}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Discount type</label>
                    <select
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updatePromoCode(
                          index,
                          "type",
                          event.target.value as PromoCodeSettings["type"]
                        )
                      }
                      value={promo.type}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {promo.type === "percentage" ? "Discount %" : "Discount amount"}
                    </label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      min="0"
                      onChange={(event) =>
                        updatePromoCode(
                          index,
                          "value",
                          Number(event.target.value || 0)
                        )
                      }
                      type="number"
                      value={promo.value}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm font-medium">
                    <input
                      checked={promo.enabled}
                      onChange={(event) =>
                        updatePromoCode(index, "enabled", event.target.checked)
                      }
                      type="checkbox"
                    />
                    Active
                  </label>
                  <Button
                    className="border border-black/10 bg-white text-[#111111]"
                    onClick={() => removePromoCode(index)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={sectionCardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            Hero Slider
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-950">
            Creative featured-product slider
          </h2>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            checked={settings.heroSlider.enabled}
            onChange={(event) =>
              updateSection("heroSlider", "enabled", event.target.checked)
            }
            type="checkbox"
          />
          Show hero slider
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Slider eyebrow</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection("heroSlider", "eyebrow", event.target.value)
              }
              value={settings.heroSlider.eyebrow}
            />
          </div>
          <div>
            <label className="text-sm font-medium">CTA button text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection("heroSlider", "ctaLabel", event.target.value)
              }
              value={settings.heroSlider.ctaLabel}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Slider title</label>
          <textarea
            className="mt-2 min-h-[110px] w-full rounded-2xl border px-3 py-3 text-sm"
            onChange={(event) =>
              updateSection("heroSlider", "title", event.target.value)
            }
            value={settings.heroSlider.title}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Spotlight label</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection("heroSlider", "spotlightLabel", event.target.value)
              }
              value={settings.heroSlider.spotlightLabel}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Spotlight suffix text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection("heroSlider", "spotlightText", event.target.value)
              }
              value={settings.heroSlider.spotlightText}
            />
          </div>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            checked={settings.heroSlider.autoplay}
            onChange={(event) =>
              updateSection("heroSlider", "autoplay", event.target.checked)
            }
            type="checkbox"
          />
          Auto-rotate slides
        </label>
      </section>

      <section className={sectionCardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            Newsletter Section
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-950">
            Email signup block
          </h2>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            checked={settings.newsletterSection.enabled}
            onChange={(event) =>
              updateSection("newsletterSection", "enabled", event.target.checked)
            }
            type="checkbox"
          />
          Show newsletter section
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection("newsletterSection", "title", event.target.value)
              }
              value={settings.newsletterSection.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subscribe button</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection(
                  "newsletterSection",
                  "buttonLabel",
                  event.target.value
                )
              }
              value={settings.newsletterSection.buttonLabel}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="mt-2 min-h-[110px] w-full rounded-2xl border px-3 py-3 text-sm"
            onChange={(event) =>
              updateSection(
                "newsletterSection",
                "description",
                event.target.value
              )
            }
            value={settings.newsletterSection.description}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email input placeholder</label>
          <input
            className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
            onChange={(event) =>
              updateSection(
                "newsletterSection",
                "placeholder",
                event.target.value
              )
            }
            value={settings.newsletterSection.placeholder}
          />
        </div>
      </section>

      <section className={sectionCardClass}>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
              Footer Section
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">
              Store footer content
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-gray-500">
              Control the footer brand copy, copyright text, credit content, and footer links.
            </p>
          </div>
          <Button className="bg-[#111111]" onClick={addFooterLink}>
            <Plus className="mr-2 h-4 w-4" />
            Add footer link
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Footer brand</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateFooterField("brandLabel", event.target.value)
              }
              value={settings.footer.brandLabel}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Copyright text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateFooterField("copyrightText", event.target.value)
              }
              value={settings.footer.copyrightText}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Footer description</label>
          <textarea
            className="mt-2 min-h-[100px] w-full rounded-2xl border px-3 py-3 text-sm"
            onChange={(event) =>
              updateFooterField("description", event.target.value)
            }
            value={settings.footer.description}
          />
        </div>

        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            checked={settings.footer.showCredit}
            onChange={(event) =>
              updateFooterField("showCredit", event.target.checked)
            }
            type="checkbox"
          />
          Show built-by credit
        </label>

        <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
          <p className="text-sm font-semibold text-[#111111]">Footer credit</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Credit prefix</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateFooterField("creditPrefix", event.target.value)
                }
                placeholder="Built by"
                value={settings.footer.creditPrefix}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Credit text</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateFooterField("creditText", event.target.value)
                }
                placeholder="Your name"
                value={settings.footer.creditText}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Credit URL</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateFooterField("creditHref", event.target.value)
                }
                placeholder="https://example.com"
                value={settings.footer.creditHref}
              />
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
          <p className="text-sm font-semibold text-[#111111]">Footer links</p>
          <div className="mt-4 grid gap-4">
            {settings.footer.links.map((link, index) => (
              <div
                className="grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-[1fr_1fr_auto]"
                key={link.id}
              >
                <input
                  className="h-11 rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateFooterLink(index, "label", event.target.value)
                  }
                  placeholder="Label"
                  value={link.label}
                />
                <input
                  className="h-11 rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateFooterLink(index, "href", event.target.value)
                  }
                  placeholder="/shop"
                  value={link.href}
                />
                <Button
                  className="border border-black/10 bg-white text-[#111111]"
                  onClick={() => removeFooterLink(index)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionCardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            New Arrivals Hero
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-950">
            Edit /new-arrivals banner text and images
          </h2>
          <p className="mt-2 text-sm leading-7 text-gray-500">
            These fields control the top hero banner on the New Arrivals page.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Eyebrow text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("newArrivalsHero", "eyebrow", event.target.value)
              }
              value={settings.newArrivalsHero.eyebrow}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Side label</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("newArrivalsHero", "sideLabel", event.target.value)
              }
              value={settings.newArrivalsHero.sideLabel}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Main title</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("newArrivalsHero", "title", event.target.value)
              }
              value={settings.newArrivalsHero.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium">CTA button</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("newArrivalsHero", "ctaLabel", event.target.value)
              }
              value={settings.newArrivalsHero.ctaLabel}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Hero description</label>
          <textarea
            className="mt-2 min-h-[100px] w-full rounded-2xl border px-3 py-3 text-sm"
            onChange={(event) =>
              updateHeroSection("newArrivalsHero", "description", event.target.value)
            }
            value={settings.newArrivalsHero.description}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Main hero image</label>
            <input
              accept="image/*"
              className="mt-2 block w-full text-sm"
              disabled={uploadingHeroKey === "newArrivalsHero"}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  uploadHeroImage("newArrivalsHero", "imageUrl", file);
                }
              }}
              type="file"
            />
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("newArrivalsHero", "imageUrl", event.target.value)
              }
              placeholder="/images/nike-reactx.png"
              value={settings.newArrivalsHero.imageUrl}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Second hero image</label>
            <input
              accept="image/*"
              className="mt-2 block w-full text-sm"
              disabled={uploadingHeroKey === "newArrivalsHero"}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  uploadHeroImage("newArrivalsHero", "secondaryImageUrl", file);
                }
              }}
              type="file"
            />
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection(
                  "newArrivalsHero",
                  "secondaryImageUrl",
                  event.target.value
                )
              }
              placeholder="/images/image-1.jpg"
              value={settings.newArrivalsHero.secondaryImageUrl}
            />
          </div>
        </div>
      </section>

      <section className={sectionCardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            Sale Hero
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-950">
            Edit /sale banner text and image
          </h2>
          <p className="mt-2 text-sm leading-7 text-gray-500">
            These fields control the large Sale page hero banner.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Eyebrow text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("saleHero", "eyebrow", event.target.value)
              }
              value={settings.saleHero.eyebrow}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Offer circle text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("saleHero", "sideLabel", event.target.value)
              }
              value={settings.saleHero.sideLabel}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Title prefix</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("saleHero", "title", event.target.value)
              }
              value={settings.saleHero.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Highlight text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("saleHero", "highlightText", event.target.value)
              }
              value={settings.saleHero.highlightText}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Subtitle</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("saleHero", "subtitle", event.target.value)
              }
              value={settings.saleHero.subtitle}
            />
          </div>
          <div>
            <label className="text-sm font-medium">CTA button</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateHeroSection("saleHero", "ctaLabel", event.target.value)
              }
              value={settings.saleHero.ctaLabel}
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Hero description</label>
          <textarea
            className="mt-2 min-h-[100px] w-full rounded-2xl border px-3 py-3 text-sm"
            onChange={(event) =>
              updateHeroSection("saleHero", "description", event.target.value)
            }
            value={settings.saleHero.description}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Hero image</label>
          <input
            accept="image/*"
            className="mt-2 block w-full text-sm"
            disabled={uploadingHeroKey === "saleHero"}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                uploadHeroImage("saleHero", "imageUrl", file);
              }
            }}
            type="file"
          />
          <input
            className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
            onChange={(event) =>
              updateHeroSection("saleHero", "imageUrl", event.target.value)
            }
            placeholder="/images/nike-reactx.png"
            value={settings.saleHero.imageUrl}
          />
        </div>
      </section>

      {productSections.map((sectionMeta) => {
        const section = settings[sectionMeta.key] as ProductSectionSettings;

        return (
          <section key={sectionMeta.key} className={sectionCardClass}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
                {sectionMeta.eyebrow}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-gray-950">
                {sectionMeta.helper}
              </h2>
            </div>
            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                checked={section.enabled}
                onChange={(event) =>
                  updateSection(sectionMeta.key, "enabled", event.target.checked)
                }
                type="checkbox"
              />
              Show section
            </label>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Section title</label>
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateSection(sectionMeta.key, "title", event.target.value)
                  }
                  value={section.title}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Badge text</label>
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateSection(sectionMeta.key, "badgeText", event.target.value)
                  }
                  value={section.badgeText}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                className="mt-2 min-h-[110px] w-full rounded-2xl border px-3 py-3 text-sm"
                onChange={(event) =>
                  updateSection(sectionMeta.key, "description", event.target.value)
                }
                value={section.description}
              />
            </div>
            <div>
              <p className="text-sm font-medium">Choose products</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <label
                    key={`${sectionMeta.key}-${product.id}`}
                    className="flex items-start gap-3 rounded-2xl border p-4 text-sm"
                  >
                    <input
                      checked={section.productIds.includes(product.id)}
                      onChange={() => toggleProduct(sectionMeta.key, product.id)}
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
        );
      })}

      <section className={sectionCardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            Why Choose Us
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-950">
            Delivery, return, and secure payment cards
          </h2>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            checked={settings.whyChooseUsSection.enabled}
            onChange={(event) =>
              updateSection(
                "whyChooseUsSection",
                "enabled",
                event.target.checked
              )
            }
            type="checkbox"
          />
          Show why choose us section
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Section title</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection("whyChooseUsSection", "title", event.target.value)
              }
              value={settings.whyChooseUsSection.title}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateSection(
                  "whyChooseUsSection",
                  "description",
                  event.target.value
                )
              }
              value={settings.whyChooseUsSection.description}
            />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {settings.whyChooseUsSection.items.map((item, index) => (
            <div key={`feature-${index}`} className="rounded-2xl border p-4">
              <label className="text-sm font-medium">Card title</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateWhyChooseItem(index, "title", event.target.value)
                }
                value={item.title}
              />
              <label className="mt-4 block text-sm font-medium">
                Card description
              </label>
              <textarea
                className="mt-2 min-h-[110px] w-full rounded-2xl border px-3 py-3 text-sm"
                onChange={(event) =>
                  updateWhyChooseItem(index, "description", event.target.value)
                }
                value={item.description}
              />
            </div>
          ))}
        </div>
      </section>

      <section className={sectionCardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            Blog Page
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-950">
            Control the new /blog editorial page
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-gray-500">
            Update the hero, category pills, featured stories, trending list, newsletter card, and bottom highlights for the blog page from here.
          </p>
        </div>

        <label className="flex items-center gap-3 text-sm font-medium">
          <input
            checked={settings.blog.enabled}
            onChange={(event) => updateBlogField("enabled", event.target.checked)}
            type="checkbox"
          />
          Show blog page
        </label>

        <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
          <p className="text-sm font-semibold text-[#111111]">Hero section</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Breadcrumb / eyebrow</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) => updateBlogField("heroEyebrow", event.target.value)}
                value={settings.blog.heroEyebrow}
              />
            </div>
            <div>
              <label className="text-sm font-medium">CTA button</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) => updateBlogField("heroCtaLabel", event.target.value)}
                value={settings.blog.heroCtaLabel}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Title start</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) => updateBlogField("heroTitleStart", event.target.value)}
                value={settings.blog.heroTitleStart}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Title accent</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) => updateBlogField("heroTitleAccent", event.target.value)}
                value={settings.blog.heroTitleAccent}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Title end</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) => updateBlogField("heroTitleEnd", event.target.value)}
                value={settings.blog.heroTitleEnd}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Circle badge text</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) => updateBlogField("heroBadgeText", event.target.value)}
                value={settings.blog.heroBadgeText}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium">Hero description</label>
            <textarea
              className="mt-2 min-h-[100px] w-full rounded-2xl border px-3 py-3 text-sm"
              onChange={(event) => updateBlogField("heroDescription", event.target.value)}
              value={settings.blog.heroDescription}
            />
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium">Hero image</label>
            <input
              accept="image/*"
              className="mt-2 block w-full text-sm"
              disabled={uploadingBlogTarget === "heroImage"}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  uploadBlogImage("heroImage", (url) => updateBlogField("heroImageUrl", url), file);
                }
              }}
              type="file"
            />
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateBlogField("heroImageUrl", event.target.value)}
              value={settings.blog.heroImageUrl}
            />
          </div>
        </div>

        <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
          <p className="text-sm font-semibold text-[#111111]">Category pills</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {settings.blog.categories.map((category, index) => (
              <div key={category.id} className="rounded-2xl border bg-white p-4">
                <label className="text-sm font-medium">Category name</label>
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateBlogCategory(index, "label", event.target.value)
                  }
                  value={category.label}
                />
                <label className="mt-4 block text-sm font-medium">Count label</label>
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateBlogCategory(index, "countLabel", event.target.value)
                  }
                  value={category.countLabel}
                />
                <label className="mt-4 block text-sm font-medium">Image</label>
                <input
                  accept="image/*"
                  className="mt-2 block w-full text-sm"
                  disabled={uploadingBlogTarget === `category-${index}`}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      uploadBlogImage(
                        `category-${index}`,
                        (url) => updateBlogCategory(index, "imageUrl", url),
                        file
                      );
                    }
                  }}
                  type="file"
                />
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateBlogCategory(index, "imageUrl", event.target.value)
                  }
                  value={category.imageUrl}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
          <p className="text-sm font-semibold text-[#111111]">Featured stories</p>
          <div className="mt-4">
            <label className="text-sm font-medium">Section heading</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) => updateBlogField("featuredHeading", event.target.value)}
              value={settings.blog.featuredHeading}
            />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-3">
            {settings.blog.featuredPosts.map((article, index) => (
              <div key={article.id} className="rounded-2xl border bg-white p-4">
                <p className="text-sm font-semibold text-[#111111]">
                  Story {index + 1}
                </p>
                <label className="mt-3 block text-sm font-medium">Tag</label>
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateBlogArticle("featuredPosts", index, "tag", event.target.value)
                  }
                  value={article.tag}
                />
                <label className="mt-4 block text-sm font-medium">Title</label>
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateBlogArticle("featuredPosts", index, "title", event.target.value)
                  }
                  value={article.title}
                />
                <label className="mt-4 block text-sm font-medium">Excerpt</label>
                <textarea
                  className="mt-2 min-h-[100px] w-full rounded-2xl border px-3 py-3 text-sm"
                  onChange={(event) =>
                    updateBlogArticle(
                      "featuredPosts",
                      index,
                      "excerpt",
                      event.target.value
                    )
                  }
                  value={article.excerpt}
                />
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Date label</label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updateBlogArticle(
                          "featuredPosts",
                          index,
                          "dateLabel",
                          event.target.value
                        )
                      }
                      value={article.dateLabel}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Read time</label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updateBlogArticle(
                          "featuredPosts",
                          index,
                          "readTime",
                          event.target.value
                        )
                      }
                      value={article.readTime}
                    />
                  </div>
                </div>
                <label className="mt-4 block text-sm font-medium">Image</label>
                <input
                  accept="image/*"
                  className="mt-2 block w-full text-sm"
                  disabled={uploadingBlogTarget === `featured-${index}`}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      uploadBlogImage(
                        `featured-${index}`,
                        (url) =>
                          updateBlogArticle("featuredPosts", index, "imageUrl", url),
                        file
                      );
                    }
                  }}
                  type="file"
                />
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateBlogArticle(
                      "featuredPosts",
                      index,
                      "imageUrl",
                      event.target.value
                    )
                  }
                  value={article.imageUrl}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
          <p className="text-sm font-semibold text-[#111111]">More to explore</p>
          <div className="mt-4 grid gap-4 xl:grid-cols-2">
            {settings.blog.explorePosts.map((article, index) => (
              <div key={article.id} className="rounded-2xl border bg-white p-4">
                <p className="text-sm font-semibold text-[#111111]">
                  Explore card {index + 1}
                </p>
                <div className="mt-3 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Tag</label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updateBlogArticle("explorePosts", index, "tag", event.target.value)
                      }
                      value={article.tag}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Read time</label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updateBlogArticle(
                          "explorePosts",
                          index,
                          "readTime",
                          event.target.value
                        )
                      }
                      value={article.readTime}
                    />
                  </div>
                </div>
                <label className="mt-4 block text-sm font-medium">Title</label>
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateBlogArticle("explorePosts", index, "title", event.target.value)
                  }
                  value={article.title}
                />
                <label className="mt-4 block text-sm font-medium">Excerpt</label>
                <textarea
                  className="mt-2 min-h-[90px] w-full rounded-2xl border px-3 py-3 text-sm"
                  onChange={(event) =>
                    updateBlogArticle(
                      "explorePosts",
                      index,
                      "excerpt",
                      event.target.value
                    )
                  }
                  value={article.excerpt}
                />
                <label className="mt-4 block text-sm font-medium">Date</label>
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateBlogArticle(
                      "explorePosts",
                      index,
                      "dateLabel",
                      event.target.value
                    )
                  }
                  value={article.dateLabel}
                />
                <label className="mt-4 block text-sm font-medium">Image</label>
                <input
                  accept="image/*"
                  className="mt-2 block w-full text-sm"
                  disabled={uploadingBlogTarget === `explore-${index}`}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      uploadBlogImage(
                        `explore-${index}`,
                        (url) =>
                          updateBlogArticle("explorePosts", index, "imageUrl", url),
                        file
                      );
                    }
                  }}
                  type="file"
                />
                <input
                  className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                  onChange={(event) =>
                    updateBlogArticle(
                      "explorePosts",
                      index,
                      "imageUrl",
                      event.target.value
                    )
                  }
                  value={article.imageUrl}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
            <p className="text-sm font-semibold text-[#111111]">Trending sidebar</p>
            <div className="mt-4 space-y-4">
              {settings.blog.trendingPosts.map((article, index) => (
                <div key={article.id} className="rounded-2xl border bg-white p-4">
                  <p className="text-sm font-semibold text-[#111111]">
                    Trending item {index + 1}
                  </p>
                  <label className="mt-3 block text-sm font-medium">Title</label>
                  <input
                    className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                    onChange={(event) =>
                      updateTrendingPost(index, "title", event.target.value)
                    }
                    value={article.title}
                  />
                  <label className="mt-4 block text-sm font-medium">Date label</label>
                  <input
                    className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                    onChange={(event) =>
                      updateTrendingPost(index, "dateLabel", event.target.value)
                    }
                    value={article.dateLabel}
                  />
                  <label className="mt-4 block text-sm font-medium">Image</label>
                  <input
                    accept="image/*"
                    className="mt-2 block w-full text-sm"
                    disabled={uploadingBlogTarget === `trending-${index}`}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        uploadBlogImage(
                          `trending-${index}`,
                          (url) => updateTrendingPost(index, "imageUrl", url),
                          file
                        );
                      }
                    }}
                    type="file"
                  />
                  <input
                    className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                    onChange={(event) =>
                      updateTrendingPost(index, "imageUrl", event.target.value)
                    }
                    value={article.imageUrl}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
              <p className="text-sm font-semibold text-[#111111]">Newsletter card</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                    onChange={(event) =>
                      updateBlogNewsletter("title", event.target.value)
                    }
                    value={settings.blog.newsletter.title}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Button label</label>
                  <input
                    className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                    onChange={(event) =>
                      updateBlogNewsletter("buttonLabel", event.target.value)
                    }
                    value={settings.blog.newsletter.buttonLabel}
                  />
                </div>
              </div>
              <label className="mt-4 block text-sm font-medium">Description</label>
              <textarea
                className="mt-2 min-h-[100px] w-full rounded-2xl border px-3 py-3 text-sm"
                onChange={(event) =>
                  updateBlogNewsletter("description", event.target.value)
                }
                value={settings.blog.newsletter.description}
              />
              <label className="mt-4 block text-sm font-medium">Placeholder</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateBlogNewsletter("placeholder", event.target.value)
                }
                value={settings.blog.newsletter.placeholder}
              />
              <label className="mt-4 block text-sm font-medium">Image</label>
              <input
                accept="image/*"
                className="mt-2 block w-full text-sm"
                disabled={uploadingBlogTarget === "newsletter-image"}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    uploadBlogImage(
                      "newsletter-image",
                      (url) => updateBlogNewsletter("imageUrl", url),
                      file
                    );
                  }
                }}
                type="file"
              />
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateBlogNewsletter("imageUrl", event.target.value)
                }
                value={settings.blog.newsletter.imageUrl}
              />
            </div>

            <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
              <p className="text-sm font-semibold text-[#111111]">Bottom highlights</p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {settings.blog.promises.map((item, index) => (
                  <div key={item.id} className="rounded-2xl border bg-white p-4">
                    <p className="text-sm font-semibold text-[#111111]">
                      Highlight {index + 1}
                    </p>
                    <label className="mt-3 block text-sm font-medium">Title</label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updateBlogPromise(index, "title", event.target.value)
                      }
                      value={item.title}
                    />
                    <label className="mt-4 block text-sm font-medium">
                      Description
                    </label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updateBlogPromise(index, "description", event.target.value)
                      }
                      value={item.description}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap items-center gap-3 rounded-[28px] border border-black/10 bg-white/90 p-3 shadow-[0_24px_60px_rgba(17,17,17,0.12)] backdrop-blur">
        <Button className="rounded-full bg-[#111111] px-5" onClick={handleSave}>
          Save website settings
        </Button>
        <Button
          className="rounded-full border border-black/10 bg-white px-5 text-[#111111]"
          onClick={handleReset}
        >
          Reset to default
        </Button>

        <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ed] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5a1f]">
          <Sparkles className="h-4 w-4" />
          Homepage controls ready
        </div>
      </div>
    </div>
  );
};

export default HomeSettingsForm;
