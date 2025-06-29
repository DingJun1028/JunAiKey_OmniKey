"use strict";
`` `typescript
// src/agents/KnowledgeAgent.ts
// \u77e5\u8b58\u5eab\u4ee3\u7406 (Knowledge Agent)
// Handles operations related to the user's knowledge base.
// Part of the Agent System Architecture.
// Design Principle: Encapsulates knowledge management logic.
// --- Modified: Add handler for ingest_external_knowledge message --
// --- Modified: Pass context parameter in query_knowledge message handling --
// --- Modified: Update handleMessage to delegate to MemoryEngine/KnowledgeSync/KnowledgeGraph/Glossary --
// --- Modified: Update handleMessage to use requestAgent for RuneEngraftingCenter calls --
// --- Modified: Update handleMessage to delegate synthesize_knowledge to WisdomSecretArt --
// --- Modified: Ensure consistent error handling and logging --


import { SystemContext, KnowledgeRecord, GlossaryTerm, KnowledgeCollection, KnowledgeRelation } from '../../interfaces'; // Assuming SystemContext interface exists, Import GlossaryTerm, KnowledgeCollection, KnowledgeRelation
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types
import { AgentFactory } from './AgentFactory'; // Import AgentFactory

// Import existing services/agents this agent will interact with (temporarily)
// In a full refactor, the logic from these services would move INTO this agent.
// For MVP, this agent acts as a proxy to the existing services.
// import { MemoryEngine } from '../core/memory/MemoryEngine'; // Access via context
// import { KnowledgeSync } from '../modules/knowledgeSync'; // Access via context
// import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // Access via requestAgent
// import { GlossaryService } from '../core/glossary/GlossaryService'; // Access via context
// import { KnowledgeGraphService } from '../core/wisdom/KnowledgeGraphService'; // Access via context
// import { SacredRuneEngraver } from '../core/rune-engrafting/SacredRuneEngraver'; // Access via requestAgent


export class KnowledgeAgent extends BaseAgent { // Extend BaseAgent
    // private memoryEngine: MemoryEngine; // Access via context
    // private knowledgeSync: KnowledgeSync; // Access via context
    // private wisdomSecretArt: WisdomSecretArt; // Access via requestAgent
    // private glossaryService: GlossaryService; // Access via context
    // private knowledgeGraphService: KnowledgeGraphService; // Access via context
    // private sacredRuneEngraver: SacredRuneEngraver; // Access via requestAgent


    constructor(context: SystemContext) {
        // --- Modified: Call super constructor with agent name ---
        super('knowledge', context); // Call BaseAgent constructor with agent name 'knowledge'
        // --- End Modified ---
        // Services are accessed via context
    }

    /**
     * Initializes the Knowledge Agent.
     */
    init(): void {
        super.init(); // Call base init
        try {
            // Services are accessed via context, no need to get them here explicitly for MVP
            console.log('[KnowledgeAgent] Init completed.');
        } catch (error) {
            console.error('[KnowledgeAgent] Failed during init:', error);
            // Handle error
        }
    }


    /**
     * Handles messages directed to the Knowledge Agent.\
     * Performs database operations using the Supabase client.\
     * @param message The message to handle. Expected payload varies by type.\
     * @returns Promise<AgentResponse> The response containing the DB operation result or error.\
     */\
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        console.log(`[KnowledgeAgent];
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
`);\\\\\\\\\\\\\\\\\\\\\\\\\\\\
\\\\\\\\\\\\
        const userId = this.context.currentUser?.id;\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        if (!userId) {\\\\\\\\\\\\\\\\\\\\\\\\\\\\
             // Return error response if user is not authenticated\\\\\\\\\\\\\\\
             return { success: false, error: 'User not authenticated.' };\\\\\\\\\\\\\\n        }\\\\\\\\\\\\\n\\\\\\n        try {\\\\\\\\\\\\\\\n            let result: any;\\\\\\\\\\\\\\\n            switch (message.type) {\\\\\\\\\\\\\\\n                case 'create_knowledge_point':\\\\\\\\\\\\\\\n                    // Payload is expected to be { question: string, answer: string, source?: string, devLogDetails?: any, is_starred?: boolean, tags?: string[] }\\\\\\\\\\\\\\\n                    if (!message.payload?.question || !message.payload?.answer) {\\\\\\\\\\\\\\\n                         // Return error response if required fields are missing\\\\\\\\\\\\\\\n                         return { success: false, error: 'Question and answer are required to create knowledge point.' };\\\\\\\\\\\\\\\n                    }\\\\\\\\\\\\\n                    // Delegate to MemoryEngine via KnowledgeSync\\\\\\\\\\\\\\\n                    result = await this.context.knowledgeSync?.saveKnowledge(\\\\\\\\\\\\\n                        message.payload.question,\\\\\\\\\\\\\n                        message.payload.answer,\\\\\\\\\\\\\\\n                        userId,\\\\\\\\\\\\\\\n                        message.payload.source,\\\\\\\\\\\\\\\n                        message.payload.devLogDetails,\\\\\\\\\\\\\\\n                        message.payload.is_starred, // Pass is_starred\\\\\\\\\\\\\\\n                        message.payload.tags // Pass tags\\\\\\\\\\\\\\\n                    );\\\\\\\\\\\\\\\n                    if (!result) {\\\\\\\\\\\\\\\n                         // Return error response if delegation failed\\\\\\\\\\\\\\\n                         return { success: false, error: 'Failed to save knowledge point via KnowledgeSync.' };\\\\\\\\\\\\\\\n                    }\\\\\\\\\\\\\n                    return { success: true, data: result };\\\\\\\\\\\\\\\n\\\\\\\\\\\\n                case 'query_knowledge':\\\\\\\\\\\\\\\n                    // Payload is expected to be { query: string, useSemanticSearch?: boolean, language?: string, context?: any }\\\\\\\\\\\\\\\n                     if (!message.payload?.query) {\\\\\\\\\\\\\\\n                         // Return error response if required fields are missing\\\\\\\\\\\\\\\n                         return { success: false, error: 'Query is required to query knowledge.' };\\\\\\\\\\\\\\\n                    }\\\\\\\\\\\\\n                    // Delegate to MemoryEngine via KnowledgeSync\\\\\\\\\\\\\\\n                    result = await this.context.knowledgeSync?.searchKnowledge(\\\\\\\\\\\\\n                        message.payload.query,\\\\\\\\\\\\\n                        userId,\\\\\\\\\\\\\\\n                        message.payload.useSemanticSearch,\\\\\\\\\\\\\\\n                        message.payload.language,\\\\\\\\\\\\\\\n                        message.payload.context // Pass the context parameter\\\\\\\\\\\\\\\n                    );\\\\\\\\\\\\\\\n                    // Result is an array of KnowledgeRecord (can be empty, not an error)\\\\\\\\\\\\\n                    return { success: true, data: result };\\\\\\\\\\\\\\\n\\\\\\n                case 'get_knowledge_by_id':\\\\\\\\\\\\\\\n                    // Payload is expected to be { id: string }\\\\\\\n                    if (!message.payload?.id) {\\\\\\\n                         // Return error response if required fields are missing\\\\\\\n                         return { success: false, error: 'ID is required to get knowledge by ID.' };\\\\\\\n                    }\\\
                    // Delegate to MemoryEngine via KnowledgeSync (assuming KnowledgeSync has this method)\\\
                    // Note: KnowledgeSync currently doesn't have getKnowledgeById. MemoryEngine does.\\
                    // Let's delegate directly to MemoryEngine for MVP.\\
                    if (!this.context.memoryEngine) {\\
                         return { success: false, error: 'MemoryEngine is not available.' };\\
                    }\\
                    result = await this.context.memoryEngine.getKnowledgeById(message.payload.id, userId);\\
                    if (!result) {\\\\\\\
                         // Return not found if record doesn't exist or not accessible\\\\\\\
                         return { success: false, error: `;
