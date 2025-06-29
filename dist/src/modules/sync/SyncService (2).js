"use strict";
`` `typescript
// src/modules/sync/SyncService.ts
// \u540c\u6b65\u670d\u52d9 (Sync Service) - \u6838\u5fc3\u6a21\u7d44
// Orchestrates data synchronization across devices and platforms.
// Handles tracking local changes, pulling remote changes, merging data, and pushing changes.
// Part of the Bidirectional Sync Domain (\u96d9\u5410\u540c\u6b65\u9818\u57df).
// Design Principle: Ensures data consistency and supports offline-first capabilities.
// --- Modified: Enhance pullRemoteChanges simulation --
// --- Modified: Enhance processLocalChangeQueue with retry and batching simulation --
// --- Modified: Refine status updates and event publishing --
// --- New: Implement IndexedDB persistence for local change queue using localforage --
// --- New: Implement structured logging for sync events using LoggingService --
// --- New: Implement Backup All Data method --
// --- New: Implement Mirror Data method (Mirror Codex) --


import { SystemContext, LocalDataChange, SyncStatusUpdatePayload, SyncResultPayload, SyncErrorPayload, KnowledgeRecord, AgenticFlow, Task, Goal, ForgedAbility, GlossaryTerm, Notification, SystemEvent } from '../../interfaces'; // Import new payload types and data types
import { SupabaseClient } from '@supabase/supabase-js';
import localforage from 'localforage'; // Import localforage for IndexedDB persistence
// import { EventBus } from '../events/EventBus'; // Dependency
// import { LoggingService } from '../core/logging/LoggingService'; // Dependency
// import { SecurityService } from '../core/security/SecurityService'; // Dependency for user/auth
// import { MemoryEngine } from '../core/memory/MemoryEngine'; // Dependency for data access
// import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Dependency for data access
// import { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // Dependency for data access
// import { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // Dependency for data access
// import { GoalManagementService } from '../core/goal-management/GoalManagementService'; // Dependency for data access
// import { NotificationService } from '../modules/notifications/NotificationService'; // Dependency for data access
// import { AnalyticsService } from '../modules/analytics/AnalyticsService'; // Dependency for data access
// import { GlossaryService } from '../core/glossary/GlossaryService'; // Dependency for data access
// import { KnowledgeGraphService } from '../core/wisdom/KnowledgeGraphService'; // Dependency for data access
// import { FileService } from '../core/files/FileService'; // Dependency for file operations
// import { mergeCRDT } from '../core/memory/crdt-sync'; // Import CRDT merge function (placeholder)


// Define the data types that this service will synchronize
// These keys should match the keys used in SystemContext for the corresponding services
const SYNCHRONIZABLE_DATA_TYPES = [
    'memoryEngine', // Knowledge Records, Collections, Collection Records
    'authorityForgingEngine', // User Actions, Abilities
    'selfNavigationEngine', // Tasks, Task Steps, Agentic Flows, Agentic Flow Executions
    'runeEngraftingCenter', // Runes
    'goalManagementService', // Goals, Key Results
    'notificationService', // Notifications
    'analyticsService', // System Events, User Feedback
    'glossaryService', // Glossary Terms
    'knowledgeGraphService', // Knowledge Relations
    // 'fileService', // Files (Metadata or Content - complex)
    // 'repositoryService', // Repositories (Metadata or Content - complex)
    // Add other data types managed by services that need syncing
] as const; // Use 'as const' to create a tuple of literal strings

type SynchronizableDataType = typeof SYNCHRONIZABLE_DATA_TYPES[number];

// Map data types to their corresponding Supabase tables (for simplicity in MVP)
// In a real app, this mapping might be more complex or handled within each service
const DATA_TYPE_TABLE_MAP: Record<SynchronizableDataType, string[]> = {
    memoryEngine: ['knowledge_records', 'knowledge_collections', 'knowledge_collection_records'], // Added collection tables
    authorityForgingEngine: ['user_actions', 'abilities'],
    selfNavigationEngine: ['tasks', 'task_steps', 'agentic_flows', 'agentic_flow_nodes', 'agentic_flow_edges', 'agentic_flow_executions'], // Added flow tables
    runeEngraftingCenter: ['runes'],
    goalManagementService: ['goals', 'key_results'],
    notificationService: ['notifications'],
    analyticsService: ['system_events', 'user_feedback'], // Added user_feedback
    glossaryService: ['glossary'], // New: Glossary table
    knowledgeGraphService: ['knowledge_relations'], // New: Knowledge Relations table
    // fileService: ['files'], // New: Placeholder for files table (if file metadata is synced)
    // repositoryService: ['repositories'], // New: Placeholder for repositories table (if repo metadata is synced)
};

// --- New: Define retry configuration ---
const MAX_RETRY_COUNT = 3;
const RETRY_DELAY_MS = 1000; // 1 second delay before retry
// --- End New ---

// --- New: Define batch size for pushing changes ---
const PUSH_BATCH_SIZE = 10; // Process up to 10 changes in a batch
// --- End New ---


export class SyncService {
    private context: SystemContext;
    private supabase: SupabaseClient;
    // private eventBus: EventBus; // Access via context
    // private loggingService: LoggingService; // Access via context
    // private securityService: SecurityService; // Access via context

    // --- New: localforage instance for persistence ---
    private localforageStore: typeof localforage;
    private LOCAL_QUEUE_KEY = 'sync_local_change_queue';
    // --- End New ---

    // --- New: In-memory queue for local data changes ---
    // In a real app, this would be persisted (e.g., IndexedDB, LevelDB) for offline support.
    private localChangeQueue: LocalDataChange[] = [];
    // --- End New ---

    // --- New: In-memory state for sync status ---
    private syncStatus: Record<SynchronizableDataType | 'system', 'idle' | 'syncing' | 'error' | 'unknown'> = { system: 'unknown' } as any; // Initialize with system status
    private syncStep: Record<SynchronizableDataType | 'system', string | undefined> = { system: undefined } as any; // Current step message
    private lastSyncTimestamp: Record<SynchronizableDataType | 'system', number | undefined> = { system: undefined } as any; // Timestamp of last successful sync
    // --- End New ---

    // --- New: Realtime Subscription ---
    // Store subscriptions per table to manage them.
    private realtimeSubscriptions: Map<string, any> = new Map();
    // --- End New ---

    // --- New: Flag to prevent multiple processQueue calls ---
    private isProcessingQueue = false;
    // --- End New ---


    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
        // this.eventBus = context.eventBus;
        // this.loggingService = context.loggingService;
        // this.securityService = context.securityService;

        console.log('SyncService initialized.');

        // --- New: Initialize localforage ---
        this.localforageStore = localforage.create({
            name: 'jun_ai_key_sync',
            storeName: 'local_change_queue',
            description: 'Stores local data changes pending synchronization.',
        });
        // --- End New ---

        // Initialize sync status for all data types
        SYNCHRONIZABLE_DATA_TYPES.forEach(type => {
            this.syncStatus[type] = 'unknown';
            this.syncStep[type] = undefined;
            this.lastSyncTimestamp[type] = undefined;
        });
        this.updateStatus('system', 'idle', 'Initialized', undefined); // Set initial system status to idle


        // --- New: Load pending local changes from persistence on startup ---
        this.loadLocalChangeQueue().catch(err => console.error('Error loading local change queue on startup:', err));
        // --- End New ---

        // TODO: Set up listeners for local data change events from other modules (or rely on Realtime for remote changes)
        // TODO: Set up periodic sync triggers based on user settings (e.g., every 5 minutes, on wifi)

        // --- New: Set up Supabase Realtime subscriptions for relevant tables ---
        // Subscribe when the user is authenticated.
        this.context.securityService?.onAuthStateChange((user) => {
            if (user) {
                // Note: Individual services (MemoryEngine, etc.) are now responsible for their own Realtime subscriptions.
                // The SyncService primarily manages the local queue and orchestrates pushes/pulls.
                // This subscription is removed as it's redundant if services subscribe themselves.
                // this.subscribeToRealtimeUpdates(user.id);

                // On login, attempt to sync any pending local changes
                this.processLocalChangeQueue(user.id).catch(err => console.error('Error processing local change queue on login:', err));
            } else {
                // This unsubscribe is also removed if services manage their own subscriptions.
                // this.unsubscribeFromRealtimeUpdates();

                // Clear local change queue and status on logout
                this.localChangeQueue = []; // Clear in-memory queue
                this.saveLocalChangeQueue().catch(err => console.error('Error saving empty queue on logout:', err)); // Persist empty queue
                this.updateStatus('system', 'unknown', 'Logged out', undefined);
                SYNCHRONIZABLE_DATA_TYPES.forEach(type => {
                    this.updateStatus(type, 'unknown', 'Logged out', undefined);
                    this.lastSyncTimestamp[type] = undefined;
                });
            }
        });
        // --- End New ---
    }

    /**
     * Loads the local change queue from IndexedDB persistence.
     * @returns Promise<void>
     */
    private async loadLocalChangeQueue(): Promise<void> {
        try {
            const savedQueue = await this.localforageStore.getItem<LocalDataChange[]>(this.LOCAL_QUEUE_KEY);
            if (savedQueue) {
                this.localChangeQueue = savedQueue;
                console.log(`[SyncService];
