-- =============================================================================
-- Esillio OS — missing tables migration
--
-- Creates the 4 tables the backend expects but which are absent from this
-- Supabase project: llm_keys, patient_shares, document_shares, waitlist.
--
-- Run in: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run
-- Idempotent: safe to run more than once.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- llm_keys — BYOK / managed LLM provider keys
-- user_id IS NULL  => platform-managed key (admin scope)
-- user_id NOT NULL => per-user BYOK key
-- -----------------------------------------------------------------------------
create table if not exists public.llm_keys (
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid references auth.users (id) on delete cascade,
    provider   text    not null default 'openai',
    api_key    text    not null,
    is_active  boolean not null default true,
    created_at timestamptz not null default now()
);

alter table public.llm_keys enable row level security;

create policy "users manage own llm keys"
    on public.llm_keys
    for all
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- patient_shares — profile-level sharing (caregiver / clinician)
-- -----------------------------------------------------------------------------
create table if not exists public.patient_shares (
    id                  uuid primary key default gen_random_uuid(),
    patient_id          uuid not null references auth.users (id) on delete cascade,
    shared_with_email   text not null,
    -- FK -> public.profiles (not auth.users) so `select("*, profiles(email)")` embeds work
    shared_with_user_id uuid references public.profiles (id) on delete set null,
    access_level        text not null
                        check (access_level in ('caregiver', 'clinician', 'summary_only')),
    expires_at          timestamptz,
    created_at          timestamptz not null default now()
);

alter table public.patient_shares enable row level security;

create policy "patients manage own shares"
    on public.patient_shares
    for all
    using (patient_id = auth.uid())
    with check (patient_id = auth.uid());

create policy "recipients view shares granted to them"
    on public.patient_shares
    for select
    using (shared_with_user_id = auth.uid());

-- -----------------------------------------------------------------------------
-- document_shares — per-document sharing (backend service-role only)
-- RLS enabled with no policies: only the backend (service role) touches this.
-- -----------------------------------------------------------------------------
create table if not exists public.document_shares (
    id               uuid primary key default gen_random_uuid(),
    document_id      uuid not null references public.documents (id) on delete cascade,
    shared_with_email text not null,
    expires_at       timestamptz,
    created_at       timestamptz not null default now()
);

alter table public.document_shares enable row level security;

-- -----------------------------------------------------------------------------
-- waitlist — public signup interest list (anon insert, service-role read)
-- -----------------------------------------------------------------------------
create table if not exists public.waitlist (
    id         uuid primary key default gen_random_uuid(),
    email      text not null,
    created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

create policy "anyone can join waitlist"
    on public.waitlist
    for insert
    to anon, authenticated
    with check (true);
