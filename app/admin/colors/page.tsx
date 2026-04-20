"use client";

import getColors from "@/actions/get-colors";
import AdminListPage from "@/components/admin/admin-list-page";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export const revalidate = 0;

const ColorsPage = () => {
  const router = useRouter();
  const [colors, setColors] = useState<any[]>([]);
  
  const loadColors = useCallback(async () => {
    const data = await getColors();
    setColors(data);
  }, []);

  useEffect(() => {
    loadColors();
  }, [loadColors]);

  const handleEdit = useCallback((colorId: string) => {
    router.push(`/admin/colors/${colorId}`);
  }, [router]);

  const handleDelete = useCallback(async (colorId: string) => {
    if (confirm("Are you sure you want to delete this color?")) {
      try {
        const response = await fetch(`/api/demo-store/admin/colors?id=${colorId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          loadColors();
        } else {
          alert("Failed to delete color");
        }
      } catch (error) {
        console.error("Error deleting color:", error);
        alert("Error deleting color");
      }
    }
  }, [loadColors]);

  return (
    <AdminListPage
      title={`Colors`}
      description="Manage your store color preferences"
      addHref="/admin/colors/new"
      columns={["Name", "Value", "Date"]}
      rows={colors.map((color) => [
        color.name,
        <span key={color.id} className="inline-flex items-center gap-3">
          {color.value}
          <span
            className="h-5 w-5 rounded-full border"
            style={{ backgroundColor: color.value }}
          />
        </span>,
        "Today",
      ])}
      onEdit={(rowIndex) => {
        if (rowIndex < colors.length) {
          handleEdit(colors[rowIndex].id);
        }
      }}
      onDelete={(rowIndex) => {
        if (rowIndex < colors.length) {
          handleDelete(colors[rowIndex].id);
        }
      }}
    />
  );
};

export default ColorsPage;
