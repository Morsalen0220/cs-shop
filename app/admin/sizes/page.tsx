"use client";

import getSizes from "@/actions/get-sizes";
import AdminListPage from "@/components/admin/admin-list-page";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export const revalidate = 0;

const SizesPage = () => {
  const router = useRouter();
  const [sizes, setSizes] = useState<any[]>([]);
  
  const loadSizes = useCallback(async () => {
    const data = await getSizes();
    setSizes(data);
  }, []);

  useEffect(() => {
    loadSizes();
  }, [loadSizes]);

  const handleEdit = useCallback((sizeId: string) => {
    router.push(`/admin/sizes/${sizeId}`);
  }, [router]);

  const handleDelete = useCallback(async (sizeId: string) => {
    if (confirm("Are you sure you want to delete this size?")) {
      try {
        const response = await fetch(`/api/demo-store/admin/sizes?id=${sizeId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          loadSizes();
        } else {
          alert("Failed to delete size");
        }
      } catch (error) {
        console.error("Error deleting size:", error);
        alert("Error deleting size");
      }
    }
  }, [loadSizes]);

  return (
    <AdminListPage
      title={`Sizes`}
      description="Manage your store size preferences"
      addHref="/admin/sizes/new"
      columns={["Name", "Value", "Date"]}
      rows={sizes.map((size) => [size.name, size.value, "Today"])}
      onEdit={(rowIndex) => {
        if (rowIndex < sizes.length) {
          handleEdit(sizes[rowIndex].id);
        }
      }}
      onDelete={(rowIndex) => {
        if (rowIndex < sizes.length) {
          handleDelete(sizes[rowIndex].id);
        }
      }}
    />
  );
};

export default SizesPage;
