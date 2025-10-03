import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'super_admin' | 'manager' | 'office_staff';
  created_at: string;
  updated_at: string;
}

export type CreateProfileInput = {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  role: 'super_admin' | 'manager' | 'office_staff';
  user_id: string;
};

export async function getProfileByUserId(userId: string) {
  return supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single() as unknown as Promise<{ data: Profile | null; error: any }>;
}

export async function listProfiles() {
  return supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false }) as unknown as Promise<{ data: Profile[]; error: any }>;
}

export async function createProfile(input: CreateProfileInput) {
  return supabase
    .from('profiles')
    .insert({
      email: input.email,
      first_name: input.first_name ?? null,
      last_name: input.last_name ?? null,
      role: input.role,
      user_id: input.user_id,
    }) as unknown as Promise<{ data: any; error: any }>;
}

export async function updateUserRole(userId: string, role: Profile['role']) {
  return supabase
    .from('profiles')
    .update({ role })
    .eq('user_id', userId) as unknown as Promise<{ data: any; error: any }>;
}




