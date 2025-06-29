var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23;
""(__makeTemplateObject(["typescript\n// src/agents/SyncAgent.ts\n// \u540C\u6B65\u4EE3\u7406 (Sync Agent)\n// Orchestrates data synchronization processes.\n// Part of the Agent System Architecture.\n// Design Principle: Manages data consistency across locations.\n// --- Modified: Enhance pullRemoteChanges simulation --\n// --- Modified: Enhance processLocalChangeQueue with retry and batching simulation --\n// --- Modified: Refine status updates and event publishing --\n// --- New: Implement IndexedDB persistence for local change queue using localforage --\n// --- New: Implement structured logging for sync events using LoggingService --\n// --- New: Implement Backup All Data method --\n// --- New: Implement Mirror Data method (Mirror Codex) --\n\n\nimport { SystemContext, LocalDataChange, SyncStatusUpdatePayload, SyncResultPayload, SyncErrorPayload, KnowledgeRecord, AgenticFlow, Task, Goal, ForgedAbility, GlossaryTerm, Notification, SystemEvent } from '../../interfaces'; // Import new payload types and data types\nimport { SupabaseClient } from '@supabase/supabase-js';\nimport localforage from 'localforage'; // Import localforage for IndexedDB persistence\n// import { EventBus } from '../events/EventBus'; // Dependency\n// import { LoggingService } from '../core/logging/LoggingService'; // Dependency\n// import { SecurityService } from '../core/security/SecurityService'; // Dependency for user/auth\n// import { MemoryEngine } from '../core/memory/MemoryEngine'; // Dependency for data access\n// import { AuthorityForgingEngine } '../core/authority/AuthorityForgingEngine'; // Dependency for data access\n// import { SelfNavigationEngine } '../core/self-navigation/SelfNavigationEngine'; // Dependency for data access\n// import { RuneEngraftingCenter } '../core/rune-engrafting/SacredRuneEngraver'; // Dependency for data access\n// import { GoalManagementService } from '../core/goal-management/GoalManagementService'; // Dependency for data access\n// import { NotificationService } '../modules/notifications/NotificationService'; // Dependency for data access\n// import { AnalyticsService } '../modules/analytics/AnalyticsService'; // Dependency for data access\n// import { GlossaryService } '../core/glossary/GlossaryService'; // Dependency for data access\n// import { KnowledgeGraphService } '../core/wisdom/KnowledgeGraphService'; // Dependency for data access\n// import { FileService } '../core/files/FileService'; // Dependency for file operations\n// import { mergeCRDT } from '../core/memory/crdt-sync'; // Import CRDT merge function (placeholder)\n\n\n// Define the data types that this service will synchronize\n// These keys should match the keys used in SystemContext for the corresponding services\nconst SYNCHRONIZABLE_DATA_TYPES = [\n    'memoryEngine', // Knowledge Records, Collections, Collection Records\n    'authorityForgingEngine', // User Actions, Abilities\n    'selfNavigationEngine', // Tasks, Task Steps, Agentic Flows, Agentic Flow Executions\n    'runeEngraftingCenter', // Runes\n    'goalManagementService', // Goals, Key Results\n    'notificationService', // Notifications\n    'analyticsService', // System Events, User Feedback\n    'glossaryService', // Glossary Terms\n    'knowledgeGraphService', // Knowledge Relations\n    // 'fileService', // Files (Metadata or Content - complex)\n    // 'repositoryService', // Repositories (Metadata or Content - complex)\n    // Add other data types managed by services that need syncing\n] as const; // Use 'as const' to create a tuple of literal strings\n\ntype SynchronizableDataType = typeof SYNCHRONIZABLE_DATA_TYPES[number];\n\n// Map data types to their corresponding Supabase tables (for simplicity in MVP)\n// In a real app, this mapping might be more complex or handled within each service\nconst DATA_TYPE_TABLE_MAP: Record<SynchronizableDataType, string[]> = {\n    memoryEngine: ['knowledge_records', 'knowledge_collections', 'knowledge_collection_records'], // Added collection tables\n    authorityForgingEngine: ['user_actions', 'abilities'],\n    selfNavigationEngine: ['tasks', 'task_steps', 'agentic_flows', 'agentic_flow_nodes', 'agentic_flow_edges', 'agentic_flow_executions'], // Added flow tables\n    runeEngraftingCenter: ['runes'],\n    goalManagementService: ['goals', 'key_results'],\n    notificationService: ['notifications'],\n    analyticsService: ['system_events', 'user_feedback'], // Added user_feedback\n    glossaryService: ['glossary'], // New: Glossary table\n    knowledgeGraphService: ['knowledge_relations'], // New: Knowledge Relations table\n    // fileService: ['files'], // New: Placeholder for files table (if file metadata is synced)\n    // repositoryService: ['repositories'], // New: Placeholder for repositories table (if repo metadata is synced)\n};\n\n// --- New: Define retry configuration ---\nconst MAX_RETRY_COUNT = 3;\nconst RETRY_DELAY_MS = 1000; // 1 second delay before retry\n// --- End New ---\n\n// --- New: Define batch size for pushing changes ---\nconst PUSH_BATCH_SIZE = 10; // Process up to 10 changes in a batch\n// --- End New ---\n\n\nexport class SyncService {\n    private context: SystemContext;\n    private supabase: SupabaseClient;\n    // private eventBus: EventBus; // Access via context\n    // private loggingService: LoggingService; // Access via context\n    // private securityService: SecurityService; // Access via context\n\n    // --- New: localforage instance for persistence ---\n    private localforageStore: typeof localforage;\n    private LOCAL_QUEUE_KEY = 'sync_local_change_queue';\n    // --- End New ---\n\n    // --- New: In-memory queue for local data changes ---\n    // In a real app, this would be persisted (e.g., IndexedDB, LevelDB) for offline support.\n    private localChangeQueue: LocalDataChange[] = [];\n    // --- End New ---\n\n    // --- New: In-memory state for sync status ---\n    private syncStatus: Record<SynchronizableDataType | 'system', 'idle' | 'syncing' | 'error' | 'unknown'> = { system: 'unknown' } as any; // Initialize with system status\n    private syncStep: Record<SynchronizableDataType | 'system', string | undefined> = { system: undefined } as any; // Current step message\n    private lastSyncTimestamp: Record<SynchronizableDataType | 'system', number | undefined> = { system: undefined } as any; // Timestamp of last successful sync\n    // --- End New ---\n\n    // --- New: Realtime Subscription ---\n    // Store subscriptions per table to manage them.\n    private realtimeSubscriptions: Map<string, any> = new Map();\n    // --- End New ---\n\n    // --- New: Flag to prevent multiple processQueue calls ---\n    private isProcessingQueue = false;\n    // --- End New ---\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.eventBus = context.eventBus;\n        // this.loggingService = context.loggingService;\n        // this.securityService = context.securityService;\n\n        console.log('SyncService initialized.');\n\n        // --- New: Initialize localforage ---\n        this.localforageStore = localforage.create({\n            name: 'jun_ai_key_sync',\n            storeName: 'local_change_queue',\n            description: 'Stores local data changes pending synchronization.',\n        });\n        // --- End New ---\n\n        // Initialize sync status for all data types\n        SYNCHRONIZABLE_DATA_TYPES.forEach(type => {\n            this.syncStatus[type] = 'unknown';\n            this.syncStep[type] = undefined;\n            this.lastSyncTimestamp[type] = undefined;\n        });\n        this.updateStatus('system', 'idle', 'Initialized', undefined); // Set initial system status to idle\n\n\n        // --- New: Load pending local changes from persistence on startup ---\n        this.loadLocalChangeQueue().catch(err => console.error('Error loading local change queue on startup:', err));\n        // --- End New ---\n\n        // TODO: Set up listeners for local data change events from other modules (or rely on Realtime for remote changes)\n        // TODO: Set up periodic sync triggers based on user settings (e.g., every 5 minutes, on wifi)\n\n        // --- New: Set up Supabase Realtime subscriptions for relevant tables ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                // Note: Individual services (MemoryEngine, etc.) are now responsible for their own Realtime subscriptions.\n                // The SyncService primarily manages the local queue and orchestrates pushes/pulls.\n                // This subscription is removed as it's redundant if services subscribe themselves.\n                // this.subscribeToRealtimeUpdates(user.id);\n\n                // On login, attempt to sync any pending local changes\n                this.processLocalChangeQueue(user.id).catch(err => console.error('Error processing local change queue on login:', err));\n            } else {\n                // This unsubscribe is also removed if services manage their own subscriptions.\n                // this.unsubscribeFromRealtimeUpdates();\n\n                // Clear local change queue and status on logout\n                this.localChangeQueue = []; // Clear in-memory queue\n                this.saveLocalChangeQueue().catch(err => console.error('Error saving empty queue on logout:', err)); // Persist empty queue\n                this.updateStatus('system', 'unknown', 'Logged out', undefined);\n                SYNCHRONIZABLE_DATA_TYPES.forEach(type => {\n                    this.updateStatus(type, 'unknown', 'Logged out', undefined);\n                    this.lastSyncTimestamp[type] = undefined;\n                });\n            }\n        });\n        // --- End New ---\n    }\n\n    /**\n     * Loads the local change queue from IndexedDB persistence.\n     * @returns Promise<void>\n     */\n    private async loadLocalChangeQueue(): Promise<void> {\n        try {\n            const savedQueue = await this.localforageStore.getItem<LocalDataChange[]>(this.LOCAL_QUEUE_KEY);\n            if (savedQueue) {\n                this.localChangeQueue = savedQueue;\n                console.log("], ["typescript\n// src/agents/SyncAgent.ts\n// \\u540c\\u6b65\\u4ee3\\u7406 (Sync Agent)\n// Orchestrates data synchronization processes.\n// Part of the Agent System Architecture.\n// Design Principle: Manages data consistency across locations.\n// --- Modified: Enhance pullRemoteChanges simulation --\n// --- Modified: Enhance processLocalChangeQueue with retry and batching simulation --\n// --- Modified: Refine status updates and event publishing --\n// --- New: Implement IndexedDB persistence for local change queue using localforage --\n// --- New: Implement structured logging for sync events using LoggingService --\n// --- New: Implement Backup All Data method --\n// --- New: Implement Mirror Data method (Mirror Codex) --\n\n\nimport { SystemContext, LocalDataChange, SyncStatusUpdatePayload, SyncResultPayload, SyncErrorPayload, KnowledgeRecord, AgenticFlow, Task, Goal, ForgedAbility, GlossaryTerm, Notification, SystemEvent } from '../../interfaces'; // Import new payload types and data types\nimport { SupabaseClient } from '@supabase/supabase-js';\nimport localforage from 'localforage'; // Import localforage for IndexedDB persistence\n// import { EventBus } from '../events/EventBus'; // Dependency\n// import { LoggingService } from '../core/logging/LoggingService'; // Dependency\n// import { SecurityService } from '../core/security/SecurityService'; // Dependency for user/auth\n// import { MemoryEngine } from '../core/memory/MemoryEngine'; // Dependency for data access\n// import { AuthorityForgingEngine } '../core/authority/AuthorityForgingEngine'; // Dependency for data access\n// import { SelfNavigationEngine } '../core/self-navigation/SelfNavigationEngine'; // Dependency for data access\n// import { RuneEngraftingCenter } '../core/rune-engrafting/SacredRuneEngraver'; // Dependency for data access\n// import { GoalManagementService } from '../core/goal-management/GoalManagementService'; // Dependency for data access\n// import { NotificationService } '../modules/notifications/NotificationService'; // Dependency for data access\n// import { AnalyticsService } '../modules/analytics/AnalyticsService'; // Dependency for data access\n// import { GlossaryService } '../core/glossary/GlossaryService'; // Dependency for data access\n// import { KnowledgeGraphService } '../core/wisdom/KnowledgeGraphService'; // Dependency for data access\n// import { FileService } '../core/files/FileService'; // Dependency for file operations\n// import { mergeCRDT } from '../core/memory/crdt-sync'; // Import CRDT merge function (placeholder)\n\n\n// Define the data types that this service will synchronize\n// These keys should match the keys used in SystemContext for the corresponding services\nconst SYNCHRONIZABLE_DATA_TYPES = [\n    'memoryEngine', // Knowledge Records, Collections, Collection Records\n    'authorityForgingEngine', // User Actions, Abilities\n    'selfNavigationEngine', // Tasks, Task Steps, Agentic Flows, Agentic Flow Executions\n    'runeEngraftingCenter', // Runes\n    'goalManagementService', // Goals, Key Results\n    'notificationService', // Notifications\n    'analyticsService', // System Events, User Feedback\n    'glossaryService', // Glossary Terms\n    'knowledgeGraphService', // Knowledge Relations\n    // 'fileService', // Files (Metadata or Content - complex)\n    // 'repositoryService', // Repositories (Metadata or Content - complex)\n    // Add other data types managed by services that need syncing\n] as const; // Use 'as const' to create a tuple of literal strings\n\ntype SynchronizableDataType = typeof SYNCHRONIZABLE_DATA_TYPES[number];\n\n// Map data types to their corresponding Supabase tables (for simplicity in MVP)\n// In a real app, this mapping might be more complex or handled within each service\nconst DATA_TYPE_TABLE_MAP: Record<SynchronizableDataType, string[]> = {\n    memoryEngine: ['knowledge_records', 'knowledge_collections', 'knowledge_collection_records'], // Added collection tables\n    authorityForgingEngine: ['user_actions', 'abilities'],\n    selfNavigationEngine: ['tasks', 'task_steps', 'agentic_flows', 'agentic_flow_nodes', 'agentic_flow_edges', 'agentic_flow_executions'], // Added flow tables\n    runeEngraftingCenter: ['runes'],\n    goalManagementService: ['goals', 'key_results'],\n    notificationService: ['notifications'],\n    analyticsService: ['system_events', 'user_feedback'], // Added user_feedback\n    glossaryService: ['glossary'], // New: Glossary table\n    knowledgeGraphService: ['knowledge_relations'], // New: Knowledge Relations table\n    // fileService: ['files'], // New: Placeholder for files table (if file metadata is synced)\n    // repositoryService: ['repositories'], // New: Placeholder for repositories table (if repo metadata is synced)\n};\n\n// --- New: Define retry configuration ---\nconst MAX_RETRY_COUNT = 3;\nconst RETRY_DELAY_MS = 1000; // 1 second delay before retry\n// --- End New ---\n\n// --- New: Define batch size for pushing changes ---\nconst PUSH_BATCH_SIZE = 10; // Process up to 10 changes in a batch\n// --- End New ---\n\n\nexport class SyncService {\n    private context: SystemContext;\n    private supabase: SupabaseClient;\n    // private eventBus: EventBus; // Access via context\n    // private loggingService: LoggingService; // Access via context\n    // private securityService: SecurityService; // Access via context\n\n    // --- New: localforage instance for persistence ---\n    private localforageStore: typeof localforage;\n    private LOCAL_QUEUE_KEY = 'sync_local_change_queue';\n    // --- End New ---\n\n    // --- New: In-memory queue for local data changes ---\n    // In a real app, this would be persisted (e.g., IndexedDB, LevelDB) for offline support.\n    private localChangeQueue: LocalDataChange[] = [];\n    // --- End New ---\n\n    // --- New: In-memory state for sync status ---\n    private syncStatus: Record<SynchronizableDataType | 'system', 'idle' | 'syncing' | 'error' | 'unknown'> = { system: 'unknown' } as any; // Initialize with system status\n    private syncStep: Record<SynchronizableDataType | 'system', string | undefined> = { system: undefined } as any; // Current step message\n    private lastSyncTimestamp: Record<SynchronizableDataType | 'system', number | undefined> = { system: undefined } as any; // Timestamp of last successful sync\n    // --- End New ---\n\n    // --- New: Realtime Subscription ---\n    // Store subscriptions per table to manage them.\n    private realtimeSubscriptions: Map<string, any> = new Map();\n    // --- End New ---\n\n    // --- New: Flag to prevent multiple processQueue calls ---\n    private isProcessingQueue = false;\n    // --- End New ---\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.eventBus = context.eventBus;\n        // this.loggingService = context.loggingService;\n        // this.securityService = context.securityService;\n\n        console.log('SyncService initialized.');\n\n        // --- New: Initialize localforage ---\n        this.localforageStore = localforage.create({\n            name: 'jun_ai_key_sync',\n            storeName: 'local_change_queue',\n            description: 'Stores local data changes pending synchronization.',\n        });\n        // --- End New ---\n\n        // Initialize sync status for all data types\n        SYNCHRONIZABLE_DATA_TYPES.forEach(type => {\n            this.syncStatus[type] = 'unknown';\n            this.syncStep[type] = undefined;\n            this.lastSyncTimestamp[type] = undefined;\n        });\n        this.updateStatus('system', 'idle', 'Initialized', undefined); // Set initial system status to idle\n\n\n        // --- New: Load pending local changes from persistence on startup ---\n        this.loadLocalChangeQueue().catch(err => console.error('Error loading local change queue on startup:', err));\n        // --- End New ---\n\n        // TODO: Set up listeners for local data change events from other modules (or rely on Realtime for remote changes)\n        // TODO: Set up periodic sync triggers based on user settings (e.g., every 5 minutes, on wifi)\n\n        // --- New: Set up Supabase Realtime subscriptions for relevant tables ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                // Note: Individual services (MemoryEngine, etc.) are now responsible for their own Realtime subscriptions.\n                // The SyncService primarily manages the local queue and orchestrates pushes/pulls.\n                // This subscription is removed as it's redundant if services subscribe themselves.\n                // this.subscribeToRealtimeUpdates(user.id);\n\n                // On login, attempt to sync any pending local changes\n                this.processLocalChangeQueue(user.id).catch(err => console.error('Error processing local change queue on login:', err));\n            } else {\n                // This unsubscribe is also removed if services manage their own subscriptions.\n                // this.unsubscribeFromRealtimeUpdates();\n\n                // Clear local change queue and status on logout\n                this.localChangeQueue = []; // Clear in-memory queue\n                this.saveLocalChangeQueue().catch(err => console.error('Error saving empty queue on logout:', err)); // Persist empty queue\n                this.updateStatus('system', 'unknown', 'Logged out', undefined);\n                SYNCHRONIZABLE_DATA_TYPES.forEach(type => {\n                    this.updateStatus(type, 'unknown', 'Logged out', undefined);\n                    this.lastSyncTimestamp[type] = undefined;\n                });\n            }\n        });\n        // --- End New ---\n    }\n\n    /**\n     * Loads the local change queue from IndexedDB persistence.\n     * @returns Promise<void>\n     */\n    private async loadLocalChangeQueue(): Promise<void> {\n        try {\n            const savedQueue = await this.localforageStore.getItem<LocalDataChange[]>(this.LOCAL_QUEUE_KEY);\n            if (savedQueue) {\n                this.localChangeQueue = savedQueue;\n                console.log("]))[SyncService];
Loaded;
$;
{
    this.localChangeQueue.length;
}
changes;
from;
persistence.(__makeTemplateObject([");\n                this.context.loggingService?.logInfo("], [");\n                this.context.loggingService?.logInfo("]));
Loaded;
$;
{
    this.localChangeQueue.length;
}
changes;
from;
persistence.(__makeTemplateObject([");\n                // Update status to reflect pending changes on startup\n                if (this.localChangeQueue.length > 0) {\n                     this.updateStatus('system', 'syncing', "], [");\n                // Update status to reflect pending changes on startup\n                if (this.localChangeQueue.length > 0) {\n                     this.updateStatus('system', 'syncing', "]));
Loaded;
$;
{
    this.localChangeQueue.length;
}
pending;
changes(__makeTemplateObject([", this.context.currentUser?.id);\n                }\n            } else {\n                console.log('[SyncService] No pending changes found in persistence.');\n                this.context.loggingService?.logInfo('No pending changes found in persistence.');\n            }\n        } catch (error: any) {\n            console.error('[SyncService] Failed to load local change queue from persistence:', error);\n            this.context.loggingService?.logError('Failed to load local change queue from persistence', { error: error.message });\n            // If loading fails, start with an empty queue\n            this.localChangeQueue = [];\n        }\n    }\n\n    /**\n     * Saves the current local change queue to IndexedDB persistence.\n     * @returns Promise<void>\n     */\n    private async saveLocalChangeQueue(): Promise<void> {\n        try {\n            await this.localforageStore.setItem(this.LOCAL_QUEUE_KEY, this.localChangeQueue);\n            // console.log("], [", this.context.currentUser?.id);\n                }\n            } else {\n                console.log('[SyncService] No pending changes found in persistence.');\n                this.context.loggingService?.logInfo('No pending changes found in persistence.');\n            }\n        } catch (error: any) {\n            console.error('[SyncService] Failed to load local change queue from persistence:', error);\n            this.context.loggingService?.logError('Failed to load local change queue from persistence', { error: error.message });\n            // If loading fails, start with an empty queue\n            this.localChangeQueue = [];\n        }\n    }\n\n    /**\n     * Saves the current local change queue to IndexedDB persistence.\n     * @returns Promise<void>\n     */\n    private async saveLocalChangeQueue(): Promise<void> {\n        try {\n            await this.localforageStore.setItem(this.LOCAL_QUEUE_KEY, this.localChangeQueue);\n            // console.log("]))[SyncService];
Saved;
$;
{
    this.localChangeQueue.length;
}
changes;
to;
persistence.(__makeTemplateObject(["); // Avoid excessive logging\n        } catch (error: any) {\n            console.error('[SyncService] Failed to save local change queue to persistence:', error);\n            this.context.loggingService?.logError('Failed to save local change queue to persistence', { error: error.message });\n        }\n    }\n\n    /**\n     * Updates the sync status for a specific data type or the system overall.\n     * Publishes a 'sync_status_update' event.\n     * @param dataType The data type or 'system'. Required.\n     * @param status The new status. Required.\n     * @param step Optional message describing the current step.\n     * @param userId Optional user ID associated with the status.\n     */\n    private updateStatus(dataType: SynchronizableDataType | 'system', status: 'idle' | 'syncing' | 'error' | 'unknown', step?: string, userId?: string): void {\n        this.syncStatus[dataType] = status;\n        this.syncStep[dataType] = step;\n        const payload: SyncStatusUpdatePayload = {\n            dataType,\n            userId: userId || this.context.currentUser?.id || 'unknown', // Use provided userId or current user\n            status,\n            step: step || status, // Use status as step message if none provided\n            timestamp: Date.now(),\n            queueSize: this.localChangeQueue.length, // Include queue size in system status updates\n        };\n        console.log("], ["); // Avoid excessive logging\n        } catch (error: any) {\n            console.error('[SyncService] Failed to save local change queue to persistence:', error);\n            this.context.loggingService?.logError('Failed to save local change queue to persistence', { error: error.message });\n        }\n    }\n\n    /**\n     * Updates the sync status for a specific data type or the system overall.\n     * Publishes a 'sync_status_update' event.\n     * @param dataType The data type or 'system'. Required.\n     * @param status The new status. Required.\n     * @param step Optional message describing the current step.\n     * @param userId Optional user ID associated with the status.\n     */\n    private updateStatus(dataType: SynchronizableDataType | 'system', status: 'idle' | 'syncing' | 'error' | 'unknown', step?: string, userId?: string): void {\n        this.syncStatus[dataType] = status;\n        this.syncStep[dataType] = step;\n        const payload: SyncStatusUpdatePayload = {\n            dataType,\n            userId: userId || this.context.currentUser?.id || 'unknown', // Use provided userId or current user\n            status,\n            step: step || status, // Use status as step message if none provided\n            timestamp: Date.now(),\n            queueSize: this.localChangeQueue.length, // Include queue size in system status updates\n        };\n        console.log("]))[SyncService];
Status;
update;
for ($; { dataType: dataType }; )
    : $;
{
    status;
}
-$;
{
    step || 'N/A';
}
(function (Queue, _a) {
    var  = _a.this, localChangeQueue = _a.localChangeQueue, length = _a.length;
    return ;
});
");\n        this.context.loggingService?.logInfo(";
Sync;
status;
update: $;
{
    dataType;
}
-$;
{
    status;
}
", payload);\n        this.context.eventBus?.publish('sync_status_update', payload, payload.userId); // Publish event\n    }\n\n    /**\n     * Gets the current sync status for a specific data type or the system overall.\n     * @param dataType The data type or 'system'. Required.\n     * @returns The current status.\n     */\n    getSyncStatus(dataType: SynchronizableDataType | 'system'): 'idle' | 'syncing' | 'error' | 'unknown' {\n        return this.syncStatus[dataType] || 'unknown';\n    }\n\n     /**\n     * Gets the current sync step message for a specific data type or the system overall.\n     * @param dataType The data type or 'system'. Required.\n     * @returns The current step message or undefined.\n     */\n    getSyncStep(dataType: SynchronizableDataType | 'system'): string | undefined {\n        return this.syncStep[dataType];\n    }\n\n    /**\n     * Gets the timestamp of the last successful sync for a data type or the system.\n     * @param dataType The data type or 'system'. Required.\n     * @returns The timestamp or undefined.\n     */\n    getLastSyncTimestamp(dataType: SynchronizableDataType | 'system'): number | undefined {\n        return this.lastSyncTimestamp[dataType];\n    }\n\n    /**\n     * Gets the current size of the local change queue.\n     * @returns The number of pending local changes.\n     */\n    getLocalQueueSize(): number {\n        return this.localChangeQueue.length;\n    }\n\n\n    /**\n     * Handles a local data change event from another module.\n     * Adds the change to the local queue and triggers processing.\n     * @param dataType The type of data that changed. Required.\n     * @param changeType The type of change ('INSERT', 'UPDATE', 'DELETE'). Required.\n     * @param payload The data payload (e.g., the new record, update details, deleted record ID). Required.\n     * @param userId The user ID associated with the change. Required.\n     * @returns Promise<void>\n     */\n    async handleLocalDataChange(dataType: SynchronizableDataType, changeType: LocalDataChange['changeType'], payload: any, userId: string): Promise<void> {\n        console.log("[SyncService];
Received;
local;
data;
change: $;
{
    dataType;
}
-$;
{
    changeType;
}
for (user; $; { userId: userId }(__makeTemplateObject([");\n        this.context.loggingService?.logInfo("], [");\n        this.context.loggingService?.logInfo("])))
    Received;
