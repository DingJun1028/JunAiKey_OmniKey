"use strict";
`` `typescript
// src/core/wisdom/KnowledgeGraphService.ts
// 知識圖譜服務 (Knowledge Graph Service) - 核心模組
// Manages the relationships between knowledge records, forming a knowledge graph.
// Part of the Wisdom Precipitation pillar (specifically the Tree of Wisdom aspect).
// Design Principle: Provides structure and context to the knowledge base.

import { SupabaseClient } from '@supabase/supabase-js';
import { SystemContext, KnowledgeRecord, KnowledgeRelation } from '../../interfaces';
// import { LoggingService } from '../logging/LoggingService'; // Dependency
// import { EventBus } from '../../modules/events/EventBus'; // Dependency

export class KnowledgeGraphService {
    private supabase: SupabaseClient;
    private context: SystemContext;
    // private loggingService: LoggingService; // Access via context
    // private eventBus: EventBus; // Access via context

    // --- New: Realtime Subscription ---
    private relationsSubscription: any | null = null;
    // --- End New ---

    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
        // this.loggingService = context.loggingService;
        // this.eventBus = context.eventBus;
        console.log('KnowledgeGraphService initialized.');

        // TODO: Load initial relations from persistence on startup.

        // --- New: Set up Supabase Realtime subscription for knowledge_relations table ---
        // Subscribe when the user is authenticated.
        this.context.securityService?.onAuthStateChange((user) => {
            if (user) {
                this.subscribeToRelationsUpdates(user.id);
            } else {
                this.unsubscribeFromRelationsUpdates();
            }
        });
        // --- End New ---
    }

    /**
     * Creates a new knowledge relation between two records for a specific user in Supabase.
     * @param sourceRecordId The ID of the source knowledge record. Required.
     * @param targetRecordId The ID of the target knowledge record. Required.
     * @param relationType The type of relation (e.g., 'related', 'prerequisite', 'follow-up', 'contradicts'). Required.
     * @param userId The user ID associating the relation. Required.
     * @param details Optional details about the relation.
     * @returns Promise<KnowledgeRelation | null> The created relation or null on failure.
     *
     * Privacy Note: Knowledge Relations are stored with a user_id and are subject to Row Level Security (RLS)
     * policies in Supabase, ensuring users can only access relations associated with their data.
     */
    async createRelation(sourceRecordId: string, targetRecordId: string, relationType: string, userId: string, details?: any): Promise<KnowledgeRelation | null> {
        console.log(`[KnowledgeGraphService];
