import { BlogPageSettings, HomeSettings } from "@/types";

export const HOME_SETTINGS_STORAGE_KEY = "nike-shop-home-settings";

export const defaultHomeSettings: HomeSettings = {
  header: {
    brandLabel: "Nikeshop",
    tagline: "Move with intention",
    menuItems: [
      { id: "nav-home", label: "Home", href: "/", type: "link" },
      { id: "nav-shop", label: "Shop", href: "/shop", type: "link" },
      {
        id: "nav-arrivals",
        label: "New Arrivals",
        href: "/new-arrivals",
        type: "link",
      },
      { id: "nav-sale", label: "Sale", href: "/sale", type: "link" },
      { id: "nav-blog", label: "Blog", href: "/blog", type: "link" },
      { id: "nav-about", label: "About", href: "/about", type: "link" },
      { id: "nav-contact", label: "Contact", href: "/contact", type: "link" },
      {
        id: "nav-categories",
        label: "Categories",
        href: "/shop",
        type: "categories",
      },
    ],
  },
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
  footer: {
    brandLabel: "Nikeshop",
    description:
      "Premium sneakers, curated drops, and a cleaner shopping experience from browse to checkout.",
    copyrightText: "Nike Inc. All Rights Reserved",
    showCredit: false,
    links: [
      { id: "footer-about", label: "About", href: "/about", type: "link" },
      { id: "footer-contact", label: "Contact", href: "/contact", type: "link" },
      { id: "footer-shop", label: "Shop", href: "/shop", type: "link" },
      {
        id: "footer-arrivals",
        label: "New Arrivals",
        href: "/new-arrivals",
        type: "link",
      },
      { id: "footer-sale", label: "Sale", href: "/sale", type: "link" },
    ],
  },
  bestSellerSection: {
    enabled: true,
    title: "Best Sellers",
    description: "Most popular picks our shoppers keep coming back for.",
    productIds: ["nike-reactx", "air-force-one", "zoom-freak"],
    badgeText: "Popular",
  },
  newArrivalsHero: {
    eyebrow: "Freshly landed",
    title: "New Arrivals",
    highlightText: "",
    subtitle: "2026 Collection",
    description: "Fresh styles. Latest trends. Step into the new.",
    ctaLabel: "Shop now",
    sideLabel: "2026 Collection",
    imageUrl: "/images/nike-reactx.png",
    secondaryImageUrl: "/images/image-1.jpg",
  },
  newArrivalsSection: {
    enabled: true,
    title: "New Arrivals",
    description: "Latest drops with a crisp new-season energy.",
    productIds: ["air-force-one", "zoom-freak", "nike-reactx"],
    badgeText: "New",
  },
  saleHero: {
    eyebrow: "Biggest sale of the season",
    title: "Up to",
    highlightText: "50% off",
    subtitle: "On selected items",
    description: "Limited-time deals with bold value before the timer runs out.",
    ctaLabel: "Shop sale",
    sideLabel: "Limited time offer",
    imageUrl: "/images/nike-reactx.png",
    secondaryImageUrl: "",
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
  blog: {
    enabled: true,
    heroEyebrow: "Home / Blog",
    heroTitleStart: "Styling, Stories &",
    heroTitleAccent: "Sneaker",
    heroTitleEnd: "Culture",
    heroDescription:
      "Tips, trends, and inspiration to keep you stepping in style every day.",
    heroCtaLabel: "Explore Articles",
    heroImageUrl: "/images/nike-reactx.png",
    heroBadgeText: "Step into style every day",
    featuredHeading: "Featured Stories",
    categories: [
      {
        id: "all-articles",
        label: "All Articles",
        countLabel: "24 Posts",
        imageUrl: "/images/nike-reactx.png",
      },
      {
        id: "style-guide",
        label: "Style Guide",
        countLabel: "8 Posts",
        imageUrl: "/images/image-1.jpg",
      },
      {
        id: "sneaker-tips",
        label: "Sneaker Tips",
        countLabel: "10 Posts",
        imageUrl: "/images/image-2.jpg",
      },
      {
        id: "trends",
        label: "Trends",
        countLabel: "6 Posts",
        imageUrl: "/images/nike-just-do-it.jpg",
      },
      {
        id: "fitness",
        label: "Fitness",
        countLabel: "5 Posts",
        imageUrl: "/images/image-1.jpg",
      },
    ],
    featuredPosts: [
      {
        id: "style-every-occasion",
        tag: "Style Guide",
        title: "How to Style Sneakers for Every Occasion",
        excerpt:
          "From casual days to smart-casual nights, sneakers can do it all with the right pairing.",
        content:
          "Sneakers can move far beyond off-duty looks when you style them with intention. Clean pairs work especially well with sharp silhouettes, while chunkier runners bring energy to relaxed tailoring and everyday basics.",
        dateLabel: "May 20, 2026",
        readTime: "5 min read",
        imageUrl: "/images/image-1.jpg",
      },
      {
        id: "longer-life",
        tag: "Sneaker Tips",
        title: "5 Tips to Make Your Sneakers Last Longer",
        excerpt:
          "Simple care habits that keep your pairs looking cleaner, fresher, and sharper for longer.",
        content:
          "Rotate your pairs, clean them lightly after wear, and store them away from moisture. Small maintenance habits can stretch the life of your sneakers much further than most people expect.",
        dateLabel: "May 10, 2026",
        readTime: "4 min read",
        imageUrl: "/images/image-2.jpg",
      },
      {
        id: "spring-trends",
        tag: "Trends",
        title: "Top Shoe Trends for Spring 2026",
        excerpt:
          "Neutral palettes, chunkier soles, and everyday comfort silhouettes are leading the moment.",
        content:
          "This season leans toward understated color, comfort-led cushioning, and silhouettes that are versatile enough for daily wear. The strongest pairs feel expressive without becoming hard to style.",
        dateLabel: "Apr 28, 2026",
        readTime: "4 min read",
        imageUrl: "/images/nike-reactx.png",
      },
    ],
    explorePosts: [
      {
        id: "running-shoes",
        tag: "Fitness",
        title: "Choosing the Right Running Shoes",
        excerpt: "Find the pair that supports your stride, pace, and daily routine.",
        content:
          "Support, cushioning, and fit all matter when picking a running shoe. Start from how you run, not just how a pair looks on the shelf.",
        dateLabel: "Apr 15, 2026",
        readTime: "6 min read",
        imageUrl: "/images/nike-reactx.png",
      },
      {
        id: "streetwear-match",
        tag: "Style Guide",
        title: "Streetwear & Sneakers: The Perfect Match",
        excerpt: "Easy layering ideas that make your sneakers feel intentional.",
        content:
          "Streetwear works best when sneakers echo the shape, texture, or tone of the full outfit. Repetition and contrast are both useful if you keep them deliberate.",
        dateLabel: "Apr 8, 2026",
        readTime: "5 min read",
        imageUrl: "/images/nike-just-do-it.jpg",
      },
      {
        id: "spot-original",
        tag: "Sneaker Tips",
        title: "How to Spot Original Sneakers Online",
        excerpt: "A quick checklist before you buy your next pair online.",
        content:
          "Check seller reviews, compare product photos, verify box labels, and look for consistency across stitching, logos, and material quality before placing an order.",
        dateLabel: "Mar 30, 2026",
        readTime: "4 min read",
        imageUrl: "/images/image-2.jpg",
      },
      {
        id: "chunky-sneakers",
        tag: "Trends",
        title: "Chunky Sneakers Are Still In",
        excerpt: "Why comfort-forward shapes continue to dominate everyday rotation.",
        content:
          "Chunkier shapes remain relevant because they deliver comfort, presence, and easy styling with wide-leg denim, cargos, and relaxed tailoring.",
        dateLabel: "Mar 22, 2026",
        readTime: "4 min read",
        imageUrl: "/images/image-1.jpg",
      },
    ],
    trendingPosts: [
      {
        id: "clean-white",
        title: "How to Clean White Shoes at Home",
        dateLabel: "May 18, 2026",
        imageUrl: "/images/image-1.jpg",
      },
      {
        id: "walking-comfort",
        title: "Best Walking Shoes for Everyday Comfort",
        dateLabel: "May 12, 2026",
        imageUrl: "/images/nike-reactx.png",
      },
      {
        id: "color-match",
        title: "Sneaker Colors That Match Everything",
        dateLabel: "May 5, 2026",
        imageUrl: "/images/image-2.jpg",
      },
      {
        id: "replace-shoes",
        title: "How Often Should You Replace Your Shoes?",
        dateLabel: "Apr 20, 2026",
        imageUrl: "/images/nike-just-do-it.jpg",
      },
    ],
    newsletter: {
      title: "Stay in the Loop",
      description:
        "Get the latest tips, trends and exclusive offers straight to your inbox.",
      placeholder: "Your email address",
      buttonLabel: "Subscribe Now",
      imageUrl: "/images/image-1.jpg",
    },
    promises: [
      {
        id: "shipping",
        title: "Free Shipping",
        description: "On orders over $75",
      },
      {
        id: "returns",
        title: "Easy Returns",
        description: "30-day return policy",
      },
      {
        id: "payments",
        title: "Secure Payment",
        description: "100% secure checkout",
      },
      {
        id: "support",
        title: "24/7 Support",
        description: "We're here to help",
      },
    ],
  },
};

const mergeFeatureItems = (items: HomeSettings["whyChooseUsSection"]["items"]) =>
  defaultHomeSettings.whyChooseUsSection.items.map((defaultItem, index) => ({
    ...defaultItem,
    ...(items?.[index] ?? {}),
  }));

const mergeHeaderMenuItems = (
  items?: Partial<HomeSettings["header"]["menuItems"][number]>[] | null
) =>
  Array.isArray(items) && items.length > 0
    ? items.map((item, index) => ({
        ...defaultHomeSettings.header.menuItems[
          index % defaultHomeSettings.header.menuItems.length
        ],
        ...item,
        id:
          item.id ||
          `${String(item.label || "menu-item")
            .toLowerCase()
            .replace(/\s+/g, "-")}-${index}`,
      }))
    : defaultHomeSettings.header.menuItems;

const mergeBlogArray = <
  T extends { id: string }
>(
  defaults: T[],
  items?: Partial<T>[] | null
) =>
  Array.isArray(items) && items.length > 0
    ? defaults.map((defaultItem, index) => ({
        ...defaultItem,
        ...(items[index] ?? {}),
        id: items[index]?.id || defaultItem.id,
      }))
    : defaults;

const mergeBlogSettings = (
  settings?: Partial<BlogPageSettings> | null
): BlogPageSettings => ({
  ...defaultHomeSettings.blog,
  ...(settings ?? {}),
  categories: mergeBlogArray(defaultHomeSettings.blog.categories, settings?.categories),
  featuredPosts: mergeBlogArray(
    defaultHomeSettings.blog.featuredPosts,
    settings?.featuredPosts
  ),
  explorePosts: mergeBlogArray(
    defaultHomeSettings.blog.explorePosts,
    settings?.explorePosts
  ),
  trendingPosts: mergeBlogArray(
    defaultHomeSettings.blog.trendingPosts,
    settings?.trendingPosts
  ),
  newsletter: {
    ...defaultHomeSettings.blog.newsletter,
    ...(settings?.newsletter ?? {}),
  },
  promises: mergeBlogArray(defaultHomeSettings.blog.promises, settings?.promises),
});

export const mergeHomeSettings = (
  settings?: Partial<HomeSettings> | null
): HomeSettings => ({
  header: {
    ...defaultHomeSettings.header,
    ...(settings?.header ?? {}),
    menuItems: mergeHeaderMenuItems(settings?.header?.menuItems),
  },
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
  footer: {
    ...defaultHomeSettings.footer,
    ...(settings?.footer ?? {}),
    links:
      (settings?.footer?.links ?? []).length > 0
        ? (settings?.footer?.links ?? []).map((item, index) => ({
            ...defaultHomeSettings.footer.links[
              index % defaultHomeSettings.footer.links.length
            ],
            ...item,
            id:
              item.id ||
              `${String(item.label || "footer-link")
                .toLowerCase()
                .replace(/\s+/g, "-")}-${index}`,
            type: "link",
          }))
        : defaultHomeSettings.footer.links,
  },
  bestSellerSection: {
    ...defaultHomeSettings.bestSellerSection,
    ...(settings?.bestSellerSection ?? {}),
    productIds:
      settings?.bestSellerSection?.productIds ??
      defaultHomeSettings.bestSellerSection.productIds,
  },
  newArrivalsHero: {
    ...defaultHomeSettings.newArrivalsHero,
    ...(settings?.newArrivalsHero ?? {}),
  },
  newArrivalsSection: {
    ...defaultHomeSettings.newArrivalsSection,
    ...(settings?.newArrivalsSection ?? {}),
    productIds:
      settings?.newArrivalsSection?.productIds ??
      defaultHomeSettings.newArrivalsSection.productIds,
  },
  saleHero: {
    ...defaultHomeSettings.saleHero,
    ...(settings?.saleHero ?? {}),
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
  blog: mergeBlogSettings(settings?.blog),
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
