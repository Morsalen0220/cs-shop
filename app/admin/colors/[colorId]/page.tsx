"use client";

import AdminEditForm, { FormField } from "@/components/admin/admin-edit-form";
import PageHeading from "@/components/admin/page-heading";
import getColor from "@/actions/get-color";
import { useEffect, useState } from "react";

const ColorEditPage = ({ params }: { params: { colorId: string } }) => {
  const [color, setColor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const colorData = await getColor(params.colorId);
        setColor(colorData);
      } catch (error) {
        console.error("Error loading color:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColor();
  }, [params.colorId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!color) {
    return <div>Color not found</div>;
  }

  const fields: FormField[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "value", label: "Value", type: "color", required: true },
  ];

  return (
    <div className="space-y-8">
      <PageHeading
        title="Edit Color"
        description={`Editing: ${color.name}`}
        backHref="/admin/colors"
      />
      <AdminEditForm
        endpoint="/api/demo-store/admin/colors"
        fields={fields}
        initialData={color}
        redirectPath="/admin/colors"
      />
    </div>
  );
};

export default ColorEditPage;
