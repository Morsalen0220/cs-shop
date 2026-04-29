# CS Shop

CS Shop is a premium sneaker e-commerce storefront built with Next.js 13, TypeScript, Tailwind CSS, Zustand, and Supabase-ready APIs. The project includes both a customer-facing shopping experience and an admin control panel for managing products, content, and store settings.

## Main Features

### Storefront Features
- Modern homepage with hero slider, promo section, countdown offer, announcement bar, and featured merchandising blocks.
- Dedicated pages for `Shop`, `New Arrivals`, `Sale`, `Blog`, `About`, `Contact`, `Cart`, and `My Account`.
- Product browsing with category, color, size, brand, price, and search filters.
- Multiple product view modes for compact, grid, and list browsing.
- Product details page with image gallery, product info, and related product suggestions.
- Collection-focused landing experiences for sale and new-arrival campaigns.
- Mobile-friendly navigation with sticky/mobile bottom navigation support.
- Promo pill, announcement bar, and other customer-facing content controlled from settings.

### Shopping Experience
- Client-side cart powered by Zustand with local storage persistence.
- Add to cart, remove single item, and clear cart support.
- Duplicate cart protection with toast feedback.
- Promo code support in cart summary.
- Discount calculation for percentage and fixed promo codes.
- Checkout request flow connected to external API endpoint through `NEXT_PUBLIC_API_URL`.
- Payment success/cancel feedback using URL search params and toast notifications.
- Quick product preview modal for faster shopping.

### Product & Catalog Features
- Product catalog connected through reusable actions and API routes.
- Category-based product organization.
- Product variations through size and color models.
- Featured and archived product handling.
- Dynamic related products section on product details page.
- Reusable product cards, lists, and gallery components.

### Blog & Content Features
- Blog landing page with paginated articles.
- Individual blog detail page using slug-based routing.
- Featured stories, trending posts, category highlights, and editorial sections.
- Blog newsletter section and trust/promise content blocks.
- Mock/default editorial content available through home settings for easy customization.

### Admin Panel Features
- Dedicated admin dashboard with revenue, sales, stock, and featured-product insights.
- Product management pages for listing, creating, and editing products.
- Category, color, size, and billboard management pages.
- Blog management pages for creating, editing, and publishing blog posts.
- Website control workspace for editing homepage, sale page, new arrivals page, and blog page content.
- Header, footer, promo section, newsletter, hero slider, and Why Choose Us settings management.
- Promo code configuration from admin-managed website settings.
- Orders page and settings page for store operations.
- Store creation flow and admin layout/navigation.

### API & Data Layer
- Route handlers for products, categories, colors, sizes, billboards, and blogs.
- Separate admin API routes for create/update management flows.
- Upload API route for admin media handling.
- Supabase-ready configuration in the project structure.
- Reusable client actions for fetching products, product details, blogs, categories, colors, sizes, and billboards.

### UI & UX Highlights
- Built with Next.js App Router.
- Loading states for key storefront and admin pages.
- Toast notifications for cart and promo interactions.
- Theme provider and theme toggle support.
- Local custom font usage for branded visual presentation.
- Responsive layout across desktop and mobile screens.

## Routes Included

### Customer Routes
- `/`
- `/shop`
- `/new-arrivals`
- `/sale`
- `/category/[categoryId]`
- `/product/[productId]`
- `/blog`
- `/blog/[slug]`
- `/cart`
- `/about`
- `/contact`
- `/my-account`

### Admin Routes
- `/admin`
- `/admin/create-store`
- `/admin/products`
- `/admin/categories`
- `/admin/colors`
- `/admin/sizes`
- `/admin/billboards`
- `/admin/blogs`
- `/admin/orders`
- `/admin/settings`
- `/admin/header`
- `/admin/footer`
- `/admin/website`
- `/admin/new-arrivals`
- `/admin/sale`

## Tech Stack

- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- Zustand
- Axios
- Supabase JS
- Headless UI
- Lucide React
- React Hot Toast

## Run Locally

```bash
npm install
npm run dev
```

Set the required environment variables in `.env`, especially the public API base URL used by checkout and data requests.
