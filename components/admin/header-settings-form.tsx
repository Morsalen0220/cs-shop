"use client";

import Button from "@/components/ui/button";
import {
  defaultHomeSettings,
  readHomeSettings,
  saveHomeSettings,
} from "@/lib/home-settings";
import { HeaderMenuItem, HeaderSettings } from "@/types";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const sectionCardClass =
  "rounded-3xl border border-black/10 bg-white p-6 shadow-sm space-y-5";

const HeaderSettingsForm = () => {
  const [settings, setSettings] = useState<HeaderSettings>(defaultHomeSettings.header);
  const hasCategoriesItem = settings.menuItems.some(
    (item) => item.type === "categories"
  );

  useEffect(() => {
    const syncSettings = () => {
      setSettings(readHomeSettings().header);
    };

    syncSettings();
    window.addEventListener("storage", syncSettings);
    window.addEventListener("home-settings-updated", syncSettings);

    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener("home-settings-updated", syncSettings);
    };
  }, []);

  const updateHeaderField = <F extends keyof HeaderSettings>(
    field: F,
    value: HeaderSettings[F]
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addHeaderMenuItem = () => {
    setSettings((current) => ({
      ...current,
      menuItems: [
        ...current.menuItems,
        {
          id: `nav-item-${Date.now()}`,
          label: "New menu item",
          href: "/",
          type: "link",
        },
      ],
    }));
  };

  const addCategoriesMenuItem = () => {
    setSettings((current) => ({
      ...current,
      menuItems: [
        ...current.menuItems,
        {
          id: `nav-categories-${Date.now()}`,
          label: "Categories",
          href: "/shop",
          type: "categories",
        },
      ],
    }));
  };

  const updateHeaderMenuItem = <F extends keyof HeaderMenuItem>(
    index: number,
    field: F,
    value: HeaderMenuItem[F]
  ) => {
    setSettings((current) => ({
      ...current,
      menuItems: current.menuItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeHeaderMenuItem = (index: number) => {
    setSettings((current) => ({
      ...current,
      menuItems: current.menuItems.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSave = () => {
    const currentSettings = readHomeSettings();
    saveHomeSettings({
      ...currentSettings,
      header: settings,
    });
    toast.success("Header settings saved");
  };

  const handleReset = () => {
    const currentSettings = readHomeSettings();
    setSettings(defaultHomeSettings.header);
    saveHomeSettings({
      ...currentSettings,
      header: defaultHomeSettings.header,
    });
    toast.success("Header settings reset");
  };

  return (
    <div className="space-y-8 pb-28">
      <section className={sectionCardClass}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
              Header
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-gray-950">
              Brand text and navigation menu
            </h2>
            <p className="mt-2 text-sm leading-7 text-gray-500">
              Update the logo name, tagline, and the navbar menu items customers
              see across the storefront.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Logo name</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateHeaderField("brandLabel", event.target.value)
                }
                value={settings.brandLabel}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Tagline</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateHeaderField("tagline", event.target.value)
                }
                value={settings.tagline}
              />
            </div>
          </div>
          <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold text-gray-950">Menu items</p>
                <p className="mt-1 text-sm text-gray-500">
                  Add new links, edit labels and URLs, or keep a categories
                  dropdown in the header.
                </p>
              </div>
              <Button
                className="h-12 self-start rounded-full bg-[#111111] px-6 text-sm lg:self-auto"
                onClick={addHeaderMenuItem}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add menu item
              </Button>
            </div>

            <div className="mt-5 grid gap-4">
              {settings.menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-[22px] border border-black/10 bg-white p-4"
                >
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_180px_minmax(0,1.1fr)_150px] xl:items-end">
                    <div>
                      <label className="text-sm font-medium">Menu label</label>
                      <input
                        className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                        onChange={(event) =>
                          updateHeaderMenuItem(index, "label", event.target.value)
                        }
                        value={item.label}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Item type</label>
                      <select
                        className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                        onChange={(event) =>
                          setSettings((current) => ({
                            ...current,
                            menuItems: current.menuItems.map((currentItem, itemIndex) => {
                              if (itemIndex !== index) {
                                return currentItem;
                              }

                              const nextType = event.target.value as HeaderMenuItem["type"];

                              return {
                                ...currentItem,
                                type: nextType,
                                href: nextType === "categories" ? "/shop" : currentItem.href,
                                label:
                                  nextType === "categories" &&
                                  (currentItem.label === "New menu item" ||
                                    currentItem.label.trim() === "")
                                    ? "Categories"
                                    : currentItem.label,
                              };
                            }),
                          }))
                        }
                        value={item.type}
                      >
                        <option value="link">Link</option>
                        <option value="categories">Categories dropdown</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">
                        {item.type === "categories" ? "Fallback link" : "Link URL"}
                      </label>
                      <input
                        className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                        onChange={(event) =>
                          updateHeaderMenuItem(index, "href", event.target.value)
                        }
                        placeholder={item.type === "categories" ? "/shop" : "/about"}
                        value={item.href}
                      />
                    </div>
                    <Button
                      className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-black/10 bg-white px-4 text-[#111111]"
                      onClick={() => removeHeaderMenuItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 rounded-[22px] border border-dashed border-black/10 bg-white p-4">
            <Button
              className="bg-[#111111]"
              onClick={addHeaderMenuItem}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add normal link
            </Button>
            <Button
              className="border border-black/10 bg-white text-[#111111]"
              disabled={hasCategoriesItem}
              onClick={addCategoriesMenuItem}
            >
              <Plus className="mr-2 h-4 w-4" />
              {hasCategoriesItem ? "Categories added" : "Add categories dropdown"}
            </Button>
            <p className="self-center text-sm text-gray-500">
              Categories dropdown automatically shows your live category items.
            </p>
          </div>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap gap-3 rounded-[28px] border border-black/10 bg-white/90 p-3 shadow-[0_18px_40px_rgba(17,17,17,0.08)] backdrop-blur">
        <Button className="bg-[#111111]" onClick={handleSave}>
          Save header settings
        </Button>
        <Button
          className="border border-black/10 bg-white text-[#111111]"
          onClick={handleReset}
        >
          Reset header
        </Button>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ed] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5a1f]">
          <Sparkles className="h-4 w-4" />
          Header controls ready
        </div>
      </div>
    </div>
  );
};

export default HeaderSettingsForm;
