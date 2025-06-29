var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/core/wisdom/KnowledgeGraphService.ts\n// \u77E5\u8B58\u5716\u8B5C\u670D\u52D9 (Knowledge Graph Service) - \u6838\u5FC3\u6A21\u7D44\n// Manages the relationships between knowledge records, forming a knowledge graph.\n// Part of the Wisdom Precipitation pillar (specifically the Tree of Wisdom aspect).\n// Design Principle: Provides structure and context to the knowledge base.\n\nimport { SupabaseClient } from '@supabase/supabase-js';\nimport { SystemContext, KnowledgeRecord, KnowledgeRelation } from '../../interfaces';\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n\nexport class KnowledgeGraphService {\n    private supabase: SupabaseClient;\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n\n    // --- New: Realtime Subscription ---\n    private relationsSubscription: any | null = null;\n    // --- End New ---\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        console.log('KnowledgeGraphService initialized.');\n\n        // TODO: Load initial relations from persistence on startup.\n\n        // --- New: Set up Supabase Realtime subscription for knowledge_relations table ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToRelationsUpdates(user.id);\n            } else {\n                this.unsubscribeFromRelationsUpdates();\n            }\n        });\n        // --- End New ---\n    }\n\n    /**\n     * Creates a new knowledge relation between two records for a specific user in Supabase.\n     * @param sourceRecordId The ID of the source knowledge record. Required.\n     * @param targetRecordId The ID of the target knowledge record. Required.\n     * @param relationType The type of relation (e.g., 'related', 'prerequisite', 'follow-up', 'contradicts'). Required.\n     * @param userId The user ID associating the relation. Required.\n     * @param details Optional details about the relation.\n     * @returns Promise<KnowledgeRelation | null> The created relation or null on failure.\n     *\n     * Privacy Note: Knowledge Relations are stored with a user_id and are subject to Row Level Security (RLS)\n     * policies in Supabase, ensuring users can only access relations associated with their data.\n     */\n    async createRelation(sourceRecordId: string, targetRecordId: string, relationType: string, userId: string, details?: any): Promise<KnowledgeRelation | null> {\n        console.log("], ["typescript\n// src/core/wisdom/KnowledgeGraphService.ts\n// \u77E5\u8B58\u5716\u8B5C\u670D\u52D9 (Knowledge Graph Service) - \u6838\u5FC3\u6A21\u7D44\n// Manages the relationships between knowledge records, forming a knowledge graph.\n// Part of the Wisdom Precipitation pillar (specifically the Tree of Wisdom aspect).\n// Design Principle: Provides structure and context to the knowledge base.\n\nimport { SupabaseClient } from '@supabase/supabase-js';\nimport { SystemContext, KnowledgeRecord, KnowledgeRelation } from '../../interfaces';\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n\nexport class KnowledgeGraphService {\n    private supabase: SupabaseClient;\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n\n    // --- New: Realtime Subscription ---\n    private relationsSubscription: any | null = null;\n    // --- End New ---\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        console.log('KnowledgeGraphService initialized.');\n\n        // TODO: Load initial relations from persistence on startup.\n\n        // --- New: Set up Supabase Realtime subscription for knowledge_relations table ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToRelationsUpdates(user.id);\n            } else {\n                this.unsubscribeFromRelationsUpdates();\n            }\n        });\n        // --- End New ---\n    }\n\n    /**\n     * Creates a new knowledge relation between two records for a specific user in Supabase.\n     * @param sourceRecordId The ID of the source knowledge record. Required.\n     * @param targetRecordId The ID of the target knowledge record. Required.\n     * @param relationType The type of relation (e.g., 'related', 'prerequisite', 'follow-up', 'contradicts'). Required.\n     * @param userId The user ID associating the relation. Required.\n     * @param details Optional details about the relation.\n     * @returns Promise<KnowledgeRelation | null> The created relation or null on failure.\n     *\n     * Privacy Note: Knowledge Relations are stored with a user_id and are subject to Row Level Security (RLS)\n     * policies in Supabase, ensuring users can only access relations associated with their data.\n     */\n    async createRelation(sourceRecordId: string, targetRecordId: string, relationType: string, userId: string, details?: any): Promise<KnowledgeRelation | null> {\n        console.log("]))[KnowledgeGraphService];
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
for (user; $; { userId: userId }(__makeTemplateObject([");\n        this.context.loggingService?.logInfo('Attempting to create knowledge relation', { sourceRecordId, targetRecordId, relationType, userId });\n\n        if (!sourceRecordId || !targetRecordId || !relationType || !userId) {\n            console.error('[KnowledgeGraphService] Cannot create relation: Missing required fields.');\n            this.context.loggingService?.logError('Cannot create knowledge relation: Missing required fields.', { sourceRecordId, targetRecordId, relationType, userId });\n            throw new Error('Source ID, target ID, type, and user ID are required to create a relation.');\n        }\n\n        // Prevent creating a relation from a record to itself\n        if (sourceRecordId === targetRecordId) {\n             console.warn('[KnowledgeGraphService] Cannot create relation: Source and target record IDs are the same.');\n             this.context.loggingService?.logWarning('Cannot create relation: Source and target record IDs are the same.', { sourceRecordId, userId });\n             throw new Error('Cannot create a relation from a record to itself.');\n        }\n\n        const newRelationData: Omit<KnowledgeRelation, 'id' | 'creation_timestamp'> = {\n            source_record_id: sourceRecordId,\n            target_record_id: targetRecordId,\n            relation_type: relationType,\n            user_id: userId, // Associate with user\n            details: details || null,\n            // creation_timestamp is set by the database default\n        };\n\n        try {\n            // Insert into Supabase (Supports Bidirectional Sync Domain)\n            const { data, error } = await this.supabase\n                .from('knowledge_relations')\n                .insert([newRelationData])\n                .select() // Select the inserted data to get the generated ID and timestamp\n                .single(); // Expecting a single record back\n\n            if (error) {\n                console.error('Error creating knowledge relation in Supabase:', error);\n                this.context.loggingService?.logError('Failed to create knowledge relation', { sourceRecordId, targetRecordId, relationType, userId: userId, error: error.message });\n                throw error; // Re-throw the error\n            }\n\n            const createdRelation = data as KnowledgeRelation;\n            console.log('Knowledge relation created:', createdRelation.id, '-', createdRelation.relation_type, 'between', createdRelation.source_record_id, 'and', createdRelation.target_record_id, 'for user:', createdRelation.user_id);\n\n            // Publish a 'knowledge_relation_created' event (part of Six Styles/EventBus - call context.eventBus.publish)\n            this.context.eventBus?.publish('knowledge_relation_created', createdRelation, userId); // Include userId in event\n\n            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly\n            // this.context.syncService?.handleLocalDataChange('knowledgeGraphService', 'INSERT', createdRelation, userId)\n            //     .catch(syncError => console.error('Error notifying SyncService for KnowledgeRelation insert:', syncError));\n\n            return createdRelation;\n\n        } catch (error: any) {\n            console.error('Failed to create knowledge relation:', error);\n            this.context.loggingService?.logError('Failed to create knowledge relation', { sourceRecordId, targetRecordId, relationType, userId: userId, error: error.message });\n            return null; // Return null on failure\n        }\n    }\n\n    /**\n     * Retrieves knowledge relations for a specific user from Supabase.\n     * Can filter by source/target record ID or relation type.\n     * @param userId The user ID. Required.\n     * @param sourceRecordId Optional: Filter by source record ID.\n     * @param targetRecordId Optional: Filter by target record ID.\n     * @param relationType Optional: Filter by relation type.\n     * @returns Promise<KnowledgeRelation[]> An array of KnowledgeRelation objects.\n     */\n    async getRelations(userId: string, sourceRecordId?: string, targetRecordId?: string, relationType?: string): Promise<KnowledgeRelation[]> {\n        console.log("], [");\n        this.context.loggingService?.logInfo('Attempting to create knowledge relation', { sourceRecordId, targetRecordId, relationType, userId });\n\n        if (!sourceRecordId || !targetRecordId || !relationType || !userId) {\n            console.error('[KnowledgeGraphService] Cannot create relation: Missing required fields.');\n            this.context.loggingService?.logError('Cannot create knowledge relation: Missing required fields.', { sourceRecordId, targetRecordId, relationType, userId });\n            throw new Error('Source ID, target ID, type, and user ID are required to create a relation.');\n        }\n\n        // Prevent creating a relation from a record to itself\n        if (sourceRecordId === targetRecordId) {\n             console.warn('[KnowledgeGraphService] Cannot create relation: Source and target record IDs are the same.');\n             this.context.loggingService?.logWarning('Cannot create relation: Source and target record IDs are the same.', { sourceRecordId, userId });\n             throw new Error('Cannot create a relation from a record to itself.');\n        }\n\n        const newRelationData: Omit<KnowledgeRelation, 'id' | 'creation_timestamp'> = {\n            source_record_id: sourceRecordId,\n            target_record_id: targetRecordId,\n            relation_type: relationType,\n            user_id: userId, // Associate with user\n            details: details || null,\n            // creation_timestamp is set by the database default\n        };\n\n        try {\n            // Insert into Supabase (Supports Bidirectional Sync Domain)\n            const { data, error } = await this.supabase\n                .from('knowledge_relations')\n                .insert([newRelationData])\n                .select() // Select the inserted data to get the generated ID and timestamp\n                .single(); // Expecting a single record back\n\n            if (error) {\n                console.error('Error creating knowledge relation in Supabase:', error);\n                this.context.loggingService?.logError('Failed to create knowledge relation', { sourceRecordId, targetRecordId, relationType, userId: userId, error: error.message });\n                throw error; // Re-throw the error\n            }\n\n            const createdRelation = data as KnowledgeRelation;\n            console.log('Knowledge relation created:', createdRelation.id, '-', createdRelation.relation_type, 'between', createdRelation.source_record_id, 'and', createdRelation.target_record_id, 'for user:', createdRelation.user_id);\n\n            // Publish a 'knowledge_relation_created' event (part of Six Styles/EventBus - call context.eventBus.publish)\n            this.context.eventBus?.publish('knowledge_relation_created', createdRelation, userId); // Include userId in event\n\n            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly\n            // this.context.syncService?.handleLocalDataChange('knowledgeGraphService', 'INSERT', createdRelation, userId)\n            //     .catch(syncError => console.error('Error notifying SyncService for KnowledgeRelation insert:', syncError));\n\n            return createdRelation;\n\n        } catch (error: any) {\n            console.error('Failed to create knowledge relation:', error);\n            this.context.loggingService?.logError('Failed to create knowledge relation', { sourceRecordId, targetRecordId, relationType, userId: userId, error: error.message });\n            return null; // Return null on failure\n        }\n    }\n\n    /**\n     * Retrieves knowledge relations for a specific user from Supabase.\n     * Can filter by source/target record ID or relation type.\n     * @param userId The user ID. Required.\n     * @param sourceRecordId Optional: Filter by source record ID.\n     * @param targetRecordId Optional: Filter by target record ID.\n     * @param relationType Optional: Filter by relation type.\n     * @returns Promise<KnowledgeRelation[]> An array of KnowledgeRelation objects.\n     */\n    async getRelations(userId: string, sourceRecordId?: string, targetRecordId?: string, relationType?: string): Promise<KnowledgeRelation[]> {\n        console.log("]))[KnowledgeGraphService])
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
");\n        this.context.loggingService?.logInfo('Attempting to fetch knowledge relations', { userId, sourceRecordId, targetRecordId, relationType });\n\n        if (!userId) {\n            console.warn('[KnowledgeGraphService] Cannot retrieve relations: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot retrieve knowledge relations: User ID is required.');\n            return []; // Return empty if no user ID\n        }\n        try {\n            // Fetch relations from Supabase, filtered by user_id\n            let dbQuery = this.supabase\n                .from('knowledge_relations')\n                .select('*') // Select all columns\n                .eq('user_id', userId); // Filter by user ID\n\n            if (sourceRecordId) {\n                dbQuery = dbQuery.eq('source_record_id', sourceRecordId);\n            }\n            if (targetRecordId) {\n                dbQuery = dbQuery.eq('target_record_id', targetRecordId);\n            }\n            if (relationType) {\n                dbQuery = dbQuery.eq('relation_type', relationType);\n            }\n\n            dbQuery = dbQuery.order('creation_timestamp', { ascending: false } as any); // Order by creation time\n\n            const { data, error } = await dbQuery;\n\n            if (error) { throw error; }\n\n            const relations = data as KnowledgeRelation[];\n            console.log("[KnowledgeGraphService];
Fetched;
$;
{
    relations.length;
}
relations;
for (user; $; { userId: userId }.(__makeTemplateObject([");\n            this.context.loggingService?.logInfo("], [");\n            this.context.loggingService?.logInfo("])))
    Fetched;
