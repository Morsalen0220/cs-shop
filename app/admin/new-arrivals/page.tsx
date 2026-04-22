import getProducts from "@/actions/get-products";
import CollectionPageSettingsForm from "@/components/admin/collection-page-settings-form";
import PageHeading from "@/components/admin/page-heading";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const AdminNewArrivalsPage = async () => {
  const products = await getProducts({ includeArchived: true });

  return (
    <div className="space-y-8">
      <PageHeading
        title="New Arrivals Page"
        description="Edit the New Arrivals hero banner, images, text, and selected products."
        action={
          <Link
            className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white"
            href="/new-arrivals"
          >
            <ExternalLink className="h-4 w-4" />
            Preview page
          </Link>
        }
      />
      <CollectionPageSettingsForm products={products} variant="new-arrivals" />
    </div>
  );
};

export default AdminNewArrivalsPage;