Knowledge;
record;
$;
{
    message.payload.id;
}
not;
found;
or;
not;
accessible. ` };\\\\\\\
                    }\\\
                    return { success: true, data: result };\\\
\\\
                case 'update_knowledge':\\\
                    // Payload is expected to be { id: string, updates: Partial<KnowledgeRecord> }\\\
                     if (!message.payload?.id || !message.payload?.updates) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'ID and updates are required to update knowledge.' };\\\
                    }\\\
                    // Delegate to MemoryEngine via KnowledgeSync\\\
                    result = await this.context.knowledgeSync?.updateKnowledge(\\\
                        message.payload.id,\\
                        message.payload.updates,\\
                        userId\\\
                    );\\\
                    if (!result) {\\\
                         // Return error response if delegation failed (e.g., not found or not owned)\\\
                         return { success: false, error: 'Failed to update knowledge point (not found or not owned).' };\\\
                    }\\\
                    return { success: true, data: result };\\\
\\\
                case 'delete_knowledge':\\\
                    // Payload is expected to be { id: string }\\\
                     if (!message.payload?.id) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'ID is required to delete knowledge.' };\\\
                    }\\\
                    // Delegate to MemoryEngine via KnowledgeSync\\\
                    result = await this.context.knowledgeSync?.deleteKnowledge(\\\
                        message.payload.id,\\
                        userId\\\
                    );\\\
                    if (!result) {\\\
                         // Return error response if delegation failed (e.g., not found or not owned)\\\
                         return { success: false, error: 'Failed to delete knowledge point (not found or not owned).' };\\\
                    }\\\
                    return { success: true, data: { id: message.payload.id } }; // Return deleted ID\\\
\\\
                case 'synthesize_knowledge':\\\
                    // Payload is expected to be { recordIds?: string[], collectionId?: string, query?: string, options?: any }\\\
                    const { recordIds, collectionId, query: synthQuery, options } = message.payload;\\\
                    if (!recordIds && !collectionId) {\\\
                         // Return error response if knowledge source is missing\\\
                         return { success: false, error: 'Knowledge source (recordIds or collectionId) is required to synthesize knowledge.' };\\\
                    }\\\
\\\
                    let sourceRecords: KnowledgeRecord[] = [];\\\
                    // --- Modified: Delegate knowledge retrieval to MemoryEngine ---\\\
                    if (!this.context.memoryEngine) {\\\
                         return { success: false, error: 'MemoryEngine is not available for knowledge retrieval.' };\\\
                    }\\\
                    if (collectionId) {\\\
                        // Fetch records from the collection\\\
                        sourceRecords = await this.context.memoryEngine.getRecordsInCollection(collectionId, userId) || [];\\\
                    } else if (recordIds && recordIds.length > 0) {\\\
                        // Fetch specific records by ID (assuming MemoryEngine has a batch get method or iterate)\\\
                        // For MVP, iterate or use getAllKnowledgeForUser and filter\\\
                        const allRecords = await this.context.memoryEngine.getAllKnowledgeForUser(userId) || [];\\\
                        sourceRecords = allRecords.filter(record => recordIds.includes(record.id));\\\
                    }\\\
                    // --- End Modified ---\\\
\\\
                    if (sourceRecords.length === 0) {\\\
                         // Return error response if no source records found\\\
                         return { success: false, error: 'No source records found for synthesis.' };\\\
                    }\\\
\\\
                    // Delegate to WisdomSecretArt for synthesis\\\
                    // --- Modified: Use requestAgent for WisdomSecretArt call ---\\\
                    if (!this.context.agentFactory?.getAgent('wisdom')) {\\\
                         return { success: false, error: 'WisdomAgent not available for synthesis.' };\\\
                    }\\\
                    result = await this.requestAgent(\\\
                        'wisdom', // Target the WisdomAgent\\\
                        'synthesize_knowledge', // Message type for WisdomAgent\\\
                        { records: sourceRecords, query: synthQuery, options: options }, // Pass parameters\\\
                        60000 // Timeout for LLM synthesis\\\
                    ).then(response => {\\\
                         if (!response.success || !response.data) {\\\
                             throw new Error(response.error || 'WisdomAgent failed to return synthesized knowledge.');\\\
                         }\\\
                         return response.data; // Assuming WisdomAgent returns the synthesized data\\\
                    });\\\
                    // --- End Modified ---\\\
\\\
                    if (!result) {\\\
                         // Return error response if delegation failed\\\
                         return { success: false, error: 'Failed to synthesize knowledge via WisdomSecretArt.' };\\\
                    }\\\
                    return { success: true, data: result };\\\
\\\
                case 'suggest_glossary_term':\\\
                    // Payload is expected to be { term: Omit<GlossaryTerm, 'id' | 'creation_timestamp' | 'last_updated_timestamp'> }\\\
                    if (!message.payload?.term) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Term details are required to suggest glossary term.' };\\\
                    }\\\
                    // Delegate to GlossaryService\\\
                    if (!this.context.glossaryService) {\\\
                         return { success: false, error: 'GlossaryService is not available.' };\\\
                    }\\\
                    result = await this.context.glossaryService.createTerm(\\\
                        message.payload.term,\\
                        userId, // Use userId from agent context\\\
                        message.payload.term.is_public // Pass isPublic status from suggestion\\\
                    );\\\
                    // Note: createTerm returns null if the term already exists (not an error)\\\
                    // We return success: true even if null, as the suggestion was processed.\\\
                    return { success: true, data: result };\\\
\\\
                // --- New: Handle Collection Management Messages ---\\\
                case 'create_collection':\\\
                    // Payload: { name: string, description?: string }\\\
                    if (!message.payload?.name) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Collection name is required.' };\\\
                    }\\\
                    // Delegate to MemoryEngine\\\
                    if (!this.context.memoryEngine) {\\\
                         return { success: false, error: 'MemoryEngine is not available.' };\\\
                    }\\\
                    result = await this.context.memoryEngine.createCollection(\\\
                        message.payload.name,\\
                        userId,\\
                        message.payload.description\\\
                    );\\\
                    if (!result) {\\\
                         // Return error response if delegation failed\\\
                         return { success: false, error: 'Failed to create collection via MemoryEngine.' };\\\
                    }\\\
                    return { success: true, data: result };\\\
\\\
                case 'get_collections':\\\
                    // Payload: {}\\\
                    // Delegate to MemoryEngine\\\
                    if (!this.context.memoryEngine) {\\\
                         return { success: false, error: 'MemoryEngine is not available.' };\\\
                    }\\\
                    result = await this.context.memoryEngine.getCollections(userId);\\\
                    return { success: true, data: result };\\\
\\\
                case 'get_collection_by_id':\\\
                    // Payload: { collectionId: string }\\\
                    if (!message.payload?.collectionId) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Collection ID is required.' };\\\
                    }\\\
                    // Delegate to MemoryEngine\\\
                    if (!this.context.memoryEngine) {\\\
                         return { success: false, error: 'MemoryEngine is not available.' };\\\
                    }\\\
                    result = await this.context.memoryEngine.getCollectionById(message.payload.collectionId, userId);\\\
                    if (!result) {\\\
                         // Return not found if collection doesn't exist or not accessible\\\
                         return { success: false, error: `;
