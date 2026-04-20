"use client";

import getCategories from "@/actions/get-categories";
import AdminListPage from "@/components/admin/admin-list-page";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export const revalidate = 0;

const CategoriesPage = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  
  const loadCategories = useCallback(async () => {
    const data = await getCategories();
    setCategories(data);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleEdit = useCallback((categoryId: string) => {
    router.push(`/admin/categories/${categoryId}`);
  }, [router]);

  const handleDelete = useCallback(async (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await fetch(`/api/demo-store/admin/categories?id=${categoryId}`, {
          method: "DELETE",
        });
        
        if (response.ok) {
          loadCategories();
        } else {
          alert("Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category");
      }
    }
  }, [loadCategories]);

  return (
    <AdminListPage
      title={`Categories`}
      description="Manage your store categories"
      addHref="/admin/categories/new"
      columns={["Name", "Billboard", "Date"]}
      rows={categories.map((category) => [
        category.name,
        category.billboard.label,
        "Today",
      ])}
      onEdit={(rowIndex) => {
        if (rowIndex < categories.length) {
          handleEdit(categories[rowIndex].id);
        }
      }}
      onDelete={(rowIndex) => {
        if (rowIndex < categories.length) {
          handleDelete(categories[rowIndex].id);
        }
      }}
    />
  );
};

export default CategoriesPage;
