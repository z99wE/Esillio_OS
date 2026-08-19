-- Phase 7: Usage-Aware AI Budgeting

-- 1. USAGE LEDGER TABLE
-- We create this table properly here instead of relying on local mocks.
create table if not exists public.usage_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  action text not null,
  credits int not null default 1,
  cost_usd numeric(10, 6) default 0.0,
  prompt_tokens int default 0,
  completion_tokens int default 0,
  status text default 'consumed',
  metadata jsonb default '{}'::jsonb,
  usage_date date not null default current_date,
  created_at timestamp with time zone default now()
);

-- Index for fast daily usage aggregation
create index if not exists idx_usage_ledger_user_date on public.usage_ledger(user_id, usage_date);

alter table public.usage_ledger enable row level security;

do $$ begin
  create policy "Users can view their own usage" on public.usage_ledger for select using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Service role can insert usage" on public.usage_ledger for insert with check (true);
exception when duplicate_object then null; end $$;

-- 2. LLM KEYS TABLE
-- For Admin Key Pool and User BYOK
create table if not exists public.llm_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade, -- NULL = System/Admin key
  provider text not null default 'openai',
  api_key text not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

alter table public.llm_keys enable row level security;

-- Users can only see and manage their own keys
do $$ begin
  create policy "Users can manage own keys" on public.llm_keys 
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Admins can view and manage system keys (where user_id is null)
do $$ begin
  create policy "Admins can manage system keys" on public.llm_keys 
  for all using (
    user_id is null and exists (
      select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
exception when duplicate_object then null; end $$;