Collection;
$;
{
    message.payload.collectionId;
}
not;
found;
or;
not;
accessible. ` };\\\
                    }\\\
                    return { success: true, data: result };\\\
\\\
                case 'get_records_in_collection':\\\
                    // Payload: { collectionId: string }\\\
                    if (!message.payload?.collectionId) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Collection ID is required.' };\\\
                    }\\\
                    // Delegate to MemoryEngine\\\
                    if (!this.context.memoryEngine) {\\\
                         return { success: false, error: 'MemoryEngine is not available.' };\\\
                    }\\\
                    result = await this.context.memoryEngine.getRecordsInCollection(message.payload.collectionId, userId);\\\
                    return { success: true, data: result };\\\
\\\
                case 'add_record_to_collection':\\\
                    // Payload: { collectionId: string, recordId: string }\\\
                    if (!message.payload?.collectionId || !message.payload?.recordId) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Collection ID and Record ID are required.' };\\\
                    }\\\
                    // Delegate to MemoryEngine\\\
                    if (!this.context.memoryEngine) {\\\
                         return { success: false, error: 'MemoryEngine is not available.' };\\\
                    }\\\
                    result = await this.context.memoryEngine.addRecordToCollection(\\\
                        message.payload.collectionId,\\
                        message.payload.recordId,\\
                        userId\\\
                    );\\\
                    // Note: addRecordToCollection returns null if already exists (not an error)\\\
                    return { success: true, data: result };\\\
\\\
                case 'remove_record_from_collection':\\\
                    // Payload: { collectionId: string, recordId: string }\\\
                    if (!message.payload?.collectionId || !message.payload?.recordId) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Collection ID and Record ID are required.' };\\\
                    }\\\
                    // Delegate to MemoryEngine\\\
                    if (!this.context.memoryEngine) {\\\
                         return { success: false, error: 'MemoryEngine is not available.' };\\\
                    }\\\
                    result = await this.context.memoryEngine.removeRecordFromCollection(\\\
                        message.payload.collectionId,\\
                        message.payload.recordId,\\
                        userId\\\
                    );\\\
                    if (!result) {\\\
                         // Return error response if delegation failed (e.g., not found in collection)\\\
                         return { success: false, error: 'Record not found in collection or not accessible.' };\\\
                    }\\\
                    return { success: true, data: { collectionId: message.payload.collectionId, recordId: message.payload.recordId } }; // Return deleted IDs\\\
\\\
                // --- End New ---\\\
\\\
                // --- New: Handle Knowledge Graph Messages ---\\\
                case 'get_graph_data':\\\
                    // Payload: {}\\\
                    // Delegate to KnowledgeGraphService\\\
                    if (!this.context.knowledgeGraphService) {\\\
                         return { success: false, error: 'KnowledgeGraphService is not available.' };\\\
                    }\\\
                    result = await this.context.knowledgeGraphService.getGraphData(userId);\\\
                    return { success: true, data: result };\\\
\\\
                case 'create_relation':\\\
                    // Payload: { sourceRecordId: string, targetRecordId: string, relationType: string, details?: any }\\\
                    if (!message.payload?.sourceRecordId || !message.payload?.targetRecordId || !message.payload?.relationType) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Source ID, Target ID, and Relation Type are required.' };\\\
                    }\\\
                    // Delegate to KnowledgeGraphService\\\
                    if (!this.context.knowledgeGraphService) {\\\
                         return { success: false, error: 'KnowledgeGraphService is not available.' };\\\
                    }\\\
                    result = await this.context.knowledgeGraphService.createRelation(\\\
                        message.payload.sourceRecordId,\\
                        message.payload.targetRecordId,\\
                        message.payload.relationType,\\
                        userId,\\
                        message.payload.details\\\
                    );\\\
                    if (!result) {\\\
                         // Return error response if delegation failed\\\
                         return { success: false, error: 'Failed to create relation.' };\\\
                    }\\\
                    return { success: true, data: result };\\\
\\\
                case 'delete_relation':\\\
                    // Payload: { relationId: string }\\\
                    if (!message.payload?.relationId) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Relation ID is required.' };\\\
                    }\\\
                    // Delegate to KnowledgeGraphService\\\
                    if (!this.context.knowledgeGraphService) {\\\
                         return { success: false, error: 'KnowledgeGraphService is not available.' };\\\
                    }\\\
                    result = await this.context.knowledgeGraphService.deleteRelation(\\\
                        message.payload.relationId,\\
                        userId\\\
                    );\\\
                    if (!result) {\\\
                         // Return error response if delegation failed (e.g., not found)\\\
                         return { success: false, error: 'Relation not found or not accessible.' };\\\
                    }\\\
                    return { success: true, data: { relationId: message.payload.relationId } }; // Return deleted ID\\\
\\\
                // --- End New ---\\\
\\\
                // --- New: Handle Ingest External Knowledge Message ---\\\
                case 'ingest_external_knowledge':\\\
                    // Payload: { source: string, query?: any, options?: any }\\\
                    if (!message.payload?.source) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Knowledge source is required for ingestion.' };\\\
                    }\\\
                    console.log(`[KnowledgeAgent];
