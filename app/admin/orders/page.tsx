import AdminListPage from "@/components/admin/admin-list-page";

const OrdersPage = () => {
  return (
    <AdminListPage
      title="Orders (0)"
      description="Manage your store orders"
      columns={["Customer", "Products", "Total", "Paid", "Date"]}
      rows={[]}
    />
  );
};

export default OrdersPage;
