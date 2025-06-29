var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/core/glossary/GlossaryService.ts\n// \u5B57\u5EAB\u670D\u52D9 (Glossary Service) - \u6838\u5FC3\u6A21\u7D44\n// Manages the creation, retrieval, updating, and deletion of glossary terms.\n// Part of the Long-term Memory pillar (specifically the Glossary aspect).\n// Design Principle: Provides a structured repository for system and user-defined terminology.\n\nimport { SupabaseClient } from '@supabase/supabase-js';\nimport { SystemContext, GlossaryTerm } from '../../interfaces';\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n\nexport class GlossaryService {\n    private supabase: SupabaseClient;\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n\n    // --- New: Realtime Subscription ---\n    private glossarySubscription: any | null = null;\n    // --- End New ---\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        console.log('GlossaryService initialized.');\n\n        // --- New: Set up Supabase Realtime subscription for glossary table ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToGlossaryUpdates(user.id);\n            } else {\n                this.unsubscribeFromGlossaryUpdates();\n            }\n        });\n        // --- End New ---\n    }\n\n    /**\n     * Creates a new glossary term for a specific user or as public in Supabase.\n     * @param termDetails The details of the term (without id, creation_timestamp, last_updated_timestamp). Required.\n     * @param userId The user ID creating the term. Optional (for user-owned terms).\n     * @param isPublic Whether the term is public. Defaults to true if no userId, false if userId is provided.\n     * @returns Promise<GlossaryTerm | null> The created term or null on failure.\n     *\n     * Privacy Note: Glossary terms are stored with an optional user_id and are subject to Row Level Security (RLS)\n     * policies in Supabase, ensuring users can only access their own private terms and all public terms.\n     */\n    async createTerm(termDetails: Omit<GlossaryTerm, 'id' | 'creation_timestamp' | 'last_updated_timestamp'>, userId?: string, isPublic?: boolean): Promise<GlossaryTerm | null> {\n        console.log('Creating glossary term in Supabase:', termDetails.term, 'for user:', userId, 'public:', isPublic);\n        this.context.loggingService?.logInfo('Attempting to create glossary term', { term: termDetails.term, userId, isPublic });\n\n        if (!termDetails.term || !termDetails.definition) {\n            console.error('[GlossaryService] Cannot create term: Term and definition are required.');\n            this.context.loggingService?.logError('Cannot create glossary term: Missing required fields.', { term: termDetails.term, userId });\n            throw new Error('Term and definition are required to create a glossary term.');\n        }\n\n        // Determine public status if not explicitly provided\n        const finalIsPublic = isPublic !== undefined ? isPublic : (userId ? false : true); // Default to public if no user, private if user\n\n        const newTermData: Omit<GlossaryTerm, 'id' | 'creation_timestamp' | 'last_updated_timestamp'> = {\n            ...termDetails,\n            user_id: userId || null, // Associate with user or null for public\n            is_public: finalIsPublic,\n            related_concepts: termDetails.related_concepts || [], // Ensure it's an array\n            // creation_timestamp and last_updated_timestamp are set by the database default/trigger\n        };\n\n        try {\n            // Insert into Supabase (Supports Bidirectional Sync Domain)\n            const { data, error } = await this.supabase\n                .from('glossary')\n                .insert([newTermData])\n                .select() // Select the inserted data to get the generated ID and timestamps\n                .single(); // Expecting a single record back\n\n            if (error) {\n                console.error('Error creating glossary term in Supabase:', error);\n                this.context.loggingService?.logError('Failed to create glossary term', { term: termDetails.term, userId: userId, error: error.message });\n                throw error; // Re-throw the error\n            }\n\n            const createdTerm = data as GlossaryTerm;\n            console.log('Glossary term created:', createdTerm.id, '-', createdTerm.term, 'for user:', createdTerm.user_id, 'public:', createdTerm.is_public);\n\n            // Publish a 'glossary_term_created' event (part of Six Styles/EventBus - call context.eventBus.publish)\n            this.context.eventBus?.publish('glossary_term_created', createdTerm, userId); // Include userId in event\n\n            // --- New: Notify SyncService about local change ---\n            // This is handled by the Realtime subscription now, which SyncService can listen to.\n            // If Realtime is not used for sync, this manual notification is needed.\n            // For MVP, let's assume SyncService listens to Realtime.\n            // this.context.syncService?.handleLocalDataChange('glossaryService', 'INSERT', createdTerm, userId)\n            //     .catch(syncError => console.error('Error notifying SyncService for GlossaryTerm insert:', syncError));\n            // --- End New ---\n\n            return createdTerm;\n\n        } catch (error: any) {\n            console.error('Failed to create glossary term:', error);\n            this.context.loggingService?.logError('Failed to create glossary term', { term: termDetails.term, userId: userId, error: error.message });\n            return null; // Return null on failure\n        }\n    }\n\n    /**\n     * Retrieves glossary terms for a specific user (their private terms and all public terms) from Supabase.\n     * Can filter by pillar/domain or search term.\n     * @param userId The user ID. Required to filter private terms.\n     * @param pillarDomain Optional: Filter by pillar/domain.\n     * @param searchTerm Optional: Search terms in term or definition.\n     * @returns Promise<GlossaryTerm[]> An array of GlossaryTerm objects.\n     */\n    async getTerms(userId: string, pillarDomain?: string, searchTerm?: string): Promise<GlossaryTerm[]> {\n        console.log('Retrieving glossary terms for user:', userId, 'domain:', pillarDomain || 'all', 'search:', searchTerm || 'none');\n        this.context.loggingService?.logInfo('Attempting to fetch glossary terms', { userId, pillarDomain, searchTerm });\n\n        if (!userId) {\n            console.warn('[GlossaryService] Cannot retrieve terms: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot retrieve glossary terms: User ID is required.');\n            return []; // Return empty if no user ID\n        }\n        try {\n            // Fetch terms from Supabase, filtered by user_id OR is_public\n            let dbQuery = this.supabase\n                .from('glossary')\n                .select('*') // Select all columns\n                .or("], ["typescript\n// src/core/glossary/GlossaryService.ts\n// \u5B57\u5EAB\u670D\u52D9 (Glossary Service) - \u6838\u5FC3\u6A21\u7D44\n// Manages the creation, retrieval, updating, and deletion of glossary terms.\n// Part of the Long-term Memory pillar (specifically the Glossary aspect).\n// Design Principle: Provides a structured repository for system and user-defined terminology.\n\nimport { SupabaseClient } from '@supabase/supabase-js';\nimport { SystemContext, GlossaryTerm } from '../../interfaces';\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n\nexport class GlossaryService {\n    private supabase: SupabaseClient;\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n\n    // --- New: Realtime Subscription ---\n    private glossarySubscription: any | null = null;\n    // --- End New ---\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        console.log('GlossaryService initialized.');\n\n        // --- New: Set up Supabase Realtime subscription for glossary table ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToGlossaryUpdates(user.id);\n            } else {\n                this.unsubscribeFromGlossaryUpdates();\n            }\n        });\n        // --- End New ---\n    }\n\n    /**\n     * Creates a new glossary term for a specific user or as public in Supabase.\n     * @param termDetails The details of the term (without id, creation_timestamp, last_updated_timestamp). Required.\n     * @param userId The user ID creating the term. Optional (for user-owned terms).\n     * @param isPublic Whether the term is public. Defaults to true if no userId, false if userId is provided.\n     * @returns Promise<GlossaryTerm | null> The created term or null on failure.\n     *\n     * Privacy Note: Glossary terms are stored with an optional user_id and are subject to Row Level Security (RLS)\n     * policies in Supabase, ensuring users can only access their own private terms and all public terms.\n     */\n    async createTerm(termDetails: Omit<GlossaryTerm, 'id' | 'creation_timestamp' | 'last_updated_timestamp'>, userId?: string, isPublic?: boolean): Promise<GlossaryTerm | null> {\n        console.log('Creating glossary term in Supabase:', termDetails.term, 'for user:', userId, 'public:', isPublic);\n        this.context.loggingService?.logInfo('Attempting to create glossary term', { term: termDetails.term, userId, isPublic });\n\n        if (!termDetails.term || !termDetails.definition) {\n            console.error('[GlossaryService] Cannot create term: Term and definition are required.');\n            this.context.loggingService?.logError('Cannot create glossary term: Missing required fields.', { term: termDetails.term, userId });\n            throw new Error('Term and definition are required to create a glossary term.');\n        }\n\n        // Determine public status if not explicitly provided\n        const finalIsPublic = isPublic !== undefined ? isPublic : (userId ? false : true); // Default to public if no user, private if user\n\n        const newTermData: Omit<GlossaryTerm, 'id' | 'creation_timestamp' | 'last_updated_timestamp'> = {\n            ...termDetails,\n            user_id: userId || null, // Associate with user or null for public\n            is_public: finalIsPublic,\n            related_concepts: termDetails.related_concepts || [], // Ensure it's an array\n            // creation_timestamp and last_updated_timestamp are set by the database default/trigger\n        };\n\n        try {\n            // Insert into Supabase (Supports Bidirectional Sync Domain)\n            const { data, error } = await this.supabase\n                .from('glossary')\n                .insert([newTermData])\n                .select() // Select the inserted data to get the generated ID and timestamps\n                .single(); // Expecting a single record back\n\n            if (error) {\n                console.error('Error creating glossary term in Supabase:', error);\n                this.context.loggingService?.logError('Failed to create glossary term', { term: termDetails.term, userId: userId, error: error.message });\n                throw error; // Re-throw the error\n            }\n\n            const createdTerm = data as GlossaryTerm;\n            console.log('Glossary term created:', createdTerm.id, '-', createdTerm.term, 'for user:', createdTerm.user_id, 'public:', createdTerm.is_public);\n\n            // Publish a 'glossary_term_created' event (part of Six Styles/EventBus - call context.eventBus.publish)\n            this.context.eventBus?.publish('glossary_term_created', createdTerm, userId); // Include userId in event\n\n            // --- New: Notify SyncService about local change ---\n            // This is handled by the Realtime subscription now, which SyncService can listen to.\n            // If Realtime is not used for sync, this manual notification is needed.\n            // For MVP, let's assume SyncService listens to Realtime.\n            // this.context.syncService?.handleLocalDataChange('glossaryService', 'INSERT', createdTerm, userId)\n            //     .catch(syncError => console.error('Error notifying SyncService for GlossaryTerm insert:', syncError));\n            // --- End New ---\n\n            return createdTerm;\n\n        } catch (error: any) {\n            console.error('Failed to create glossary term:', error);\n            this.context.loggingService?.logError('Failed to create glossary term', { term: termDetails.term, userId: userId, error: error.message });\n            return null; // Return null on failure\n        }\n    }\n\n    /**\n     * Retrieves glossary terms for a specific user (their private terms and all public terms) from Supabase.\n     * Can filter by pillar/domain or search term.\n     * @param userId The user ID. Required to filter private terms.\n     * @param pillarDomain Optional: Filter by pillar/domain.\n     * @param searchTerm Optional: Search terms in term or definition.\n     * @returns Promise<GlossaryTerm[]> An array of GlossaryTerm objects.\n     */\n    async getTerms(userId: string, pillarDomain?: string, searchTerm?: string): Promise<GlossaryTerm[]> {\n        console.log('Retrieving glossary terms for user:', userId, 'domain:', pillarDomain || 'all', 'search:', searchTerm || 'none');\n        this.context.loggingService?.logInfo('Attempting to fetch glossary terms', { userId, pillarDomain, searchTerm });\n\n        if (!userId) {\n            console.warn('[GlossaryService] Cannot retrieve terms: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot retrieve glossary terms: User ID is required.');\n            return []; // Return empty if no user ID\n        }\n        try {\n            // Fetch terms from Supabase, filtered by user_id OR is_public\n            let dbQuery = this.supabase\n                .from('glossary')\n                .select('*') // Select all columns\n                .or("]));
user_id.eq.$;
{
    userId;
}
is_public.eq.true(__makeTemplateObject(["); // Fetch user's own terms OR public terms\n\n            if (pillarDomain) {\n                dbQuery = dbQuery.eq('pillar_domain', pillarDomain);\n            }\n\n            if (searchTerm) {\n                // Use text search on term and definition\n                dbQuery = dbQuery.textSearch('fts', searchTerm); // Assuming FTS index 'fts' on term || ' ' || definition\n            }\n\n            dbQuery = dbQuery.order('term', { ascending: true } as any); // Order by term alphabetically\n\n            const { data, error } = await dbQuery;\n\n            if (error) { throw error; }\n\n            const terms = data as GlossaryTerm[];\n            console.log("], ["); // Fetch user's own terms OR public terms\n\n            if (pillarDomain) {\n                dbQuery = dbQuery.eq('pillar_domain', pillarDomain);\n            }\n\n            if (searchTerm) {\n                // Use text search on term and definition\n                dbQuery = dbQuery.textSearch('fts', searchTerm); // Assuming FTS index 'fts' on term || ' ' || definition\n            }\n\n            dbQuery = dbQuery.order('term', { ascending: true } as any); // Order by term alphabetically\n\n            const { data, error } = await dbQuery;\n\n            if (error) { throw error; }\n\n            const terms = data as GlossaryTerm[];\n            console.log("]));
Fetched;
$;
{
    terms.length;
}
glossary;
terms;
for (user; $; { userId: userId }.(__makeTemplateObject([");\n            this.context.loggingService?.logInfo("], [");\n            this.context.loggingService?.logInfo("])))
    Fetched;
