import { supabase } from '@/integrations/supabase/client';

function id() {
  return (crypto.randomUUID && crypto.randomUUID()) || Math.random().toString(36).slice(2);
}

export function seedDemoData() {
  if ((window as any).__demoSeeded) return;

  const now = new Date();
  const iso = (d: Date) => d.toISOString();

  const plans = [
    { id: id(), name: 'PRE-IPO Alpha', segment: 'PRE-IPO', investment_amount: 500000, duration_months: 12, return_percentage: 14, is_active: true, description: 'Pre-IPO strategy', created_at: iso(now), updated_at: iso(now), created_by: 'demo-user-id', terms_document_url: null },
    { id: id(), name: 'Real Estate Growth', segment: 'REAL ESTATE', investment_amount: 800000, duration_months: 24, return_percentage: 18, is_active: true, description: 'REIT blend', created_at: iso(now), updated_at: iso(now), created_by: 'demo-user-id', terms_document_url: null },
  ];

  const customers = [
    { id: id(), first_name: 'Ravi', last_name: 'Kumar', email: 'ravi@example.com', phone: '9876543210', address: 'Bengaluru', pan_number: 'ABCDE1234F', aadhar_number: '1234-5678-9012', investment_amount: 500000, plan_id: plans[0].id, approval_status: 'approved', approved_at: iso(now), review_comments: null, reviewed_by: 'demo-user-id', submitted_by: 'demo-user-id', created_at: iso(now), updated_at: iso(now) },
    { id: id(), first_name: 'Anita', last_name: 'Sharma', email: 'anita@example.com', phone: '9876501234', address: 'Mumbai', pan_number: 'PQRSX6789Z', aadhar_number: '1111-2222-3333', investment_amount: 800000, plan_id: plans[1].id, approval_status: 'pending', approved_at: null, review_comments: null, reviewed_by: null, submitted_by: 'demo-user-id', created_at: iso(now), updated_at: iso(now) },
  ];

  const payment_schedules = customers.flatMap((c) => {
    const fifteenth = new Date(); fifteenth.setDate(15);
    const endMonth = new Date(); endMonth.setDate(30);
    return [
      { id: id(), customer_id: c.id, amount: Math.round(c.investment_amount * 0.1), payment_date: iso(fifteenth).slice(0,10), payment_type: 'monthly', is_paid: false, paid_at: null, created_at: iso(now), customers: { first_name: c.first_name, last_name: c.last_name, investment_amount: c.investment_amount } },
      { id: id(), customer_id: c.id, amount: Math.round(c.investment_amount * 0.1), payment_date: iso(endMonth).slice(0,10), payment_type: 'monthly', is_paid: false, paid_at: null, created_at: iso(now), customers: { first_name: c.first_name, last_name: c.last_name, investment_amount: c.investment_amount } },
    ];
  });

  const agents = [
    { id: id(), first_name: 'Sanjay', last_name: 'Verma', email: 'sanjay@agent.com', phone: '9000000001', address: 'Delhi', pan_number: 'AAAAA1111A', approval_status: 'approved', approved_at: iso(now), commission_percentage: 2, review_comments: null, reviewed_by: 'demo-user-id', submitted_by: 'demo-user-id', created_at: iso(now), updated_at: iso(now) },
    { id: id(), first_name: 'Priya', last_name: 'Mehta', email: 'priya@agent.com', phone: '9000000002', address: 'Pune', pan_number: 'BBBBB2222B', approval_status: 'pending', approved_at: null, commission_percentage: 1.5, review_comments: null, reviewed_by: null, submitted_by: 'demo-user-id', created_at: iso(now), updated_at: iso(now) },
  ];

  const company_investments = [
    { id: id(), investment_name: 'Corporate Bond A', investment_amount: 1200000, investment_date: iso(now), description: 'Low risk corp bond', expected_return: 10, plan_id: plans[0].id, approval_status: 'approved', approved_at: iso(now), review_comments: null, reviewed_by: 'demo-user-id', submitted_by: 'demo-user-id', created_at: iso(now), updated_at: iso(now) },
    { id: id(), investment_name: 'Real Estate Fund B', investment_amount: 2200000, investment_date: iso(now), description: 'RE growth', expected_return: 14, plan_id: plans[1].id, approval_status: 'pending', approved_at: null, review_comments: null, reviewed_by: null, submitted_by: 'demo-user-id', created_at: iso(now), updated_at: iso(now) },
  ];

  supabase.__seed({
    plans,
    customers,
    payment_schedules,
    agents,
    company_investments,
  } as any);

  (window as any).__demoSeeded = true;
}


