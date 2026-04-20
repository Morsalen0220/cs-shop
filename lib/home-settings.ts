import { HomeSettings } from "@/types";

export const HOME_SETTINGS_STORAGE_KEY = "nike-shop-home-settings";

export const defaultHomeSettings: HomeSettings = {
  announcementBar: {
    enabled: true,
    primaryText: "Free shipping on orders over $150",
    secondaryText: "Weekend sprint: extra 20% off selected runners.",
  },
  navbarPromo: {
    enabled: true,
    text: "New season live",
  },
  promoCodes: [
    {
      id: "welcome-10",
      code: "WELCOME10",
      label: "10% off your order",
      value: 10,
      type: "percentage",
      enabled: true,
    },
    {
      id: "run500",
      code: "RUN500",
      label: "Flat 500 off selected orders",
      value: 500,
      type: "fixed",
      enabled: true,
    },
  ],
  promoSection: {
    enabled: true,
    badgeText: "Sprint Promo",
    title: "Move faster with limited-time Nike offers.",
    description:
      "Fresh markdowns, bold cushioning, and street-ready icons picked to turn heads all week.",
    discountText: "Up to 35% off performance and lifestyle pairs.",
    ctaLabel: "Shop the offer",
    countdownEnabled: true,
    countdownTarget: "2026-12-31T23:59:59.000Z",
  },
  heroSlider: {
    enabled: true,
    eyebrow: "Creative slider",
    title: "Swipe through the sharpest Nike drops of the moment.",
    spotlightLabel: "Spotlight",
    spotlightText: "icons with all-day energy.",
    ctaLabel: "Discover pair",
    autoplay: true,
  },
  newsletterSection: {
    enabled: true,
    title: "Join the Nike shop newsletter",
    description:
      "Get launch alerts, flash-sale reminders, and member-only style picks in your inbox.",
    placeholder: "Enter your email",
    buttonLabel: "Subscribe",
  },
  bestSellerSection: {
    enabled: true,
    title: "Best Sellers",
    description: "Most popular picks our shoppers keep coming back for.",
    productIds: ["nike-reactx", "air-force-one", "zoom-freak"],
    badgeText: "Popular",
  },
  newArrivalsSection: {
    enabled: true,
    title: "New Arrivals",
    description: "Latest drops with a crisp new-season energy.",
    productIds: ["air-force-one", "zoom-freak", "nike-reactx"],
    badgeText: "New",
  },
  flashSaleSection: {
    enabled: true,
    title: "Flash Sale",
    description: "Limited-time deals with bold value before the timer runs out.",
    productIds: ["zoom-freak", "nike-reactx"],
    badgeText: "Flash Deal",
  },
  whyChooseUsSection: {
    enabled: true,
    title: "Why Choose Us",
    description:
      "We keep the experience fast, secure, and smooth from browse to doorstep.",
    items: [
      {
        title: "Fast delivery",
        description: "Quick dispatch with reliable tracking from checkout to door.",
      },
      {
        title: "Easy return",
        description: "Simple return support if the fit or feel is not quite right.",
      },
      {
        title: "Secure payment",
        description: "Protected checkout flow with trusted payment handling.",
      },
    ],
  },
};

const mergeFeatureItems = (items: HomeSettings["whyChooseUsSection"]["items"]) =>
  defaultHomeSettings.whyChooseUsSection.items.map((defaultItem, index) => ({
    ...defaultItem,
    ...(items?.[index] ?? {}),
  }));

export const mergeHomeSettings = (
  settings?: Partial<HomeSettings> | null
): HomeSettings => ({
  announcementBar: {
    ...defaultHomeSettings.announcementBar,
    ...(settings?.announcementBar ?? {}),
  },
  navbarPromo: {
    ...defaultHomeSettings.navbarPromo,
    ...(settings?.navbarPromo ?? {}),
  },
  promoCodes: Array.isArray(settings?.promoCodes)
    ? settings!.promoCodes.map((promo, index) => ({
          ...defaultHomeSettings.promoCodes[index % defaultHomeSettings.promoCodes.length],
          ...promo,
          id:
            promo.id ||
            `${String(promo.code || "promo").toLowerCase().replace(/\s+/g, "-")}-${index}`,
        }))
    : defaultHomeSettings.promoCodes,
  promoSection: {
    ...defaultHomeSettings.promoSection,
    ...(settings?.promoSection ?? {}),
  },
  heroSlider: {
    ...defaultHomeSettings.heroSlider,
    ...(settings?.heroSlider ?? {}),
  },
  newsletterSection: {
    ...defaultHomeSettings.newsletterSection,
    ...(settings?.newsletterSection ?? {}),
  },
  bestSellerSection: {
    ...defaultHomeSettings.bestSellerSection,
    ...(settings?.bestSellerSection ?? {}),
    productIds:
      settings?.bestSellerSection?.productIds ??
      defaultHomeSettings.bestSellerSection.productIds,
  },
  newArrivalsSection: {
    ...defaultHomeSettings.newArrivalsSection,
    ...(settings?.newArrivalsSection ?? {}),
    productIds:
      settings?.newArrivalsSection?.productIds ??
      defaultHomeSettings.newArrivalsSection.productIds,
  },
  flashSaleSection: {
    ...defaultHomeSettings.flashSaleSection,
    ...(settings?.flashSaleSection ?? {}),
    productIds:
      settings?.flashSaleSection?.productIds ??
      defaultHomeSettings.flashSaleSection.productIds,
  },
  whyChooseUsSection: {
    ...defaultHomeSettings.whyChooseUsSection,
    ...(settings?.whyChooseUsSection ?? {}),
    items: mergeFeatureItems(settings?.whyChooseUsSection?.items ?? []),
  },
});

export const readHomeSettings = (): HomeSettings => {
  if (typeof window === "undefined") {
    return defaultHomeSettings;
  }

  try {
    const raw = window.localStorage.getItem(HOME_SETTINGS_STORAGE_KEY);

    if (!raw) {
      return defaultHomeSettings;
    }

    return mergeHomeSettings(JSON.parse(raw) as Partial<HomeSettings>);
  } catch {
    return defaultHomeSettings;
  }
};

export const saveHomeSettings = (settings: HomeSettings) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(HOME_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("home-settings-updated"));
};
