import { BlogPostListResponse } from "@/types";
import { fetchJson } from "@/lib/api";
import qs from "query-string";

interface Query {
  includeUnpublished?: boolean;
  limit?: number;
  page?: number;
}

const getBlogs = async (query: Query = {}): Promise<BlogPostListResponse> => {
  const url = qs.stringifyUrl({
    url: "/blogs",
    query: {
      includeUnpublished: query.includeUnpublished,
      limit: query.limit,
      page: query.page,
    },
  });

  return fetchJson<BlogPostListResponse>(url, {
    page: 1,
    pageSize: query.limit ?? 10,
    posts: [],
    totalPages: 1,
    totalPosts: 0,
  });
};

export default getBlogs;
