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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a, _b, _c, _d, _e, _f, _g;
var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60;
var _this = this;
""(__makeTemplateObject(["typescript\n// src/core/memory/MemoryEngine.ts\n// \u6C38\u4E45\u8A18\u61B6\u4E2D\u5FC3 (Long-term Memory Engine) - \u6838\u5FC3\u6A21\u7D44\n// Manages the persistence, retrieval, updating, and deletion of core data types\n// like Knowledge Records, Collections, Glossary Terms, and Knowledge Relations.\n// Interacts directly with the database (Supabase).\n// Part of the Long-term Memory pillar and the Bidirectional Sync Domain (\u96D9\u5410\u540C\u6B65\u9818\u57DF).\n// Design Principle: Provides a reliable and structured storage layer for user data.\n// --- Modified: Implement CRUD for Knowledge Records --\n// --- Modified: Implement CRUD for Knowledge Collections --\n// --- Modified: Implement CRUD for Knowledge Collection Records (Join Table) --\n// --- Modified: Implement CRUD for Glossary Terms --\n// --- Modified: Implement CRUD for Knowledge Relations --\n// --- Modified: Add interaction with RAG Indexer for embeddings --\n// --- New: Implement Realtime Subscriptions for all relevant tables --\n// --- Modified: Add language parameter to relevant methods and DB operations --\n// --- Modified: Implement updateCollection and deleteCollection methods --\n// --- Modified: Implement updateTerm and deleteTerm methods --\n// --- Modified: Implement updateRelation method --\n\n\nimport { SupabaseClient } from '@supabase/supabase-js';\nimport { SystemContext, KnowledgeRecord, GlossaryTerm, KnowledgeCollection, KnowledgeRelation } from '../../interfaces';\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n// import { RAGIndexer } from '../../rag/indexer'; // Access via requestAgent\n\n\nexport class MemoryEngine {\n    private context: SystemContext;\n    private supabase: SupabaseClient;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n    // private ragIndexer: RAGIndexer; // Access via requestAgent\n\n    // --- New: Realtime Subscriptions ---\n    // Store subscriptions per table to manage them.\n    private realtimeSubscriptions: Map<string, any> = new Map();\n    // --- End New ---\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        console.log('MemoryEngine initialized.');\n\n        // --- New: Set up Supabase Realtime subscriptions for relevant tables ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToTableUpdates('knowledge_records', user.id);\n                this.subscribeToTableUpdates('knowledge_collections', user.id);\n                this.subscribeToTableUpdates('knowledge_collection_records', user.id);\n                this.subscribeToTableUpdates('glossary', user.id);\n                this.subscribeToTableUpdates('knowledge_relations', user.id);\n                // TODO: Subscribe to other relevant tables if they are part of MemoryEngine's domain\n            } else {\n                this.unsubscribeFromAllTableUpdates();\n            }\n        });\n        // --- End New ---\n    }\n\n    // --- New: Realtime Subscription Methods ---\n    /**\n     * Subscribes to real-time updates from a specific table for the current user (user-owned and public).\n     * @param table The name of the table to subscribe to. Required.\n     * @param userId The user ID to filter updates by. Required.\n     */\n    private subscribeToTableUpdates(table: string, userId: string): void {\n        console.log("], ["typescript\n// src/core/memory/MemoryEngine.ts\n// \\u6c38\\u4e45\\u8a18\\u61b6\\u4e2d\\u5fc3 (Long-term Memory Engine) - \\u6838\\u5fc3\\u6a21\\u7d44\n// Manages the persistence, retrieval, updating, and deletion of core data types\n// like Knowledge Records, Collections, Glossary Terms, and Knowledge Relations.\n// Interacts directly with the database (Supabase).\n// Part of the Long-term Memory pillar and the Bidirectional Sync Domain (\\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df).\n// Design Principle: Provides a reliable and structured storage layer for user data.\n// --- Modified: Implement CRUD for Knowledge Records --\n// --- Modified: Implement CRUD for Knowledge Collections --\n// --- Modified: Implement CRUD for Knowledge Collection Records (Join Table) --\n// --- Modified: Implement CRUD for Glossary Terms --\n// --- Modified: Implement CRUD for Knowledge Relations --\n// --- Modified: Add interaction with RAG Indexer for embeddings --\n// --- New: Implement Realtime Subscriptions for all relevant tables --\n// --- Modified: Add language parameter to relevant methods and DB operations --\n// --- Modified: Implement updateCollection and deleteCollection methods --\n// --- Modified: Implement updateTerm and deleteTerm methods --\n// --- Modified: Implement updateRelation method --\n\n\nimport { SupabaseClient } from '@supabase/supabase-js';\nimport { SystemContext, KnowledgeRecord, GlossaryTerm, KnowledgeCollection, KnowledgeRelation } from '../../interfaces';\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n// import { RAGIndexer } from '../../rag/indexer'; // Access via requestAgent\n\n\nexport class MemoryEngine {\n    private context: SystemContext;\n    private supabase: SupabaseClient;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n    // private ragIndexer: RAGIndexer; // Access via requestAgent\n\n    // --- New: Realtime Subscriptions ---\n    // Store subscriptions per table to manage them.\n    private realtimeSubscriptions: Map<string, any> = new Map();\n    // --- End New ---\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        console.log('MemoryEngine initialized.');\n\n        // --- New: Set up Supabase Realtime subscriptions for relevant tables ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToTableUpdates('knowledge_records', user.id);\n                this.subscribeToTableUpdates('knowledge_collections', user.id);\n                this.subscribeToTableUpdates('knowledge_collection_records', user.id);\n                this.subscribeToTableUpdates('glossary', user.id);\n                this.subscribeToTableUpdates('knowledge_relations', user.id);\n                // TODO: Subscribe to other relevant tables if they are part of MemoryEngine's domain\n            } else {\n                this.unsubscribeFromAllTableUpdates();\n            }\n        });\n        // --- End New ---\n    }\n\n    // --- New: Realtime Subscription Methods ---\n    /**\n     * Subscribes to real-time updates from a specific table for the current user (user-owned and public).\n     * @param table The name of the table to subscribe to. Required.\n     * @param userId The user ID to filter updates by. Required.\n     */\n    private subscribeToTableUpdates(table: string, userId: string): void {\n        console.log("]))[MemoryEngine];
Subscribing;
to;
$;
{
    table;
}
realtime;
updates;
for (user; ; )
    : $;
{
    userId;
}
");\n        this.context.loggingService?.logInfo(";
Subscribing;
to;
$;
{
    table;
}
realtime;
updates(__makeTemplateObject([", { userId, table });\n\n        if (this.realtimeSubscriptions.has(table)) {\n            console.warn("], [", { userId, table });\n\n        if (this.realtimeSubscriptions.has(table)) {\n            console.warn("]))[MemoryEngine];
Already;
subscribed;
to;
$;
{
    table;
}
updates.Unsubscribing;
existing.(__makeTemplateObject([");\n            this.unsubscribeFromTableUpdates(table);\n        }\n\n        // Subscribe to changes where user_id is null (public) OR user_id is the current user.\n        // RLS should ensure user only receives updates for data they can see.\n        // We subscribe to all changes on the table and rely on RLS filtering.\n        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.\n        // Let's switch to subscribing to the table name channel and rely entirely on RLS.\n\n        const subscription = this.supabase\n            .channel(table) // Subscribe to all changes on the table\n            .on('postgres_changes', { event: '*', schema: 'public', table: table }, async (payload) => { // No filter here, rely on RLS\n                console.log("], [");\n            this.unsubscribeFromTableUpdates(table);\n        }\n\n        // Subscribe to changes where user_id is null (public) OR user_id is the current user.\n        // RLS should ensure user only receives updates for data they can see.\n        // We subscribe to all changes on the table and rely on RLS filtering.\n        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.\n        // Let's switch to subscribing to the table name channel and rely entirely on RLS.\n\n        const subscription = this.supabase\n            .channel(table) // Subscribe to all changes on the table\n            .on('postgres_changes', { event: '*', schema: 'public', table: table }, async (payload) => { // No filter here, rely on RLS\n                console.log("]))[MemoryEngine];
Realtime;
$;
{
    table;
}
change;
received: ", payload);\n                const record = payload.new as any; // New data for INSERT/UPDATE\n                const oldRecord = payload.old as any; // Old data for UPDATE/DELETE\n                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\n\n                // Check if the change is relevant to the current user (user-owned or public)\n                // RLS should handle this, but client-side check adds safety.\n                // This check depends on the table structure (does it have user_id and is_public?)\n                // For simplicity, assume relevant if user_id matches or is_public is true (if applicable)\n                const relevantRecord = record || oldRecord;\n                const isRelevant = relevantRecord?.user_id === userId || relevantRecord?.is_public === true; // Simplified check\n\n\n                if (isRelevant) {\n                    console.log("[MemoryEngine];
Processing;
relevant;
$;
{
    table;
}
change($, { eventType: eventType });
$;
{
    relevantRecord.id;
}
");\n\n                    // Publish an event via EventBus for other modules/UI to react\n                    // Include the user_id in the event payload for filtering\n                    this.context.eventBus?.publish(";
$;
{
    table;
}
_$;
{
    eventType.toLowerCase();
}
", record || oldRecord, userId); // e.g., 'knowledge_records_insert', 'glossary_update'\n\n                    // --- New: Notify SyncService about remote change ---\n                    // This is the primary way SyncService learns about changes from other devices.\n                    this.context.syncService?.handleRemoteDataChange(table, eventType, record || oldRecord, userId)\n                         .catch((syncError: any) => console.error(";
Error;
notifying;
SyncService;
for (remote; $; { table: table })
    change: ", syncError));\n                    // --- End New ---\n\n                    // --- New: Trigger RAG Indexing for relevant changes ---\n                    // Only index INSERTs and UPDATEs for data types that have embeddings.\n                    const indexableDataTypes = ['knowledge_records', 'tasks', 'goals', 'user_actions']; // Tables with embeddings\n                    if ((eventType === 'INSERT' || eventType === 'UPDATE') && indexableDataTypes.includes(table)) {\n                         console.log("[MemoryEngine];