Initiating;
ingestion;
from;
external;
source: $;
{
    message.payload.source;
}
`);\\\
                    // Delegate ingestion logic to a dedicated method or service\\\
                    // For MVP, simulate fetching from Capacities Rune and saving\\\
                    if (message.payload.source === 'capacities') {\\\
                        // --- Modified: Use requestAgent for RuneEngraftingAgent call ---\\\
                        if (!this.context.agentFactory?.getAgent('rune_engrafting')) {\\\
                            return { success: false, error: 'RuneEngraftingAgent not available for Capacities ingestion.' };\\\
                        }\\\
                        console.log('[KnowledgeAgent] Fetching data from Capacities Rune...');\\\
                        // Call the getObjects method on the Capacities Rune via RuneEngraftingAgent\\\
                        const runeResponse = await this.requestAgent(\\\
                            'rune_engrafting', // Target the RuneEngrafting Agent\\\
                            'execute_rune_action', // Message type for RuneEngrafting Agent\\\
                            {\\\
                                runeId: 'capacities-rune', // The specific Rune ID for Capacities\\\
                                action: 'getObjects', // The action to execute on the rune\\\
                                params: message.payload.query, // Pass query/options from payload to the rune\\\
                            },\\
                            30000 // Timeout for rune execution\\\
                        );\\\
\\\
                        if (!runeResponse.success || !Array.isArray(runeResponse.data)) {\\\
                            throw new Error(runeResponse.error || 'Failed to fetch data from Capacities Rune.');\\\
                        }\\\
\\\
                        const capacitiesObjects = runeResponse.data;\\\
                        console.log(`[KnowledgeAgent];
