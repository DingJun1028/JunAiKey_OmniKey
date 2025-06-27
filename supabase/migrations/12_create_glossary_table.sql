```sql
-- supabase/migrations/12_create_glossary_table.sql
-- Create the glossary table to store terms and definitions

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.glossary (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  term text NOT NULL UNIQUE, -- The term or phrase (ensure uniqueness)
  definition text NOT NULL, -- A clear explanation of the term
  related_concepts text[], -- Array of related term strings (e.g., ['OmniKey', 'Rune'])
  pillar_domain text, -- Which core pillar or domain the term belongs to (e.g., 'Long-term Memory', 'Self-Navigation', 'Bidirectional Sync Domain')
  creation_timestamp timestamp with time zone DEFAULT now() NOT NULL,
  last_updated_timestamp timestamp with time zone DEFAULT now() NOT NULL,
  user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL, -- Optional: User who added/owns the term
  is_public boolean DEFAULT true NOT NULL -- Whether the term is publicly visible

  -- TODO: Add source, tags, version, author_id if needed
);

-- Add indexes for common query patterns
CREATE INDEX idx_glossary_term ON public.glossary (term); -- Index for searching/sorting by term
CREATE INDEX idx_glossary_pillar_domain ON public.glossary (pillar_domain); -- Index for filtering by pillar/domain
CREATE INDEX idx_glossary_user_id ON public.glossary (user_id); -- Index for filtering by user
CREATE INDEX idx_glossary_is_public ON public.glossary (is_public); -- Index for filtering by public status
CREATE INDEX idx_glossary_creation_timestamp ON public.glossary (creation_timestamp); -- Index for sorting by creation time

-- Optional: Add a function and trigger to update last_updated_timestamp on update
CREATE OR REPLACE FUNCTION public.update_last_updated_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated_timestamp = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_glossary_update
BEFORE UPDATE ON public.glossary
FOR EACH ROW EXECUTE FUNCTION public.update_last_updated_timestamp();


-- Optional: Set up Row Level Security (RLS)
ALTER TABLE public.glossary ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Policy for authenticated users to read public terms and their own terms
CREATE POLICY "Enable read access for authenticated users on glossary" ON public.glossary FOR SELECT USING (
  auth.role() = 'authenticated' AND (user_id = auth.uid() OR is_public = true)
);
-- Policy for authenticated users to insert their own terms (if not public)
CREATE POLICY "Enable insert for authenticated users on their own glossary" ON public.glossary FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Policy for authenticated users to update their own terms (if not public)
CREATE POLICY "Enable update for users who created the glossary term" ON public.glossary FOR UPDATE USING (auth.uid() = user_id);
-- Policy for authenticated users to delete their own terms (if not public)
CREATE POLICY "Enable delete for users who created the glossary term" ON public.glossary FOR DELETE USING (auth.uid() = user_id);

-- Optional: Policy for admins to manage all terms (requires role implementation)
-- CREATE POLICY "Enable all access for admins on glossary" ON public.glossary FOR ALL USING (auth.role() = 'admin');

```