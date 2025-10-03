## Elite Wealth — Full Project Documentation

### 1) Project overview
- **Name**: Elite Wealth (Frontend-only)
- **Purpose**: Internal back-office tool to onboard investors and agents, manage investment plans and company investments, and track payments. Includes approval workflows and PII safety.
- **Stack**: Vite, React, TypeScript, Tailwind, shadcn/ui, TanStack Query
- **Backend**: Not required in local/demo. A Supabase-like client is mocked in-memory to simulate tables, queries, and RPCs.

Quick start
- Node 18+ recommended
- Install: `npm i`
- Dev server: `npm run dev`
- Build: `npm run build` then `npm run preview`

Repo highlights
- Routing: React Router SPA with protected routes and role gates
- UI kit: shadcn/ui + Tailwind
- Data: Mocked Supabase client with demo seed; can be swapped for real SDK/API


### 2) Architecture and directories
- `src/contexts/AuthContext.tsx`: Mock auth/session + demo role switching
- `src/integrations/supabase/client.ts`: In-memory Supabase-like client (tables, simple filters, RPCs)
- `src/integrations/supabase/types.ts`: Strongly-typed Supabase schema
- `src/lib/profileRepo.ts`: Profile CRUD access layer
- `src/lib/customerRepo.ts`: Investor+Plan data access and secure approval RPC
- `src/lib/demoSeed.ts`: Seeds plans, customers (investors), agents, company investments, and payment schedules
- `src/components/*`: Layout, security notices, protected routes
- `src/pages/*`: Functional screens (Investors, Plans, Payments, Agents, Investments, Gifts, Agent Payments, Investment Payments, Dashboard)

Runtime data source
- Frontend seeds in-memory DB on app load (`seedDemoData()` in `src/main.tsx`).
- All “CRUD” calls operate on the in-memory store (no persistence across reloads).


### 3) Domain model and relationships
The application revolves around six core domains, with two auxiliary domains for payment/gifts.

Core entities (implemented)
- Profiles
- Plans
- Customers (Investors)
- Payment Schedules (customer payments)
- Agents
- Company Investments

Auxiliary (UI implemented, backend proposed)
- Investment Payments (for company investments)
- Agent Payments and Gifts (rewards/bonus/gifts for agents)

Required relationships (as requested)
- Plans ↔ Investors ↔ Payments
  - An Investor selects a Plan.
  - Payment Schedules are generated for the Investor and reference the Investor.
- Investments ↔ Investment Payments
  - Company Investments should have associated Investment Payments (e.g., returns/dividends). UI exists; backend table proposed.
- Agents ↔ Agent Payments ↔ Gifts
  - Agents earn commissions; those commissions form Agent Payments. Gifts/Reward Plans define conditional rewards; UI exists; backend tables proposed.

High-level ER diagram (implemented + proposed)

  Plans (id)
    ├── Customers/Investors (plan_id → Plans.id)
    │      └── PaymentSchedules (customer_id → Customers.id)
    └── CompanyInvestments (plan_id → Plans.id)
           └── CompanyInvestmentPayments (investment_id → CompanyInvestments.id)   [proposed]

  Agents (id)
    ├── AgentPayments (agent_id → Agents.id)                                       [proposed]
    └── AgentRewardPlans (optional plan-to-agent assignments)                       [proposed]
           └── AgentRewards/Awards (agent_id, reward_plan_id)                       [proposed]

Why these three groups must be related
- Plans ↔ Investors ↔ Payments: The Plan chosen by an Investor sets investment terms and influences the Payment Schedule (amount/dates). Payments are always attributable to a specific Investor, who is enrolled in a Plan.
- Investments ↔ Investment Payments: Each Company Investment may produce its own return schedule (dividends, coupons). Those payments belong to that specific investment.
- Agents ↔ Agent Payments ↔ Gifts: Agent commissions (Agent Payments) result from onboarded investors or investment volumes. Gifts/Reward Plans define extra incentives (e.g., bonus % or physical gifts) tied to agent performance and should be tracked with the same payment cycle.


