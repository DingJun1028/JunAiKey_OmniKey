```sql
-- supabase/migrations/16_create_calendar_events_table.sql
-- Create the calendar_events table to store user calendar events

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.calendar_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL, -- Link to user
  title text NOT NULL, -- Event title
  description text, -- Optional description
  start_timestamp timestamp with time zone NOT NULL, -- Event start time
  end_timestamp timestamp with time zone, -- Optional event end time
  all_day boolean DEFAULT false NOT NULL, -- Is it an all-day event?
  location text, -- Optional location
  url text, -- Optional URL related to the event
  source text, -- e.g., 'manual', 'extracted_from_image', 'synced_from_google_calendar'
  tags text[], -- Optional tags
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  -- TODO: Add recurrence rules, attendees, reminders, status (confirmed, cancelled), linked_task_id, linked_kr_id
);

-- Add indexes for common query patterns
CREATE INDEX idx_calendar_events_user_id ON public.calendar_events (user_id);
CREATE INDEX idx_calendar_events_start_timestamp ON public.calendar_events (start_timestamp);
CREATE INDEX idx_calendar_events_end_timestamp ON public.calendar_events (end_timestamp);
CREATE INDEX idx_calendar_events_source ON public.calendar_events (source);

-- Optional: Add a function and trigger to update updated_at on update
CREATE OR REPLACE FUNCTION public.update_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_calendar_events_update
BEFORE UPDATE ON public.calendar_events
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_timestamp();


-- Optional: Set up Row Level Security (RLS)
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Users should only be able to read/manage their own calendar events.
CREATE POLICY "Enable read access for users on their own calendar events" ON public.calendar_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users on their own calendar events" ON public.calendar_events FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users on their own calendar events" ON public.calendar_events FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users on their own calendar events" ON public.calendar_events FOR DELETE USING (auth.uid() = user_id);
```