Creating;
relation;
between;
$;
{
    sourceRecordId;
}
and;
$;
{
    targetRecordId;
}
($);
{
    relationType;
}
for (user; $; { userId } `);
        this.context.loggingService?.logInfo('Attempting to create knowledge relation', { sourceRecordId, targetRecordId, relationType, userId });

        if (!sourceRecordId || !targetRecordId || !relationType || !userId) {
            console.error('[KnowledgeGraphService] Cannot create relation: Missing required fields.');
            this.context.loggingService?.logError('Cannot create knowledge relation: Missing required fields.', { sourceRecordId, targetRecordId, relationType, userId });
            throw new Error('Source ID, target ID, type, and user ID are required to create a relation.');
        }

        // Prevent creating a relation from a record to itself
        if (sourceRecordId === targetRecordId) {
             console.warn('[KnowledgeGraphService] Cannot create relation: Source and target record IDs are the same.');
             this.context.loggingService?.logWarning('Cannot create relation: Source and target record IDs are the same.', { sourceRecordId, userId });
             throw new Error('Cannot create a relation from a record to itself.');
        }

        const newRelationData: Omit<KnowledgeRelation, 'id' | 'creation_timestamp'> = {
            source_record_id: sourceRecordId,
            target_record_id: targetRecordId,
            relation_type: relationType,
            user_id: userId, // Associate with user
            details: details || null,
            // creation_timestamp is set by the database default
        };

        try {
            // Insert into Supabase (Supports Bidirectional Sync Domain)
            const { data, error } = await this.supabase
                .from('knowledge_relations')
                .insert([newRelationData])
                .select() // Select the inserted data to get the generated ID and timestamp
                .single(); // Expecting a single record back

            if (error) {
                console.error('Error creating knowledge relation in Supabase:', error);
                this.context.loggingService?.logError('Failed to create knowledge relation', { sourceRecordId, targetRecordId, relationType, userId: userId, error: error.message });
                throw error; // Re-throw the error
            }

            const createdRelation = data as KnowledgeRelation;
            console.log('Knowledge relation created:', createdRelation.id, '-', createdRelation.relation_type, 'between', createdRelation.source_record_id, 'and', createdRelation.target_record_id, 'for user:', createdRelation.user_id);

            // Publish a 'knowledge_relation_created' event (part of Six Styles/EventBus - call context.eventBus.publish)
            this.context.eventBus?.publish('knowledge_relation_created', createdRelation, userId); // Include userId in event

            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly
            // this.context.syncService?.handleLocalDataChange('knowledgeGraphService', 'INSERT', createdRelation, userId)
            //     .catch(syncError => console.error('Error notifying SyncService for KnowledgeRelation insert:', syncError));

            return createdRelation;

        } catch (error: any) {
            console.error('Failed to create knowledge relation:', error);
            this.context.loggingService?.logError('Failed to create knowledge relation', { sourceRecordId, targetRecordId, relationType, userId: userId, error: error.message });
            return null; // Return null on failure
        }
    }

    /**
     * Retrieves knowledge relations for a specific user from Supabase.
     * Can filter by source/target record ID or relation type.
     * @param userId The user ID. Required.
     * @param sourceRecordId Optional: Filter by source record ID.
     * @param targetRecordId Optional: Filter by target record ID.
     * @param relationType Optional: Filter by relation type.
     * @returns Promise<KnowledgeRelation[]> An array of KnowledgeRelation objects.
     */
    async getRelations(userId: string, sourceRecordId?: string, targetRecordId?: string, relationType?: string): Promise<KnowledgeRelation[]> {
        console.log(`[KnowledgeGraphService])
    Retrieving;
relations;
for (user; ; )
    : $;
{
    userId;
}
source: $;
{
    sourceRecordId || 'any';
}
target: $;
{
    targetRecordId || 'any';
}
type: $;
{
    relationType || 'any';
}
`);
        this.context.loggingService?.logInfo('Attempting to fetch knowledge relations', { userId, sourceRecordId, targetRecordId, relationType });

        if (!userId) {
            console.warn('[KnowledgeGraphService] Cannot retrieve relations: User ID is required.');
            this.context.loggingService?.logWarning('Cannot retrieve knowledge relations: User ID is required.');
            return []; // Return empty if no user ID
        }
        try {
            // Fetch relations from Supabase, filtered by user_id
            let dbQuery = this.supabase
                .from('knowledge_relations')
                .select('*') // Select all columns
                .eq('user_id', userId); // Filter by user ID

            if (sourceRecordId) {
                dbQuery = dbQuery.eq('source_record_id', sourceRecordId);
            }
            if (targetRecordId) {
                dbQuery = dbQuery.eq('target_record_id', targetRecordId);
            }
            if (relationType) {
                dbQuery = dbQuery.eq('relation_type', relationType);
            }

            dbQuery = dbQuery.order('creation_timestamp', { ascending: false } as any); // Order by creation time

            const { data, error } = await dbQuery;

            if (error) { throw error; }

            const relations = data as KnowledgeRelation[];
            console.log(`[KnowledgeGraphService];
Fetched;
$;
{
    relations.length;
}
relations;
for (user; $; { userId }. `);
            this.context.loggingService?.logInfo(`)
    Fetched;
