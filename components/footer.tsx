"use client";

import { defaultHomeSettings, readHomeSettings } from "@/lib/home-settings";
import { FooterSettings } from "@/types";
import { Facebook, Instagram, Mail, MapPin, Send, Twitter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const socialLinks = [
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Facebook", icon: Facebook, href: "#" },
  { label: "Twitter", icon: Twitter, href: "#" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  const [settings, setSettings] = useState<FooterSettings>(
    defaultHomeSettings.footer
  );

  useEffect(() => {
    const syncSettings = () => setSettings(readHomeSettings().footer);

    syncSettings();
    window.addEventListener("storage", syncSettings);
    window.addEventListener("home-settings-updated", syncSettings);

    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener("home-settings-updated", syncSettings);
    };
  }, []);

  return (
    <footer className="border-t border-white/10 bg-[#080d16] text-white">
      <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 sm:pb-10 sm:pt-10 lg:px-8">
        <div className="grid gap-7 lg:grid-cols-[1.1fr_0.8fr_0.9fr] lg:gap-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white text-[#111111]">
                <Send className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">
                  {settings.brandLabel}
                </p>
                <p className="text-lg font-semibold text-white">Step ahead</p>
              </div>
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/62 sm:mt-5">
              {settings.description}
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    aria-label={item.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:bg-white hover:text-[#111111]"
                    href={item.href}
                    key={item.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Quick links
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3">
              {settings.links.map((link) => (
                <Link
                  className="rounded-2xl border border-white/10 px-3 py-3 text-sm font-medium text-white/68 transition hover:text-white sm:border-0 sm:px-0 sm:py-0"
                  href={link.href}
                  key={link.id}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
              Store support
            </p>
            <div className="mt-5 space-y-3 text-sm text-white/68">
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#ff6a1a]" />
                support@nikeshop.demo
              </p>
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[#ff6a1a]" />
                Dhaka, Bangladesh
              </p>
            </div>
            <form className="mt-5 flex overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <input
                className="h-12 min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/35"
                placeholder="Email updates"
                type="email"
              />
              <button
                className="flex h-12 w-12 items-center justify-center bg-[#ff6a1a] text-white"
                type="button"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {settings.copyrightText}
          </p>
          {settings.showCredit ? (
            <p>
              {settings.creditPrefix}{" "}
              {settings.creditHref ? (
                <Link
                  href={settings.creditHref}
                  className="underline underline-offset-4 hover:text-white"
                >
                  {settings.creditText}
                </Link>
              ) : (
                <span>{settings.creditText}</span>
              )}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