$;
{
    terms.length;
}
glossary;
terms;
successfully.(__makeTemplateObject([", { userId });\n\n            return terms;\n\n        } catch (error: any) {\n            console.error('Error fetching glossary terms from Supabase:', error);\n            this.context.loggingService?.logError('Failed to fetch glossary terms', { userId: userId, error: error.message });\n            return [];\n        }\n    }\n\n    /**\n     * Retrieves a specific glossary term by ID for a specific user from Supabase.\n     * Checks if the term is public or owned by the user.\n     * @param termId The ID of the term. Required.\n     * @param userId The user ID for verification. Required.\n     * @returns Promise<GlossaryTerm | undefined> The GlossaryTerm object or undefined.\n     */\n    async getTermById(termId: string, userId: string): Promise<GlossaryTerm | undefined> {\n        console.log('Retrieving glossary term by ID from Supabase:', termId, 'for user:', userId);\n        this.context.loggingService?.logInfo("], [", { userId });\n\n            return terms;\n\n        } catch (error: any) {\n            console.error('Error fetching glossary terms from Supabase:', error);\n            this.context.loggingService?.logError('Failed to fetch glossary terms', { userId: userId, error: error.message });\n            return [];\n        }\n    }\n\n    /**\n     * Retrieves a specific glossary term by ID for a specific user from Supabase.\n     * Checks if the term is public or owned by the user.\n     * @param termId The ID of the term. Required.\n     * @param userId The user ID for verification. Required.\n     * @returns Promise<GlossaryTerm | undefined> The GlossaryTerm object or undefined.\n     */\n    async getTermById(termId: string, userId: string): Promise<GlossaryTerm | undefined> {\n        console.log('Retrieving glossary term by ID from Supabase:', termId, 'for user:', userId);\n        this.context.loggingService?.logInfo("]));
Attempting;
to;
fetch;
glossary;
term;
$;
{
    termId;
}
", { id: termId, userId });\n\n         if (!userId) {\n             console.warn('[GlossaryService] Cannot retrieve term: User ID is required.');\n             this.context.loggingService?.logWarning('Cannot retrieve glossary term: User ID is required.');\n             return undefined;\n         }\n        try {\n            // Fetch term from Supabase by ID and check if it's public OR owned by the user\n              const { data, error } = await this.supabase\n                  .from('glossary')\n                  .select('*')\n                  .eq('id', termId)\n                  .or(";
user_id.eq.$;
{
    userId;
}
is_public.eq.true(__makeTemplateObject([") // Ensure ownership OR public status\n                  .single();\n\n              if (error) { throw error; }\n              if (!data) { return undefined; } // Term not found or doesn't belong to user/is not public\n\n              const term = data as GlossaryTerm;\n\n              console.log("], [") // Ensure ownership OR public status\n                  .single();\n\n              if (error) { throw error; }\n              if (!data) { return undefined; } // Term not found or doesn't belong to user/is not public\n\n              const term = data as GlossaryTerm;\n\n              console.log("]));
Fetched;
glossary;
term;
$;
{
    termId;
}
for (user; $; { userId: userId }.(__makeTemplateObject([");\n              this.context.loggingService?.logInfo("], [");\n              this.context.loggingService?.logInfo("])))
    Fetched;
