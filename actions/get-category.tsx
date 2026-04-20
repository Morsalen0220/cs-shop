import { Category } from "@/types";
import { fetchJson } from "@/lib/api";

const getCategory = async ( id: string ): Promise<Category | null> => {
  return fetchJson<Category | null>(`/categories/${id}`, null);
};

export default getCategory;
