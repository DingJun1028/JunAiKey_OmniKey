"use strict";
`` `typescript
// src/modules/knowledgeSync.ts
// Knowledge Sync Module
// Acts as an intermediary between UI/other modules and the MemoryEngine.
// Handles data validation, basic business logic related to knowledge, and potentially sync orchestration for knowledge.
// Part of the Bidirectional Sync Domain (\u96d9\u5410\u540c\u6b65\u9818\u57df) and interacts with Permanent Memory (\u6c38\u4e45\u8a18\u61b6).
// --- Modified: Implement recordKnowledge, queryKnowledge, updateKnowledge, deleteKnowledge --
// --- Modified: Add methods for Knowledge Collections (create, get, add/remove records) --
// --- New: Implement Realtime Subscriptions for knowledge_records, knowledge_collections, knowledge_collection_records -- (Moved to MemoryEngine)
// --- Modified: Add support for is_starred and tags in recordKnowledge and updateKnowledge --
// --- Modified: Add language parameter to relevant methods --
// --- Modified: Add context parameter to searchKnowledge and pass it to MemoryEngine --
// --- Modified: Add limit option to searchKnowledge --
// --- Modified: Remove Realtime Subscriptions (now handled by MemoryEngine) --

import { MemoryEngine } from '../core/memory/MemoryEngine';
import { SystemContext, KnowledgeRecord, KnowledgeCollection } from '../interfaces';
// import { LoggingService } from '../core/logging/LoggingService'; // Dependency (Access via context)
// import { EventBus } from './events/EventBus'; // Dependency (Access via context)
// import { SyncService } from '../modules/sync/SyncService'; // Dependency (Access via context)


export class KnowledgeSync {
    private memoryEngine: MemoryEngine; // The core MemoryEngine
    private context: SystemContext;
    // private loggingService: LoggingService; // Access via context
    // private eventBus: EventBus; // Access via context
    // private syncService: SyncService; // Access via context


    constructor(context: SystemContext) {
        this.context = context;
        this.memoryEngine = context.memoryEngine; // Get MemoryEngine from context
        // this.loggingService = context.loggingService;
        // this.eventBus = context.eventBus;
        console.log('KnowledgeSync module initialized.');
        // TODO: Integrate with SyncService for orchestration of sync across devices/platforms. (Part of Bidirectional Sync Domain)
        // SyncService will listen to events published by MemoryEngine's Realtime subscriptions.
    }

    // --- Knowledge Record Operations (\u77e5\u8b58\u8a18\u9304) ---

    /**
     * Saves a new knowledge record.
     * Performs basic validation and calls the MemoryEngine.
     * @param question The question. Required.
     * @param answer The answer. Required.
     * @param userId The user ID. Required.
     * @param source Optional source.
     * @param devLogDetails Optional JSONB for dev log details.
     * @param isStarred Optional: Whether to star the record. Defaults to false.
     * @param tags Optional tags.
     * @param language Optional: Language of the content. Defaults to user preference or system default.
     * @returns Promise<KnowledgeRecord | null> The saved record or null.
     */
    async saveKnowledge(question: string, answer: string, userId: string, source?: string, devLogDetails?: any, isStarred: boolean = false, tags?: string[], language?: string): Promise<KnowledgeRecord | null> {
        console.log('[KnowledgeSync] Attempting to save knowledge for user:', userId);
        this.context.loggingService?.logInfo('Attempting to save knowledge', { userId, source, isStarred, tags, language });

        if (!question || !answer || !userId) {
            console.error('[KnowledgeSync] Validation failed: Question, answer, and user ID are required.');
            this.context.loggingService?.logError('Validation failed for saving knowledge', { userId });
            throw new Error('Question, answer, and user ID are required.');
        }

        try {
            // Call the core MemoryEngine to record the knowledge
            // Pass all details including language
            const savedRecord = await this.memoryEngine.recordKnowledge(question, answer, userId, source, devLogDetails, isStarred, tags, language); // Pass all details

            if (savedRecord) {
                console.log('[KnowledgeSync] Knowledge saved successfully:', savedRecord.id);
                this.context.loggingService?.logInfo('Knowledge saved successfully', { recordId: savedRecord.id, userId: userId });
                // MemoryEngine publishes events and notifies SyncService (if configured)
            } else {
                 console.error('[KnowledgeSync] Failed to save knowledge via MemoryEngine.');
                 this.context.loggingService?.logError('Failed to save knowledge via MemoryEngine', { userId: userId });
            }

            return savedRecord;

        } catch (error: any) {
            console.error('[KnowledgeSync] Error saving knowledge:', error);
            this.context.loggingService?.logError('Error saving knowledge', { userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Searches the knowledge base for records matching a query for a specific user.
     * Can perform keyword or semantic search.
     * @param query The search query. Required.
     * @param userId The user ID. Required.
     * @param useSemanticSearch Optional: Whether to use semantic search. Defaults to false.
     * @param language Optional: Filter results by language. Defaults to undefined (all languages).
     * @param context Optional: Contextual information for the query.
     * @param limit Optional: Maximum number of results to return. Defaults to 100.
     * @returns Promise<KnowledgeRecord[]> An array of matching records.
     */
    async searchKnowledge(query: string, userId: string, useSemanticSearch: boolean = false, language?: string, context?: any, limit: number = 100): Promise<KnowledgeRecord[]> {
        console.log(`[KnowledgeSync];
