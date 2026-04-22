import getProducts from "@/actions/get-products";
import AdminListPage from "@/components/admin/admin-list-page";
import Link from "next/link";

export const revalidate = 0;

const ProductsPage = async () => {
  const products = await getProducts({ includeArchived: true });

  return (
    <AdminListPage
      title={`Products (${products.length})`}
      description="Manage your store Products"
      addHref="/admin/products/new"
      columns={[
        "Name",
        "Price",
        "Category",
        "Size",
        "Color",
        "Archived",
        "Featured",
        "Placement",
        "Date",
        "Manage",
      ]}
      rows={products.map((product) => [
        product.name,
        `NGN ${Number(product.price).toLocaleString()}.00`,
        product.category.name,
        product.size.name,
        <span key={product.id} className="inline-flex items-center gap-3">
          {product.color.value}
          <span
            className="h-5 w-5 rounded-full border"
            style={{ backgroundColor: product.color.value }}
          />
        </span>,
        String(Boolean(product.isArchived)),
        String(Boolean(product.isFeatured)),
        <span
          key={`${product.id}-placement`}
          className="rounded-full bg-[#f4ded1] px-3 py-1 text-xs font-semibold text-[#8a5a44]"
        >
          Edit in product
        </span>,
        "Today",
        <Link
          key={`${product.id}-edit`}
          className="font-semibold text-[#111111] underline underline-offset-4"
          href={`/admin/products/${product.id}`}
        >
          Edit
        </Link>,
      ])}
    />
  );
};

export default ProductsPage;