local;
data;
change: $;
{
    dataType;
}
-$;
{
    changeType;
}
", { dataType, changeType, userId, payload });\n\n        if (!userId) {\n             console.warn('[SyncService] Cannot handle local change: User ID is missing.');\n             return;\n        }\n\n        // Create a LocalDataChange object\n        const change: LocalDataChange = {\n            id: ";
$;
{
    dataType;
}
-$;
{
    changeType;
}
-$;
{
    Date.now();
}
-$;
{
    Math.random().toString(16).slice(2);
}
", // Unique ID for the change\n            dataType,\n            changeType,\n            recordId: payload?.id, // Use record ID from payload if available\n            payload,\n            timestamp: Date.now(),\n            userId,\n            status: 'pending', // Initial status\n            retryCount: 0,\n        };\n\n        // Add the change to the local queue\n        this.localChangeQueue.push(change);\n        this.updateStatus('system', 'syncing', ";
Queued;
$;
{
    changeType;
}
for ($; { dataType: dataType }(__makeTemplateObject([", userId); // Update system status\n\n        // --- New: Save the updated queue to persistence ---\n        this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after adding change:', err));\n        // --- End New ---\n\n        // Immediately attempt to process the queue (asynchronously)\n        this.processLocalChangeQueue(userId).catch(err => console.error('Error processing local change queue:', err));\n    }\n\n    /**\n     * Processes the local change queue, attempting to push changes to Supabase.\n     * @param userId The user ID whose changes to process. Required.\n     * @returns Promise<void>\n     */\n    private async processLocalChangeQueue(userId: string): Promise<void> {\n        // Prevent multiple processQueue calls running concurrently\n        if (this.isProcessingQueue) {\n            // console.log('[SyncService] processLocalChangeQueue already running.');\n            return;\n        }\n\n        this.isProcessingQueue = true;\n        console.log("], [", userId); // Update system status\n\n        // --- New: Save the updated queue to persistence ---\n        this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after adding change:', err));\n        // --- End New ---\n\n        // Immediately attempt to process the queue (asynchronously)\n        this.processLocalChangeQueue(userId).catch(err => console.error('Error processing local change queue:', err));\n    }\n\n    /**\n     * Processes the local change queue, attempting to push changes to Supabase.\n     * @param userId The user ID whose changes to process. Required.\n     * @returns Promise<void>\n     */\n    private async processLocalChangeQueue(userId: string): Promise<void> {\n        // Prevent multiple processQueue calls running concurrently\n        if (this.isProcessingQueue) {\n            // console.log('[SyncService] processLocalChangeQueue already running.');\n            return;\n        }\n\n        this.isProcessingQueue = true;\n        console.log("]))[SyncService]; Starting)
    local;
