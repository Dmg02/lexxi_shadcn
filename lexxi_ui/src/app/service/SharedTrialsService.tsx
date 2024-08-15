import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";

interface Trial {
  id: number;
  case_number: string;
  courthouse_id: number;
  is_active: boolean;
}

interface PaginatedResponse {
  data: Trial[];
  count: number;
}

export const searchTrials = async (
  searchQuery: string,
  courthouseId: number | null,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedResponse> => {
  const supabase = createSupabaseClientSide();
  
  let query = supabase
    .from("shared_trials")
    .select("id, case_number, courthouse_id, is_active", { count: 'exact' })
    .order('case_number', { ascending: true });

  if (searchQuery) {
    query = query.or(`case_number.ilike.%${searchQuery}%`);
  }

  if (courthouseId) {
    query = query.eq('courthouse_id', courthouseId);
  }

  const startIndex = (page - 1) * pageSize;
  query = query.range(startIndex, startIndex + pageSize - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error searching trials:', error);
    throw error;
  }

  return { data: data || [], count: count || 0 };
};