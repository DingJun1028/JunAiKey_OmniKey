```sql
-- supabase/migrations/15_add_fts_index_to_user_actions.sql
-- Add a full-text search index to the user_actions table for searching details and context

-- Create a text search configuration if needed (optional, 'english' is default)
-- CREATE TEXT SEARCH CONFIGURATION public.my_english_config ( PARSER = pg_catalog."default" );
-- ALTER TEXT SEARCH CONFIGURATION public.my_english_config ALTER MAPPING FOR asciiword, asciihword, hword, hword_asciipart, hword_part, word WITH english.stem;

-- Add a generated column for the text search vector
-- This combines relevant text fields into a single tsvector column
ALTER TABLE public.user_actions
ADD COLUMN fts_vector tsvector GENERATED ALWAYS AS (
  setweight(to_tsvector('english', type), 'A') || -- Boost action type
  setweight(to_tsvector('english', coalesce(details::text, '')), 'B') || -- Details content
  setweight(to_tsvector('english', coalesce(context::text, '')), 'C') -- Context content
) STORED;

-- Create a GIN index on the fts_vector column for efficient full-text search
CREATE INDEX idx_user_actions_fts ON public.user_actions USING GIN (fts_vector);

-- Optional: Update RLS policies if necessary (should already allow read access based on user_id)
-- ALTER POLICY "Enable read access for users on their own actions" ON public.user_actions USING (auth.uid() = user_id);
```