change;
queue;
processing;
for (user; $; { userId: userId }.Queue)
    size: $;
{
    this.localChangeQueue.length;
}
");\n        const startTime = Date.now();\n        let itemsProcessed = 0;\n        let conflicts = 0;\n        let errors = 0;\n\n        try {\n            while (this.localChangeQueue.length > 0) {\n                // Filter for pending changes that haven't exceeded max retries\n                const pendingChanges = this.localChangeQueue.filter(change => change.status === 'pending' && change.retryCount < MAX_RETRY_COUNT);\n\n                if (pendingChanges.length === 0) {\n                    console.log('[SyncService] No pending changes in queue or max retries reached.');\n                    // If there are failed changes with max retries, set system status to error\n                    const failedMaxRetries = this.localChangeQueue.filter(change => change.status === 'pending' && change.retryCount >= MAX_RETRY_COUNT);\n                    if (failedMaxRetries.length > 0) {\n                         const errorMessage = ";
$;
{
    failedMaxRetries.length;
}
changes;
failed;
after;
$;
{
    MAX_RETRY_COUNT;
}
retries.(__makeTemplateObject([";\n                         this.updateStatus('system', 'error', "], [";\n                         this.updateStatus('system', 'error', "]));
Sync;
failed: $;
{
    errorMessage;
}
", userId);\n                         const errorPayload: SyncErrorPayload = { dataType: 'system', userId, error: errorMessage, timestamp: Date.now(), step: 'Max retries reached for some changes' };\n                         this.context.eventBus?.publish('sync_error', errorPayload, userId);\n                    } else {\n                         this.updateStatus('system', 'idle', 'Queue empty', userId);\n                         this.lastSyncTimestamp['system'] = Date.now(); // Update system timestamp\n                         const resultPayload: SyncResultPayload = { dataType: 'system', userId, status: 'success', timestamp: Date.now(), duration_ms: Date.now() - startTime, itemsProcessed, conflicts, errors };\n                         this.context.eventBus?.publish('sync_completed', resultPayload, userId); // Publish completion event\n                    }\n                    break; // Exit the loop if no pending changes to process\n                }\n\n                // --- New: Process changes in batches ---\n                const batchToProcess = pendingChanges.slice(0, PUSH_BATCH_SIZE);\n                console.log("[SyncService];
Processing;
batch;
of;
$;
{
    batchToProcess.length;
}
changes.(__makeTemplateObject([");\n                this.updateStatus('system', 'syncing', "], [");\n                this.updateStatus('system', 'syncing', "]));
Processing;
batch($, { batchToProcess: batchToProcess, : .length }, items)(__makeTemplateObject([", userId);\n\n                const pushPromises = batchToProcess.map(async (change) => {\n                    this.updateStatus(change.dataType, 'syncing', "], [", userId);\n\n                const pushPromises = batchToProcess.map(async (change) => {\n                    this.updateStatus(change.dataType, 'syncing', "]));
Pushing;
$;
{
    change.changeType;
}
for ($; { change: change, : .dataType }(__makeTemplateObject([", userId); // Update status for specific type\n\n                    try {\n                        // Attempt to push the change to Supabase\n                        const tables = DATA_TYPE_TABLE_MAP[change.dataType]; // Get tables for the data type\n                        if (!tables || tables.length === 0) {\n                            throw new Error("], [", userId); // Update status for specific type\n\n                    try {\n                        // Attempt to push the change to Supabase\n                        const tables = DATA_TYPE_TABLE_MAP[change.dataType]; // Get tables for the data type\n                        if (!tables || tables.length === 0) {\n                            throw new Error("])); Unknown)
    table(s);
for (data; type; )
    : $;
{
    change.dataType;
}
");\n                        }\n                        // For MVP, assume the change applies to the first table listed for the data type\n                        const table = tables[0];\n\n                        let dbOperation;\n                        if (change.changeType === 'INSERT') {\n                            dbOperation = this.supabase.from(table).insert([change.payload]);\n                        } else if (change.changeType === 'UPDATE') {\n                            // For update, we need the record ID and the updates\n                            if (!change.recordId) throw new Error('Update change is missing recordId.');\n                            dbOperation = this.supabase.from(table).update(change.payload).eq('id', change.recordId); // RLS should enforce user_id\n                        } else if (change.changeType === 'DELETE') {\n                            // For delete, we need the record ID\n                            if (!change.recordId) throw new Error('Delete change is missing recordId.');\n                            dbOperation = this.supabase.from(table).delete().eq('id', change.recordId); // RLS should enforce user_id\n                        } else {\n                            throw new Error(";
Unknown;
change;
type: $;
{
    change.changeType;
}
");\n                        }\n\n                        // Execute the DB operation\n                        const { error: dbError } = await dbOperation; // Use dbError to avoid conflict with outer error\n\n                        if (dbError) {\n                            // Check for specific error codes indicating conflicts (e.g., unique constraint violation on INSERT)\n                            // Supabase error codes: https://postgrest.org/en/v7.0/api.html#errors\n                            // PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html\n                            // Example: '23505' is unique_violation\n                            if (dbError.code === '23505' && change.changeType === 'INSERT') {\n                                console.warn("[SyncService];
Conflict;
detected;
for (change; $; { change: change, : .id }(Unique, constraint, violation).(__makeTemplateObject([");\n                                this.context.loggingService?.logWarning("], [");\n                                this.context.loggingService?.logWarning("])))
    Conflict;
detected;
for (local; change; )
    : $;
{
    change.id;
}
", { userId, change, error: dbError.message });\n                                conflicts++;\n                                // TODO: Implement conflict resolution logic here (e.g., fetch remote, merge, update local change, retry)\n                                // For MVP, treat as a temporary failure that might resolve on retry or manual intervention.\n                                throw new Error(";
Conflict: $;
{
    dbError.message;
}
"); // Re-throw as a specific error type\n                            }\n                            // For other errors, re-throw to trigger retry/failure handling\n                            throw dbError; // Re-throw the error\n                        }\n\n                        console.log("[SyncService];
Successfully;
pushed;
change;
$;
{
    change.id;
}
to;
Supabase.(__makeTemplateObject([");\n                        this.context.loggingService?.logInfo("], [");\n                        this.context.loggingService?.logInfo("]));
Successfully;
pushed;
local;
change: $;
{
    change.id;
}
", { userId, change });\n                        itemsProcessed++;\n\n                        // Mark change as completed (remove from queue)\n                        this.localChangeQueue = this.localChangeQueue.filter(c => c.id !== change.id); // Remove the completed change\n                        // Status for this data type will be updated when the batch finishes or queue is empty\n                        // this.updateStatus(change.dataType, 'idle', 'Push successful', userId); // Too granular\n                        this.lastSyncTimestamp[change.dataType] = Date.now(); // Update timestamp for this data type\n\n                    } catch (error: any) {\n                        console.error("[SyncService];
Failed;
to;
push;
change;
$;
{
    change.id;
}
for ($; { change: change, : .dataType }; )
    : ", error.message);\n                        this.context.loggingService?.logError(";