glossary;
term;
$;
{
    termId;
}
successfully.(__makeTemplateObject([", { id: termId, userId: userId });\n\n              return term;\n\n        } catch (error: any) {\n            console.error("], [", { id: termId, userId: userId });\n\n              return term;\n\n        } catch (error: any) {\n            console.error("]));
Error;
fetching;
glossary;
term;
$;
{
    termId;
}
from;
Supabase: ", error);\n            this.context.loggingService?.logError(";
Failed;
to;
fetch;
glossary;
term;
$;
{
    termId;
}
", { id: termId, userId: userId, error: error.message });\n            return undefined;\n        }\n    }\n\n\n    /**\n     * Updates an existing glossary term for a specific user in Supabase.\n     * Only allows updating terms owned by the user.\n     * @param termId The ID of the term to update. Required.\n     * @param updates The updates to apply (term, definition, related_concepts, pillar_domain, is_public). Required.\n     * @param userId The user ID for verification (checks ownership). Required.\n     * @returns Promise<GlossaryTerm | undefined> The updated term or undefined if not found or user mismatch.\n     */\n    async updateTerm(termId: string, updates: Partial<Omit<GlossaryTerm, 'id' | 'user_id' | 'creation_timestamp' | 'last_updated_timestamp'>>, userId: string): Promise<GlossaryTerm | undefined> {\n        console.log(";
Updating;
glossary;
term;
$;
{
    termId;
}
 in Supabase;
