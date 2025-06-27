```typescript
// src/core/memory/MemoryEngine.ts
// \u6c38\u4e45\u8a18\u61b6\u4e2d\u5fc3 (Long-term Memory Engine) - \u6838\u5fc3\u6a21\u7d44
// Manages the persistence, retrieval, updating, and deletion of core data types
// like Knowledge Records, Collections, Glossary Terms, and Knowledge Relations.
// Interacts directly with the database (Supabase).
// Part of the Long-term Memory pillar and the Bidirectional Sync Domain (\u96d9\u5410\u540c\u6b65\u9818\u57df).
// Design Principle: Provides a reliable and structured storage layer for user data.
// --- Modified: Implement CRUD for Knowledge Records --
// --- Modified: Implement CRUD for Knowledge Collections --
// --- Modified: Implement CRUD for Knowledge Collection Records (Join Table) --
// --- Modified: Implement CRUD for Glossary Terms --
// --- Modified: Implement CRUD for Knowledge Relations --
// --- Modified: Add interaction with RAG Indexer for embeddings --
// --- New: Implement Realtime Subscriptions for all relevant tables --
// --- Modified: Add language parameter to relevant methods and DB operations --
// --- Modified: Implement updateCollection and deleteCollection methods --
// --- Modified: Implement updateTerm and deleteTerm methods --
// --- Modified: Implement updateRelation method --


import { SupabaseClient } from '@supabase/supabase-js';
import { SystemContext, KnowledgeRecord, GlossaryTerm, KnowledgeCollection, KnowledgeRelation } from '../../interfaces';
// import { LoggingService } from '../logging/LoggingService'; // Dependency
// import { EventBus } from '../../modules/events/EventBus'; // Dependency
// import { RAGIndexer } from '../../rag/indexer'; // Access via requestAgent


export class MemoryEngine {
    private context: SystemContext;
    private supabase: SupabaseClient;
    // private loggingService: LoggingService; // Access via context
    // private eventBus: EventBus; // Access via context
    // private ragIndexer: RAGIndexer; // Access via requestAgent

    // --- New: Realtime Subscriptions ---
    // Store subscriptions per table to manage them.
    private realtimeSubscriptions: Map<string, any> = new Map();
    // --- End New ---


    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
        // this.loggingService = context.loggingService;
        // this.eventBus = context.eventBus;
        console.log('MemoryEngine initialized.');

        // --- New: Set up Supabase Realtime subscriptions for relevant tables ---
        // Subscribe when the user is authenticated.
        this.context.securityService?.onAuthStateChange((user) => {
            if (user) {
                this.subscribeToTableUpdates('knowledge_records', user.id);
                this.subscribeToTableUpdates('knowledge_collections', user.id);
                this.subscribeToTableUpdates('knowledge_collection_records', user.id);
                this.subscribeToTableUpdates('glossary', user.id);
                this.subscribeToTableUpdates('knowledge_relations', user.id);
                // TODO: Subscribe to other relevant tables if they are part of MemoryEngine's domain
            } else {
                this.unsubscribeFromAllTableUpdates();
            }
        });
        // --- End New ---
    }

    // --- New: Realtime Subscription Methods ---
    /**
     * Subscribes to real-time updates from a specific table for the current user (user-owned and public).
     * @param table The name of the table to subscribe to. Required.
     * @param userId The user ID to filter updates by. Required.
     */
    private subscribeToTableUpdates(table: string, userId: string): void {
        console.log(`[MemoryEngine] Subscribing to ${table} realtime updates for user: ${userId}`);
        this.context.loggingService?.logInfo(`Subscribing to ${table} realtime updates`, { userId, table });

        if (this.realtimeSubscriptions.has(table)) {
            console.warn(`[MemoryEngine] Already subscribed to ${table} updates. Unsubscribing existing.`);
            this.unsubscribeFromTableUpdates(table);
        }

        // Subscribe to changes where user_id is null (public) OR user_id is the current user.
        // RLS should ensure user only receives updates for data they can see.
        // We subscribe to all changes on the table and rely on RLS filtering.
        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.
        // Let's switch to subscribing to the table name channel and rely entirely on RLS.

        const subscription = this.supabase
            .channel(table) // Subscribe to all changes on the table
            .on('postgres_changes', { event: '*', schema: 'public', table: table }, async (payload) => { // No filter here, rely on RLS
                console.log(`[MemoryEngine] Realtime ${table} change received:`, payload);
                const record = payload.new as any; // New data for INSERT/UPDATE
                const oldRecord = payload.old as any; // Old data for UPDATE/DELETE
                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';

                // Check if the change is relevant to the current user (user-owned or public)
                // RLS should handle this, but client-side check adds safety.
                // This check depends on the table structure (does it have user_id and is_public?)
                // For simplicity, assume relevant if user_id matches or is_public is true (if applicable)
                const relevantRecord = record || oldRecord;
                const isRelevant = relevantRecord?.user_id === userId || relevantRecord?.is_public === true; // Simplified check


                if (isRelevant) {
                    console.log(`[MemoryEngine] Processing relevant ${table} change (${eventType}): ${relevantRecord.id}`);

                    // Publish an event via EventBus for other modules/UI to react
                    // Include the user_id in the event payload for filtering
                    this.context.eventBus?.publish(`${table}_${eventType.toLowerCase()}`, record || oldRecord, userId); // e.g., 'knowledge_records_insert', 'glossary_update'

                    // --- New: Notify SyncService about remote change ---
                    // This is the primary way SyncService learns about changes from other devices.
                    this.context.syncService?.handleRemoteDataChange(table, eventType, record || oldRecord, userId)
                         .catch((syncError: any) => console.error(`Error notifying SyncService for remote ${table} change:`, syncError));
                    // --- End New ---

                    // --- New: Trigger RAG Indexing for relevant changes ---
                    // Only index INSERTs and UPDATEs for data types that have embeddings.
                    const indexableDataTypes = ['knowledge_records', 'tasks', 'goals', 'user_actions']; // Tables with embeddings
                    if ((eventType === 'INSERT' || eventType === 'UPDATE') && indexableDataTypes.includes(table)) {
                         console.log(`[MemoryEngine] Triggering RAG indexing for ${table} record ${record.id}.`);
                         // Send a message to the RAGIndexer Agent
                         if (this.context.agentFactory?.getAgent('rag_indexer')) {
                             this.context.messageBus?.send({
                                 type: 'index_record', // Message type for RAGIndexer
                                 payload: { dataType: table.replace(/s$/, ''), record: record }, // Pass data type (singular) and the record
                                 recipient: 'rag_indexer', // Target the RAGIndexer Agent
                                 sender: 'memory_engine', // Identify the sender
                             });
                         } else {
                             console.warn('[MemoryEngine] RAGIndexer Agent not available. Cannot trigger indexing for new record.');
                         }
                    }
                    // --- End New ---

                } else {
                    console.log(`[MemoryEngine] Received ${table} change not relevant to current user (filtered by RLS or client-side).`);
                }
            })
            .subscribe((status, err) => {
                 console.log(`[MemoryEngine] ${table} subscription status:`, status);
                 if (status === 'CHANNEL_ERROR') {
                     console.error(`[MemoryEngine] ${table} subscription error:`, err);
                     this.context.loggingService?.logError(`${table} subscription error`, { userId, table, error: err?.message });
                 }
            });

        this.realtimeSubscriptions.set(table, subscription);
    }

    /**
     * Unsubscribes from real-time updates for a specific table.
     * @param table The name of the table to unsubscribe from. Required.
     */
    private unsubscribeFromTableUpdates(table: string): void {
        const subscription = this.realtimeSubscriptions.get(table);
        if (subscription) {
            console.log(`[MemoryEngine] Unsubscribing from ${table} realtime updates.`);
            this.context.loggingService?.logInfo(`Unsubscribing from ${table} realtime updates`, { table });
            this.supabase.removeChannel(subscription);
            this.realtimeSubscriptions.delete(table);
        }
    }

    /**
     * Unsubscribes from all active real-time updates.
     */
    private unsubscribeFromAllTableUpdates(): void {
        console.log('[MemoryEngine] Unsubscribing from all realtime updates.');
        this.context.loggingService?.logInfo('Unsubscribing from all realtime updates');
        this.realtimeSubscriptions.forEach((_, table) => {
            this.unsubscribeFromTableUpdates(table);
        });
    }
    // --- End New ---


    // --- Knowledge Record CRUD (\u77e5\u8b58\u8a18\u9304) ---
    /**
     * Records a new knowledge record in Supabase.
     * @param question The question part. Required.
     * @param answer The answer part. Required.
     * @param userId The user ID to associate the record with. Required.
     * @param source Optional source of the knowledge.
     * @param devLogDetails Optional JSONB for dev log details.
     * @param isStarred Optional: Whether to star the record. Defaults to false.
     * @param tags Optional tags.
     * @param language Optional: Language of the content. Defaults to user preference or system default.
     * @returns Promise<KnowledgeRecord | null> The created KnowledgeRecord or null on failure.
     * Privacy Note: Knowledge Records are stored with a user_id and are subject to Row Level Security (RLS)
     * policies in Supabase, ensuring users can only access their own data.
     */
    async recordKnowledge(question: string, answer: string, userId: string, source?: string, devLogDetails?: any, isStarred: boolean = false, tags?: string[], language?: string): Promise<KnowledgeRecord | null> {
        console.log('[MemoryEngine] Recording knowledge for user:', userId);
        this.context.loggingService?.logInfo('Attempting to record knowledge', { userId, source, isStarred, tags, language });

        if (!userId || !question || !answer) {
            console.error('[MemoryEngine] Cannot record knowledge: User ID, question, and answer are required.');
            this.context.loggingService?.logError('Cannot record knowledge: Missing required fields.', { userId });
            throw new Error('User ID, question, and answer are required to record knowledge.');
        }

        const contentLanguage = language || this.context.currentUser?.language_preference || 'en'; // Default to English if no preference

        const newRecordData: Omit<KnowledgeRecord, 'id' | 'timestamp' | 'embedding_vector'> = {
            question,
            answer,
            user_id: userId, // Associate with user
            source: source || null, // Use null if source is undefined
            tags: tags || [], // Ensure tags is an array
            dev_log_details: devLogDetails || null, // Use null if devLogDetails is undefined
            is_starred: isStarred,
            language: contentLanguage, // Store the language
            // timestamp is set by the database default
            // embedding_vector is generated and updated asynchronously by RAG Indexer
        };

        try {
            // Insert into Supabase (Supports Bidirectional Sync Domain)
            const { data, error } = await this.supabase
                .from('knowledge_records')
                .insert([newRecordData])
                .select() // Select the inserted data to get the generated ID and timestamp
                .single(); // Expecting a single record back

            if (error) {
                console.error('Error recording knowledge to Supabase:', error);
                this.context.loggingService?.logError('Failed to record knowledge', { userId: userId, error: error.message });
                throw error; // Re-throw the error
            }

            const createdRecord = data as KnowledgeRecord;
            console.log('Knowledge recorded:', createdRecord.id, '-', createdRecord.question, 'for user:', createdRecord.user_id, 'Language:', createdRecord.language);

            // --- New: Trigger RAG Indexing for the new record ---
            // Send a message to the RAGIndexer Agent asynchronously.
            if (this.context.agentFactory?.getAgent('rag_indexer')) {
                this.context.messageBus?.send({
                    type: 'index_record', // Message type for RAGIndexer
                    payload: { dataType: 'knowledge_record', record: createdRecord }, // Pass data type and the created record
                    recipient: 'rag_indexer', // Target the RAGIndexer Agent
                    sender: 'memory_engine', // Identify the sender
                });
            } else {
                console.warn('[MemoryEngine] RAGIndexer Agent not available. Cannot trigger indexing for new record.');
            }
            // --- End New ---

            // Publish a 'knowledge_record_created' event via EventBus (Supports Event Push - call context.eventBus.publish)
            // The Realtime subscription will also publish events, so be careful not to duplicate processing.
            // For now, let's rely on the Realtime subscription to be the source of events for UI updates.
            this.context.eventBus?.publish('knowledge_record_created', createdRecord, userId); // Include userId in event

            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly
            // this.context.syncService?.handleLocalDataChange('memoryEngine', 'INSERT', createdRecord, userId)
            //     .catch(syncError => console.error('Error notifying SyncService for KnowledgeRecord insert:', syncError));


            return createdRecord;

        } catch (error: any) {
            console.error('Failed to record knowledge:', error);
            this.context.loggingService?.logError('Failed to record knowledge', { userId: userId, error: error.message });
            return null; // Return null on failure
        }
    }

    /**
     * Retrieves knowledge records for a specific user from Supabase.
     * Can perform keyword or semantic search.
     * @param query The search query. Required.
     * @param userId The user ID. Required.
     * @param useSemanticSearch Optional: Whether to use semantic search. Defaults to false.
     * @param language Optional: Filter results by language. Defaults to undefined (all languages).
     * @param context Optional: Contextual information for the query (e.g., conversation history, current page).
     * @param limit Optional: Maximum number of results to return. Defaults to 100.
     * @returns Promise<KnowledgeRecord[]> An array of matching records.
     */
    async queryKnowledge(query: string, userId: string, useSemanticSearch: boolean = false, language?: string, context?: any, limit: number = 100): Promise<KnowledgeRecord[]> {
        console.log(`[MemoryEngine] Querying knowledge for user: ${userId} with query: \"${query}\" (Semantic: ${useSemanticSearch}, Language: ${language || 'all'}, Context: ${context ? 'present' : 'absent'}, Limit: ${limit})`);
        this.context.loggingService?.logInfo('Attempting to query knowledge', { query, userId, useSemanticSearch, language, context: !!context, limit });

        if (!userId || !query) {
            console.warn('[MemoryEngine] Search query and user ID are required.');
            this.context.loggingService?.logWarning('Search query and user ID are required.');
            return [];
        }

        try {
            let dbQuery;

            if (useSemanticSearch) {
                // --- New: Perform semantic search using vector similarity ---
                // Requires the 'embedding_vector' column and 'pgvector' extension.
                // Need to generate an embedding for the query first.
                if (!this.context.agentFactory?.getAgent('wisdom')) {
                     console.warn('[MemoryEngine] WisdomAgent not available for embedding generation. Falling back to keyword search.');
                     useSemanticSearch = false; // Fallback
                } else {
                     console.log('[MemoryEngine] Requesting query embedding from WisdomAgent for semantic search...');
                     const embeddingResponse = await this.context.agentFactory.getAgent('wisdom')!.requestAgent(
                         'wisdom', // Target the WisdomAgent
                         'generate_embedding', // Message type for WisdomAgent
                         { text: query }, // Pass query text
                         10000 // Timeout
                     );

                     if (!embeddingResponse.success || !Array.isArray(embeddingResponse.data)) {
                          console.warn('[MemoryEngine] Failed to generate embedding for query. Falling back to keyword search.');
                          this.context.loggingService?.logWarning('Failed to generate embedding for query. Falling back to keyword search.', { userId, query, error: embeddingResponse.error });
                          useSemanticSearch = false; // Fallback
                     } else {
                         const queryEmbedding = embeddingResponse.data;
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
                         const { data, error } = await dbQuery;
                         if (error) throw error;
                         const records = data as KnowledgeRecord[];
                         console.log(`[MemoryEngine] Semantic search completed. Found ${records.length} results.`);
                         this.context.loggingService?.logInfo(`Semantic search completed. Found ${records.length} results.`, { userId, query, language, limit });
                         return records; // Return results from semantic search
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

            dbQuery = dbQuery.order('timestamp', { ascending: false } as any) // Order by newest first
                             .limit(limit); // Apply limit

            const { data, error } = await dbQuery;

            if (error) throw error;

            const records = data as KnowledgeRecord[];
            console.log(`[MemoryEngine] Keyword search completed. Found ${records.length} results.`);
            this.context.loggingService?.logInfo(`Keyword search completed. Found ${records.length} results.`, { userId, query, language, limit });

            return records;

        } catch (error: any) {
            console.error('[MemoryEngine] Error querying knowledge:', error);
            this.context.loggingService?.logError('Error querying knowledge', { query, userId: userId, useSemanticSearch, language, context: !!context, limit, error: error.message });
            throw error; // Re-throw the error
        }
    }

     /**
     * Fetches all knowledge records for a specific user from Supabase.
     * @param userId The user ID. Required.
     * @returns Promise<KnowledgeRecord[]> An array of all records for the user.
     */
    async getAllKnowledgeForUser(userId: string): Promise<KnowledgeRecord[]> {
        console.log(`[MemoryEngine] Getting all knowledge for user: ${userId}`);
        this.context.loggingService?.logInfo('Attempting to get all knowledge', { userId });

        if (!userId) {
            console.warn('[MemoryEngine] User ID is required to get all knowledge.');
            this.context.loggingService?.logWarning('User ID is required to get all knowledge.');
            return [];
        }

        try {
            // Fetch all records from Supabase, filtered by user_id
            const { data, error } = await this.supabase
                .from('knowledge_records')
                .select('*')
                .eq('user_id', userId)
                .order('timestamp', { ascending: false } as any); // Order by newest first

            if (error) throw error;

            const records = data as KnowledgeRecord[];
            console.log(`[MemoryEngine] Fetched ${records.length} records.`);
            this.context.loggingService?.logInfo(`Fetched ${records.length} records.`, { userId: userId });

            return records;

        } catch (error: any) {
            console.error('[MemoryEngine] Error getting all knowledge:', error);
            this.context.loggingService?.logError('Error getting all knowledge', { userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }


    /**
     * Updates an existing knowledge record in Supabase.
     * @param id The ID of the record. Required.
     * @param updates The updates to apply (question, answer, source, tags, is_starred, dev_log_details, language). Required.
     * @param userId The user ID for verification (checks ownership). Required.
     * @returns Promise<KnowledgeRecord | undefined> The updated KnowledgeRecord or undefined if not found or user mismatch.
     * Privacy Note: RLS policies ensure users can only update their own records.
     */
    async updateKnowledge(id: string, updates: Partial<Omit<KnowledgeRecord, 'id' | 'timestamp' | 'user_id' | 'embedding_vector'>>, userId: string): Promise<KnowledgeRecord | undefined> {
        console.log(`[MemoryEngine] Updating knowledge record ${id} for user: ${userId}`, updates);
        this.context.loggingService?.logInfo(`Attempting to update knowledge record ${id}`, { id, updates, userId });

        if (!id || !userId || Object.keys(updates).length === 0) {
            console.warn('[MemoryEngine] Update failed: ID, user ID, and updates are required.');
            this.context.loggingService?.logWarning('Update failed: ID, user ID, and updates are required.', { id, userId, updates });
            throw new Error('ID, user ID, and updates are required.');
        }

        // Ensure language is included if updating content fields
        if ((updates.question || updates.answer) && !updates.language) {
             updates.language = this.context.currentUser?.language_preference || 'en';
        }


        try {
            // Persist update to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership
            const { data, error } = await this.supabase
                .from('knowledge_records')
                .update(updates)
                .eq('id', id)
                .eq('user_id', userId) // Ensure ownership
                .select() // Select updated record data
                .single(); // Expecting a single record back

            if (error) throw error;
            if (!data) { // Should not happen if RLS is correct and ID/user_id match
                 console.warn(`Knowledge record ${id} not found or does not belong to user ${userId} for update.`);
                 this.context.loggingService?.logWarning(`Knowledge record not found or user mismatch for update: ${id}`, { userId });
                 return undefined;
            }

            const updatedRecord = data as KnowledgeRecord;

            console.log(`Knowledge record ${id} updated in Supabase. Language: ${updatedRecord.language}`);

            // --- New: Trigger RAG Indexing for the updated record if content changed ---
            // Check if question, answer, or tags were updated.
            // This requires comparing old and new values, which is complex here.
            // For simplicity, trigger indexing on ANY update for MVP.
            console.log(`[MemoryEngine] Triggering RAG indexing for updated record: ${updatedRecord.id}.`);
            if (this.context.agentFactory?.getAgent('rag_indexer')) {
                this.context.messageBus?.send({
                    type: 'index_record', // Message type for RAGIndexer
                    payload: { dataType: 'knowledge_record', record: updatedRecord }, // Pass data type and the updated record
                    recipient: 'rag_indexer', // Target the RAGIndexer Agent
                    sender: 'memory_engine', // Identify the sender
                });
            } else {
                console.warn('[MemoryEngine] RAGIndexer Agent not available. Cannot trigger indexing for updated record.');
            }
            // --- End New ---


            // Publish an event indicating a knowledge record has been updated (part of Six Styles/EventBus)
            // The Realtime subscription will also trigger this event, so be careful not to duplicate processing.
            this.context.eventBus?.publish('knowledge_record_updated', updatedRecord, userId); // Include userId in event

            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly
            // this.context.syncService?.handleLocalDataChange('memoryEngine', 'UPDATE', updatedRecord, userId)
            //      .catch(syncError => console.error('Error notifying SyncService for KnowledgeRecord update:', syncError));


            return updatedRecord;

        } catch (error: any) {
            console.error(`Failed to update knowledge record ${id}:`, error);
            this.context.loggingService?.logError(`Failed to update knowledge record ${id}`, { id: id, updates, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Deletes a knowledge record for a specific user from Supabase.
     * @param id The ID of the record. Required.
     * @param userId The user ID for verification (checks ownership). Required.
     * @returns Promise<boolean> True if deletion was successful, false otherwise.
     * Privacy Note: RLS policies ensure users can only delete their own records.
     */
    async deleteKnowledge(id: string, userId: string): Promise<boolean> {
        console.log(`[MemoryEngine] Deleting knowledge record ${id} from Supabase for user ${userId}...`);
        this.context.loggingService?.logInfo(`Attempting to delete knowledge record ${id}`, { id, userId });

        if (!id || !userId) {
            console.warn('[MemoryEngine] Cannot delete knowledge: ID and user ID are required.');
            this.context.loggingService?.logWarning('Cannot delete knowledge: ID and user ID are required.', { id, userId });
            throw new Error('ID and user ID are required.');
        }

        try {
            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership
            const { count, error } = await this.supabase
                .from('knowledge_records')
                .delete()
                .eq('id', id)
                .eq('user_id', userId) // Ensure ownership
                .select('id', { count: 'exact' }); // Select count to check if a row was deleted

            if (error) throw error;

            const deleted = count !== null && count > 0; // Check if count is greater than 0

            if (deleted) {
                console.log(`Knowledge record ${id} deleted from Supabase.`);

                // --- New: Trigger RAG Indexing for deletion ---
                // Send a message to the RAGIndexer Agent asynchronously.
                console.log(`[MemoryEngine] Triggering RAG indexing for deleted record: ${id}.`);
                if (this.context.agentFactory?.getAgent('rag_indexer')) {
                    this.context.messageBus?.send({
                        type: 'delete_indexed_record', // Message type for RAGIndexer
                        payload: { dataType: 'knowledge_record', recordId: id }, // Pass data type and the deleted record ID
                        recipient: 'rag_indexer', // Target the RAGIndexer Agent
                        sender: 'memory_engine', // Identify the sender
                    });
                } else {
                    console.warn('[MemoryEngine] RAGIndexer Agent not available. Cannot trigger indexing for deleted record.');
                }
                // --- End New ---

                // Publish an event indicating a knowledge record has been deleted (part of Six Styles/EventBus)
                // The Realtime subscription will also trigger this event, so be careful not to duplicate processing.
                this.context.eventBus?.publish('knowledge_record_deleted', { id: id, userId: userId }, userId); // Include userId in event

                // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly
                // this.context.syncService?.handleLocalDataChange('memoryEngine', 'DELETE', { id: id }, userId)
                //      .catch(syncError => console.error('Error notifying SyncService for KnowledgeRecord delete:', syncError));

            } else {
                console.warn(`Knowledge record ${id} not found for deletion or user mismatch.`);
                this.context.loggingService?.logWarning(`Knowledge record not found for deletion or user mismatch: ${id}`, { id: id, userId });
            }
            return deleted;

        } catch (error: any) {
            console.error(`Failed to delete knowledge record ${id}:`, error);
            this.context.loggingService?.logError(`Failed to delete knowledge record ${id}`, { id: id, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
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
    async createCollection(name: string, userId: string, description?: string, isPublic: boolean = false, language?: string): Promise<KnowledgeCollection | null> {
        console.log('[MemoryEngine] Creating collection for user:', userId);
        this.context.loggingService?.logInfo('Attempting to create collection', { userId, name, isPublic, language });

        if (!userId || !name) {
            console.error('[MemoryEngine] Cannot create collection: User ID and name are required.');
            this.context.loggingService?.logError('Cannot create collection: Missing required fields.', { userId, name });
            throw new Error('User ID and name are required to create a collection.');
        }

        const contentLanguage = language || this.context.currentUser?.language_preference || 'en'; // Default to English if no preference

        const newCollectionData: Omit<KnowledgeCollection, 'id' | 'creation_timestamp' | 'last_updated_timestamp'> = {
            name,
            description: description || null,
            user_id: userId,
            is_public: isPublic,
            language: contentLanguage, // Store the language
            // timestamps are set by the database default
        };

        try {
            const { data, error } = await this.supabase
                .from('knowledge_collections')
                .insert([newCollectionData])
                .select()
                .single();

            if (error) {
                console.error('Error creating collection:', error);
                this.context.loggingService?.logError('Failed to create collection', { userId: userId, name: name, error: error.message });
                throw error;
            }

            const createdCollection = data as KnowledgeCollection;
            console.log('Collection created:', createdCollection.id, '-', createdCollection.name);

            // Publish event
            this.context.eventBus?.publish('knowledge_collection_created', createdCollection, userId);

            // TODO: Notify SyncService

            return createdCollection;

        } catch (error: any) {
            console.error('Failed to create collection:', error);
            this.context.loggingService?.logError('Failed to create collection', { userId: userId, name: name, error: error.message });
            return null;
        }
    }

    /**
     * Retrieves knowledge collections for a user (their private and all public) from Supabase.
     * @param userId The user ID. Required to filter private terms.
     * @returns Promise<KnowledgeCollection[]> An array of collections.
     */
    async getCollections(userId: string): Promise<KnowledgeCollection[]> {
        console.log('[MemoryEngine] Retrieving collections for user:', userId);
        this.context.loggingService?.logInfo('Attempting to fetch collections', { userId });

        if (!userId) {
            console.warn('[MemoryEngine] User ID is required to get collections.');
            this.context.loggingService?.logWarning('User ID is required to get collections.');
            return [];
        }

        try {
            // Fetch collections filtered by user_id OR is_public
            const { data, error } = await this.supabase
                .from('knowledge_collections')
                .select('*')
                .or(`user_id.eq.${userId},is_public.eq.true`)
                .order('name', { ascending: true } as any);

            if (error) throw error;

            const collections = data as KnowledgeCollection[];
            console.log(`[MemoryEngine] Fetched ${collections.length} collections.`);
            this.context.loggingService?.logInfo(`Fetched ${collections.length} collections.`, { userId: userId });

            return collections;

        } catch (error: any) {
            console.error('Error fetching collections:', error);
            this.context.loggingService?.logError('Failed to fetch collections', { userId: userId, error: error.message });
            return [];
        }
    }

    /**
     * Retrieves a specific knowledge collection by ID for a user.
     * Checks if the collection is public or owned by the user.
     * @param collectionId The ID of the collection. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<KnowledgeCollection | undefined> The collection or undefined.
     */
    async getCollectionById(collectionId: string, userId: string): Promise<KnowledgeCollection | undefined> {
        console.log('[MemoryEngine] Retrieving collection by ID:', collectionId, 'for user:', userId);
        this.context.loggingService?.logInfo(`Attempting to fetch collection ${collectionId}`, { id: collectionId, userId });

         if (!userId) {
             console.warn('[MemoryEngine] Cannot retrieve collection: User ID is required.');
             this.context.loggingService?.logWarning('Cannot retrieve collection: User ID is required.');
             return undefined;
         }
        try {
            // Fetch collection by ID and check if it's public OR owned by the user
              const { data, error } = await this.supabase
                  .from('knowledge_collections')
                  .select('*')
                  .eq('id', collectionId)
                  .or(`user_id.eq.${userId},is_public.eq.true`)
                  .single();

              if (error) throw error;
              if (!data) { return undefined; } // Collection not found or doesn't belong to user/is not public

              const collection = data as KnowledgeCollection;

              console.log(`Fetched collection ${collectionId} for user ${userId}.`);
              this.context.loggingService?.logInfo(`Fetched collection ${collectionId} successfully.`, { id: collectionId, userId: userId });

              return collection;

        } catch (error: any) {
            console.error(`Error fetching collection ${collectionId}:`, error);
            this.context.loggingService?.logError(`Failed to fetch collection ${collectionId}`, { id: collectionId, userId: userId, error: error.message });
            return undefined;
        }
    }

    /**
     * Updates an existing knowledge collection in Supabase.
     * Only allows updating collections owned by the user.
     * @param collectionId The ID of the collection. Required.
     * @param updates The updates to apply (name, description, is_public, language). Required.
     * @param userId The user ID for verification (checks ownership). Required.
     * @returns Promise<KnowledgeCollection | undefined> The updated collection or undefined if not found or user mismatch.
     */
    async updateCollection(collectionId: string, updates: Partial<Omit<KnowledgeCollection, 'id' | 'user_id' | 'creation_timestamp' | 'last_updated_timestamp'>>, userId: string): Promise<KnowledgeCollection | undefined> {
        console.log(`[MemoryEngine] Updating collection ${collectionId} in Supabase for user ${userId}...`, updates);
        this.context.loggingService?.logInfo(`Attempting to update collection ${collectionId}`, { id: collectionId, updates, userId });

         if (!userId) {
             console.warn('[MemoryEngine] Cannot update collection: User ID is required.');
             this.context.loggingService?.logWarning('Cannot update collection: User ID is required.');
             return undefined;
         }

        // Ensure language is included if updating name/description
        if ((updates.name || updates.description) && !updates.language) {
             updates.language = this.context.currentUser?.language_preference || 'en';
        }


        try {
            // Persist update to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership and that it's not a public collection (unless admin)
              const { data, error } = await this.supabase
                  .from('knowledge_collections')
                  .update(updates)
                  .eq('id', collectionId)
                  .eq('user_id', userId) // Ensure ownership (users can only update their own collections)
                  .eq('is_public', false) // Users can only update their *private* collections via this method
                  .select() // Select updated collection data
                  .single();

              if (error) throw error;
              if (!data) { // Should not happen if RLS is correct and ID/user_id match
                   console.warn(`Collection ${collectionId} not found or does not belong to user ${userId} for update.`);
                   this.context.loggingService?.logWarning(`Collection not found or user mismatch for update: ${collectionId}`, { userId });
                   return undefined;
              }

              const updatedCollection = data as KnowledgeCollection;

            console.log(`Collection ${collectionId} updated in Supabase. Language: ${updatedCollection.language}`);
            // Publish an event indicating a collection has been updated (part of Six Styles/EventBus)
            this.context.eventBus?.publish('knowledge_collection_updated', updatedCollection, userId); // Include userId in event
            this.context.loggingService?.logInfo(`Collection updated successfully: ${collectionId}`, { id: collectionId, userId: userId, language: updatedCollection.language });

            // TODO: Notify SyncService about local change

            return updatedCollection;

          } catch (error: any) {
              console.error(`Failed to update collection ${collectionId}:`, error);
              this.context.loggingService?.logError(`Failed to update collection ${collectionId}`, { id: collectionId, updates, userId: userId, error: error.message });
              throw error; // Re-throw the error
          }
    }

    /**
     * Deletes a knowledge collection for a specific user from Supabase.
     * This will also cascade delete associated entries in the knowledge_collection_records join table.
     * @param collectionId The ID of the collection. Required.
     * @param userId The user ID for verification (checks ownership). Required.
     * @returns Promise<boolean> True if deletion was successful, false otherwise.
     */
    async deleteCollection(collectionId: string, userId: string): Promise<boolean> {
        console.log(`[MemoryEngine] Deleting collection ${collectionId} from Supabase for user ${userId}...`);
        this.context.loggingService?.logInfo(`Attempting to delete collection ${collectionId}`, { id: collectionId, userId });

         if (!collectionId || !userId) {
             console.warn('[MemoryEngine] Cannot delete collection: ID and user ID are required.');
             this.context.loggingService?.logWarning('Cannot delete collection: ID and user ID are required.', { id: collectionId, userId });
             return false; // Return false if no ID or user ID
         }

        try {
            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership
              const { count, error } = await this.supabase
                  .from('knowledge_collections')
                  .delete()
                  .eq('id', collectionId)
                  .eq('user_id', userId) // Ensure ownership
                  .select('id', { count: 'exact' }); // Select count to check if a row was deleted

              if (error) { throw error; }

              const deleted = count !== null && count > 0; // Check if count is greater than 0

              if (deleted) {
                  console.log(`Collection ${collectionId} deleted from Supabase.`);
                  // Publish an event indicating a collection has been deleted (part of Six Styles/EventBus)
                  this.context.eventBus?.publish('knowledge_collection_deleted', { collectionId: collectionId, userId: userId }, userId); // Include userId in event
                  this.context.loggingService?.logInfo(`Collection deleted successfully: ${collectionId}`, { id: collectionId, userId: userId });
              } else {
                  console.warn(`Collection ${collectionId} not found for deletion or user mismatch.`);
                  this.context.loggingService?.logWarning(`Collection not found for deletion or user mismatch: ${collectionId}`, { id: collectionId, userId });
              }
              return deleted;

        } catch (error: any) {
            console.error(`Failed to delete collection ${collectionId}:`, error);
            this.context.loggingService?.logError(`Failed to delete collection ${collectionId}`, { id: collectionId, userId: userId, error: error.message });
            return false; // Return false on failure
        }
    }


    /**
     * Retrieves knowledge records that are part of a specific collection for a user.
     * @param collectionId The ID of the collection. Required.
     * @param userId The user ID. Required.
     * @returns Promise<KnowledgeRecord[]> An array of records in the collection.
     */
    async getRecordsInCollection(collectionId: string, userId: string): Promise<KnowledgeRecord[]> {
        console.log(`[MemoryEngine] Retrieving records in collection ${collectionId} for user ${userId}`);
        this.context.loggingService?.logInfo(`Attempting to fetch records in collection ${collectionId}`, { collectionId, userId });

        if (!collectionId || !userId) {
            console.warn('[MemoryEngine] Cannot retrieve records in collection: Collection ID and User ID are required.');
            this.context.loggingService?.logWarning('Cannot retrieve records in collection: Missing required fields.', { collectionId, userId });
            return [];
        }

        try {
            // Fetch records using the join table, filtered by collection_id and user_id
            // Join with knowledge_records table to get the full record details
            const { data, error } = await this.supabase
                .from('knowledge_collection_records')
                .select('record_id, knowledge_records(*)') // Select the record ID and join the full record
                .eq('collection_id', collectionId)
                .eq('user_id', userId); // RLS on join table enforces ownership

            if (error) throw error;

            // Map the result to an array of KnowledgeRecord
            const records = data.map((item: any) => item.knowledge_records) as KnowledgeRecord[];
            console.log(`[MemoryEngine] Fetched ${records.length} records in collection ${collectionId}.`);
            this.context.loggingService?.logInfo(`Fetched ${records.length} records in collection ${collectionId} successfully.`, { collectionId, userId });

            return records;

        } catch (error: any) {
            console.error(`Error fetching records in collection ${collectionId}:`, error);
            this.context.loggingService?.logError(`Failed to fetch records in collection ${collectionId}`, { collectionId, userId: userId, error: error.message });
            return [];
        }
    }

    /**
     * Adds a knowledge record to a specific collection for a user in Supabase.
     * Creates an entry in the knowledge_collection_records join table.
     * @param collectionId The ID of the collection. Required.
     * @param recordId The ID of the knowledge record to add. Required.
     * @param userId The user ID associating the relation. Required.
     * @returns Promise<any | null> The created join table entry or null if the record is already in the collection.
     */
    async addRecordToCollection(collectionId: string, recordId: string, userId: string): Promise<any | null> {
        console.log(`[MemoryEngine] Adding record ${recordId} to collection ${collectionId} for user ${userId}`);
        this.context.loggingService?.logInfo('Attempting to add record to collection', { collectionId, recordId, userId });

        if (!collectionId || !recordId || !userId) {
            console.error('[MemoryEngine] Cannot add record to collection: Missing required fields.');
            this.context.loggingService?.logError('Cannot add record to collection: Missing required fields.', { collectionId, recordId, userId });
            throw new Error('Collection ID, Record ID, and user ID are required.');
        }

        const newCollectionRecordData = {
            collection_id: collectionId,
            record_id: recordId,
            user_id: userId, // Associate with user for RLS on join table
            // added_timestamp is set by the database default
        };

        try {
            // Insert into the join table
            // Handle unique constraint violation if the record is already in the collection
            const { data, error } = await this.supabase
                .from('knowledge_collection_records')
                .insert([newCollectionRecordData])
                .select() // Select the inserted data
                .single(); // Expecting a single record back

            if (error) {
                if (error.code === '23505') { // PostgreSQL unique_violation error code
                    console.warn(`[MemoryEngine] Record ${recordId} is already in collection ${collectionId}. Skipping add.`);
                    this.context.loggingService?.logWarning(`Record already in collection: ${recordId} in ${collectionId}`, { collectionId, recordId, userId });
                    return null; // Return null if already exists
                }
                console.error('Error adding record to collection:', error);
                this.context.loggingService?.logError('Failed to add record to collection', { collectionId, recordId, userId: userId, error: error.message });
                throw error; // Re-throw other errors
            }

            const createdEntry = data; // The inserted join table entry
            console.log('Record added to collection:', createdEntry);

            // Publish event
            this.context.eventBus?.publish('knowledge_collection_record_added', createdEntry, userId);

            // TODO: Notify SyncService

            return createdEntry;

        } catch (error: any) {
            console.error('Failed to add record to collection:', error);
            this.context.loggingService?.logError('Failed to add record to collection', { collectionId, recordId, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Removes a knowledge record from a collection for a specific user in Supabase.
     * Deletes the entry from the knowledge_collection_records join table.
     * @param collectionId The ID of the collection. Required.
     * @param recordId The ID of the knowledge record to remove. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<boolean> True if removal was successful, false otherwise.
     */
    async removeRecordFromCollection(collectionId: string, recordId: string, userId: string): Promise<boolean> {
        console.log(`[MemoryEngine] Removing record ${recordId} from collection ${collectionId} for user ${userId}`);
        this.context.loggingService?.logInfo('Attempting to remove record from collection', { collectionId, recordId, userId });

        if (!collectionId || !recordId || !userId) {
            console.error('[MemoryEngine] Cannot remove record from collection: Missing required fields.');
            this.context.loggingService?.logError('Cannot remove record from collection: Missing required fields.', { collectionId, recordId, userId });
            throw new Error('Collection ID, Record ID, and user ID are required.');
        }

        try {
            // Delete from the join table
            // Filter by collection_id, record_id, and user_id to ensure ownership
            const { count, error } = await this.supabase
                .from('knowledge_collection_records')
                .delete()
                .eq('collection_id', collectionId)
                .eq('record_id', recordId)
                .eq('user_id', userId) // Ensure ownership
                .select('record_id', { count: 'exact' }); // Select count to check if a row was deleted

            if (error) throw error;

            const deleted = count !== null && count > 0; // Check if count is greater than 0

            if (deleted) {
                console.log(`Record ${recordId} removed from collection ${collectionId}.`);
                // Publish event
                this.context.eventBus?.publish('knowledge_collection_record_deleted', { collectionId: collectionId, recordId: recordId, userId: userId }, userId);

                // TODO: Notify SyncService

            } else {
                console.warn(`Record ${recordId} not found in collection ${collectionId} for deletion or user mismatch.`);
                this.context.loggingService?.logWarning(`Record not found in collection for deletion or user mismatch: ${recordId} in ${collectionId}`, { collectionId, recordId, userId });
            }
            return deleted;

        } catch (error: any) {
            console.error(`Failed to remove record ${recordId} from collection ${collectionId}:`, error);
            this.context.loggingService?.logError('Failed to remove record from collection', { collectionId, recordId, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
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
    async createTerm(termDetails: Omit<GlossaryTerm, 'id' | 'creation_timestamp' | 'last_updated_timestamp'>, userId?: string, isPublic?: boolean, language?: string): Promise<GlossaryTerm | null> {
        console.log('Creating glossary term:', termDetails.term, 'for user:', userId, 'public:', isPublic);
        this.context.loggingService?.logInfo('Attempting to create glossary term', { term: termDetails.term, userId, isPublic, language });

        if (!termDetails.term || !termDetails.definition) {
            console.error('[MemoryEngine] Cannot create term: Term and definition are required.');
            this.context.loggingService?.logError('Cannot create glossary term: Missing required fields.', { term: termDetails.term, userId });
            throw new Error('Term and definition are required to create a glossary term.');
        }

        // Determine public status if not explicitly provided
        const finalIsPublic = isPublic !== undefined ? isPublic : (userId ? false : true); // Default to public if no user, private if user

        const contentLanguage = language || this.context.currentUser?.language_preference || 'en'; // Default to English if no preference

        const newTermData: Omit<GlossaryTerm, 'id' | 'creation_timestamp' | 'last_updated_timestamp'> = {
            ...termDetails,
            user_id: userId || null, // Associate with user or null for public
            is_public: finalIsPublic,
            related_concepts: termDetails.related_concepts || [], // Ensure it's an array
            language: contentLanguage, // Store the language
            // creation_timestamp and last_updated_timestamp are set by the database default/trigger
        };

        try {
            // Insert into Supabase (Supports Bidirectional Sync Domain)
            const { data, error } = await this.supabase
                .from('glossary')
                .insert([newTermData])
                .select()
                .single();

            if (error) {
                console.error('Error creating glossary term:', error);
                this.context.loggingService?.logError('Failed to create glossary term', { term: termDetails.term, userId: userId, error: error.message });
                throw error;
            }

            const createdTerm = data as GlossaryTerm;
            console.log('Glossary term created:', createdTerm.id, '-', createdTerm.term, 'for user:', createdTerm.user_id, 'public:', createdTerm.is_public);

            // Publish event
            this.context.eventBus?.publish('glossary_term_created', createdTerm, userId);

            // TODO: Notify SyncService

            return createdTerm;

        } catch (error: any) {
            console.error('Failed to create glossary term:', error);
            this.context.loggingService?.logError('Failed to create glossary term', { term: termDetails.term, userId: userId, error: error.message });
            return null;
        }
    }

    /**
     * Retrieves glossary terms for a specific user (their private terms and all public terms) from Supabase.
     * Can filter by pillar/domain or search term.
     * @param userId The user ID. Required to filter private terms.
     * @param pillarDomain Optional: Filter by pillar/domain.
     * @param searchTerm Optional: Search terms in term or definition.
     * @returns Promise<GlossaryTerm[]> An array of GlossaryTerm objects.
     */
    async getTerms(userId: string, pillarDomain?: string, searchTerm?: string): Promise<GlossaryTerm[]> {
        console.log('Retrieving glossary terms for user:', userId, 'domain:', pillarDomain || 'all', 'search:', searchTerm || 'none');
        this.context.loggingService?.logInfo('Attempting to fetch glossary terms', { userId, pillarDomain, searchTerm });

        if (!userId) {
            console.warn('[MemoryEngine] Cannot retrieve terms: User ID is required.');
            this.context.loggingService?.logWarning('Cannot retrieve glossary terms: User ID is required.');
            return [];
        }
        try {
            // Fetch terms from Supabase, filtered by user_id OR is_public
            let dbQuery = this.supabase
                .from('glossary')
                .select('*') // Select all columns
                .or(`user_id.eq.${userId},is_public.eq.true`); // Fetch user's own terms OR public terms

            if (pillarDomain) {
                dbQuery = dbQuery.eq('pillar_domain', pillarDomain);
            }

            if (searchTerm) {
                // Use text search on term and definition
                dbQuery = dbQuery.textSearch('fts', searchTerm); // Assuming FTS index 'fts' on term || ' ' || definition
            }

            dbQuery = dbQuery.order('term', { ascending: true } as any); // Order by term alphabetically

            const { data, error } = await dbQuery;

            if (error) throw error;

            const terms = data as GlossaryTerm[];
            console.log(`Fetched ${terms.length} glossary terms for user ${userId}.`);
            this.context.loggingService?.logInfo(`Fetched ${terms.length} glossary terms successfully.`, { userId });

            return terms;

        } catch (error: any) {
            console.error('Error fetching glossary terms from Supabase:', error);
            this.context.loggingService?.logError('Failed to fetch glossary terms', { userId: userId, error: error.message });
            return [];
        }
    }

    /**
     * Retrieves a specific glossary term by ID for a specific user from Supabase.
     * Checks if the term is public or owned by the user.
     * @param termId The ID of the term. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<GlossaryTerm | undefined> The GlossaryTerm object or undefined.
     */
    async getTermById(termId: string, userId: string): Promise<GlossaryTerm | undefined> {
        console.log('Retrieving glossary term by ID from Supabase:', termId, 'for user:', userId);
        this.context.loggingService?.logInfo(`Attempting to fetch glossary term ${termId}`, { id: termId, userId });

         if (!userId) {
             console.warn('[MemoryEngine] Cannot retrieve term: User ID is required.');
             this.context.loggingService?.logWarning('Cannot retrieve glossary term: User ID is required.');
             return undefined;
         }
        try {
            // Fetch term from Supabase by ID and check if it's public OR owned by the user
              const { data, error } = await this.supabase
                  .from('glossary')
                  .select('*')
                  .eq('id', termId)
                  .or(`user_id.eq.${userId},is_public.eq.true`) // Ensure ownership OR public status
                  .single();

              if (error) throw error;
              if (!data) { return undefined; } // Term not found or doesn't belong to user/is not public

              const term = data as GlossaryTerm;

              console.log(`Fetched glossary term ${termId} for user ${userId}.`);
              this.context.loggingService?.logInfo(`Fetched glossary term ${termId} successfully.`, { id: termId, userId: userId });

              return term;

        } catch (error: any) {
            console.error(`Error fetching glossary term ${termId} from Supabase:`, error);
            this.context.loggingService?.logError(`Failed to fetch glossary term ${termId}`, { id: termId, userId: userId, error: error.message });
            return undefined;
        }
    }


    /**
     * Updates an existing glossary term for a specific user in Supabase.
     * Only allows updating terms owned by the user.
     * @param termId The ID of the term to update. Required.
     * @param updates The updates to apply (term, definition, related_concepts, pillar_domain, is_public). Required.
     * @param userId The user ID for verification (checks ownership). Required.
     * @returns Promise<GlossaryTerm | undefined> The updated term or undefined if not found or user mismatch.
     */
    async updateTerm(termId: string, updates: Partial<Omit<GlossaryTerm, 'id' | 'user_id' | 'creation_timestamp' | 'last_updated_timestamp'>>, userId: string): Promise<GlossaryTerm | undefined> {
        console.log(`Updating glossary term ${termId} in Supabase for user ${userId}...`, updates);
        this.context.loggingService?.logInfo(`Attempting to update glossary term ${termId}`, { id: termId, updates, userId });

         if (!userId) {
             console.warn('[MemoryEngine] Cannot update term: User ID is required.');
             this.context.loggingService?.logWarning('Cannot update glossary term: User ID is required.');
             return undefined;
         }

        try {
            // Persist update to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership and that it's not a public term (unless admin)
              const { data, error } = await this.supabase
                  .from('glossary')
                  .update(updates)
                  .eq('id', termId)
                  .eq('user_id', userId) // Ensure ownership (users can only update their own terms)
                  .eq('is_public', false) // Users can only update their *private* terms via this method
                  .select() // Select updated term data
                  .single();

              if (error) throw error;
              if (!data) { // Should not happen if RLS is correct and ID/user_id match
                   console.warn(`Glossary term ${termId} not found or does not belong to user ${userId} (or is public) for update.`);
                   this.context.loggingService?.logWarning(`Glossary term not found or user mismatch for update: ${termId}`, { userId });
                   return undefined;
              }

              const updatedTerm = data as GlossaryTerm;

            console.log(`Glossary term ${termId} updated in Supabase.`);
            // Publish an event indicating a term has been updated (part of Six Styles/EventBus)
            this.context.eventBus?.publish('glossary_term_updated', updatedTerm, userId); // Include userId in event
            this.context.loggingService?.logInfo(`Glossary term updated successfully: ${termId}`, { id: termId, userId: userId });

            // TODO: Notify SyncService about local change

            return updatedTerm;

          } catch (error: any) {
              console.error(`Failed to update glossary term ${termId}:`, error);
              this.context.loggingService?.logError(`Failed to update glossary term ${termId}`, { id: termId, updates, userId: userId, error: error.message });
              throw error; // Re-throw the error
          }
    }

    /**
     * Deletes a glossary term for a specific user from Supabase.
     * Only allows deleting terms owned by the user.
     * @param termId The ID of the term. Required.
     * @param userId The user ID for verification (checks ownership). Required.
     * @returns Promise<boolean> True if deletion was successful, false otherwise.
     */
    async deleteTerm(termId: string, userId: string): Promise<boolean> {
        console.log(`Deleting glossary term ${termId} from Supabase for user ${userId}...`);
        this.context.loggingService?.logInfo(`Attempting to delete glossary term ${termId}`, { id: termId, userId });

         if (!userId) {
             console.warn('[MemoryEngine] Cannot delete term: User ID is required.');
             this.context.loggingService?.logWarning('Cannot delete glossary term: User ID is required.');
             return false; // Return false if no user ID
         }

        try {
            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership and that it's not a public term (unless admin)
              const { count, error } = await this.supabase
                  .from('glossary')
                  .delete()
                  .eq('id', termId)
                  .eq('user_id', userId) // Ensure ownership (users can only delete their own terms)
                  .eq('is_public', false) // Users can only delete their *private* terms via this method
                  .select('id', { count: 'exact' }); // Select count to check if a row was deleted

              if (error) { throw error; }

              const deleted = count !== null && count > 0; // Check if count is greater than 0

              if (deleted) {
                  console.log(`Glossary term ${termId} deleted from Supabase.`);
                  // Publish an event indicating a term has been deleted (part of Six Styles/EventBus)
                  this.context.eventBus?.publish('glossary_term_deleted', { termId: termId, userId: userId }, userId); // Include userId in event
                  this.context.loggingService?.logInfo(`Glossary term deleted successfully: ${termId}`, { id: termId, userId: userId });
              } else {
                  console.warn(`Glossary term ${termId} not found for deletion or user mismatch (or is public).`);
                  this.context.loggingService?.logWarning(`Glossary term not found for deletion or user mismatch: ${termId}`, { id: termId, userId });
              }
              return deleted;

        } catch (error: any) {
            console.error(`Failed to delete glossary term ${termId}:`, error);
            this.context.loggingService?.logError(`Failed to delete glossary term ${termId}`, { id: termId, userId: userId, error: error.message });
            return false; // Return false on failure
        }
    }

    // TODO: Implement methods for importing/exporting glossary terms.
    // TODO: Implement methods for suggesting new terms based on user input/knowledge.
    // TODO: This module is part of the Long-term Memory (\u6c38\u4e45\u8a18\u61b6) pillar.


    // --- New: Realtime Subscription Methods ---
    /**
     * Subscribes to real-time updates from the glossary table for the current user (user-owned and public).
     * @param userId The user ID to filter updates by. Required.
     */
    subscribeToGlossaryUpdates(userId: string): void {
        console.log('[GlossaryService] Subscribing to glossary realtime updates for user:', userId);
        this.context.loggingService?.logInfo('Subscribing to glossary realtime updates', { userId });

        if (this.glossarySubscription) {
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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'glossary' }, async (payload) => { // No filter here, rely on RLS
                console.log('[GlossaryService] Realtime glossary change received:', payload);
                const term = payload.new as GlossaryTerm; // New data for INSERT/UPDATE
                const oldTerm = payload.old as GlossaryTerm; // Old data for UPDATE/DELETE
                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';

                // Check if the change is relevant to the current user (user-owned or public)
                // RLS should handle this, but client-side check adds safety.
                const relevantTerm = term || oldTerm;
                const isRelevant = relevantTerm?.user_id === userId || relevantTerm?.is_public === true;

                if (isRelevant) {
                    console.log(`[GlossaryService] Processing relevant glossary change (${eventType}): ${relevantTerm.id}`);

                    // Publish an event via EventBus for other modules/UI to react
                    this.context.eventBus?.publish(`glossary_term_${eventType.toLowerCase()}`, term || oldTerm, userId); // e.g., 'glossary_term_insert', 'glossary_term_update', 'glossary_term_delete'

                    // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly
                    // this.context.syncService?.handleRemoteDataChange('glossaryService', eventType, term || oldTerm, userId);

                } else {
                    console.log('[GlossaryService] Received glossary change not relevant to current user (filtered by RLS or client-side).');
                }
            })
            .subscribe((status, err) => {
                 console.log('[GlossaryService] Glossary subscription status:', status);
                 if (status === 'CHANNEL_ERROR') {
                     console.error('[GlossaryService] Glossary subscription error:', err);
                     this.context.loggingService?.logError('Glossary subscription error', { userId, error: err?.message });
                 }
            });
    }

    /**
     * Unsubscribes from glossary real-time updates.
     */
    unsubscribeFromGlossaryUpdates(): void {
        if (this.glossarySubscription) {
            console.log('[GlossaryService] Unsubscribing from glossary realtime updates.');
            this.context.loggingService?.logInfo('Unsubscribing from glossary realtime updates');
            this.supabase.removeChannel(this.glossarySubscription);
            this.glossarySubscription = null;
        }
    }
    // --- End New ---
}
```