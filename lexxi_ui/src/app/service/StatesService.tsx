import { createSupabaseClientSide } from "@/lib/supabase/supabase-client-side";

interface State {
  id: number;
  name: string;
}

const capitalizeWords = (string: string): string => {
  return string
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const getStates = async (): Promise<State[]> => {
  const supabase = createSupabaseClientSide();
  
  const { data, error } = await supabase
    .from("states")
    .select("id, name")
    .order('name');

  if (error) {
    console.error('Error fetching states:', error);
    throw error;
  }

  // Capitalize each word in the state name
  const capitalizedStates = data?.map(state => ({
    ...state,
    name: capitalizeWords(state.name)
  })) || [];

  return capitalizedStates;
};