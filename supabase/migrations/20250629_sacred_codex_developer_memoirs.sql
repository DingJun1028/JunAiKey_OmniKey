-- Sacred Codex Record (developer_memoirs) 資料表最佳實踐
create table if not exists developer_memoirs (
  id uuid primary key default gen_random_uuid(), -- 唯一識別碼
  session_id text not null,                     -- 對話 Session 分組
  turn_index integer not null,                  -- Session 內順序
  actor text not null check (actor in ('user', 'assistant')), -- 發言者
  content text not null,                        -- 內容
  action_intent jsonb default '{}'::jsonb,      -- AI 行為意圖
  execution_result jsonb default '{}'::jsonb,   -- 執行結果
  auto_tags text[],                             -- 自動標籤
  summary text,                                 -- 摘要
  metadata jsonb default '{}'::jsonb,           -- 彈性元資料
  source text,                                  -- 紀錄來源（如 vscode, api, web...）
  user_id uuid,                                 -- 多用戶支援，建議串接 auth.users(id)
  status text,                                  -- 狀態（pending/actioned/dismissed）
  embedding vector(1536),                       -- AI 向量搜尋（如有安裝 pgvector）
  updated_at timestamptz default now(),         -- 更新時間
  created_at timestamptz default now()          -- 建立時間
);

-- 建立索引
create index if not exists idx_developer_memoirs_session_id on developer_memoirs(session_id);
create index if not exists idx_developer_memoirs_auto_tags on developer_memoirs using gin(auto_tags);
create index if not exists idx_developer_memoirs_user_id on developer_memoirs(user_id);
create index if not exists idx_developer_memoirs_status on developer_memoirs(status);
-- 若有安裝 pgvector，建議加上 embedding 的向量索引
-- create index if not exists idx_developer_memoirs_embedding on developer_memoirs using ivfflat (embedding vector_cosine_ops);

-- 建議：啟用 Row Level Security（RLS）與權限 policy
-- alter table developer_memoirs enable row level security;
-- create policy "Users can view their own memoirs." on developer_memoirs for select using (auth.uid() = user_id);
-- create policy "Users can insert their own memoirs." on developer_memoirs for insert with check (auth.uid() = user_id);
