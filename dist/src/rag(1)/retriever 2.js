"use strict";
`` `typescript
// src/rag/retriever.ts
// RAG Retriever - Retrieves relevant data based on a query using vector similarity search.

import { SystemContext, KnowledgeRecord, Task, Goal, UserAction } from '../interfaces';
// import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // Access via requestAgent
// import { MemoryEngine } from '../core/memory/MemoryEngine'; // Access via context
// import { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // Access via context
// import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Access via context
import { BaseAgent, AgentMessage, AgentResponse } from '../agents/BaseAgent'; // Import BaseAgent types

// --- Modified: Extend BaseAgent ---
export class RAGRetriever extends BaseAgent { // Extend BaseAgent
    private context: SystemContext;

    constructor(context: SystemContext) {
        // --- Modified: Call super constructor with agent name ---
        super('rag_retriever', context); // Call BaseAgent constructor with agent name 'rag_retriever'
        // --- End Modified ---\
        this.context = context;
        console.log('RAGRetriever initialized.');
    }

    /**
     * Handles messages directed to the RAG Retriever Agent.
     * @param message The message to handle. Expected type: 'retrieve_relevant_data'. Payload: { query: string, options?: { limit?: number, dataTypes?: ('knowledge_record' | 'task' | 'goal' | 'user_action')[], useSemanticSearch?: boolean } }.\\\
     * @returns Promise<AgentResponse> The response containing the relevant data.\\\
     */\\\
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\\\\\
        console.log(`[RAGRetriever];
Handling;
message: $;
{
    message.type;
}
(Correlation);
ID: $;
{
    message.correlationId || 'N/A';
}
`);\\\\\\\
\\\\\\n        const userId = this.context.currentUser?.id;\\\\\\\n        if (!userId) {\\\\\\\n             return { success: false, error: 'User not authenticated.' };\\\\\\\n        }\\\\\\n\\\\\\n        if (message.type !== 'retrieve_relevant_data') { // Specific type for retrieval requests\\\\\\\n             return { success: false, error: `;
Unknown;
message;
type;
for (RAGRetriever; ; )
    : $;
{
    message.type;
}
` };\\\\\\\n        }\\\\\\n\\\\\\n        const { query, options } = message.payload;\\\\\\\n        const useSemanticSearch = options?.useSemanticSearch !== undefined ? options.useSemanticSearch : true; // Default to semantic search\\\\\\\
\\\\\\n        if (!query) {\\\\\\\n             const errorResponse = { success: false, error: 'Query is required to retrieve relevant data.' };\\\\\\\n             if (message.correlationId) this.sendResponse(message, errorResponse);\\\\\\\n             this.context.loggingService?.logError('RAGRetriever failed: Query missing in payload.', { payload: message.payload, correlationId: message.correlationId });\\\\\\\n             return errorResponse;\\\\\\\n        }\\\\\\n\\\\\\n        console.log(`[RAGRetriever];
Retrieving;
relevant;
data;
for (query; ; )
    : ;
"${query}\\\\\\\\\\\\\\\" for user: ${userId} (Semantic: ${useSemanticSearch})`);\\\\\\\n        this.context.loggingService?.logInfo(`RAGRetriever retrieving relevant data: \\\\\\\\\\\\\\\"${query}\\\\\\\\\\\\\\\"`, { userId, query, options, useSemanticSearch, correlationId: message.correlationId });\\\\\\\n\\\\\\n        try {\\\\\\\n            let relevantData: Array<KnowledgeRecord | Task | Goal | UserAction> = [];\\\\\\\
\\\\\\n            if (useSemanticSearch) {\\\\\\\n                 // Delegate retrieval logic to the core method (semantic search)\\\\\\n                 relevantData = await this.retrieveRelevantDataSemantic(query, userId, options);\\\\\\\
            }\\\\\\;