Triggering;
RAG;
indexing;
for ($; { table: table }; record)
    $;
{
    record.id;
}
");\n                         // Send a message to the RAGIndexer Agent\n                         if (this.context.agentFactory?.getAgent('rag_indexer')) {\n                             this.context.messageBus?.send({\n                                 type: 'index_record', // Message type for RAGIndexer\n                                 payload: { dataType: table.replace(/s$/, ''), record: record }, // Pass data type (singular) and the record\n                                 recipient: 'rag_indexer', // Target the RAGIndexer Agent\n                                 sender: 'memory_engine', // Identify the sender\n                             });\n                         } else {\n                             console.warn('[MemoryEngine] RAGIndexer Agent not available. Cannot trigger indexing for new record.');\n                         }\n                    }\n                    // --- End New ---\n\n                } else {\n                    console.log("[MemoryEngine];
Received;
$;
{
    table;
}
change;
not;
relevant;
to;
current;
user(filtered, by, RLS, or, client - side).(__makeTemplateObject([");\n                }\n            })\n            .subscribe((status, err) => {\n                 console.log("], [");\n                }\n            })\n            .subscribe((status, err) => {\n                 console.log("]))[MemoryEngine];
$;
{
    table;
}
subscription;
status: ", status);\n                 if (status === 'CHANNEL_ERROR') {\n                     console.error("[MemoryEngine];
$;
{
    table;
}
subscription;
error: ", err);\n                     this.context.loggingService?.logError(";
$;
{
    table;
}
subscription;
error(__makeTemplateObject([", { userId, table, error: err?.message });\n                 }\n            });\n\n        this.realtimeSubscriptions.set(table, subscription);\n    }\n\n    /**\n     * Unsubscribes from real-time updates for a specific table.\n     * @param table The name of the table to unsubscribe from. Required.\n     */\n    private unsubscribeFromTableUpdates(table: string): void {\n        const subscription = this.realtimeSubscriptions.get(table);\n        if (subscription) {\n            console.log("], [", { userId, table, error: err?.message });\n                 }\n            });\n\n        this.realtimeSubscriptions.set(table, subscription);\n    }\n\n    /**\n     * Unsubscribes from real-time updates for a specific table.\n     * @param table The name of the table to unsubscribe from. Required.\n     */\n    private unsubscribeFromTableUpdates(table: string): void {\n        const subscription = this.realtimeSubscriptions.get(table);\n        if (subscription) {\n            console.log("]))[MemoryEngine];
Unsubscribing;
from;
$;
{
    table;
}
realtime;
updates.(__makeTemplateObject([");\n            this.context.loggingService?.logInfo("], [");\n            this.context.loggingService?.logInfo("]));
Unsubscribing;
from;
$;
{
    table;
}
realtime;
updates(__makeTemplateObject([", { table });\n            this.supabase.removeChannel(subscription);\n            this.realtimeSubscriptions.delete(table);\n        }\n    }\n\n    /**\n     * Unsubscribes from all active real-time updates.\n     */\n    private unsubscribeFromAllTableUpdates(): void {\n        console.log('[MemoryEngine] Unsubscribing from all realtime updates.');\n        this.context.loggingService?.logInfo('Unsubscribing from all realtime updates');\n        this.realtimeSubscriptions.forEach((_, table) => {\n            this.unsubscribeFromTableUpdates(table);\n        });\n    }\n    // --- End New ---\n\n\n    // --- Knowledge Record CRUD (\u77E5\u8B58\u8A18\u9304) ---\n    /**\n     * Records a new knowledge record in Supabase.\n     * @param question The question part. Required.\n     * @param answer The answer part. Required.\n     * @param userId The user ID to associate the record with. Required.\n     * @param source Optional source of the knowledge.\n     * @param devLogDetails Optional JSONB for dev log details.\n     * @param isStarred Optional: Whether to star the record. Defaults to false.\n     * @param tags Optional tags.\n     * @param language Optional: Language of the content. Defaults to user preference or system default.\n     * @returns Promise<KnowledgeRecord | null> The created KnowledgeRecord or null on failure.\n     * Privacy Note: Knowledge Records are stored with a user_id and are subject to Row Level Security (RLS)\n     * policies in Supabase, ensuring users can only access their own data.\n     */\n    async recordKnowledge(question: string, answer: string, userId: string, source?: string, devLogDetails?: any, isStarred: boolean = false, tags?: string[], language?: string): Promise<KnowledgeRecord | null> {\n        console.log('[MemoryEngine] Recording knowledge for user:', userId);\n        this.context.loggingService?.logInfo('Attempting to record knowledge', { userId, source, isStarred, tags, language });\n\n        if (!userId || !question || !answer) {\n            console.error('[MemoryEngine] Cannot record knowledge: User ID, question, and answer are required.');\n            this.context.loggingService?.logError('Cannot record knowledge: Missing required fields.', { userId });\n            throw new Error('User ID, question, and answer are required to record knowledge.');\n        }\n\n        const contentLanguage = language || this.context.currentUser?.language_preference || 'en'; // Default to English if no preference\n\n        const newRecordData: Omit<KnowledgeRecord, 'id' | 'timestamp' | 'embedding_vector'> = {\n            question,\n            answer,\n            user_id: userId, // Associate with user\n            source: source || null, // Use null if source is undefined\n            tags: tags || [], // Ensure tags is an array\n            dev_log_details: devLogDetails || null, // Use null if devLogDetails is undefined\n            is_starred: isStarred,\n            language: contentLanguage, // Store the language\n            // timestamp is set by the database default\n            // embedding_vector is generated and updated asynchronously by RAG Indexer\n        };\n\n        try {\n            // Insert into Supabase (Supports Bidirectional Sync Domain)\n            const { data, error } = await this.supabase\n                .from('knowledge_records')\n                .insert([newRecordData])\n                .select() // Select the inserted data to get the generated ID and timestamp\n                .single(); // Expecting a single record back\n\n            if (error) {\n                console.error('Error recording knowledge to Supabase:', error);\n                this.context.loggingService?.logError('Failed to record knowledge', { userId: userId, error: error.message });\n                throw error; // Re-throw the error\n            }\n\n            const createdRecord = data as KnowledgeRecord;\n            console.log('Knowledge recorded:', createdRecord.id, '-', createdRecord.question, 'for user:', createdRecord.user_id, 'Language:', createdRecord.language);\n\n            // --- New: Trigger RAG Indexing for the new record ---\n            // Send a message to the RAGIndexer Agent asynchronously.\n            if (this.context.agentFactory?.getAgent('rag_indexer')) {\n                this.context.messageBus?.send({\n                    type: 'index_record', // Message type for RAGIndexer\n                    payload: { dataType: 'knowledge_record', record: createdRecord }, // Pass data type and the created record\n                    recipient: 'rag_indexer', // Target the RAGIndexer Agent\n                    sender: 'memory_engine', // Identify the sender\n                });\n            } else {\n                console.warn('[MemoryEngine] RAGIndexer Agent not available. Cannot trigger indexing for new record.');\n            }\n            // --- End New ---\n\n            // Publish a 'knowledge_record_created' event via EventBus (Supports Event Push - call context.eventBus.publish)\n            // The Realtime subscription will also publish events, so be careful not to duplicate processing.\n            // For now, let's rely on the Realtime subscription to be the source of events for UI updates.\n            this.context.eventBus?.publish('knowledge_record_created', createdRecord, userId); // Include userId in event\n\n            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly\n            // this.context.syncService?.handleLocalDataChange('memoryEngine', 'INSERT', createdRecord, userId)\n            //     .catch(syncError => console.error('Error notifying SyncService for KnowledgeRecord insert:', syncError));\n\n\n            return createdRecord;\n\n        } catch (error: any) {\n            console.error('Failed to record knowledge:', error);\n            this.context.loggingService?.logError('Failed to record knowledge', { userId: userId, error: error.message });\n            return null; // Return null on failure\n        }\n    }\n\n    /**\n     * Retrieves knowledge records for a specific user from Supabase.\n     * Can perform keyword or semantic search.\n     * @param query The search query. Required.\n     * @param userId The user ID. Required.\n     * @param useSemanticSearch Optional: Whether to use semantic search. Defaults to false.\n     * @param language Optional: Filter results by language. Defaults to undefined (all languages).\n     * @param context Optional: Contextual information for the query (e.g., conversation history, current page).\n     * @param limit Optional: Maximum number of results to return. Defaults to 100.\n     * @returns Promise<KnowledgeRecord[]> An array of matching records.\n     */\n    async queryKnowledge(query: string, userId: string, useSemanticSearch: boolean = false, language?: string, context?: any, limit: number = 100): Promise<KnowledgeRecord[]> {\n        console.log("], [", { table });\n            this.supabase.removeChannel(subscription);\n            this.realtimeSubscriptions.delete(table);\n        }\n    }\n\n    /**\n     * Unsubscribes from all active real-time updates.\n     */\n    private unsubscribeFromAllTableUpdates(): void {\n        console.log('[MemoryEngine] Unsubscribing from all realtime updates.');\n        this.context.loggingService?.logInfo('Unsubscribing from all realtime updates');\n        this.realtimeSubscriptions.forEach((_, table) => {\n            this.unsubscribeFromTableUpdates(table);\n        });\n    }\n    // --- End New ---\n\n\n    // --- Knowledge Record CRUD (\\u77e5\\u8b58\\u8a18\\u9304) ---\n    /**\n     * Records a new knowledge record in Supabase.\n     * @param question The question part. Required.\n     * @param answer The answer part. Required.\n     * @param userId The user ID to associate the record with. Required.\n     * @param source Optional source of the knowledge.\n     * @param devLogDetails Optional JSONB for dev log details.\n     * @param isStarred Optional: Whether to star the record. Defaults to false.\n     * @param tags Optional tags.\n     * @param language Optional: Language of the content. Defaults to user preference or system default.\n     * @returns Promise<KnowledgeRecord | null> The created KnowledgeRecord or null on failure.\n     * Privacy Note: Knowledge Records are stored with a user_id and are subject to Row Level Security (RLS)\n     * policies in Supabase, ensuring users can only access their own data.\n     */\n    async recordKnowledge(question: string, answer: string, userId: string, source?: string, devLogDetails?: any, isStarred: boolean = false, tags?: string[], language?: string): Promise<KnowledgeRecord | null> {\n        console.log('[MemoryEngine] Recording knowledge for user:', userId);\n        this.context.loggingService?.logInfo('Attempting to record knowledge', { userId, source, isStarred, tags, language });\n\n        if (!userId || !question || !answer) {\n            console.error('[MemoryEngine] Cannot record knowledge: User ID, question, and answer are required.');\n            this.context.loggingService?.logError('Cannot record knowledge: Missing required fields.', { userId });\n            throw new Error('User ID, question, and answer are required to record knowledge.');\n        }\n\n        const contentLanguage = language || this.context.currentUser?.language_preference || 'en'; // Default to English if no preference\n\n        const newRecordData: Omit<KnowledgeRecord, 'id' | 'timestamp' | 'embedding_vector'> = {\n            question,\n            answer,\n            user_id: userId, // Associate with user\n            source: source || null, // Use null if source is undefined\n            tags: tags || [], // Ensure tags is an array\n            dev_log_details: devLogDetails || null, // Use null if devLogDetails is undefined\n            is_starred: isStarred,\n            language: contentLanguage, // Store the language\n            // timestamp is set by the database default\n            // embedding_vector is generated and updated asynchronously by RAG Indexer\n        };\n\n        try {\n            // Insert into Supabase (Supports Bidirectional Sync Domain)\n            const { data, error } = await this.supabase\n                .from('knowledge_records')\n                .insert([newRecordData])\n                .select() // Select the inserted data to get the generated ID and timestamp\n                .single(); // Expecting a single record back\n\n            if (error) {\n                console.error('Error recording knowledge to Supabase:', error);\n                this.context.loggingService?.logError('Failed to record knowledge', { userId: userId, error: error.message });\n                throw error; // Re-throw the error\n            }\n\n            const createdRecord = data as KnowledgeRecord;\n            console.log('Knowledge recorded:', createdRecord.id, '-', createdRecord.question, 'for user:', createdRecord.user_id, 'Language:', createdRecord.language);\n\n            // --- New: Trigger RAG Indexing for the new record ---\n            // Send a message to the RAGIndexer Agent asynchronously.\n            if (this.context.agentFactory?.getAgent('rag_indexer')) {\n                this.context.messageBus?.send({\n                    type: 'index_record', // Message type for RAGIndexer\n                    payload: { dataType: 'knowledge_record', record: createdRecord }, // Pass data type and the created record\n                    recipient: 'rag_indexer', // Target the RAGIndexer Agent\n                    sender: 'memory_engine', // Identify the sender\n                });\n            } else {\n                console.warn('[MemoryEngine] RAGIndexer Agent not available. Cannot trigger indexing for new record.');\n            }\n            // --- End New ---\n\n            // Publish a 'knowledge_record_created' event via EventBus (Supports Event Push - call context.eventBus.publish)\n            // The Realtime subscription will also publish events, so be careful not to duplicate processing.\n            // For now, let's rely on the Realtime subscription to be the source of events for UI updates.\n            this.context.eventBus?.publish('knowledge_record_created', createdRecord, userId); // Include userId in event\n\n            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly\n            // this.context.syncService?.handleLocalDataChange('memoryEngine', 'INSERT', createdRecord, userId)\n            //     .catch(syncError => console.error('Error notifying SyncService for KnowledgeRecord insert:', syncError));\n\n\n            return createdRecord;\n\n        } catch (error: any) {\n            console.error('Failed to record knowledge:', error);\n            this.context.loggingService?.logError('Failed to record knowledge', { userId: userId, error: error.message });\n            return null; // Return null on failure\n        }\n    }\n\n    /**\n     * Retrieves knowledge records for a specific user from Supabase.\n     * Can perform keyword or semantic search.\n     * @param query The search query. Required.\n     * @param userId The user ID. Required.\n     * @param useSemanticSearch Optional: Whether to use semantic search. Defaults to false.\n     * @param language Optional: Filter results by language. Defaults to undefined (all languages).\n     * @param context Optional: Contextual information for the query (e.g., conversation history, current page).\n     * @param limit Optional: Maximum number of results to return. Defaults to 100.\n     * @returns Promise<KnowledgeRecord[]> An array of matching records.\n     */\n    async queryKnowledge(query: string, userId: string, useSemanticSearch: boolean = false, language?: string, context?: any, limit: number = 100): Promise<KnowledgeRecord[]> {\n        console.log("]))[MemoryEngine];
Querying;
knowledge;
for (user; ; )
    : $;
{
    userId;
}
with (query)
    : ;
