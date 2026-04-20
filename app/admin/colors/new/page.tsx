import PageHeading from "@/components/admin/page-heading";
import SimpleAdminForm from "@/components/admin/simple-admin-form";

const NewColorPage = () => {
  return (
    <div className="space-y-8">
      <PageHeading title="Create a color" description="Add a new color" />
      <SimpleAdminForm kind="color" />
    </div>
  );
};

export default NewColorPage;