$;
{
    relations.length;
}
relations;
successfully.(__makeTemplateObject([", { userId });\n\n            return relations;\n\n        } catch (error: any) {\n            console.error('Error fetching knowledge relations from Supabase:', error);\n            this.context.loggingService?.logError('Failed to fetch knowledge relations', { userId: userId, error: error.message });\n            return [];\n        }\n    }\n\n    /**\n     * Retrieves all relations connected to a specific record (either as source or target) for a user.\n     * @param recordId The ID of the record. Required.\n     * @param userId The user ID. Required.\n     * @returns Promise<KnowledgeRelation[]> An array of KnowledgeRelation objects.\n     */\n    async getRelationsForRecord(recordId: string, userId: string): Promise<KnowledgeRelation[]> {\n        console.log("], [", { userId });\n\n            return relations;\n\n        } catch (error: any) {\n            console.error('Error fetching knowledge relations from Supabase:', error);\n            this.context.loggingService?.logError('Failed to fetch knowledge relations', { userId: userId, error: error.message });\n            return [];\n        }\n    }\n\n    /**\n     * Retrieves all relations connected to a specific record (either as source or target) for a user.\n     * @param recordId The ID of the record. Required.\n     * @param userId The user ID. Required.\n     * @returns Promise<KnowledgeRelation[]> An array of KnowledgeRelation objects.\n     */\n    async getRelationsForRecord(recordId: string, userId: string): Promise<KnowledgeRelation[]> {\n        console.log("]))[KnowledgeGraphService];
Retrieving;
relations;
for (record; $; { recordId: recordId })
    for (user; $; { userId: userId }(__makeTemplateObject([");\n        this.context.loggingService?.logInfo("], [");\n        this.context.loggingService?.logInfo("])))
        Attempting;