### 4) Data dictionary (frontend expectations)
Implemented tables (mocked in-memory)
- profiles
  - id, user_id, email, first_name, last_name, role('super_admin'|'manager'|'office_staff'), created_at, updated_at
- plans
  - id, name, segment('PRE-IPO'|'REAL ESTATE'|'DIRECT'), investment_amount, duration_months, return_percentage, is_active, created_at, updated_at, created_by, terms_document_url?
- customers (investors)
  - id, first_name, last_name, email, phone, address, pan_number, aadhar_number, plan_id(FK), investment_amount,
    approval_status('pending'|'approved'|'rejected'), submitted_by, reviewed_by?, review_comments?, approved_at?, created_at, images?: string[]
- payment_schedules (customer payments)
  - id, customer_id(FK customers.id), amount, payment_date(YYYY-MM-DD), is_paid, paid_at?, created_at, payment_type (free text), transaction_id?, images?: string[]
- agents
  - id, first_name, last_name, email, phone, address, pan_number, commission_percentage, agent_type?('main'|'sub'), parent_agent_id?,
    approval_status, submitted_by, reviewed_by?, review_comments?, approved_at?, created_at, images?: string[]
- company_investments
  - id, investment_name, description?, investment_amount, expected_return?, investment_date(YYYY-MM-DD), plan_id(FK),
    approval_status, submitted_by, reviewed_by?, review_comments?, approved_at?, created_at, images?: string[]

Proposed additional tables (to back the existing UI pages)
- company_investment_payments
  - id, investment_id(FK company_investments.id), amount, payment_date, is_received, received_at?, payment_type, transaction_id?, images?: string[]
- agent_payments
  - id, agent_id(FK agents.id), base_commission_percentage, amount, achieved_target(bool), reward_type('none'|'commission'|'gift'), reward_value(number|string),
    is_paid(bool), paid_at?, payment_type, transaction_id?, images?: string[]
- reward_plans (gifts)
  - id, name, description, target_investors(number) or target_amount(number), reward_type('BONUS'|'PHYSICAL'), reward_value(string), duration_months(number), is_active(bool)
- agent_reward_assignments
  - id, reward_plan_id(FK reward_plans.id), agent_id(FK agents.id), start_at, end_at, achieved(bool), awarded_at?, awarded_value?

Approval fields (uniform)
- approval_status: 'pending'|'approved'|'rejected'
- reviewed_by: user_id of approver
- review_comments: string|null
- approved_at: timestamp|null
- submitted_by: user_id (creator)


### 5) Roles and access control
- office_staff
  - Create/submit investors, agents, company investments; cannot approve
  - Read lists with PII masking
- manager
  - All of the above + approve/reject
- super_admin
  - Full visibility (including PII), approvals, and admin tooling

PII masking expectations
- BASIC_ACCESS (office_staff): address, pan_number, aadhar_number masked
- FULL_ACCESS (manager, super_admin): full fields visible


### 6) Key user flows
Investors & Plans & Payments
- Create Investor (office_staff) → select Plan → submit
- Approve/Reject Investor (manager/super_admin)
- On Approve: backend generates `payment_schedules` for that investor
- Payments page lists schedules; manager/super_admin can mark as Paid with proof (images, transaction id)

Company Investments & Payments
- Create Company Investment (office_staff)
- Approve/Reject (manager/super_admin)
- On Approve: backend should create `company_investment_payments` (if applicable), which feed the Investment Payments page

Agents & Agent Payments & Gifts
- Create Agent (office_staff)
- Approve/Reject (manager/super_admin)
- On Approve: backend can generate `agent_payments` (based on assigned investors/volume/commission rules)
- Gifts/Reward Plans define bonus % or physical gift targets; assignments to agents become achievements/awards


### 7) Pages and navigation
Route guards
- `ProtectedRoute` enforces authentication and optional role requirements per route

Pages (path → role)
- `/` Dashboard → any authenticated user
  - Stats for customers, agents, investments
  - Upcoming customer payments (15th and end-of-month)
  - Quick actions and PII audit logs
