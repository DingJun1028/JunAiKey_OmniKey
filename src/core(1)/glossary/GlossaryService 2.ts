```typescript
// src/core/glossary/GlossaryService.ts
// 字庫服務 (Glossary Service) - 核心模組
// Manages the creation, retrieval, updating, and deletion of glossary terms.
// Part of the Long-term Memory pillar (specifically the Glossary aspect).
// Design Principle: Provides a structured repository for system and user-defined terminology.

import { SupabaseClient } from '@supabase/supabase-js';
import { SystemContext, GlossaryTerm } from '../../interfaces';
// import { LoggingService } from '../logging/LoggingService'; // Dependency
// import { EventBus } from '../../modules/events/EventBus'; // Dependency

export class GlossaryService {
    private supabase: SupabaseClient;
    private context: SystemContext;
    // private loggingService: LoggingService; // Access via context
    // private eventBus: EventBus; // Access via context

    // --- New: Realtime Subscription ---
    private glossarySubscription: any | null = null;
    // --- End New ---

    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
        // this.loggingService = context.loggingService;
        // this.eventBus = context.eventBus;
        console.log('GlossaryService initialized.');

        // --- New: Set up Supabase Realtime subscription for glossary table ---
        // Subscribe when the user is authenticated.
        this.context.securityService?.onAuthStateChange((user) => {
            if (user) {
                this.subscribeToGlossaryUpdates(user.id);
            } else {
                this.unsubscribeFromGlossaryUpdates();
            }
        });
        // --- End New ---
    }

    /**
     * Creates a new glossary term for a specific user or as public in Supabase.
     * @param termDetails The details of the term (without id, creation_timestamp, last_updated_timestamp). Required.
     * @param userId The user ID creating the term. Optional (for user-owned terms).
     * @param isPublic Whether the term is public. Defaults to true if no userId, false if userId is provided.
     * @returns Promise<GlossaryTerm | null> The created term or null on failure.
     *
     * Privacy Note: Glossary terms are stored with an optional user_id and are subject to Row Level Security (RLS)
     * policies in Supabase, ensuring users can only access their own private terms and all public terms.
     */
    async createTerm(termDetails: Omit<GlossaryTerm, 'id' | 'creation_timestamp' | 'last_updated_timestamp'>, userId?: string, isPublic?: boolean): Promise<GlossaryTerm | null> {
        console.log('Creating glossary term in Supabase:', termDetails.term, 'for user:', userId, 'public:', isPublic);
        this.context.loggingService?.logInfo('Attempting to create glossary term', { term: termDetails.term, userId, isPublic });

        if (!termDetails.term || !termDetails.definition) {
            console.error('[GlossaryService] Cannot create term: Term and definition are required.');
            this.context.loggingService?.logError('Cannot create glossary term: Missing required fields.', { term: termDetails.term, userId });
            throw new Error('Term and definition are required to create a glossary term.');
        }

        // Determine public status if not explicitly provided
        const finalIsPublic = isPublic !== undefined ? isPublic : (userId ? false : true); // Default to public if no user, private if user

        const newTermData: Omit<GlossaryTerm, 'id' | 'creation_timestamp' | 'last_updated_timestamp'> = {
            ...termDetails,
            user_id: userId || null, // Associate with user or null for public
            is_public: finalIsPublic,
            related_concepts: termDetails.related_concepts || [], // Ensure it's an array
            // creation_timestamp and last_updated_timestamp are set by the database default/trigger
        };

        try {
            // Insert into Supabase (Supports Bidirectional Sync Domain)
            const { data, error } = await this.supabase
                .from('glossary')
                .insert([newTermData])
                .select() // Select the inserted data to get the generated ID and timestamps
                .single(); // Expecting a single record back

            if (error) {
                console.error('Error creating glossary term in Supabase:', error);
                this.context.loggingService?.logError('Failed to create glossary term', { term: termDetails.term, userId: userId, error: error.message });
                throw error; // Re-throw the error
            }

            const createdTerm = data as GlossaryTerm;
            console.log('Glossary term created:', createdTerm.id, '-', createdTerm.term, 'for user:', createdTerm.user_id, 'public:', createdTerm.is_public);

            // Publish a 'glossary_term_created' event (part of Six Styles/EventBus - call context.eventBus.publish)
            this.context.eventBus?.publish('glossary_term_created', createdTerm, userId); // Include userId in event

            // --- New: Notify SyncService about local change ---
            // This is handled by the Realtime subscription now, which SyncService can listen to.
            // If Realtime is not used for sync, this manual notification is needed.
            // For MVP, let's assume SyncService listens to Realtime.
            // this.context.syncService?.handleLocalDataChange('glossaryService', 'INSERT', createdTerm, userId)
            //     .catch(syncError => console.error('Error notifying SyncService for GlossaryTerm insert:', syncError));
            // --- End New ---

            return createdTerm;

        } catch (error: any) {
            console.error('Failed to create glossary term:', error);
            this.context.loggingService?.logError('Failed to create glossary term', { term: termDetails.term, userId: userId, error: error.message });
            return null; // Return null on failure
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
            console.warn('[GlossaryService] Cannot retrieve terms: User ID is required.');
            this.context.loggingService?.logWarning('Cannot retrieve glossary terms: User ID is required.');
            return []; // Return empty if no user ID
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

            if (error) { throw error; }

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
             console.warn('[GlossaryService] Cannot retrieve term: User ID is required.');
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

              if (error) { throw error; }
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
             console.warn('[GlossaryService] Cannot update term: User ID is required.');
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

              if (error) { throw error; }
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
             console.warn('[GlossaryService] Cannot delete term: User ID is required.');
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
    // TODO: This module is part of the Long-term Memory (永久記憶) pillar.


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