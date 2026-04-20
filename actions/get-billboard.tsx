import { Billboard } from "@/types";
import { fetchJson } from "@/lib/api";

const getBillboard = async ( id: string ): Promise<Billboard | null> => {
  return fetchJson<Billboard | null>(`/billboards/${id}`, null);
};

export default getBillboard;
