-- Supabase SQL schema for Sacred Codex Record (developer_memoirs)
create table if not exists developer_memoirs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  turn_index integer not null,
  actor text not null check (actor in ('user', 'assistant')),
  content text not null,
  action_intent jsonb default '{}'::jsonb,
  execution_result jsonb default '{}'::jsonb,
  auto_tags text[],
  summary text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_developer_memoirs_session_id on developer_memoirs(session_id);
create index if not exists idx_developer_memoirs_auto_tags on developer_memoirs using gin(auto_tags);
