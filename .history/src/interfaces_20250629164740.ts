```typescript
// src/interfaces.ts
// Jun.Ai.Key System Interfaces
// Defines the data structures used throughout the system.

// --- Core Data Pillars ---
import { MemoirArchiver } from './core/services/memoirArchiver';

// Long-term Memory (\\u6c38\\u4e45\\u8a18\\u61b6)
export interface KnowledgeRecord {
  id: string;
  user_id: string; // Link to the user who owns this record
  question: string; // The question part (or title/summary)
  answer: string; // The answer part (or content)
  timestamp: string; // ISO 8601 format
  source?: string; // e.g., 'manual', 'ai-generated', 'web-scrape', 'dev-log', 'chat-history', 'datafied-log', 'journal', 'visual-reading', 'file-analysis', 'web-analysis'
  tags?: string[]; // Optional tags for categorization
  embedding_vector?: number[]; // Vector embedding for semantic search (stored in DB as vector type)
  dev_log_details?: any; // JSONB for details specific to dev logs or datafication
  is_starred?: boolean; // Whether the record is starred
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the content
  // --- End New ---
}

export interface KnowledgeCollection {
  id: string;
  user_id: string; // Link to the user who owns this collection
  name: string;
  description?: string;
  creation_timestamp: string;
  last_updated_timestamp: string;
  // TODO: Add public/private status, cover image, tags, etc.
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Primary language of the collection
  // --- End New ---
}

export interface KnowledgeRelation {
  id: string;
  user_id: string; // Link to the user who owns this relation
  source_record_id: string; // ID of the source knowledge record
  target_record_id: string; // ID of the target knowledge record
  relation_type: string; // e.g., 'related', 'prerequisite', 'follow-up', 'contradicts', 'supports', 'example', 'derived_from'
  details?: any; // Optional JSONB for details about the relation
  creation_timestamp: string;
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the relation description/details
  // --- End New ---
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  related_concepts?: string[]; // Array of related term strings
  pillar_domain?: string; // Which core pillar or domain the term belongs to
  creation_timestamp: string;
  last_updated_timestamp: string;
  user_id?: string; // Optional: User who added/owns the term
  is_public: boolean; // Whether the term is publicly visible
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the term and definition
  // --- End New ---
}


// Self-Navigation (\\u81ea\\u6211\\u5c0e\\u822a)
export interface Task {
  id: string;
  user_id: string; // Link to the user who owns this task
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'paused' | 'cancelled';
  current_step_index: number; // Index of the current step being executed
  creation_timestamp: string;
  start_timestamp: string | null; // When the task started execution
  completion_timestamp: string | null; // When the task completed, failed, or was cancelled
  error?: string; // Error message if status is 'failed'
  steps: TaskStep[]; // Array of task steps (nested or joined)
  linked_task_ids?: string[]; // Optional: Link to other tasks (e.g., sub-tasks)
  linked_kr_id?: string | null; // Optional: Link to a Key Result
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the task description and steps
  // --- End New ---
}

export interface TaskStep {
  id: string;
  task_id: string; // Link to the parent task
  step_order: number; // Order of the step within the task
  description: string; // Description of the step
  action: ActionIntent; // The action to perform for this step
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped' | 'waiting_input'; // Status of the step
  result?: any; // Result of the action execution (JSONB)
  error?: string; // Error message if status is 'failed'
  start_timestamp: string | null; // When the step started execution
  end_timestamp: string | null; // When the step completed or failed
  // --- New: Add language field (optional, can inherit from task) ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the step description
  // --- End New ---
}

export interface AgenticFlow {
  id: string;
  user_id: string; // Link to the user who owns this flow
  name: string;
  description?: string;
  entry_node_id: string; // ID of the starting node in the 'nodes' array
  status: 'idle' | 'pending' | 'in-progress' | 'completed' | 'failed' | 'paused' | 'cancelled';
  current_node_id: string | null; // ID of the currently executing node (for in-progress flows)
  creation_timestamp: string;
  start_timestamp: string | null;
  completion_timestamp: string | null;
  last_execution_result?: any; // JSONB - Stores result/log of the last run
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the flow name, description, nodes, and edges
  // --- End New ---
}

export interface AgenticFlowNode {
  id: string; // DB UUID
  flow_id: string; // Link to parent flow
  node_id_in_flow: string; // The ID used in the flow's nodes/edges definition (e.g., 'start', 'step-1')
  type: string; // 'task_step', 'decision', 'parallel', 'sub_workflow', 'rune_action', 'ability_execution', 'manual_input'
  description: string; // Description of the node
  action?: ActionIntent; // Action configuration for executable nodes
  decision_logic?: any; // Logic for decision nodes (JSONB)
  // --- New: Add language field (optional, can inherit from flow) ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the node description
  // --- End New ---
}

export interface AgenticFlowEdge {
  id: string; // DB UUID
  flow_id: string; // Link to parent flow
  edge_id_in_flow?: string; // The ID used in the flow's edges definition (e.g., 'e1') - Optional, can be generated
  source_node_id: string; // ID of the source node (references node_id_in_flow)
  target_node_id: string; // ID of the target node (references node_id_in_flow)
  condition?: any; // Optional condition for conditional edges (JSONB)
  // --- New: Add language field (optional, can inherit from flow) ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the edge label/description (if any)
  // --- End New ---
}

export interface AgenticFlowExecution {
  id: string; // DB UUID
  flow_id: string; // Link to the executed flow
  user_id: string; // Link to the user who ran the flow
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'paused' | 'cancelled';
  start_timestamp: string;
  completion_timestamp: string | null;
  execution_log_summary?: string; // Summary of the execution log
  result?: any; // Final result of the execution (JSONB)
  error?: string; // Error message if failed
  current_node_id?: string; // ID of the currently executing node (references node_id_in_flow)
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the log summary, result, error
  // --- End New ---
}


// Authority Forging (\\u6b0a\\u80fd\\u935b\\u9020)
export interface UserAction {
  id: string;
  timestamp: string; // ISO 8601
  user_id: string | null; // Link to user (can be null for system actions not tied to a user)
  type: string; // e.g., 'gui:click', 'cli:command', 'api:call', 'task:execute', 'kb:save', 'ability:run', 'system:processing:failed', 'system:webhook:received:...'
  details?: any; // Specific details of the action (JSONB)
  context?: any; // Contextual information (JSONB) (e.g., app name, URL, session ID, platform: 'cli' | 'web' | 'mobile', correlationId)
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the action details/context description
  // --- End New ---
}

export interface ForgedAbility {
  id: string;
  name: string;
  description?: string;
  script: string; // The code or script to execute (e.g., JavaScript/TypeScript)
  trigger: AbilityTrigger; // JSONB field for trigger configuration (e.g., { type: 'keyword', value: 'send email' })
  forged_from_actions?: string[]; // Array of user_action IDs this was forged from
  creation_timestamp: string;
  last_used_timestamp?: string; // When the ability was last executed
  user_id: string | null; // Link to user (null for public abilities)
  is_public: boolean; // Can this ability be shared?
  version: string;
  capacity_cost: number; // Cost in rune capacity units
  is_enabled: boolean; // Enabled by default
  // TODO: Add author_id, rating, tags, installation_count, permissions
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the name, description, script comments
  // --- End New ---
}

export interface AbilityTrigger {
  type: 'manual' | 'keyword' | 'schedule' | 'event' | 'webhook' | 'location' | 'time';
  // Specific details depend on type, e.g.:
  // keyword: { value: string }
  // schedule: { cron: string }
  // event: { eventType: string, filter?: any }
  // webhook: { endpoint: string, secret?: string }
  // location: { latitude: number, longitude: number, radius?: number }
  // time: { time: string, days?: number[] } // Time of day, days of week
  // Add other trigger-specific properties
  // --- New: Add language field (optional, can inherit from ability) ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of keyword or event description
  // --- End New ---
}


// Wisdom Precipitation (\\u667a\\u6167\\u6c89\\u6fb1)
export interface EvolutionaryInsight {
  id: string;
  user_id: string; // Link to the user the insight is for
  type: 'automation_opportunity' | 'task_failure_diagnosis' | 'skill_suggestion' | 'optimization_recommendation' | 'scripting_app_suggestion' | 'dev_workflow_suggestion' | 'novel_combination_suggestion';
  details: any; // Specific details of the insight (JSONB) (e.g., pattern found, task ID, suggested action)
  timestamp: string; // ISO 8601
  dismissed: boolean; // Has the user dismissed this insight? (Deprecated, use status)
  // --- New: Add status field for insights ---
  status: 'pending' | 'actioned' | 'dismissed' | 'ignored'; // Status of the insight processing
  // --- End New ---
  // TODO: Add action_taken status, related_action_id (if automated/acted upon)
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the insight details/message
  // --- End New ---
}


// Security Service (\\u5b89\\u5168\\u670d\\u52d9)
export interface SystemEvent {
  id: string;
  timestamp: string; // ISO 8601
  user_id: string | null; // User associated with the event (can be null for system-wide events)
  type: string; // e.g., 'security_event_recorded', 'sync_started', 'task_completed', 'rune_action_executed', 'system_error'
  payload?: any; // Details of the event (JSONB)
  context?: any; // Contextual information (JSONB) (e.g., source service, correlationId)
  severity?: 'info' | 'warning' | 'error'; // Severity level
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the event payload/message
  // --- End New ---
}

export interface SensitiveDataEntry {
  key: string; // Unique key for the data (e.g., 'openai_api_key', 'github_pat', 'working_copy_key')
  encrypted_data: string; // The encrypted data
  timestamp: string; // When the data was last updated
  // Add other metadata like encryption algorithm, key ID
  user_id?: string; // Link to user if user-specific sensitive data
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of any descriptive fields (less likely here)
  // --- End New ---
}


// Notification Service (\\u901a\\u77e5\\u670d\\u52d9)
export interface Notification {
    id: string;
    user_id?: string; // Target user (can be null for system-wide notifications)
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    details?: any; // JSONB for details (e.g., linked task ID, insight ID)
    timestamp: string; // ISO 8601
    is_read: boolean;
    channel: 'ui' | 'email' | 'webhook' | 'push'; // Delivery channel
    // TODO: Add action links, icon, expiry
    // --- New: Add language field ---
    language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the message and details
    // --- End New ---
}


// Calendar Service (\\u65e5\\u66c6\\u670d\\u52d9)
export interface CalendarEvent {
  id: string;
  user_id: string; // Link to user
  title: string; // Event title
  description?: string; // Optional description
  start_timestamp: string; // ISO 8601
  end_timestamp?: string; // ISO 8601
  all_day: boolean;
  location?: string; // Optional location
  url?: string; // Optional URL related to the event
  source?: string; // e.g., 'manual', 'extracted_from_image', 'synced_from_google_calendar'
  tags?: string[]; // Optional tags
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  // TODO: Add recurrence rules, attendees, reminders, status (confirmed, cancelled), linked_task_id, linked_kr_id
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the title, description, location
  // --- End New ---
}


// Template Service (\\u7bc4\\u672c\\u670d\\u52d9)
export interface Template {
  id: string;
  user_id: string; // Link to user
  name: string; // Template name
  description?: string; // Optional description
  type: 'knowledge_record' | 'task' | 'agentic_flow' | 'prompt' | 'document' | 'email' | 'report'; // Type of content/workflow the template is for
  content: any; // The template content (JSONB) - structure depends on type
  is_public: boolean; // Is this a public template?
  tags?: string[]; // Optional tags
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
  // TODO: Add author_id, rating, usage_count
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the name, description, content
  // --- End New ---
}


// User Profile (profiles table)
export interface User {
  id: string; // Matches auth.users id
  email: string;
  name?: string; // Full name
  avatarUrl?: string; // URL to avatar image
  role?: string; // User role (e.g., 'authenticated', 'admin')
  rune_capacity?: number; // User's total rune capacity
  created_at?: string; // From auth.users
  last_sign_in_at?: string; // From auth.users
  // --- New: Add language preference field ---
  language_preference?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - User's preferred language
  // --- End New ---
  // Add other profile fields here
}


// Sync Service (\\u540c\\u6b65\\u670d\\u52d9)
export interface LocalDataChange {
  id: string; // Unique ID for the change entry
  dataType: string; // e.g., 'memoryEngine', 'selfNavigationEngine'
  changeType: 'INSERT' | 'UPDATE' | 'DELETE';
  recordId?: string; // ID of the record being changed (if applicable)
  payload: any; // The data payload (e.g., new record, update details, deleted record ID)
  timestamp: number; // Timestamp when the change occurred locally (milliseconds)
  userId: string; // User ID associated with the change
  status: 'pending' | 'processing' | 'completed' | 'failed'; // Status of the change in the queue
  retryCount: number; // Number of times pushing this change has been retried
  error?: string; // Last error message if pushing failed
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the data being changed (optional)
  // --- End New ---
}

export interface CloudSyncConfig {
  enabled: boolean;
  provider: 'supabase' | 'google_drive' | 'dropbox' | 'onedrive'; // Cloud storage provider
  // Provider-specific configuration (e.g., bucket name, folder path)
  supabase?: {
    // Supabase config is handled by main app config
  };
  google_drive?: {
    folder_id?: string; // Specific folder ID in Google Drive
  };
  // Add other provider configs
  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language preference for synced data (e.g., if translating)
  // --- End New ---
}

export interface BoostSpaceSyncConfig {
  enabled: boolean;
  webhook_url: string; // Boost.space webhook URL
  api_key?: string; // Boost.space API Key (store securely!)
  // Mapping configuration: how Jun.Ai.Key data types map to Boost.space modules/items
  mappings: Array<{\n    junai_type: string; // e.g., 'knowledge_record', 'task'\n    boostspace_module_id: string; // Boost.space module ID\n    field_mapping: Record<string, string>; // Map Jun.Ai.Key fields to Boost.space fields\n    // Add filters, transformation rules\n  }>;\n  // --- New: Add language field ---
  language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language preference for data sent to Boost.space
  // --- End New ---
}

export interface SyncStatusUpdatePayload {
    dataType: string; // The data type or 'system'
    userId: string;
    status: 'idle' | 'syncing' | 'error' | 'unknown';
    step?: string; // Current step message
    timestamp: number; // Timestamp of the status update
    queueSize?: number; // Current size of the local change queue (for system status)
    // Add other relevant status details
    // --- New: Add language field ---
    language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the status/step message
    // --- End New ---
}

export interface SyncResultPayload {
    dataType: string; // The data type or 'system'
    userId: string;
    status: 'success' | 'failed';
    timestamp: number; // Timestamp of completion/failure
    direction?: 'up' | 'down' | 'bidirectional'; // Sync direction
    itemsProcessed?: number; // Number of items successfully processed
    conflicts?: number; // Number of conflicts encountered
    errors?: number; // Number of errors encountered
    duration_ms?: number; // Duration of the sync operation in milliseconds
    error?: string; // Error message on failure
    // Add other relevant result details
    // --- New: Add language field ---
    language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the result/error message
    // --- End New ---
}

export interface SyncErrorPayload {
    dataType: string; // The data type or 'system'
    userId: string;
    error: string; // Error message
    timestamp: number; // Timestamp of the error
    step?: string; // Step where the error occurred
    change?: LocalDataChange; // The specific change that failed (if applicable)
    retryCount?: number; // Retry count for the failed change
    direction?: 'up' | 'down' | 'bidirectional'; // Sync direction
    // Add other relevant error details
    // --- New: Add language field ---
    language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the error message
    // --- End New ---
}

export interface WorkingCopySyncStatus {
    repoName: string;
    status: 'idle' | 'syncing' | 'error';
    step?: string; // Current step message (e.g., 'Pulling', 'Pushing', 'Merging')
    timestamp: number; // Timestamp of the status update
    error?: string; // Error message on failure
    // Add other relevant status details (e.g., last commit, current branch)
    // --- New: Add language field ---
    language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the status/step message
    // --- End New ---
}

export interface MobileGitSyncConfig {
    repo_url: string; // URL of the Git repository
    branch?: string; // Default branch to sync
    // Add other config like credentials (store securely!)
    // --- New: Add language field ---
    language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language preference for commit messages, etc.
    // --- End New ---
}


// Talent Management
export interface Talent {
    id: string;
    name: string;
    description: string;
    levels: TalentLevel[];
    // Add other talent metadata
    // --- New: Add language field ---
    language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the name, description, level descriptions
    // --- End New ---
}

export interface TalentLevel {
    level: number;
    unlock_criteria: any; // JSONB defining criteria (e.g., { type: 'agent_count', value: 5 })
    effects: TalentEffect[]; // Effects granted at this level
    unlocked_runes?: string[]; // IDs of runes unlocked at this level
    // --- New: Add language field ---
    language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the level description
    // --- End New ---
}

export interface TalentEffect {
    type: string; // e.g., 'skill_cooldown_reduction', 'api_latency_reduction', 'auto_error_repair', 'cross_platform_sync_boost', 'realtime_memory_upload', 'passive_skill'
    value: any; // Value of the effect (e.g., 0.2, true, '\\u5275\\u4e16\\u9810\\u89bd')
    description: string; // Description of the effect
    // --- New: Add language field ---
    language?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Language of the description
    // --- End New ---
}


// --- New: Add context field to query_knowledge payload ---
declare module './BaseAgent' {
    interface AgentMessage {
        type: 'query_knowledge';
        payload: {
            query: string;
            useSemanticSearch?: boolean;
            language?: string;
            context?: any; // Add context parameter here
        };
        correlationId?: string;
        sender?: string;
        recipient?: string;
    }
}
// --- End New ---


// Define the structure for ActionIntent (used in TaskStep, AgenticFlowNode, and DecisionAgent output)
export interface ActionIntent {
    action: string; // The type of action (e.g., 'create_task', 'execute_rune', 'search_knowledge', 'answer_via_ai')
    parameters?: any; // Parameters for the action (JSONB)
    confidence?: number; // Confidence score (0-1) from intent analysis
    original_intent?: string; // Original intent if the action is a fallback (e.g., 'answer_via_ai' after a failed generation)
    original_parameters?: any; // Original parameters if the action is a fallback
    // Add other metadata about the intent/action
}

// Define the structure for Webhook Event Payload (received by WebhookAgent)
export interface WebhookEventPayload {
    source: string; // e.g., 'boostspace', 'github', 'makecom'
    type: string; // e.g., 'item_created', 'push', 'new_message'
    data: any; // The actual payload from the webhook source
    timestamp: string; // ISO 8601
    // Add other metadata like signature, headers
}

// Define the structure for Knowledge Chunks (used in RAG)
export interface KnowledgeChunk {
    id: string; // Unique ID for the chunk
    record_id: string; // Link back to the source knowledge record
    content: string; // The text content of the chunk
    embedding_vector?: number[]; // Vector embedding for semantic search
    // Add other metadata like chunk_order, section_title
}

// Define the structure for User Feedback
export interface UserFeedback {
    id: string;
    record_id: string; // Link to the knowledge record (AI response)
    user_id: string; // Link to the user providing feedback
    feedback_type: 'correct' | 'incorrect'; // Type of feedback
    comments?: string; // Optional comments from the user
    timestamp: string; // ISO 8601
    // Add other metadata like context (e.g., conversation turn ID)
    // --- New: Add record details to feedback (for analysis) ---
    record?: KnowledgeRecord; // Include the related knowledge record details
    // --- End New ---
}


// System Context Interface
// This interface defines the shape of the central context object
// that is passed to all core services and agents.
export interface SystemContext {
    // Core Services
    memoirArchiver: MemoirArchiver; // MemoirArchiver instance
    apiProxy: any; // ApiProxy instance
    securityService: any; // SecurityService instance
    loggingService: any; // LoggingService instance
    cachingService: any; // CachingService instance
    eventBus: any; // EventBus instance
    syncService: any; // SyncService instance
    memoryEngine: any; // MemoryEngine instance
    authorityForgingEngine: any; // AuthorityForgingEngine instance
    selfNavigationEngine: any; // SelfNavigationEngine instance
    sacredRuneEngraver: any; // SacredRuneEngraver instance
    wisdomSecretArt: any; // WisdomSecretArt instance
    evolutionEngine: any; // EvolutionEngine instance
    analyticsService: any; // AnalyticsService instance
    goalManagementService: any; // GoalManagementService instance
    notificationService: any; // NotificationService instance
    glossaryService: any; // GlossaryService instance
    fileService: any; // FileService instance
    repositoryService: any; // RepositoryService instance
    knowledgeGraphService: any; // KnowledgeGraphService instance
    scriptSandbox: any; // ScriptSandbox instance
    calendarService: any; // CalendarService instance
    templateService: any; // TemplateService instance
    syllabusGenerator: any; // SyllabusGenerator instance


    // Agent System Components
    messageBus: any; // MessageBus instance
    agentFactory: any; // AgentFactory instance
    agentRouter: any; // AgentRouter instance

    // Global State (should be minimal here, prefer state within services/UI)
    currentUser: User | null; // Currently authenticated user
    currentFlow?: AgenticFlow | null; // The flow currently being viewed/edited (for editor/detail pages)

    // --- New: Add global language preference (optional, can be stored in User profile) ---
    // systemLanguage?: string; // ISO 639-1 code (e.g., 'en', 'zh', 'fr') - Overall system language
    // --- End New ---

    // Add other global context properties
    supabaseClient?: SupabaseClient; // Direct Supabase client access (use ApiProxy or specific agents/services where possible)
}
```