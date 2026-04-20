"use client";

import AdminEditForm, { FormField } from "@/components/admin/admin-edit-form";
import PageHeading from "@/components/admin/page-heading";
import getSize from "@/actions/get-size";
import { useEffect, useState } from "react";

const SizeEditPage = ({ params }: { params: { sizeId: string } }) => {
  const [size, setSize] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSize = async () => {
      try {
        const sizeData = await getSize(params.sizeId);
        setSize(sizeData);
      } catch (error) {
        console.error("Error loading size:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSize();
  }, [params.sizeId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!size) {
    return <div>Size not found</div>;
  }

  const fields: FormField[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "value", label: "Value", type: "text", required: true },
  ];

  return (
    <div className="space-y-8">
      <PageHeading
        title="Edit Size"
        description={`Editing: ${size.name}`}
        backHref="/admin/sizes"
      />
      <AdminEditForm
        endpoint="/api/demo-store/admin/sizes"
        fields={fields}
        initialData={size}
        redirectPath="/admin/sizes"
      />
    </div>
  );
};

export default SizeEditPage;