n; // If no results from semantic search or semantic search was skipped, try keyword search as fallback\\\\\\\
if (relevantData.length === 0 && (!useSemanticSearch || options?.fallbackToKeyword)) { // Added fallbackToKeyword option\\\\\\\
    console.log('[RAGRetriever] No semantic results or semantic search skipped. Attempting keyword search fallback.');
    this.context.loggingService?.logInfo('RAGRetriever attempting keyword search fallback.', { userId, query, options, correlationId: message.correlationId });
    relevantData = await this.retrieveRelevantDataKeyword(query, userId, options);
}
n;
n;
console.log(`[RAGRetriever] Retrieval complete. Found ${relevantData.length} relevant records.`);
this.context.loggingService?.logInfo(`RAGRetriever retrieval complete. Found ${relevantData.length} records.`, { userId, query, options, count: relevantData.length, correlationId: message.correlationId });
n;
const successResponse = { success: true, data: relevantData };
if (message.correlationId) {
    this.sendResponse(message, successResponse);
}
return successResponse;
n;
try { }
catch (error) {
    console.error(`[RAGRetriever] Error retrieving relevant data for message ${message.type} (Correlation ID: ${message.correlationId || 'N/A'}):`, error);
    this.context.loggingService?.logError(`RAGRetriever error retrieving relevant data.`, { userId, query, options, error: error.message, correlationId: message.correlationId });
    n;
    const errorResponse = { success: false, error: error.message || 'An error occurred during data retrieval.' };
    if (message.correlationId) {
        this.sendResponse(message, errorResponse);
    }
    return errorResponse;
}
n; /**\\\\\\n     * Retrieves relevant data records based on a query using vector similarity search.\\\\\\\n     * @param query The query text. Required.\\\\\\\n     * @param userId The user ID. Required.\\\\\\\n     * @param options Optional options (e.g., limit, data types to search).\\\\\\\n     * @returns Promise<Array<KnowledgeRecord | Task | Goal | UserAction>> An array of relevant records.\\\\\\\n     */
n;
async;
retrieveRelevantDataSemantic(query, string, userId, string, options ?  : { limit: number, dataTypes: ('knowledge_record' | 'task' | 'goal' | 'user_action')[] });
Promise < Array < KnowledgeRecord | Task | Goal | UserAction >> { n, console, : .log(`[RAGRetriever] Performing semantic search for user: ${userId}, query: \\\\\\\\\\\\\\\"${query}\\\\\\\\\\\\\\\"...`), n, this: .context.loggingService?.logInfo(`RAGRetriever performing semantic search`, { userId, query, options }),
    n, if(, userId) { } } || !query;