Loaded;
$;
{
    this.localChangeQueue.length;
}
changes;
from;
persistence. `);
                this.context.loggingService?.logInfo(`;
Loaded;
$;
{
    this.localChangeQueue.length;
}
changes;
from;
persistence. `);
                // Update status to reflect pending changes on startup
                if (this.localChangeQueue.length > 0) {
                     this.updateStatus('system', 'syncing', `;
Loaded;
$;
{
    this.localChangeQueue.length;
}
pending;
changes `, this.context.currentUser?.id);
                }
            } else {
                console.log('[SyncService] No pending changes found in persistence.');
                this.context.loggingService?.logInfo('No pending changes found in persistence.');
            }
        } catch (error: any) {
            console.error('[SyncService] Failed to load local change queue from persistence:', error);
            this.context.loggingService?.logError('Failed to load local change queue from persistence', { error: error.message });
            // If loading fails, start with an empty queue
            this.localChangeQueue = [];
        }
    }

    /**
     * Saves the current local change queue to IndexedDB persistence.
     * @returns Promise<void>
     */
    private async saveLocalChangeQueue(): Promise<void> {
        try {
            await this.localforageStore.setItem(this.LOCAL_QUEUE_KEY, this.localChangeQueue);
            // console.log(`[SyncService];
Saved;
$;
{
    this.localChangeQueue.length;
}
changes;
to;
persistence. `); // Avoid excessive logging
        } catch (error: any) {
            console.error('[SyncService] Failed to save local change queue to persistence:', error);
            this.context.loggingService?.logError('Failed to save local change queue to persistence', { error: error.message });
        }
    }

    /**
     * Updates the sync status for a specific data type or the system overall.
     * Publishes a 'sync_status_update' event.
     * @param dataType The data type or 'system'. Required.
     * @param status The new status. Required.
     * @param step Optional message describing the current step.
     * @param userId Optional user ID associated with the status.
     */
    private updateStatus(dataType: SynchronizableDataType | 'system', status: 'idle' | 'syncing' | 'error' | 'unknown', step?: string, userId?: string): void {
        this.syncStatus[dataType] = status;
        this.syncStep[dataType] = step;
        const payload: SyncStatusUpdatePayload = {
            dataType,
            userId: userId || this.context.currentUser?.id || 'unknown', // Use provided userId or current user
            status,
            step: step || status, // Use status as step message if none provided
            timestamp: Date.now(),
            queueSize: this.localChangeQueue.length, // Include queue size in system status updates
        };
        console.log(`[SyncService];
Status;
update;
for ($; { dataType }; )
    : $;
{
    status;
}
-$;
{
    step || 'N/A';
}
(Queue, { this: , localChangeQueue, length }) => ;
`);
        this.context.loggingService?.logInfo(`;
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
`, payload);
        this.context.eventBus?.publish('sync_status_update', payload, payload.userId); // Publish event
    }

    /**
     * Gets the current sync status for a specific data type or the system overall.
     * @param dataType The data type or 'system'. Required.
     * @returns The current status.
     */
    getSyncStatus(dataType: SynchronizableDataType | 'system'): 'idle' | 'syncing' | 'error' | 'unknown' {
        return this.syncStatus[dataType] || 'unknown';
    }

     /**
     * Gets the current sync step message for a specific data type or the system overall.
     * @param dataType The data type or 'system'. Required.
     * @returns The current step message or undefined.
     */
    getSyncStep(dataType: SynchronizableDataType | 'system'): string | undefined {
        return this.syncStep[dataType];
    }

    /**
     * Gets the timestamp of the last successful sync for a data type or the system.
     * @param dataType The data type or 'system'. Required.
     * @returns The timestamp or undefined.
     */
    getLastSyncTimestamp(dataType: SynchronizableDataType | 'system'): number | undefined {
        return this.lastSyncTimestamp[dataType];
    }

    /**
     * Gets the current size of the local change queue.
     * @returns The number of pending local changes.
     */
    getLocalQueueSize(): number {
        return this.localChangeQueue.length;
    }


    /**
     * Handles a local data change event from another module.
     * Adds the change to the local queue and triggers processing.
     * @param dataType The type of data that changed. Required.
     * @param changeType The type of change ('INSERT', 'UPDATE', 'DELETE'). Required.
     * @param payload The data payload (e.g., the new record, update details, deleted record ID). Required.
     * @param userId The user ID associated with the change. Required.
     * @returns Promise<void>
     */
    async handleLocalDataChange(dataType: SynchronizableDataType, changeType: LocalDataChange['changeType'], payload: any, userId: string): Promise<void> {
        console.log(`[SyncService];
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
for (user; $; { userId } `);
        this.context.loggingService?.logInfo(`)
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
`, { dataType, changeType, userId, payload });

        if (!userId) {
             console.warn('[SyncService] Cannot handle local change: User ID is missing.');
             return;
        }

        // Create a LocalDataChange object
        const change: LocalDataChange = {
            id: `;
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
`, // Unique ID for the change
            dataType,
            changeType,
            recordId: payload?.id, // Use record ID from payload if available
            payload,
            timestamp: Date.now(),
            userId,
            status: 'pending', // Initial status
            retryCount: 0,
        };

        // Add the change to the local queue
        this.localChangeQueue.push(change);
        this.updateStatus('system', 'syncing', `;
Queued;
$;
{
    changeType;
}
for ($; { dataType } `, userId); // Update system status

        // --- New: Save the updated queue to persistence ---
        this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after adding change:', err));
        // --- End New ---

        // Immediately attempt to process the queue (asynchronously)
        this.processLocalChangeQueue(userId).catch(err => console.error('Error processing local change queue:', err));
    }

    /**
     * Processes the local change queue, attempting to push changes to Supabase.
     * @param userId The user ID whose changes to process. Required.
     * @returns Promise<void>
     */
    private async processLocalChangeQueue(userId: string): Promise<void> {
        // Prevent multiple processQueue calls running concurrently
        if (this.isProcessingQueue) {
            // console.log('[SyncService] processLocalChangeQueue already running.');
            return;
        }

        this.isProcessingQueue = true;
        console.log(`[SyncService]; Starting)
    local;
