import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";

interface Courthouse {
  id: number;
  abbreviation: string;
}

export const getCourthouses = async (stateId: string | null = null): Promise<Courthouse[]> => {
  const supabase = createSupabaseClientSide();
  
  let query = supabase
    .from("courthouses")
    .select("id, abbreviation, cities!inner(state_id)")
    .order('abbreviation', { ascending: true });

  if (stateId) {
    query = query.eq('cities.state_id', stateId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching courthouses:', error);
    throw error;
  }

  return data || [];
};