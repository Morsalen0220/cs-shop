"use client";

import Button from "@/components/ui/button";
import {
  defaultHomeSettings,
  readHomeSettings,
  saveHomeSettings,
} from "@/lib/home-settings";
import { HomeSettings, Product, ProductSectionSettings } from "@/types";
import { MonitorSmartphone, Sparkles } from "lucide-react";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

interface HomeSettingsFormProps {
  products: Product[];
}

const sectionCardClass =
  "rounded-3xl border border-black/10 bg-white p-6 shadow-sm space-y-5";

const productSections = [
  {
    key: "bestSellerSection" as const,
    eyebrow: "Best Seller Section",
    helper: "Most popular products and highlight items",
  },
  {
    key: "newArrivalsSection" as const,
    eyebrow: "New Arrivals Section",
    helper: "Latest products with New badge",
  },
  {
    key: "flashSaleSection" as const,
    eyebrow: "Flash Sale Section",
    helper: "Limited-time deals and countdown support",
  },
];

const HomeSettingsForm: React.FC<HomeSettingsFormProps> = ({ products }) => {
  const [settings, setSettings] = useState<HomeSettings>(defaultHomeSettings);

  useEffect(() => {
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

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-2">
        <div
          className={`${sectionCardClass} bg-[linear-gradient(135deg,_#111111_0%,_#1f2937_100%)] text-white`}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em]">
            <MonitorSmartphone className="h-4 w-4" />
            Website Studio
          </div>
          <div>
            <h2 className="text-3xl font-semibold">
              Everything visible on the homepage can be edited here.
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/70">
              Change marketing copy, product highlights, slider behavior, and trust-building sections without touching storefront code.
            </p>
          </div>
        </div>

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

      <div className="sticky bottom-4 flex flex-wrap gap-3 rounded-full border border-black/10 bg-white/90 p-3 backdrop-blur">
        <Button className="bg-[#111111]" onClick={handleSave}>
          Save website settings
        </Button>
        <Button
          className="border border-black/10 bg-white text-[#111111]"
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