to;
fetch;
relations;
for (record; $; { recordId: recordId }(__makeTemplateObject([", { recordId, userId });\n\n        if (!recordId || !userId) {\n            console.warn('[KnowledgeGraphService] Cannot retrieve relations for record: Record ID and User ID are required.');\n            this.context.loggingService?.logWarning('Cannot retrieve relations for record: Missing required fields.', { recordId, userId });\n            return [];\n        }\n\n        try {\n            // Fetch relations where the record is either the source or the target, filtered by user_id\n            const { data, error } = await this.supabase\n                .from('knowledge_relations')\n                .select('*')\n                .eq('user_id', userId) // Filter by user ID\n                .or("], [", { recordId, userId });\n\n        if (!recordId || !userId) {\n            console.warn('[KnowledgeGraphService] Cannot retrieve relations for record: Record ID and User ID are required.');\n            this.context.loggingService?.logWarning('Cannot retrieve relations for record: Missing required fields.', { recordId, userId });\n            return [];\n        }\n\n        try {\n            // Fetch relations where the record is either the source or the target, filtered by user_id\n            const { data, error } = await this.supabase\n                .from('knowledge_relations')\n                .select('*')\n                .eq('user_id', userId) // Filter by user ID\n                .or("])))
    source_record_id.eq.$;
{
    recordId;
}
target_record_id.eq.$;
{
    recordId;
}
"); // Record is source OR target\n\n            if (error) { throw error; }\n\n            const relations = data as KnowledgeRelation[];\n            console.log("[KnowledgeGraphService];
Fetched;
$;
{
    relations.length;
}
relations;
for (record; $; { recordId: recordId }.(__makeTemplateObject([");\n            this.context.loggingService?.logInfo("], [");\n            this.context.loggingService?.logInfo("])))
    Fetched;
