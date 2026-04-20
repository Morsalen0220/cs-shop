import { Billboard } from "@/types";
import { fetchJson } from "@/lib/api";

const getBillboards = async (): Promise<Billboard[]> => {
  return fetchJson<Billboard[]>("/billboards", []);
};

export default getBillboards;
