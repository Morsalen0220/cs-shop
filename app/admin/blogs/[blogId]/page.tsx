import getAdminBlog from "@/actions/get-admin-blog";
import BlogForm from "@/components/admin/blog-form";
import PageHeading from "@/components/admin/page-heading";
import { notFound } from "next/navigation";

interface BlogEditPageProps {
  params: {
    blogId: string;
  };
}

const BlogEditPage: React.FC<BlogEditPageProps> = async ({ params }) => {
  const blog = await getAdminBlog(params.blogId);

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeading
        backHref="/admin/blogs"
        description="Edit title, cover image, content, and publish state."
        title="Edit blog post"
      />
      <BlogForm blog={blog} />
    </div>
  );
};

export default BlogEditPage;
