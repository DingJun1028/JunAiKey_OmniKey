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
  source text, -- 新增：紀錄來源（如 vscode, api, web, ...）
  user_id text, -- 新增：多用戶支援
  status text, -- 新增：pending/actioned/dismissed
  embedding vector(1536), -- 新增：AI 向量搜尋（如有安裝 pgvector）
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

create index if not exists idx_developer_memoirs_session_id on developer_memoirs(session_id);
create index if not exists idx_developer_memoirs_auto_tags on developer_memoirs using gin(auto_tags);
create index if not exists idx_developer_memoirs_user_id on developer_memoirs(user_id);
create index if not exists idx_developer_memoirs_status on developer_memoirs(status);
-- 若有安裝 pgvector，建議加上 embedding 的向量索引
-- create index if not exists idx_developer_memoirs_embedding on developer_memoirs using ivfflat (embedding vector_cosine_ops);
