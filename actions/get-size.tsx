import { supabase } from "@/lib/supabase";

export default async function getSize(id: string) {
  const { data, error } = await supabase
    .from("sizes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}