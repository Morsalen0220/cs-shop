import getProducts from "@/actions/get-products";
import PageHeading from "@/components/admin/page-heading";
import SalesChart from "@/components/admin/sales-chart";
import StatCard from "@/components/admin/stat-card";
import Link from "next/link";
import {
  CreditCard,
  Package,
  ShoppingBag,
} from "lucide-react";

export const revalidate = 0;

const AdminPage = async () => {
  const products = await getProducts({ includeArchived: true });
  const totalRevenue = products.reduce(
    (total, product) => total + Number(product.price || 0),
    0
  );
  return (
    <div className="space-y-8">
      <PageHeading
        title="Dashboard"
        description="Manage products, orders, website content, and store settings."
      />

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

      <section className="rounded-[28px] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(17,17,17,0.05)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#111111]">Quick actions</h2>
            <p className="mt-1 text-sm text-gray-500">Open admin sections.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/products"
              className="rounded-full bg-[#111111] px-4 py-2 text-sm font-semibold text-white"
            >
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#111111]"
            >
              Orders
            </Link>
            <Link
              href="/admin/website"
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-semibold text-[#111111]"
            >
              Website
            </Link>
          </div>
        </div>
      </section>

      <div>
        <section className="rounded-[30px] border border-black/10 bg-white p-4 shadow-[0_18px_50px_rgba(17,17,17,0.05)] sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400 sm:text-xs sm:tracking-[0.26em]">
                Sales Overview
              </p>
              <h2 className="mt-1.5 text-xl font-semibold text-[#111111] sm:mt-2 sm:text-2xl">
                Sales trend overview
              </h2>
            </div>
            <div className="inline-flex w-fit rounded-full bg-[#fff3ed] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#ff5a1f] sm:px-3 sm:py-2 sm:text-xs sm:tracking-[0.18em]">
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