Failed;
to;
push;
local;
change;
for ($; { change: change, : .dataType }; )
    : $;
{
    change.id;
}
", { userId, change, error: error.message });\n                        errors++;\n                        if (error.message.includes('Conflict')) conflicts++;\n\n                        // Mark change as failed and increment retry count\n                        const changeIndex = this.localChangeQueue.findIndex(c => c.id === change.id);\n                        if (changeIndex > -1) {\n                            this.localChangeQueue[changeIndex].retryCount++;\n                            this.localChangeQueue[changeIndex].error = error.message; // Store the error message\n                            this.localChangeQueue[changeIndex].status = 'pending'; // Keep status as pending for retry\n                            // Update status for this data type to error if it's the first error for this type in this batch\n                            if (this.syncStatus[change.dataType] !== 'error') {\n                                 this.updateStatus(change.dataType, 'error', ";
Push;
failed: $;
{
    error.message;
}
", userId);\n                            }\n                            this.updateStatus('system', 'syncing', ";
Push;
failed($, { change: change, : .dataType }).Retrying;
", userId); // Keep system syncing/error\n\n                             // Publish a sync_error event for this specific change\n                             const errorPayload: SyncErrorPayload = { dataType: change.dataType, userId, error: error.message, timestamp: Date.now(), step: ";
Push;
failed;
for (change; $; { change: change, : .id }(__makeTemplateObject([", change, retryCount: this.localChangeQueue[changeIndex].retryCount };\n                             this.context.eventBus?.publish('sync_error', errorPayload, userId);\n                        }\n                        // Do NOT re-throw here, allow other promises in the batch to complete\n                    }\n                });\n\n                // Wait for all promises in the batch to settle (either fulfill or reject)\n                await Promise.allSettled(pushPromises);\n\n                // --- New: Save the updated queue state to persistence after processing a batch ---\n                this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after batch processing:', err));\n                // --- End New ---\n\n                // After processing the batch, check if there are still pending changes to retry or process\n                const remainingPending = this.localChangeQueue.filter(change => change.status === 'pending' && change.retryCount < MAX_RETRY_COUNT);\n                const failedMaxRetries = this.localChangeQueue.filter(change => change.status === 'pending' && change.retryCount >= MAX_RETRY_COUNT);\n\n                if (remainingPending.length > 0) {\n                    console.log("], [", change, retryCount: this.localChangeQueue[changeIndex].retryCount };\n                             this.context.eventBus?.publish('sync_error', errorPayload, userId);\n                        }\n                        // Do NOT re-throw here, allow other promises in the batch to complete\n                    }\n                });\n\n                // Wait for all promises in the batch to settle (either fulfill or reject)\n                await Promise.allSettled(pushPromises);\n\n                // --- New: Save the updated queue state to persistence after processing a batch ---\n                this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after batch processing:', err));\n                // --- End New ---\n\n                // After processing the batch, check if there are still pending changes to retry or process\n                const remainingPending = this.localChangeQueue.filter(change => change.status === 'pending' && change.retryCount < MAX_RETRY_COUNT);\n                const failedMaxRetries = this.localChangeQueue.filter(change => change.status === 'pending' && change.retryCount >= MAX_RETRY_COUNT);\n\n                if (remainingPending.length > 0) {\n                    console.log("]))[SyncService])
    $;
{
    remainingPending.length;
}
changes;
remaining in queue.Retrying;
after;
delay.(__makeTemplateObject([");\n                    this.updateStatus('system', 'syncing', "], [");\n                    this.updateStatus('system', 'syncing', "]));
Retrying;
failed;
pushes;
", userId); // Keep system status as syncing\n                    // Wait before processing the next batch/retrying\n                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));\n                } else if (failedMaxRetries.length > 0) {\n                     console.warn("[SyncService];
$;
{
    failedMaxRetries.length;
}
changes;
failed;
after;
max;
retries.(__makeTemplateObject([");\n                     this.context.loggingService?.logWarning("], [");\n                     this.context.loggingService?.logWarning("]));
$;
{
    failedMaxRetries.length;
}
changes;
failed;
after;
max;
retries.(__makeTemplateObject([", { userId, dataType: 'system', failedCount: failedMaxRetries.length });\n                     const errorMessage = "], [", { userId, dataType: 'system', failedCount: failedMaxRetries.length });\n                     const errorMessage = "]));
$;
{
    failedMaxRetries.length;
}
changes;
failed;
after;
$;
{
    MAX_RETRY_COUNT;
}
retries.(__makeTemplateObject([";\n                     this.updateStatus('system', 'error', "], [";\n                     this.updateStatus('system', 'error', "]));
Sync;
failed: $;
{
    errorMessage;
}
", userId); // Set system status to error\n                     const errorPayload: SyncErrorPayload = { dataType: 'system', userId, error: errorMessage, timestamp: Date.now(), step: 'Max retries reached for some changes' };\n                     this.context.eventBus?.publish('sync_error', errorPayload, userId);\n                     // Clear these failed changes from the queue? Or move to a separate 'failed' state?\n                     // For MVP, let's keep them in the queue but they won't be processed by the filter anymore.\n                     // A real system would move them to a 'failed' state for manual review/handling.\n                     // Let's filter them out of the main queue for simplicity in MVP UI.\n                     this.localChangeQueue = this.localChangeQueue.filter(change => change.retryCount < MAX_RETRY_COUNT); // Remove changes that hit max retries\n                     // --- New: Save the queue after removing max retries ---\n                     this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after removing max retries:', err));\n                     // --- End New ---\n                } else {\n                    // Queue is empty after processing the batch\n                    console.log('[SyncService] Queue empty after batch processing.');\n                    this.updateStatus('system', 'idle', 'Queue empty', userId); // Set system status to idle\n                    this.lastSyncTimestamp['system'] = Date.now(); // Update system timestamp\n                    const resultPayload: SyncResultPayload = { dataType: 'system', userId, status: 'success', timestamp: Date.now(), duration_ms: Date.now() - startTime, itemsProcessed, conflicts, errors };\n                    this.context.eventBus?.publish('sync_completed', resultPayload, userId); // Publish completion event\n                    // --- New: Save the empty queue to persistence ---\n                    this.saveLocalChangeQueue().catch(err => console.error('Error saving empty queue:', err));\n                    // --- End New ---\n                }\n            }\n\n        } catch (error: any) {\n            console.error('[SyncService] Unexpected error during queue processing:', error.message);\n            this.context.loggingService?.logError('Unexpected error during queue processing', { userId, error: error.message });\n            this.updateStatus('system', 'error', ";
Unexpected;
error;
processing;
queue: $;
{
    error.message;
}
", userId); // Set system status to error\n            const errorPayload: SyncErrorPayload = { dataType: 'system', userId, error: error.message, timestamp: Date.now(), step: 'Unexpected error during queue processing' };\n            this.context.eventBus?.publish('sync_error', errorPayload, userId);\n             // --- New: Save the queue state on unexpected error ---\n             this.saveLocalChangeQueue().catch(err => console.error('Error saving queue on unexpected error:', err));\n             // --- End New ---\n            throw error; // Re-throw the error\n        } finally {\n            this.isProcessingQueue = false;\n            console.log('[SyncService] Local change queue processing finished.');\n        }\n    }\n\n\n    /**\n     * Initiates a full synchronization cycle for a specific user.\n     * This involves pulling remote changes, merging, and pushing local changes.\n     * Part of the Bidirectional Sync Domain.\n     * @param userId The user ID to sync for. Required.\n     * @returns Promise<void>\n     */\n    async syncAllData(userId: string): Promise<void> {\n        console.log("[SyncService];
Initiating;
full;
sync;
for (user; ; )
    : $;
{
    userId;
}
");\n        this.context.loggingService?.logInfo(";
Initiating;
full;
sync;
for (user; $; { userId: userId }(__makeTemplateObject([", { userId });\n\n        if (!userId) {\n            console.error('[SyncService] Cannot initiate sync: User ID is required.');\n            this.context.loggingService?.logError('Cannot initiate sync: User ID is required.');\n            throw new Error('User ID is required to initiate sync.');\n        }\n\n        // Prevent multiple syncs running concurrently\n        if (this.getSyncStatus('system') === 'syncing') {\n            console.warn('[SyncService] Sync already in progress. Skipping new sync request.');\n            this.context.loggingService?.logWarning('Sync already in progress. Skipping new sync request.', { userId });\n            return;\n        }\n\n        this.updateStatus('system', 'syncing', 'Starting full sync', userId); // Update system status\n        const startTime = Date.now();\n        const initialQueueSize = this.localChangeQueue.length;\n        const initialErrors = this.localChangeQueue.filter(c => c.retryCount >= MAX_RETRY_COUNT).length; // Count changes already failed max retries\n\n        const syncResultPayload: Partial<SyncResultPayload> = { dataType: 'system', userId, direction: 'bidirectional', timestamp: Date.now(), itemsProcessed: 0, conflicts: 0, errors: initialErrors };\n\n        try {\n            // 1. Pull remote changes for all data types\n            // As discussed, we rely on individual service Realtime subscriptions for ongoing changes.\n            // A full \"pull\" here would involve fetching all data for each type and merging,\n            // which is complex and deferred for MVP.\n            // For MVP, this step primarily ensures Realtime subscriptions are active (handled by auth listener)\n            // and simulates a pull process.\n            this.updateStatus('system', 'syncing', 'Pulling remote changes', userId); // Update system status\n            await this.pullRemoteChanges(userId); // This method is now mostly a placeholder\n            this.updateStatus('system', 'syncing', 'Remote pull complete, processing queue', userId); // Update system status\n\n            // 2. Process local change queue (pushes local changes)\n            // This is triggered automatically when changes are added, but we explicitly trigger it here\n            // to ensure any pending changes are pushed after the (simulated) pull.\n            // The processLocalChangeQueue method now handles the loop and final status update.\n            // We need to wait for it to finish to determine the final result.\n            await this.processLocalChangeQueue(userId); // Process any changes that occurred during pull or were pending\n\n            // 3. (Optional) Re-pull after pushing to catch any conflicts or changes made by other devices during push\n            // This adds robustness but increases complexity and network traffic.\n            // For MVP, we'll skip this step. Realtime listeners should handle most cases.\n\n            // The final status and completion/error event are now published by processLocalChangeQueue\n            // We can listen to the final sync_completed or sync_error event for 'system' dataType\n            // to update the overall syncResultPayload and log it.\n\n            // For MVP, let's just log a success message here if processLocalChangeQueue finished without throwing.\n            // The actual success/failure event is published by processLocalChangeQueue.\n            console.log("], [", { userId });\n\n        if (!userId) {\n            console.error('[SyncService] Cannot initiate sync: User ID is required.');\n            this.context.loggingService?.logError('Cannot initiate sync: User ID is required.');\n            throw new Error('User ID is required to initiate sync.');\n        }\n\n        // Prevent multiple syncs running concurrently\n        if (this.getSyncStatus('system') === 'syncing') {\n            console.warn('[SyncService] Sync already in progress. Skipping new sync request.');\n            this.context.loggingService?.logWarning('Sync already in progress. Skipping new sync request.', { userId });\n            return;\n        }\n\n        this.updateStatus('system', 'syncing', 'Starting full sync', userId); // Update system status\n        const startTime = Date.now();\n        const initialQueueSize = this.localChangeQueue.length;\n        const initialErrors = this.localChangeQueue.filter(c => c.retryCount >= MAX_RETRY_COUNT).length; // Count changes already failed max retries\n\n        const syncResultPayload: Partial<SyncResultPayload> = { dataType: 'system', userId, direction: 'bidirectional', timestamp: Date.now(), itemsProcessed: 0, conflicts: 0, errors: initialErrors };\n\n        try {\n            // 1. Pull remote changes for all data types\n            // As discussed, we rely on individual service Realtime subscriptions for ongoing changes.\n            // A full \\\"pull\\\" here would involve fetching all data for each type and merging,\n            // which is complex and deferred for MVP.\n            // For MVP, this step primarily ensures Realtime subscriptions are active (handled by auth listener)\n            // and simulates a pull process.\n            this.updateStatus('system', 'syncing', 'Pulling remote changes', userId); // Update system status\n            await this.pullRemoteChanges(userId); // This method is now mostly a placeholder\n            this.updateStatus('system', 'syncing', 'Remote pull complete, processing queue', userId); // Update system status\n\n            // 2. Process local change queue (pushes local changes)\n            // This is triggered automatically when changes are added, but we explicitly trigger it here\n            // to ensure any pending changes are pushed after the (simulated) pull.\n            // The processLocalChangeQueue method now handles the loop and final status update.\n            // We need to wait for it to finish to determine the final result.\n            await this.processLocalChangeQueue(userId); // Process any changes that occurred during pull or were pending\n\n            // 3. (Optional) Re-pull after pushing to catch any conflicts or changes made by other devices during push\n            // This adds robustness but increases complexity and network traffic.\n            // For MVP, we'll skip this step. Realtime listeners should handle most cases.\n\n            // The final status and completion/error event are now published by processLocalChangeQueue\n            // We can listen to the final sync_completed or sync_error event for 'system' dataType\n            // to update the overall syncResultPayload and log it.\n\n            // For MVP, let's just log a success message here if processLocalChangeQueue finished without throwing.\n            // The actual success/failure event is published by processLocalChangeQueue.\n            console.log("]))[SyncService])
    Full;
sync;
process;
initiated;
for (user; $; { userId: userId }.Final)
    status;
will;
be;
reported;
by;
queue;
processor.(__makeTemplateObject([");\n\n        } catch (error: any) {\n            console.error("], [");\n\n        } catch (error: any) {\n            console.error("]))[SyncService];
Error;
during;
full;
sync;
for (user; $; { userId: userId })
    : ", error.message);\n            this.context.loggingService?.logError(";
Full;
sync;
failed;
for (user; $; { userId: userId }(__makeTemplateObject([", { userId, error: error.message });\n            // The status and error event are already updated by processLocalChangeQueue or error handlers\n            // Ensure system status is error if it wasn't already set by processLocalChangeQueue\n            if (this.getSyncStatus('system') !== 'error') {\n                 this.updateStatus('system', 'error', "], [", { userId, error: error.message });\n            // The status and error event are already updated by processLocalChangeQueue or error handlers\n            // Ensure system status is error if it wasn't already set by processLocalChangeQueue\n            if (this.getSyncStatus('system') !== 'error') {\n                 this.updateStatus('system', 'error', "])))
    Full;
