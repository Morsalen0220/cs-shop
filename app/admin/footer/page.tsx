import FooterSettingsForm from "@/components/admin/footer-settings-form";
import PageHeading from "@/components/admin/page-heading";

const FooterPage = () => {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Footer"
        description="Edit footer brand text, description, copyright, and quick links from a dedicated workspace."
      />
      <FooterSettingsForm />
    </div>
  );
};

export default FooterPage;
