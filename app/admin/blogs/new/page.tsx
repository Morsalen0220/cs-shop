import BlogForm from "@/components/admin/blog-form";
import PageHeading from "@/components/admin/page-heading";

const NewBlogPage = () => {
  return (
    <div className="space-y-8">
      <PageHeading
        title="Create a new blog post"
        description="Add a new story for the /blog page and single post detail view."
      />
      <BlogForm />
    </div>
  );
};

export default NewBlogPage;
