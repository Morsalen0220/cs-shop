import PageHeading from "@/components/admin/page-heading";

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <PageHeading title="Settings" description="Manage store preferences" />
      <div className="max-w-xl rounded-md border p-6">
        <label className="text-sm font-medium" htmlFor="store-name">
          Store name
        </label>
        <input
          id="store-name"
          className="mt-2 h-10 w-full rounded-md border px-3 text-sm"
          defaultValue="Nike"
        />
      </div>
    </div>
  );
};

export default SettingsPage;
