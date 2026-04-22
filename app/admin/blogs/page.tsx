import getBlogs from "@/actions/get-blogs";
import AdminListPage from "@/components/admin/admin-list-page";
import Link from "next/link";

export const revalidate = 0;

const AdminBlogsPage = async () => {
  const blogFeed = await getBlogs({ includeUnpublished: true, limit: 100, page: 1 });
  const blogs = blogFeed.posts;

  return (
    <AdminListPage
      addHref="/admin/blogs/new"
      columns={["Title", "Category", "Slug", "Read Time", "Published", "Date", "Manage"]}
      description="Create, edit, and manage your blog posts."
      rows={blogs.map((blog) => [
        blog.title,
        blog.category,
        blog.slug,
        blog.readTime,
        String(blog.isPublished),
        new Date(blog.createdAt).toLocaleDateString(),
        <Link
          key={`${blog.id}-edit`}
          className="font-semibold text-[#111111] underline underline-offset-4"
          href={`/admin/blogs/${blog.id}`}
        >
          Edit
        </Link>,
      ])}
      title={`Blog Posts (${blogs.length})`}
    />
  );
};

export default AdminBlogsPage;
