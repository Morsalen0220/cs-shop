import { Category } from "@/types";
import { fetchJson } from "@/lib/api";

const getCategories = async (): Promise<Category[]> => {
    return fetchJson<Category[]>("/categories", []);
}

export default getCategories
