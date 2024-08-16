import { createSupabaseClientSide } from '@/lib/supabase/supabase-client-side';

export interface CustomerData {
  name: string;
  description?: string;
  portal_access: boolean;
  contact_info: { type: string; value: string }[];
  organization_id: string;
  created_by: string;
  updated_by: string;
}

export const customerService = {
  async addCustomer(customerData: CustomerData) {
    const supabase = createSupabaseClientSide();
    
    const { data, error } = await supabase
      .from('org_customers')
      .insert(customerData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCustomersByOrganization(organizationId: string) {
    const supabase = createSupabaseClientSide();
    
    const { data, error } = await supabase
      .from('org_customers')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) throw error;
    return data;
  },

  async updateCustomer(organizationId: string, customerId: string, customerData: Partial<CustomerData>) {
    const supabase = createSupabaseClientSide();
    
    const { data, error } = await supabase
      .from('org_customers')
      .update(customerData)
      .eq('id', customerId)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCustomer(organizationId: string, customerId: string) {
    const supabase = createSupabaseClientSide();
    
    const { error } = await supabase
      .from('org_customers')
      .delete()
      .eq('id', customerId)
      .eq('organization_id', organizationId);

    if (error) throw error;
  },

  async getCustomerById(organizationId: string, customerId: string) {
    const supabase = createSupabaseClientSide();
    
    const { data, error } = await supabase
      .from('org_customers')
      .select('*')
      .eq('id', customerId)
      .eq('organization_id', organizationId)
      .single();

    if (error) throw error;
    return data;
  },

  async customerExistsInOrganization(organizationId: string, customerName: string) {
    const supabase = createSupabaseClientSide();
    
    const { count, error } = await supabase
      .from('org_customers')
      .select('id', { count: 'exact', head: true })
      .eq('organization_id', organizationId)
      .eq('name', customerName);

    if (error) throw error;
    return count !== null && count > 0;
  },

  async searchCustomers(organizationId: string, searchTerm: string) {
    const supabase = createSupabaseClientSide();
    
    const { data, error } = await supabase
      .from('org_customers')
      .select('name, id')
      .eq('organization_id', organizationId)
      .ilike('name', `%${searchTerm}%`)
      .limit(10);

    if (error) throw error;
    return data ? data.map(item => ({ label: item.name, value: item.id })) : [];
  }
};