sync;
failed: $;
{
    error.message;
}
", userId); // Update system status\n                 const errorPayload: SyncErrorPayload = { dataType: 'system', userId, error: error.message, timestamp: Date.now(), step: 'Error during full sync initiation' };\n                 this.context.eventBus?.publish('sync_error', errorPayload, userId);\n            }\n            throw error; // Re-throw the error\n        } finally {\n             // The isProcessingQueue flag is managed by processLocalChangeQueue\n             // The final status and result event are published by processLocalChangeQueue\n        }\n    }\n\n    /**\n     * Initiates synchronization for a specific data type.\n     * For MVP, this triggers a pull (via Realtime listeners) and then processes the local queue for that type.\n     * @param dataType The type of data to sync. Required.\n     * @param userId The user ID to sync for. Required.\n     * @param direction The sync direction ('up', 'down', 'bidirectional'). Required.\n     * @returns Promise<void>\n     */\n    async syncDataType(dataType: SynchronizableDataType, userId: string, direction: 'up' | 'down' | 'bidirectional'): Promise<void> {\n        console.log("[SyncService];
Initiating;
$;
{
    direction;
}
sync;
for (data; type; )
    : $;
{
    dataType;
}
for (user; ; )
    : $;
{
    userId;
}
");\n        this.context.loggingService?.logInfo(";
Initiating;
$;
{
    direction;
}
sync;
for (data; type; $) {
    dataType;
}
", { dataType, userId, direction });\n\n        if (!userId) {\n            console.error('[SyncService] Cannot initiate data type sync: User ID is required.');\n            this.context.loggingService?.logError('Cannot initiate data type sync: User ID is required.');\n            throw new Error('User ID is required to initiate data type sync.');\n        }\n\n        // Prevent multiple syncs for the same data type concurrently\n        // Use a dedicated status flag for sync if needed, or reuse module status\n        if (this.getSyncStatus(dataType) === 'syncing') {\n            console.warn("[SyncService];
$;
{
    dataType;
}
sync;
already in progress.Skipping;
new sync;
request.(__makeTemplateObject([");\n            this.context.loggingService?.logWarning("], [");\n            this.context.loggingService?.logWarning("]));
$;
{
    dataType;
}
sync;
already in progress.Skipping;
new sync;
request.(__makeTemplateObject([", { dataType, userId });\n            return;\n        }\n\n        this.updateStatus(dataType, 'syncing', "], [", { dataType, userId });\n            return;\n        }\n\n        this.updateStatus(dataType, 'syncing', "]));
Starting;
$;
{
    direction;
}
sync(__makeTemplateObject([", userId); // Update status for this type\n        const startTime = Date.now();\n        let itemsProcessed = 0;\n        let conflicts = 0;\n        let errors = 0;\n\n        try {\n            // 1. Pull remote changes (if direction is 'down' or 'bidirectional')\n            // As discussed, we rely on individual service Realtime subscriptions for ongoing changes.\n            // A full \"pull\" here would involve fetching all data for this type and merging.\n            // For MVP, this step primarily ensures Realtime subscriptions are active (handled by auth listener)\n            // and simulates a pull process.\n            if (direction === 'down' || direction === 'bidirectional') {\n                 this.updateStatus(dataType, 'syncing', 'Pulling remote changes', userId);\n                 // Simulate pull delay\n                 await new Promise(resolve => setTimeout(resolve, 1000));\n                 // Realtime listeners in services are assumed to handle applying changes.\n                 console.log("], [", userId); // Update status for this type\n        const startTime = Date.now();\n        let itemsProcessed = 0;\n        let conflicts = 0;\n        let errors = 0;\n\n        try {\n            // 1. Pull remote changes (if direction is 'down' or 'bidirectional')\n            // As discussed, we rely on individual service Realtime subscriptions for ongoing changes.\n            // A full \\\"pull\\\" here would involve fetching all data for this type and merging.\n            // For MVP, this step primarily ensures Realtime subscriptions are active (handled by auth listener)\n            // and simulates a pull process.\n            if (direction === 'down' || direction === 'bidirectional') {\n                 this.updateStatus(dataType, 'syncing', 'Pulling remote changes', userId);\n                 // Simulate pull delay\n                 await new Promise(resolve => setTimeout(resolve, 1000));\n                 // Realtime listeners in services are assumed to handle applying changes.\n                 console.log("]))[SyncService];
Remote;
pull;
for ($; { dataType: dataType }; initiated(relying, on, Realtime, listeners).(__makeTemplateObject([");\n            }\n\n            // 2. Process local change queue (pushes local changes if direction is 'up' or 'bidirectional')\n            // This is triggered automatically when changes are added, but we explicitly trigger it here\n            // to ensure any pending changes for THIS data type are pushed.\n            if (direction === 'up' || direction === 'bidirectional') {\n                 // Filter the local queue to only process changes for this data type\n                 const changesForType = this.localChangeQueue.filter(change => change.dataType === dataType && change.status === 'pending' && change.retryCount < MAX_RETRY_COUNT);\n                 if (changesForType.length > 0) {\n                     this.updateStatus(dataType, 'syncing', "], [");\n            }\n\n            // 2. Process local change queue (pushes local changes if direction is 'up' or 'bidirectional')\n            // This is triggered automatically when changes are added, but we explicitly trigger it here\n            // to ensure any pending changes for THIS data type are pushed.\n            if (direction === 'up' || direction === 'bidirectional') {\n                 // Filter the local queue to only process changes for this data type\n                 const changesForType = this.localChangeQueue.filter(change => change.dataType === dataType && change.status === 'pending' && change.retryCount < MAX_RETRY_COUNT);\n                 if (changesForType.length > 0) {\n                     this.updateStatus(dataType, 'syncing', "])))
    Pushing;
local;
changes($, { changesForType: changesForType, : .length }, items)(__makeTemplateObject([", userId);\n                     // Manually process changes for this type in batches\n                     const changesToProcess = [...changesForType]; // Process a copy\n                     let processedCountInType = 0;\n\n                     while (processedCountInType < changesToProcess.length) {\n                         const change = changesToProcess[processedCountInType];\n\n                         // Find the change in the main queue to check its latest status and retry count\n                         const mainQueueIndex = this.localChangeQueue.findIndex(c => c.id === change.id);\n                         if (mainQueueIndex === -1 || this.localChangeQueue[mainQueueIndex].status !== 'pending' || this.localChangeQueue[mainQueueIndex].retryCount >= MAX_RETRY_COUNT) {\n                             processedCountInType++; // Skip if already processed, failed max retries, or removed\n                             continue;\n                         }\n\n                         const currentQueueChange = this.localChangeQueue[mainQueueIndex];\n                         currentQueueChange.status = 'processing'; // Temporarily mark as processing\n\n                         try {\n                             // Attempt to push the change to Supabase (reusing logic from processLocalChangeQueue)\n                             const tables = DATA_TYPE_TABLE_MAP[currentQueueChange.dataType];\n                             const table = tables[0]; // Using the first table for the data type (MVP simplification)\n                             let dbOperation;\n                             if (currentQueueChange.changeType === 'INSERT') { dbOperation = this.supabase.from(table).insert([currentQueueChange.payload]); }\n                             else if (currentQueueChange.changeType === 'UPDATE') { if (!currentQueueChange.recordId) throw new Error('Update missing recordId'); dbOperation = this.supabase.from(table).update(currentQueueChange.payload).eq('id', currentQueueChange.recordId); }\n                             else if (currentQueueChange.changeType === 'DELETE') { if (!currentQueueChange.recordId) throw new Error('Delete missing recordId'); dbOperation = this.supabase.from(table).delete().eq('id', currentQueueChange.recordId); }\n                             else { throw new Error("], [", userId);\n                     // Manually process changes for this type in batches\n                     const changesToProcess = [...changesForType]; // Process a copy\n                     let processedCountInType = 0;\n\n                     while (processedCountInType < changesToProcess.length) {\n                         const change = changesToProcess[processedCountInType];\n\n                         // Find the change in the main queue to check its latest status and retry count\n                         const mainQueueIndex = this.localChangeQueue.findIndex(c => c.id === change.id);\n                         if (mainQueueIndex === -1 || this.localChangeQueue[mainQueueIndex].status !== 'pending' || this.localChangeQueue[mainQueueIndex].retryCount >= MAX_RETRY_COUNT) {\n                             processedCountInType++; // Skip if already processed, failed max retries, or removed\n                             continue;\n                         }\n\n                         const currentQueueChange = this.localChangeQueue[mainQueueIndex];\n                         currentQueueChange.status = 'processing'; // Temporarily mark as processing\n\n                         try {\n                             // Attempt to push the change to Supabase (reusing logic from processLocalChangeQueue)\n                             const tables = DATA_TYPE_TABLE_MAP[currentQueueChange.dataType];\n                             const table = tables[0]; // Using the first table for the data type (MVP simplification)\n                             let dbOperation;\n                             if (currentQueueChange.changeType === 'INSERT') { dbOperation = this.supabase.from(table).insert([currentQueueChange.payload]); }\n                             else if (currentQueueChange.changeType === 'UPDATE') { if (!currentQueueChange.recordId) throw new Error('Update missing recordId'); dbOperation = this.supabase.from(table).update(currentQueueChange.payload).eq('id', currentQueueChange.recordId); }\n                             else if (currentQueueChange.changeType === 'DELETE') { if (!currentQueueChange.recordId) throw new Error('Delete missing recordId'); dbOperation = this.supabase.from(table).delete().eq('id', currentQueueChange.recordId); }\n                             else { throw new Error("]));
Unknown;
change;
type: $;
{
    currentQueueChange.changeType;
}
"); }\n\n                             const { error: dbError } = await dbOperation;\n\n                             if (dbError) { throw dbError; }\n\n                             // On success, remove from queue and mark completed\n                             this.localChangeQueue = this.localChangeQueue.filter(c => c.id !== currentQueueChange.id); // Remove the completed change\n                             currentQueueChange.status = 'completed'; // Mark as completed (optional, for logging)\n                             this.context.loggingService?.logInfo(";
Successfully;
pushed;
local;
change;
for ($; { dataType: dataType }; )
    : $;
{
    currentQueueChange.id;
}
", { userId, change: currentQueueChange });\n                             itemsProcessed++;\n\n                         } catch (error: any) {\n                             console.error("[SyncService];
Failed;
to;
push;
change;
$;
{
    currentQueueChange.id;
}
for ($; { currentQueueChange: currentQueueChange, : .dataType }; )
    : ", error.message);\n                             this.context.loggingService?.logError(";
Failed;
to;
push;
local;
change;
for ($; { currentQueueChange: currentQueueChange, : .dataType }; )
    : $;
{
    currentQueueChange.id;
}
", { userId, change: currentQueueChange, error: error.message });\n                             errors++;\n                             if (error.message.includes('Conflict')) conflicts++;\n\n                             // Mark change as failed and increment retry count in the main queue\n                             const mainQueueIdx = this.localChangeQueue.findIndex(c => c.id === currentQueueChange.id);\n                             if (mainQueueIdx > -1) {\n                                 this.localChangeQueue[mainQueueIdx].retryCount++;\n                                 this.localChangeQueue[mainQueueIdx].error = error.message; // Store the error message\n                                 this.localChangeQueue[mainQueueIdx].status = 'pending'; // Keep status as pending for retry\n                                 // Update status for this data type to error if it's the first error for this type in this sync\n                                 if (this.syncStatus[dataType] !== 'error') {\n                                      this.updateStatus(dataType, 'error', ";
Push;
failed: $;
{
    error.message;
}
", userId);\n                                 }\n                             }\n                             // Do NOT re-throw here, continue processing the batch\n                         }\n                         processedCountInType++;\n                         // Add a small delay between pushes\n                         await new Promise(resolve => setTimeout(resolve, 50));\n                     }\n                     console.log("[SyncService];
Finished;
processing;
local;
queue;
for (data; type; )
    : $;
{
    dataType;
}
");\n                 } else {\n                     console.log("[SyncService];
No;
pending;
local;
changes;
for (data; type; )
    : $;
{
    dataType;
}
");\n                 }\n            }\n\n            // Check final status for this data type and publish completion/error event\n            const pendingChangesForType = this.localChangeQueue.filter(change => change.dataType === dataType);\n            const failedMaxRetriesForType = pendingChangesForType.filter(change => change.retryCount >= MAX_RETRY_COUNT);\n\n            if (pendingChangesForType.length === 0) {\n                 this.updateStatus(dataType, 'idle', ";
$;
{
    direction;
}
sync;
completed(__makeTemplateObject([", userId); // Set status to idle\n                 this.lastSyncTimestamp[dataType] = Date.now(); // Update timestamp for this data type\n                 const resultPayload: SyncResultPayload = { dataType, userId, status: 'success', timestamp: Date.now(), direction, itemsProcessed, conflicts, errors, duration_ms: Date.now() - startTime };\n                 this.context.eventBus?.publish('sync_completed', resultPayload, userId); // Publish completion event\n                 console.log("], [", userId); // Set status to idle\n                 this.lastSyncTimestamp[dataType] = Date.now(); // Update timestamp for this data type\n                 const resultPayload: SyncResultPayload = { dataType, userId, status: 'success', timestamp: Date.now(), direction, itemsProcessed, conflicts, errors, duration_ms: Date.now() - startTime };\n                 this.context.eventBus?.publish('sync_completed', resultPayload, userId); // Publish completion event\n                 console.log("]))[SyncService];
$;
{
    direction;
}
sync;
completed;
for (data; type; )
    : $;
{
    dataType;
}
");\n            } else if (failedMaxRetriesForType.length > 0) {\n                 console.warn("[SyncService];
$;
{
    direction;
}
sync;
finished;
with (failed)
    changes;
