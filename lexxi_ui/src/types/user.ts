import { User as SupabaseUser } from '@supabase/supabase-js'

export interface User extends SupabaseUser {
  avatar_url?: string;
}