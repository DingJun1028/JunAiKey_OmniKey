```sql
-- supabase/migrations/13_create_knowledge_collections_tables.sql
-- Create tables for Knowledge Collections (Codex Collection)

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the knowledge_collections table
CREATE TABLE public.knowledge_collections (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL, -- Link to user
  creation_timestamp timestamp with time zone DEFAULT now() NOT NULL,
  last_updated_timestamp timestamp with time zone DEFAULT now() NOT NULL
  -- TODO: Add public/private status, cover image, tags, etc.
);

-- Create a join table for many-to-many relationship between knowledge_collections and knowledge_records
CREATE TABLE public.knowledge_collection_records (
  collection_id uuid REFERENCES public.knowledge_collections (id) ON DELETE CASCADE NOT NULL, -- Link to the collection
  record_id uuid REFERENCES public.knowledge_records (id) ON DELETE CASCADE NOT NULL, -- Link to the knowledge record
  added_timestamp timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL, -- Link to user (for RLS on join table)
  PRIMARY KEY (collection_id, record_id) -- Composite primary key
);

-- Add indexes
CREATE INDEX idx_knowledge_collections_user_id ON public.knowledge_collections (user_id);
CREATE INDEX idx_knowledge_collections_creation_timestamp ON public.knowledge_collections (creation_timestamp);
CREATE INDEX idx_knowledge_collection_records_collection_id ON public.knowledge_collection_records (collection_id);
CREATE INDEX idx_knowledge_collection_records_record_id ON public.knowledge_collection_records (record_id);
CREATE INDEX idx_knowledge_collection_records_user_id ON public.knowledge_collection_records (user_id);


-- Optional: Add a function and trigger to update last_updated_timestamp on collection update
CREATE OR REPLACE FUNCTION public.update_collection_last_updated_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated_timestamp = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_knowledge_collections_update
BEFORE UPDATE ON public.knowledge_collections
FOR EACH ROW EXECUTE FUNCTION public.update_collection_last_updated_timestamp();


-- Optional: Set up Row Level Security (RLS) for knowledge_collections and knowledge_collection_records
ALTER TABLE public.knowledge_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_collection_records ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Users should only be able to read/manage their own collections.
CREATE POLICY "Enable read access for users on their own collections" ON public.knowledge_collections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users on their own collections" ON public.knowledge_collections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users on their own collections" ON public.knowledge_collections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users on their own collections" ON public.knowledge_collections FOR DELETE USING (auth.uid() = user_id);

-- Policies for knowledge_collection_records (should be linked to collection RLS and record RLS)
-- Users should only be able to read/manage entries for collections AND records they own.
-- RLS on knowledge_records already ensures users only see their own records.
-- RLS on knowledge_collections ensures users only see their own collections.
-- The join table RLS needs to ensure the user owns *both* the collection and the record linked by the entry.
-- This can be done by checking user_id on the join table itself (if you store it there)
-- OR by joining with the parent tables (less performant).
-- Let's store user_id on the join table for simpler RLS.
CREATE POLICY "Enable read access for users on their collection records" ON public.knowledge_collection_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users on their collection records" ON public.knowledge_collection_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable delete for users on their collection records" ON public.knowledge_collection_records FOR DELETE USING (auth.uid() = user_id);
-- Note: Updates on join table entries are less common, but policies would be similar.
```