import { BlogPost } from "@/types";
import { fetchJson } from "@/lib/api";

const getBlog = async (slug: string): Promise<BlogPost | null> => {
  return fetchJson<BlogPost | null>(`/blogs/${slug}`, null);
};

export default getBlog;
