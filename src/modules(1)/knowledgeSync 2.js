var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a;
var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20;
""(__makeTemplateObject(["typescript\n// src/modules/knowledgeSync.ts\n// Knowledge Sync Module\n// Acts as an intermediary between UI/other modules and the MemoryEngine.\n// Handles data validation, basic business logic related to knowledge, and potentially sync orchestration for knowledge.\n// Part of the Bidirectional Sync Domain (\u96D9\u5410\u540C\u6B65\u9818\u57DF) and interacts with Permanent Memory (\u6C38\u4E45\u8A18\u61B6).\n// --- Modified: Implement recordKnowledge, queryKnowledge, updateKnowledge, deleteKnowledge --\n// --- Modified: Add methods for Knowledge Collections (create, get, add/remove records) --\n// --- New: Implement Realtime Subscriptions for knowledge_records, knowledge_collections, knowledge_collection_records -- (Moved to MemoryEngine)\n// --- Modified: Add support for is_starred and tags in recordKnowledge and updateKnowledge --\n// --- Modified: Add language parameter to relevant methods --\n// --- Modified: Add context parameter to searchKnowledge and pass it to MemoryEngine --\n// --- Modified: Add limit option to searchKnowledge --\n// --- Modified: Remove Realtime Subscriptions (now handled by MemoryEngine) --\n\nimport { MemoryEngine } from '../core/memory/MemoryEngine';\nimport { SystemContext, KnowledgeRecord, KnowledgeCollection } from '../interfaces';\n// import { LoggingService } from '../core/logging/LoggingService'; // Dependency (Access via context)\n// import { EventBus } from './events/EventBus'; // Dependency (Access via context)\n// import { SyncService } from '../modules/sync/SyncService'; // Dependency (Access via context)\n\n\nexport class KnowledgeSync {\n    private memoryEngine: MemoryEngine; // The core MemoryEngine\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n    // private syncService: SyncService; // Access via context\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.memoryEngine = context.memoryEngine; // Get MemoryEngine from context\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        console.log('KnowledgeSync module initialized.');\n        // TODO: Integrate with SyncService for orchestration of sync across devices/platforms. (Part of Bidirectional Sync Domain)\n        // SyncService will listen to events published by MemoryEngine's Realtime subscriptions.\n    }\n\n    // --- Knowledge Record Operations (\u77E5\u8B58\u8A18\u9304) ---\n\n    /**\n     * Saves a new knowledge record.\n     * Performs basic validation and calls the MemoryEngine.\n     * @param question The question. Required.\n     * @param answer The answer. Required.\n     * @param userId The user ID. Required.\n     * @param source Optional source.\n     * @param devLogDetails Optional JSONB for dev log details.\n     * @param isStarred Optional: Whether to star the record. Defaults to false.\n     * @param tags Optional tags.\n     * @param language Optional: Language of the content. Defaults to user preference or system default.\n     * @returns Promise<KnowledgeRecord | null> The saved record or null.\n     */\n    async saveKnowledge(question: string, answer: string, userId: string, source?: string, devLogDetails?: any, isStarred: boolean = false, tags?: string[], language?: string): Promise<KnowledgeRecord | null> {\n        console.log('[KnowledgeSync] Attempting to save knowledge for user:', userId);\n        this.context.loggingService?.logInfo('Attempting to save knowledge', { userId, source, isStarred, tags, language });\n\n        if (!question || !answer || !userId) {\n            console.error('[KnowledgeSync] Validation failed: Question, answer, and user ID are required.');\n            this.context.loggingService?.logError('Validation failed for saving knowledge', { userId });\n            throw new Error('Question, answer, and user ID are required.');\n        }\n\n        try {\n            // Call the core MemoryEngine to record the knowledge\n            // Pass all details including language\n            const savedRecord = await this.memoryEngine.recordKnowledge(question, answer, userId, source, devLogDetails, isStarred, tags, language); // Pass all details\n\n            if (savedRecord) {\n                console.log('[KnowledgeSync] Knowledge saved successfully:', savedRecord.id);\n                this.context.loggingService?.logInfo('Knowledge saved successfully', { recordId: savedRecord.id, userId: userId });\n                // MemoryEngine publishes events and notifies SyncService (if configured)\n            } else {\n                 console.error('[KnowledgeSync] Failed to save knowledge via MemoryEngine.');\n                 this.context.loggingService?.logError('Failed to save knowledge via MemoryEngine', { userId: userId });\n            }\n\n            return savedRecord;\n\n        } catch (error: any) {\n            console.error('[KnowledgeSync] Error saving knowledge:', error);\n            this.context.loggingService?.logError('Error saving knowledge', { userId: userId, error: error.message });\n            throw error; // Re-throw the error\n        }\n    }\n\n    /**\n     * Searches the knowledge base for records matching a query for a specific user.\n     * Can perform keyword or semantic search.\n     * @param query The search query. Required.\n     * @param userId The user ID. Required.\n     * @param useSemanticSearch Optional: Whether to use semantic search. Defaults to false.\n     * @param language Optional: Filter results by language. Defaults to undefined (all languages).\n     * @param context Optional: Contextual information for the query.\n     * @param limit Optional: Maximum number of results to return. Defaults to 100.\n     * @returns Promise<KnowledgeRecord[]> An array of matching records.\n     */\n    async searchKnowledge(query: string, userId: string, useSemanticSearch: boolean = false, language?: string, context?: any, limit: number = 100): Promise<KnowledgeRecord[]> {\n        console.log("], ["typescript\n// src/modules/knowledgeSync.ts\n// Knowledge Sync Module\n// Acts as an intermediary between UI/other modules and the MemoryEngine.\n// Handles data validation, basic business logic related to knowledge, and potentially sync orchestration for knowledge.\n// Part of the Bidirectional Sync Domain (\\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df) and interacts with Permanent Memory (\\u6c38\\u4e45\\u8a18\\u61b6).\n// --- Modified: Implement recordKnowledge, queryKnowledge, updateKnowledge, deleteKnowledge --\n// --- Modified: Add methods for Knowledge Collections (create, get, add/remove records) --\n// --- New: Implement Realtime Subscriptions for knowledge_records, knowledge_collections, knowledge_collection_records -- (Moved to MemoryEngine)\n// --- Modified: Add support for is_starred and tags in recordKnowledge and updateKnowledge --\n// --- Modified: Add language parameter to relevant methods --\n// --- Modified: Add context parameter to searchKnowledge and pass it to MemoryEngine --\n// --- Modified: Add limit option to searchKnowledge --\n// --- Modified: Remove Realtime Subscriptions (now handled by MemoryEngine) --\n\nimport { MemoryEngine } from '../core/memory/MemoryEngine';\nimport { SystemContext, KnowledgeRecord, KnowledgeCollection } from '../interfaces';\n// import { LoggingService } from '../core/logging/LoggingService'; // Dependency (Access via context)\n// import { EventBus } from './events/EventBus'; // Dependency (Access via context)\n// import { SyncService } from '../modules/sync/SyncService'; // Dependency (Access via context)\n\n\nexport class KnowledgeSync {\n    private memoryEngine: MemoryEngine; // The core MemoryEngine\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n    // private syncService: SyncService; // Access via context\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.memoryEngine = context.memoryEngine; // Get MemoryEngine from context\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        console.log('KnowledgeSync module initialized.');\n        // TODO: Integrate with SyncService for orchestration of sync across devices/platforms. (Part of Bidirectional Sync Domain)\n        // SyncService will listen to events published by MemoryEngine's Realtime subscriptions.\n    }\n\n    // --- Knowledge Record Operations (\\u77e5\\u8b58\\u8a18\\u9304) ---\n\n    /**\n     * Saves a new knowledge record.\n     * Performs basic validation and calls the MemoryEngine.\n     * @param question The question. Required.\n     * @param answer The answer. Required.\n     * @param userId The user ID. Required.\n     * @param source Optional source.\n     * @param devLogDetails Optional JSONB for dev log details.\n     * @param isStarred Optional: Whether to star the record. Defaults to false.\n     * @param tags Optional tags.\n     * @param language Optional: Language of the content. Defaults to user preference or system default.\n     * @returns Promise<KnowledgeRecord | null> The saved record or null.\n     */\n    async saveKnowledge(question: string, answer: string, userId: string, source?: string, devLogDetails?: any, isStarred: boolean = false, tags?: string[], language?: string): Promise<KnowledgeRecord | null> {\n        console.log('[KnowledgeSync] Attempting to save knowledge for user:', userId);\n        this.context.loggingService?.logInfo('Attempting to save knowledge', { userId, source, isStarred, tags, language });\n\n        if (!question || !answer || !userId) {\n            console.error('[KnowledgeSync] Validation failed: Question, answer, and user ID are required.');\n            this.context.loggingService?.logError('Validation failed for saving knowledge', { userId });\n            throw new Error('Question, answer, and user ID are required.');\n        }\n\n        try {\n            // Call the core MemoryEngine to record the knowledge\n            // Pass all details including language\n            const savedRecord = await this.memoryEngine.recordKnowledge(question, answer, userId, source, devLogDetails, isStarred, tags, language); // Pass all details\n\n            if (savedRecord) {\n                console.log('[KnowledgeSync] Knowledge saved successfully:', savedRecord.id);\n                this.context.loggingService?.logInfo('Knowledge saved successfully', { recordId: savedRecord.id, userId: userId });\n                // MemoryEngine publishes events and notifies SyncService (if configured)\n            } else {\n                 console.error('[KnowledgeSync] Failed to save knowledge via MemoryEngine.');\n                 this.context.loggingService?.logError('Failed to save knowledge via MemoryEngine', { userId: userId });\n            }\n\n            return savedRecord;\n\n        } catch (error: any) {\n            console.error('[KnowledgeSync] Error saving knowledge:', error);\n            this.context.loggingService?.logError('Error saving knowledge', { userId: userId, error: error.message });\n            throw error; // Re-throw the error\n        }\n    }\n\n    /**\n     * Searches the knowledge base for records matching a query for a specific user.\n     * Can perform keyword or semantic search.\n     * @param query The search query. Required.\n     * @param userId The user ID. Required.\n     * @param useSemanticSearch Optional: Whether to use semantic search. Defaults to false.\n     * @param language Optional: Filter results by language. Defaults to undefined (all languages).\n     * @param context Optional: Contextual information for the query.\n     * @param limit Optional: Maximum number of results to return. Defaults to 100.\n     * @returns Promise<KnowledgeRecord[]> An array of matching records.\n     */\n    async searchKnowledge(query: string, userId: string, useSemanticSearch: boolean = false, language?: string, context?: any, limit: number = 100): Promise<KnowledgeRecord[]> {\n        console.log("]))[KnowledgeSync];
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
(_b = this.context.loggingService) === null || _b === void 0 ? void 0 : _b.logInfo('Attempting to search knowledge', { query: query, userId: userId, useSemanticSearch: useSemanticSearch, language: language, context: !!context, limit: limit });
if (!query || !userId) {
    console.warn('[KnowledgeSync] Search query and user ID are required.');
    (_c = this.context.loggingService) === null || _c === void 0 ? void 0 : _c.logWarning('Search query and user ID are required.');
    return [];
}
try {
    // Call the core MemoryEngine to perform the query
    // Pass the useSemanticSearch flag, language, context, AND limit to MemoryEngine
    var results = await this.memoryEngine.queryKnowledge(query, userId, useSemanticSearch, language, context, limit); // Pass useSemanticSearch, language, context, limit
    console.log("[KnowledgeSync] Search completed. Found ".concat(results.length, " results."));
    (_d = this.context.loggingService) === null || _d === void 0 ? void 0 : _d.logInfo("Knowledge search completed. Found ".concat(results.length, " results."), { query: query, userId: userId, useSemanticSearch: useSemanticSearch, language: language, context: !!context, limit: limit });
    return results;
}
catch (error) {
    console.error('[KnowledgeSync] Error searching knowledge:', error);
    (_e = this.context.loggingService) === null || _e === void 0 ? void 0 : _e.logError('Error searching knowledge', { query: query, userId: userId, useSemanticSearch: useSemanticSearch, language: language, context: !!context, limit: limit, error: error.message });
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
    console: console,
    : .log("[KnowledgeSync] Getting all knowledge for user: ".concat(userId)),
    this: (_f = .context.loggingService) === null || _f === void 0 ? void 0 : _f.logInfo('Attempting to get all knowledge', { userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[KnowledgeSync] User ID is required to get all knowledge.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('User ID is required to get all knowledge.');
        return [];
    },
    try: {
        // Call the core MemoryEngine to get all knowledge
        const: records = await this.memoryEngine.getAllKnowledgeForUser(userId),
        console: console,
        : .log("[KnowledgeSync] Fetched ".concat(records.length, " records.")),
        this: (_g = .context.loggingService) === null || _g === void 0 ? void 0 : _g.logInfo("Fetched ".concat(records.length, " records."), { userId: userId }),
        return: records
    },
    catch: function (error) {
        var _a;
        console.error('[KnowledgeSync] Error getting all knowledge:', error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Error getting all knowledge', { userId: userId, error: error.message });
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
    console: console,
    : .log("[KnowledgeSync] Attempting to update knowledge record ".concat(id, " for user: ").concat(userId), updates),
    this: (_h = .context.loggingService) === null || _h === void 0 ? void 0 : _h.logInfo("Attempting to update knowledge record ".concat(id), { id: id, updates: updates, userId: userId }),
    if: function (, id) { }
} || !userId || Object.keys(updates).length === 0;
{
    console.warn('[KnowledgeSync] Update failed: ID, user ID, and updates are required.');
    (_j = this.context.loggingService) === null || _j === void 0 ? void 0 : _j.logWarning('Update failed: ID, user ID, and updates are required.', { id: id, userId: userId, updates: updates });
    throw new Error('ID, user ID, and updates are required.');
}
try {
    // Call the core MemoryEngine to update the knowledge
    // Pass userId and updates (including is_starred, tags, language)
    var updatedRecord = await this.memoryEngine.updateKnowledge(id, updates, userId); // Pass userId
    if (updatedRecord) {
        console.log('[KnowledgeSync] Knowledge updated successfully:', updatedRecord.id);
        (_k = this.context.loggingService) === null || _k === void 0 ? void 0 : _k.logInfo('Knowledge updated successfully', { recordId: updatedRecord.id, userId: userId });
        // MemoryEngine publishes events and notifies SyncService (if configured)
    }
    else {
        console.warn('[KnowledgeSync] Failed to update knowledge via MemoryEngine (record not found or user mismatch).');
        (_l = this.context.loggingService) === null || _l === void 0 ? void 0 : _l.logWarning('Failed to update knowledge via MemoryEngine (record not found or user mismatch).', { recordId: id, userId: userId });
    }
    return updatedRecord;
}
catch (error) {
    console.error('[KnowledgeSync] Error updating knowledge:', error);
    (_m = this.context.loggingService) === null || _m === void 0 ? void 0 : _m.logError('Error updating knowledge', { recordId: id, userId: userId, error: error.message });
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
    console: console,
    : .log("[KnowledgeSync] Attempting to delete knowledge record ".concat(id, " for user: ").concat(userId)),
    this: (_o = .context.loggingService) === null || _o === void 0 ? void 0 : _o.logInfo("Attempting to delete knowledge record ".concat(id), { id: id, userId: userId }),
    if: function (, id) { }
} || !userId;
{
    console.warn('[KnowledgeSync] Delete failed: ID and user ID are required.');
    (_p = this.context.loggingService) === null || _p === void 0 ? void 0 : _p.logWarning('Delete failed: ID and user ID are required.', { id: id, userId: userId });
    throw new Error('ID and user ID are required.');
}
try {
    // Call the core MemoryEngine to delete the knowledge
    var success_1 = await this.memoryEngine.deleteKnowledge(id, userId); // Pass userId
    if (success_1) {
        console.log('[KnowledgeSync] Knowledge deleted successfully:', id);
        (_q = this.context.loggingService) === null || _q === void 0 ? void 0 : _q.logInfo('Knowledge deleted successfully', { recordId: id, userId: userId });
        // MemoryEngine publishes events and notifies SyncService (if configured)
    }
    else {
        console.warn('[KnowledgeSync] Failed to delete knowledge via MemoryEngine (record not found or user mismatch).');
        (_r = this.context.loggingService) === null || _r === void 0 ? void 0 : _r.logWarning('Failed to delete knowledge via MemoryEngine (record not found or user mismatch).', { recordId: id, userId: userId });
    }
    return success_1;
}
catch (error) {
    console.error('[KnowledgeSync] Error deleting knowledge:', error);
    (_s = this.context.loggingService) === null || _s === void 0 ? void 0 : _s.logError('Error deleting knowledge', { recordId: id, userId: userId, error: error.message });
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
    console: console,
    : .log("[KnowledgeSync] Getting recent dev logs for user: ".concat(userId, ", limit: ").concat(limit)),
    this: (_t = .context.loggingService) === null || _t === void 0 ? void 0 : _t.logInfo('Attempting to get recent dev logs', { userId: userId, limit: limit }),
    if: function (, userId) {
        var _a;
        console.warn('[KnowledgeSync] User ID is required to get recent dev logs.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('User ID is required to get recent dev logs.');
        return [];
    },
    try: {
        // Use MemoryEngine to query records by source and user ID
        // Note: MemoryEngine.queryKnowledge is for text search. We need a method to query by source.
        // Let's add a method to MemoryEngine or query directly here.
        // Querying directly here for simplicity in MVP.
        const: (_a = await this.context.apiProxy.supabaseClient
            .from('knowledge_records')
            .select('*')
            .eq('user_id', userId)
            .in('source', ['dev-log', 'dev-conversation']) // Filter by relevant sources
            .order('timestamp', { ascending: false }) // Order by newest first
            .limit(limit), data = _a.data, error = _a.error, _a),
        if: function (error) { throw error; },
        const: records = data,
        console: console,
        : .log("[KnowledgeSync] Fetched ".concat(records.length, " recent dev logs.")),
        this: (_u = .context.loggingService) === null || _u === void 0 ? void 0 : _u.logInfo("Fetched ".concat(records.length, " recent dev logs."), { userId: userId }),
        return: records
    },
    catch: function (error) {
        var _a;
        console.error('[KnowledgeSync] Error getting recent dev logs:', error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Error getting recent dev logs', { userId: userId, error: error.message });
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
    console: console,
    : .log('[KnowledgeSync] Attempting to create collection for user:', userId),
    this: (_v = .context.loggingService) === null || _v === void 0 ? void 0 : _v.logInfo('Attempting to create collection', { userId: userId, name: name, language: language }),
    if: function (, name) { }
} || !userId;
{
    console.error('[KnowledgeSync] Validation failed: Name and user ID are required.');
    (_w = this.context.loggingService) === null || _w === void 0 ? void 0 : _w.logError('Validation failed for creating collection', { userId: userId, name: name });
    throw new Error('Name and user ID are required.');
}
try {
    // Call the core MemoryEngine to create the collection
    var createdCollection = await this.memoryEngine.createCollection(name, userId, description, language);
    if (createdCollection) {
        console.log('[KnowledgeSync] Collection created successfully:', createdCollection.id);
        (_x = this.context.loggingService) === null || _x === void 0 ? void 0 : _x.logInfo('Collection created successfully', { collectionId: createdCollection.id, userId: userId });
        // MemoryEngine publishes events and notifies SyncService (if configured)
    }
    else {
        console.error('[KnowledgeSync] Failed to create collection via MemoryEngine.');
        (_y = this.context.loggingService) === null || _y === void 0 ? void 0 : _y.logError('Failed to create collection via MemoryEngine', { userId: userId, name: name });
    }
    return createdCollection;
}
catch (error) {
    console.error('[KnowledgeSync] Error creating collection:', error);
    (_z = this.context.loggingService) === null || _z === void 0 ? void 0 : _z.logError('Error creating collection', { userId: userId, name: name, error: error.message });
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
    console: console,
    : .log("[KnowledgeSync] Getting collections for user: ".concat(userId)),
    this: (_0 = .context.loggingService) === null || _0 === void 0 ? void 0 : _0.logInfo('Attempting to get collections', { userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[KnowledgeSync] User ID is required to get collections.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('User ID is required to get collections.');
        return [];
    },
    try: {
        // Call the core MemoryEngine to get collections
        const: collections = await this.memoryEngine.getCollections(userId),
        console: console,
        : .log("[KnowledgeSync] Fetched ".concat(collections.length, " collections.")),
        this: (_1 = .context.loggingService) === null || _1 === void 0 ? void 0 : _1.logInfo("Fetched ".concat(collections.length, " collections."), { userId: userId }),
        return: collections
    },
    catch: function (error) {
        var _a;
        console.error('[KnowledgeSync] Error getting collections:', error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Error getting collections', { userId: userId, error: error.message });
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
    console: console,
    : .log("[KnowledgeSync] Getting collection by ID: ".concat(collectionId, " for user: ").concat(userId)),
    this: (_2 = .context.loggingService) === null || _2 === void 0 ? void 0 : _2.logInfo('Attempting to get collection by ID', { collectionId: collectionId, userId: userId }),
    if: function (, collectionId) { }
} || !userId;
{
    console.warn('[KnowledgeSync] Collection ID and user ID are required.');
    (_3 = this.context.loggingService) === null || _3 === void 0 ? void 0 : _3.logWarning('Collection ID and user ID are required.', { collectionId: collectionId, userId: userId });
    return undefined;
}
try {
    // Call the core MemoryEngine to get the collection by ID
    var collection = await this.memoryEngine.getCollectionById(collectionId, userId);
    if (collection) {
        console.log("[KnowledgeSync] Fetched collection: ".concat(collection.id, "."));
        (_4 = this.context.loggingService) === null || _4 === void 0 ? void 0 : _4.logInfo("Fetched collection: ".concat(collection.id, "."), { collectionId: collectionId, userId: userId });
    }
    else {
        console.warn("[KnowledgeSync] Collection ".concat(collectionId, " not found or not accessible."));
        (_5 = this.context.loggingService) === null || _5 === void 0 ? void 0 : _5.logWarning("Collection not found or not accessible: ".concat(collectionId), { collectionId: collectionId, userId: userId });
    }
    return collection;
}
catch (error) {
    console.error("[KnowledgeSync] Error getting collection by ID ".concat(collectionId, ":"), error);
    (_6 = this.context.loggingService) === null || _6 === void 0 ? void 0 : _6.logError("Error getting collection by ID ".concat(collectionId), { collectionId: collectionId, userId: userId, error: error.message });
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
    console: console,
    : .log("[KnowledgeSync] Getting records in collection: ".concat(collectionId, " for user: ").concat(userId)),
    this: (_7 = .context.loggingService) === null || _7 === void 0 ? void 0 : _7.logInfo('Attempting to get records in collection', { collectionId: collectionId, userId: userId }),
    if: function (, collectionId) { }
} || !userId;
{
    console.warn('[KnowledgeSync] Collection ID and user ID are required.');
    (_8 = this.context.loggingService) === null || _8 === void 0 ? void 0 : _8.logWarning('Collection ID and user ID are required.', { collectionId: collectionId, userId: userId });
    return [];
}
try {
    // Call the core MemoryEngine to get records in the collection
    var records = await this.memoryEngine.getRecordsInCollection(collectionId, userId);
    console.log("[KnowledgeSync] Fetched ".concat(records.length, " records in collection ").concat(collectionId, "."));
    (_9 = this.context.loggingService) === null || _9 === void 0 ? void 0 : _9.logInfo("Fetched ".concat(records.length, " records in collection ").concat(collectionId, "."), { collectionId: collectionId, userId: userId });
    return records;
}
catch (error) {
    console.error("[KnowledgeSync] Error getting records in collection ".concat(collectionId, ":"), error);
    (_10 = this.context.loggingService) === null || _10 === void 0 ? void 0 : _10.logError("Error getting records in collection ".concat(collectionId), { collectionId: collectionId, userId: userId, error: error.message });
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
    console: console,
    : .log("[KnowledgeSync] Attempting to add record ".concat(recordId, " to collection ").concat(collectionId, " for user ").concat(userId)),
    this: (_11 = .context.loggingService) === null || _11 === void 0 ? void 0 : _11.logInfo('Attempting to add record to collection', { collectionId: collectionId, recordId: recordId, userId: userId }),
    if: function (, collectionId) { }
} || !recordId || !userId;
{
    console.warn('[KnowledgeSync] Collection ID, record ID, and user ID are required.');
    (_12 = this.context.loggingService) === null || _12 === void 0 ? void 0 : _12.logWarning('Collection ID, record ID, and user ID are required.', { collectionId: collectionId, recordId: recordId, userId: userId });
    throw new Error('Collection ID, record ID, and user ID are required.');
}
try {
    // Call the core MemoryEngine to add the record to the collection
    var result = await this.memoryEngine.addRecordToCollection(collectionId, recordId, userId);
    if (result) {
        console.log("[KnowledgeSync] Record ".concat(recordId, " added to collection ").concat(collectionId, "."));
        (_13 = this.context.loggingService) === null || _13 === void 0 ? void 0 : _13.logInfo('Record added to collection', { collectionId: collectionId, recordId: recordId, userId: userId });
        // MemoryEngine publishes events and notifies SyncService (if configured)
    }
    else {
        console.warn("[KnowledgeSync] Record ".concat(recordId, " was already in collection ").concat(collectionId, "."));
        (_14 = this.context.loggingService) === null || _14 === void 0 ? void 0 : _14.logWarning('Record already in collection', { collectionId: collectionId, recordId: recordId, userId: userId });
    }
    return result; // Returns the created join entry or null
}
catch (error) {
    console.error("[KnowledgeSync] Error adding record ".concat(recordId, " to collection ").concat(collectionId, ":"), error);
    (_15 = this.context.loggingService) === null || _15 === void 0 ? void 0 : _15.logError('Error adding record to collection', { collectionId: collectionId, recordId: recordId, userId: userId, error: error.message });
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
    console: console,
    : .log("[KnowledgeSync] Attempting to remove record ".concat(recordId, " from collection ").concat(collectionId, " for user ").concat(userId)),
    this: (_16 = .context.loggingService) === null || _16 === void 0 ? void 0 : _16.logInfo('Attempting to remove record from collection', { collectionId: collectionId, recordId: recordId, userId: userId }),
    if: function (, collectionId) { }
} || !recordId || !userId;
{
    console.warn('[KnowledgeSync] Collection ID, record ID, and user ID are required.');
    (_17 = this.context.loggingService) === null || _17 === void 0 ? void 0 : _17.logWarning('Collection ID, record ID, and user ID are required.', { collectionId: collectionId, recordId: recordId, userId: userId });
    throw new Error('Collection ID, record ID, and user ID are required.');
}
try {
    // Call the core MemoryEngine to remove the record from the collection
    var success_2 = await this.memoryEngine.removeRecordFromCollection(collectionId, recordId, userId);
    if (success_2) {
        console.log("[KnowledgeSync] Record ".concat(recordId, " removed from collection ").concat(collectionId, "."));
        (_18 = this.context.loggingService) === null || _18 === void 0 ? void 0 : _18.logInfo('Record removed from collection', { collectionId: collectionId, recordId: recordId, userId: userId });
        // MemoryEngine publishes events and notifies SyncService (if configured)
    }
    else {
        console.warn("[KnowledgeSync] Record ".concat(recordId, " not found in collection ").concat(collectionId, " or not accessible."));
        (_19 = this.context.loggingService) === null || _19 === void 0 ? void 0 : _19.logWarning('Record not found in collection or not accessible', { collectionId: collectionId, recordId: recordId, userId: userId });
    }
    return success_2;
}
catch (error) {
    console.error("[KnowledgeSync] Error removing record ".concat(recordId, " from collection ").concat(collectionId, ":"), error);
    (_20 = this.context.loggingService) === null || _20 === void 0 ? void 0 : _20.logError('Error removing record from collection', { collectionId: collectionId, recordId: recordId, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
""(__makeTemplateObject([""], [""]));