Searching;
knowledge;
for (user; ; )
    : $;
{
    userId;
}
with (query)
    : ;
"${query}\" (Semantic: ${useSemanticSearch}, Language: ${language || 'all'}, Context: ${context ? 'present' : 'absent'}, Limit: ${limit})`);;
this.context.loggingService?.logInfo('Attempting to search knowledge', { query, userId, useSemanticSearch, language, context: !!context, limit });
if (!query || !userId) {
    console.warn('[KnowledgeSync] Search query and user ID are required.');
    this.context.loggingService?.logWarning('Search query and user ID are required.');
    return [];
}
try {
    // Call the core MemoryEngine to perform the query
    // Pass the useSemanticSearch flag, language, context, AND limit to MemoryEngine
    const results = await this.memoryEngine.queryKnowledge(query, userId, useSemanticSearch, language, context, limit); // Pass useSemanticSearch, language, context, limit
    console.log(`[KnowledgeSync] Search completed. Found ${results.length} results.`);
    this.context.loggingService?.logInfo(`Knowledge search completed. Found ${results.length} results.`, { query, userId: userId, useSemanticSearch, language, context: !!context, limit });
    return results;
}
catch (error) {
    console.error('[KnowledgeSync] Error searching knowledge:', error);
    this.context.loggingService?.logError('Error searching knowledge', { query, userId: userId, useSemanticSearch, language, context: !!context, limit, error: error.message });
    throw error; // Re-throw the error
}
/**
* Fetches all knowledge records for a specific user.
* @param userId The user ID. Required.
* @returns Promise<KnowledgeRecord[]> An array of all records for the user.
*/
async;
getAllKnowledgeForUser(userId, string);
Promise < KnowledgeRecord[] > {
    console, : .log(`[KnowledgeSync] Getting all knowledge for user: ${userId}`),
    this: .context.loggingService?.logInfo('Attempting to get all knowledge', { userId }),
    if(, userId) {
        console.warn('[KnowledgeSync] User ID is required to get all knowledge.');
        this.context.loggingService?.logWarning('User ID is required to get all knowledge.');
        return [];
    },
    try: {
        // Call the core MemoryEngine to get all knowledge
        const: records = await this.memoryEngine.getAllKnowledgeForUser(userId),
        console, : .log(`[KnowledgeSync] Fetched ${records.length} records.`),
        this: .context.loggingService?.logInfo(`Fetched ${records.length} records.`, { userId: userId }),
        return: records
    }, catch(error) {
        console.error('[KnowledgeSync] Error getting all knowledge:', error);
        this.context.loggingService?.logError('Error getting all knowledge', { userId: userId, error: error.message });
        throw error; // Re-throw the error
    }
};
/**
 * Updates an existing knowledge record.
 * @param id The ID of the record. Required.
 * @param updates The updates to apply (question, answer, source, tags, is_starred, embedding_vector, dev_log_details, language). Required.
 * @param userId The user ID for verification. Required.
 * @returns Promise<KnowledgeRecord | null> The updated record or null.
 */
