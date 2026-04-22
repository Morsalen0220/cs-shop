import HeaderSettingsForm from "@/components/admin/header-settings-form";
import PageHeading from "@/components/admin/page-heading";

const HeaderPage = () => {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Header"
        description="Edit the storefront logo name, tagline, and navigation menu from this dedicated workspace."
      />
      <HeaderSettingsForm />
    </div>
  );
};

export default HeaderPage;
