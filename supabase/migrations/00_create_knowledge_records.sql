```sql
-- supabase/migrations/00_create_knowledge_records.sql
-- Create the knowledge_records table

-- Enable uuid-ossp extension for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.knowledge_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  answer text NOT NULL,
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  -- Optional: Add a user_id column if you implement authentication
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE, -- Link to user if implementing auth
  source text, -- e.g., 'manual', 'ai-generated', 'web-scrape', 'dev-log', 'chat-history', 'datafied-log', 'journal'
  tags text[],
  embedding_vector vector(1536), -- Example dimension for OpenAI embeddings
  -- Optional: Add fields specific to development logs or datafication
  -- This JSONB field can store structured details about the record's origin or content analysis.
  -- For dev logs, it might include commit info, file paths.
  -- For chat history, it might include conversation ID, turn number, and a datafied summary.
  dev_log_details jsonb,
  -- Optional: Link to another knowledge record (e.g., a datafied summary linking to the raw turn)
  -- related_record_id uuid REFERENCES public.knowledge_records (id) ON DELETE SET NULL -- Add this if you need explicit links between records
  -- --- New: Add is_starred column ---
  is_starred boolean DEFAULT false NOT NULL
  -- --- End New ---
);

-- Optional: Add indexes for better query performance
CREATE INDEX idx_knowledge_records_timestamp ON public.knowledge_records (timestamp);
-- Add a full-text search index on the question and answer columns
-- Combining them into one index is often efficient for Q&A
CREATE INDEX idx_knowledge_records_question_answer_fts ON public.knowledge_records USING GIN (to_tsvector('english', question || ' ' || answer));
-- Add an index for vector similarity search (requires pgvector extension)
-- CREATE INDEX idx_knowledge_records_embedding ON public.knowledge_records USING ivfflat (embedding_vector vector_cosine_ops) WITH (lists = 100); -- Adjust lists based on data size

-- Add index for user_id
CREATE INDEX idx_knowledge_records_user_id ON public.knowledge_records (user_id);
-- Add index for source
CREATE INDEX idx_knowledge_records_source ON public.knowledge_records (source);
-- Add index for dev_log_details type for faster filtering by log type
CREATE INDEX idx_knowledge_records_dev_log_type ON public.knowledge_records ((dev_log_details->>'type'));
-- --- New: Add index for is_starred ---
CREATE INDEX idx_knowledge_records_is_starred ON public.knowledge_records (is_starred);
-- --- End New ---


-- Optional: Set up Row Level Security (RLS)
-- Enable RLS for this table
ALTER TABLE public.knowledge_records ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Policy for authenticated users to read their own records
CREATE POLICY "Enable read access for authenticated users on their own records" ON public.knowledge_records FOR SELECT USING (
  auth.role() = 'authenticated' AND user_id = auth.uid()
);
-- Policy for authenticated users to insert their own records
CREATE POLICY "Enable insert for authenticated users" ON public.knowledge_records FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Policy for authenticated users to update their own records
CREATE POLICY "Enable update for users who created the record" ON public.knowledge_records FOR UPDATE USING (auth.uid() = user_id);
-- Policy for authenticated users to delete their own records
CREATE POLICY "Enable delete for users who created the record" ON public.knowledge_records FOR DELETE USING (auth.uid() = user_id);

-- Optional: Policy for public read access (if some records are public)
-- CREATE POLICY "Enable public read access" ON public.knowledge_records FOR SELECT USING (user_id IS NULL); -- Requires a column to mark public records
```