change;
queue;
processing;
for (user; $; { userId }.Queue)
    size: $;
{
    this.localChangeQueue.length;
}
`);
        const startTime = Date.now();
        let itemsProcessed = 0;
        let conflicts = 0;
        let errors = 0;

        try {
            while (this.localChangeQueue.length > 0) {
                // Filter for pending changes that haven't exceeded max retries
                const pendingChanges = this.localChangeQueue.filter(change => change.status === 'pending' && change.retryCount < MAX_RETRY_COUNT);

                if (pendingChanges.length === 0) {
                    console.log('[SyncService] No pending changes in queue or max retries reached.');
                    // If there are failed changes with max retries, set system status to error
                    const failedMaxRetries = this.localChangeQueue.filter(change => change.status === 'pending' && change.retryCount >= MAX_RETRY_COUNT);
                    if (failedMaxRetries.length > 0) {
                         const errorMessage = `;
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
retries. `;
                         this.updateStatus('system', 'error', `;
Sync;
failed: $;
{
    errorMessage;
}
`, userId);
                         const errorPayload: SyncErrorPayload = { dataType: 'system', userId, error: errorMessage, timestamp: Date.now(), step: 'Max retries reached for some changes' };
                         this.context.eventBus?.publish('sync_error', errorPayload, userId);
                    } else {
                         this.updateStatus('system', 'idle', 'Queue empty', userId);
                         this.lastSyncTimestamp['system'] = Date.now(); // Update system timestamp
                         const resultPayload: SyncResultPayload = { dataType: 'system', userId, status: 'success', timestamp: Date.now(), duration_ms: Date.now() - startTime, itemsProcessed, conflicts, errors };
                         this.context.eventBus?.publish('sync_completed', resultPayload, userId); // Publish completion event
                    }
                    break; // Exit the loop if no pending changes to process
                }

                // --- New: Process changes in batches ---
                const batchToProcess = pendingChanges.slice(0, PUSH_BATCH_SIZE);
                console.log(`[SyncService];
Processing;
batch;
of;
$;
{
    batchToProcess.length;
}
changes. `);
                this.updateStatus('system', 'syncing', `;
Processing;
batch($, { batchToProcess, : .length }, items) `, userId);

                const pushPromises = batchToProcess.map(async (change) => {
                    this.updateStatus(change.dataType, 'syncing', `;
Pushing;
$;
{
    change.changeType;
}
for ($; { change, : .dataType } `, userId); // Update status for specific type

                    try {
                        // Attempt to push the change to Supabase
                        const tables = DATA_TYPE_TABLE_MAP[change.dataType]; // Get tables for the data type
                        if (!tables || tables.length === 0) {
                            throw new Error(`; Unknown)
    table(s);
for (data; type; )
    : $;
{
    change.dataType;
}
`);
                        }
                        // For MVP, assume the change applies to the first table listed for the data type
                        const table = tables[0];

                        let dbOperation;
                        if (change.changeType === 'INSERT') {
                            dbOperation = this.supabase.from(table).insert([change.payload]);
                        } else if (change.changeType === 'UPDATE') {
                            // For update, we need the record ID and the updates
                            if (!change.recordId) throw new Error('Update change is missing recordId.');
                            dbOperation = this.supabase.from(table).update(change.payload).eq('id', change.recordId); // RLS should enforce user_id
                        } else if (change.changeType === 'DELETE') {
                            // For delete, we need the record ID
                            if (!change.recordId) throw new Error('Delete change is missing recordId.');
                            dbOperation = this.supabase.from(table).delete().eq('id', change.recordId); // RLS should enforce user_id
                        } else {
                            throw new Error(`;
Unknown;
change;
type: $;
{
    change.changeType;
}
`);
                        }

                        // Execute the DB operation
                        const { error: dbError } = await dbOperation; // Use dbError to avoid conflict with outer error

                        if (dbError) {
                            // Check for specific error codes indicating conflicts (e.g., unique constraint violation on INSERT)
                            // Supabase error codes: https://postgrest.org/en/v7.0/api.html#errors
                            // PostgreSQL error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
                            // Example: '23505' is unique_violation
                            if (dbError.code === '23505' && change.changeType === 'INSERT') {
                                console.warn(`[SyncService];
Conflict;
detected;
for (change; $; { change, : .id }(Unique, constraint, violation). `);
                                this.context.loggingService?.logWarning(`)
    Conflict;
detected;
for (local; change; )
    : $;
{
    change.id;
}
`, { userId, change, error: dbError.message });
                                conflicts++;
                                // TODO: Implement conflict resolution logic here (e.g., fetch remote, merge, update local change, retry)
                                // For MVP, treat as a temporary failure that might resolve on retry or manual intervention.
                                throw new Error(`;
Conflict: $;
{
    dbError.message;
}
`); // Re-throw as a specific error type
                            }
                            // For other errors, re-throw to trigger retry/failure handling
                            throw dbError; // Re-throw the error
                        }

                        console.log(`[SyncService];
Successfully;
pushed;
change;
$;
{
    change.id;
}
to;
Supabase. `);
                        this.context.loggingService?.logInfo(`;
Successfully;
pushed;
local;
change: $;
{
    change.id;
}
`, { userId, change });
                        itemsProcessed++;

                        // Mark change as completed (remove from queue)
                        this.localChangeQueue = this.localChangeQueue.filter(c => c.id !== change.id); // Remove the completed change
                        // Status for this data type will be updated when the batch finishes or queue is empty
                        // this.updateStatus(change.dataType, 'idle', 'Push successful', userId); // Too granular
                        this.lastSyncTimestamp[change.dataType] = Date.now(); // Update timestamp for this data type

                    } catch (error: any) {
                        console.error(`[SyncService];
Failed;
to;
push;
change;
$;
{
    change.id;
}
for ($; { change, : .dataType }; )
    : `, error.message);
                        this.context.loggingService?.logError(`;
Failed;
to;
push;
local;
change;
for ($; { change, : .dataType }; )
    : $;
{
    change.id;
}
`, { userId, change, error: error.message });
                        errors++;
                        if (error.message.includes('Conflict')) conflicts++;

                        // Mark change as failed and increment retry count
                        const changeIndex = this.localChangeQueue.findIndex(c => c.id === change.id);
                        if (changeIndex > -1) {
                            this.localChangeQueue[changeIndex].retryCount++;
                            this.localChangeQueue[changeIndex].error = error.message; // Store the error message
                            this.localChangeQueue[changeIndex].status = 'pending'; // Keep status as pending for retry
                            // Update status for this data type to error if it's the first error for this type in this batch
                            if (this.syncStatus[change.dataType] !== 'error') {
                                 this.updateStatus(change.dataType, 'error', `;
Push;
failed: $;
{
    error.message;
}
`, userId);
                            }
                            this.updateStatus('system', 'syncing', `;
Push;
failed($, { change, : .dataType }).Retrying;
`, userId); // Keep system syncing/error

                             // Publish a sync_error event for this specific change
                             const errorPayload: SyncErrorPayload = { dataType: change.dataType, userId, error: error.message, timestamp: Date.now(), step: `;
Push;
failed;
for (change; $; { change, : .id } `, change, retryCount: this.localChangeQueue[changeIndex].retryCount };
                             this.context.eventBus?.publish('sync_error', errorPayload, userId);
                        }
                        // Do NOT re-throw here, allow other promises in the batch to complete
                    }
                });

                // Wait for all promises in the batch to settle (either fulfill or reject)
                await Promise.allSettled(pushPromises);

                // --- New: Save the updated queue state to persistence after processing a batch ---
                this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after batch processing:', err));
                // --- End New ---

                // After processing the batch, check if there are still pending changes to retry or process
                const remainingPending = this.localChangeQueue.filter(change => change.status === 'pending' && change.retryCount < MAX_RETRY_COUNT);
                const failedMaxRetries = this.localChangeQueue.filter(change => change.status === 'pending' && change.retryCount >= MAX_RETRY_COUNT);

                if (remainingPending.length > 0) {
                    console.log(`[SyncService])
    $;
{
    remainingPending.length;
}
changes;
remaining in queue.Retrying;
after;
delay. `);
                    this.updateStatus('system', 'syncing', `;
Retrying;
failed;
pushes;
`, userId); // Keep system status as syncing
                    // Wait before processing the next batch/retrying
                    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
                } else if (failedMaxRetries.length > 0) {
                     console.warn(`[SyncService];
