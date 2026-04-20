"use client";

import { readHomeSettings } from "@/lib/home-settings";
import { ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const NavbarPromoPill = () => {
  const [promo, setPromo] = useState(() => readHomeSettings().navbarPromo);

  useEffect(() => {
    const syncPromo = () => setPromo(readHomeSettings().navbarPromo);

    syncPromo();
    window.addEventListener("storage", syncPromo);
    window.addEventListener("home-settings-updated", syncPromo);

    return () => {
      window.removeEventListener("storage", syncPromo);
      window.removeEventListener("home-settings-updated", syncPromo);
    };
  }, []);

  if (!promo.enabled) {
    return null;
  }

  return (
    <div className="hidden items-center gap-2 rounded-full border border-[#ff5a1f]/15 bg-[#fff3ed] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5a1f] lg:inline-flex">
      <Sparkles className="h-4 w-4" />
      {promo.text}
      <ChevronRight className="h-4 w-4" />
    </div>
  );
};

export default NavbarPromoPill;