for (user; $; { userId: userId })
    ;
", updates);\n        this.context.loggingService?.logInfo(";
Attempting;
to;
update;
glossary;
term;
$;
{
    termId;
}
", { id: termId, updates, userId });\n\n         if (!userId) {\n             console.warn('[GlossaryService] Cannot update term: User ID is required.');\n             this.context.loggingService?.logWarning('Cannot update glossary term: User ID is required.');\n             return undefined;\n         }\n\n        try {\n            // Persist update to Supabase (Supports Bidirectional Sync Domain)\n            // Filter by ID and user_id to ensure ownership and that it's not a public term (unless admin)\n              const { data, error } = await this.supabase\n                  .from('glossary')\n                  .update(updates)\n                  .eq('id', termId)\n                  .eq('user_id', userId) // Ensure ownership (users can only update their own terms)\n                  .eq('is_public', false) // Users can only update their *private* terms via this method\n                  .select() // Select updated term data\n                  .single();\n\n              if (error) { throw error; }\n              if (!data) { // Should not happen if RLS is correct and ID/user_id match\n                   console.warn(";
Glossary;
term;
$;
{
    termId;
}
not;
found;
or;
does;
not;
belong;
to;
user;
$;
{
    userId;
}
(or);
is;
public;
for (update.(__makeTemplateObject([");\n                   this.context.loggingService?.logWarning("], [");\n                   this.context.loggingService?.logWarning("])); Glossary; term)
    not;
