-- 5. CLINICIAN-APPROVED EDUCATION (Phase 4)

-- Create the education_cards table
create table if not exists public.education_cards (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.profiles(id) on delete cascade,
  clinician_id uuid references public.profiles(id) on delete set null,
  title text not null,
  content_md text not null,
  status text not null check (status in ('draft', 'approved', 'stale')),
  version int default 1,
  previous_version_id uuid references public.education_cards(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.education_cards enable row level security;

-- Policies for patients
do $$ begin
  create policy "Patients can view their own approved education" on public.education_cards for select 
  using (auth.uid() = patient_id and status = 'approved');
exception when duplicate_object then null; end $$;

-- Policies for clinicians
do $$ begin
  create policy "Clinicians can view all education cards" on public.education_cards for select 
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'clinician'));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Clinicians can insert education cards" on public.education_cards for insert 
  with check (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'clinician'));
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Clinicians can update education cards" on public.education_cards for update 
  using (exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role = 'clinician'));
exception when duplicate_object then null; end $$;

-- Update trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_education_cards_updated_at on public.education_cards;
create trigger set_education_cards_updated_at
  before update on public.education_cards
  for each row
  execute procedure public.handle_updated_at();
