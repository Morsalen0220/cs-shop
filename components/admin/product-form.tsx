"use client";

import type { Category, Color, Size } from "@/types";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

interface ProductFormProps {
  categories: Category[];
  colors: Color[];
  sizes: Size[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  colors,
  sizes,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const uploadFile = async (file: File) => {
    const uploadData = new FormData();
    uploadData.append("file", file);

    const response = await fetch("/api/demo-store/admin/upload", {
      method: "POST",
      body: uploadData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.url as string;
  };

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setLoading(true);

    try {
      const url = await uploadFile(file);
      setImageUrl(url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      categoryId: formData.get("categoryId"),
      sizeId: formData.get("sizeId"),
      colorId: formData.get("colorId"),
      imageUrl: imageUrl || formData.get("imageUrl") || "/images/nike-reactx.png",
      isArchived: formData.get("isArchived") === "on",
      isFeatured: formData.get("isFeatured") === "on",
    };

    const response = await fetch("/api/demo-store/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error || "Product was not saved");
      return;
    }

    toast.success("Product created");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="text-sm font-medium" htmlFor="name">
            Product Name
          </label>
          <input
            required
            id="name"
            name="name"
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="Nike Air Max Portal"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="description">
            Product Description
          </label>
          <input
            required
            id="description"
            name="description"
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="Product description"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="price">
            Price (NGN)
          </label>
          <input
            required
            id="price"
            name="price"
            type="number"
            min="0"
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="categoryId">
            Category
          </label>
          <select
            required
            id="categoryId"
            name="categoryId"
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="sizeId">
            Size
          </label>
          <select
            required
            id="sizeId"
            name="sizeId"
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">Select size</option>
            {sizes.map((size) => (
              <option key={size.id} value={size.id}>
                {size.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="colorId">
            Color
          </label>
          <select
            required
            id="colorId"
            name="colorId"
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">Select color</option>
            {colors.map((color) => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="imageUrl">
          Product image
        </label>
        <input
          id="imageFile"
          type="file"
          accept="image/*"
          onChange={onImageChange}
          className="mt-2 block w-full max-w-xl text-sm"
        />
        <input
          id="imageUrl"
          name="imageUrl"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          className="mt-2 h-11 w-full max-w-xl rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="Upload image or paste /images/nike-reactx.png"
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex gap-4 rounded-md border p-4">
          <input name="isFeatured" type="checkbox" className="mt-1 h-4 w-4" />
          <span>
            <span className="block text-sm font-medium">Featured</span>
            <span className="text-sm text-gray-500">
              This product will appear on the homepage.
            </span>
          </span>
        </label>
        <label className="flex gap-4 rounded-md border p-4">
          <input name="isArchived" type="checkbox" className="mt-1 h-4 w-4" />
          <span>
            <span className="block text-sm font-medium">Archived</span>
            <span className="text-sm text-gray-500">
              This product will not appear anywhere in the store.
            </span>
          </span>
        </label>
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-md border px-5 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type="submit"
          className="rounded-md bg-gray-950 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