$;
{
    relations.length;
}
relations;
successfully. `, { userId });

            return relations;

        } catch (error: any) {
            console.error('Error fetching knowledge relations from Supabase:', error);
            this.context.loggingService?.logError('Failed to fetch knowledge relations', { userId: userId, error: error.message });
            return [];
        }
    }

    /**
     * Retrieves all relations connected to a specific record (either as source or target) for a user.
     * @param recordId The ID of the record. Required.
     * @param userId The user ID. Required.
     * @returns Promise<KnowledgeRelation[]> An array of KnowledgeRelation objects.
     */
    async getRelationsForRecord(recordId: string, userId: string): Promise<KnowledgeRelation[]> {
        console.log(`[KnowledgeGraphService];
Retrieving;
relations;
for (record; $; { recordId })
    for (user; $; { userId } `);
        this.context.loggingService?.logInfo(`)
        Attempting;
to;
fetch;
relations;
for (record; $; { recordId } `, { recordId, userId });

        if (!recordId || !userId) {
            console.warn('[KnowledgeGraphService] Cannot retrieve relations for record: Record ID and User ID are required.');
            this.context.loggingService?.logWarning('Cannot retrieve relations for record: Missing required fields.', { recordId, userId });
            return [];
        }

        try {
            // Fetch relations where the record is either the source or the target, filtered by user_id
            const { data, error } = await this.supabase
                .from('knowledge_relations')
                .select('*')
                .eq('user_id', userId) // Filter by user ID
                .or(`)
    source_record_id.eq.$;
{
    recordId;
}
target_record_id.eq.$;
{
    recordId;
}
`); // Record is source OR target

            if (error) { throw error; }

            const relations = data as KnowledgeRelation[];
            console.log(`[KnowledgeGraphService];
Fetched;
$;
{
    relations.length;
}
relations;
for (record; $; { recordId }. `);
            this.context.loggingService?.logInfo(`)
    Fetched;
$;
{
    relations.length;
}
relations;
for (record; $; { recordId })
    successfully. `, { recordId, userId });

            return relations;

        } catch (error: any) {
            console.error(`[KnowledgeGraphService];
Error;
fetching;
relations;
for (record; $; { recordId })
    from;
Supabase: `, error);
            this.context.loggingService?.logError(`;
Failed;
to;
fetch;
relations;
for (record; $; { recordId } `, { recordId, userId: userId, error: error.message });
            return [];
        }
    }


    /**
     * Deletes a knowledge relation for a specific user from Supabase.
     * @param relationId The ID of the relation. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<boolean> True if deletion was successful, false otherwise.
     */
    async deleteRelation(relationId: string, userId: string): Promise<boolean> {
        console.log(`[KnowledgeGraphService])
    Deleting;
relation;
$;
{
    relationId;
}
from;
Supabase;
for (user; $; { userId })
    ;
`);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
delete knowledge;
relation;
$;
{
    relationId;
}
`, { id: relationId, userId });

         if (!relationId || !userId) {
             console.warn('[KnowledgeGraphService] Cannot delete relation: ID and user ID are required.');
             this.context.loggingService?.logWarning('Cannot delete knowledge relation: ID and user ID are required.');
             return false; // Return false if no ID or user ID
         }

        try {
            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership
              const { count, error } = await this.supabase
                  .from('knowledge_relations')
                  .delete()
                  .eq('id', relationId)
                  .eq('user_id', userId) // Ensure ownership
                  .select('id', { count: 'exact' }); // Select count to check if a row was deleted

              if (error) { throw error; }

              const deleted = count !== null && count > 0; // Check if count is greater than 0

              if (deleted) {
                  console.log(`;
Knowledge;
relation;
$;
{
    relationId;
}
deleted;
from;
Supabase. `);
                  // Publish an event indicating a relation has been deleted (part of Six Styles/EventBus)\
                  this.context.eventBus?.publish('knowledge_relation_deleted', { relationId: relationId, userId: userId }, userId); // Include userId in event\
                  this.context.loggingService?.logInfo(`;
Knowledge;
relation;
deleted;
successfully: $;
{
    relationId;
}
`, { id: relationId, userId: userId });\
              } else {\
                  console.warn(`;
Knowledge;
relation;
$;
{
    relationId;
}
not;
found;
for (deletion; or; user)
    mismatch. `);\
                  this.context.loggingService?.logWarning(`;
Knowledge;
relation;
not;
found;
for (deletion; or; user)
    mismatch: $;
{
    relationId;
}
`, { id: relationId, userId });\
              }\
              return deleted;\
\
        } catch (error: any) {\
            console.error(`;
Failed;
to;
delete knowledge;
relation;
$;
{
    relationId;
}
`, error);\
            this.context.loggingService?.logError(`;
Failed;
to;
delete knowledge;
relation;
$;
{
    relationId;
}
`, { id: relationId, userId: userId, error: error.message });\
            return false; // Return false on failure\
        }\
    }\
