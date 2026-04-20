import getBillboards from "@/actions/get-billboards";
import AdminListPage from "@/components/admin/admin-list-page";

export const revalidate = 0;

const BillboardsPage = async () => {
  const billboards = await getBillboards();

  return (
    <AdminListPage
      title={`Billboards (${billboards.length})`}
      description="Manage your store billboards"
      addHref="/admin/billboards/new"
      columns={["Label", "Image", "Date"]}
      rows={billboards.map((billboard) => [
        billboard.label,
        billboard.imageUrl,
        "Today",
      ])}
    />
  );
};

export default BillboardsPage;
