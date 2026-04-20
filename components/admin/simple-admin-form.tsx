"use client";

import { Billboard } from "@/types";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

type FormKind = "billboard" | "category" | "color" | "size";

interface SimpleAdminFormProps {
  billboards?: Billboard[];
  kind: FormKind;
}

const labels: Record<FormKind, string> = {
  billboard: "Billboard",
  category: "Category",
  color: "Color",
  size: "Size",
};

const endpoints: Record<FormKind, string> = {
  billboard: "billboards",
  category: "categories",
  color: "colors",
  size: "sizes",
};

const SimpleAdminForm: React.FC<SimpleAdminFormProps> = ({
  billboards = [],
  kind,
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
    const payload = Object.fromEntries(formData.entries());

    if (kind === "billboard") {
      payload.imageUrl = imageUrl || payload.imageUrl;
    }

    const response = await fetch(`/api/demo-store/admin/${endpoints[kind]}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error || `${labels[kind]} was not saved`);
      return;
    }

    toast.success(`${labels[kind]} created`);
    router.push(`/admin/${endpoints[kind]}`);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div>
        <label className="text-sm font-medium" htmlFor="name">
          {kind === "billboard" ? "Label" : "Name"}
        </label>
        <input
          required
          id="name"
          name="name"
          className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          placeholder={kind === "billboard" ? "Nike Sports" : `${labels[kind]} name`}
        />
      </div>
      {kind === "billboard" && (
        <div className="space-y-3">
          <label className="text-sm font-medium" htmlFor="imageFile">
            Billboard image
          </label>
          <input
            id="imageFile"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="block w-full text-sm"
          />
          <input
            name="imageUrl"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
            className="h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="/images/nike-just-do-it.jpg"
          />
        </div>
      )}
      {kind === "category" && (
        <div>
          <label className="text-sm font-medium" htmlFor="billboardId">
            Billboard
          </label>
          <select
            required
            id="billboardId"
            name="billboardId"
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">Select billboard</option>
            {billboards.map((billboard) => (
              <option key={billboard.id} value={billboard.id}>
                {billboard.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {(kind === "size" || kind === "color") && (
        <div>
          <label className="text-sm font-medium" htmlFor="value">
            Value
          </label>
          <input
            required
            id="value"
            name="value"
            type={kind === "color" ? "text" : "text"}
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            placeholder={kind === "color" ? "#111111" : "US 9"}
          />
        </div>
      )}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border px-5 py-2 text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type="submit"
          className="rounded-md bg-gray-950 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : `Create ${labels[kind]}`}
        </button>
      </div>
    </form>
  );
};

export default SimpleAdminForm;