\
    /**\
     * Retrieves knowledge graph data (nodes and edges) for a specific user.\
     * Nodes are Knowledge Records, edges are Knowledge Relations.\
     * @param userId The user ID. Required.\
     * @returns Promise<{ nodes: KnowledgeRecord[], edges: KnowledgeRelation[] }> The graph data.\
     */\
    async getGraphData(userId: string): Promise<{ nodes: KnowledgeRecord[], edges: KnowledgeRelation[] }> {\
        console.log(`[KnowledgeGraphService];
Retrieving;
graph;
data;
for (user; ; )
    : $;
{
    userId;
}
`);\
        this.context.loggingService?.logInfo('Attempting to fetch knowledge graph data', { userId });\
\
        if (!userId) {\
            console.warn('[KnowledgeGraphService] Cannot retrieve graph data: User ID is required.');\
            this.context.loggingService?.logWarning('Cannot retrieve knowledge graph data: User ID is required.');\
            return { nodes: [], edges: [] };\
        }\
\
        try {\
            // Fetch all knowledge records for the user\
            const nodes = await this.context.memoryEngine?.getAllKnowledgeForUser(userId) || [];\
            console.log(`[KnowledgeGraphService];
Fetched;
$;
{
    nodes.length;
}
nodes. `);\
\
            // Fetch all relations for the user\
            const edges = await this.getRelations(userId) || [];\
            console.log(`[KnowledgeGraphService];
Fetched;
$;
{
    edges.length;
}
edges. `);\
\
            // Filter edges to only include those connecting fetched nodes\
            const nodeIds = new Set(nodes.map(node => node.id));\
            const filteredEdges = edges.filter(edge => nodeIds.has(edge.source_record_id) && nodeIds.has(edge.target_record_id));\
            console.log(`[KnowledgeGraphService];
Filtered;
edges;
to;
$;
{
    filteredEdges.length;
}
connecting;
fetched;
nodes. `);\
\
            console.log(`[KnowledgeGraphService];
Retrieved;
graph;
data;
for (user; ; )
    : $;
{
    userId;
}
`);\
            this.context.loggingService?.logInfo(`;
Retrieved;
knowledge;
graph;
data;
for (user; $; { userId } `, { userId, nodeCount: nodes.length, edgeCount: filteredEdges.length });\
\
            return { nodes, edges: filteredEdges };\
\
        } catch (error: any) {\
            console.error(`[KnowledgeGraphService])
    Error;
retrieving;
graph;
data;
for (user; $; { userId })
    : `, error);\
            this.context.loggingService?.logError(`;
Failed;
to;
retrieve;
knowledge;
graph;
data;
for (user; $; { userId } `, { userId: userId, error: error.message });\
            throw error; // Re-throw the error\
        }\
    }\
\
    // TODO: Implement methods for updating relations.\
    // TODO: Implement methods for inferring relations (integrates with WisdomSecretArt).\
    // TODO: Implement methods for visualizing the graph (integrates with UI).\
    // TODO: This module is part of the Wisdom Precipitation (\u667a\u6167\u6c89\u6fb1) pillar.\
