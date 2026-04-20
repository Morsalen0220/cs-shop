import getBillboards from "@/actions/get-billboards";
import PageHeading from "@/components/admin/page-heading";
import SimpleAdminForm from "@/components/admin/simple-admin-form";

export const revalidate = 0;

const NewCategoryPage = async () => {
  const billboards = await getBillboards();

  return (
    <div className="space-y-8">
      <PageHeading title="Create a category" description="Add a new category" />
      <SimpleAdminForm billboards={billboards} kind="category" />
    </div>
  );
};

export default NewCategoryPage;
