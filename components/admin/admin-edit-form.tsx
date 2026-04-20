import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export type FormField = {
  name: string;
  label: string;
  type: "text" | "color" | "select";
  required: boolean;
  options?: Array<{
    label: string;
    value: string;
  }>;
};

type AdminEditFormProps = {
  endpoint: string;
  fields: FormField[];
  initialData?: Record<string, any>;
  redirectPath: string;
};

export default function AdminEditForm({
  endpoint,
  fields,
  initialData,
  redirectPath,
}: AdminEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, any>>(
    initialData || {}
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = initialData ? "PUT" : "POST";
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to save data");
      }

      toast.success("Saved successfully");
      router.push(redirectPath);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "color" ? (
            <div className="flex items-center gap-4">
              <input
                type="text"
                name={field.name}
                value={formData[field.name] || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required={field.required}
              />
              <div
                className="h-10 w-10 rounded border"
                style={{ backgroundColor: formData[field.name] || "#fff" }}
              />
            </div>
          ) : field.type === "select" ? (
            <select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.name]: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
              required={field.required}
            >
              <option value="">Select {field.label.toLowerCase()}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={field.required}
            />
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={() => router.push(redirectPath)}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
