"use client";

import AdminEditForm, { FormField } from "@/components/admin/admin-edit-form";
import PageHeading from "@/components/admin/page-heading";
import getBillboards from "@/actions/get-billboards";
import getCategory from "@/actions/get-category";
import { useEffect, useState } from "react";

const CategoryEditPage = ({ params }: { params: { categoryId: string } }) => {
  const [category, setCategory] = useState<any>(null);
  const [billboards, setBillboards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryData, billboardsData] = await Promise.all([
          getCategory(params.categoryId),
          getBillboards()
        ]);
        
        setCategory(categoryData);
        setBillboards(billboardsData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.categoryId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900" />
      </div>
    );
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  const fields: FormField[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { 
      name: "billboardId", 
      label: "Billboard", 
      type: "select", 
      required: true,
      options: billboards.map(b => ({ label: b.label, value: b.id }))
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeading
        title="Edit Category"
        description={`Editing: ${category.name}`}
        backHref="/admin/categories"
      />
      <AdminEditForm
        endpoint="/api/demo-store/admin/categories"
        fields={fields}
        initialData={{
          ...category,
          billboardId: category.billboard.id
        }}
        redirectPath="/admin/categories"
      />
    </div>
  );
};

export default CategoryEditPage;
