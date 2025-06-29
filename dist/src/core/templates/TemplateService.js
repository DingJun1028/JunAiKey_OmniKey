"use strict";
`` `typescript
// src/core/templates/TemplateService.ts
// 範本服務 (Template Service) - 核心模組
// Manages the creation, retrieval, updating, and deletion of user-defined templates.
// Part of the Long-term Memory pillar (specifically the Template Library aspect).
// Design Principle: Provides a structured repository for reusable content and workflows.

import { SupabaseClient } from '@supabase/supabase-js';
import { SystemContext, Template } from '../../interfaces';
// import { LoggingService } from '../logging/LoggingService'; // Dependency
// import { EventBus } from '../../modules/events/EventBus'; // Dependency

export class TemplateService {
    private supabase: SupabaseClient;
    private context: SystemContext;
    // private loggingService: LoggingService; // Access via context
    // private eventBus: EventBus; // Access via context

    // --- New: Realtime Subscription ---
    private templatesSubscription: any | null = null;
    // --- End New ---

    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
        // this.loggingService = context.loggingService;
        // this.eventBus = context.eventBus;
        console.log('TemplateService initialized.');

        // --- New: Set up Supabase Realtime subscription for templates table ---
        // Subscribe when the user is authenticated.
        this.context.securityService?.onAuthStateChange((user) => {
            if (user) {
                this.subscribeToTemplatesUpdates(user.id);
            } else {
                this.unsubscribeFromTemplatesUpdates();
            }
        });
        // --- End New ---
    }

    /**
     * Creates a new template for a specific user or as public in Supabase.
     * @param templateDetails The details of the template (without id, created_at, updated_at). Required.
     * @param userId The user ID creating the template. Required.
     * @returns Promise<Template | null> The created template or null on failure.
     *
     * Privacy Note: Templates are stored with a user_id and are subject to Row Level Security (RLS)
     * policies in Supabase, ensuring users can only access their own private templates and all public templates.
     */
    async createTemplate(templateDetails: Omit<Template, 'id' | 'created_at' | 'updated_at'>, userId: string): Promise<Template | null> {
        console.log('Creating template in Supabase:', templateDetails.name, 'for user:', userId);
        this.context.loggingService?.logInfo('Attempting to create template', { name: templateDetails.name, userId });

        if (!userId || !templateDetails.name || !templateDetails.type || templateDetails.content === undefined) {
            console.error('[TemplateService] Cannot create template: User ID, name, type, and content are required.');
            this.context.loggingService?.logError('Cannot create template: Missing required fields.', { details: templateDetails, userId });
            throw new Error('User ID, name, type, and content are required to create a template.');
        }

        const newTemplateData: Omit<Template, 'id' | 'created_at' | 'updated_at'> = {
            ...templateDetails,
            user_id: userId, // Associate with user
            is_public: templateDetails.is_public || false, // Default to false if not provided
            tags: templateDetails.tags || [], // Ensure tags is an array
            // created_at and updated_at are set by the database default/trigger
        };

        try {
            // Insert into Supabase (Supports Bidirectional Sync Domain)
            const { data, error } = await this.supabase
                .from('templates')
                .insert([newTemplateData])
                .select() // Select the inserted data to get the generated ID and timestamps
                .single(); // Expecting a single record back

            if (error) {
                console.error('Error creating template in Supabase:', error);
                this.context.loggingService?.logError('Failed to create template', { name: templateDetails.name, userId: userId, error: error.message });
                throw error; // Re-throw the error
            }

            const createdTemplate = data as Template;
            console.log('Template created:', createdTemplate.id, '-', createdTemplate.name, 'for user:', createdTemplate.user_id, 'public:', createdTemplate.is_public);

            // Publish a 'template_created' event (part of Six Styles/EventBus - call context.eventBus.publish)
            this.context.eventBus?.publish('template_created', createdTemplate, userId); // Include userId in event

            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly
            // this.context.syncService?.handleLocalDataChange('templateService', 'INSERT', createdTemplate, userId)
            //     .catch(syncError => console.error('Error notifying SyncService for Template insert:', syncError));

            return createdTemplate;

        } catch (error: any) {
            console.error('Failed to create template:', error);
            this.context.loggingService?.logError('Failed to create template', { name: templateDetails.name, userId: userId, error: error.message });
            return null; // Return null on failure
        }
    }

    /**
     * Retrieves templates for a specific user (their private templates and all public templates) from Supabase.
     * Can filter by type or tags.
     * @param userId The user ID. Required to filter private templates.
     * @param typeFilter Optional: Filter by template type.
     * @param tagsFilter Optional: Filter by tags (match any in array).
     * @returns Promise<Template[]> An array of Template objects.
     */
    async getTemplates(userId: string, typeFilter?: Template['type'], tagsFilter?: string[]): Promise<Template[]> {
        console.log(`[TemplateService];
