"use client";

import { cn } from "@/lib/utils";
import { Moon, SunMedium } from "lucide-react";
import { useThemeMode } from "@/providers/theme-provider";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeMode();
  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border transition md:h-10 md:w-10",
        isDark
          ? "border-white/10 bg-[#111827] text-[#f8fafc] hover:bg-[#182132]"
          : "border-black/10 bg-white text-[#111111] hover:border-black/20 hover:bg-black hover:text-white"
      )}
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? <SunMedium size={17} /> : <Moon size={17} />}
    </button>
  );
};

export default ThemeToggle;
