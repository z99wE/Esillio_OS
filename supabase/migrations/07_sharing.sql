-- 07_sharing.sql
-- Phase 6: Permissioned Sharing

-- 1. Create Patient Shares Table
create table if not exists public.patient_shares (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  shared_with_email text not null,
  shared_with_user_id uuid references public.profiles(id) on delete set null,
  access_level text not null check (access_level in ('caregiver', 'clinician', 'summary_only')),
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table public.patient_shares enable row level security;

-- Patients can manage their own shares
do $$ begin
  create policy "Patients can manage their own shares" on public.patient_shares
  for all using (auth.uid() = patient_id);
exception when duplicate_object then null; end $$;

-- Shared users can view their own share records
do $$ begin
  create policy "Users can view shares granted to them" on public.patient_shares
  for select using (auth.uid() = shared_with_user_id);
exception when duplicate_object then null; end $$;


-- 2. Create Document Shares Table
create table if not exists public.document_shares (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  shared_with_email text not null,
  shared_with_user_id uuid references public.profiles(id) on delete set null,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table public.document_shares enable row level security;

-- Patients can manage shares for their own documents
do $$ begin
  create policy "Patients can manage shares for own documents" on public.document_shares
  for all using (
    exists (
      select 1 from public.documents 
      where documents.id = document_shares.document_id 
      and documents.patient_id = auth.uid()
    )
  );
exception when duplicate_object then null; end $$;

-- Shared users can view their own document share records
do $$ begin
  create policy "Users can view document shares granted to them" on public.document_shares
  for select using (auth.uid() = shared_with_user_id);
exception when duplicate_object then null; end $$;


-- 3. Extend access to existing tables via sharing

-- DOCUMENTS: Allow access if patient shared (full access) or document specifically shared
do $$ begin
  create policy "Shared users can view documents" on public.documents
  for select using (
    exists (
      select 1 from public.patient_shares ps 
      where ps.patient_id = documents.patient_id 
      and ps.shared_with_user_id = auth.uid() 
      and ps.access_level in ('caregiver', 'clinician')
      and (ps.expires_at is null or ps.expires_at > now())
    )
    OR
    exists (
      select 1 from public.document_shares ds
      where ds.document_id = documents.id
      and ds.shared_with_user_id = auth.uid()
      and (ds.expires_at is null or ds.expires_at > now())
    )
  );
exception when duplicate_object then null; end $$;

-- TIMELINE_EVENTS: Allow access if patient shared (full access)
do $$ begin
  create policy "Shared users can view timeline events" on public.timeline_events
  for select using (
    exists (
      select 1 from public.patient_shares ps 
      where ps.patient_id = timeline_events.patient_id 
      and ps.shared_with_user_id = auth.uid() 
      and ps.access_level in ('caregiver', 'clinician')
      and (ps.expires_at is null or ps.expires_at > now())
    )
  );
exception when duplicate_object then null; end $$;

-- INSIGHT_PROVENANCE: Allow access if patient shared (full access)
do $$ begin
  create policy "Shared users can view provenance" on public.insight_provenance
  for select using (
    exists (
      select 1 from public.timeline_events te
      join public.patient_shares ps on ps.patient_id = te.patient_id
      where te.id = insight_provenance.event_id 
      and ps.shared_with_user_id = auth.uid() 
      and ps.access_level in ('caregiver', 'clinician')
      and (ps.expires_at is null or ps.expires_at > now())
    )
  );
exception when duplicate_object then null; end $$;

-- TASKS: Allow access if patient shared (all access levels including summary_only)
do $$ begin
  create policy "Shared users can view tasks" on public.tasks
  for select using (
    exists (
      select 1 from public.patient_shares ps 
      where ps.patient_id = tasks.user_id 
      and ps.shared_with_user_id = auth.uid() 
      and (ps.expires_at is null or ps.expires_at > now())
    )
  );
exception when duplicate_object then null; end $$;

-- EDUCATION_CARDS: Allow access if patient shared (all access levels including summary_only)
do $$ begin
  create policy "Shared users can view education cards" on public.education_cards
  for select using (
    exists (
      select 1 from public.patient_shares ps 
      where ps.patient_id = education_cards.patient_id 
      and ps.shared_with_user_id = auth.uid() 
      and (ps.expires_at is null or ps.expires_at > now())
    )
  );
exception when duplicate_object then null; end $$;
