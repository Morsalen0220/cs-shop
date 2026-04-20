import { Color } from "@/types";
import { fetchJson } from "@/lib/api";

const getColors = async (): Promise<Color[]> => {
    return fetchJson<Color[]>("/colors", []);
}

export default getColors