found;
or;
user;
mismatch;
for (update; ; )
    : $;
{
    termId;
}
", { userId });\n                   return undefined;\n              }\n\n              const updatedTerm = data as GlossaryTerm;\n\n              console.log(";
Glossary;
term;
$;
{
    termId;
}
updated in Supabase.(__makeTemplateObject([");\n              // Publish an event indicating a term has been updated (part of Six Styles/EventBus)\n              this.context.eventBus?.publish('glossary_term_updated', updatedTerm, userId); // Include userId in event\n              this.context.loggingService?.logInfo("], [");\n              // Publish an event indicating a term has been updated (part of Six Styles/EventBus)\n              this.context.eventBus?.publish('glossary_term_updated', updatedTerm, userId); // Include userId in event\n              this.context.loggingService?.logInfo("]));
Glossary;
term;
updated;
successfully: $;
{
    termId;
}
", { id: termId, userId: userId });\n\n              return updatedTerm;\n\n          } catch (error: any) {\n              console.error(";
Failed;
to;
update;
glossary;
term;
$;
{
    termId;
}
", error);\n              this.context.loggingService?.logError(";
Failed;
to;
update;
glossary;
term;
$;
{
    termId;
}
", { id: termId, updates, userId: userId, error: error.message });\n              throw error; // Re-throw the error\n          }\n    }\n\n    /**\n     * Deletes a glossary term for a specific user from Supabase.\n     * Only allows deleting terms owned by the user.\n     * @param termId The ID of the term. Required.\n     * @param userId The user ID for verification (checks ownership). Required.\n     * @returns Promise<boolean> True if deletion was successful, false otherwise.\n     */\n    async deleteTerm(termId: string, userId: string): Promise<boolean> {\n        console.log(";
Deleting;
glossary;
term;
$;
{
    termId;
}
from;
Supabase;
for (user; $; { userId: userId })
    ;
