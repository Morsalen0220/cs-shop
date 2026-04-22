import { BlogPost } from "@/types";
import { fetchJson } from "@/lib/api";

const getAdminBlog = async (id: string): Promise<BlogPost | null> => {
  return fetchJson<BlogPost | null>(`/admin/blogs/${id}`, null);
};

export default getAdminBlog;
