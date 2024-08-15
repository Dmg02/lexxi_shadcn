import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface Publication {
  id: number;
  agreement_date: string;
  publication_date: string;
  summary: string;
}

export async function getPublicationCount(trialId: number): Promise<number> {
  const supabase = createClientComponentClient()

  const { count, error } = await supabase
    .from('publications')
    .select('id', { count: 'exact' })
    .eq('shared_trial_id', trialId)

  if (error) {
    console.error('Error fetching publication count:', error)
    throw new Error('Failed to fetch publication count')
  }

  return count || 0
}

export async function getPublications(trialId: number, page: number, pageSize: number): Promise<{ data: Publication[], count: number }> {
  const supabase = createClientComponentClient()
  const offset = (page - 1) * pageSize

  const { data, error, count } = await supabase
    .from('publications')
    .select('id, agreement_date, publication_date, summary', { count: 'exact' })
    .eq('shared_trial_id', trialId)
    .range(offset, offset + pageSize - 1)

  if (error) {
    console.error('Error fetching publications:', error)
    throw new Error('Failed to fetch publications')
  }

  return { data: data as Publication[], count: count || 0 }
}
