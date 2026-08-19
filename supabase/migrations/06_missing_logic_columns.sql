-- Supabase Migration: 06_missing_logic_columns

-- 1. Add `is_superseded` to timeline_events
ALTER TABLE public.timeline_events 
ADD COLUMN IF NOT EXISTS is_superseded BOOLEAN DEFAULT FALSE;

-- 2. Add `checklist` to tasks for structured action plans
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS checklist JSONB DEFAULT '[]'::jsonb;
