-- MASTER SCHEMA INITIALIZATION SCRIPT FOR ESILLIO OS
-- Run this entire file in the Supabase SQL Editor.

-- 1. PROFILES TABLE (Phase 2)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text default 'patient',
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

do $$ begin
  create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);
exception when duplicate_object then null; end $$;


-- 2. DOCUMENTS TABLE (Phase 2)
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  file_name text not null,
  file_path text not null,
  file_size_bytes bigint,
  content_type text,
  created_at timestamp with time zone default now()
);

alter table public.documents enable row level security;

do $$ begin
  create policy "Users can view own documents" on public.documents for select using (auth.uid() = patient_id);
exception when duplicate_object then null; end $$;


-- 3. AUDIT LOGS TABLE (Phase 2)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  resource text not null,
  details jsonb default '{}'::jsonb,
  ip_address text,
  created_at timestamp with time zone default now()
);

alter table public.audit_logs enable row level security;

do $$ begin
  create policy "Admins can view audit logs" on public.audit_logs for select 
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'admin'));
exception when duplicate_object then null; end $$;


-- 4. TIMELINE EVENTS AND PROVENANCE (Phase 3)
-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the timeline_events table
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  document_id uuid references public.documents(id) on delete set null,
  event_date timestamp with time zone,
  event_type text not null check (event_type in ('diagnosis', 'medication', 'lab_result', 'procedure', 'note', 'vitals')),
  title text not null,
  clinical_data jsonb default '{}'::jsonb,
  embedding vector(1536), -- Assuming OpenAI text-embedding-3-small or text-embedding-ada-002
  created_at timestamp with time zone default now()
);

alter table public.timeline_events enable row level security;

do $$ begin
  create policy "Users can view own timeline events" on public.timeline_events for select using (auth.uid() = patient_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Clinicians can view all timeline events" on public.timeline_events for select 
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'clinician'));
exception when duplicate_object then null; end $$;

-- Create the insight_provenance table
create table if not exists public.insight_provenance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.timeline_events(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  source_snippet text not null,
  confidence_score float check (confidence_score >= 0.0 and confidence_score <= 1.0),
  created_at timestamp with time zone default now()
);

alter table public.insight_provenance enable row level security;

do $$ begin
  create policy "Users can view own provenance" on public.insight_provenance for select 
  using (exists (select 1 from public.timeline_events where timeline_events.id = insight_provenance.event_id and timeline_events.patient_id = auth.uid()));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Clinicians can view all provenance" on public.insight_provenance for select 
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'clinician'));
exception when duplicate_object then null; end $$;

-- Create the vector search RPC function (Phase 3)
create or replace function match_timeline_events(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  p_id uuid
)
returns table (
  id uuid,
  patient_id uuid,
  document_id uuid,
  event_date timestamp with time zone,
  event_type text,
  title text,
  clinical_data jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    timeline_events.id,
    timeline_events.patient_id,
    timeline_events.document_id,
    timeline_events.event_date,
    timeline_events.event_type,
    timeline_events.title,
    timeline_events.clinical_data,
    1 - (timeline_events.embedding <=> query_embedding) as similarity
  from timeline_events
  where timeline_events.patient_id = p_id
    and 1 - (timeline_events.embedding <=> query_embedding) > match_threshold
  order by timeline_events.embedding <=> query_embedding
  limit match_count;
end;
$$;
