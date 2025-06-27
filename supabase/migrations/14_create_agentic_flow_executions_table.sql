```sql
-- supabase/migrations/14_create_agentic_flow_executions_table.sql
-- Create the agentic_flow_executions table to store execution history

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.agentic_flow_executions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  flow_id uuid REFERENCES public.agentic_flows (id) ON DELETE CASCADE NOT NULL, -- Link to the executed flow
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL, -- Link to the user who ran the flow
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'in-progress', 'completed', 'failed', 'paused', 'cancelled'
  start_timestamp timestamp with time zone DEFAULT now() NOT NULL,
  completion_timestamp timestamp with time zone,
  -- Store a summary or log of the execution
  -- A full log might be stored elsewhere or generated on demand
  execution_log_summary text,
  -- Store the final result or error details
  result jsonb,
  error text,
  -- Optional: Store the ID of the current node during execution
  current_node_id text -- References node_id_in_flow from agentic_flow_nodes
);

-- Add indexes for common query patterns
CREATE INDEX idx_agentic_flow_executions_flow_id ON public.agentic_flow_executions (flow_id);
CREATE INDEX idx_agentic_flow_executions_user_id ON public.agentic_flow_executions (user_id);
CREATE INDEX idx_agentic_flow_executions_status ON public.agentic_flow_executions (status);
CREATE INDEX idx_agentic_flow_executions_start_timestamp ON public.agentic_flow_executions (start_timestamp);

-- Optional: Set up Row Level Security (RLS) for agentic_flow_executions
ALTER TABLE public.agentic_flow_executions ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Users should only be able to read/manage their own flow executions.
CREATE POLICY "Enable read access for users on their own flow executions" ON public.agentic_flow_executions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users on their own flow executions" ON public.agentic_flow_executions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users on their own flow executions" ON public.agentic_flow_executions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users on their own flow executions" ON public.agentic_flow_executions FOR DELETE USING (auth.uid() = user_id);
```