Retrieving;
templates;
for (user; ; )
    : $;
{
    userId;
}
type: $;
{
    typeFilter || 'all';
}
tags: $;
{
    tagsFilter || 'any';
}
`);
        this.context.loggingService?.logInfo('Attempting to fetch templates', { userId, typeFilter, tagsFilter });

        if (!userId) {
            console.warn('[TemplateService] Cannot retrieve templates: User ID is required.');
            this.context.loggingService?.logWarning('Cannot retrieve templates: User ID is required.');
            return []; // Return empty if no user ID
        }
        try {
            // Fetch templates from Supabase, filtered by user_id OR is_public
            let dbQuery = this.supabase
                .from('templates')
                .select('*') // Select all columns
                .or(`;
user_id.eq.$;
{
    userId;
}
is_public.eq.true `); // Fetch user's own templates OR public templates

            if (typeFilter) {
                dbQuery = dbQuery.eq('type', typeFilter);
            }

            if (tagsFilter && tagsFilter.length > 0) {
                // Filter by tags (match any in the provided array)
                dbQuery = dbQuery.overlaps('tags', tagsFilter);
            }

            dbQuery = dbQuery.order('name', { ascending: true } as any); // Order by name alphabetically

            const { data, error } = await dbQuery;

            if (error) { throw error; }

            const templates = data as Template[];
            console.log(`;
Fetched;
$;
{
    templates.length;
}
templates;
for (user; $; { userId }. `);
            this.context.loggingService?.logInfo(`)
    Fetched;
