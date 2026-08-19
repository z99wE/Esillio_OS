-- Supabase pgvector match function for timeline events
create or replace function match_timeline_events (
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
language sql stable
as $$
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
  where 1 - (timeline_events.embedding <=> query_embedding) > match_threshold
    and timeline_events.patient_id = p_id
  order by similarity desc
  limit match_count;
$$;
