export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
}

export interface Image {
  id: string;
  url: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface Product {
  id: string;
  category: Category;
  description: string;
  isArchived?: boolean;
  isFeatured?: boolean;
  name: string;
  price: string;
  size: Size;
  color: Color;
  images: Image[];
}

export interface HomeFeatureItem {
  title: string;
  description: string;
}

export interface AnnouncementBarSettings {
  enabled: boolean;
  primaryText: string;
  secondaryText: string;
}

export interface NavbarPromoSettings {
  enabled: boolean;
  text: string;
}

export interface PromoCodeSettings {
  id: string;
  code: string;
  label: string;
  value: number;
  type: "percentage" | "fixed";
  enabled: boolean;
}

export interface PromoSectionSettings {
  enabled: boolean;
  badgeText: string;
  title: string;
  description: string;
  discountText: string;
  ctaLabel: string;
  countdownEnabled: boolean;
  countdownTarget: string;
}

export interface HeroSliderSettings {
  enabled: boolean;
  eyebrow: string;
  title: string;
  spotlightLabel: string;
  spotlightText: string;
  ctaLabel: string;
  autoplay: boolean;
}

export interface NewsletterSectionSettings {
  enabled: boolean;
  title: string;
  description: string;
  placeholder: string;
  buttonLabel: string;
}

export interface ProductSectionSettings {
  enabled: boolean;
  title: string;
  description: string;
  productIds: string[];
  badgeText: string;
}

export interface WhyChooseUsSettings {
  enabled: boolean;
  title: string;
  description: string;
  items: HomeFeatureItem[];
}

export interface HomeSettings {
  announcementBar: AnnouncementBarSettings;
  navbarPromo: NavbarPromoSettings;
  promoCodes: PromoCodeSettings[];
  promoSection: PromoSectionSettings;
  heroSlider: HeroSliderSettings;
  newsletterSection: NewsletterSectionSettings;
  bestSellerSection: ProductSectionSettings;
  newArrivalsSection: ProductSectionSettings;
  flashSaleSection: ProductSectionSettings;
  whyChooseUsSection: WhyChooseUsSettings;
}
