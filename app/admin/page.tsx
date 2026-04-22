import getProducts from "@/actions/get-products";
import PageHeading from "@/components/admin/page-heading";
import SalesChart from "@/components/admin/sales-chart";
import StatCard from "@/components/admin/stat-card";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export const revalidate = 0;

const AdminPage = async () => {
  const products = await getProducts({ includeArchived: true });
  const totalRevenue = products.reduce(
    (total, product) => total + Number(product.price || 0),
    0
  );
  const featuredProducts = products.filter((product) => product.isFeatured).length;
  const activeProducts = products.filter((product) => !product.isArchived).length;

  return (
    <div className="space-y-8">
      <PageHeading
        title="Dashboard"
        description="A premium control center for your Nike storefront, content studio, and inventory."
      />

      <section className="overflow-hidden rounded-[34px] border border-black/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,90,31,0.18),_transparent_34%),linear-gradient(135deg,_#111111_0%,_#1f2937_55%,_#0f172a_100%)] p-6 text-white shadow-[0_28px_80px_rgba(17,17,17,0.18)] sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr] xl:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em]">
              <Sparkles className="h-4 w-4" />
              Admin Studio
            </div>
            <div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
                Manage your store from one dashboard.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
                Update content, products, and store settings quickly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/website"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#111111]"
              >
                Open Nikeshop
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin/products"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white"
              >
                Manage Products
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Featured products", value: String(featuredProducts), icon: TrendingUp },
              { label: "Live products", value: String(activeProducts), icon: Package },
              { label: "Content sections", value: "9", icon: LayoutDashboard },
              { label: "Store status", value: "Online", icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/65">{item.label}</p>
                    <Icon className="h-4 w-4 text-white/55" />
                  </div>
                  <p className="mt-5 text-3xl font-semibold">{item.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatCard
          label="Sales"
          value={`+${Math.max(products.length * 8, 1)}`}
          icon={<ShoppingBag className="h-4 w-4" />}
        />
        <StatCard
          label="Products In Stock"
          value={String(products.length)}
          icon={<Package className="h-4 w-4" />}
        />
      </div>

      <div>
        <section className="rounded-[30px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.05)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-400">
                Sales Overview
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#111111]">
                Sales trend overview
              </h2>
            </div>
            <div className="rounded-full bg-[#fff3ed] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#ff5a1f]">
              15 min refresh
            </div>
          </div>
          <SalesChart initialProducts={products} />
        </section>
      </div>
    </div>
  );
};

export default AdminPage;