$;
{
    relations.length;
}
relations;
for (record; $; { recordId: recordId })
    successfully.(__makeTemplateObject([", { recordId, userId });\n\n            return relations;\n\n        } catch (error: any) {\n            console.error("], [", { recordId, userId });\n\n            return relations;\n\n        } catch (error: any) {\n            console.error("]))[KnowledgeGraphService];
Error;
fetching;
relations;
for (record; $; { recordId: recordId })
    from;
Supabase: ", error);\n            this.context.loggingService?.logError(";
Failed;
to;
fetch;
relations;
for (record; $; { recordId: recordId }(__makeTemplateObject([", { recordId, userId: userId, error: error.message });\n            return [];\n        }\n    }\n\n\n    /**\n     * Deletes a knowledge relation for a specific user from Supabase.\n     * @param relationId The ID of the relation. Required.\n     * @param userId The user ID for verification. Required.\n     * @returns Promise<boolean> True if deletion was successful, false otherwise.\n     */\n    async deleteRelation(relationId: string, userId: string): Promise<boolean> {\n        console.log("], [", { recordId, userId: userId, error: error.message });\n            return [];\n        }\n    }\n\n\n    /**\n     * Deletes a knowledge relation for a specific user from Supabase.\n     * @param relationId The ID of the relation. Required.\n     * @param userId The user ID for verification. Required.\n     * @returns Promise<boolean> True if deletion was successful, false otherwise.\n     */\n    async deleteRelation(relationId: string, userId: string): Promise<boolean> {\n        console.log("]))[KnowledgeGraphService])
    Deleting;
