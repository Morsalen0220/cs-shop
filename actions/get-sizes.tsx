import { Size } from "@/types";
import { fetchJson } from "@/lib/api";

const getSizes = async (): Promise<Size[]> => {
    return fetchJson<Size[]>("/sizes", []);
}

export default getSizes
