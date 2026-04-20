import getCategories from "@/actions/get-categories";
import AdminListPage from "@/components/admin/admin-list-page";

export const revalidate = 0;

const CategoriesPage = async () => {
  const categories = await getCategories();

  return (
    <AdminListPage
      title={`Categories (${categories.length})`}
      description="Manage your store categories"
      addHref="/admin/categories/new"
      columns={["Name", "Billboard", "Date"]}
      rows={categories.map((category) => [
        category.name,
        category.billboard.label,
        "Today",
      ])}
    />
  );
};

export default CategoriesPage;
