import getBlogs from "@/actions/get-blogs";
import BlogExperience from "@/components/blog/blog-experience";
import Container from "@/components/ui/container";

export const revalidate = 0;

interface BlogPageProps {
  searchParams: {
    page?: string;
  };
}

const BlogPage: React.FC<BlogPageProps> = async ({ searchParams }) => {
  const currentPage = Math.max(Number(searchParams.page || "1"), 1);
  const blogFeed = await getBlogs({ limit: 10, page: currentPage });

  return (
    <Container>
      <BlogExperience
        currentPage={blogFeed.page}
        posts={blogFeed.posts}
        totalPages={blogFeed.totalPages}
      />
    </Container>
  );
};

export default BlogPage;