");\n        this.context.loggingService?.logInfo(";
Attempting;
to;
delete glossary;
term;
$;
{
    termId;
}
", { id: termId, userId });\n\n         if (!userId) {\n             console.warn('[GlossaryService] Cannot delete term: User ID is required.');\n             this.context.loggingService?.logWarning('Cannot delete glossary term: User ID is required.');\n             return false; // Return false if no user ID\n         }\n\n        try {\n            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)\n            // Filter by ID and user_id to ensure ownership and that it's not a public term (unless admin)\n              const { count, error } = await this.supabase\n                  .from('glossary')\n                  .delete()\n                  .eq('id', termId)\n                  .eq('user_id', userId) // Ensure ownership (users can only delete their own terms)\n                  .eq('is_public', false) // Users can only delete their *private* terms via this method\n                  .select('id', { count: 'exact' }); // Select count to check if a row was deleted\n\n              if (error) { throw error; }\n\n              const deleted = count !== null && count > 0; // Check if count is greater than 0\n\n              if (deleted) {\n                  console.log(";
Glossary;
term;
$;
{
    termId;
}
deleted;
from;
Supabase.(__makeTemplateObject([");\n                  // Publish an event indicating a term has been deleted (part of Six Styles/EventBus)\n                  this.context.eventBus?.publish('glossary_term_deleted', { termId: termId, userId: userId }, userId); // Include userId in event\n                  this.context.loggingService?.logInfo("], [");\n                  // Publish an event indicating a term has been deleted (part of Six Styles/EventBus)\n                  this.context.eventBus?.publish('glossary_term_deleted', { termId: termId, userId: userId }, userId); // Include userId in event\n                  this.context.loggingService?.logInfo("]));
Glossary;
term;
deleted;
successfully: $;
{
    termId;
}
", { id: termId, userId: userId });\n              } else {\n                  console.warn(";
Glossary;
term;
$;
{
    termId;
}
not;
found;
for (deletion; or; user)
    mismatch(or, is, public).(__makeTemplateObject([");\n                  this.context.loggingService?.logWarning("], [");\n                  this.context.loggingService?.logWarning("]));
