"use client";

import { readHomeSettings } from "@/lib/home-settings";
import { useEffect, useState } from "react";

const AnnouncementBar = () => {
  const [settings, setSettings] = useState(() => readHomeSettings());

  useEffect(() => {
    const syncSettings = () => setSettings(readHomeSettings());

    syncSettings();
    window.addEventListener("storage", syncSettings);
    window.addEventListener("home-settings-updated", syncSettings);

    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener("home-settings-updated", syncSettings);
    };
  }, []);

  if (!settings.announcementBar.enabled) {
    return null;
  }

  return (
    <div className="border-b border-black/10 bg-[#111111] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 text-center text-xs font-medium uppercase tracking-[0.24em] sm:flex-row sm:items-center sm:justify-center sm:gap-4 sm:text-sm">
        <span>{settings.announcementBar.primaryText}</span>
        <span className="hidden h-1 w-1 rounded-full bg-white/50 sm:block" />
        <span className="text-white/70">
          {settings.announcementBar.secondaryText}
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
