import { Product } from "@/types";
import { buildApiUrl } from "@/lib/api";
import qs from 'query-string'

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  description?: string;
  q?: string;
  includeArchived?: boolean;
  isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  const apiUrl = buildApiUrl("/products");

  if (!apiUrl) {
    return [];
  }

  const url = qs.stringifyUrl({
    url: apiUrl,
    query: {
      description: query.description,
      q: query.q,
      colorId: query.colorId,
      sizeId: query.sizeId,
      categoryId: query.categoryId,
      includeArchived: query.includeArchived,
      isFeatured: query.isFeatured
    }
  });
  
  try {
    const res = await fetch(url, {
      next: {
        revalidate: 30,
      },
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
};

export default getProducts;