for (data; type; )
    : $;
{
    dataType;
}
Failed: $;
{
    failedMaxRetriesForType.length;
}
");\n                 this.context.loggingService?.logWarning(";
$;
{
    direction;
}
sync;
finished;
with (failed)
    changes;
for ($; { dataType: dataType }(__makeTemplateObject([", { userId, dataType, failedCount: failedMaxRetriesForType.length });\n                 const errorMessage = "], [", { userId, dataType, failedCount: failedMaxRetriesForType.length });\n                 const errorMessage = "])); $) {
    failedMaxRetriesForType.length;
}
changes;
failed;
after;
$;
{
    MAX_RETRY_COUNT;
}
retries.(__makeTemplateObject([";\n                 this.updateStatus(dataType, 'error', "], [";\n                 this.updateStatus(dataType, 'error', "]));
$;
{
    direction;
}
sync;
failed: $;
{
    errorMessage;
}
", userId); // Set status to error\n                 const errorPayload: SyncErrorPayload = { dataType, userId, error: errorMessage, timestamp: Date.now(), step: ";
Sync;
failed;
for ($; { dataType: dataType }; after)
    retries(__makeTemplateObject([", direction };\n                 this.context.eventBus?.publish('sync_error', errorPayload, userId);\n                 // Remove changes that hit max retries from the main queue for simplicity in MVP UI.\n                 this.localChangeQueue = this.localChangeQueue.filter(change => change.retryCount < MAX_RETRY_COUNT); // Remove changes that hit max retries\n                 this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after removing max retries:', err));\n            } else {\n                 // Status is still 'syncing' if there are pending changes with retries left\n                 console.log("], [", direction };\n                 this.context.eventBus?.publish('sync_error', errorPayload, userId);\n                 // Remove changes that hit max retries from the main queue for simplicity in MVP UI.\n                 this.localChangeQueue = this.localChangeQueue.filter(change => change.retryCount < MAX_RETRY_COUNT); // Remove changes that hit max retries\n                 this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after removing max retries:', err));\n            } else {\n                 // Status is still 'syncing' if there are pending changes with retries left\n                 console.log("]))[SyncService];
$;
{
    direction;
}
sync;
finished;
with (pending)
    changes(retries, left);
for (data; type; )
    : $;
{
    dataType;
}
Pending: $;
{
    pendingChangesForType.length;
}
");\n                 this.updateStatus(dataType, 'syncing', ";
$;
{
    direction;
}
sync;
pending;
retries($, { pendingChangesForType: pendingChangesForType, : .length })(__makeTemplateObject([", userId); // Keep status as syncing\n                 // The processLocalChangeQueue will continue processing these in the main loop\n            }\n\n            // --- New: Save the queue state to persistence after processing ---\n            this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after processing data type sync:', err));\n            // --- End New ---\n\n        } catch (error: any) {\n            console.error("], [", userId); // Keep status as syncing\n                 // The processLocalChangeQueue will continue processing these in the main loop\n            }\n\n            // --- New: Save the queue state to persistence after processing ---\n            this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after processing data type sync:', err));\n            // --- End New ---\n\n        } catch (error: any) {\n            console.error("]))[SyncService];
Error;
during;
$;
{
    direction;
}
sync;
for (data; type; $) {
    dataType;
}
for (user; $; { userId: userId })
    : ", error.message);\n            this.context.loggingService?.logError(";
Data;
for ($; { dataType: dataType }(__makeTemplateObject([", { dataType, userId, direction, error: error.message });\n            this.updateStatus(dataType, 'error', "], [", { dataType, userId, direction, error: error.message });\n            this.updateStatus(dataType, 'error', "])); $) {
    direction;
}
sync;
failed: $;
{
    error.message;
}
", userId); // Set status to error\n            this.updateStatus('system', 'error', ";
Sync;
failed;
for ($; { dataType: dataType }(__makeTemplateObject([", userId); // Update system status as well\n            const errorPayload: SyncErrorPayload = { dataType, userId, error: error.message, timestamp: Date.now(), step: "], [", userId); // Update system status as well\n            const errorPayload: SyncErrorPayload = { dataType, userId, error: error.message, timestamp: Date.now(), step: "])); Error)
    during;
$;
{
    direction;
}
sync(__makeTemplateObject([", direction };\n            this.context.eventBus?.publish('sync_error', errorPayload, userId);\n             // --- New: Save the queue state on unexpected error ---\n             this.saveLocalChangeQueue().catch(err => console.error('Error saving queue on unexpected error:', err));\n             // --- End New ---\n            throw error; // Re-throw the error\n        } finally {\n             // The isProcessingQueue flag is managed by processLocalChangeQueue\n             // The final status and result event are published by processLocalChangeQueue\n        }\n    }\n\n\n    /**\n     * Pulls remote changes from Supabase for all synchronizable data types.\n     * Remote changes are handled by the Realtime subscription listeners,\n     * which update the local state and publish events.\n     * This method primarily ensures the Realtime subscriptions are active\n     * and potentially fetches initial data if the cache is empty or stale.\n     * @param userId The user ID. Required.\n     * @returns Promise<void>\n     */\n    private async pullRemoteChanges(userId: string): Promise<void> {\n        console.log("], [", direction };\n            this.context.eventBus?.publish('sync_error', errorPayload, userId);\n             // --- New: Save the queue state on unexpected error ---\n             this.saveLocalChangeQueue().catch(err => console.error('Error saving queue on unexpected error:', err));\n             // --- End New ---\n            throw error; // Re-throw the error\n        } finally {\n             // The isProcessingQueue flag is managed by processLocalChangeQueue\n             // The final status and result event are published by processLocalChangeQueue\n        }\n    }\n\n\n    /**\n     * Pulls remote changes from Supabase for all synchronizable data types.\n     * Remote changes are handled by the Realtime subscription listeners,\n     * which update the local state and publish events.\n     * This method primarily ensures the Realtime subscriptions are active\n     * and potentially fetches initial data if the cache is empty or stale.\n     * @param userId The user ID. Required.\n     * @returns Promise<void>\n     */\n    private async pullRemoteChanges(userId: string): Promise<void> {\n        console.log("]))[SyncService];
Pulling;
remote;
changes;
for (user; ; )
    : $;
{
    userId;
}
");\n        this.updateStatus('system', 'syncing', 'Starting remote pull', userId); // Update system status\n        const startTime = Date.now();\n\n        // Ensure Realtime subscriptions are active\n        // Note: Individual services (MemoryEngine, etc.) are now responsible for their own Realtime subscriptions.\n        // The SyncService primarily manages the local queue and orchestrates pushes/pulls.\n        // This check and subscription call are removed as they are redundant if services subscribe themselves.\n        // if (this.realtimeSubscriptions.size === 0) {\n        //      console.warn('[SyncService] Realtime subscriptions are not active. Subscribing now.');\n        //      this.subscribeToRealtimeUpdates(userId);\n        //      // Wait a moment for subscriptions to connect? Or rely on them connecting asynchronously.\n        //      // For MVP, rely on them connecting asynchronously.\n        // }\n\n        // For robustness, especially on startup or after being offline,\n        // fetch initial data for each type if the local state is empty or potentially stale.\n        // This is complex to manage efficiently (e.g., fetching only changes since last sync).\n        // For MVP, we rely heavily on Realtime for ongoing changes.\n        // Initial data load on login is handled by individual services (e.g., RuneEngraftingCenter loads user runes).\n        // A full \"pull\" might involve fetching all data for each type and merging with local state.\n        // This is a significant TODO for a robust sync system.\n\n        // --- New: Simulate fetching and merging remote data ---\n        this.updateStatus('system', 'syncing', 'Fetching remote data', userId); // Update system status\n        console.log("[SyncService];
Simulating;
fetching;
remote;
data;
for (user; ; )
    : $;
{
    userId;
}
");\n        // Simulate fetching data for each type\n        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate fetch time\n\n        this.updateStatus('system', 'syncing', 'Merging remote changes', userId); // Update system status\n        console.log("[SyncService];
Simulating;
merging;
remote;
data;
for (user; ; )
    : $;
{
    userId;
}
");\n        // Simulate merging data for each type\n        // This would involve calling merge logic (like mergeCRDT) for each data type\n        // and updating the local state managed by the respective services.\n        // For MVP, this is just a simulation step.\n        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate merge time\n\n        console.log("[SyncService];
Remote;
change;
pull;
and;
merge;
process;
simulated.(__makeTemplateObject([");\n        this.updateStatus('system', 'syncing', 'Remote pull complete', userId); // Update system status\n        // The system status will remain 'syncing' until the local queue is processed\n        // The final status update (idle/error) is handled by processLocalChangeQueue\n        // The lastSyncTimestamp['system'] is updated when the queue is empty\n        // Individual data type timestamps are updated when their pushes complete\n\n        // TODO: Implement actual fetching and merging logic for each data type.\n        // This would involve iterating through DATA_TYPE_TABLE_MAP, fetching data from Supabase,\n        // and calling a merge method on the corresponding service (if they expose one).\n        // Example: const remoteKnowledge = await this.supabase.from('knowledge_records').select('*').eq('user_id', userId).gte('timestamp', lastSyncTimestamp['memoryEngine']);\n        // await this.context.memoryEngine?.mergeRemoteChanges(remoteKnowledge, userId);\n        // This requires significant implementation in each service.\n\n    }\n\n\n    /**\n     * Handles remote data changes received via Supabase Realtime.\n     * Applies the changes to the local state and publishes events.\n     * This method is called by the Realtime subscription listeners.\n     * @param table The Supabase table where the change occurred. Required.\n     * @param eventType The type of database event ('INSERT', 'UPDATE', 'DELETE'). Required.\n     * @param newRecord The new record data (for INSERT/UPDATE). Optional.\n     * @param oldRecord The old record data (for UPDATE/DELETE). Optional.\n     * @param userId The user ID associated with the change. Required.\n     * @returns Promise<void>\n     */\n    // This method is removed as individual services are now responsible for handling their own remote changes via their own Realtime listeners.\n    // The SyncService's role is orchestration and local queue management.\n    /*\n    private async handleRemoteDataChange(table: string, eventType: 'INSERT' | 'UPDATE' | 'DELETE', newRecord: any, oldRecord: any, userId: string): Promise<void> {\n        console.log("], [");\n        this.updateStatus('system', 'syncing', 'Remote pull complete', userId); // Update system status\n        // The system status will remain 'syncing' until the local queue is processed\n        // The final status update (idle/error) is handled by processLocalChangeQueue\n        // The lastSyncTimestamp['system'] is updated when the queue is empty\n        // Individual data type timestamps are updated when their pushes complete\n\n        // TODO: Implement actual fetching and merging logic for each data type.\n        // This would involve iterating through DATA_TYPE_TABLE_MAP, fetching data from Supabase,\n        // and calling a merge method on the corresponding service (if they expose one).\n        // Example: const remoteKnowledge = await this.supabase.from('knowledge_records').select('*').eq('user_id', userId).gte('timestamp', lastSyncTimestamp['memoryEngine']);\n        // await this.context.memoryEngine?.mergeRemoteChanges(remoteKnowledge, userId);\n        // This requires significant implementation in each service.\n\n    }\n\n\n    /**\n     * Handles remote data changes received via Supabase Realtime.\n     * Applies the changes to the local state and publishes events.\n     * This method is called by the Realtime subscription listeners.\n     * @param table The Supabase table where the change occurred. Required.\n     * @param eventType The type of database event ('INSERT', 'UPDATE', 'DELETE'). Required.\n     * @param newRecord The new record data (for INSERT/UPDATE). Optional.\n     * @param oldRecord The old record data (for UPDATE/DELETE). Optional.\n     * @param userId The user ID associated with the change. Required.\n     * @returns Promise<void>\n     */\n    // This method is removed as individual services are now responsible for handling their own remote changes via their own Realtime listeners.\n    // The SyncService's role is orchestration and local queue management.\n    /*\n    private async handleRemoteDataChange(table: string, eventType: 'INSERT' | 'UPDATE' | 'DELETE', newRecord: any, oldRecord: any, userId: string): Promise<void> {\n        console.log("]))[SyncService];
Received;
remote;
data;
change;
via;
Realtime: $;
{
    table;
}
-$;
{
    eventType;
}
for (user; $; { userId: userId }(__makeTemplateObject([");\n        this.context.loggingService?.logInfo("], [");\n        this.context.loggingService?.logInfo("])))
    Received;
