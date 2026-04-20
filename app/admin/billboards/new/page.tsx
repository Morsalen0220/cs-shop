import PageHeading from "@/components/admin/page-heading";
import SimpleAdminForm from "@/components/admin/simple-admin-form";

const NewBillboardPage = () => {
  return (
    <div className="space-y-8">
      <PageHeading title="Create a billboard" description="Add a new billboard" />
      <SimpleAdminForm kind="billboard" />
    </div>
  );
};

export default NewBillboardPage;