relation;
$;
{
    relationId;
}
from;
Supabase;
for (user; $; { userId: userId })
    ;
");\n        this.context.loggingService?.logInfo(";
Attempting;
to;
delete knowledge;
relation;
$;
{
    relationId;
}
", { id: relationId, userId });\n\n         if (!relationId || !userId) {\n             console.warn('[KnowledgeGraphService] Cannot delete relation: ID and user ID are required.');\n             this.context.loggingService?.logWarning('Cannot delete knowledge relation: ID and user ID are required.');\n             return false; // Return false if no ID or user ID\n         }\n\n        try {\n            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)\n            // Filter by ID and user_id to ensure ownership\n              const { count, error } = await this.supabase\n                  .from('knowledge_relations')\n                  .delete()\n                  .eq('id', relationId)\n                  .eq('user_id', userId) // Ensure ownership\n                  .select('id', { count: 'exact' }); // Select count to check if a row was deleted\n\n              if (error) { throw error; }\n\n              const deleted = count !== null && count > 0; // Check if count is greater than 0\n\n              if (deleted) {\n                  console.log(";
Knowledge;
relation;
$;
{
    relationId;
}
deleted;
from;
Supabase.(__makeTemplateObject([");\n                  // Publish an event indicating a relation has been deleted (part of Six Styles/EventBus)                  this.context.eventBus?.publish('knowledge_relation_deleted', { relationId: relationId, userId: userId }, userId); // Include userId in event                  this.context.loggingService?.logInfo("], [");\n                  // Publish an event indicating a relation has been deleted (part of Six Styles/EventBus)\\\n                  this.context.eventBus?.publish('knowledge_relation_deleted', { relationId: relationId, userId: userId }, userId); // Include userId in event\\\n                  this.context.loggingService?.logInfo("]));
Knowledge;
relation;
deleted;
successfully: $;
{
    relationId;
}
", { id: relationId, userId: userId });              } else {                  console.warn(";
Knowledge;
relation;
$;
{
    relationId;
}
not;
found;
for (deletion; or; user)
    mismatch.(__makeTemplateObject([");                  this.context.loggingService?.logWarning("], [");\\\n                  this.context.loggingService?.logWarning("]));
