-- AI School Guardian — Supabase setup for Hackathon Demo
-- Run this in Supabase SQL Editor.

create table if not exists public.school_guardian_cases (
  id text primary key,
  student_id text not null,
  grade text,
  type text,
  incident text,
  urgency text,
  location text,
  privacy text,
  ai_risk text,
  ai_analysis text,
  status text not null default 'NEW',
  teacher text,
  notes text,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  accepted_at timestamptz
);

alter table public.school_guardian_cases enable row level security;

grant select, insert, update on public.school_guardian_cases to anon;

drop policy if exists "Hackathon demo read" on public.school_guardian_cases;
drop policy if exists "Hackathon demo insert" on public.school_guardian_cases;
drop policy if exists "Hackathon demo update" on public.school_guardian_cases;

create policy "Hackathon demo read"
on public.school_guardian_cases for select to anon using (true);

create policy "Hackathon demo insert"
on public.school_guardian_cases for insert to anon with check (true);

create policy "Hackathon demo update"
on public.school_guardian_cases for update to anon using (true) with check (true);

-- Enable Realtime for cross-device updates.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'school_guardian_cases') then
    alter publication supabase_realtime add table public.school_guardian_cases;
  end if;
end $$;
