import { Product } from "@/types";
import { fetchJson } from "@/lib/api";

const getProduct = async ( id: string ): Promise<Product | null> => {
  return fetchJson<Product | null>(`/products/${id}`, null);
};

export default getProduct;
