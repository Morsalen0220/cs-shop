import getColors from "@/actions/get-colors";
import AdminListPage from "@/components/admin/admin-list-page";

export const revalidate = 0;

const ColorsPage = async () => {
  const colors = await getColors();

  return (
    <AdminListPage
      title={`Colors (${colors.length})`}
      description="Manage your store color preferences"
      addHref="/admin/colors/new"
      columns={["Name", "Value", "Date"]}
      rows={colors.map((color) => [
        color.name,
        <span key={color.id} className="inline-flex items-center gap-3">
          {color.value}
          <span
            className="h-5 w-5 rounded-full border"
            style={{ backgroundColor: color.value }}
          />
        </span>,
        "Today",
      ])}
    />
  );
};

export default ColorsPage;