$;
{
    failedMaxRetries.length;
}
changes;
failed;
after;
max;
retries. `);
                     this.context.loggingService?.logWarning(`;
$;
{
    failedMaxRetries.length;
}
changes;
failed;
after;
max;
retries. `, { userId, dataType: 'system', failedCount: failedMaxRetries.length });
                     const errorMessage = `;
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
retries. `;
                     this.updateStatus('system', 'error', `;
Sync;
failed: $;
{
    errorMessage;
}
`, userId); // Set system status to error
                     const errorPayload: SyncErrorPayload = { dataType: 'system', userId, error: errorMessage, timestamp: Date.now(), step: 'Max retries reached for some changes' };
                     this.context.eventBus?.publish('sync_error', errorPayload, userId);
                     // Remove changes that hit max retries from the main queue for simplicity in MVP UI.
                     this.localChangeQueue = this.localChangeQueue.filter(change => change.retryCount < MAX_RETRY_COUNT); // Remove changes that hit max retries
                     this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after removing max retries:', err));
                } else {
                    // Queue is empty after processing the batch
                    console.log('[SyncService] Queue empty after batch processing.');
                    this.updateStatus('system', 'idle', 'Queue empty', userId); // Set system status to idle
                    this.lastSyncTimestamp['system'] = Date.now(); // Update system timestamp
                    const resultPayload: SyncResultPayload = { dataType: 'system', userId, status: 'success', timestamp: Date.now(), duration_ms: Date.now() - startTime, itemsProcessed, conflicts, errors };
                    this.context.eventBus?.publish('sync_completed', resultPayload, userId); // Publish completion event
                    this.saveLocalChangeQueue().catch(err => console.error('Error saving empty queue:', err));
                }
            }

        } catch (error: any) {
            console.error('[SyncService] Unexpected error during queue processing:', error.message);
            this.context.loggingService?.logError('Unexpected error during queue processing', { userId, error: error.message });
            this.updateStatus('system', 'error', `;
Unexpected;
error;
processing;
queue: $;
{
    error.message;
}
`, userId); // Set system status to error
            const errorPayload: SyncErrorPayload = { dataType: 'system', userId, error: error.message, timestamp: Date.now(), step: 'Unexpected error during queue processing' };
            this.context.eventBus?.publish('sync_error', errorPayload, userId);
             this.saveLocalChangeQueue().catch(err => console.error('Error saving queue on unexpected error:', err));
            throw error; // Re-throw the error
        } finally {
            this.isProcessingQueue = false;
            console.log('[SyncService] Local change queue processing finished.');
        }
    }


    /**
     * Initiates a full synchronization cycle for a specific user.
     * This involves pulling remote changes, merging, and pushing local changes.
     * Part of the Bidirectional Sync Domain.
     * @param userId The user ID to sync for. Required.
     * @returns Promise<void>
     */
    async syncAllData(userId: string): Promise<void> {
        console.log(`[SyncService];
