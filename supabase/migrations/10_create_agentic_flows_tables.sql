-- supabase/migrations/10_create_agentic_flows_tables.sql
-- Create tables for Agentic Flows (Dynamic DAG Workflows)

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the agentic_flows table
CREATE TABLE public.agentic_flows (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE NOT NULL, -- Link to user
  entry_node_id text NOT NULL, -- ID of the starting node in the 'nodes' array
  status text NOT NULL DEFAULT 'idle', -- 'idle', 'pending', 'in-progress', 'completed', 'failed', 'paused', 'cancelled'
  current_node_id text, -- ID of the currently executing node (for in-progress flows)
  creation_timestamp timestamp with time zone DEFAULT now() NOT NULL,
  start_timestamp timestamp with time zone,
  completion_timestamp timestamp with time zone,
  -- Store execution log and results here or in a separate history table?
  -- For simplicity in MVP, let's add a JSONB column for recent execution history/results
  last_execution_result jsonb -- Stores result/log of the last run
);

-- Create the agentic_flow_nodes table
CREATE TABLE public.agentic_flow_nodes (
  -- Node IDs are defined within the flow JSON, but we need a unique ID for the DB table
  -- Let's use a composite primary key (flow_id, node_id_in_flow) or a generated UUID
  -- Using a generated UUID for simplicity, but need to ensure node_id_in_flow is unique per flow
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  flow_id uuid REFERENCES public.agentic_flows (id) ON DELETE CASCADE NOT NULL, -- Link to the parent flow
  node_id_in_flow text NOT NULL, -- The ID used in the flow's nodes/edges definition (e.g., 'start', 'step-1')
  type text NOT NULL, -- 'task_step', 'decision', 'parallel', 'sub_workflow', 'rune_action', 'ability_execution', 'manual_input'
  description text NOT NULL,
  action jsonb, -- Action configuration for executable nodes
  decision_logic jsonb, -- Logic for decision nodes
  -- Add other node-specific properties (e.g., retry config, timeout)
  CONSTRAINT unique_node_id_per_flow UNIQUE (flow_id, node_id_in_flow) -- Ensure node_id_in_flow is unique within a flow
);

-- Create the agentic_flow_edges table
CREATE TABLE public.agentic_flow_edges (
  -- Edge IDs are defined within the flow JSON, but we need a unique ID for the DB table
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  flow_id uuid REFERENCES public.agentic_flows (id) ON DELETE CASCADE NOT NULL, -- Link to the parent flow
  edge_id_in_flow text NOT NULL, -- The ID used in the flow's edges definition (e.g., 'e1')
  source_node_id text NOT NULL, -- ID of the source node (references node_id_in_flow)
  target_node_id text NOT NULL, -- ID of the target node (references node_id_in_flow)
  condition jsonb, -- Optional condition for conditional edges
  -- Add other edge-specific properties
  CONSTRAINT unique_edge_id_per_flow UNIQUE (flow_id, edge_id_in_flow) -- Ensure edge_id_in_flow is unique within a flow
  -- Optional: Add foreign key constraints referencing node_id_in_flow within the same flow?
  -- This is complex with text IDs and requires triggers or functions to enforce.
  -- For MVP, rely on application-level validation.
);

-- Add indexes
CREATE INDEX idx_agentic_flows_user_id ON public.agentic_flows (user_id);
CREATE INDEX idx_agentic_flows_status ON public.agentic_flows (status);
CREATE INDEX idx_agentic_flows_creation_timestamp ON public.agentic_flows (creation_timestamp);
CREATE INDEX idx_agentic_flow_nodes_flow_id ON public.agentic_flow_nodes (flow_id);
CREATE INDEX idx_agentic_flow_nodes_node_id_in_flow ON public.agentic_flow_nodes (node_id_in_flow); -- Index for faster lookups by node_id_in_flow
CREATE INDEX idx_agentic_flow_edges_flow_id ON public.agentic_flow_edges (flow_id);
CREATE INDEX idx_agentic_flow_edges_source_node_id ON public.agentic_flow_edges (source_node_id);
CREATE INDEX idx_agentic_flow_edges_target_node_id ON public.agentic_flow_edges (target_node_id);


-- Optional: Set up Row Level Security (RLS) for agentic_flows, agentic_flow_nodes, agentic_flow_edges
ALTER TABLE public.agentic_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agentic_flow_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agentic_flow_edges ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (adjust based on your auth requirements)
-- Users should only be able to read/manage their own flows, nodes, and edges.
CREATE POLICY "Enable read access for users on their own agentic flows" ON public.agentic_flows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Enable insert for authenticated users on their own agentic flows" ON public.agentic_flows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable update for users who created the agentic flow" ON public.agentic_flows FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Enable delete for users who created the agentic flow" ON public.agentic_flows FOR DELETE USING (auth.uid() = user_id);

-- Policies for agentic_flow_nodes (should be linked to flow RLS)
CREATE POLICY "Enable read access for users on nodes of their own flows" ON public.agentic_flow_nodes FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM public.agentic_flows WHERE id = flow_id)
);
CREATE POLICY "Enable insert for authenticated users on nodes of their own flows" ON public.agentic_flow_nodes FOR INSERT WITH CHECK (
  auth.uid() = (SELECT user_id FROM public.agentic_flows WHERE id = flow_id)
);
CREATE POLICY "Enable update for users on nodes of their own flows" ON public.agentic_flow_nodes FOR UPDATE USING (
  auth.uid() = (SELECT user_id FROM public.agentic_flows WHERE id = flow_id)
);
CREATE POLICY "Enable delete for users on nodes of their own flows" ON public.agentic_flow_nodes FOR DELETE USING (
  auth.uid() = (SELECT user_id FROM public.agentic_flows WHERE id = flow_id)
);

-- Policies for agentic_flow_edges (should be linked to flow RLS)
CREATE POLICY "Enable read access for users on edges of their own flows" ON public.agentic_flow_edges FOR SELECT USING (
  auth.uid() = (SELECT user_id FROM public.agentic_flows WHERE id = flow_id)
);
CREATE POLICY "Enable insert for authenticated users on edges of their own flows" ON public.agentic_flow_edges FOR INSERT WITH CHECK (
  auth.uid() = (SELECT user_id FROM public.agentic_flows WHERE id = flow_id)
);
CREATE POLICY "Enable update for users on edges of their own flows" ON public.agentic_flow_edges FOR UPDATE USING (
  auth.uid() = (SELECT user_id FROM public.agentic_flows WHERE id = flow_id)
);
CREATE POLICY "Enable delete for users on edges of their own flows" ON public.agentic_flow_edges FOR DELETE USING (
  auth.uid() = (SELECT user_id FROM public.agentic_flows WHERE id = flow_id)
);