Received;
$;
{
    capacitiesObjects.length;
}
objects;
from;
Capacities.Saving;
to;
KB;
`);\\\
\\\
                        // Save each object as a Knowledge Record\\\
                        const savedRecords: KnowledgeRecord[] = [];\\\
                        if (this.context.knowledgeSync) {\\\
                            for (const obj of capacitiesObjects) {\\\
                                try {\\\
                                    // Map Capacities object structure to KnowledgeRecord structure\\\
                                    const recordDetails: Omit<KnowledgeRecord, 'id' | 'timestamp'> = {\\\
                                        question: obj.title || `;
Capacities;
Object;
$;
{
    obj.id;
}
`, // Use title as question\\\
                                        answer: obj.content || JSON.stringify(obj), // Use content or full object as answer\\\
                                        user_id: userId, // Associate with current user\\\
                                        source: `;
capacities: $;
{
    obj.type || 'object';
}
`, // Source indicates origin and type\\\
                                        tags: [...(obj.tags || []), 'capacities'], // Add capacities tag\\\
                                        dev_log_details: { capacitiesId: obj.id, capacitiesType: obj.type }, // Store original ID/type\\\
                                    };\\\
                                    const savedRecord = await this.context.knowledgeSync.saveKnowledge(\\\
                                        recordDetails.question,\\
                                        recordDetails.answer,\\
                                        userId,\\
                                        recordDetails.source,\\
                                        recordDetails.dev_log_details,\\
                                        recordDetails.is_starred,\\
                                        recordDetails.tags\\\
                                    );\\\
                                    if (savedRecord) savedRecords.push(savedRecord);\\\
                                } catch (saveError: any) {\\\
                                    console.error(`[KnowledgeAgent];