return []; // Should be checked by caller\\\\\\\
n; // --- Modified: Delegate embedding generation to WisdomAgent ---\\\\\\n        if (!this.context.agentFactory?.getAgent('wisdom')) {\\\\\\\n             console.warn('[RAGRetriever] WisdomAgent not available for embedding generation. Cannot perform semantic search.');\\\\\\\
this.context.loggingService?.logWarning('WisdomAgent not available for embedding generation. Cannot perform semantic search.', { userId });
n;
throw new Error('Embedding service unavailable.'); // Throw to trigger fallback if needed\\n        }\n        console.log('[RAGRetriever] Requesting query embedding from WisdomAgent...');\n        const embeddingResponse = await this.requestAgent(\n            'wisdom', // Target the WisdomAgent\n            'generate_embedding', // Message type for WisdomAgent\n            { text: query }, // Pass query text\n            10000 // Timeout\n        );\n\n        if (!embeddingResponse.success || !Array.isArray(embeddingResponse.data)) {\n             const errorMsg = embeddingResponse.error || 'WisdomAgent failed to generate embedding.';\n             console.warn('[RAGRetriever] Failed to generate embedding for query. Cannot perform semantic search.');\n             this.context.loggingService?.logWarning('Failed to generate embedding for query.', { userId, query, error: errorMsg });\n             throw new Error(`Failed to generate embedding: ${errorMsg}`); // Throw to trigger fallback if needed\n        }\n        const queryEmbedding = embeddingResponse.data; // Assuming data is the embedding vector\n        // --- End Modified ---\n\n\n        // --- Modified: Delegate database search to SupabaseAgent ---\n        if (!this.context.agentFactory?.getAgent('supabase')) {\n             console.error('[RAGRetriever] SupabaseAgent not available for vector search.');\n             this.context.loggingService?.logError('SupabaseAgent not available for vector search.');\n             throw new Error('Database service unavailable.'); // Throw to trigger fallback if needed\n        }\n\n        const dataTypesToSearch = options?.dataTypes || ['knowledge_record']; // Default to searching knowledge records\n        let allRelevantRecords: Array<KnowledgeRecord | Task | Goal | UserAction> = [];\n\n        for (const dataType of dataTypesToSearch) {\n            // Need to know the table name for the data type\n            // Access internal map (MVP) - TODO: Expose this mapping publicly or via a service\n            // Assuming SyncService has a public map or method for this\n            const tables = (this.context.syncService as any)?.DATA_TYPE_TABLE_MAP?.[dataType];\n            if (!tables || tables.length === 0) {\n                 console.warn(`[RAGRetriever] No tables defined for data type: ${dataType}. Skipping semantic search.`);\n                 this.context.loggingService?.logWarning(`No tables defined for data type: ${dataType}. Skipping vector search.`, { userId, dataType });\n                 continue; // Skip this data type\n            }\n            const table = tables[0]; // Use the first table for the data type (MVP simplification)\n\n            console.log(`[RAGRetriever] Sending query_records message to SupabaseAgent for table ${table} (vector search).`);\n\n            try {\n                // Perform vector similarity search via SupabaseAgent\n                // Use the '<=>' operator for cosine distance (requires pgvector)\n                // Order by distance and limit results.\n                const searchResponse = await this.requestAgent(\n                    'supabase', // Target the SupabaseAgent\n                    'query_records', // Message type for SupabaseAgent\n                    {\n                        table: table,\n                        select: '*',\n                        query: { user_id: userId }, // Filter by user ID (RLS should also enforce this)\n                        order: { column: 'embedding_vector <=> ' + JSON.stringify(queryEmbedding), ascending: true }, // Order by cosine distance\n                        limit: options?.limit || 10, // Limit results per table\n                    },\n                    10000 // Timeout\n                );\n\n                if (!searchResponse.success || !Array.isArray(searchResponse.data)) {\n                     console.error(`[RAGRetriever] SupabaseAgent failed vector search in table ${table} for data type ${dataType}:`, searchResponse.error);\n                     this.context.loggingService?.logError(`SupabaseAgent failed vector search in table ${table}`, { userId, dataType, error: searchResponse.error });\n                     // Continue to next data type even if one fails\n                } else {\n                     // Add fetched records to the overall list\n                     allRelevantRecords = [...allRelevantRecords, ...(searchResponse.data as any[])]; // Cast to any[] for now\n                }\n\n            } catch (tableSearchError: any) {\n                console.error(`[RAGRetriever] Error during vector search in table ${table} for data type ${dataType}:`, tableSearchError.message);\n                this.context.loggingService?.logError(`Error during vector search in table ${table}`, { userId, dataType, error: tableSearchError.message });\n                // Continue to the next data type even if one fails\n            }\n        }\n        // --- End Modified ---\n\n\n        console.log(`[RAGRetriever] Semantic search found ${allRelevantRecords.length} relevant records.`);\n        this.context.loggingService?.logInfo(`Semantic search found ${allRelevantRecords.length} records.`, { userId, query, options });\n\n        // TODO: Rank and filter results if fetching from multiple sources/tables\n\n        return allRelevantRecords;\n\n    }\n\n     /**\n     * Retrieves relevant data records based on a query using keyword search.\n     * This is used as a fallback if semantic search is not possible or yields no results.\n     * @param query The query text. Required.\n     * @param userId The user ID. Required.\n     * @param options Optional options (e.g., limit, data types to search).\n     * @returns Promise<Array<KnowledgeRecord | Task | Goal | UserAction>> An array of relevant records.\n     */\n    private async retrieveRelevantDataKeyword(query: string, userId: string, options?: { limit?: number, dataTypes?: ('knowledge_record' | 'task' | 'goal' | 'user_action')[] }): Promise<Array<KnowledgeRecord | Task | Goal | UserAction>> {\n        console.log(`[RAGRetriever] Performing keyword search for user: ${userId}, query: \"${query}\"...`);\n        this.context.loggingService?.logInfo(`RAGRetriever performing keyword search`, { userId, query, options });\n\n        if (!userId || !query) return []; // Should be checked by caller\n\n        // --- Delegate keyword search to KnowledgeAgent ---\n        // Assuming KnowledgeAgent has a search method that supports keyword search\n        if (!this.context.agentFactory?.getAgent('knowledge')) {\n             console.warn('[RAGRetriever] KnowledgeAgent not available for keyword search.');\n             this.context.loggingService?.logWarning('KnowledgeAgent not available for keyword search.', { userId });\n             return [];\n        }\n        console.log('[RAGRetriever] Requesting keyword search from KnowledgeAgent...');\n        const knowledgeResponse = await this.requestAgent(\n            'knowledge', // Target the KnowledgeAgent\n            'query_knowledge', // Message type for KnowledgeAgent\n            { query: query, useSemanticSearch: false, limit: options?.limit || 10 }, // Pass query, explicitly disable semantic search, pass limit\n            10000 // Timeout\n        );\n\n        if (!knowledgeResponse.success || !Array.isArray(knowledgeResponse.data)) {\n             console.error('[RAGRetriever] KnowledgeAgent failed keyword search:', knowledgeResponse.error);\n             this.context.loggingService?.logError('KnowledgeAgent failed keyword search.', { userId, query, error: knowledgeResponse.error });\n             return [];\n        }\n        const relevantRecords = knowledgeResponse.data as KnowledgeRecord[]; // Assuming data is an array of KnowledgeRecord\n        // Note: Keyword search via KnowledgeAgent currently only searches KnowledgeRecords.\n        // To search other data types via keyword, dedicated methods would be needed in their respective agents.\n\n        console.log(`[RAGRetriever] Keyword search found ${relevantRecords.length} relevant records.`);\n        this.context.loggingService?.logInfo(`Keyword search found ${relevantRecords.length} records.`, { userId, query, options });\n\n        return relevantRecords;\n    }\n\n    // TODO: Implement methods to combine RAG results with keyword search results.\n    // TODO: Implement methods to re-rank results based on recency, frequency, user interaction, etc.\n}\n```