"${query}\" (Semantic: ${useSemanticSearch}, Language: ${language || 'all'}, Context: ${context ? 'present' : 'absent'}, Limit: ${limit})`);;
(_h = this.context.loggingService) === null || _h === void 0 ? void 0 : _h.logInfo('Attempting to query knowledge', { query: query, userId: userId, useSemanticSearch: useSemanticSearch, language: language, context: !!context, limit: limit });
if (!userId || !query) {
    console.warn('[MemoryEngine] Search query and user ID are required.');
    (_j = this.context.loggingService) === null || _j === void 0 ? void 0 : _j.logWarning('Search query and user ID are required.');
    return [];
}
try {
    var dbQuery = void 0;
    if (useSemanticSearch) {
        // --- New: Perform semantic search using vector similarity ---
        // Requires the 'embedding_vector' column and 'pgvector' extension.
        // Need to generate an embedding for the query first.
        if (!((_k = this.context.agentFactory) === null || _k === void 0 ? void 0 : _k.getAgent('wisdom'))) {
            console.warn('[MemoryEngine] WisdomAgent not available for embedding generation. Falling back to keyword search.');
            useSemanticSearch = false; // Fallback
        }
        else {
            console.log('[MemoryEngine] Requesting query embedding from WisdomAgent for semantic search...');
            var embeddingResponse = await this.context.agentFactory.getAgent('wisdom').requestAgent('wisdom', // Target the WisdomAgent
            'generate_embedding', // Message type for WisdomAgent
            { text: query }, // Pass query text
            10000 // Timeout
            );
            if (!embeddingResponse.success || !Array.isArray(embeddingResponse.data)) {
                console.warn('[MemoryEngine] Failed to generate embedding for query. Falling back to keyword search.');
                (_l = this.context.loggingService) === null || _l === void 0 ? void 0 : _l.logWarning('Failed to generate embedding for query. Falling back to keyword search.', { userId: userId, query: query, error: embeddingResponse.error });
                useSemanticSearch = false; // Fallback
            }
            else {
                var queryEmbedding = embeddingResponse.data;
                // Perform vector similarity search using the '<=>' operator (cosine distance)
                dbQuery = this.supabase
                    .from('knowledge_records')
                    .select('*')
                    .eq('user_id', userId) // Filter by user ID (RLS should also enforce this)
                    .order('embedding_vector <=> ' + JSON.stringify(queryEmbedding), { ascending: true }); // Order by cosine distance (lower is better)
                // Add language filter if specified (applies to the record's language)
                if (language) {
                    dbQuery = dbQuery.eq('language', language);
                }
                dbQuery = dbQuery.limit(limit); // Apply limit
                // Execute the query
                var _61 = await dbQuery, data_1 = _61.data, error_1 = _61.error;
                if (error_1)
                    throw error_1;
                var records_1 = data_1;
                console.log("[MemoryEngine] Semantic search completed. Found ".concat(records_1.length, " results."));
                (_m = this.context.loggingService) === null || _m === void 0 ? void 0 : _m.logInfo("Semantic search completed. Found ".concat(records_1.length, " results."), { userId: userId, query: query, language: language, limit: limit });
                return records_1; // Return results from semantic search
            }
        }
        // --- End New ---
    }
    // Fallback to Keyword Search if semantic search is not used or failed
    console.log('[MemoryEngine] Performing keyword search...');
    dbQuery = this.supabase
        .from('knowledge_records')
        .select('*')
        .eq('user_id', userId); // Filter by user ID
    // Add language filter if specified
    if (language) {
        dbQuery = dbQuery.eq('language', language);
    }
    // Use full-text search on question and answer columns
    dbQuery = dbQuery.textSearch('fts', query); // Assuming FTS index 'fts' on question || ' ' || answer
    dbQuery = dbQuery.order('timestamp', { ascending: false }) // Order by newest first
        .limit(limit); // Apply limit
    var _62 = await dbQuery, data_2 = _62.data, error_2 = _62.error;
    if (error_2)
        throw error_2;
    var records = data_2;
    console.log("[MemoryEngine] Keyword search completed. Found ".concat(records.length, " results."));
    (_o = this.context.loggingService) === null || _o === void 0 ? void 0 : _o.logInfo("Keyword search completed. Found ".concat(records.length, " results."), { userId: userId, query: query, language: language, limit: limit });
    return records;
}
catch (error) {
    console.error('[MemoryEngine] Error querying knowledge:', error);
    (_p = this.context.loggingService) === null || _p === void 0 ? void 0 : _p.logError('Error querying knowledge', { query: query, userId: userId, useSemanticSearch: useSemanticSearch, language: language, context: !!context, limit: limit, error: error.message });
    throw error; // Re-throw the error
}
/**
* Fetches all knowledge records for a specific user from Supabase.
* @param userId The user ID. Required.
* @returns Promise<KnowledgeRecord[]> An array of all records for the user.
*/
async;
getAllKnowledgeForUser(userId, string);
Promise < KnowledgeRecord[] > {
    console: console,
    : .log("[MemoryEngine] Getting all knowledge for user: ".concat(userId)),
    this: (_q = .context.loggingService) === null || _q === void 0 ? void 0 : _q.logInfo('Attempting to get all knowledge', { userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[MemoryEngine] User ID is required to get all knowledge.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('User ID is required to get all knowledge.');
        return [];
    },
    try: {
        // Fetch all records from Supabase, filtered by user_id
        const: (_a = await this.supabase
            .from('knowledge_records')
            .select('*')
            .eq('user_id', userId)
            .order('timestamp', { ascending: false }), data = _a.data, error = _a.error, _a), // Order by newest first
        if: function (error) { },
        throw: error,
        const: records = data,
        console: console,
        : .log("[MemoryEngine] Fetched ".concat(records.length, " records.")),
        this: (_r = .context.loggingService) === null || _r === void 0 ? void 0 : _r.logInfo("Fetched ".concat(records.length, " records."), { userId: userId }),
        return: records
    },
    catch: function (error) {
        var _a;
        console.error('[MemoryEngine] Error getting all knowledge:', error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Error getting all knowledge', { userId: userId, error: error.message });
        throw error; // Re-throw the error
    }
};
/**
 * Updates an existing knowledge record in Supabase.
 * @param id The ID of the record. Required.
 * @param updates The updates to apply (question, answer, source, tags, is_starred, dev_log_details, language). Required.
 * @param userId The user ID for verification (checks ownership). Required.
 * @returns Promise<KnowledgeRecord | undefined> The updated KnowledgeRecord or undefined if not found or user mismatch.
 * Privacy Note: RLS policies ensure users can only update their own records.
 */
async;
updateKnowledge(id, string, updates, (Partial), userId, string);
Promise < KnowledgeRecord | undefined > {
    console: console,
    : .log("[MemoryEngine] Updating knowledge record ".concat(id, " for user: ").concat(userId), updates),
    this: (_s = .context.loggingService) === null || _s === void 0 ? void 0 : _s.logInfo("Attempting to update knowledge record ".concat(id), { id: id, updates: updates, userId: userId }),
    if: function (, id) { }
} || !userId || Object.keys(updates).length === 0;
{
    console.warn('[MemoryEngine] Update failed: ID, user ID, and updates are required.');
    (_t = this.context.loggingService) === null || _t === void 0 ? void 0 : _t.logWarning('Update failed: ID, user ID, and updates are required.', { id: id, userId: userId, updates: updates });
    throw new Error('ID, user ID, and updates are required.');
}
// Ensure language is included if updating content fields
if ((updates.question || updates.answer) && !updates.language) {
    updates.language = ((_u = this.context.currentUser) === null || _u === void 0 ? void 0 : _u.language_preference) || 'en';
}
try {
    // Persist update to Supabase (Supports Bidirectional Sync Domain)
    // Filter by ID and user_id to ensure ownership
    var _63 = await this.supabase
        .from('knowledge_records')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId) // Ensure ownership
        .select() // Select updated record data
        .single(), data_3 = _63.data, error_3 = _63.error; // Expecting a single record back
    if (error_3)
        throw error_3;
    if (!data_3) { // Should not happen if RLS is correct and ID/user_id match
        console.warn("Knowledge record ".concat(id, " not found or does not belong to user ").concat(userId, " for update."));
        (_v = this.context.loggingService) === null || _v === void 0 ? void 0 : _v.logWarning("Knowledge record not found or user mismatch for update: ".concat(id), { userId: userId });
        return undefined;
    }
    var updatedRecord = data_3;
    console.log("Knowledge record ".concat(id, " updated in Supabase. Language: ").concat(updatedRecord.language));
    // --- New: Trigger RAG Indexing for the updated record if content changed ---
    // Check if question, answer, or tags were updated.
    // This requires comparing old and new values, which is complex here.
    // For simplicity, trigger indexing on ANY update for MVP.
    console.log("[MemoryEngine] Triggering RAG indexing for updated record: ".concat(updatedRecord.id, "."));
    if ((_w = this.context.agentFactory) === null || _w === void 0 ? void 0 : _w.getAgent('rag_indexer')) {
        (_x = this.context.messageBus) === null || _x === void 0 ? void 0 : _x.send({
            type: 'index_record', // Message type for RAGIndexer
            payload: { dataType: 'knowledge_record', record: updatedRecord }, // Pass data type and the updated record
            recipient: 'rag_indexer', // Target the RAGIndexer Agent
            sender: 'memory_engine', // Identify the sender
        });
    }
    else {
        console.warn('[MemoryEngine] RAGIndexer Agent not available. Cannot trigger indexing for updated record.');
    }
    // --- End New ---
    // Publish an event indicating a knowledge record has been updated (part of Six Styles/EventBus)
    // The Realtime subscription will also trigger this event, so be careful not to duplicate processing.
    (_y = this.context.eventBus) === null || _y === void 0 ? void 0 : _y.publish('knowledge_record_updated', updatedRecord, userId); // Include userId in event
    // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly
    // this.context.syncService?.handleLocalDataChange('memoryEngine', 'UPDATE', updatedRecord, userId)
    //      .catch(syncError => console.error('Error notifying SyncService for KnowledgeRecord update:', syncError));
    return updatedRecord;
}
catch (error) {
    console.error("Failed to update knowledge record ".concat(id, ":"), error);
    (_z = this.context.loggingService) === null || _z === void 0 ? void 0 : _z.logError("Failed to update knowledge record ".concat(id), { id: id, updates: updates, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Deletes a knowledge record for a specific user from Supabase.
 * @param id The ID of the record. Required.
 * @param userId The user ID for verification (checks ownership). Required.
 * @returns Promise<boolean> True if deletion was successful, false otherwise.
 * Privacy Note: RLS policies ensure users can only delete their own records.
 */
async;
deleteKnowledge(id, string, userId, string);
Promise < boolean > {
    console: console,
    : .log("[MemoryEngine] Deleting knowledge record ".concat(id, " from Supabase for user ").concat(userId, "...")),
    this: (_0 = .context.loggingService) === null || _0 === void 0 ? void 0 : _0.logInfo("Attempting to delete knowledge record ".concat(id), { id: id, userId: userId }),
    if: function (, id) { }
} || !userId;
{
    console.warn('[MemoryEngine] Cannot delete knowledge: ID and user ID are required.');
    (_1 = this.context.loggingService) === null || _1 === void 0 ? void 0 : _1.logWarning('Cannot delete knowledge: ID and user ID are required.', { id: id, userId: userId });
    throw new Error('ID and user ID are required.');
}
try {
    // Persist deletion to Supabase (Supports Bidirectional Sync Domain)
    // Filter by ID and user_id to ensure ownership
    var _64 = await this.supabase
        .from('knowledge_records')
        .delete()
        .eq('id', id)
        .eq('user_id', userId) // Ensure ownership
        .select('id', { count: 'exact' }), count = _64.count, error_4 = _64.error; // Select count to check if a row was deleted
    if (error_4)
        throw error_4;
    var deleted = count !== null && count > 0; // Check if count is greater than 0
    if (deleted) {
        console.log("Knowledge record ".concat(id, " deleted from Supabase."));
        // --- New: Trigger RAG Indexing for deletion ---
        // Send a message to the RAGIndexer Agent asynchronously.
        console.log("[MemoryEngine] Triggering RAG indexing for deleted record: ".concat(id, "."));
        if ((_2 = this.context.agentFactory) === null || _2 === void 0 ? void 0 : _2.getAgent('rag_indexer')) {
            (_3 = this.context.messageBus) === null || _3 === void 0 ? void 0 : _3.send({
                type: 'delete_indexed_record', // Message type for RAGIndexer
                payload: { dataType: 'knowledge_record', recordId: id }, // Pass data type and the deleted record ID
                recipient: 'rag_indexer', // Target the RAGIndexer Agent
                sender: 'memory_engine', // Identify the sender
            });
        }
        else {
            console.warn('[MemoryEngine] RAGIndexer Agent not available. Cannot trigger indexing for deleted record.');
        }
        // --- End New ---
        // Publish an event indicating a knowledge record has been deleted (part of Six Styles/EventBus)
        // The Realtime subscription will also trigger this event, so be careful not to duplicate processing.
        (_4 = this.context.eventBus) === null || _4 === void 0 ? void 0 : _4.publish('knowledge_record_deleted', { id: id, userId: userId }, userId); // Include userId in event
        // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly
        // this.context.syncService?.handleLocalDataChange('memoryEngine', 'DELETE', { id: id }, userId)
        //      .catch(syncError => console.error('Error notifying SyncService for KnowledgeRecord delete:', syncError));
    }
    else {
        console.warn("Knowledge record ".concat(id, " not found for deletion or user mismatch."));
        (_5 = this.context.loggingService) === null || _5 === void 0 ? void 0 : _5.logWarning("Knowledge record not found for deletion or user mismatch: ".concat(id), { id: id, userId: userId });
    }
    return deleted;
}
catch (error) {
    console.error("Failed to delete knowledge record ".concat(id, ":"), error);
    (_6 = this.context.loggingService) === null || _6 === void 0 ? void 0 : _6.logError("Failed to delete knowledge record ".concat(id), { id: id, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
// --- Knowledge Collection CRUD (\u77e5\u8b58\u96c6\u5408) ---
/**
 * Creates a new knowledge collection in Supabase.
 * @param name The name of the collection. Required.
 * @param userId The user ID to associate the collection with. Required.
 * @param description Optional description.
 * @param isPublic Optional: Whether the collection is public. Defaults to false.
 * @param language Optional: Primary language of the collection. Defaults to user preference or system default.
 * @returns Promise<KnowledgeCollection | null> The created collection or null on failure.
 */
async;
createCollection(name, string, userId, string, description ?  : string, isPublic, boolean = false, language ?  : string);
Promise < KnowledgeCollection | null > {
    console: console,
    : .log('[MemoryEngine] Creating collection for user:', userId),
    this: (_7 = .context.loggingService) === null || _7 === void 0 ? void 0 : _7.logInfo('Attempting to create collection', { userId: userId, name: name, isPublic: isPublic, language: language }),
    if: function (, userId) { }
} || !name;
{
    console.error('[MemoryEngine] Cannot create collection: User ID and name are required.');
    (_8 = this.context.loggingService) === null || _8 === void 0 ? void 0 : _8.logError('Cannot create collection: Missing required fields.', { userId: userId, name: name });
    throw new Error('User ID and name are required to create a collection.');
}
var contentLanguage = language || ((_9 = this.context.currentUser) === null || _9 === void 0 ? void 0 : _9.language_preference) || 'en'; // Default to English if no preference
var newCollectionData = {
    name: name,
    description: description || null,
    user_id: userId,
    is_public: isPublic,
    language: contentLanguage, // Store the language
    // timestamps are set by the database default
};
try {
    var _65 = await this.supabase
        .from('knowledge_collections')
        .insert([newCollectionData])
        .select()
        .single(), data_4 = _65.data, error_5 = _65.error;
    if (error_5) {
        console.error('Error creating collection:', error_5);
        (_10 = this.context.loggingService) === null || _10 === void 0 ? void 0 : _10.logError('Failed to create collection', { userId: userId, name: name, error: error_5.message });
        throw error_5;
    }
    var createdCollection = data_4;
    console.log('Collection created:', createdCollection.id, '-', createdCollection.name);
    // Publish event
    (_11 = this.context.eventBus) === null || _11 === void 0 ? void 0 : _11.publish('knowledge_collection_created', createdCollection, userId);
    // TODO: Notify SyncService
    return createdCollection;
}
catch (error) {
    console.error('Failed to create collection:', error);
    (_12 = this.context.loggingService) === null || _12 === void 0 ? void 0 : _12.logError('Failed to create collection', { userId: userId, name: name, error: error.message });
    return null;
}
/**
 * Retrieves knowledge collections for a user (their private and all public) from Supabase.
 * @param userId The user ID. Required to filter private terms.
 * @returns Promise<KnowledgeCollection[]> An array of collections.
 */
async;
getCollections(userId, string);
Promise < KnowledgeCollection[] > {
    console: console,
    : .log('[MemoryEngine] Retrieving collections for user:', userId),
    this: (_13 = .context.loggingService) === null || _13 === void 0 ? void 0 : _13.logInfo('Attempting to fetch collections', { userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[MemoryEngine] User ID is required to get collections.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('User ID is required to get collections.');
        return [];
    },
    try: {
        // Fetch collections filtered by user_id OR is_public
        const: (_b = await this.supabase
            .from('knowledge_collections')
            .select('*')
            .or("user_id.eq.".concat(userId, ",is_public.eq.true"))
            .order('name', { ascending: true }), data = _b.data, error = _b.error, _b),
        if: function (error) { },
        throw: error,
        const: collections = data,
        console: console,
        : .log("[MemoryEngine] Fetched ".concat(collections.length, " collections.")),
        this: (_14 = .context.loggingService) === null || _14 === void 0 ? void 0 : _14.logInfo("Fetched ".concat(collections.length, " collections."), { userId: userId }),
        return: collections
    },
    catch: function (error) {
        var _a;
        console.error('Error fetching collections:', error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Failed to fetch collections', { userId: userId, error: error.message });
        return [];
    }
};
/**
 * Retrieves a specific knowledge collection by ID for a user.
 * Checks if the collection is public or owned by the user.
 * @param collectionId The ID of the collection. Required.
 * @param userId The user ID for verification. Required.
 * @returns Promise<KnowledgeCollection | undefined> The collection or undefined.
 */
async;
getCollectionById(collectionId, string, userId, string);
Promise < KnowledgeCollection | undefined > {
    console: console,
    : .log('[MemoryEngine] Retrieving collection by ID:', collectionId, 'for user:', userId),
    this: (_15 = .context.loggingService) === null || _15 === void 0 ? void 0 : _15.logInfo("Attempting to fetch collection ".concat(collectionId), { id: collectionId, userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[MemoryEngine] Cannot retrieve collection: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot retrieve collection: User ID is required.');
        return undefined;
    },
    try: {
        // Fetch collection by ID and check if it's public OR owned by the user
        const: (_c = await this.supabase
            .from('knowledge_collections')
            .select('*')
            .eq('id', collectionId)
            .or("user_id.eq.".concat(userId, ",is_public.eq.true"))
            .single(), data = _c.data, error = _c.error, _c),
        if: function (error) { },
        throw: error,
        if: function (, data) { return undefined; } // Collection not found or doesn't belong to user/is not public
        , // Collection not found or doesn't belong to user/is not public
        const: collection = data,
        console: console,
        : .log("Fetched collection ".concat(collectionId, " for user ").concat(userId, ".")),
        this: (_16 = .context.loggingService) === null || _16 === void 0 ? void 0 : _16.logInfo("Fetched collection ".concat(collectionId, " successfully."), { id: collectionId, userId: userId }),
        return: collection
    },
    catch: function (error) {
        var _a;
        console.error("Error fetching collection ".concat(collectionId, ":"), error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Failed to fetch collection ".concat(collectionId), { id: collectionId, userId: userId, error: error.message });
        return undefined;
    }
};
/**
 * Updates an existing knowledge collection in Supabase.
 * Only allows updating collections owned by the user.
 * @param collectionId The ID of the collection. Required.
 * @param updates The updates to apply (name, description, is_public, language). Required.
 * @param userId The user ID for verification (checks ownership). Required.
 * @returns Promise<KnowledgeCollection | undefined> The updated collection or undefined if not found or user mismatch.
 */
async;
updateCollection(collectionId, string, updates, (Partial), userId, string);
Promise < KnowledgeCollection | undefined > {
    console: console,
    : .log("[MemoryEngine] Updating collection ".concat(collectionId, " in Supabase for user ").concat(userId, "..."), updates),
    this: (_17 = .context.loggingService) === null || _17 === void 0 ? void 0 : _17.logInfo("Attempting to update collection ".concat(collectionId), { id: collectionId, updates: updates, userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[MemoryEngine] Cannot update collection: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot update collection: User ID is required.');
        return undefined;
    }
    // Ensure language is included if updating name/description
    ,
    // Ensure language is included if updating name/description
    if: function () { }
}(updates.name || updates.description) && !updates.language;
{
    updates.language = ((_18 = this.context.currentUser) === null || _18 === void 0 ? void 0 : _18.language_preference) || 'en';
}
try {
    // Persist update to Supabase (Supports Bidirectional Sync Domain)
    // Filter by ID and user_id to ensure ownership and that it's not a public collection (unless admin)
    var _66 = await this.supabase
        .from('knowledge_collections')
        .update(updates)
        .eq('id', collectionId)
        .eq('user_id', userId) // Ensure ownership (users can only update their own collections)
        .eq('is_public', false) // Users can only update their *private* collections via this method
        .select() // Select updated collection data
        .single(), data_5 = _66.data, error_6 = _66.error;
    if (error_6)
        throw error_6;
    if (!data_5) { // Should not happen if RLS is correct and ID/user_id match
        console.warn("Collection ".concat(collectionId, " not found or does not belong to user ").concat(userId, " for update."));
        (_19 = this.context.loggingService) === null || _19 === void 0 ? void 0 : _19.logWarning("Collection not found or user mismatch for update: ".concat(collectionId), { userId: userId });
        return undefined;
    }
    var updatedCollection = data_5;
    console.log("Collection ".concat(collectionId, " updated in Supabase. Language: ").concat(updatedCollection.language));
    // Publish an event indicating a collection has been updated (part of Six Styles/EventBus)
    (_20 = this.context.eventBus) === null || _20 === void 0 ? void 0 : _20.publish('knowledge_collection_updated', updatedCollection, userId); // Include userId in event
    (_21 = this.context.loggingService) === null || _21 === void 0 ? void 0 : _21.logInfo("Collection updated successfully: ".concat(collectionId), { id: collectionId, userId: userId, language: updatedCollection.language });
    // TODO: Notify SyncService about local change
    return updatedCollection;
}
catch (error) {
    console.error("Failed to update collection ".concat(collectionId, ":"), error);
    (_22 = this.context.loggingService) === null || _22 === void 0 ? void 0 : _22.logError("Failed to update collection ".concat(collectionId), { id: collectionId, updates: updates, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Deletes a knowledge collection for a specific user from Supabase.
 * This will also cascade delete associated entries in the knowledge_collection_records join table.
 * @param collectionId The ID of the collection. Required.
 * @param userId The user ID for verification (checks ownership). Required.
 * @returns Promise<boolean> True if deletion was successful, false otherwise.
 */
async;
deleteCollection(collectionId, string, userId, string);
Promise < boolean > {
    console: console,
    : .log("[MemoryEngine] Deleting collection ".concat(collectionId, " from Supabase for user ").concat(userId, "...")),
    this: (_23 = .context.loggingService) === null || _23 === void 0 ? void 0 : _23.logInfo("Attempting to delete collection ".concat(collectionId), { id: collectionId, userId: userId }),
    if: function (, collectionId) { }
} || !userId;
{
    console.warn('[MemoryEngine] Cannot delete collection: ID and user ID are required.');
    (_24 = this.context.loggingService) === null || _24 === void 0 ? void 0 : _24.logWarning('Cannot delete collection: ID and user ID are required.', { id: collectionId, userId: userId });
    return false; // Return false if no ID or user ID
}
try {
    // Persist deletion to Supabase (Supports Bidirectional Sync Domain)
    // Filter by ID and user_id to ensure ownership
    var _67 = await this.supabase
        .from('knowledge_collections')
        .delete()
        .eq('id', collectionId)
        .eq('user_id', userId) // Ensure ownership
        .select('id', { count: 'exact' }), count = _67.count, error_7 = _67.error; // Select count to check if a row was deleted
    if (error_7) {
        throw error_7;
    }
    var deleted = count !== null && count > 0; // Check if count is greater than 0
    if (deleted) {
        console.log("Collection ".concat(collectionId, " deleted from Supabase."));
        // Publish an event indicating a collection has been deleted (part of Six Styles/EventBus)
        (_25 = this.context.eventBus) === null || _25 === void 0 ? void 0 : _25.publish('knowledge_collection_deleted', { collectionId: collectionId, userId: userId }, userId); // Include userId in event
        (_26 = this.context.loggingService) === null || _26 === void 0 ? void 0 : _26.logInfo("Collection deleted successfully: ".concat(collectionId), { id: collectionId, userId: userId });
    }
    else {
        console.warn("Collection ".concat(collectionId, " not found for deletion or user mismatch."));
        (_27 = this.context.loggingService) === null || _27 === void 0 ? void 0 : _27.logWarning("Collection not found for deletion or user mismatch: ".concat(collectionId), { id: collectionId, userId: userId });
    }
    return deleted;
}
catch (error) {
    console.error("Failed to delete collection ".concat(collectionId, ":"), error);
    (_28 = this.context.loggingService) === null || _28 === void 0 ? void 0 : _28.logError("Failed to delete collection ".concat(collectionId), { id: collectionId, userId: userId, error: error.message });
    return false; // Return false on failure
}
/**
 * Retrieves knowledge records that are part of a specific collection for a user.
 * @param collectionId The ID of the collection. Required.
 * @param userId The user ID. Required.
 * @returns Promise<KnowledgeRecord[]> An array of records in the collection.
 */
async;
getRecordsInCollection(collectionId, string, userId, string);
Promise < KnowledgeRecord[] > {
    console: console,
    : .log("[MemoryEngine] Retrieving records in collection ".concat(collectionId, " for user ").concat(userId)),
    this: (_29 = .context.loggingService) === null || _29 === void 0 ? void 0 : _29.logInfo("Attempting to fetch records in collection ".concat(collectionId), { collectionId: collectionId, userId: userId }),
    if: function (, collectionId) { }
} || !userId;
{
    console.warn('[MemoryEngine] Cannot retrieve records in collection: Collection ID and User ID are required.');
    (_30 = this.context.loggingService) === null || _30 === void 0 ? void 0 : _30.logWarning('Cannot retrieve records in collection: Missing required fields.', { collectionId: collectionId, userId: userId });
    return [];
}
try {
    // Fetch records using the join table, filtered by collection_id and user_id
    // Join with knowledge_records table to get the full record details
    var _68 = await this.supabase
        .from('knowledge_collection_records')
        .select('record_id, knowledge_records(*)') // Select the record ID and join the full record
        .eq('collection_id', collectionId)
        .eq('user_id', userId), data_6 = _68.data, error_8 = _68.error; // RLS on join table enforces ownership
    if (error_8)
        throw error_8;
    // Map the result to an array of KnowledgeRecord
    var records = data_6.map(function (item) { return item.knowledge_records; });
    console.log("[MemoryEngine] Fetched ".concat(records.length, " records in collection ").concat(collectionId, "."));
    (_31 = this.context.loggingService) === null || _31 === void 0 ? void 0 : _31.logInfo("Fetched ".concat(records.length, " records in collection ").concat(collectionId, " successfully."), { collectionId: collectionId, userId: userId });
    return records;
}
catch (error) {
    console.error("Error fetching records in collection ".concat(collectionId, ":"), error);
    (_32 = this.context.loggingService) === null || _32 === void 0 ? void 0 : _32.logError("Failed to fetch records in collection ".concat(collectionId), { collectionId: collectionId, userId: userId, error: error.message });
    return [];
}
/**
 * Adds a knowledge record to a specific collection for a user in Supabase.
 * Creates an entry in the knowledge_collection_records join table.
 * @param collectionId The ID of the collection. Required.
 * @param recordId The ID of the knowledge record to add. Required.
 * @param userId The user ID associating the relation. Required.
 * @returns Promise<any | null> The created join table entry or null if the record is already in the collection.
 */
async;
addRecordToCollection(collectionId, string, recordId, string, userId, string);
Promise < any | null > {
    console: console,
    : .log("[MemoryEngine] Adding record ".concat(recordId, " to collection ").concat(collectionId, " for user ").concat(userId)),
    this: (_33 = .context.loggingService) === null || _33 === void 0 ? void 0 : _33.logInfo('Attempting to add record to collection', { collectionId: collectionId, recordId: recordId, userId: userId }),
    if: function (, collectionId) { }
} || !recordId || !userId;
{
    console.error('[MemoryEngine] Cannot add record to collection: Missing required fields.');
    (_34 = this.context.loggingService) === null || _34 === void 0 ? void 0 : _34.logError('Cannot add record to collection: Missing required fields.', { collectionId: collectionId, recordId: recordId, userId: userId });
    throw new Error('Collection ID, Record ID, and user ID are required.');
}
var newCollectionRecordData = {
    collection_id: collectionId,
    record_id: recordId,
    user_id: userId, // Associate with user for RLS on join table
    // added_timestamp is set by the database default
};
try {
    // Insert into the join table
    // Handle unique constraint violation if the record is already in the collection
    var _69 = await this.supabase
        .from('knowledge_collection_records')
        .insert([newCollectionRecordData])
        .select() // Select the inserted data
        .single(), data_7 = _69.data, error_9 = _69.error; // Expecting a single record back
    if (error_9) {
        if (error_9.code === '23505') { // PostgreSQL unique_violation error code
            console.warn("[MemoryEngine] Record ".concat(recordId, " is already in collection ").concat(collectionId, ". Skipping add."));
            (_35 = this.context.loggingService) === null || _35 === void 0 ? void 0 : _35.logWarning("Record already in collection: ".concat(recordId, " in ").concat(collectionId), { collectionId: collectionId, recordId: recordId, userId: userId });
            return null; // Return null if already exists
        }
        console.error('Error adding record to collection:', error_9);
        (_36 = this.context.loggingService) === null || _36 === void 0 ? void 0 : _36.logError('Failed to add record to collection', { collectionId: collectionId, recordId: recordId, userId: userId, error: error_9.message });
        throw error_9; // Re-throw other errors
    }
    var createdEntry = data_7; // The inserted join table entry
    console.log('Record added to collection:', createdEntry);
    // Publish event
    (_37 = this.context.eventBus) === null || _37 === void 0 ? void 0 : _37.publish('knowledge_collection_record_added', createdEntry, userId);
    // TODO: Notify SyncService
    return createdEntry;
}
catch (error) {
    console.error('Failed to add record to collection:', error);
    (_38 = this.context.loggingService) === null || _38 === void 0 ? void 0 : _38.logError('Failed to add record to collection', { collectionId: collectionId, recordId: recordId, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Removes a knowledge record from a collection for a specific user in Supabase.
 * Deletes the entry from the knowledge_collection_records join table.
 * @param collectionId The ID of the collection. Required.
 * @param recordId The ID of the knowledge record to remove. Required.
 * @param userId The user ID for verification. Required.
 * @returns Promise<boolean> True if removal was successful, false otherwise.
 */
async;
removeRecordFromCollection(collectionId, string, recordId, string, userId, string);
Promise < boolean > {
    console: console,
    : .log("[MemoryEngine] Removing record ".concat(recordId, " from collection ").concat(collectionId, " for user ").concat(userId)),
    this: (_39 = .context.loggingService) === null || _39 === void 0 ? void 0 : _39.logInfo('Attempting to remove record from collection', { collectionId: collectionId, recordId: recordId, userId: userId }),
    if: function (, collectionId) { }
} || !recordId || !userId;
{
    console.error('[MemoryEngine] Cannot remove record from collection: Missing required fields.');
    (_40 = this.context.loggingService) === null || _40 === void 0 ? void 0 : _40.logError('Cannot remove record from collection: Missing required fields.', { collectionId: collectionId, recordId: recordId, userId: userId });
    throw new Error('Collection ID, Record ID, and user ID are required.');
}
try {
    // Delete from the join table
    // Filter by collection_id, record_id, and user_id to ensure ownership
    var _70 = await this.supabase
        .from('knowledge_collection_records')
        .delete()
        .eq('collection_id', collectionId)
        .eq('record_id', recordId)
        .eq('user_id', userId) // Ensure ownership
        .select('record_id', { count: 'exact' }), count = _70.count, error_10 = _70.error; // Select count to check if a row was deleted
    if (error_10)
        throw error_10;
    var deleted = count !== null && count > 0; // Check if count is greater than 0
    if (deleted) {
        console.log("Record ".concat(recordId, " removed from collection ").concat(collectionId, "."));
        // Publish event
        (_41 = this.context.eventBus) === null || _41 === void 0 ? void 0 : _41.publish('knowledge_collection_record_deleted', { collectionId: collectionId, recordId: recordId, userId: userId }, userId);
        // TODO: Notify SyncService
    }
    else {
        console.warn("Record ".concat(recordId, " not found in collection ").concat(collectionId, " for deletion or user mismatch."));
        (_42 = this.context.loggingService) === null || _42 === void 0 ? void 0 : _42.logWarning("Record not found in collection for deletion or user mismatch: ".concat(recordId, " in ").concat(collectionId), { collectionId: collectionId, recordId: recordId, userId: userId });
    }
    return deleted;
}
catch (error) {
    console.error("Failed to remove record ".concat(recordId, " from collection ").concat(collectionId, ":"), error);
    (_43 = this.context.loggingService) === null || _43 === void 0 ? void 0 : _43.logError('Failed to remove record from collection', { collectionId: collectionId, recordId: recordId, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
// --- Modified: Implement updateCollection and deleteCollection methods. ---
/**
 * Updates an existing knowledge collection in Supabase.
 * Only allows updating collections owned by the user.
 * @param collectionId The ID of the collection. Required.
 * @param updates The updates to apply (name, description, is_public, language). Required.
 * @param userId The user ID for verification (checks ownership). Required.
 * @returns Promise<KnowledgeCollection | undefined> The updated collection or undefined if not found or user mismatch.
 */
// This method is already implemented above.
/**
 * Deletes a knowledge collection for a specific user from Supabase.
 * This will also cascade delete associated entries in the knowledge_collection_records join table.
 * @param collectionId The ID of the collection. Required.
 * @param userId The user ID for verification (checks ownership). Required.
 * @returns Promise<boolean> True if deletion was successful, false otherwise.
 */
// This method is already implemented above.
// --- Glossary Term CRUD (\u8a5e\u5f59\u8868) ---
/**
 * Creates a new glossary term for a specific user or as public in Supabase.
 * @param termDetails The details of the term (without id, creation_timestamp, last_updated_timestamp). Required.
 * @param userId The user ID creating the term. Optional (for user-owned terms).
 * @param isPublic Whether the term is public. Defaults to true if no userId, false if userId is provided.
 * @param language Optional: Language of the term and definition. Defaults to user preference or system default.
 * @returns Promise<GlossaryTerm | null> The created term or null on failure.
 */
async;
createTerm(termDetails, (Omit), userId ?  : string, isPublic ?  : boolean, language ?  : string);
Promise < GlossaryTerm | null > {
    console: console,
    : .log('Creating glossary term:', termDetails.term, 'for user:', userId, 'public:', isPublic),
    this: (_44 = .context.loggingService) === null || _44 === void 0 ? void 0 : _44.logInfo('Attempting to create glossary term', { term: termDetails.term, userId: userId, isPublic: isPublic, language: language }),
    if: function (, termDetails) { },
    : .term || !termDetails.definition
};
{
    console.error('[MemoryEngine] Cannot create term: Term and definition are required.');
    (_45 = this.context.loggingService) === null || _45 === void 0 ? void 0 : _45.logError('Cannot create glossary term: Missing required fields.', { term: termDetails.term, userId: userId });
    throw new Error('Term and definition are required to create a glossary term.');
}
// Determine public status if not explicitly provided
var finalIsPublic = isPublic !== undefined ? isPublic : (userId ? false : true); // Default to public if no user, private if user
var contentLanguage = language || ((_46 = this.context.currentUser) === null || _46 === void 0 ? void 0 : _46.language_preference) || 'en'; // Default to English if no preference
var newTermData = __assign(__assign({}, termDetails), { user_id: userId || null, is_public: finalIsPublic, related_concepts: termDetails.related_concepts || [], language: contentLanguage });
try {
    // Insert into Supabase (Supports Bidirectional Sync Domain)
    var _71 = await this.supabase
        .from('glossary')
        .insert([newTermData])
        .select()
        .single(), data_8 = _71.data, error_11 = _71.error;
    if (error_11) {
        console.error('Error creating glossary term:', error_11);
        (_47 = this.context.loggingService) === null || _47 === void 0 ? void 0 : _47.logError('Failed to create glossary term', { term: termDetails.term, userId: userId, error: error_11.message });
        throw error_11;
    }
    var createdTerm = data_8;
    console.log('Glossary term created:', createdTerm.id, '-', createdTerm.term, 'for user:', createdTerm.user_id, 'public:', createdTerm.is_public);
    // Publish event
    (_48 = this.context.eventBus) === null || _48 === void 0 ? void 0 : _48.publish('glossary_term_created', createdTerm, userId);
    // TODO: Notify SyncService
    return createdTerm;
}
catch (error) {
    console.error('Failed to create glossary term:', error);
    (_49 = this.context.loggingService) === null || _49 === void 0 ? void 0 : _49.logError('Failed to create glossary term', { term: termDetails.term, userId: userId, error: error.message });
    return null;
}
/**
 * Retrieves glossary terms for a specific user (their private terms and all public terms) from Supabase.
 * Can filter by pillar/domain or search term.
 * @param userId The user ID. Required to filter private terms.
 * @param pillarDomain Optional: Filter by pillar/domain.
 * @param searchTerm Optional: Search terms in term or definition.
 * @returns Promise<GlossaryTerm[]> An array of GlossaryTerm objects.
 */
async;
getTerms(userId, string, pillarDomain ?  : string, searchTerm ?  : string);
Promise < GlossaryTerm[] > {
    console: console,
    : .log('Retrieving glossary terms for user:', userId, 'domain:', pillarDomain || 'all', 'search:', searchTerm || 'none'),
    this: (_50 = .context.loggingService) === null || _50 === void 0 ? void 0 : _50.logInfo('Attempting to fetch glossary terms', { userId: userId, pillarDomain: pillarDomain, searchTerm: searchTerm }),
    if: function (, userId) {
        var _a;
        console.warn('[MemoryEngine] Cannot retrieve terms: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot retrieve glossary terms: User ID is required.');
        return [];
    },
    try: {
        // Fetch terms from Supabase, filtered by user_id OR is_public
        let: let,
        dbQuery: dbQuery, // Fetch user's own terms OR public terms
        if: function (pillarDomain) {
            dbQuery = dbQuery.eq('pillar_domain', pillarDomain);
        },
        if: function (searchTerm) {
            // Use text search on term and definition
            dbQuery = dbQuery.textSearch('fts', searchTerm); // Assuming FTS index 'fts' on term || ' ' || definition
        },
        dbQuery: dbQuery, // Order by term alphabetically
        const: (_d = await dbQuery, data = _d.data, error = _d.error, _d),
        if: function (error) { },
        throw: error,
        const: terms = data,
        console: console,
        : .log("Fetched ".concat(terms.length, " glossary terms for user ").concat(userId, ".")),
        this: (_51 = .context.loggingService) === null || _51 === void 0 ? void 0 : _51.logInfo("Fetched ".concat(terms.length, " glossary terms successfully."), { userId: userId }),
        return: terms
    },
    catch: function (error) {
        var _a;
        console.error('Error fetching glossary terms from Supabase:', error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Failed to fetch glossary terms', { userId: userId, error: error.message });
        return [];
    }
};
/**
 * Retrieves a specific glossary term by ID for a specific user from Supabase.
 * Checks if the term is public or owned by the user.
 * @param termId The ID of the term. Required.
 * @param userId The user ID for verification. Required.
 * @returns Promise<GlossaryTerm | undefined> The GlossaryTerm object or undefined.
 */
async;
getTermById(termId, string, userId, string);
Promise < GlossaryTerm | undefined > {
    console: console,
    : .log('Retrieving glossary term by ID from Supabase:', termId, 'for user:', userId),
    this: (_52 = .context.loggingService) === null || _52 === void 0 ? void 0 : _52.logInfo("Attempting to fetch glossary term ".concat(termId), { id: termId, userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[MemoryEngine] Cannot retrieve term: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot retrieve glossary term: User ID is required.');
        return undefined;
    },
    try: {
        // Fetch term from Supabase by ID and check if it's public OR owned by the user
        const: (_e = await this.supabase
            .from('glossary')
            .select('*')
            .eq('id', termId)
            .or("user_id.eq.".concat(userId, ",is_public.eq.true")) // Ensure ownership OR public status
            .single(), data = _e.data, error = _e.error, _e),
        if: function (error) { },
        throw: error,
        if: function (, data) { return undefined; } // Term not found or doesn't belong to user/is not public
        , // Term not found or doesn't belong to user/is not public
        const: term = data,
        console: console,
        : .log("Fetched glossary term ".concat(termId, " for user ").concat(userId, ".")),
        this: (_53 = .context.loggingService) === null || _53 === void 0 ? void 0 : _53.logInfo("Fetched glossary term ".concat(termId, " successfully."), { id: termId, userId: userId }),
        return: term
    },
    catch: function (error) {
        var _a;
        console.error("Error fetching glossary term ".concat(termId, " from Supabase:"), error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Failed to fetch glossary term ".concat(termId), { id: termId, userId: userId, error: error.message });
        return undefined;
    }
};
/**
 * Updates an existing glossary term for a specific user in Supabase.
 * Only allows updating terms owned by the user.
 * @param termId The ID of the term to update. Required.
 * @param updates The updates to apply (term, definition, related_concepts, pillar_domain, is_public). Required.
 * @param userId The user ID for verification (checks ownership). Required.
 * @returns Promise<GlossaryTerm | undefined> The updated term or undefined if not found or user mismatch.
 */
async;
updateTerm(termId, string, updates, (Partial), userId, string);
Promise < GlossaryTerm | undefined > {
    console: console,
    : .log("Updating glossary term ".concat(termId, " in Supabase for user ").concat(userId, "..."), updates),
    this: (_54 = .context.loggingService) === null || _54 === void 0 ? void 0 : _54.logInfo("Attempting to update glossary term ".concat(termId), { id: termId, updates: updates, userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[MemoryEngine] Cannot update term: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot update glossary term: User ID is required.');
        return undefined;
    },
    try: {
        // Persist update to Supabase (Supports Bidirectional Sync Domain)
        // Filter by ID and user_id to ensure ownership and that it's not a public term (unless admin)
        const: (_f = await this.supabase
            .from('glossary')
            .update(updates)
            .eq('id', termId)
            .eq('user_id', userId) // Ensure ownership (users can only update their own terms)
            .eq('is_public', false) // Users can only update their *private* terms via this method
            .select() // Select updated term data
            .single(), data = _f.data, error = _f.error, _f),
        if: function (error) { },
        throw: error,
        if: function (, data) {
            var _a;
            console.warn("Glossary term ".concat(termId, " not found or does not belong to user ").concat(userId, " (or is public) for update."));
            (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning("Glossary term not found or user mismatch for update: ".concat(termId), { userId: userId });
            return undefined;
        },
        const: updatedTerm = data,
        console: console,
        : .log("Glossary term ".concat(termId, " updated in Supabase.")),
        // Publish an event indicating a term has been updated (part of Six Styles/EventBus)
        this: (_55 = .context.eventBus) === null || _55 === void 0 ? void 0 : _55.publish('glossary_term_updated', updatedTerm, userId), // Include userId in event
        this: (_56 = .context.loggingService) === null || _56 === void 0 ? void 0 : _56.logInfo("Glossary term updated successfully: ".concat(termId), { id: termId, userId: userId }),
        // TODO: Notify SyncService about local change
        return: updatedTerm
    },
    catch: function (error) {
        var _a;
        console.error("Failed to update glossary term ".concat(termId, ":"), error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Failed to update glossary term ".concat(termId), { id: termId, updates: updates, userId: userId, error: error.message });
        throw error; // Re-throw the error
    }
};
/**
 * Deletes a glossary term for a specific user from Supabase.
 * Only allows deleting terms owned by the user.
 * @param termId The ID of the term. Required.
 * @param userId The user ID for verification (checks ownership). Required.
 * @returns Promise<boolean> True if deletion was successful, false otherwise.
 */
async;
deleteTerm(termId, string, userId, string);
Promise < boolean > {
    console: console,
    : .log("Deleting glossary term ".concat(termId, " from Supabase for user ").concat(userId, "...")),
    this: (_57 = .context.loggingService) === null || _57 === void 0 ? void 0 : _57.logInfo("Attempting to delete glossary term ".concat(termId), { id: termId, userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[MemoryEngine] Cannot delete term: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot delete glossary term: User ID is required.');
        return false; // Return false if no user ID
    },
    try: {
        // Persist deletion to Supabase (Supports Bidirectional Sync Domain)
        // Filter by ID and user_id to ensure ownership and that it's not a public term (unless admin)
        const: (_g = await this.supabase
            .from('glossary')
            .delete()
            .eq('id', termId)
            .eq('user_id', userId) // Ensure ownership (users can only delete their own terms)
            .eq('is_public', false) // Users can only delete their *private* terms via this method
            .select('id', { count: 'exact' }), count = _g.count, error = _g.error, _g), // Select count to check if a row was deleted
        if: function (error) { throw error; },
        const: deleted = count !== null && count > 0, // Check if count is greater than 0
        if: function (deleted) {
            var _a, _b;
            console.log("Glossary term ".concat(termId, " deleted from Supabase."));
            // Publish an event indicating a term has been deleted (part of Six Styles/EventBus)
            (_a = this.context.eventBus) === null || _a === void 0 ? void 0 : _a.publish('glossary_term_deleted', { termId: termId, userId: userId }, userId); // Include userId in event
            (_b = this.context.loggingService) === null || _b === void 0 ? void 0 : _b.logInfo("Glossary term deleted successfully: ".concat(termId), { id: termId, userId: userId });
        },
        else: {
            console: console,
            : .warn("Glossary term ".concat(termId, " not found for deletion or user mismatch (or is public).")),
            this: (_58 = .context.loggingService) === null || _58 === void 0 ? void 0 : _58.logWarning("Glossary term not found for deletion or user mismatch: ".concat(termId), { id: termId, userId: userId })
        },
        return: deleted
    },
    catch: function (error) {
        var _a;
        console.error("Failed to delete glossary term ".concat(termId, ":"), error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Failed to delete glossary term ".concat(termId), { id: termId, userId: userId, error: error.message });
        return false; // Return false on failure
    }
};
// TODO: Implement methods for importing/exporting glossary terms.
// TODO: Implement methods for suggesting new terms based on user input/knowledge.
// TODO: This module is part of the Long-term Memory (\u6c38\u4e45\u8a18\u61b6) pillar.
// --- New: Realtime Subscription Methods ---
/**
 * Subscribes to real-time updates from the glossary table for the current user (user-owned and public).
 * @param userId The user ID to filter updates by. Required.
 */
subscribeToGlossaryUpdates(userId, string);
void {
    console: console,
    : .log('[GlossaryService] Subscribing to glossary realtime updates for user:', userId),
    this: (_59 = .context.loggingService) === null || _59 === void 0 ? void 0 : _59.logInfo('Subscribing to glossary realtime updates', { userId: userId }),
    : .glossarySubscription
};
{
    console.warn('[GlossaryService] Already subscribed to glossary updates. Unsubscribing existing.');
    this.unsubscribeFromGlossaryUpdates();
}
// Subscribe to changes where user_id is null (public) OR user_id is the current user.
// RLS should ensure user only receives updates for terms they can see.
// We subscribe to all changes on the table and rely on RLS filtering.
// A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.
// Let's subscribe to a channel that should include both user and public data based on RLS.
// A simple channel name like the table name, relying entirely on RLS, is often used.
// Let's switch to subscribing to the table name channel and rely on RLS.
this.glossarySubscription = this.supabase
    .channel('glossary') // Subscribe to all changes on the table
    .on('postgres_changes', { event: '*', schema: 'public', table: 'glossary' }, function (payload) { return __awaiter(_this, void 0, void 0, function () {
    var term, oldTerm, eventType, relevantTerm, isRelevant;
    var _a;
    return __generator(this, function (_b) {
        console.log('[GlossaryService] Realtime glossary change received:', payload);
        term = payload.new;
        oldTerm = payload.old;
        eventType = payload.eventType;
        relevantTerm = term || oldTerm;
        isRelevant = (relevantTerm === null || relevantTerm === void 0 ? void 0 : relevantTerm.user_id) === userId || (relevantTerm === null || relevantTerm === void 0 ? void 0 : relevantTerm.is_public) === true;
        if (isRelevant) {
            console.log("[GlossaryService] Processing relevant glossary change (".concat(eventType, "): ").concat(relevantTerm.id));
            // Publish an event via EventBus for other modules/UI to react
            (_a = this.context.eventBus) === null || _a === void 0 ? void 0 : _a.publish("glossary_term_".concat(eventType.toLowerCase()), term || oldTerm, userId); // e.g., 'glossary_term_insert', 'glossary_term_update', 'glossary_term_delete'
            // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly
            // this.context.syncService?.handleRemoteDataChange('glossaryService', eventType, term || oldTerm, userId);
        }
        else {
            console.log('[GlossaryService] Received glossary change not relevant to current user (filtered by RLS or client-side).');
        }
        return [2 /*return*/];
    });
}); })
    .subscribe(function (status, err) {
    var _a;
    console.log('[GlossaryService] Glossary subscription status:', status);
    if (status === 'CHANNEL_ERROR') {
        console.error('[GlossaryService] Glossary subscription error:', err);
        (_a = _this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Glossary subscription error', { userId: userId, error: err === null || err === void 0 ? void 0 : err.message });
    }
});
/**
 * Unsubscribes from glossary real-time updates.
 */
unsubscribeFromGlossaryUpdates();
void {
    : .glossarySubscription
};
{
    console.log('[GlossaryService] Unsubscribing from glossary realtime updates.');
    (_60 = this.context.loggingService) === null || _60 === void 0 ? void 0 : _60.logInfo('Unsubscribing from glossary realtime updates');
    this.supabase.removeChannel(this.glossarySubscription);
    this.glossarySubscription = null;
}
""(__makeTemplateObject([""], [""]));