Failed;
to;
save;
Capacities;
object;
$;
{
    obj.id;
}
as;
Knowledge;
Record: `, saveError.message);\\\
                                    // Continue to next object even if one fails\\\
                                }\\\
                            }\\\
                        } else {\\\
                            console.warn('[KnowledgeAgent] KnowledgeSync not available to save ingested data.');\\\
                        }\\\
\\\
                        console.log(`[KnowledgeAgent];
Ingestion;
from;
Capacities;
complete.Saved;
$;
{
    savedRecords.length;
}
records. `);\\\
                        result = { message: `;
Ingestion;
from;
Capacities;
complete.Saved;
$;
{
    savedRecords.length;
}
records. `, savedRecordsCount: savedRecords.length };\\\
                        return { success: true, data: result };\\\
\\\
                    } else {\\\
                         // Return error response for unsupported source\\\
                        return { success: false, error: `;
Unsupported;
external;
knowledge;
source;
for (ingestion; ; )
    : $;
{
    message.payload.source;
}
` };\\\
                    }\\\
\\\
                // --- End New ---\\\
\\\
\\\
                default:\\\
                    console.warn(`[KnowledgeAgent];
Unknown;
message;
type: $;
{
    message.type;
}
`);\\\
                    // Return error response for unknown message types\\\
                    return { success: false, error: `;
Unknown;
message;
type;
for (KnowledgeAgent; ; )
    : $;
{
    message.type;
}
` };\\\
            }\\\
        } catch (error: any) {\\\
            console.error(`[KnowledgeAgent];
Error;
handling;
message;
$;
{
    message.type;
}
`, error);\\\
            // Return error response for any caught errors\\\
            return { success: false, error: error.message || 'An error occurred in KnowledgeAgent.' };\\\
        }\\\
    }\\\
\\\
    // TODO: Implement methods to send messages to other agents if needed\\\
    // e.g., notifying SyncAgent after a local change\\\
    // protected sendSyncNotification(payload: any): void {\\\
    //     this.context.messageBus?.send({\\\
    //         type: 'knowledge_data_changed', // Custom event type\\\
    //         payload: payload,\\
    //         sender: this.agentName,\\
    //         // No recipient for a broadcast event\\
    //     });\\
    // }\\
}\\
` ``;