Glossary;
term;
not;
found;
for (deletion; or; user)
    mismatch: $;
{
    termId;
}
", { id: termId, userId });\n              }\n              return deleted;\n\n        } catch (error: any) {\n            console.error(";
Failed;
to;
delete glossary;
term;
$;
{
    termId;
}
", error);\n            this.context.loggingService?.logError(";
Failed;
to;
delete glossary;
term;
$;
{
    termId;
}
", { id: termId, userId: userId, error: error.message });\n            return false; // Return false on failure\n        }\n    }\n\n    // TODO: Implement methods for importing/exporting glossary terms.\n    // TODO: Implement methods for suggesting new terms based on user input/knowledge.\n    // TODO: This module is part of the Long-term Memory (\u6C38\u4E45\u8A18\u61B6) pillar.\n\n\n    // --- New: Realtime Subscription Methods ---\n    /**\n     * Subscribes to real-time updates from the glossary table for the current user (user-owned and public).\n     * @param userId The user ID to filter updates by. Required.\n     */\n    subscribeToGlossaryUpdates(userId: string): void {\n        console.log('[GlossaryService] Subscribing to glossary realtime updates for user:', userId);\n        this.context.loggingService?.logInfo('Subscribing to glossary realtime updates', { userId });\n\n        if (this.glossarySubscription) {\n            console.warn('[GlossaryService] Already subscribed to glossary updates. Unsubscribing existing.');\n            this.unsubscribeFromGlossaryUpdates();\n        }\n\n        // Subscribe to changes where user_id is null (public) OR user_id is the current user.\n        // RLS should ensure user only receives updates for terms they can see.\n        // We subscribe to all changes on the table and rely on RLS filtering.\n        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.\n        // Let's subscribe to a channel that should include both user and public data based on RLS.\n        // A simple channel name like the table name, relying entirely on RLS, is often used.\n        // Let's switch to subscribing to the table name channel and rely on RLS.\n\n        this.glossarySubscription = this.supabase\n            .channel('glossary') // Subscribe to all changes on the table\n            .on('postgres_changes', { event: '*', schema: 'public', table: 'glossary' }, async (payload) => { // No filter here, rely on RLS\n                console.log('[GlossaryService] Realtime glossary change received:', payload);\n                const term = payload.new as GlossaryTerm; // New data for INSERT/UPDATE\n                const oldTerm = payload.old as GlossaryTerm; // Old data for UPDATE/DELETE\n                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\n\n                // Check if the change is relevant to the current user (user-owned or public)\n                // RLS should handle this, but client-side check adds safety.\n                const relevantTerm = term || oldTerm;\n                const isRelevant = relevantTerm?.user_id === userId || relevantTerm?.is_public === true;\n\n                if (isRelevant) {\n                    console.log("[GlossaryService];
Processing;
relevant;
glossary;
change($, { eventType: eventType });
$;
{
    relevantTerm.id;
}
");\n\n                    // Publish an event via EventBus for other modules/UI to react\n                    this.context.eventBus?.publish(";
glossary_term_$;
{
    eventType.toLowerCase();
}
", term || oldTerm, userId); // e.g., 'glossary_term_insert', 'glossary_term_update', 'glossary_term_delete'\n\n                    // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly\n                    // this.context.syncService?.handleRemoteDataChange('glossaryService', eventType, term || oldTerm, userId);\n\n                } else {\n                    console.log('[GlossaryService] Received glossary change not relevant to current user (filtered by RLS or client-side).');\n                }\n            })\n            .subscribe((status, err) => {\n                 console.log('[GlossaryService] Glossary subscription status:', status);\n                 if (status === 'CHANNEL_ERROR') {\n                     console.error('[GlossaryService] Glossary subscription error:', err);\n                     this.context.loggingService?.logError('Glossary subscription error', { userId, error: err?.message });\n                 }\n            });\n    }\n\n    /**\n     * Unsubscribes from glossary real-time updates.\n     */\n    unsubscribeFromGlossaryUpdates(): void {\n        if (this.glossarySubscription) {\n            console.log('[GlossaryService] Unsubscribing from glossary realtime updates.');\n            this.context.loggingService?.logInfo('Unsubscribing from glossary realtime updates');\n            this.supabase.removeChannel(this.glossarySubscription);\n            this.glossarySubscription = null;\n        }\n    }\n    // --- End New ---\n}\n"(__makeTemplateObject([""], [""]));
