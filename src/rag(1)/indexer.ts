```typescript
// src/rag/indexer.ts
// RAG Indexer - Converts data into vector embeddings for semantic search.

import { SystemContext, KnowledgeRecord, Task, Goal, UserAction } from '../interfaces';
// import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // Access via requestAgent
// import { MemoryEngine } from '../core/memory/MemoryEngine'; // Access via context
// import { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // Access via context
// import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Access via context
import { BaseAgent, AgentMessage, AgentResponse } from '../agents/BaseAgent'; // Import BaseAgent types

// --- Modified: Extend BaseAgent ---
export class RAGIndexer extends BaseAgent { // Extend BaseAgent
    private context: SystemContext;

    constructor(context: SystemContext) {
        // --- Modified: Call super constructor with agent name ---\
        super('rag_indexer', context); // Call BaseAgent constructor with agent name 'rag_indexer'\
        // --- End Modified ---\
        this.context = context;
        console.log('RAGIndexer initialized.');
    }

    /**
     * Handles messages directed to the RAG Indexer Agent.
     * @param message The message to handle. Expected type: 'index_record' or 'index_all_user_data'.
     * @returns Promise<AgentResponse> The response containing the result or error.
     */
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
        console.log(`[RAGIndexer] Handling message: ${message.type} (Correlation ID: ${message.correlationId || 'N/A'})`);

        const userId = this.context.currentUser?.id;
        if (!userId) {
             return { success: false, error: 'User not authenticated.' };
        }

        try {
            let result: any;
            switch (message.type) {
                case 'index_record':
                    // Payload: { dataType: 'knowledge_record' | 'task' | 'goal' | 'user_action', record: any }
                    if (!message.payload?.dataType || !message.payload?.record) {
                         throw new Error('dataType and record are required to index record.');
                    }
                    // Delegate to indexRecord method
                    await this.indexRecord(message.payload.dataType, message.payload.record, userId);
                    return { success: true, data: { message: `Indexing initiated for ${message.payload.dataType} record ${message.payload.record.id}.` } };

                case 'index_all_user_data':
                    // Payload: {}
                    // Delegate to indexAllUserData method
                    await this.indexAllUserData(userId);
                    return { success: true, data: { message: 'Initial indexing initiated for all user data.' } };

                case 'delete_indexed_record':
                    // Payload: { dataType: 'knowledge_record' | 'task' | 'goal' | 'user_action', recordId: string }
                    if (!message.payload?.dataType || !message.payload?.recordId) {
                         throw new Error('dataType and recordId are required to delete indexed record.');
                    }
                    // Delegate to deleteIndexedRecord method
                    await this.deleteIndexedRecord(message.payload.dataType, message.payload.recordId, userId);
                    return { success: true, data: { message: `Deletion from index initiated for ${message.payload.dataType} record ${message.payload.recordId}.` } };


                default:
                    console.warn(`[RAGIndexer] Unknown message type: ${message.type}`);
                    return { success: false, error: `Unknown message type for RAGIndexer: ${message.type}` };
            }
        } catch (error: any) {
            console.error(`[RAGIndexer] Error handling message ${message.type}:`, error);
            return { success: false, error: error.message || 'An error occurred in RAGIndexer.' };
        }
    }

    /**
     * Creates or updates the vector embedding for a single data record.
     * @param dataType The type of data ('knowledge_record', 'task', 'goal', 'user_action').
     * @param record The data record object.
     * @param userId The user ID. Required.
     * @returns Promise<void>
     */
    async indexRecord(dataType: 'knowledge_record' | 'task' | 'goal' | 'user_action', record: any, userId: string): Promise<void> {
        console.log(`[RAGIndexer] Indexing record: ${dataType} - ${record?.id} for user ${userId}`);
        this.context.loggingService?.logInfo(`Attempting to index record: ${dataType} - ${record?.id}`, { dataType, recordId: record?.id, userId });

        if (!userId || !record?.id) {
            console.warn('[RAGIndexer] Cannot index record: User ID or record ID missing.');
            this.context.loggingService?.logWarning('Cannot index record: User ID or record ID missing.', { dataType, recordId: record?.id, userId });
            return;
        }

        let textToEmbed = '';
        let tableToUpdate = '';

        switch (dataType) {
            case 'knowledge_record':
                const kr = record as KnowledgeRecord;
                textToEmbed = `${kr.question} ${kr.answer} ${kr.tags?.join(' ')}`;
                tableToUpdate = 'knowledge_records';
                break;
            case 'task':
                const task = record as Task;
                textToEmbed = `${task.description} ${task.steps?.map(step => step.description).join(' ')}`;
                tableToUpdate = 'tasks';
                break;
            case 'goal':
                const goal = record as Goal;
                textToEmbed = `${goal.description} ${goal.key_results?.map(kr => kr.description).join(' ')}`;
                tableToUpdate = 'goals';
                break;
            case 'user_action':
                const ua = record as UserAction;
                textToEmbed = `${ua.type} ${JSON.stringify(ua.details)} ${JSON.stringify(ua.context)}`;
                tableToUpdate = 'user_actions';
                break;
            default:
                console.warn(`[RAGIndexer] Unsupported data type for indexing: ${dataType}`);
                this.context.loggingService?.logWarning(`Unsupported data type for indexing: ${dataType}`, { dataType, recordId: record?.id, userId });
                return;
        }

        if (!textToEmbed.trim()) {
             console.log(`[RAGIndexer] No text to embed for ${dataType} record ${record.id}. Skipping.`);
             this.context.loggingService?.logInfo(`No text to embed for ${dataType} record ${record.id}. Skipping.`, { dataType, recordId: record?.id, userId });
             return;
        }

        try {
            // --- Modified: Delegate embedding generation to WisdomAgent ---\
            if (!this.context.agentFactory?.getAgent('wisdom')) {
                 console.warn('[RAGIndexer] WisdomAgent not available for embedding generation.');
                 this.context.loggingService?.logWarning('WisdomAgent not available for embedding generation.', { userId });
                 return;
            }
            console.log('[RAGIndexer] Requesting embedding generation from WisdomAgent...');
            const embeddingResponse = await this.requestAgent(
                'wisdom', // Target the WisdomAgent
                'generate_embedding', // Message type for WisdomAgent
                { text: textToEmbed }, // Pass text to embed
                10000 // Timeout
            );

            if (!embeddingResponse.success || !Array.isArray(embeddingResponse.data)) {
                 throw new Error(embeddingResponse.error || 'WisdomAgent failed to generate embedding.');
            }
            const embedding = embeddingResponse.data; // Assuming data is the embedding vector
            // --- End Modified ---\


            if (embedding) {
                // Update the record in the database with the embedding
                // --- Modified: Delegate database update to SupabaseAgent ---\
                if (!this.context.agentFactory?.getAgent('supabase')) {
                     console.warn('[RAGIndexer] SupabaseAgent not available to update record with embedding.');
                     this.context.loggingService?.logWarning('SupabaseAgent not available to update record with embedding.', { userId });
                     return;
                }
                console.log(`[RAGIndexer] Sending update_record message to SupabaseAgent for table ${tableToUpdate}, record ${record.id}.`);
                const updateResponse = await this.requestAgent(
                    'supabase', // Target the SupabaseAgent
                    'update_record', // Message type for SupabaseAgent
                    { table: tableToUpdate, id: record.id, updates: { embedding_vector: embedding } }, // Pass table, id, updates
                    5000 // Timeout
                );

                if (!updateResponse.success) {
                    console.error(`[RAGIndexer] Failed to update ${dataType} record ${record.id} with embedding via SupabaseAgent:`, updateResponse.error);
                    this.context.loggingService?.logError(`Failed to update ${dataType} record with embedding via SupabaseAgent`, { dataType, recordId: record.id, userId, error: updateResponse.error });
                } else {
                    console.log(`[RAGIndexer] Successfully indexed ${dataType} record ${record.id}.`);
                    this.context.loggingService?.logInfo(`Successfully indexed ${dataType} record ${record.id}.`, { dataType, recordId: record.id, userId });
                }
                // --- End Modified ---\
            }
        } catch (error: any) {
            console.error(`[RAGIndexer] Error during indexing for ${dataType} record ${record.id}:`, error.message);
            this.context.loggingService?.logError(`Error during indexing for ${dataType} record ${record.id}.`, { dataType, recordId: record.id, userId, error: error.message });
            // Do not re-throw, indexing happens asynchronously
        }
    }

    /**
     * Handles the deletion of an indexed record.
     * For Supabase with pgvector, deleting the original record often cascades to the embedding.
     * This method is a placeholder if external vector stores are used or specific cleanup is needed.
     * @param dataType The type of data ('knowledge_record' | 'task' | 'goal' | 'user_action').
     * @param recordId The ID of the record to delete from the index.
     * @param userId The user ID. Required.
     * @returns Promise<void>
     */
    async deleteIndexedRecord(dataType: 'knowledge_record' | 'task' | 'goal' | 'user_action', recordId: string, userId: string): Promise<void> {
        console.log(`[RAGIndexer] Deleting indexed record: ${dataType} - ${recordId} for user ${userId}`);
        this.context.loggingService?.logInfo(`Attempting to delete indexed record: ${dataType} - ${recordId}`, { dataType, recordId, userId });

        if (!userId || !recordId) {
            console.warn('[RAGIndexer] Cannot delete indexed record: User ID or record ID missing.');
            this.context.loggingService?.logWarning('Cannot delete indexed record: User ID or record ID missing.', { dataType, recordId, userId });
            return;
        }

        let tableToDelete = '';

        switch (dataType) {
            case 'knowledge_record': tableToDelete = 'knowledge_records'; break;
            case 'task': tableToDelete = 'tasks'; break;
            case 'goal': tableToDelete = 'goals'; break;
            case 'user_action': tableToDelete = 'user_actions'; break;
            default:
                console.warn(`[RAGIndexer] Unsupported data type for index deletion: ${dataType}`);
                this.context.loggingService?.logWarning(`Unsupported data type for index deletion: ${dataType}`, { dataType, recordId, userId });
                return;
        }

        try {
            // --- Delegate database deletion to SupabaseAgent ---\
            // For Supabase with pgvector, deleting the original record in the table
            // is often sufficient if the embedding is stored in the same row.
            // The foreign key constraint (if embedding was in a separate table)
            // or the row deletion itself handles the cleanup.
            // So, the primary action is to ensure the original record is deleted.
            // We delegate this to the SupabaseAgent.\
            if (!this.context.agentFactory?.getAgent('supabase')) {
                 console.warn('[RAGIndexer] SupabaseAgent not available to delete record.');
                 this.context.loggingService?.logWarning('SupabaseAgent not available to delete record.', { userId });
                 return;
            }
            console.log(`[RAGIndexer] Sending delete_record message to SupabaseAgent for table ${tableToDelete}, record ${recordId}.`);
            const deleteResponse = await this.requestAgent(
                'supabase', // Target the SupabaseAgent
                'delete_record', // Message type for SupabaseAgent
                { table: tableToDelete, id: recordId }, // Pass table and id
                5000 // Timeout
            );

            if (!deleteResponse.success) {
                console.error(`[RAGIndexer] Failed to delete ${dataType} record ${recordId} via SupabaseAgent:`, deleteResponse.error);
                this.context.loggingService?.logError(`Failed to delete ${dataType} record via SupabaseAgent`, { dataType, recordId, userId, error: deleteResponse.error });
            } else {
                console.log(`[RAGIndexer] Successfully deleted ${dataType} record ${recordId} (and its index entry if in the same row).`);
                this.context.loggingService?.logInfo(`Successfully deleted ${dataType} record ${recordId}.`, { dataType, recordId, userId });
            }
            // --- End Delegate ---\

            // If using an external vector store (like Pinecone, Weaviate),
            // you would add logic here to delete the vector from that store
            // using its specific API/SDK.
            // Example (hypothetical):
            // if (this.externalVectorStoreClient) {
            //     await this.externalVectorStoreClient.deleteVector(recordId, dataType);
            //     console.log(`[RAGIndexer] Successfully deleted vector for ${dataType} record ${recordId} from external store.`);
            // }

        } catch (error: any) {
            console.error(`[RAGIndexer] Error during index deletion for ${dataType} record ${recordId}:`, error.message);
            this.context.loggingService?.logError(`Error during index deletion for ${dataType} record ${recordId}.`, { dataType, recordId, userId, error: error.message });
            // Do not re-throw, deletion happens asynchronously
        }
    }


    /**
     * Initiates indexing for all synchronizable user data.
     * This is typically run on initial setup or after a major data import.
     * @param userId The user ID to index data for. Required.
     * @returns Promise<void>
     */
    async indexAllUserData(userId: string): Promise<void> {
        console.log(`[RAGIndexer] Initiating full data indexing for user: ${userId}...`);
        this.context.loggingService?.logInfo(`Initiating full data indexing for user ${userId}`, { userId });

        if (!userId) {
            console.error('[RAGIndexer] Cannot initiate full indexing: User ID is required.');
            this.context.loggingService?.logError('Cannot initiate full indexing: User ID is required.');
            throw new Error('User ID is required to initiate full indexing.');
        }

        // --- Simulate Fetching All Data (Delegate to AnalyticsAgent) ---\
        console.log('[RAGIndexer] Collecting all user data for indexing...');
        try {
            // Use requestAgent to call the AnalyticsAgent to get all data
            const analyticsResponse = await this.requestAgent(
                'analytics', // Target the AnalyticsAgent
                'get_data_for_evolution', // Message type for AnalyticsAgent (reusing this for data collection)
                { timeframe: 'all', userId: userId }, // Pass timeframe 'all' and userId
                30000 // Timeout
            );

            if (!analyticsResponse.success || !analyticsResponse.data) {
                 throw new Error(analyticsResponse.error || 'AnalyticsAgent failed to get all data for indexing.');
            }
            const allUserData = analyticsResponse.data;
            const { userActions, tasks, goals, knowledgeRecords } = allUserData; // Destructure relevant data

            console.log(`[RAGIndexer] Data collection complete for indexing. Found ${knowledgeRecords?.length || 0} KB records, ${tasks?.length || 0} tasks, ${goals?.length || 0} goals, ${userActions?.length || 0} actions.`);
            this.context.loggingService?.logInfo(`Data collection complete for indexing.`, { userId, kbCount: knowledgeRecords?.length || 0, taskCount: tasks?.length || 0, goalCount: goals?.length || 0, actionCount: userActions?.length || 0 });


            // --- Index Each Record (Delegate to indexRecord) ---\
            console.log('[RAGIndexer] Indexing collected records...');
            const recordsToIndex: Array<{ dataType: 'knowledge_record' | 'task' | 'goal' | 'user_action', record: any }> = [];

            if (knowledgeRecords) recordsToIndex.push(...knowledgeRecords.map((r: any) => ({ dataType: 'knowledge_record', record: r })));
            if (tasks) recordsToIndex.push(...tasks.map((t: any) => ({ dataType: 'task', record: t })));
            if (goals) recordsToIndex.push(...goals.map((g: any) => ({ dataType: 'goal', record: g })));
            if (userActions) recordsToIndex.push(...userActions.map((a: any) => ({ dataType: 'user_action', record: a })));

            console.log(`[RAGIndexer] Total records to index: ${recordsToIndex.length}`);
            this.context.loggingService?.logInfo(`Total records to index: ${recordsToIndex.length}`, { userId, count: recordsToIndex.length });


            // Index records sequentially or in batches (sequentially for simplicity in MVP)
            for (const item of recordsToIndex) {
                try {
                    await this.indexRecord(item.dataType, item.record, userId);
                } catch (indexError: any) {
                    console.error(`[RAGIndexer] Error indexing record ${item.dataType} - ${item.record?.id} during full index:`, indexError.message);
                    this.context.loggingService?.logError(`Error indexing record during full index`, { userId, dataType: item.dataType, recordId: item.record?.id, error: indexError.message });
                    // Continue to the next record even if one fails
                }
            }

            console.log(`[RAGIndexer] Full data indexing complete for user: ${userId}.`);
            this.context.loggingService?.logInfo(`Full data indexing complete for user ${userId}`, { userId });

            // TODO: Publish an event when full indexing is complete
            // this.context.eventBus?.publish('full_indexing_completed', { userId }, userId);

        } catch (error: any) {
            console.error(`[RAGIndexer] Error during full data indexing for user ${userId}:`, error.message);
            this.context.loggingService?.logError(`Full data indexing failed for user ${userId}`, { userId, error: error.message });
            // TODO: Publish an event indicating failure
            // this.context.eventBus?.publish('full_indexing_failed', { userId, error: error.message }, userId);
            throw error; // Re-throw the error
        }
    }


    // TODO: Implement methods for continuous indexing (triggered by data changes - handled by MemoryEngine/other services publishing events).
    // TODO: Implement methods for re-indexing (e.g., when the embedding model changes).
    // TODO: This module is part of the Wisdom Precipitation (\u667a\u6167\u6c89\u6fb1) pillar and supports the "Precipitate" step (specifically vector precipitation).
}
```