\
    // --- New: Realtime Subscription Methods ---\
    /**\
     * Subscribes to real-time updates from the knowledge_relations table for the current user.\
     * @param userId The user ID to filter updates by. Required.\
     */\
    subscribeToRelationsUpdates(userId: string): void {\
        console.log('[KnowledgeGraphService] Subscribing to knowledge_relations realtime updates for user:', userId);\
        this.context.loggingService?.logInfo('Subscribing to knowledge_relations realtime updates', { userId });\
\
        if (this.relationsSubscription) {\
            console.warn('[KnowledgeGraphService] Already subscribed to relations updates. Unsubscribing existing.');\
            this.unsubscribeFromRelationsUpdates();\
        }\
\n        // Subscribe to changes where user_id is null (public) OR user_id is the current user.\n        // RLS should ensure user only receives updates for data they can see.\n        // We subscribe to all changes on the table and rely on RLS filtering.\n        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.\n        // Let's subscribe to a channel that should include both user and public data based on RLS.\n        // A simple channel name like the table name, relying entirely on RLS, is often used.\n        // Let's switch to subscribing to the table name channel and rely on RLS.\n\n        this.relationsSubscription = this.supabase\n            .channel('knowledge_relations') // Subscribe to all changes on the table\n            .on('postgres_changes', { event: '*', schema: 'public', table: 'knowledge_relations' }, async (payload) => { // No filter here, rely on RLS\n                console.log('[KnowledgeGraphService] Realtime knowledge_relations change received:', payload);\n                const relation = (payload.new || payload.old) as KnowledgeRelation; // New data for INSERT/UPDATE, old for DELETE\n                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\n\n                // Check if the change is relevant to the current user (user-owned or public)\n                // RLS should handle this, but client-side check adds safety.\n                // To check relevance, we need the user_id of the related records.\n                // This is complex. For MVP, let's assume RLS handles it and just publish the event.\n                // The UI/listeners will need to filter based on what they can see.\n\n                // A more robust approach would involve fetching the related records to check ownership/public status.\n                // For now, rely on RLS and publish the event with the user ID associated with the relation itself.\n                const relationUserId = relation?.user_id; // User ID associated with the relation\n\n                if (relationUserId === userId) { // Only process changes for relations owned by the current user\n                     console.log(`[KnowledgeGraphService])
    Processing;
relevant;
relation;
change($, { eventType });
$;
{
    relation.id;
}
`);\n\n                     // Publish an event via EventBus for other modules/UI to react\n                     this.context.eventBus?.publish(`;
knowledge_relation_$;
{
    eventType.toLowerCase();
}
`, relation, userId); // e.g., 'knowledge_relation_insert', 'knowledge_relation_update', 'knowledge_relation_delete'\n\n                     // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly\n                     // this.context.syncService?.handleRemoteDataChange('knowledgeGraphService', eventType, relation, userId);\n\n                } else {\n                    console.log('[KnowledgeGraphService] Received knowledge_relations change not relevant to current user (filtered by RLS or client-side).');\n                }\n            })\n            .subscribe((status, err) => {\n                 console.log('[KnowledgeGraphService] Knowledge_relations subscription status:', status);\n                 if (status === 'CHANNEL_ERROR') {\n                     console.error('[KnowledgeGraphService] Knowledge_relations subscription error:', err);\n                     this.context.loggingService?.logError('Knowledge_relations subscription error', { userId, error: err?.message });\n                 }\n            });\n    }\n\n    /**\n     * Unsubscribes from knowledge_relations real-time updates.\n     */\n    unsubscribeFromRelationsUpdates(): void {\n        if (this.relationsSubscription) {\n            console.log('[KnowledgeGraphService] Unsubscribing from knowledge_relations realtime updates.');\n            this.context.loggingService?.logInfo('Unsubscribing from knowledge_relations realtime updates');\n            this.supabase.removeChannel(this.relationsSubscription);\n            this.relationsSubscription = null;\n        }\n    }\n    // --- End New ---\n}\n` ``;