Initiating;
full;
sync;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.context.loggingService?.logInfo(`;
Initiating;
full;
sync;
for (user; $; { userId } `, { userId });

        if (!userId) {
            console.error('[SyncService] Cannot initiate sync: User ID is required.');
            this.context.loggingService?.logError('Cannot initiate sync: User ID is required.');
            throw new Error('User ID is required to initiate sync.');
        }

        // Prevent multiple syncs running concurrently
        if (this.getSyncStatus('system') === 'syncing') {
            console.warn('[SyncService] Sync already in progress. Skipping new sync request.');
            this.context.loggingService?.logWarning('Sync already in progress. Skipping new sync request.', { userId });
            return;
        }

        this.updateStatus('system', 'syncing', 'Starting full sync', userId); // Update system status
        const startTime = Date.now();
        const initialQueueSize = this.localChangeQueue.length;
        const initialErrors = this.localChangeQueue.filter(c => c.retryCount >= MAX_RETRY_COUNT).length; // Count changes already failed max retries

        const syncResultPayload: Partial<SyncResultPayload> = { dataType: 'system', userId, direction: 'bidirectional', timestamp: Date.now(), itemsProcessed: 0, conflicts: 0, errors: initialErrors };

        try {
            // 1. Pull remote changes for all data types
            // As discussed, we rely on individual service Realtime subscriptions for ongoing changes.
            // A full \"pull\" here would involve fetching all data for each type and merging,
            // which is complex and deferred for MVP.
            // For MVP, this step primarily ensures Realtime subscriptions are active (handled by auth listener)
            // and simulates a pull process.
            this.updateStatus('system', 'syncing', 'Pulling remote changes', userId); // Update system status
            await this.pullRemoteChanges(userId); // This method is now mostly a placeholder
            this.updateStatus('system', 'syncing', 'Remote pull complete, processing queue', userId); // Update system status

            // 2. Process local change queue (pushes local changes)
            // This is triggered automatically when changes are added, but we explicitly trigger it here
            // to ensure any pending changes are pushed after the (simulated) pull.
            // The processLocalChangeQueue method now handles the loop and final status update.
            // We need to wait for it to finish to determine the final result.
            await this.processLocalChangeQueue(userId); // Process any changes that occurred during pull or were pending

            // 3. (Optional) Re-pull after pushing to catch any conflicts or changes made by other devices during push
            // This adds robustness but increases complexity and network traffic.
            // For MVP, we'll skip this step. Realtime listeners should handle most cases.

            // The final status and completion/error event are now published by processLocalChangeQueue
            // We can listen to the final sync_completed or sync_error event for 'system' dataType
            // to update the overall syncResultPayload and log it.

            // For MVP, let's just log a success message here if processLocalChangeQueue finished without throwing.
            // The actual success/failure event is published by processLocalChangeQueue.
            console.log(`[SyncService])
    Full;
sync;
process;
initiated;
for (user; $; { userId }.Final)
    status;
will;
be;
reported;
by;
queue;
processor. `);

        } catch (error: any) {
            console.error(`[SyncService];
Error;
during;
full;
sync;
for (user; $; { userId })
    : `, error.message);
            this.context.loggingService?.logError(`;
Full;
sync;
failed;
for (user; $; { userId } `, { userId, error: error.message });
            // The status and error event are already updated by processLocalChangeQueue or error handlers
            // Ensure system status is error if it wasn't already set by processLocalChangeQueue
            if (this.getSyncStatus('system') !== 'error') {
                 this.updateStatus('system', 'error', `)
    Full;
sync;
failed: $;
{
    error.message;
}
`, userId); // Update system status
                 const errorPayload: SyncErrorPayload = { dataType: 'system', userId, error: error.message, timestamp: Date.now(), step: 'Error during full sync initiation' };
                 this.context.eventBus?.publish('sync_error', errorPayload, userId);
            }
            throw error; // Re-throw the error
        } finally {
             // The isProcessingQueue flag is managed by processLocalChangeQueue
             // The final status and result event are published by processLocalChangeQueue
        }
    }

    /**
     * Initiates synchronization for a specific data type.
     * For MVP, this triggers a pull (via Realtime listeners) and then processes the local queue for that type.
     * @param dataType The type of data to sync. Required.
     * @param userId The user ID to sync for. Required.
     * @param direction The sync direction ('up', 'down', 'bidirectional'). Required.
     * @returns Promise<void>
     */
    async syncDataType(dataType: SynchronizableDataType, userId: string, direction: 'up' | 'down' | 'bidirectional'): Promise<void> {
        console.log(`[SyncService];
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
`);
        this.context.loggingService?.logInfo(`;
Initiating;
$;
{
    direction;
}
sync;
for (data; type; $) {
    dataType;
}
`, { dataType, userId, direction });

        if (!userId) {
            console.error('[SyncService] Cannot initiate data type sync: User ID is required.');
            this.context.loggingService?.logError('Cannot initiate data type sync: User ID is required.');
            throw new Error('User ID is required to initiate data type sync.');
        }

        // Prevent multiple syncs for the same data type concurrently
        // Use a dedicated status flag for sync if needed, or reuse module status
        if (this.getSyncStatus(dataType) === 'syncing') {
            console.warn(`[SyncService];
$;
{
    dataType;
}
sync;
already in progress.Skipping;
new sync;
request. `);
            this.context.loggingService?.logWarning(`;
$;
{
    dataType;
}
sync;
already in progress.Skipping;
new sync;
request. `, { dataType, userId });
            return;
        }

        this.updateStatus(dataType, 'syncing', `;
Starting;
$;
{
    direction;
}
sync `, userId); // Update status for this type
        const startTime = Date.now();
        let itemsProcessed = 0;
        let conflicts = 0;
        let errors = 0;

        try {
            // 1. Pull remote changes (if direction is 'down' or 'bidirectional')
            // As discussed, we rely on individual service Realtime subscriptions for ongoing changes.
            // A full \"pull\" here would involve fetching all data for this type and merging.
            // For MVP, this step primarily ensures Realtime subscriptions are active (handled by auth listener)
            // and simulates a pull process.
            if (direction === 'down' || direction === 'bidirectional') {
                 this.updateStatus(dataType, 'syncing', 'Pulling remote changes', userId);
                 // Simulate pull delay
                 await new Promise(resolve => setTimeout(resolve, 1000));
                 // Realtime listeners in services are assumed to handle applying changes.
                 console.log(`[SyncService];
Remote;
pull;
for ($; { dataType }; initiated(relying, on, Realtime, listeners). `);
            }

            // 2. Process local change queue (pushes local changes if direction is 'up' or 'bidirectional')
            // This is triggered automatically when changes are added, but we explicitly trigger it here
            // to ensure any pending changes for THIS data type are pushed.
            if (direction === 'up' || direction === 'bidirectional') {
                 // Filter the local queue to only process changes for this data type
                 const changesForType = this.localChangeQueue.filter(change => change.dataType === dataType && change.status === 'pending' && change.retryCount < MAX_RETRY_COUNT);
                 if (changesForType.length > 0) {
                     this.updateStatus(dataType, 'syncing', `)
    Pushing;
local;
changes($, { changesForType, : .length }, items) `, userId);
                     // Manually process changes for this type in batches
                     const changesToProcess = [...changesForType]; // Process a copy
                     let processedCountInType = 0;

                     while (processedCountInType < changesToProcess.length) {
                         const change = changesToProcess[processedCountInType];

                         // Find the change in the main queue to check its latest status and retry count
                         const mainQueueIndex = this.localChangeQueue.findIndex(c => c.id === change.id);
                         if (mainQueueIndex === -1 || this.localChangeQueue[mainQueueIndex].status !== 'pending' || this.localChangeQueue[mainQueueIndex].retryCount >= MAX_RETRY_COUNT) {
                             processedCountInType++; // Skip if already processed, failed max retries, or removed
                             continue;
                         }

                         const currentQueueChange = this.localChangeQueue[mainQueueIndex];
                         currentQueueChange.status = 'processing'; // Temporarily mark as processing

                         try {
                             // Attempt to push the change to Supabase (reusing logic from processLocalChangeQueue)
                             const tables = DATA_TYPE_TABLE_MAP[currentQueueChange.dataType];
                             const table = tables[0]; // Using the first table for the data type (MVP simplification)
                             let dbOperation;
                             if (currentQueueChange.changeType === 'INSERT') { dbOperation = this.supabase.from(table).insert([currentQueueChange.payload]); }
                             else if (currentQueueChange.changeType === 'UPDATE') { if (!currentQueueChange.recordId) throw new Error('Update missing recordId'); dbOperation = this.supabase.from(table).update(currentQueueChange.payload).eq('id', currentQueueChange.recordId); }
                             else if (currentQueueChange.changeType === 'DELETE') { if (!currentQueueChange.recordId) throw new Error('Delete missing recordId'); dbOperation = this.supabase.from(table).delete().eq('id', currentQueueChange.recordId); }
                             else { throw new Error(`;
Unknown;
change;
type: $;
{
    currentQueueChange.changeType;
}
`); }

                             const { error: dbError } = await dbOperation;

                             if (dbError) { throw dbError; }

                             // On success, remove from queue and mark completed
                             this.localChangeQueue = this.localChangeQueue.filter(c => c.id !== currentQueueChange.id); // Remove the completed change
                             currentQueueChange.status = 'completed'; // Mark as completed (optional, for logging)
                             this.context.loggingService?.logInfo(`;
Successfully;
pushed;
local;
change;
for ($; { dataType }; )
    : $;
{
    currentQueueChange.id;
}
`, { userId, change: currentQueueChange });
                             itemsProcessed++;

                         } catch (error: any) {
                             console.error(`[SyncService];
Failed;
to;
push;
change;
$;
{
    currentQueueChange.id;
}
for ($; { currentQueueChange, : .dataType }; )
    : `, error.message);
                             this.context.loggingService?.logError(`;
Failed;
to;
push;
local;
change;
for ($; { currentQueueChange, : .dataType }; )
    : $;
{
    currentQueueChange.id;
}
`, { userId, change: currentQueueChange, error: error.message });
                             errors++;
                             if (error.message.includes('Conflict')) conflicts++;

                             // Mark change as failed and increment retry count in the main queue
                             const mainQueueIdx = this.localChangeQueue.findIndex(c => c.id === currentQueueChange.id);
                             if (mainQueueIdx > -1) {
                                 this.localChangeQueue[mainQueueIdx].retryCount++;
                                 this.localChangeQueue[mainQueueIdx].error = error.message; // Store the error message
                                 this.localChangeQueue[mainQueueIdx].status = 'pending'; // Keep status as pending for retry
                                 // Update status for this data type to error if it's the first error for this type in this sync
                                 if (this.syncStatus[dataType] !== 'error') {
                                      this.updateStatus(dataType, 'error', `;
Push;
failed: $;
{
    error.message;
}
`, userId);
                                 }
                             }
                             // Do NOT re-throw here, allow other promises in the batch to complete
                         }
                         processedCountInType++;
                         // Add a small delay between pushes
                         await new Promise(resolve => setTimeout(resolve, 50));
                     }
                     console.log(`[SyncService];
Finished;
processing;
local;
queue;
for (data; type; )
    : $;
{
    dataType;
}
`);
                 } else {
                     console.log(`[SyncService];
No;
pending;
local;
changes;
for (data; type; )
    : $;
{
    dataType;
}
`);
                 }
            }

            // Check final status for this data type and publish completion/error event
            const pendingChangesForType = this.localChangeQueue.filter(change => change.dataType === dataType);
            const failedMaxRetriesForType = pendingChangesForType.filter(change => change.retryCount >= MAX_RETRY_COUNT);

            if (pendingChangesForType.length === 0) {
                 this.updateStatus(dataType, 'idle', `;
$;
{
    direction;
}
sync;
completed `, userId); // Set status to idle
                 this.lastSyncTimestamp[dataType] = Date.now(); // Update timestamp for this data type
                 const resultPayload: SyncResultPayload = { dataType, userId, status: 'success', timestamp: Date.now(), direction, itemsProcessed, conflicts, errors, duration_ms: Date.now() - startTime };
                 this.context.eventBus?.publish('sync_completed', resultPayload, userId); // Publish completion event
                 console.log(`[SyncService];
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
`);
            } else if (failedMaxRetriesForType.length > 0) {
                 console.warn(`[SyncService];
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
`);
                 this.context.loggingService?.logWarning(`;
$;
{
    direction;
}
sync;
finished;
with (failed)
    changes;
for ($; { dataType } `, { userId, dataType, failedCount: failedMaxRetriesForType.length });
                 const errorMessage = `; $) {
    failedMaxRetriesForType.length;
}
changes;
failed;
after;
$;
{
    MAX_RETRY_COUNT;
}
retries. `;
                 this.updateStatus(dataType, 'error', `;
$;
{
    direction;
}
sync;
failed: $;
{
    errorMessage;
}
`, userId); // Set status to error
                 const errorPayload: SyncErrorPayload = { dataType, userId, error: errorMessage, timestamp: Date.now(), step: `;
Sync;
failed;
for ($; { dataType }; after)
    retries `, direction };
                 this.context.eventBus?.publish('sync_error', errorPayload, userId);
                 // Remove changes that hit max retries from the main queue for simplicity in MVP UI.
                 this.localChangeQueue = this.localChangeQueue.filter(change => change.retryCount < MAX_RETRY_COUNT); // Remove changes that hit max retries
                 this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after removing max retries:', err));
            } else {
                 // Status is still 'syncing' if there are pending changes with retries left
                 console.log(`[SyncService];
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
`);
                 this.updateStatus(dataType, 'syncing', `;
$;
{
    direction;
}
sync;
pending;
retries($, { pendingChangesForType, : .length }) `, userId); // Keep status as syncing
                 // The processLocalChangeQueue will continue processing these in the main loop
            }

            this.saveLocalChangeQueue().catch(err => console.error('Error saving queue after processing data type sync:', err));

        } catch (error: any) {
            console.error(`[SyncService];
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
for (user; $; { userId })
    : `, error.message);
            this.context.loggingService?.logError(`;
Data;
for ($; { dataType } `, { dataType, userId, direction, error: error.message });
            this.updateStatus(dataType, 'error', `; $) {
    direction;
}
sync;
failed: $;
{
    error.message;
}
`, userId); // Set status to error
            this.updateStatus('system', 'error', `;
Sync;
failed;
for ($; { dataType } `, userId); // Update system status as well
            const errorPayload: SyncErrorPayload = { dataType, userId, error: error.message, timestamp: Date.now(), step: `; Error)
    during;
$;
{
    direction;
}
sync `, direction };
            this.context.eventBus?.publish('sync_error', errorPayload, userId);
             this.saveLocalChangeQueue().catch(err => console.error('Error saving queue on unexpected error:', err));
            throw error; // Re-throw the error
        } finally {
             // The isProcessingQueue flag is managed by processLocalChangeQueue
        }
    }


    /**
     * Pulls remote changes from Supabase for all synchronizable data types.
     * Remote changes are handled by the Realtime subscription listeners,
     * which update the local state and publish events.
     * This method primarily ensures the Realtime subscriptions are active
     * and potentially fetches initial data if the cache is empty or stale.
     * @param userId The user ID. Required.
     * @returns Promise<void>
     */
    private async pullRemoteChanges(userId: string): Promise<void> {
        console.log(`[SyncService];
Pulling;
remote;
changes;
for (user; ; )
    : $;
{
    userId;
}
`);
        this.updateStatus('system', 'syncing', 'Starting remote pull', userId); // Update system status
        const startTime = Date.now();

        // Ensure Realtime subscriptions are active
        // Note: Individual services (MemoryEngine, etc.) are now responsible for their own Realtime subscriptions.
        // The SyncService primarily manages the local queue and orchestrates pushes/pulls.
        // This check and subscription call are removed as they are redundant if services subscribe themselves.
        // if (this.realtimeSubscriptions.size === 0) {
        //      console.warn('[SyncService] Realtime subscriptions are not active. Subscribing now.');
        //      this.subscribeToRealtimeUpdates(userId);
        //      // Wait a moment for subscriptions to connect? Or rely on them connecting asynchronously.
        //      // For MVP, rely on them connecting asynchronously.
        // }

        // For robustness, especially on startup or after being offline,
        // fetch initial data for each type if the local state is empty or potentially stale.
        // This is complex to manage efficiently (e.g., fetching only changes since last sync).
        // For MVP, we rely heavily on Realtime for ongoing changes.
        // Initial data load on login is handled by individual services (e.g., RuneEngraftingCenter loads user runes).
        // A full \"pull\" might involve fetching all data for each type and merging with local state.
        // This is a significant TODO for a robust sync system.

        // --- New: Simulate fetching and merging remote data ---
        this.updateStatus('system', 'syncing', 'Fetching remote data', userId); // Update system status
        console.log(`[SyncService];
Simulating;
fetching;
remote;
data;
for (user; ; )
    : $;
{
    userId;
}
`);
        // Simulate fetching data for each type
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate fetch time

        this.updateStatus('system', 'syncing', 'Merging remote changes', userId); // Update system status
        console.log(`[SyncService];
Simulating;
merging;
remote;
data;
for (user; ; )
    : $;
{
    userId;
}
`);
        // Simulate merging data for each type
        // This would involve calling merge logic (like mergeCRDT) for each data type
        // and updating the local state managed by the respective services.
        // For MVP, this is just a simulation step.
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate merge time

        console.log(`[SyncService];
Remote;
change;
pull;
and;
merge;
process;
simulated. `);
        this.updateStatus('system', 'syncing', 'Remote pull complete', userId); // Update system status
        // The system status will remain 'syncing' until the local queue is processed
        // The final status update (idle/error) is handled by processLocalChangeQueue
        // The lastSyncTimestamp['system'] is updated when the queue is empty
        // Individual data type timestamps are updated when their pushes complete

        // TODO: Implement actual fetching and merging logic for each data type.
        // This would involve iterating through DATA_TYPE_TABLE_MAP, fetching data from Supabase,
        // and calling a merge method on the corresponding service (if they expose one).
        // Example: const remoteKnowledge = await this.supabase.from('knowledge_records').select('*').eq('user_id', userId).gte('timestamp', lastSyncTimestamp['memoryEngine']);
        // await this.context.memoryEngine?.mergeRemoteChanges(remoteKnowledge, userId);
        // This requires significant implementation in each service.

    }


    /**
     * Handles remote data changes received via Supabase Realtime.
     * Applies the changes to the local state and publishes events.
     * This method is called by the Realtime subscription listeners.
     * @param table The Supabase table where the change occurred. Required.
     * @param eventType The type of database event ('INSERT', 'UPDATE', 'DELETE'). Required.
     * @param newRecord The new record data (for INSERT/UPDATE). Optional.
     * @param oldRecord The old record data (for UPDATE/DELETE). Optional.
     * @param userId The user ID associated with the change. Required.
     * @returns Promise<void>
     */
    // This method is removed as individual services are now responsible for handling their own remote changes via their own Realtime listeners.
    // The SyncService's role is orchestration and local queue management.
    /*
    private async handleRemoteDataChange(table: string, eventType: 'INSERT' | 'UPDATE' | 'DELETE', newRecord: any, oldRecord: any, userId: string): Promise<void> {
        console.log(`[SyncService];
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
for (user; $; { userId } `);
        this.context.loggingService?.logInfo(`)
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
`, { table, eventType, userId, newRecord, oldRecord });

        if (!userId) {
             console.warn('[SyncService] Cannot handle remote change: User ID is missing.');
             return;
        }

        // Determine the data type based on the table
        const dataType = SYNCHRONIZABLE_DATA_TYPES.find(type => DATA_TYPE_TABLE_MAP[type].includes(table));

        if (!dataType) {
            console.warn(`[SyncService];
Received;
remote;
change;
for (unknown; table; )
    : $;
{
    table;
}
Skipping. `);
            this.context.loggingService?.logWarning(`;
Received;
remote;
change;
for (unknown; table; )
    : $;
{
    table;
}
`, { table, eventType, userId });
            return;
        }

        this.updateStatus(dataType, 'syncing', `;
Applying;
remote;
$;
{
    eventType;
}
for ($; { table } `, userId);

        try {
            // Apply the remote change to the local state managed by the corresponding service.
            // This is complex and requires each service to expose methods for applying remote changes.
            // Alternatively, the SyncService could directly manipulate the state managed by other services,
            // but this breaks encapsulation.
            // A better approach: The Realtime listeners in *each service* handle applying changes to their own state.
            // The SyncService's role is primarily orchestration and managing the local queue/status.

            console.log(`[SyncService]; Remote)
    change;
for ($; { table }; processed(assuming, handled, by, service, 's listener).`);, this.updateStatus(dataType, 'idle', `Remote ${eventType} applied`, userId)))
    ; // Update status for this data type
try { }
catch (error) {
    console.error(`[SyncService] Error applying remote change for ${table}:`, error.message);
    this.context.loggingService?.logError(`Error applying remote change: ${table} - ${eventType}`, { table, eventType, userId, error: error.message });
    this.updateStatus(dataType, 'error', `Error applying remote change: ${error.message}`, userId);
    this.updateStatus('system', 'error', `Error applying remote change (${dataType})`, userId);
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
    console, : .log(`[SyncService] Simulating Mobile Git sync (${direction}) for user: ${userId}...`),
    this: .context.loggingService?.logInfo(`Simulating Mobile Git sync (${direction})`, { userId, direction, details }),
    if(, userId) {
        console.warn('[SyncService] Cannot simulate Git sync: User ID is required.');
        this.context.loggingService?.logWarning('Cannot simulate Git sync: User ID is required.');
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
    this.context.loggingService?.logWarning('Mobile Git sync already in progress. Skipping new sync request.', { userId });
    // Publish a status update indicating it's busy
    this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'syncing', step: `Git sync already running.`, error: 'Sync already in progress.' }, userId);
    throw new Error('Mobile Git sync already in progress.');
}
// Use analyticsService status as a proxy for Git sync state for MVP
this.updateStatus('analyticsService', 'syncing', `Simulating Git ${direction}`, userId); // Use analyticsService as a placeholder for Git sync status
this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'syncing', step: `Starting Git ${direction}` }, userId); // Publish status event
try {
    // Simulate the sync process
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay and processing
    const success = Math.random() > 0.1; // 90% chance of simulated success
    let resultDetails = { direction, ...details };
    let logMessage;
    let logType;
    let notificationType;
    if (success) {
        logMessage = `Simulated Mobile Git ${direction} successful.`;
        logType = 'sync-success';
        notificationType = 'success';
        resultDetails.status = 'success';
        console.log(`[SyncService] ${logMessage}`);
        this.context.loggingService?.logInfo(logMessage, { userId, direction, details });
        this.context.eventBus?.publish('mobile_git_synced', { userId, direction, details }, userId); // Publish success event
        this.updateStatus('analyticsService', 'idle', `Git ${direction} successful`, userId); // Update Git sync status proxy
        this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'idle', step: `Git ${direction} successful` }, userId); // Publish status event
    }
    else {
        const errorMessage = `Simulated Mobile Git ${direction} failed.`;
        logMessage = errorMessage;
        logType = 'sync-failure';
        notificationType = 'error';
        resultDetails.status = 'failed';
        resultDetails.error = errorMessage;
        console.error(`[SyncService] ${logMessage}`);
        this.context.loggingService?.logError(logMessage, { userId, direction, details });
        this.context.eventBus?.publish('mobile_git_sync_failed', { userId, direction, details, error: errorMessage }, userId); // Publish failure event
        this.updateStatus('analyticsService', 'error', `Git ${direction} failed`, userId); // Update Git sync status proxy
        this.context.eventBus?.publish('mobile_git_sync_status', { userId, status: 'error', step: `Git ${direction} failed`, error: errorMessage }, userId); // Publish status event
        throw new Error(errorMessage); // Throw error for caller
    }
    // Record a development log entry for the sync operation
    if (this.context.knowledgeSync) {
        const devLog = {
            question: `Mobile Git Sync (${direction})`,
            answer: logMessage,
            user_id: userId,
            source: 'dev-log', // Mark as dev log
            tags: ['git', 'mobile', direction, logType], // Add relevant tags
            dev_log_details: {
                type: 'mobile-git-sync', // Custom type within dev-log
                direction: direction,
                repo_url: details?.repoUrl,
                branch: details?.branch,
                status: resultDetails.status,
                error: resultDetails.error,
            },
        };
        this.context.knowledgeSync.saveKnowledge(devLog.question, devLog.answer, userId, devLog.source, devLog.dev_log_details)
            .catch(kbError => console.error('Error saving Git sync log to KB:', kbError));
    }
    else {
        console.warn('[SyncService] KnowledgeSync not available to save Git sync log.');
    }
    // Send a notification about the sync outcome
    if (this.context.notificationService) {
        this.context.notificationService.sendNotification({
            user_id: userId,
            type: notificationType,
            message: `Mobile Git Sync (${direction}) ${resultDetails.status}.`,
            channel: 'ui', // Send to UI by default
            details: resultDetails,
        }).catch(notifError => console.error('Error sending Git sync notification:', notifError));
    }
    else {
        console.warn('[SyncService] NotificationService not available to send Git sync notification.');
    }
    return { status: 'success', data: resultDetails }; // Return the simulated result
}
catch (error) {
    console.error(`[SyncService] Error during simulated Mobile Git sync (${direction}):`, error.message);
    this.context.loggingService?.logError(`Error during simulated Mobile Git sync (${direction})`, { userId, direction, details, error: error.message });
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
    console, : .log(`[SyncService] Initiating full data backup for user: ${userId} to ${destination}...`),
    this: .context.loggingService?.logInfo(`Initiating full data backup for user ${userId} to ${destination}`, { userId, destination }),
    if(, userId) {
        console.error('[SyncService] Cannot initiate backup: User ID is required.');
        this.context.loggingService?.logError('Cannot initiate backup: User ID is required.');
        throw new Error('User ID is required to initiate backup.');
    }
    // Prevent multiple backups running concurrently
    // Use a dedicated status flag for backup if needed, or reuse system status
    // Let's use a specific event for backup status
    ,
    // Prevent multiple backups running concurrently
    // Use a dedicated status flag for backup if needed, or reuse system status
    // Let's use a specific event for backup status
    this: .context.eventBus?.publish('backup_started', { userId, destination }, userId), // Publish event
    try: {
        // --- 1. Collect Data from Services ---
        this: .updateStatus('system', 'syncing', 'Collecting data for backup', userId), // Update system status
        console, : .log('[SyncService] Collecting data from services...'),
        const: backupData, any = {},
        // Fetch data from each synchronizable service
        // Note: This requires each service to have a method to export all its data for a user.
        // For MVP, we'll call the 'getAll...' methods or similar.
        // This is a significant TODO for a robust backup system.
        // Simulate fetching data from each service
        backupData, : .knowledgeRecords = await this.context.memoryEngine?.getAllKnowledgeForUser(userId) || [],
        backupData, : .knowledgeCollections = await this.context.memoryEngine?.getCollections(userId) || [],
        // TODO: Fetch knowledge_collection_records if needed
        backupData, : .tasks = await this.context.selfNavigationEngine?.getTasks(userId) || [],
        backupData, : .agenticFlows = await this.context.selfNavigationEngine?.getAgenticFlows(userId) || [],
        backupData, : .agenticFlowExecutions = await this.context.selfNavigationEngine?.getAgenticFlowExecutions(undefined, userId, 100) || [], // Get recent executions
        backupData, : .abilities = await this.context.authorityForgingEngine?.getAbilities(undefined, userId) || [], // Get user's and public abilities
        backupData, : .goals = await this.context.goalManagementService?.getGoals(userId) || [],
        backupData, : .notifications = await this.context.notificationService?.getNotifications(userId, undefined, undefined, 100) || [], // Get recent notifications
        // Analytics data (system events, user actions, feedback) might be included
        backupData, : .systemEvents = await this.context.analyticsService?.collectRawData(userId, 'all')?.systemEvents || [], // Get all system events
        backupData, : .userActions = await this.context.authorityForgingEngine?.getRecentActions(userId, 1000) || [], // Get more recent actions
        backupData, : .userFeedback = await this.context.evolutionEngine?.getRecentFeedback(userId, 1000) || [], // Get more recent feedback
        backupData, : .glossaryTerms = await this.context.glossaryService?.getTerms(userId) || [],
        // File metadata/content and repository metadata/content are complex and deferred.
        // backupData.files = await this.context.fileService?.listFiles('/', userId) || []; // Example: list files metadata
        // backupData.repositories = await this.context.repositoryService?.getRepos(userId) || []; // Example: list repos metadata
        console, : .log(`[SyncService] Data collection complete. Collected data types: ${Object.keys(backupData).join(', ')}`),
        this: .context.loggingService?.logInfo(`Data collection complete for backup`, { userId, dataTypes: Object.keys(backupData) }),
        // --- 2. Bundle Data ---
        this: .updateStatus('system', 'syncing', 'Bundling data', userId), // Update system status
        console, : .log('[SyncService] Bundling data into JSON...'),
        const: backupJson = JSON.stringify(backupData, null, 2), // Pretty print JSON
        const: backupFileName = `junai_backup_${userId}_${new Date().toISOString().replace(/[:.-]/g, '')}.json`,
        const: backupFilePath = `/backups/${backupFileName}`, // Path within the simulated filesystem
        console, : .log(`[SyncService] Data bundled. Size: ${backupJson.length} bytes.`),
        this: .context.loggingService?.logInfo(`Data bundled for backup`, { userId, dataSize: backupJson.length }),
        // --- 3. Simulate Saving Locally (using FileService) ---
        this: .updateStatus('system', 'syncing', 'Saving local backup file', userId), // Update system status
        console, : .log(`[SyncService] Simulating saving local backup file: ${backupFilePath}`),
        : .context.fileService
    }
};
{
    // Ensure the backup directory exists
    const backupDir = '/backups';
    // FileService.writeFile handles creating parent directories
    await this.context.fileService.writeFile(backupFilePath, backupJson, userId);
    console.log(`[SyncService] Simulated local backup file saved: ${backupFilePath}`);
    this.context.loggingService?.logInfo(`Simulated local backup file saved: ${backupFilePath}`, { userId, filePath: backupFilePath });
}
{
    console.warn('[SyncService] FileService not available. Skipping local backup file save.');
    this.context.loggingService?.logWarning('FileService not available for local backup file save.', { userId });
}
// --- 4. Simulate Uploading to Cloud (using Rune) ---
if (destination === 'google_drive') {
    this.updateStatus('system', 'syncing', 'Uploading backup to cloud', userId); // Update system status
    console.log('[SyncService] Simulating uploading backup to Google Drive...');
    // Use the GoogleDriveRune via RuneEngraftingAgent
    if (this.context.sacredRuneEngraver) {
        try {
            // Need the GoogleDriveRune instance
            const googleDriveRune = this.context.sacredRuneEngraver.runeImplementations.get('googledrive-rune')?.instance;
            if (googleDriveRune && typeof googleDriveRune.uploadFile === 'function') {
                // Simulate uploading the backup file content
                // The uploadFile method expects name, mimeType, content, parents
                const uploadResult = await googleDriveRune.uploadFile({
                    name: backupFileName,
                    mimeType: 'application/json', // Or a more specific mime type
                    content: backupJson, // Pass the JSON content
                    // parents: ['<Google Drive Folder ID>'], // Optional: specify a folder
                }, userId);
                console.log('[SyncService] Simulated Google Drive upload result:', uploadResult);
                this.context.loggingService?.logInfo('Simulated Google Drive upload complete.', { userId, uploadResult });
            }
            else {
                console.warn('[SyncService] GoogleDriveRune or uploadFile method not available. Skipping cloud backup.');
                this.context.loggingService?.logWarning('GoogleDriveRune or uploadFile method not available for cloud backup.', { userId });
            }
        }
        catch (uploadError) {
            console.error('[SyncService] Error simulating Google Drive upload:', uploadError.message);
            this.context.loggingService?.logError('Error simulating Google Drive upload.', { userId, error: uploadError.message });
            // Continue despite cloud upload error, local backup might still be successful
        }
    }
    else {
        console.warn('[SyncService] SacredRuneEngraver not available. Skipping cloud backup.');
        this.context.loggingService?.logWarning('SacredRuneEngraver not available for cloud backup.', { userId });
    }
}
// --- 5. Finalize Backup ---
this.updateStatus('system', 'idle', 'Backup completed', userId); // Update system status
this.context.eventBus?.publish('backup_completed', { userId, status: 'success', destination, filePath: backupFilePath }, userId); // Publish event
console.log(`[SyncService] Full data backup completed successfully for user: ${userId}.`);
this.context.loggingService?.logInfo(`Full data backup completed successfully for user ${userId}`, { userId, destination });
try { }
catch (error) {
    console.error(`[SyncService] Error during full data backup for user ${userId}:`, error.message);
    this.context.loggingService?.logError(`Full data backup failed for user ${userId}`, { userId, destination, error: error.message });
    this.updateStatus('system', 'error', `Backup failed: ${error.message}`, userId); // Update system status
    this.context.eventBus?.publish('backup_completed', { userId, status: 'failed', destination, error: error.message }, userId); // Publish event
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
    console, : .log(`[SyncService] Initiating data mirroring for user: ${userId}, type: ${dataType} to ${destination}...`),
    this: .context.loggingService?.logInfo(`Initiating data mirroring for user ${userId} type ${dataType} to ${destination}`, { userId, dataType, destination }),
    if(, userId) { }
} || !destination;
{
    console.error('[SyncService] Cannot initiate mirroring: User ID and destination are required.');
    this.context.loggingService?.logError('Cannot initiate mirroring: Missing required fields.', { userId, dataType, destination });
    throw new Error('User ID and destination are required to initiate mirroring.');
}
// Prevent multiple mirroring operations for the same type/destination concurrently
// TODO: Implement state tracking for mirroring operations
this.updateStatus(dataType, 'syncing', `Starting mirroring to ${destination}`, userId); // Update status
this.context.eventBus?.publish('mirror_started', { userId, dataType, destination }, userId); // Publish event
try {
    // --- Simulate Mirroring Process ---
    // This is a placeholder. A real mirroring process would involve:
    // 1. Setting up listeners for changes (local queue, remote Realtime).
    // 2. Replicating changes to the destination in near real-time.
    // 3. Handling potential conflicts or errors during replication.
    // 4. Managing the state of the mirrored data at the destination.
    console.log(`[SyncService] Simulating mirroring data for user: ${userId}, type: ${dataType} to ${destination}.`);
    // Simulate mirroring time
    await new Promise(resolve => setTimeout(resolve, 3000));
    // Simulate success/failure
    const success = Math.random() > 0.1; // 90% chance of simulated success
    if (success) {
        console.log(`[SyncService] Simulated mirroring successful for user: ${userId}, type: ${dataType} to ${destination}.`);
        this.context.loggingService?.logInfo(`Simulated mirroring successful`, { userId, dataType, destination });
        this.updateStatus(dataType, 'idle', `Mirroring to ${destination} successful`, userId); // Update status
        this.context.eventBus?.publish('mirror_completed', { userId, dataType, destination, status: 'success' }, userId); // Publish event
    }
    else {
        const errorMessage = `Simulated mirroring failed for user ${userId}, type ${dataType} to ${destination}.`;
        console.error(`[SyncService] ${errorMessage}`);
        this.context.loggingService?.logError(`Simulated mirroring failed`, { userId, dataType, destination, error: errorMessage });
        this.updateStatus(dataType, 'error', `Mirroring failed: ${errorMessage}`, userId); // Update status
        this.context.eventBus?.publish('mirror_failed', { userId, dataType, destination, error: errorMessage }, userId); // Publish event
        throw new Error(errorMessage); // Throw error for caller
    }
}
catch (error) {
    console.error(`[SyncService] Error during data mirroring for user ${userId}:`, error.message);
    this.context.loggingService?.logError(`Error during data mirroring`, { userId, dataType, destination, error: error.message });
    // Status and error event are already updated by the error handler within the try block
    throw error; // Re-throw the error
}
`` `;