Knowledge;
relation;
not;
found;
for (deletion; or; user)
    mismatch: $;
{
    relationId;
}
", { id: relationId, userId });              }              return deleted;        } catch (error: any) {            console.error(";
Failed;
to;
delete knowledge;
relation;
$;
{
    relationId;
}
", error);            this.context.loggingService?.logError(";
Failed;
to;
delete knowledge;
relation;
$;
{
    relationId;
}
", { id: relationId, userId: userId, error: error.message });            return false; // Return false on failure        }    }    /**     * Retrieves knowledge graph data (nodes and edges) for a specific user.     * Nodes are Knowledge Records, edges are Knowledge Relations.     * @param userId The user ID. Required.     * @returns Promise<{ nodes: KnowledgeRecord[], edges: KnowledgeRelation[] }> The graph data.     */    async getGraphData(userId: string): Promise<{ nodes: KnowledgeRecord[], edges: KnowledgeRelation[] }> {        console.log("[KnowledgeGraphService];
Retrieving;
graph;
data;
for (user; ; )
    : $;
{
    userId;
}
");        this.context.loggingService?.logInfo('Attempting to fetch knowledge graph data', { userId });        if (!userId) {            console.warn('[KnowledgeGraphService] Cannot retrieve graph data: User ID is required.');            this.context.loggingService?.logWarning('Cannot retrieve knowledge graph data: User ID is required.');            return { nodes: [], edges: [] };        }        try {            // Fetch all knowledge records for the user            const nodes = await this.context.memoryEngine?.getAllKnowledgeForUser(userId) || [];            console.log("[KnowledgeGraphService];
Fetched;
$;
{
    nodes.length;
}
nodes.(__makeTemplateObject([");            // Fetch all relations for the user            const edges = await this.getRelations(userId) || [];            console.log("], [");\\\n\\\n            // Fetch all relations for the user\\\n            const edges = await this.getRelations(userId) || [];\\\n            console.log("]))[KnowledgeGraphService];
Fetched;
$;
{
    edges.length;
}
edges.(__makeTemplateObject([");            // Filter edges to only include those connecting fetched nodes            const nodeIds = new Set(nodes.map(node => node.id));            const filteredEdges = edges.filter(edge => nodeIds.has(edge.source_record_id) && nodeIds.has(edge.target_record_id));            console.log("], [");\\\n\\\n            // Filter edges to only include those connecting fetched nodes\\\n            const nodeIds = new Set(nodes.map(node => node.id));\\\n            const filteredEdges = edges.filter(edge => nodeIds.has(edge.source_record_id) && nodeIds.has(edge.target_record_id));\\\n            console.log("]))[KnowledgeGraphService];
Filtered;
edges;
to;
$;
{
    filteredEdges.length;
}
connecting;
fetched;
nodes.(__makeTemplateObject([");            console.log("], [");\\\n\\\n            console.log("]))[KnowledgeGraphService];
Retrieved;
graph;
data;
for (user; ; )
    : $;
{
    userId;
}
");            this.context.loggingService?.logInfo(";
Retrieved;
knowledge;
graph;
data;
for (user; $; { userId: userId }(__makeTemplateObject([", { userId, nodeCount: nodes.length, edgeCount: filteredEdges.length });            return { nodes, edges: filteredEdges };        } catch (error: any) {            console.error("], [", { userId, nodeCount: nodes.length, edgeCount: filteredEdges.length });\\\n\\\n            return { nodes, edges: filteredEdges };\\\n\\\n        } catch (error: any) {\\\n            console.error("]))[KnowledgeGraphService])
    Error;
