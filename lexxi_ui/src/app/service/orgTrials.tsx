import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';

export interface OrgTrial {
  id: string;
  organization_id: string;
  shared_trial_id: string;
  org_corporation_id?: string;
  custom_description?: string;
  risk_factor?: string;
  priority?: string;
  outcome?: string;
  contingency_cost?: number;
  start_date?: Date;
  end_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at?: Date;
  trial_status?: boolean;
  team_id: string;
  trial_type_stage?: number;
  created_by?: string;
  courthouse_id?: string;
  courthouse?: {
    id: string;
    state_id: string;
    abbreviation: string;
  };
}

interface TrialFilters {
  state_id?: string;
  courthouse_id?: string;
}

export const trialService = {
  getTrials: async (organizationId?: string, filters?: TrialFilters): Promise<OrgTrial[]> => {
    if (!organizationId) {
      console.error('No organization ID provided');
      return [];
    }
    console.log(`getTrials called for organization: ${organizationId} with filters:`, filters);
    const supabase = createSupabaseClientSide();

    let query = supabase
      .from('org_trials')
      .select(`
        *,
        courthouse:courthouse_id (
          id,
          state_id,
          abbreviation
        )
      `)
      .eq('organization_id', organizationId);

    if (filters?.courthouse_id) {
      query = query.eq('courthouse_id', filters.courthouse_id);
    }

    if (filters?.state_id) {
      query = query.eq('courthouse.state_id', filters.state_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching trials:', error);
      throw error;
    }
    return data as OrgTrial[];
  },

  createTrial: async (trial: Omit<OrgTrial, 'id' | 'created_at'>): Promise<OrgTrial> => {
    console.log(`createTrial called with trial: ${JSON.stringify(trial)}`);
    const supabase = createSupabaseClientSide();

    const { data, error } = await supabase
      .from('org_trials')
      .insert(trial)
      .single();

    if (error) throw error;
    return data as OrgTrial;
  },

  updateTrial: async (id: string, trial: Partial<OrgTrial>): Promise<OrgTrial> => {
    console.log(`updateTrial called for id: ${id} with trial: ${JSON.stringify(trial)}`);
    const supabase = createSupabaseClientSide();

    const { data, error } = await supabase
      .from('org_trials')
      .update(trial)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as OrgTrial;
  },

  deleteTrial: async (id: string): Promise<void> => {
    console.log(`deleteTrial called for id: ${id}`);
    const supabase = createSupabaseClientSide();

    const { error } = await supabase
      .from('org_trials')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  getTrialById: async (id: string): Promise<OrgTrial> => {
    console.log(`getTrialById called for id: ${id}`);
    const supabase = createSupabaseClientSide();

    const { data, error } = await supabase
      .from('org_trials')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as OrgTrial;
  },
};

