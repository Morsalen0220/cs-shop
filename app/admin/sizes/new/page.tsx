import PageHeading from "@/components/admin/page-heading";
import SimpleAdminForm from "@/components/admin/simple-admin-form";

const NewSizePage = () => {
  return (
    <div className="space-y-8">
      <PageHeading title="Create a size" description="Add a new size" />
      <SimpleAdminForm kind="size" />
    </div>
  );
};

export default NewSizePage;
