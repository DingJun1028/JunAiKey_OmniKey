import { OmniKeyApiRune } from '../types/OmniKeyApiSchema';

export const omniKeyRunes: OmniKeyApiRune[] = [
  {
    name: "Straico AI API",
    auth_type: "Token",
    endpoint_base: "https://api.straico.com/", // Representative base URL
    methods_supported: "REST (Prompt / Workflow)",
    rate_limit: "Standard", // Placeholder
    metadata_keys: [], // Placeholder
    sync_direction: "unidirectional", // Assuming standard API call is unidirectional
    agent_type: "controller", // Based on description
  },
  {
    name: "Pollinations API",
    auth_type: "No authentication required",
    endpoint_base: "https://pollinations.ai/", // Representative base URL
    methods_supported: "GET /prompt/{text}",
    rate_limit: "Unknown", // Placeholder
    metadata_keys: [], // Placeholder
    sync_direction: "unidirectional", // Assuming image generation is unidirectional
    agent_type: "executor", // Assuming it executes image generation
  },
  {
    name: "OpenAI GPT API",
    auth_type: "API Key",
    endpoint_base: "https://api.openai.com/v1/", // Representative base URL
    methods_supported: "Completion / Chat API",
    rate_limit: "Varies by plan", // Placeholder
    metadata_keys: [], // Placeholder
    sync_direction: "unidirectional", // Assuming standard API call is unidirectional
    agent_type: "executor", // Assuming it executes text generation/analysis
  },
  {
    name: "Chat X API",
    auth_type: "Secret Token",
    endpoint_base: "https://chatx.example.com/api/", // Placeholder representative base URL
    methods_supported: "POST /message",
    rate_limit: "Unknown", // Placeholder
    metadata_keys: [], // Placeholder
    sync_direction: "bidirectional", // Assuming interaction engine implies bidirectional
    agent_type: "executor", // Assuming it executes message interactions
  },
  {
    name: "Capacities API",
    auth_type: "Access Token",
    endpoint_base: "capacities://", // Representative X-Callback/REST base
    methods_supported: "X-Callback / REST",
    rate_limit: "Unknown", // Placeholder
    metadata_keys: ["note_id"], // Example placeholder
    sync_direction: "bidirectional", // Based on description
    agent_type: "executor", // Assuming it executes sync/update tasks
  },
  {
    name: "Notion API",
    auth_type: "Integration Token",
    endpoint_base: "https://api.notion.com/v1/", // Representative base URL
    methods_supported: "REST + Webhook",
    rate_limit: "Varies", // Placeholder
    metadata_keys: [], // Placeholder
    sync_direction: "bidirectional", // Based on description
    agent_type: "executor", // Assuming it executes integration tasks
  },
  {
    name: "Boost.space API",
    auth_type: "Bearer Token",
    endpoint_base: "https://api.boost.space/", // Representative base URL
    methods_supported: "REST + Webhook response",
    rate_limit: "Unknown", // Placeholder
    metadata_keys: [], // Placeholder
    sync_direction: "bidirectional", // Based on description
    agent_type: "executor", // Assuming it executes automation/webhook tasks
  },
  {
    name: "InfoFlow API",
    auth_type: "JWT",
    endpoint_base: "https://infoflow.example.com/api/", // Placeholder representative base URL
    methods_supported: "REST + webhook upload",
    rate_limit: "Unknown", // Placeholder
    metadata_keys: [], // Placeholder
    sync_direction: "bidirectional", // Assuming event management and uploads are bidirectional
    agent_type: "logger", // Assuming it handles event logging and storage
  },
  {
    name: "Supabase API",
    auth_type: "Service Key",
    endpoint_base: "https://your-supabase-url.supabase.co/rest/v1/", // Representative base URL
    methods_supported: "SQL API + Realtime Sync",
    rate_limit: "Varies by plan", // Placeholder
    metadata_keys: [], // Placeholder
    sync_direction: "bidirectional", // Based on description (storage and realtime sync)
    agent_type: "logger", // Based on description (storage and monitoring)
  },
  {
    name: "Taskade API",
    auth_type: "API Token",
    endpoint_base: "https://api.taskade.com/v1/", // Representative base URL
    methods_supported: "REST",
    rate_limit: "Unknown", // Placeholder
    metadata_keys: [], // Placeholder
    sync_direction: "bidirectional", // Based on description (task and sync agent)
    agent_type: "executor", // Assuming it executes task/sync operations
  },
  {
    name: "Scripting.App API",
    auth_type: "No additional API required",
    endpoint_base: "scriptingapp://", // Representative URL scheme
    methods_supported: "JS Trigger / Shortcut URL",
    rate_limit: "Device dependent", // Placeholder
    metadata_keys: [], // Placeholder
    sync_direction: "unidirectional", // Assuming triggers/URLs are primarily unidirectional
    agent_type: "controller", // Assuming it can act as a trigger/controller
  },
];