- `/investors` Investors → office_staff/manager/super_admin
  - Create investor, list, approve/reject, view docs
- `/plans` Plans → manager/super_admin
  - Create/activate plans; list with segments, returns, durations
- `/payments` Customer Payments → manager/super_admin
  - List customer `payment_schedules`; view details; mark paid with transaction id and images
- `/investments` Company Investments → manager/super_admin
  - Create, list, approve/reject, view docs
- `/investment-payments` Investment Payments → manager/super_admin
  - UI implemented with demo data; backend table proposed (`company_investment_payments`)
- `/agents` Agents → office_staff/manager/super_admin
  - Create, list, approve/reject, parent/child agent support, view docs
- `/agent-payments` Agent Payments → manager/super_admin
  - UI implemented with demo data; backend tables proposed (`agent_payments`, `reward_plans`, `agent_reward_assignments`)
- `/gifts` Gift & Reward Plans → manager/super_admin
  - UI implemented with demo data; backend `reward_plans` proposed
- `/users` Users → super_admin
- `/auth` Auth → unauthenticated entry


### 8) Supabase integration (mock) and RPCs
Mock client (`src/integrations/supabase/client.ts`)
- Tables: profiles, agents, customers, company_investments, plans, payment_schedules, customer_pii_access_log
- Query chain: `select`, `eq`, `in`, `order`, `limit`, `single`, `insert`, `update`
- RPCs implemented: `get_customer_stats`, `get_customers_by_role`, `approve_customer_secure`
- Seeding: `src/lib/demoSeed.ts`

Swap to real backend
- Keep repository interfaces stable (e.g., `customerRepo`, `profileRepo`)
- Replace mock client calls with real Supabase (or REST) SDK calls
- Move image storage to object storage and store URLs


### 9) API contract (proposed for real backend)
Auth
- POST /auth/sessions → { token, user }
- GET /auth/profile → current user profile

Profiles
- GET /profiles?search=&page=&page_size= → { items: Profile[], total }
- POST /profiles → Create
- PATCH /profiles/:user_id → Update role/names

Investors (customers)
- GET /customers?status=&search=&page=&page_size=&plan_id=
- POST /customers → Create
- POST /customers/:id/approve | /reject → Approval actions

Plans
- GET /plans?is_active=true
- POST /plans
- PATCH /plans/:id → Activate/deactivate/edit

Customer Payment Schedules
- GET /payment-schedules?customer_id=&status=&page=&page_size=
- PATCH /payment-schedules/:id/mark-paid → { payment_type, transaction_id?, images[] }

Company Investments
- GET /investments?status=&search=&page=&page_size=&plan_id=
- POST /investments
- POST /investments/:id/approve | /reject

Company Investment Payments (proposed)
- GET /investment-payments?investment_id=&status=
- PATCH /investment-payments/:id/mark-received → { payment_type, transaction_id?, images[] }

Agents
- GET /agents?status=&search=&page=&page_size=
- POST /agents
- POST /agents/:id/approve | /reject

Agent Payments (proposed)
- GET /agent-payments?agent_id=&status=
- PATCH /agent-payments/:id/mark-paid → { payment_type, transaction_id?, images[] }

Gifts / Reward Plans (proposed)
- GET /reward-plans?is_active=true
- POST /reward-plans
- POST /reward-plans/:id/assign → { agent_id }
- POST /reward-plans/:id/award → { agent_id, awarded_value? }

Dashboard
- GET /stats/customers → { total_customers, pending_approvals, approved_customers, rejected_customers }


### 10) Relationship details and invariants
Plans ↔ Investors
- Each Investor must reference exactly one active Plan at creation
- Plan fields (return %, duration) inform investor’s expected returns and downstream schedules

Investors ↔ Payment Schedules
- Payment Schedules must belong to exactly one Investor
- Only Investors with `approved` status can have schedules generated
- Marking payments as paid requires a payment type and proof when non-cash

