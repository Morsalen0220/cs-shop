import getProducts from "@/actions/get-products";
import StatCard from "@/components/admin/stat-card";
import PageHeading from "@/components/admin/page-heading";
import { CreditCard, Package, ShoppingBag } from "lucide-react";

export const revalidate = 0;

const AdminPage = async () => {
  const products = await getProducts({});
  const totalRevenue = products.reduce(
    (total, product) => total + Number(product.price || 0),
    0
  );

  return (
    <div className="space-y-8">
      <PageHeading title="Dashboard" description="Overview of your store" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Revenue"
          value={`₦${totalRevenue.toLocaleString()}.00`}
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
      <section className="rounded-md border bg-white p-6">
        <h2 className="text-2xl font-bold">Overview</h2>
        <div className="mt-6 flex h-72 items-end gap-8 overflow-hidden border-b border-l px-8">
          {[45, 72, 34, 88, 58, 96].map((height, index) => (
            <div
              key={index}
              className="w-16 rounded-t-md bg-sky-500"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