remote;
data;
change: $;
{
    table;
}
-$;
{
    eventType;
}
", { table, eventType, userId, newRecord, oldRecord });\n\n        if (!userId) {\n             console.warn('[SyncService] Cannot handle remote change: User ID is missing.');\n             return;\n        }\n\n        // Determine the data type based on the table\n        const dataType = SYNCHRONIZABLE_DATA_TYPES.find(type => DATA_TYPE_TABLE_MAP[type].includes(table));\n\n        if (!dataType) {\n            console.warn("[SyncService];
Received;
remote;
change;
for (unknown; table; )
    : $;
{
    table;
}
Skipping.(__makeTemplateObject([");\n            this.context.loggingService?.logWarning("], [");\n            this.context.loggingService?.logWarning("]));
Received;
remote;
change;
for (unknown; table; )
    : $;
{
    table;
}
", { table, eventType, userId });\n            return;\n        }\n\n        this.updateStatus(dataType, 'syncing', ";
Applying;
remote;
$;
{
    eventType;
}
for ($; { table: table }(__makeTemplateObject([", userId);\n\n        try {\n            // Apply the remote change to the local state managed by the corresponding service.\n            // This is complex and requires each service to expose methods for applying remote changes.\n            // Alternatively, the SyncService could directly manipulate the state managed by other services,\n            // but this breaks encapsulation.\n            // A better approach: The Realtime listeners in *each service* handle applying changes to their own state.\n            // The SyncService's role is primarily orchestration and managing the local queue/status.\n\n            console.log("], [", userId);\n\n        try {\n            // Apply the remote change to the local state managed by the corresponding service.\n            // This is complex and requires each service to expose methods for applying remote changes.\n            // Alternatively, the SyncService could directly manipulate the state managed by other services,\n            // but this breaks encapsulation.\n            // A better approach: The Realtime listeners in *each service* handle applying changes to their own state.\n            // The SyncService's role is primarily orchestration and managing the local queue/status.\n\n            console.log("]))[SyncService]; Remote)
    change;