Plans ↔ Company Investments
- Each Company Investment references a Plan for strategy alignment

Company Investments ↔ Investment Payments (proposed)
- Each Investment Payment belongs to one Company Investment
- Business rules may generate periodic or event-driven payments

Agents ↔ Agent Payments (proposed)
- Each Agent Payment belongs to one Agent
- Base commission % comes from the agent; reward may add % or attach a gift

Agents ↔ Gifts (Reward Plans) (proposed)
- Reward Plans can be assigned to agents for a timeframe
- Achievements/awards logged upon meeting targets


### 11) Approval workflow
- Applies to Customers, Agents, Company Investments
- Actions: approve or reject (with optional comments)
- On approve: set `approved_at`, `reviewed_by`; trigger schedule generation (customers) or downstream records (agent payments / investment payments, if configured)


### 12) Security, PII, and auditing
- PII masking for non-privileged roles
- Use a server-side `customer_pii_access_log` (already modeled) for reads of sensitive data
- Add `audit_trail` table for CRUD and approval actions (already modeled in types)
- Enforce RBAC at the API layer; never rely on the client
- Validate uploads (mime-type, size, virus scanning) and use time-limited presigned URLs


### 13) Image and document handling
Current
- Stores base64 Data URLs in `images: string[]` fields (demo only)
Production
- Upload to object storage (S3, Supabase Storage), store URLs; never store base64 blobs in DB


### 14) Build, environment, and scripts
Scripts (package.json)
- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run build:dev` — dev-mode build for testing
- `npm run preview` — preview the production build
- `npm run lint` — lint the codebase

Environment
- Frontend-only; no `.env` needed for mock
- When integrating a real backend, provide the base URL and credentials via env (e.g., `VITE_API_BASE_URL` or Supabase keys)


### 15) Testing and QA guidance
- Switch roles on the Auth page (demo buttons) to verify RBAC and PII masking
- Validate approval flows across Customers, Agents, and Company Investments
- Verify payment marking flows include validation for non-cash transactions and images
- Cross-check Dashboard counts vs. list pages


### 16) Roadmap and implementation notes
Short-term
- Replace mock with real Supabase (or REST) for all entities
- Implement `company_investment_payments`, `agent_payments`, `reward_plans`, and `agent_reward_assignments`
- Generate schedules automatically upon approvals (server-side triggers or services)
- Migrate image uploads to object storage with presigned URLs

Mid-term
- Pagination, sorting, and filtering parameters on all list endpoints
- Export CSV/PDF for payments and approvals
- Add mobile-friendly tweaks where necessary (most lists already include mobile cards)

Long-term
- Extend analytics: realized vs. expected returns, cohort performance
- Integrate advanced audit dashboards
- SSO and granular permission sets under RBAC


### 17) Glossary
- Investor/Customer: Individual enrolled into a Plan with an investment amount
- Plan: Investment product with amount, returns, and duration
- Payment Schedule: Planned receivables from an Investor
- Company Investment: Portfolio investment made by the company
- Investment Payment: Receivable/payable associated with a Company Investment
- Agent: Sales representative; may be Main or Sub
- Agent Payment: Commission payout (base + reward)
- Gift/Reward Plan: Incentive program for Agents


### 18) Where relationships appear in the codebase
- Plans ↔ Investors: `src/lib/customerRepo.ts` joins customer plan metadata on list
- Investors ↔ Payment Schedules: `src/pages/Payments.tsx` loads schedules with joined customer info; demo seed creates sample schedules
- Plans ↔ Company Investments: `src/pages/Investments.tsx` creates/updates investments referencing a plan
- Investment Payments (UI-only): `src/pages/InvestmentPayments.tsx`
- Agent Payments and Gifts (UI-only): `src/pages/AgentPayment.tsx`, `src/pages/Gifts.tsx`

This documentation reflects the current frontend-only implementation and defines the concrete relationships you asked for, including the additional payment and gift linkages for investments and agents. It also spells out the minimal backend schema and endpoints needed to make those screens fully functional in production.
