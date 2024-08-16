import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';

export interface CorporationData {
  id: string;
  name: string;
  organization_id: string;
}

export const corporationService = {
  async getCorporationsByOrganization(organizationId: string): Promise<CorporationData[]> {
    const supabase = createSupabaseClientSide();
    
    const { data, error } = await supabase
      .from('org_corporations')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) throw error;
    return data;
  },

};