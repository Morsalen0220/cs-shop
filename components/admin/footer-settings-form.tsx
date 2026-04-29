"use client";

import Button from "@/components/ui/button";
import {
  defaultHomeSettings,
  readHomeSettings,
  saveHomeSettings,
} from "@/lib/home-settings";
import { FooterSettings, HeaderMenuItem } from "@/types";
import { Plus, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const sectionCardClass =
  "space-y-5 rounded-3xl border border-black/10 bg-white p-6 shadow-sm";

const FooterSettingsForm = () => {
  const [settings, setSettings] = useState<FooterSettings>(
    defaultHomeSettings.footer
  );

  useEffect(() => {
    const syncSettings = () => {
      setSettings(readHomeSettings().footer);
    };

    syncSettings();
    window.addEventListener("storage", syncSettings);
    window.addEventListener("home-settings-updated", syncSettings);

    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener("home-settings-updated", syncSettings);
    };
  }, []);

  const updateFooterField = <F extends keyof FooterSettings>(
    field: F,
    value: FooterSettings[F]
  ) => {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addFooterLink = () => {
    setSettings((current) => ({
      ...current,
      links: [
        ...current.links,
        {
          id: `footer-link-${Date.now()}`,
          label: "New footer link",
          href: "/",
          type: "link",
        },
      ],
    }));
  };

  const updateFooterLink = <F extends keyof HeaderMenuItem>(
    index: number,
    field: F,
    value: HeaderMenuItem[F]
  ) => {
    setSettings((current) => ({
      ...current,
      links: current.links.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeFooterLink = (index: number) => {
    setSettings((current) => ({
      ...current,
      links: current.links.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSave = () => {
    const currentSettings = readHomeSettings();
    saveHomeSettings({
      ...currentSettings,
      footer: settings,
    });
    toast.success("Footer settings saved");
  };

  const handleReset = () => {
    const currentSettings = readHomeSettings();
    setSettings(defaultHomeSettings.footer);
    saveHomeSettings({
      ...currentSettings,
      footer: defaultHomeSettings.footer,
    });
    toast.success("Footer settings reset");
  };

  return (
    <div className="space-y-8 pb-28">
      <section className={sectionCardClass}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
            Footer
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-gray-950">
            Footer brand and quick links
          </h2>
          <p className="mt-2 text-sm leading-7 text-gray-500">
            Control the storefront footer just like the header: brand label,
            description, copyright text, credit content, and link order.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Brand label</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateFooterField("brandLabel", event.target.value)
              }
              value={settings.brandLabel}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Copyright text</label>
            <input
              className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
              onChange={(event) =>
                updateFooterField("copyrightText", event.target.value)
              }
              value={settings.copyrightText}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Footer description</label>
          <textarea
            className="mt-2 min-h-28 w-full rounded-2xl border px-3 py-3 text-sm leading-6"
            onChange={(event) =>
              updateFooterField("description", event.target.value)
            }
            value={settings.description}
          />
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#faf9f6] p-4 text-sm font-medium">
          <input
            checked={settings.showCredit}
            className="h-4 w-4"
            onChange={(event) =>
              updateFooterField("showCredit", event.target.checked)
            }
            type="checkbox"
          />
          Show footer credit line
        </label>

        <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
          <p className="text-sm font-semibold text-gray-950">Footer credit</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Credit prefix</label>
              <input
                className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                onChange={(event) =>
                  updateFooterField("creditPrefix", event.target.value)
                }
                placeholder="Built by"
                value={settings.creditPrefix}
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
                value={settings.creditText}
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
                value={settings.creditHref}
              />
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-black/10 bg-[#faf9f6] p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-gray-950">Footer links</p>
              <p className="mt-1 text-sm text-gray-500">
                Add, remove, and edit footer quick links shown to customers.
              </p>
            </div>
            <Button
              className="h-12 self-start rounded-full bg-[#111111] px-6 text-sm lg:self-auto"
              onClick={addFooterLink}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add footer link
            </Button>
          </div>

          <div className="mt-5 grid gap-4">
            {settings.links.map((link, index) => (
              <div
                className="rounded-[22px] border border-black/10 bg-white p-4"
                key={link.id}
              >
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_140px] lg:items-end">
                  <div>
                    <label className="text-sm font-medium">Link label</label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updateFooterLink(index, "label", event.target.value)
                      }
                      value={link.label}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Link URL</label>
                    <input
                      className="mt-2 h-11 w-full rounded-xl border px-3 text-sm"
                      onChange={(event) =>
                        updateFooterLink(index, "href", event.target.value)
                      }
                      placeholder="/shop"
                      value={link.href}
                    />
                  </div>
                  <Button
                    className="inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-black/10 bg-white px-4 text-[#111111]"
                    onClick={() => removeFooterLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="sticky bottom-4 z-20 flex flex-wrap gap-3 rounded-[28px] border border-black/10 bg-white/90 p-3 shadow-[0_18px_40px_rgba(17,17,17,0.08)] backdrop-blur">
        <Button className="bg-[#111111]" onClick={handleSave}>
          Save footer settings
        </Button>
        <Button
          className="border border-black/10 bg-white text-[#111111]"
          onClick={handleReset}
        >
          Reset footer
        </Button>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#fff3ed] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5a1f]">
          <Sparkles className="h-4 w-4" />
          Footer controls ready
        </div>
      </div>
    </div>
  );
};

export default FooterSettingsForm;
