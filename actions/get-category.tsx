import { Category } from "@/types";
import { fetchJson } from "@/lib/api";

export default async function getCategory(id: string): Promise<Category | null> {
  return fetchJson<Category | null>(`/categories/${id}`, null);
}