retrieving;
graph;
data;
for (user; $; { userId: userId })
    : ", error);            this.context.loggingService?.logError(";
Failed;
to;
retrieve;
knowledge;
graph;
data;
for (user; $; { userId: userId }(__makeTemplateObject([", { userId: userId, error: error.message });            throw error; // Re-throw the error        }    }    // TODO: Implement methods for updating relations.    // TODO: Implement methods for inferring relations (integrates with WisdomSecretArt).    // TODO: Implement methods for visualizing the graph (integrates with UI).    // TODO: This module is part of the Wisdom Precipitation (\u667A\u6167\u6C89\u6FB1) pillar.    // --- New: Realtime Subscription Methods ---    /**     * Subscribes to real-time updates from the knowledge_relations table for the current user.     * @param userId The user ID to filter updates by. Required.     */    subscribeToRelationsUpdates(userId: string): void {        console.log('[KnowledgeGraphService] Subscribing to knowledge_relations realtime updates for user:', userId);        this.context.loggingService?.logInfo('Subscribing to knowledge_relations realtime updates', { userId });        if (this.relationsSubscription) {            console.warn('[KnowledgeGraphService] Already subscribed to relations updates. Unsubscribing existing.');            this.unsubscribeFromRelationsUpdates();        }\n        // Subscribe to changes where user_id is null (public) OR user_id is the current user.\n        // RLS should ensure user only receives updates for data they can see.\n        // We subscribe to all changes on the table and rely on RLS filtering.\n        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.\n        // Let's subscribe to a channel that should include both user and public data based on RLS.\n        // A simple channel name like the table name, relying entirely on RLS, is often used.\n        // Let's switch to subscribing to the table name channel and rely on RLS.\n\n        this.relationsSubscription = this.supabase\n            .channel('knowledge_relations') // Subscribe to all changes on the table\n            .on('postgres_changes', { event: '*', schema: 'public', table: 'knowledge_relations' }, async (payload) => { // No filter here, rely on RLS\n                console.log('[KnowledgeGraphService] Realtime knowledge_relations change received:', payload);\n                const relation = (payload.new || payload.old) as KnowledgeRelation; // New data for INSERT/UPDATE, old for DELETE\n                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\n\n                // Check if the change is relevant to the current user (user-owned or public)\n                // RLS should handle this, but client-side check adds safety.\n                // To check relevance, we need the user_id of the related records.\n                // This is complex. For MVP, let's assume RLS handles it and just publish the event.\n                // The UI/listeners will need to filter based on what they can see.\n\n                // A more robust approach would involve fetching the related records to check ownership/public status.\n                // For now, rely on RLS and publish the event with the user ID associated with the relation itself.\n                const relationUserId = relation?.user_id; // User ID associated with the relation\n\n                if (relationUserId === userId) { // Only process changes for relations owned by the current user\n                     console.log("], [", { userId: userId, error: error.message });\\\n            throw error; // Re-throw the error\\\n        }\\\n    }\\\n\\\n    // TODO: Implement methods for updating relations.\\\n    // TODO: Implement methods for inferring relations (integrates with WisdomSecretArt).\\\n    // TODO: Implement methods for visualizing the graph (integrates with UI).\\\n    // TODO: This module is part of the Wisdom Precipitation (\\u667a\\u6167\\u6c89\\u6fb1) pillar.\\\n\\\n    // --- New: Realtime Subscription Methods ---\\\n    /**\\\n     * Subscribes to real-time updates from the knowledge_relations table for the current user.\\\n     * @param userId The user ID to filter updates by. Required.\\\n     */\\\n    subscribeToRelationsUpdates(userId: string): void {\\\n        console.log('[KnowledgeGraphService] Subscribing to knowledge_relations realtime updates for user:', userId);\\\n        this.context.loggingService?.logInfo('Subscribing to knowledge_relations realtime updates', { userId });\\\n\\\n        if (this.relationsSubscription) {\\\n            console.warn('[KnowledgeGraphService] Already subscribed to relations updates. Unsubscribing existing.');\\\n            this.unsubscribeFromRelationsUpdates();\\\n        }\\\n\\n        // Subscribe to changes where user_id is null (public) OR user_id is the current user.\\n        // RLS should ensure user only receives updates for data they can see.\\n        // We subscribe to all changes on the table and rely on RLS filtering.\\n        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.\\n        // Let's subscribe to a channel that should include both user and public data based on RLS.\\n        // A simple channel name like the table name, relying entirely on RLS, is often used.\\n        // Let's switch to subscribing to the table name channel and rely on RLS.\\n\\n        this.relationsSubscription = this.supabase\\n            .channel('knowledge_relations') // Subscribe to all changes on the table\\n            .on('postgres_changes', { event: '*', schema: 'public', table: 'knowledge_relations' }, async (payload) => { // No filter here, rely on RLS\\n                console.log('[KnowledgeGraphService] Realtime knowledge_relations change received:', payload);\\n                const relation = (payload.new || payload.old) as KnowledgeRelation; // New data for INSERT/UPDATE, old for DELETE\\n                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\\n\\n                // Check if the change is relevant to the current user (user-owned or public)\\n                // RLS should handle this, but client-side check adds safety.\\n                // To check relevance, we need the user_id of the related records.\\n                // This is complex. For MVP, let's assume RLS handles it and just publish the event.\\n                // The UI/listeners will need to filter based on what they can see.\\n\\n                // A more robust approach would involve fetching the related records to check ownership/public status.\\n                // For now, rely on RLS and publish the event with the user ID associated with the relation itself.\\n                const relationUserId = relation?.user_id; // User ID associated with the relation\\n\\n                if (relationUserId === userId) { // Only process changes for relations owned by the current user\\n                     console.log("]))[KnowledgeGraphService])
    Processing;
