// Frontend-only mock of Supabase for local/demo usage without a backend.
// Provides minimal subsets used across the app.

type MockUser = { id: string; email?: string };
type MockSession = { user: MockUser | null } | null;

type SelectQuery = {
  select: (columns?: string) => SelectQuery;
  eq: (column: string, value: any) => SelectQuery;
  order: (column: string, opts?: { ascending?: boolean }) => SelectQuery;
  limit: (n: number) => SelectQuery;
  gte: (column: string, value: any) => SelectQuery;
  lte: (column: string, value: any) => SelectQuery;
  in: (column: string, values: any[]) => SelectQuery;
  single: () => Promise<{ data: any; error: any }>;
  insert: (payload: any) => Promise<{ data: any; error: null } | { data: null; error: Error }>;
  update: (payload: any) => SelectQuery & { then?: any };
  then?: any;
};

const fakeUserId = '00000000-0000-0000-0000-000000000001';
let currentUser: MockUser | null = null;
let currentSession: MockSession = null;

// In-memory tables to support UI flows minimally
const db = {
  profiles: [
    {
      id: 'profile-1',
      user_id: fakeUserId,
      email: 'admin@example.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'super_admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  agents: [],
  company_investments: [],
  payment_schedules: [],
  customer_pii_access_log: [],
  plans: [],
  customers: [],
  // New transactional tables
  payments: [],
  agent_gifts: [],
};

type TableName = keyof typeof db;

function makeQuery(table: TableName): SelectQuery | any {
  const state: any = { filters: [] as Array<(row: any) => boolean>, single: false };

  const exec = () => {
    const rows = (db[table] as any[]).filter((row) => state.filters.every((f: any) => f(row)));
    if (state.single) {
      return Promise.resolve({ data: rows[0] ?? null, error: null });
    }
    return Promise.resolve({ data: rows, error: null });
  };

  const chain: any = {
    select: () => chain,
    eq: (column: string, value: any) => {
      state.filters.push((row: any) => row[column] === value);
      return chain;
    },
    order: () => chain,
    limit: () => chain,
    gte: () => chain,
    lte: () => chain,
    in: (column: string, values: any[]) => {
      state.filters.push((row: any) => values.includes(row[column]));
      return chain;
    },
    single: () => {
      state.single = true;
      return exec();
    },
    insert: async (payload: any) => {
      const items = Array.isArray(payload) ? payload : [payload];
      (db[table] as any[]).push(
        ...items.map((item) => {
          const base = { id: crypto.randomUUID?.() || String(Date.now()), ...item } as any;
          const nowIso = new Date().toISOString();
          if (table === 'customers' || table === 'agents' || table === 'company_investments') {
            if (!base.approval_status) base.approval_status = 'pending';
            if (!base.created_at) base.created_at = nowIso;
            if (!base.updated_at) base.updated_at = nowIso;
          }
          if (
            table === 'payment_schedules' ||
            table === 'payments' ||
            table === 'agent_gifts'
          ) {
            if (!base.created_at) base.created_at = nowIso;
          }
          return base;
        })
      );
      return { data: items, error: null };
    },
    update: (payload: any) => {
      const updater = {
        eq: (column: string, value: any) => {
          (db[table] as any[]).forEach((row, idx, arr) => {
            if ((row as any)[column] === value) {
              arr[idx] = { ...row, ...payload };
            }
          });
          return Promise.resolve({ data: null, error: null });
        },
      };
      return updater as any;
    },
    then: (resolve: any, reject: any) => exec().then(resolve, reject),
  };

  return chain as SelectQuery;
}

function createAuth() {
  const listeners: Array<(event: string, session: MockSession) => void> = [];

  const notify = (event: string) => {
    listeners.forEach((cb) => cb(event, currentSession));
  };

  return {
    async signInWithOtp({ email }: { email: string }) {
      // No real email sending; we just accept and wait for verifyOtp
      return { error: null } as const;
    },
    async verifyOtp({ email }: { email: string; token: string; type: 'email' }) {
      currentUser = { id: fakeUserId, email };
      currentSession = { user: currentUser };
      // ensure profile exists for this user
      const existing = db.profiles.find((p) => p.user_id === fakeUserId);
      if (!existing) {
        db.profiles.push({
          id: 'profile-' + (db.profiles.length + 1),
          user_id: fakeUserId,
          email,
          first_name: 'Admin',
          last_name: 'User',
          role: 'super_admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as any);
      }
      notify('SIGNED_IN');
      return { error: null } as const;
    },
    async signOut() {
      currentUser = null;
      currentSession = { user: null };
      notify('SIGNED_OUT');
      return { error: null } as const;
    },
    async getSession() {
      return { data: { session: currentSession } } as const;
    },
    onAuthStateChange(callback: (event: string, session: MockSession) => void) {
      listeners.push(callback);
      return { data: { subscription: { unsubscribe: () => {
        const idx = listeners.indexOf(callback);
        if (idx >= 0) listeners.splice(idx, 1);
      } } } } as const;
    },
  };
}

export const supabase = {
  auth: createAuth(),
  from(table: TableName) {
    return makeQuery(table);
  },
  rpc(name: string, args?: any) {
    if (name === 'get_customer_stats') {
      const rows = db.customers as any[];
      const total_customers = rows.length;
      const pending_approvals = rows.filter(r => r.approval_status === 'pending').length;
      const approved_customers = rows.filter(r => r.approval_status === 'approved').length;
      const rejected_customers = rows.filter(r => r.approval_status === 'rejected').length;
      return Promise.resolve({ data: [{ total_customers, pending_approvals, approved_customers, rejected_customers }], error: null });
    }
    if (name === 'get_customers_by_role') {
      // For demo, return customers with basic masking fields
      const masked = (db.customers as any[]).map((c) => ({
        ...c,
        data_access_level: 'FULL_ACCESS',
      }));
      return Promise.resolve({ data: masked, error: null });
    }
    if (name === 'approve_customer_secure') {
      const id = args?.customer_id;
      const action = args?.action;
      const comments = args?.comments ?? null;
      (db.customers as any[]).forEach((c: any, idx, arr) => {
        if (c.id === id) {
          arr[idx] = {
            ...c,
            approval_status: action,
            review_comments: comments,
            reviewed_by: currentUser?.id ?? 'demo-user-id',
            approved_at: action === 'approved' ? new Date().toISOString() : null,
          };
        }
      });
      return Promise.resolve({ data: true, error: null });
    }
    return Promise.resolve({ data: [], error: null });
  },
  __seed(partial: Partial<typeof db>) {
    // merge seed data; append arrays
    (Object.keys(partial) as Array<TableName>).forEach((table) => {
      const incoming = (partial as any)[table];
      if (Array.isArray(incoming)) {
        (db[table] as any[]).push(...incoming);
      }
    });
  },
};