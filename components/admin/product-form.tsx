"use client";

import {
  readHomeSettings,
  saveHomeSettings,
} from "@/lib/home-settings";
import type { Category, Color, Product, Size } from "@/types";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProductFormProps {
  categories: Category[];
  colors: Color[];
  product?: Product | null;
  sizes: Size[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  colors,
  product,
  sizes,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(() =>
    Array.from({ length: 3 }, (_, index) => product?.images?.[index]?.url ?? "")
  );
  const [showInHighlights, setShowInHighlights] = useState(false);
  const [showInNewArrivals, setShowInNewArrivals] = useState(false);
  const [showInLimitedDeals, setShowInLimitedDeals] = useState(false);
  const isEditing = Boolean(product);

  useEffect(() => {
    if (!product) {
      return;
    }

    const settings = readHomeSettings();
    setImageUrls(
      Array.from({ length: 3 }, (_, index) => product.images?.[index]?.url ?? "")
    );
    setShowInHighlights(settings.bestSellerSection.productIds.includes(product.id));
    setShowInNewArrivals(
      settings.newArrivalsSection.productIds.includes(product.id)
    );
    setShowInLimitedDeals(settings.flashSaleSection.productIds.includes(product.id));
  }, [product]);

  const createProductId = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const addProductToSection = (productIds: string[], productId: string) => {
    if (productIds.includes(productId)) {
      return productIds;
    }

    return [productId, ...productIds];
  };

  const syncProductPlacement = (productId: string) => {
    const settings = readHomeSettings();
    const updateProductIds = (productIds: string[], shouldInclude: boolean) => {
      if (shouldInclude) {
        return addProductToSection(productIds, productId);
      }

      return productIds.filter((id) => id !== productId);
    };

    const nextSettings = {
      ...settings,
      bestSellerSection: {
        ...settings.bestSellerSection,
        productIds: updateProductIds(
          settings.bestSellerSection.productIds,
          showInHighlights
        ),
      },
      newArrivalsSection: {
        ...settings.newArrivalsSection,
        productIds: updateProductIds(
          settings.newArrivalsSection.productIds,
          showInNewArrivals
        ),
      },
      flashSaleSection: {
        ...settings.flashSaleSection,
        productIds: updateProductIds(
          settings.flashSaleSection.productIds,
          showInLimitedDeals
        ),
      },
    };

    saveHomeSettings(nextSettings);
  };

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

  const updateImageUrl = (index: number, value: string) => {
    setImageUrls((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item))
    );
  };

  const onImageChange = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setLoading(true);

    try {
      const url = await uploadFile(file);
      updateImageUrl(index, url);
      toast.success(`Image ${index + 1} uploaded`);
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
    const fallbackProductId = createProductId(String(formData.get("name") || ""));
    const normalizedImageUrls = imageUrls
      .map((url) => url.trim())
      .filter(Boolean)
      .slice(0, 3);
    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: formData.get("price"),
      categoryId: formData.get("categoryId"),
      sizeId: formData.get("sizeId"),
      colorId: formData.get("colorId"),
      imageUrls:
        normalizedImageUrls.length > 0
          ? normalizedImageUrls
          : ["/images/nike-reactx.png"],
      isArchived: formData.get("isArchived") === "on",
      isFeatured: formData.get("isFeatured") === "on",
    };

    const response = await fetch(
      isEditing
        ? `/api/demo-store/admin/products/${product?.id}`
        : "/api/demo-store/admin/products",
      {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      }
    );

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error || "Product was not saved");
      return;
    }

    const data = await response.json().catch(() => null);
    const savedProductId = String(data?.id || product?.id || fallbackProductId);

    if (savedProductId) {
      syncProductPlacement(savedProductId);
    }

    toast.success(isEditing ? "Product updated" : "Product created");
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
            defaultValue={product?.name}
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
            defaultValue={product?.description}
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
            defaultValue={product?.price}
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
            defaultValue={product?.category?.id ?? ""}
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
            defaultValue={product?.size?.id ?? ""}
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
            defaultValue={product?.color?.id ?? ""}
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
        <label className="text-sm font-medium">Product images</label>
        <p className="mt-1 text-sm text-gray-500">
          Up to 3 images add korte parbe. First image ta listing cover hisebe use hobe.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {imageUrls.map((imageUrl, index) => (
            <div className="rounded-xl border p-4" key={index}>
              <p className="text-sm font-medium text-[#111111]">
                Image {index + 1}
              </p>
              <input
                id={`imageFile-${index}`}
                type="file"
                accept="image/*"
                onChange={(event) => onImageChange(index, event)}
                className="mt-3 block w-full text-sm"
              />
              <input
                id={`imageUrl-${index}`}
                name={`imageUrl-${index}`}
                value={imageUrl}
                onChange={(event) => updateImageUrl(index, event.target.value)}
                className="mt-3 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Upload image or paste /images/nike-reactx.png"
              />
              <div className="mt-3 overflow-hidden rounded-lg border bg-[#f7f7f7]">
                {imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={`Preview ${index + 1}`}
                    className="h-40 w-full object-cover"
                    src={imageUrl}
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-sm text-gray-400">
                    No image selected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <label className="flex gap-4 rounded-md border p-4">
          <input
            defaultChecked={Boolean(product?.isFeatured)}
            name="isFeatured"
            type="checkbox"
            className="mt-1 h-4 w-4"
          />
          <span>
            <span className="block text-sm font-medium">Featured</span>
            <span className="text-sm text-gray-500">
              This product will appear on the homepage.
            </span>
          </span>
        </label>
        <label className="flex gap-4 rounded-md border p-4">
          <input
            defaultChecked={Boolean(product?.isArchived)}
            name="isArchived"
            type="checkbox"
            className="mt-1 h-4 w-4"
          />
          <span>
            <span className="block text-sm font-medium">Archived</span>
            <span className="text-sm text-gray-500">
              This product will not appear anywhere in the store.
            </span>
          </span>
        </label>
      </div>
      <div className="rounded-2xl border border-black/10 bg-[#faf9f6] p-5">
        <p className="text-sm font-semibold text-[#111111]">
          Product page placement
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Select where this product should appear. If none are selected, it stays as a normal product only.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="flex gap-4 rounded-2xl border bg-white p-4">
            <input
              checked={showInHighlights}
              onChange={(event) => setShowInHighlights(event.target.checked)}
              type="checkbox"
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block text-sm font-medium">Highlight items</span>
              <span className="text-sm text-gray-500">
                Add to the homepage highlight section.
              </span>
            </span>
          </label>
          <label className="flex gap-4 rounded-2xl border bg-white p-4">
            <input
              checked={showInNewArrivals}
              onChange={(event) => setShowInNewArrivals(event.target.checked)}
              type="checkbox"
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block text-sm font-medium">New Arrival</span>
              <span className="text-sm text-gray-500">
                Show on the New Arrivals page.
              </span>
            </span>
          </label>
          <label className="flex gap-4 rounded-2xl border bg-white p-4">
            <input
              checked={showInLimitedDeals}
              onChange={(event) => setShowInLimitedDeals(event.target.checked)}
              type="checkbox"
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block text-sm font-medium">Sale</span>
              <span className="text-sm text-gray-500">
                Show on the Sale page.
              </span>
            </span>
          </label>
        </div>
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
          {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