relevant;
relation;
change($, { eventType: eventType });
$;
{
    relation.id;
}
");\n\n                     // Publish an event via EventBus for other modules/UI to react\n                     this.context.eventBus?.publish(";
knowledge_relation_$;
{
    eventType.toLowerCase();
}
", relation, userId); // e.g., 'knowledge_relation_insert', 'knowledge_relation_update', 'knowledge_relation_delete'\n\n                     // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly\n                     // this.context.syncService?.handleRemoteDataChange('knowledgeGraphService', eventType, relation, userId);\n\n                } else {\n                    console.log('[KnowledgeGraphService] Received knowledge_relations change not relevant to current user (filtered by RLS or client-side).');\n                }\n            })\n            .subscribe((status, err) => {\n                 console.log('[KnowledgeGraphService] Knowledge_relations subscription status:', status);\n                 if (status === 'CHANNEL_ERROR') {\n                     console.error('[KnowledgeGraphService] Knowledge_relations subscription error:', err);\n                     this.context.loggingService?.logError('Knowledge_relations subscription error', { userId, error: err?.message });\n                 }\n            });\n    }\n\n    /**\n     * Unsubscribes from knowledge_relations real-time updates.\n     */\n    unsubscribeFromRelationsUpdates(): void {\n        if (this.relationsSubscription) {\n            console.log('[KnowledgeGraphService] Unsubscribing from knowledge_relations realtime updates.');\n            this.context.loggingService?.logInfo('Unsubscribing from knowledge_relations realtime updates');\n            this.supabase.removeChannel(this.relationsSubscription);\n            this.relationsSubscription = null;\n        }\n    }\n    // --- End New ---\n}\n"(__makeTemplateObject([""], [""]));