$;
{
    templates.length;
}
templates;
successfully. `, { userId });

            return templates;

        } catch (error: any) {
            console.error('Error fetching templates from Supabase:', error);
            this.context.loggingService?.logError('Failed to fetch templates', { userId: userId, error: error.message });
            return [];
        }
    }

    /**
     * Retrieves a specific template by ID for a specific user from Supabase.
     * Checks if the template is public or owned by the user.
     * @param templateId The ID of the template. Required.
     * @param userId The user ID for verification. Required.
     * @returns Promise<Template | undefined> The Template object or undefined.
     */
    async getTemplateById(templateId: string, userId: string): Promise<Template | undefined> {
        console.log('Retrieving template by ID from Supabase:', templateId, 'for user:', userId);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
fetch;
template;
$;
{
    templateId;
}
`, { id: templateId, userId });

         if (!userId) {
             console.warn('[TemplateService] Cannot retrieve template: User ID is required.');
             this.context.loggingService?.logWarning('Cannot retrieve template: User ID is required.');
             return undefined;
         }
        try {
            // Fetch template from Supabase by ID and check if it's public OR owned by the user
              const { data, error } = await this.supabase
                  .from('templates')
                  .select('*')
                  .eq('id', templateId)
                  .or(`;
user_id.eq.$;
{
    userId;
}
is_public.eq.true `) // Ensure ownership OR public status
                  .single();

              if (error) { throw error; }
              if (!data) { return undefined; } // Template not found or doesn't belong to user/is not public

              const template = data as Template;

              console.log(`;
Fetched;
template;
$;
{
    templateId;
}
for (user; $; { userId }. `);
              this.context.loggingService?.logInfo(`)
    Fetched;
template;
$;
{
    templateId;
}
successfully. `, { id: templateId, userId: userId });

              return template;

        } catch (error: any) {
            console.error(`;
Error;
fetching;
template;
$;
{
    templateId;
}
from;
Supabase: `, error);
            this.context.loggingService?.logError(`;
Failed;
to;
fetch;
template;
$;
{
    templateId;
}
`, { id: templateId, userId: userId, error: error.message });
            return undefined;
        }
    }


    /**
     * Updates an existing template for a specific user in Supabase.
     * Only allows updating templates owned by the user.
     * @param templateId The ID of the template to update. Required.
     * @param updates The updates to apply (name, description, type, content, is_public, tags). Required.
     * @param userId The user ID for verification (checks ownership). Required.
     * @returns Promise<Template | undefined> The updated template or undefined if not found or user mismatch.
     */
    async updateTemplate(templateId: string, updates: Partial<Omit<Template, 'id' | 'user_id' | 'created_at' | 'updated_at'>>, userId: string): Promise<Template | undefined> {
        console.log(`;
Updating;
template;
$;
{
    templateId;
}
 in Supabase;
for (user; $; { userId })
    ;
`, updates);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
update;
template;
$;
{
    templateId;
}
`, { id: templateId, updates, userId });

         if (!userId) {
             console.warn('[TemplateService] Cannot update template: User ID is required.');
             this.context.loggingService?.logWarning('Cannot update template: User ID is required.');
             return undefined;
         }

        try {
            // Persist update to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership and that it's not a public template (unless admin)
              const { data, error } = await this.supabase
                  .from('templates')
                  .update(updates)
                  .eq('id', templateId)
                  .eq('user_id', userId) // Ensure ownership (users can only update their own templates)
                  .eq('is_public', false) // Users can only update their *private* templates via this method
                  .select() // Select updated template data
                  .single();

              if (error) throw error;
              if (!data) { // Should not happen if RLS is correct and ID/user_id match
                   console.warn(`;
Template;
$;
{
    templateId;
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
for (update. `);
                   this.context.loggingService?.logWarning(`; Template; not)
    found;
or;
user;
mismatch;
for (update; ; )
    : $;
{
    templateId;
}
`, { userId });
                   return undefined;
              }

              const updatedTemplate = data as Template;

            console.log(`;
Template;
$;
{
    templateId;
}
updated in Supabase. `);
            // Publish an event indicating a template has been updated (part of Six Styles/EventBus)
            this.context.eventBus?.publish('template_updated', updatedTemplate, userId); // Include userId in event
            this.context.loggingService?.logInfo(`;
Template;
updated;
successfully: $;
{
    templateId;
}
`, { id: templateId, userId: userId });

            // TODO: Notify SyncService about local change

            return updatedTemplate;

        } catch (error: any) {
            console.error(`;
Failed;
to;
update;
template;
$;
{
    templateId;
}
`, error);
            this.context.loggingService?.logError(`;
Failed;
to;
update;
template;
$;
{
    templateId;
}
`, { id: templateId, updates, userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Deletes a template for a specific user from Supabase.
     * Only allows deleting templates owned by the user.
     * @param templateId The ID of the template. Required.
     * @param userId The user ID for verification (checks ownership). Required.
     * @returns Promise<boolean> True if deletion was successful, false otherwise.
     */
    async deleteTemplate(templateId: string, userId: string): Promise<boolean> {
        console.log(`;
Deleting;
template;
$;
{
    templateId;
}
from;
Supabase;
for (user; $; { userId })
    ;
`);
        this.context.loggingService?.logInfo(`;
Attempting;
to;
delete template;
$;
{
    templateId;
}
`, { id: templateId, userId });

         if (!templateId || !userId) {
             console.warn('[TemplateService] Cannot delete template: ID and user ID are required.');
             this.context.loggingService?.logWarning('Cannot delete template: ID and user ID are required.');
             return false; // Return false if no ID or user ID
         }

        try {
            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)
            // Filter by ID and user_id to ensure ownership and that it's not a public template (unless admin)
              const { count, error } = await this.supabase
                  .from('templates')
                  .delete()
                  .eq('id', templateId)
                  .eq('user_id', userId) // Ensure ownership (users can only delete their own templates)
                  .eq('is_public', false) // Users can only delete their *private* templates via this method
                  .select('id', { count: 'exact' }); // Select count to check if a row was deleted

              if (error) { throw error; }\
\
              const deleted = count !== null && count > 0; // Check if count is greater than 0\
\
              if (deleted) {\
                  console.log(`;
Template;
$;
{
    templateId;
}
deleted;
from;
Supabase. `);\
                  // Publish an event indicating a template has been deleted (part of Six Styles/EventBus)\
                  this.context.eventBus?.publish('template_deleted', { templateId: templateId, userId: userId }, userId); // Include userId in event\
                  this.context.loggingService?.logInfo(`;
Template;
deleted;
successfully: $;
{
    templateId;
}
`, { id: templateId, userId: userId });\
              } else {\
                  console.warn(`;
Template;
$;
{
    templateId;
}
not;
found;
for (deletion; or; user)
    mismatch(or, is, public). `);\
                  this.context.loggingService?.logWarning(`;
Template;
not;
found;
for (deletion; or; user)
    mismatch: $;
{
    templateId;
}
`, { id: templateId, userId });\
              }\
              return deleted;\
\
        } catch (error: any) {\
            console.error(`;
Failed;
to;
delete template;
$;
{
    templateId;
}
`, error);\
            this.context.loggingService?.logError(`;
Failed;
to;
delete template;
$;
{
    templateId;
}
`, { id: templateId, userId: userId, error: error.message });\
            return false; // Return false on failure\
        }\
    }\
\
    // TODO: Implement methods for importing/exporting templates.\
    // TODO: Implement methods for using templates (e.g., creating a task from a task template).\
    // TODO: This module is part of the Long-term Memory (\u6c38\u4e45\u8a18\u61b6) pillar.\
\
\
    // --- New: Realtime Subscription Methods ---\
    /**\
     * Subscribes to real-time updates from the templates table for the current user (user-owned and public).\
     * @param userId The user ID to filter updates by. Required.\
     */\
    subscribeToTemplatesUpdates(userId: string): void {\
        console.log('[TemplateService] Subscribing to templates realtime updates for user:', userId);\
        this.context.loggingService?.logInfo('Subscribing to templates realtime updates', { userId });\
\
        if (this.templatesSubscription) {\
            console.warn('[TemplateService] Already subscribed to templates updates. Unsubscribing existing.');\
            this.unsubscribeFromTemplatesUpdates();\
        }\
\
        // Subscribe to changes where user_id is null (public) OR user_id is the current user.\
        // RLS should ensure user only receives updates for templates they can see.\
        // We subscribe to all changes on the table and rely on RLS filtering.\
        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.\
        // Let's subscribe to a channel that should include both user and public data based on RLS.\
        // A simple channel name like the table name, relying entirely on RLS, is often used.\
        // Let's switch to subscribing to the table name channel and rely on RLS.\
\
        this.templatesSubscription = this.supabase\
            .channel('templates') // Subscribe to all changes on the table\
            .on('postgres_changes', { event: '*', schema: 'public', table: 'templates' }, async (payload) => { // No filter here, rely on RLS\
                console.log('[TemplateService] Realtime template change received:', payload);\
                const template = (payload.new || payload.old) as Template; // New data for INSERT/UPDATE, old for DELETE\
                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\
\
                // Check if the change is relevant to the current user (user-owned or public)\
                // RLS should handle this, but client-side check adds safety.\
                const relevantTemplate = template || payload.old;\
                const isRelevant = relevantTemplate?.user_id === userId || relevantTemplate?.is_public === true;\
\
                if (isRelevant) {\
                    console.log(`[TemplateService];
Processing;
relevant;
template;
change($, { eventType });
$;
{
    relevantTemplate.id;
}
`);\
\
                    // Publish an event via EventBus for other modules/UI to react\
                    this.context.eventBus?.publish(`;
template_$;
{
    eventType.toLowerCase();
}
`, template || payload.old, userId); // e.g., 'template_insert', 'template_update', 'template_delete'\
\
                    // TODO: Notify SyncService about the remote change\
                }\
            })\
            .subscribe((status, err) => {\
                 console.log('[TemplateService] Template subscription status:', status);\
                 if (status === 'CHANNEL_ERROR') {\
                     console.error('[TemplateService] Template subscription error:', err);\
                     this.context.loggingService?.logError('Template subscription error', { userId, error: err?.message });\
                 }\
            });\
    }\
\
    /**\
     * Unsubscribes from templates real-time updates.\
     */\
    unsubscribeFromTemplatesUpdates(): void {\
        if (this.templatesSubscription) {\
            console.log('[TemplateService] Unsubscribing from templates realtime updates.');\
            this.context.loggingService?.logInfo('Unsubscribing from templates realtime updates');\
            this.supabase.removeChannel(this.templatesSubscription);\
            this.templatesSubscription = null;\
        }\
    }\
    // --- End New ---\
}\
` ``;
