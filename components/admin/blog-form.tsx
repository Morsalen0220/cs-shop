"use client";

import { BlogPost } from "@/types";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

interface BlogFormProps {
  blog?: BlogPost | null;
}

const createSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const BlogForm: React.FC<BlogFormProps> = ({ blog }) => {
  const router = useRouter();
  const isEditing = Boolean(blog);
  const [loading, setLoading] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(blog?.coverImageUrl ?? "");

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
      setCoverImageUrl(url);
      toast.success("Cover image uploaded");
    } catch {
      toast.error("Cover image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") || "");
    const payload = {
      title,
      slug: createSlug(String(formData.get("slug") || title)),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      category: formData.get("category"),
      coverImageUrl: coverImageUrl || formData.get("coverImageUrl") || "/images/image-1.jpg",
      readTime: formData.get("readTime"),
      isPublished: formData.get("isPublished") === "on",
    };

    const response = await fetch(
      isEditing
        ? `/api/demo-store/admin/blogs/${blog?.id}`
        : "/api/demo-store/admin/blogs",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error || "Blog post was not saved");
      return;
    }

    toast.success(isEditing ? "Blog post updated" : "Blog post created");
    router.push("/admin/blogs");
    router.refresh();
  };

  const onDelete = async () => {
    if (!blog || !window.confirm("Delete this blog post?")) {
      return;
    }

    setLoading(true);

    const response = await fetch(`/api/demo-store/admin/blogs/${blog.id}`, {
      method: "DELETE",
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      toast.error(data?.error || "Blog post was not deleted");
      return;
    }

    toast.success("Blog post deleted");
    router.push("/admin/blogs");
    router.refresh();
  };

  return (
    <form className="space-y-8" onSubmit={onSubmit}>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium" htmlFor="title">
            Blog title
          </label>
          <input
            required
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            defaultValue={blog?.title}
            id="title"
            name="title"
            placeholder="How to Style Sneakers for Every Occasion"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="slug">
            Slug
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            defaultValue={blog?.slug}
            id="slug"
            name="slug"
            placeholder="how-to-style-sneakers-for-every-occasion"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="category">
            Category
          </label>
          <input
            required
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            defaultValue={blog?.category}
            id="category"
            name="category"
            placeholder="Style Guide"
          />
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="readTime">
            Read time
          </label>
          <input
            required
            className="mt-2 h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
            defaultValue={blog?.readTime ?? "5 min read"}
            id="readTime"
            name="readTime"
            placeholder="5 min read"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="excerpt">
          Excerpt
        </label>
        <textarea
          required
          className="mt-2 min-h-[110px] w-full rounded-2xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          defaultValue={blog?.excerpt}
          id="excerpt"
          name="excerpt"
          placeholder="Short summary for blog card and preview..."
        />
      </div>

      <div>
        <label className="text-sm font-medium" htmlFor="content">
          Full content
        </label>
        <textarea
          required
          className="mt-2 min-h-[260px] w-full rounded-2xl border px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          defaultValue={blog?.content}
          id="content"
          name="content"
          placeholder="Write the full blog post here..."
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium" htmlFor="coverImageUrl">
          Cover image
        </label>
        <input
          accept="image/*"
          className="block w-full text-sm"
          id="coverImageFile"
          onChange={onImageChange}
          type="file"
        />
        <input
          className="h-11 w-full rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-gray-300"
          id="coverImageUrl"
          name="coverImageUrl"
          onChange={(event) => setCoverImageUrl(event.target.value)}
          placeholder="/images/image-1.jpg"
          value={coverImageUrl}
        />
        <div className="overflow-hidden rounded-2xl border bg-[#f7f7f7]">
          {coverImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="Blog cover preview"
              className="h-56 w-full object-cover"
              src={coverImageUrl}
            />
          ) : (
            <div className="flex h-56 items-center justify-center text-sm text-gray-400">
              No cover image selected
            </div>
          )}
        </div>
      </div>

      <label className="flex gap-4 rounded-md border p-4">
        <input
          className="mt-1 h-4 w-4"
          defaultChecked={blog?.isPublished ?? true}
          name="isPublished"
          type="checkbox"
        />
        <span>
          <span className="block text-sm font-medium">Published</span>
          <span className="text-sm text-gray-500">
            Published posts will appear on `/blog` and their single post page.
          </span>
        </span>
      </label>

      <div className="flex justify-end gap-3">
        {isEditing ? (
          <button
            className="rounded-md border border-red-200 px-5 py-2 text-sm font-semibold text-red-600"
            disabled={loading}
            onClick={onDelete}
            type="button"
          >
            Delete
          </button>
        ) : null}
        <button
          className="rounded-md border px-5 py-2 text-sm font-semibold"
          onClick={() => router.push("/admin/blogs")}
          type="button"
        >
          Cancel
        </button>
        <button
          className="rounded-md bg-gray-950 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
          disabled={loading}
          type="submit"
        >
          {loading ? "Saving..." : isEditing ? "Update Blog Post" : "Create Blog Post"}
        </button>
      </div>
    </form>
  );
};

export default BlogForm;
