import getSizes from "@/actions/get-sizes";
import AdminListPage from "@/components/admin/admin-list-page";

export const revalidate = 0;

const SizesPage = async () => {
  const sizes = await getSizes();

  return (
    <AdminListPage
      title={`Sizes (${sizes.length})`}
      description="Manage your store size preferences"
      addHref="/admin/sizes/new"
      columns={["Name", "Value", "Date"]}
      rows={sizes.map((size) => [size.name, size.value, "Today"])}
    />
  );
};

export default SizesPage;
