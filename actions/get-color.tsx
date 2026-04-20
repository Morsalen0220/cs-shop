import { supabase } from "@/lib/supabase";

export default async function getColor(id: string) {
  const { data, error } = await supabase
    .from("colors")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}