-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create the timeline_events table
create table public.timeline_events (
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

-- Enable RLS for timeline_events
alter table public.timeline_events enable row level security;

-- RLS Policies for timeline_events
create policy "Users can view own timeline events"
  on public.timeline_events for select
  using ( auth.uid() = patient_id );

create policy "Clinicians can view all timeline events"
  on public.timeline_events for select
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'clinician'
    )
  );

-- Create the insight_provenance table
create table public.insight_provenance (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.timeline_events(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  source_snippet text not null,
  confidence_score float check (confidence_score >= 0.0 and confidence_score <= 1.0),
  created_at timestamp with time zone default now()
);

-- Enable RLS for insight_provenance
alter table public.insight_provenance enable row level security;

-- RLS Policies for insight_provenance
create policy "Users can view own provenance"
  on public.insight_provenance for select
  using ( 
    exists (
      select 1 from public.timeline_events
      where timeline_events.id = insight_provenance.event_id and timeline_events.patient_id = auth.uid()
    )
  );

create policy "Clinicians can view all provenance"
  on public.insight_provenance for select
  using ( 
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'clinician'
    )
  );

-- Create the vector search RPC function
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
