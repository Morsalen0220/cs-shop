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

export interface HeaderMenuItem {
  id: string;
  label: string;
  href: string;
  type: "link" | "categories";
}

export interface HeaderSettings {
  brandLabel: string;
  tagline: string;
  menuItems: HeaderMenuItem[];
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

export interface CollectionHeroSettings {
  eyebrow: string;
  title: string;
  highlightText: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  sideLabel: string;
  imageUrl: string;
  secondaryImageUrl: string;
}

export interface WhyChooseUsSettings {
  enabled: boolean;
  title: string;
  description: string;
  items: HomeFeatureItem[];
}

export interface BlogCategoryItem {
  id: string;
  label: string;
  countLabel: string;
  imageUrl: string;
}

export interface BlogArticleItem {
  id: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string;
  dateLabel: string;
  readTime: string;
  imageUrl: string;
}

export interface BlogTrendingItem {
  id: string;
  title: string;
  dateLabel: string;
  imageUrl: string;
}

export interface BlogNewsletterSettings {
  title: string;
  description: string;
  placeholder: string;
  buttonLabel: string;
  imageUrl: string;
}

export interface BlogPromiseItem {
  id: string;
  title: string;
  description: string;
}

export interface BlogPageSettings {
  enabled: boolean;
  heroEyebrow: string;
  heroTitleStart: string;
  heroTitleAccent: string;
  heroTitleEnd: string;
  heroDescription: string;
  heroCtaLabel: string;
  heroImageUrl: string;
  heroBadgeText: string;
  featuredHeading: string;
  categories: BlogCategoryItem[];
  featuredPosts: BlogArticleItem[];
  explorePosts: BlogArticleItem[];
  trendingPosts: BlogTrendingItem[];
  newsletter: BlogNewsletterSettings;
  promises: BlogPromiseItem[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImageUrl: string;
  readTime: string;
  isPublished: boolean;
  createdAt: string;
}

export interface BlogPostListResponse {
  posts: BlogPost[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalPosts: number;
}

export interface HomeSettings {
  header: HeaderSettings;
  announcementBar: AnnouncementBarSettings;
  navbarPromo: NavbarPromoSettings;
  promoCodes: PromoCodeSettings[];
  promoSection: PromoSectionSettings;
  heroSlider: HeroSliderSettings;
  newsletterSection: NewsletterSectionSettings;
  bestSellerSection: ProductSectionSettings;
  newArrivalsHero: CollectionHeroSettings;
  newArrivalsSection: ProductSectionSettings;
  saleHero: CollectionHeroSettings;
  flashSaleSection: ProductSectionSettings;
  whyChooseUsSection: WhyChooseUsSettings;
  blog: BlogPageSettings;
}