for ($; { table: table }; processed(assuming, handled, by, service, 's listener).`);, this.updateStatus(dataType, 'idle', "Remote ".concat(eventType, " applied"), userId)))
    ; // Update status for this data type
try { }
catch (error) {
    console.error("[SyncService] Error applying remote change for ".concat(table, ":"), error.message);
    (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Error applying remote change: ".concat(table, " - ").concat(eventType), { table: table, eventType: eventType, userId: userId, error: error.message });
    this.updateStatus(dataType, 'error', "Error applying remote change: ".concat(error.message), userId);
    this.updateStatus('system', 'error', "Error applying remote change (".concat(dataType, ")"), userId);
}
    * /;
/**
 * Simulates synchronizing a mobile Git repository.
 * This is a placeholder for interacting with a mobile device's Git client.
 * It records a development log in the Knowledge Base.
 * Part of the Bidirectional Sync Domain and interacts with Permanent Memory.
 * @param userId The user ID. Required.
 * @param direction The sync direction ('pull', 'push', 'bidirectional'). Required.
 * @param details Optional details (e.g., repoUrl, branch).
 * @returns Promise<any> The simulated sync result.
 */
async;
syncMobileGitRepo(userId, string, direction, 'pull' | 'push' | 'bidirectional', details ?  : any);
Promise < any > {
    console: console,
    : .log("[SyncService] Simulating Mobile Git sync (".concat(direction, ") for user: ").concat(userId, "...")),
    this: (_b = .context.loggingService) === null || _b === void 0 ? void 0 : _b.logInfo("Simulating Mobile Git sync (".concat(direction, ")"), { userId: userId, direction: direction, details: details }),
    if: function (, userId) {
        var _a;
        console.warn('[SyncService] Cannot simulate Git sync: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot simulate Git sync: User ID is required.');
        throw new Error('User ID is required to simulate Git sync.');
    }
    // Prevent multiple Git syncs running concurrently (or manage state per Git repo)
    // For MVP, use a simple flag
    // Use analyticsService status as a proxy for Git sync state for MVP
    ,
    : .getSyncStatus('analyticsService') === 'syncing'
};
{ // Check the proxy status
    console.warn('[SyncService] Mobile Git sync already in progress. Skipping new sync request.');
    (_c = this.context.loggingService) === null || _c === void 0 ? void 0 : _c.logWarning('Mobile Git sync already in progress. Skipping new sync request.', { userId: userId });
    // Publish a status update indicating it's busy
    (_d = this.context.eventBus) === null || _d === void 0 ? void 0 : _d.publish('mobile_git_sync_status', { userId: userId, status: 'syncing', step: "Git sync already running.", error: 'Sync already in progress.' }, userId);
    throw new Error('Mobile Git sync already in progress.');
}
// Use analyticsService status as a proxy for Git sync state for MVP
this.updateStatus('analyticsService', 'syncing', "Simulating Git ".concat(direction), userId); // Use analyticsService as a placeholder for Git sync status
(_e = this.context.eventBus) === null || _e === void 0 ? void 0 : _e.publish('mobile_git_sync_status', { userId: userId, status: 'syncing', step: "Starting Git ".concat(direction) }, userId); // Publish status event
try {
    // Simulate the sync process
    await new Promise(function (resolve) { return setTimeout(resolve, 2000); }); // Simulate network delay and processing
    var success_1 = Math.random() > 0.1; // 90% chance of simulated success
    var resultDetails = __assign({ direction: direction }, details);
    var logMessage = void 0;
    var logType = void 0;
    var notificationType = void 0;
    if (success_1) {
        logMessage = "Simulated Mobile Git ".concat(direction, " successful.");
        logType = 'sync-success';
        notificationType = 'success';
        resultDetails.status = 'success';
        console.log("[SyncService] ".concat(logMessage));
        (_f = this.context.loggingService) === null || _f === void 0 ? void 0 : _f.logInfo(logMessage, { userId: userId, direction: direction, details: details });
        (_g = this.context.eventBus) === null || _g === void 0 ? void 0 : _g.publish('mobile_git_synced', { userId: userId, direction: direction, details: details }, userId); // Publish success event
        this.updateStatus('analyticsService', 'idle', "Git ".concat(direction, " successful"), userId); // Update Git sync status proxy
        (_h = this.context.eventBus) === null || _h === void 0 ? void 0 : _h.publish('mobile_git_sync_status', { userId: userId, status: 'idle', step: "Git ".concat(direction, " successful") }, userId); // Publish status event
    }
    else {
        var errorMessage = "Simulated Mobile Git ".concat(direction, " failed.");
        logMessage = errorMessage;
        logType = 'sync-failure';
        notificationType = 'error';
        resultDetails.status = 'failed';
        resultDetails.error = errorMessage;
        console.error("[SyncService] ".concat(logMessage));
        (_j = this.context.loggingService) === null || _j === void 0 ? void 0 : _j.logError(logMessage, { userId: userId, direction: direction, details: details });
        (_k = this.context.eventBus) === null || _k === void 0 ? void 0 : _k.publish('mobile_git_sync_failed', { userId: userId, direction: direction, details: details, error: errorMessage }, userId); // Publish failure event
        this.updateStatus('analyticsService', 'error', "Git ".concat(direction, " failed"), userId); // Update Git sync status proxy
        (_l = this.context.eventBus) === null || _l === void 0 ? void 0 : _l.publish('mobile_git_sync_status', { userId: userId, status: 'error', step: "Git ".concat(direction, " failed"), error: errorMessage }, userId); // Publish status event
        throw new Error(errorMessage); // Throw error for caller
    }
    // Record a development log entry for the sync operation
    if (this.context.knowledgeSync) {
        var devLog = {
            question: "Mobile Git Sync (".concat(direction, ")"),
            answer: logMessage,
            user_id: userId,
            source: 'dev-log', // Mark as dev log
            tags: ['git', 'mobile', direction, logType], // Add relevant tags
            dev_log_details: {
                type: 'mobile-git-sync', // Custom type within dev-log
                direction: direction,
                repo_url: details === null || details === void 0 ? void 0 : details.repoUrl,
                branch: details === null || details === void 0 ? void 0 : details.branch,
                status: resultDetails.status,
                error: resultDetails.error,
            },
        };
        this.context.knowledgeSync.saveKnowledge(devLog.question, devLog.answer, userId, devLog.source, devLog.dev_log_details)
            .catch(function (kbError) { return console.error('Error saving Git sync log to KB:', kbError); });
    }
    else {
        console.warn('[SyncService] KnowledgeSync not available to save Git sync log.');
    }
    // Send a notification about the sync outcome
    if (this.context.notificationService) {
        this.context.notificationService.sendNotification({
            user_id: userId,
            type: notificationType,
            message: "Mobile Git Sync (".concat(direction, ") ").concat(resultDetails.status, "."),
            channel: 'ui', // Send to UI by default
            details: resultDetails,
        }).catch(function (notifError) { return console.error('Error sending Git sync notification:', notifError); });
    }
    else {
        console.warn('[SyncService] NotificationService not available to send Git sync notification.');
    }
    return { status: 'success', data: resultDetails }; // Return the simulated result
}
catch (error) {
    console.error("[SyncService] Error during simulated Mobile Git sync (".concat(direction, "):"), error.message);
    (_m = this.context.loggingService) === null || _m === void 0 ? void 0 : _m.logError("Error during simulated Mobile Git sync (".concat(direction, ")"), { userId: userId, direction: direction, details: details, error: error.message });
    // The status and error event are already updated by the error handler within the try block
    throw error; // Re-throw the error
}
/**
 * Initiates a full backup of all user data.
 * Collects data from various services, bundles it, and simulates saving locally and uploading to cloud.
 * Part of the Codex Backup concept.
 * @param userId The user ID. Required.
 * @param destination Optional destination (e.g., 'google_drive', 'local_file'). Defaults to 'local_file'.
 * @returns Promise<void>
 */
async;
backupAllData(userId, string, destination, 'google_drive' | 'local_file', 'local_file');
Promise < void  > {
    console: console,
    : .log("[SyncService] Initiating full data backup for user: ".concat(userId, " to ").concat(destination, "...")),
    this: (_o = .context.loggingService) === null || _o === void 0 ? void 0 : _o.logInfo("Initiating full data backup for user ".concat(userId, " to ").concat(destination), { userId: userId, destination: destination }),
    if: function (, userId) {
        var _a;
        console.error('[SyncService] Cannot initiate backup: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Cannot initiate backup: User ID is required.');
        throw new Error('User ID is required to initiate backup.');
    }
    // Prevent multiple backups running concurrently
    // Use a dedicated status flag for backup if needed, or reuse system status
    // Let's use a specific event for backup status
    ,
    // Prevent multiple backups running concurrently
    // Use a dedicated status flag for backup if needed, or reuse system status
    // Let's use a specific event for backup status
    this: (_p = .context.eventBus) === null || _p === void 0 ? void 0 : _p.publish('backup_started', { userId: userId, destination: destination }, userId), // Publish event
    try: {
        // --- 1. Collect Data from Services ---
        this: .updateStatus('system', 'syncing', 'Collecting data for backup', userId), // Update system status
        console: console,
        : .log('[SyncService] Collecting data from services...'),
        const: backupData,
        any: any,
        // Fetch data from each synchronizable service
        // Note: This requires each service to have a method to export all its data for a user.
        // For MVP, we'll call the 'getAll...' methods or similar.
        // This is a significant TODO for a robust backup system.
        // Simulate fetching data from each service
        backupData: backupData,
        : .knowledgeRecords = await ((_q = this.context.memoryEngine) === null || _q === void 0 ? void 0 : _q.getAllKnowledgeForUser(userId)) || [],
        backupData: backupData,
        : .knowledgeCollections = await ((_r = this.context.memoryEngine) === null || _r === void 0 ? void 0 : _r.getCollections(userId)) || [],
        // TODO: Fetch knowledge_collection_records if needed
        backupData: backupData,
        : .tasks = await ((_s = this.context.selfNavigationEngine) === null || _s === void 0 ? void 0 : _s.getTasks(userId)) || [],
        backupData: backupData,
        : .agenticFlows = await ((_t = this.context.selfNavigationEngine) === null || _t === void 0 ? void 0 : _t.getAgenticFlows(userId)) || [],
        backupData: backupData,
        : .agenticFlowExecutions = await ((_u = this.context.selfNavigationEngine) === null || _u === void 0 ? void 0 : _u.getAgenticFlowExecutions(undefined, userId, 100)) || [], // Get recent executions
        backupData: backupData,
        : .abilities = await ((_v = this.context.authorityForgingEngine) === null || _v === void 0 ? void 0 : _v.getAbilities(undefined, userId)) || [], // Get user's and public abilities
        backupData: backupData,
        : .goals = await ((_w = this.context.goalManagementService) === null || _w === void 0 ? void 0 : _w.getGoals(userId)) || [],
        backupData: backupData,
        : .notifications = await ((_x = this.context.notificationService) === null || _x === void 0 ? void 0 : _x.getNotifications(userId, undefined, undefined, 100)) || [], // Get recent notifications
        // Analytics data (system events, user actions, feedback) might be included
        backupData: backupData,
        : .systemEvents = await ((_z = (_y = this.context.analyticsService) === null || _y === void 0 ? void 0 : _y.collectRawData(userId, 'all')) === null || _z === void 0 ? void 0 : _z.systemEvents) || [], // Get all system events
        backupData: backupData,
        : .userActions = await ((_0 = this.context.authorityForgingEngine) === null || _0 === void 0 ? void 0 : _0.getRecentActions(userId, 1000)) || [], // Get more recent actions
        backupData: backupData,
        : .userFeedback = await ((_1 = this.context.evolutionEngine) === null || _1 === void 0 ? void 0 : _1.getRecentFeedback(userId, 1000)) || [], // Get more recent feedback
        backupData: backupData,
        : .glossaryTerms = await ((_2 = this.context.glossaryService) === null || _2 === void 0 ? void 0 : _2.getTerms(userId)) || [],
        // File metadata/content and repository metadata/content are complex and deferred.
        // backupData.files = await this.context.fileService?.listFiles('/', userId) || []; // Example: list files metadata
        // backupData.repositories = await this.context.repositoryService?.getRepos(userId) || []; // Example: list repos metadata
        console: console,
        : .log("[SyncService] Data collection complete. Collected data types: ".concat(Object.keys(backupData).join(', '))),
        this: (_3 = .context.loggingService) === null || _3 === void 0 ? void 0 : _3.logInfo("Data collection complete for backup", { userId: userId, dataTypes: Object.keys(backupData) }),
        // --- 2. Bundle Data ---
        this: .updateStatus('system', 'syncing', 'Bundling data', userId), // Update system status
        console: console,
        : .log('[SyncService] Bundling data into JSON...'),
        const: backupJson = JSON.stringify(backupData, null, 2), // Pretty print JSON
        const: backupFileName = "junai_backup_".concat(userId, "_").concat(new Date().toISOString().replace(/[:.-]/g, ''), ".json"),
        const: backupFilePath = "/backups/".concat(backupFileName), // Path within the simulated filesystem
        console: console,
        : .log("[SyncService] Data bundled. Size: ".concat(backupJson.length, " bytes.")),
        this: (_4 = .context.loggingService) === null || _4 === void 0 ? void 0 : _4.logInfo("Data bundled for backup", { userId: userId, dataSize: backupJson.length }),
        // --- 3. Simulate Saving Locally (using FileService) ---
        this: .updateStatus('system', 'syncing', 'Saving local backup file', userId), // Update system status
        console: console,
        : .log("[SyncService] Simulating saving local backup file: ".concat(backupFilePath)),
        : .context.fileService
    }
};
{
    // Ensure the backup directory exists
    var backupDir = '/backups';
    // FileService.writeFile handles creating parent directories
    await this.context.fileService.writeFile(backupFilePath, backupJson, userId);
    console.log("[SyncService] Simulated local backup file saved: ".concat(backupFilePath));
    (_5 = this.context.loggingService) === null || _5 === void 0 ? void 0 : _5.logInfo("Simulated local backup file saved: ".concat(backupFilePath), { userId: userId, filePath: backupFilePath });
}
{
    console.warn('[SyncService] FileService not available. Skipping local backup file save.');
    (_6 = this.context.loggingService) === null || _6 === void 0 ? void 0 : _6.logWarning('FileService not available for local backup file save.', { userId: userId });
}
// --- 4. Simulate Uploading to Cloud (using Rune) ---
if (destination === 'google_drive') {
    this.updateStatus('system', 'syncing', 'Uploading backup to cloud', userId); // Update system status
    console.log('[SyncService] Simulating uploading backup to Google Drive...');
    // Use the GoogleDriveRune via RuneEngraftingAgent
    if (this.context.sacredRuneEngraver) {
        try {
            // Need the GoogleDriveRune instance
            var googleDriveRune = (_7 = this.context.sacredRuneEngraver.runeImplementations.get('googledrive-rune')) === null || _7 === void 0 ? void 0 : _7.instance;
            if (googleDriveRune && typeof googleDriveRune.uploadFile === 'function') {
                // Simulate uploading the backup file content
                // The uploadFile method expects name, mimeType, content, parents
                var uploadResult = await googleDriveRune.uploadFile({
                    name: backupFileName,
                    mimeType: 'application/json', // Or a more specific mime type
                    content: backupJson, // Pass the JSON content
                    // parents: ['<Google Drive Folder ID>'], // Optional: specify a folder
                }, userId);
                console.log('[SyncService] Simulated Google Drive upload result:', uploadResult);
                (_8 = this.context.loggingService) === null || _8 === void 0 ? void 0 : _8.logInfo('Simulated Google Drive upload complete.', { userId: userId, uploadResult: uploadResult });
            }
            else {
                console.warn('[SyncService] GoogleDriveRune or uploadFile method not available. Skipping cloud backup.');
                (_9 = this.context.loggingService) === null || _9 === void 0 ? void 0 : _9.logWarning('GoogleDriveRune or uploadFile method not available for cloud backup.', { userId: userId });
            }
        }
        catch (uploadError) {
            console.error('[SyncService] Error simulating Google Drive upload:', uploadError.message);
            (_10 = this.context.loggingService) === null || _10 === void 0 ? void 0 : _10.logError('Error simulating Google Drive upload.', { userId: userId, error: uploadError.message });
            // Continue despite cloud upload error, local backup might still be successful
        }
    }
    else {
        console.warn('[SyncService] SacredRuneEngraver not available. Skipping cloud backup.');
        (_11 = this.context.loggingService) === null || _11 === void 0 ? void 0 : _11.logWarning('SacredRuneEngraver not available for cloud backup.', { userId: userId });
    }
}
// --- 5. Finalize Backup ---
this.updateStatus('system', 'idle', 'Backup completed', userId); // Update system status
(_12 = this.context.eventBus) === null || _12 === void 0 ? void 0 : _12.publish('backup_completed', { userId: userId, status: 'success', destination: destination, filePath: backupFilePath }, userId); // Publish event
console.log("[SyncService] Full data backup completed successfully for user: ".concat(userId, "."));
(_13 = this.context.loggingService) === null || _13 === void 0 ? void 0 : _13.logInfo("Full data backup completed successfully for user ".concat(userId), { userId: userId, destination: destination });
try { }
catch (error) {
    console.error("[SyncService] Error during full data backup for user ".concat(userId, ":"), error.message);
    (_14 = this.context.loggingService) === null || _14 === void 0 ? void 0 : _14.logError("Full data backup failed for user ".concat(userId), { userId: userId, destination: destination, error: error.message });
    this.updateStatus('system', 'error', "Backup failed: ".concat(error.message), userId); // Update system status
    (_15 = this.context.eventBus) === null || _15 === void 0 ? void 0 : _15.publish('backup_completed', { userId: userId, status: 'failed', destination: destination, error: error.message }, userId); // Publish event
    throw error; // Re-throw the error
}
/**
 * Initiates data mirroring for a specific data type or all data.
 * This is a placeholder for real-time or near real-time replication to another location.
 * Part of the Mirror Codex concept.
 * @param userId The user ID. Required.
 * @param dataType Optional data type to mirror. Defaults to 'system' (all data).
 * @param destination Optional destination (e.g., 'boostspace', 'another_db'). Required.
 * @returns Promise<void>
 */
async;
mirrorData(userId, string, dataType, SynchronizableDataType | 'system', 'system', destination, string);
Promise < void  > {
    console: console,
    : .log("[SyncService] Initiating data mirroring for user: ".concat(userId, ", type: ").concat(dataType, " to ").concat(destination, "...")),
    this: (_16 = .context.loggingService) === null || _16 === void 0 ? void 0 : _16.logInfo("Initiating data mirroring for user ".concat(userId, " type ").concat(dataType, " to ").concat(destination), { userId: userId, dataType: dataType, destination: destination }),
    if: function (, userId) { }
} || !destination;
{
    console.error('[SyncService] Cannot initiate mirroring: User ID and destination are required.');
    (_17 = this.context.loggingService) === null || _17 === void 0 ? void 0 : _17.logError('Cannot initiate mirroring: Missing required fields.', { userId: userId, dataType: dataType, destination: destination });
    throw new Error('User ID and destination are required to initiate mirroring.');
}
// Prevent multiple mirroring operations for the same type/destination concurrently
// TODO: Implement state tracking for mirroring operations
this.updateStatus(dataType, 'syncing', "Starting mirroring to ".concat(destination), userId); // Update status
(_18 = this.context.eventBus) === null || _18 === void 0 ? void 0 : _18.publish('mirror_started', { userId: userId, dataType: dataType, destination: destination }, userId); // Publish event
try {
    // --- Simulate Mirroring Process ---
    // This is a placeholder. A real mirroring process would involve:
    // 1. Setting up listeners for changes (local queue, remote Realtime).
    // 2. Replicating changes to the destination in near real-time.
    // 3. Handling potential conflicts or errors during replication.
    // 4. Managing the state of the mirrored data at the destination.
    console.log("[SyncService] Simulating mirroring data for user: ".concat(userId, ", type: ").concat(dataType, " to ").concat(destination, "."));
    // Simulate mirroring time
    await new Promise(function (resolve) { return setTimeout(resolve, 3000); });
    // Simulate success/failure
    var success_2 = Math.random() > 0.1; // 90% chance of simulated success
    if (success_2) {
        console.log("[SyncService] Simulated mirroring successful for user: ".concat(userId, ", type: ").concat(dataType, " to ").concat(destination, "."));
        (_19 = this.context.loggingService) === null || _19 === void 0 ? void 0 : _19.logInfo("Simulated mirroring successful", { userId: userId, dataType: dataType, destination: destination });
        this.updateStatus(dataType, 'idle', "Mirroring to ".concat(destination, " successful"), userId); // Update status
        (_20 = this.context.eventBus) === null || _20 === void 0 ? void 0 : _20.publish('mirror_completed', { userId: userId, dataType: dataType, destination: destination, status: 'success' }, userId); // Publish event
    }
    else {
        var errorMessage = "Simulated mirroring failed for user ".concat(userId, ", type ").concat(dataType, " to ").concat(destination, ".");
        console.error("[SyncService] ".concat(errorMessage));
        (_21 = this.context.loggingService) === null || _21 === void 0 ? void 0 : _21.logError("Simulated mirroring failed", { userId: userId, dataType: dataType, destination: destination, error: errorMessage });
        this.updateStatus(dataType, 'error', "Mirroring failed: ".concat(errorMessage), userId); // Update status
        (_22 = this.context.eventBus) === null || _22 === void 0 ? void 0 : _22.publish('mirror_failed', { userId: userId, dataType: dataType, destination: destination, error: errorMessage }, userId); // Publish event
        throw new Error(errorMessage); // Throw error for caller
    }
}
catch (error) {
    console.error("[SyncService] Error during data mirroring for user ".concat(userId, ":"), error.message);
    (_23 = this.context.loggingService) === null || _23 === void 0 ? void 0 : _23.logError("Error during data mirroring", { userId: userId, dataType: dataType, destination: destination, error: error.message });
    // Status and error event are already updated by the error handler within the try block
    throw error; // Re-throw the error
}
""(__makeTemplateObject([""], [""]));
