import { supabase } from '@/integrations/supabase/client';

export interface Investor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  pan_number: string;
  aadhar_number: string;
  plan_id: string;
  investment_amount: number;
  approval_status: 'pending' | 'approved' | 'rejected';
  submitted_by: string;
  reviewed_by: string | null;
  review_comments: string | null;
  approved_at: string | null;
  created_at: string;
  data_access_level?: string;
  images?: string[];
  plans?: {
    id: string;
    name: string;
    return_percentage: number;
    duration_months: number;
    investment_amount?: number;
  };
}

export interface Plan {
  id: string;
  name: string;
  investment_amount: number;
  return_percentage: number;
  duration_months: number;
}

export async function listInvestorsWithAccess(): Promise<{ data: Investor[]; error: any }> {
  // Uses secure RPC to simulate backend masking/role-based access
  const { data, error } = await supabase.rpc('get_customers_by_role');
  if (error) return { data: [], error };

  // Gather distinct plan ids and fetch plans safely
  const planIds = Array.from(new Set((data || []).map((c: any) => c.plan_id).filter(Boolean)));
  let planIndex: Record<string, any> = {};
  if (planIds.length > 0) {
    const { data: planData } = await supabase
      .from('plans' as any)
      .select('id, name, return_percentage, duration_months');
    (planData || []).forEach((p: any) => {
      planIndex[p.id] = p;
    });
  }

  const result: Investor[] = (data || []).map((c: any) => ({
    ...c,
    plans: planIndex[c.plan_id] || undefined,
  }));
  return { data: result, error: null };
}

export async function listActivePlans(): Promise<{ data: Plan[]; error: any }> {
  const { data, error } = await supabase
    .from('plans' as any)
    .select('id, name, investment_amount, return_percentage, duration_months');
  return { data: (data || []) as Plan[], error };
}

export async function createInvestor(payload: Omit<Investor, 'id' | 'approval_status' | 'reviewed_by' | 'review_comments' | 'approved_at' | 'created_at' | 'plans'> & { investment_amount: number }): Promise<{ error: any }> {
  const { error } = await supabase
    .from('customers' as any)
    .insert({
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      pan_number: payload.pan_number,
      aadhar_number: payload.aadhar_number,
      plan_id: payload.plan_id,
      investment_amount: payload.investment_amount,
      submitted_by: payload.submitted_by,
      images: payload.images ?? [],
    });
  return { error };
}

export async function approveInvestorSecure(investorId: string, action: 'approved' | 'rejected', comments?: string) {
  return supabase.rpc('approve_customer_secure', {
    customer_id: investorId,
    action,
    comments: comments || null,
  });
}