async;
updateKnowledge(id, string, updates, (Partial), userId, string);
Promise < KnowledgeRecord | null > {
    console, : .log(`[KnowledgeSync] Attempting to update knowledge record ${id} for user: ${userId}`, updates),
    this: .context.loggingService?.logInfo(`Attempting to update knowledge record ${id}`, { id, updates, userId }),
    if(, id) { }
} || !userId || Object.keys(updates).length === 0;
{
    console.warn('[KnowledgeSync] Update failed: ID, user ID, and updates are required.');
    this.context.loggingService?.logWarning('Update failed: ID, user ID, and updates are required.', { id, userId, updates });
    throw new Error('ID, user ID, and updates are required.');
}
try {
    // Call the core MemoryEngine to update the knowledge
    // Pass userId and updates (including is_starred, tags, language)
    const updatedRecord = await this.memoryEngine.updateKnowledge(id, updates, userId); // Pass userId
    if (updatedRecord) {
        console.log('[KnowledgeSync] Knowledge updated successfully:', updatedRecord.id);
        this.context.loggingService?.logInfo('Knowledge updated successfully', { recordId: updatedRecord.id, userId: userId });
        // MemoryEngine publishes events and notifies SyncService (if configured)
    }
    else {
        console.warn('[KnowledgeSync] Failed to update knowledge via MemoryEngine (record not found or user mismatch).');
        this.context.loggingService?.logWarning('Failed to update knowledge via MemoryEngine (record not found or user mismatch).', { recordId: id, userId: userId });
    }
    return updatedRecord;
}
catch (error) {
    console.error('[KnowledgeSync] Error updating knowledge:', error);
    this.context.loggingService?.logError('Error updating knowledge', { recordId: id, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Deletes a knowledge record.
 * @param id The ID of the record. Required.
 * @param userId The user ID for verification. Required.
 * @returns Promise<boolean> True if deletion was successful.
 */
async;
deleteKnowledge(id, string, userId, string);
Promise < boolean > {
    console, : .log(`[KnowledgeSync] Attempting to delete knowledge record ${id} for user: ${userId}`),
    this: .context.loggingService?.logInfo(`Attempting to delete knowledge record ${id}`, { id, userId }),
    if(, id) { }
} || !userId;
{
    console.warn('[KnowledgeSync] Delete failed: ID and user ID are required.');
    this.context.loggingService?.logWarning('Delete failed: ID and user ID are required.', { id, userId });
    throw new Error('ID and user ID are required.');
}
try {
    // Call the core MemoryEngine to delete the knowledge
    const success = await this.memoryEngine.deleteKnowledge(id, userId); // Pass userId
    if (success) {
        console.log('[KnowledgeSync] Knowledge deleted successfully:', id);
        this.context.loggingService?.logInfo('Knowledge deleted successfully', { recordId: id, userId: userId });
        // MemoryEngine publishes events and notifies SyncService (if configured)
    }
    else {
        console.warn('[KnowledgeSync] Failed to delete knowledge via MemoryEngine (record not found or user mismatch).');
        this.context.loggingService?.logWarning('Failed to delete knowledge via MemoryEngine (record not found or user mismatch).', { recordId: id, userId: userId });
    }
    return success;
}
catch (error) {
    console.error('[KnowledgeSync] Error deleting knowledge:', error);
    this.context.loggingService?.logError('Error deleting knowledge', { recordId: id, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Fetches recent development log records for a specific user.
 * These are Knowledge Records with source 'dev-log' or 'dev-conversation'.
 * @param userId The user ID. Required.
 * @param limit Optional: Maximum number of logs to retrieve. Defaults to 20.
 * @returns Promise<KnowledgeRecord[]> An array of recent dev logs.
 */
async;
getRecentDevLogs(userId, string, limit, number = 20);
Promise < KnowledgeRecord[] > {
    console, : .log(`[KnowledgeSync] Getting recent dev logs for user: ${userId}, limit: ${limit}`),
    this: .context.loggingService?.logInfo('Attempting to get recent dev logs', { userId, limit }),
    if(, userId) {
        console.warn('[KnowledgeSync] User ID is required to get recent dev logs.');
        this.context.loggingService?.logWarning('User ID is required to get recent dev logs.');
        return [];
    },
    try: {
        // Use MemoryEngine to query records by source and user ID
        // Note: MemoryEngine.queryKnowledge is for text search. We need a method to query by source.
        // Let's add a method to MemoryEngine or query directly here.
        // Querying directly here for simplicity in MVP.
        const: { data, error } = await this.context.apiProxy.supabaseClient
            .from('knowledge_records')
            .select('*')
            .eq('user_id', userId)
            .in('source', ['dev-log', 'dev-conversation']) // Filter by relevant sources
            .order('timestamp', { ascending: false }) // Order by newest first
            .limit(limit),
        if(error) { throw error; },
        const: records = data,
        console, : .log(`[KnowledgeSync] Fetched ${records.length} recent dev logs.`),
        this: .context.loggingService?.logInfo(`Fetched ${records.length} recent dev logs.`, { userId: userId }),
        return: records
    }, catch(error) {
        console.error('[KnowledgeSync] Error getting recent dev logs:', error);
        this.context.loggingService?.logError('Error getting recent dev logs', { userId: userId, error: error.message });
        throw error; // Re-throw the error
    }
};
// --- Knowledge Collection Operations (\u77e5\u8b58\u96c6\u5408) ---
/**
 * Creates a new knowledge collection.
 * @param name The name of the collection. Required.
 * @param userId The user ID. Required.
 * @param description Optional description.
 * @param language Optional: Primary language of the collection. Defaults to user preference or system default.
 * @returns Promise<KnowledgeCollection | null> The created collection or null.
 */
async;
createCollection(name, string, userId, string, description ?  : string, language ?  : string);
Promise < KnowledgeCollection | null > {
    console, : .log('[KnowledgeSync] Attempting to create collection for user:', userId),
    this: .context.loggingService?.logInfo('Attempting to create collection', { userId, name, language }),
    if(, name) { }
} || !userId;
{
    console.error('[KnowledgeSync] Validation failed: Name and user ID are required.');
    this.context.loggingService?.logError('Validation failed for creating collection', { userId, name });
    throw new Error('Name and user ID are required.');
}
try {
    // Call the core MemoryEngine to create the collection
    const createdCollection = await this.memoryEngine.createCollection(name, userId, description, language);
    if (createdCollection) {
        console.log('[KnowledgeSync] Collection created successfully:', createdCollection.id);
        this.context.loggingService?.logInfo('Collection created successfully', { collectionId: createdCollection.id, userId: userId });
        // MemoryEngine publishes events and notifies SyncService (if configured)
    }
    else {
        console.error('[KnowledgeSync] Failed to create collection via MemoryEngine.');
        this.context.loggingService?.logError('Failed to create collection via MemoryEngine', { userId: userId, name });
    }
    return createdCollection;
}
catch (error) {
    console.error('[KnowledgeSync] Error creating collection:', error);
    this.context.loggingService?.logError('Error creating collection', { userId: userId, name, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Retrieves knowledge collections for a specific user.
 * @param userId The user ID. Required.
 * @returns Promise<KnowledgeCollection[]> An array of collections.
 */
async;
getCollections(userId, string);
Promise < KnowledgeCollection[] > {
    console, : .log(`[KnowledgeSync] Getting collections for user: ${userId}`),
    this: .context.loggingService?.logInfo('Attempting to get collections', { userId }),
    if(, userId) {
        console.warn('[KnowledgeSync] User ID is required to get collections.');
        this.context.loggingService?.logWarning('User ID is required to get collections.');
        return [];
    },
    try: {
        // Call the core MemoryEngine to get collections
        const: collections = await this.memoryEngine.getCollections(userId),
        console, : .log(`[KnowledgeSync] Fetched ${collections.length} collections.`),
        this: .context.loggingService?.logInfo(`Fetched ${collections.length} collections.`, { userId: userId }),
        return: collections
    }, catch(error) {
        console.error('[KnowledgeSync] Error getting collections:', error);
        this.context.loggingService?.logError('Error getting collections', { userId: userId, error: error.message });
        throw error; // Re-throw the error
    }
};
/**
 * Retrieves a specific knowledge collection by ID for a user.
 * @param collectionId The ID of the collection. Required.
 * @param userId The user ID. Required.
 * @returns Promise<KnowledgeCollection | undefined> The collection or undefined.
 */
async;
getCollectionById(collectionId, string, userId, string);
Promise < KnowledgeCollection | undefined > {
    console, : .log(`[KnowledgeSync] Getting collection by ID: ${collectionId} for user: ${userId}`),
    this: .context.loggingService?.logInfo('Attempting to get collection by ID', { collectionId, userId }),
    if(, collectionId) { }
} || !userId;
{
    console.warn('[KnowledgeSync] Collection ID and user ID are required.');
    this.context.loggingService?.logWarning('Collection ID and user ID are required.', { collectionId, userId });
    return undefined;
}
try {
    // Call the core MemoryEngine to get the collection by ID
    const collection = await this.memoryEngine.getCollectionById(collectionId, userId);
    if (collection) {
        console.log(`[KnowledgeSync] Fetched collection: ${collection.id}.`);
        this.context.loggingService?.logInfo(`Fetched collection: ${collection.id}.`, { collectionId, userId });
    }
    else {
        console.warn(`[KnowledgeSync] Collection ${collectionId} not found or not accessible.`);
        this.context.loggingService?.logWarning(`Collection not found or not accessible: ${collectionId}`, { collectionId, userId });
    }
    return collection;
}
catch (error) {
    console.error(`[KnowledgeSync] Error getting collection by ID ${collectionId}:`, error);
    this.context.loggingService?.logError(`Error getting collection by ID ${collectionId}`, { collectionId, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Retrieves knowledge records contained within a specific collection for a user.
 * @param collectionId The ID of the collection. Required.
 * @param userId The user ID. Required.
 * @returns Promise<KnowledgeRecord[]> An array of records in the collection.
 */
async;
getRecordsInCollection(collectionId, string, userId, string);
Promise < KnowledgeRecord[] > {
    console, : .log(`[KnowledgeSync] Getting records in collection: ${collectionId} for user: ${userId}`),
    this: .context.loggingService?.logInfo('Attempting to get records in collection', { collectionId, userId }),
    if(, collectionId) { }
} || !userId;
{
    console.warn('[KnowledgeSync] Collection ID and user ID are required.');
    this.context.loggingService?.logWarning('Collection ID and user ID are required.', { collectionId, userId });
    return [];
}
try {
    // Call the core MemoryEngine to get records in the collection
    const records = await this.memoryEngine.getRecordsInCollection(collectionId, userId);
    console.log(`[KnowledgeSync] Fetched ${records.length} records in collection ${collectionId}.`);
    this.context.loggingService?.logInfo(`Fetched ${records.length} records in collection ${collectionId}.`, { collectionId, userId: userId });
    return records;
}
catch (error) {
    console.error(`[KnowledgeSync] Error getting records in collection ${collectionId}:`, error);
    this.context.loggingService?.logError(`Error getting records in collection ${collectionId}`, { collectionId, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Adds a knowledge record to a specific collection for a user.
 * @param collectionId The ID of the collection. Required.
 * @param recordId The ID of the record to add. Required.
 * @param userId The user ID. Required.
 * @returns Promise<any | null> The created join table entry or null if the record was already in the collection.
 */
async;
addRecordToCollection(collectionId, string, recordId, string, userId, string);
Promise < any | null > {
    console, : .log(`[KnowledgeSync] Attempting to add record ${recordId} to collection ${collectionId} for user ${userId}`),
    this: .context.loggingService?.logInfo('Attempting to add record to collection', { collectionId, recordId, userId }),
    if(, collectionId) { }
} || !recordId || !userId;
{
    console.warn('[KnowledgeSync] Collection ID, record ID, and user ID are required.');
    this.context.loggingService?.logWarning('Collection ID, record ID, and user ID are required.', { collectionId, recordId, userId });
    throw new Error('Collection ID, record ID, and user ID are required.');
}
try {
    // Call the core MemoryEngine to add the record to the collection
    const result = await this.memoryEngine.addRecordToCollection(collectionId, recordId, userId);
    if (result) {
        console.log(`[KnowledgeSync] Record ${recordId} added to collection ${collectionId}.`);
        this.context.loggingService?.logInfo('Record added to collection', { collectionId, recordId, userId: userId });
        // MemoryEngine publishes events and notifies SyncService (if configured)
    }
    else {
        console.warn(`[KnowledgeSync] Record ${recordId} was already in collection ${collectionId}.`);
        this.context.loggingService?.logWarning('Record already in collection', { collectionId, recordId, userId: userId });
    }
    return result; // Returns the created join entry or null
}
catch (error) {
    console.error(`[KnowledgeSync] Error adding record ${recordId} to collection ${collectionId}:`, error);
    this.context.loggingService?.logError('Error adding record to collection', { collectionId, recordId, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Removes a knowledge record from a specific collection for a user.
 * @param collectionId The ID of the collection. Required.
 * @param recordId The ID of the record to remove. Required.
 * @param userId The user ID. Required.
 * @returns Promise<boolean> True if removal was successful.
 */
async;
removeRecordFromCollection(collectionId, string, recordId, string, userId, string);
Promise < boolean > {
    console, : .log(`[KnowledgeSync] Attempting to remove record ${recordId} from collection ${collectionId} for user ${userId}`),
    this: .context.loggingService?.logInfo('Attempting to remove record from collection', { collectionId, recordId, userId }),
    if(, collectionId) { }
} || !recordId || !userId;
{
    console.warn('[KnowledgeSync] Collection ID, record ID, and user ID are required.');
    this.context.loggingService?.logWarning('Collection ID, record ID, and user ID are required.', { collectionId, recordId, userId });
    throw new Error('Collection ID, record ID, and user ID are required.');
}
try {
    // Call the core MemoryEngine to remove the record from the collection
    const success = await this.memoryEngine.removeRecordFromCollection(collectionId, recordId, userId);
    if (success) {
        console.log(`[KnowledgeSync] Record ${recordId} removed from collection ${collectionId}.`);
        this.context.loggingService?.logInfo('Record removed from collection', { collectionId, recordId, userId: userId });
        // MemoryEngine publishes events and notifies SyncService (if configured)
    }
    else {
        console.warn(`[KnowledgeSync] Record ${recordId} not found in collection ${collectionId} or not accessible.`);
        this.context.loggingService?.logWarning('Record not found in collection or not accessible', { collectionId, recordId, userId: userId });
    }
    return success;
}
catch (error) {
    console.error(`[KnowledgeSync] Error removing record ${recordId} from collection ${collectionId}:`, error);
    this.context.loggingService?.logError('Error removing record from collection', { collectionId, recordId, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
`` `;
