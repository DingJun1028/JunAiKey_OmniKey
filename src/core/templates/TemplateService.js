var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/core/templates/TemplateService.ts\n// \u7BC4\u672C\u670D\u52D9 (Template Service) - \u6838\u5FC3\u6A21\u7D44\n// Manages the creation, retrieval, updating, and deletion of user-defined templates.\n// Part of the Long-term Memory pillar (specifically the Template Library aspect).\n// Design Principle: Provides a structured repository for reusable content and workflows.\n\nimport { SupabaseClient } from '@supabase/supabase-js';\nimport { SystemContext, Template } from '../../interfaces';\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n\nexport class TemplateService {\n    private supabase: SupabaseClient;\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n\n    // --- New: Realtime Subscription ---\n    private templatesSubscription: any | null = null;\n    // --- End New ---\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        console.log('TemplateService initialized.');\n\n        // --- New: Set up Supabase Realtime subscription for templates table ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToTemplatesUpdates(user.id);\n            } else {\n                this.unsubscribeFromTemplatesUpdates();\n            }\n        });\n        // --- End New ---\n    }\n\n    /**\n     * Creates a new template for a specific user or as public in Supabase.\n     * @param templateDetails The details of the template (without id, created_at, updated_at). Required.\n     * @param userId The user ID creating the template. Required.\n     * @returns Promise<Template | null> The created template or null on failure.\n     *\n     * Privacy Note: Templates are stored with a user_id and are subject to Row Level Security (RLS)\n     * policies in Supabase, ensuring users can only access their own private templates and all public templates.\n     */\n    async createTemplate(templateDetails: Omit<Template, 'id' | 'created_at' | 'updated_at'>, userId: string): Promise<Template | null> {\n        console.log('Creating template in Supabase:', templateDetails.name, 'for user:', userId);\n        this.context.loggingService?.logInfo('Attempting to create template', { name: templateDetails.name, userId });\n\n        if (!userId || !templateDetails.name || !templateDetails.type || templateDetails.content === undefined) {\n            console.error('[TemplateService] Cannot create template: User ID, name, type, and content are required.');\n            this.context.loggingService?.logError('Cannot create template: Missing required fields.', { details: templateDetails, userId });\n            throw new Error('User ID, name, type, and content are required to create a template.');\n        }\n\n        const newTemplateData: Omit<Template, 'id' | 'created_at' | 'updated_at'> = {\n            ...templateDetails,\n            user_id: userId, // Associate with user\n            is_public: templateDetails.is_public || false, // Default to false if not provided\n            tags: templateDetails.tags || [], // Ensure tags is an array\n            // created_at and updated_at are set by the database default/trigger\n        };\n\n        try {\n            // Insert into Supabase (Supports Bidirectional Sync Domain)\n            const { data, error } = await this.supabase\n                .from('templates')\n                .insert([newTemplateData])\n                .select() // Select the inserted data to get the generated ID and timestamps\n                .single(); // Expecting a single record back\n\n            if (error) {\n                console.error('Error creating template in Supabase:', error);\n                this.context.loggingService?.logError('Failed to create template', { name: templateDetails.name, userId: userId, error: error.message });\n                throw error; // Re-throw the error\n            }\n\n            const createdTemplate = data as Template;\n            console.log('Template created:', createdTemplate.id, '-', createdTemplate.name, 'for user:', createdTemplate.user_id, 'public:', createdTemplate.is_public);\n\n            // Publish a 'template_created' event (part of Six Styles/EventBus - call context.eventBus.publish)\n            this.context.eventBus?.publish('template_created', createdTemplate, userId); // Include userId in event\n\n            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly\n            // this.context.syncService?.handleLocalDataChange('templateService', 'INSERT', createdTemplate, userId)\n            //     .catch(syncError => console.error('Error notifying SyncService for Template insert:', syncError));\n\n            return createdTemplate;\n\n        } catch (error: any) {\n            console.error('Failed to create template:', error);\n            this.context.loggingService?.logError('Failed to create template', { name: templateDetails.name, userId: userId, error: error.message });\n            return null; // Return null on failure\n        }\n    }\n\n    /**\n     * Retrieves templates for a specific user (their private templates and all public templates) from Supabase.\n     * Can filter by type or tags.\n     * @param userId The user ID. Required to filter private templates.\n     * @param typeFilter Optional: Filter by template type.\n     * @param tagsFilter Optional: Filter by tags (match any in array).\n     * @returns Promise<Template[]> An array of Template objects.\n     */\n    async getTemplates(userId: string, typeFilter?: Template['type'], tagsFilter?: string[]): Promise<Template[]> {\n        console.log("], ["typescript\n// src/core/templates/TemplateService.ts\n// \u7BC4\u672C\u670D\u52D9 (Template Service) - \u6838\u5FC3\u6A21\u7D44\n// Manages the creation, retrieval, updating, and deletion of user-defined templates.\n// Part of the Long-term Memory pillar (specifically the Template Library aspect).\n// Design Principle: Provides a structured repository for reusable content and workflows.\n\nimport { SupabaseClient } from '@supabase/supabase-js';\nimport { SystemContext, Template } from '../../interfaces';\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n\nexport class TemplateService {\n    private supabase: SupabaseClient;\n    private context: SystemContext;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n\n    // --- New: Realtime Subscription ---\n    private templatesSubscription: any | null = null;\n    // --- End New ---\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        console.log('TemplateService initialized.');\n\n        // --- New: Set up Supabase Realtime subscription for templates table ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToTemplatesUpdates(user.id);\n            } else {\n                this.unsubscribeFromTemplatesUpdates();\n            }\n        });\n        // --- End New ---\n    }\n\n    /**\n     * Creates a new template for a specific user or as public in Supabase.\n     * @param templateDetails The details of the template (without id, created_at, updated_at). Required.\n     * @param userId The user ID creating the template. Required.\n     * @returns Promise<Template | null> The created template or null on failure.\n     *\n     * Privacy Note: Templates are stored with a user_id and are subject to Row Level Security (RLS)\n     * policies in Supabase, ensuring users can only access their own private templates and all public templates.\n     */\n    async createTemplate(templateDetails: Omit<Template, 'id' | 'created_at' | 'updated_at'>, userId: string): Promise<Template | null> {\n        console.log('Creating template in Supabase:', templateDetails.name, 'for user:', userId);\n        this.context.loggingService?.logInfo('Attempting to create template', { name: templateDetails.name, userId });\n\n        if (!userId || !templateDetails.name || !templateDetails.type || templateDetails.content === undefined) {\n            console.error('[TemplateService] Cannot create template: User ID, name, type, and content are required.');\n            this.context.loggingService?.logError('Cannot create template: Missing required fields.', { details: templateDetails, userId });\n            throw new Error('User ID, name, type, and content are required to create a template.');\n        }\n\n        const newTemplateData: Omit<Template, 'id' | 'created_at' | 'updated_at'> = {\n            ...templateDetails,\n            user_id: userId, // Associate with user\n            is_public: templateDetails.is_public || false, // Default to false if not provided\n            tags: templateDetails.tags || [], // Ensure tags is an array\n            // created_at and updated_at are set by the database default/trigger\n        };\n\n        try {\n            // Insert into Supabase (Supports Bidirectional Sync Domain)\n            const { data, error } = await this.supabase\n                .from('templates')\n                .insert([newTemplateData])\n                .select() // Select the inserted data to get the generated ID and timestamps\n                .single(); // Expecting a single record back\n\n            if (error) {\n                console.error('Error creating template in Supabase:', error);\n                this.context.loggingService?.logError('Failed to create template', { name: templateDetails.name, userId: userId, error: error.message });\n                throw error; // Re-throw the error\n            }\n\n            const createdTemplate = data as Template;\n            console.log('Template created:', createdTemplate.id, '-', createdTemplate.name, 'for user:', createdTemplate.user_id, 'public:', createdTemplate.is_public);\n\n            // Publish a 'template_created' event (part of Six Styles/EventBus - call context.eventBus.publish)\n            this.context.eventBus?.publish('template_created', createdTemplate, userId); // Include userId in event\n\n            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly\n            // this.context.syncService?.handleLocalDataChange('templateService', 'INSERT', createdTemplate, userId)\n            //     .catch(syncError => console.error('Error notifying SyncService for Template insert:', syncError));\n\n            return createdTemplate;\n\n        } catch (error: any) {\n            console.error('Failed to create template:', error);\n            this.context.loggingService?.logError('Failed to create template', { name: templateDetails.name, userId: userId, error: error.message });\n            return null; // Return null on failure\n        }\n    }\n\n    /**\n     * Retrieves templates for a specific user (their private templates and all public templates) from Supabase.\n     * Can filter by type or tags.\n     * @param userId The user ID. Required to filter private templates.\n     * @param typeFilter Optional: Filter by template type.\n     * @param tagsFilter Optional: Filter by tags (match any in array).\n     * @returns Promise<Template[]> An array of Template objects.\n     */\n    async getTemplates(userId: string, typeFilter?: Template['type'], tagsFilter?: string[]): Promise<Template[]> {\n        console.log("]))[TemplateService];
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
");\n        this.context.loggingService?.logInfo('Attempting to fetch templates', { userId, typeFilter, tagsFilter });\n\n        if (!userId) {\n            console.warn('[TemplateService] Cannot retrieve templates: User ID is required.');\n            this.context.loggingService?.logWarning('Cannot retrieve templates: User ID is required.');\n            return []; // Return empty if no user ID\n        }\n        try {\n            // Fetch templates from Supabase, filtered by user_id OR is_public\n            let dbQuery = this.supabase\n                .from('templates')\n                .select('*') // Select all columns\n                .or(";
user_id.eq.$;
{
    userId;
}
is_public.eq.true(__makeTemplateObject(["); // Fetch user's own templates OR public templates\n\n            if (typeFilter) {\n                dbQuery = dbQuery.eq('type', typeFilter);\n            }\n\n            if (tagsFilter && tagsFilter.length > 0) {\n                // Filter by tags (match any in the provided array)\n                dbQuery = dbQuery.overlaps('tags', tagsFilter);\n            }\n\n            dbQuery = dbQuery.order('name', { ascending: true } as any); // Order by name alphabetically\n\n            const { data, error } = await dbQuery;\n\n            if (error) { throw error; }\n\n            const templates = data as Template[];\n            console.log("], ["); // Fetch user's own templates OR public templates\n\n            if (typeFilter) {\n                dbQuery = dbQuery.eq('type', typeFilter);\n            }\n\n            if (tagsFilter && tagsFilter.length > 0) {\n                // Filter by tags (match any in the provided array)\n                dbQuery = dbQuery.overlaps('tags', tagsFilter);\n            }\n\n            dbQuery = dbQuery.order('name', { ascending: true } as any); // Order by name alphabetically\n\n            const { data, error } = await dbQuery;\n\n            if (error) { throw error; }\n\n            const templates = data as Template[];\n            console.log("]));
Fetched;
$;
{
    templates.length;
}
templates;
for (user; $; { userId: userId }.(__makeTemplateObject([");\n            this.context.loggingService?.logInfo("], [");\n            this.context.loggingService?.logInfo("])))
    Fetched;
$;
{
    templates.length;
}
templates;
successfully.(__makeTemplateObject([", { userId });\n\n            return templates;\n\n        } catch (error: any) {\n            console.error('Error fetching templates from Supabase:', error);\n            this.context.loggingService?.logError('Failed to fetch templates', { userId: userId, error: error.message });\n            return [];\n        }\n    }\n\n    /**\n     * Retrieves a specific template by ID for a specific user from Supabase.\n     * Checks if the template is public or owned by the user.\n     * @param templateId The ID of the template. Required.\n     * @param userId The user ID for verification. Required.\n     * @returns Promise<Template | undefined> The Template object or undefined.\n     */\n    async getTemplateById(templateId: string, userId: string): Promise<Template | undefined> {\n        console.log('Retrieving template by ID from Supabase:', templateId, 'for user:', userId);\n        this.context.loggingService?.logInfo("], [", { userId });\n\n            return templates;\n\n        } catch (error: any) {\n            console.error('Error fetching templates from Supabase:', error);\n            this.context.loggingService?.logError('Failed to fetch templates', { userId: userId, error: error.message });\n            return [];\n        }\n    }\n\n    /**\n     * Retrieves a specific template by ID for a specific user from Supabase.\n     * Checks if the template is public or owned by the user.\n     * @param templateId The ID of the template. Required.\n     * @param userId The user ID for verification. Required.\n     * @returns Promise<Template | undefined> The Template object or undefined.\n     */\n    async getTemplateById(templateId: string, userId: string): Promise<Template | undefined> {\n        console.log('Retrieving template by ID from Supabase:', templateId, 'for user:', userId);\n        this.context.loggingService?.logInfo("]));
Attempting;
to;
fetch;
template;
$;
{
    templateId;
}
", { id: templateId, userId });\n\n         if (!userId) {\n             console.warn('[TemplateService] Cannot retrieve template: User ID is required.');\n             this.context.loggingService?.logWarning('Cannot retrieve template: User ID is required.');\n             return undefined;\n         }\n        try {\n            // Fetch template from Supabase by ID and check if it's public OR owned by the user\n              const { data, error } = await this.supabase\n                  .from('templates')\n                  .select('*')\n                  .eq('id', templateId)\n                  .or(";
user_id.eq.$;
{
    userId;
}
is_public.eq.true(__makeTemplateObject([") // Ensure ownership OR public status\n                  .single();\n\n              if (error) { throw error; }\n              if (!data) { return undefined; } // Template not found or doesn't belong to user/is not public\n\n              const template = data as Template;\n\n              console.log("], [") // Ensure ownership OR public status\n                  .single();\n\n              if (error) { throw error; }\n              if (!data) { return undefined; } // Template not found or doesn't belong to user/is not public\n\n              const template = data as Template;\n\n              console.log("]));
Fetched;
template;
$;
{
    templateId;
}
for (user; $; { userId: userId }.(__makeTemplateObject([");\n              this.context.loggingService?.logInfo("], [");\n              this.context.loggingService?.logInfo("])))
    Fetched;
template;
$;
{
    templateId;
}
successfully.(__makeTemplateObject([", { id: templateId, userId: userId });\n\n              return template;\n\n        } catch (error: any) {\n            console.error("], [", { id: templateId, userId: userId });\n\n              return template;\n\n        } catch (error: any) {\n            console.error("]));
Error;
fetching;
template;
$;
{
    templateId;
}
from;
Supabase: ", error);\n            this.context.loggingService?.logError(";
Failed;
to;
fetch;
template;
$;
{
    templateId;
}
", { id: templateId, userId: userId, error: error.message });\n            return undefined;\n        }\n    }\n\n\n    /**\n     * Updates an existing template for a specific user in Supabase.\n     * Only allows updating templates owned by the user.\n     * @param templateId The ID of the template to update. Required.\n     * @param updates The updates to apply (name, description, type, content, is_public, tags). Required.\n     * @param userId The user ID for verification (checks ownership). Required.\n     * @returns Promise<Template | undefined> The updated template or undefined if not found or user mismatch.\n     */\n    async updateTemplate(templateId: string, updates: Partial<Omit<Template, 'id' | 'user_id' | 'created_at' | 'updated_at'>>, userId: string): Promise<Template | undefined> {\n        console.log(";
Updating;
template;
$;
{
    templateId;
}
 in Supabase;
for (user; $; { userId: userId })
    ;
", updates);\n        this.context.loggingService?.logInfo(";
Attempting;
to;
update;
template;
$;
{
    templateId;
}
", { id: templateId, updates, userId });\n\n         if (!userId) {\n             console.warn('[TemplateService] Cannot update template: User ID is required.');\n             this.context.loggingService?.logWarning('Cannot update template: User ID is required.');\n             return undefined;\n         }\n\n        try {\n            // Persist update to Supabase (Supports Bidirectional Sync Domain)\n            // Filter by ID and user_id to ensure ownership and that it's not a public template (unless admin)\n              const { data, error } = await this.supabase\n                  .from('templates')\n                  .update(updates)\n                  .eq('id', templateId)\n                  .eq('user_id', userId) // Ensure ownership (users can only update their own templates)\n                  .eq('is_public', false) // Users can only update their *private* templates via this method\n                  .select() // Select updated template data\n                  .single();\n\n              if (error) throw error;\n              if (!data) { // Should not happen if RLS is correct and ID/user_id match\n                   console.warn(";
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
for (update.(__makeTemplateObject([");\n                   this.context.loggingService?.logWarning("], [");\n                   this.context.loggingService?.logWarning("])); Template; not)
    found;
or;
user;
mismatch;
for (update; ; )
    : $;
{
    templateId;
}
", { userId });\n                   return undefined;\n              }\n\n              const updatedTemplate = data as Template;\n\n            console.log(";
Template;
$;
{
    templateId;
}
updated in Supabase.(__makeTemplateObject([");\n            // Publish an event indicating a template has been updated (part of Six Styles/EventBus)\n            this.context.eventBus?.publish('template_updated', updatedTemplate, userId); // Include userId in event\n            this.context.loggingService?.logInfo("], [");\n            // Publish an event indicating a template has been updated (part of Six Styles/EventBus)\n            this.context.eventBus?.publish('template_updated', updatedTemplate, userId); // Include userId in event\n            this.context.loggingService?.logInfo("]));
Template;
updated;
successfully: $;
{
    templateId;
}
", { id: templateId, userId: userId });\n\n            // TODO: Notify SyncService about local change\n\n            return updatedTemplate;\n\n        } catch (error: any) {\n            console.error(";
Failed;
to;
update;
template;
$;
{
    templateId;
}
", error);\n            this.context.loggingService?.logError(";
Failed;
to;
update;
template;
$;
{
    templateId;
}
", { id: templateId, updates, userId: userId, error: error.message });\n            throw error; // Re-throw the error\n        }\n    }\n\n    /**\n     * Deletes a template for a specific user from Supabase.\n     * Only allows deleting templates owned by the user.\n     * @param templateId The ID of the template. Required.\n     * @param userId The user ID for verification (checks ownership). Required.\n     * @returns Promise<boolean> True if deletion was successful, false otherwise.\n     */\n    async deleteTemplate(templateId: string, userId: string): Promise<boolean> {\n        console.log(";
Deleting;
template;
$;
{
    templateId;
}
from;
Supabase;
for (user; $; { userId: userId })
    ;
");\n        this.context.loggingService?.logInfo(";
Attempting;
to;
delete template;
$;
{
    templateId;
}
", { id: templateId, userId });\n\n         if (!templateId || !userId) {\n             console.warn('[TemplateService] Cannot delete template: ID and user ID are required.');\n             this.context.loggingService?.logWarning('Cannot delete template: ID and user ID are required.');\n             return false; // Return false if no ID or user ID\n         }\n\n        try {\n            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)\n            // Filter by ID and user_id to ensure ownership and that it's not a public template (unless admin)\n              const { count, error } = await this.supabase\n                  .from('templates')\n                  .delete()\n                  .eq('id', templateId)\n                  .eq('user_id', userId) // Ensure ownership (users can only delete their own templates)\n                  .eq('is_public', false) // Users can only delete their *private* templates via this method\n                  .select('id', { count: 'exact' }); // Select count to check if a row was deleted\n\n              if (error) { throw error; }              const deleted = count !== null && count > 0; // Check if count is greater than 0              if (deleted) {                  console.log(";
Template;
$;
{
    templateId;
}
deleted;
from;
Supabase.(__makeTemplateObject([");                  // Publish an event indicating a template has been deleted (part of Six Styles/EventBus)                  this.context.eventBus?.publish('template_deleted', { templateId: templateId, userId: userId }, userId); // Include userId in event                  this.context.loggingService?.logInfo("], [");\\\n                  // Publish an event indicating a template has been deleted (part of Six Styles/EventBus)\\\n                  this.context.eventBus?.publish('template_deleted', { templateId: templateId, userId: userId }, userId); // Include userId in event\\\n                  this.context.loggingService?.logInfo("]));
Template;
deleted;
successfully: $;
{
    templateId;
}
", { id: templateId, userId: userId });              } else {                  console.warn(";
Template;
$;
{
    templateId;
}
not;
found;
for (deletion; or; user)
    mismatch(or, is, public).(__makeTemplateObject([");                  this.context.loggingService?.logWarning("], [");\\\n                  this.context.loggingService?.logWarning("]));
Template;
not;
found;
for (deletion; or; user)
    mismatch: $;
{
    templateId;
}
", { id: templateId, userId });              }              return deleted;        } catch (error: any) {            console.error(";
Failed;
to;
delete template;
$;
{
    templateId;
}
", error);            this.context.loggingService?.logError(";
Failed;
to;
delete template;
$;
{
    templateId;
}
", { id: templateId, userId: userId, error: error.message });            return false; // Return false on failure        }    }    // TODO: Implement methods for importing/exporting templates.    // TODO: Implement methods for using templates (e.g., creating a task from a task template).    // TODO: This module is part of the Long-term Memory (\u6C38\u4E45\u8A18\u61B6) pillar.    // --- New: Realtime Subscription Methods ---    /**     * Subscribes to real-time updates from the templates table for the current user (user-owned and public).     * @param userId The user ID to filter updates by. Required.     */    subscribeToTemplatesUpdates(userId: string): void {        console.log('[TemplateService] Subscribing to templates realtime updates for user:', userId);        this.context.loggingService?.logInfo('Subscribing to templates realtime updates', { userId });        if (this.templatesSubscription) {            console.warn('[TemplateService] Already subscribed to templates updates. Unsubscribing existing.');            this.unsubscribeFromTemplatesUpdates();        }        // Subscribe to changes where user_id is null (public) OR user_id is the current user.        // RLS should ensure user only receives updates for templates they can see.        // We subscribe to all changes on the table and rely on RLS filtering.        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.        // Let's subscribe to a channel that should include both user and public data based on RLS.        // A simple channel name like the table name, relying entirely on RLS, is often used.        // Let's switch to subscribing to the table name channel and rely on RLS.        this.templatesSubscription = this.supabase            .channel('templates') // Subscribe to all changes on the table            .on('postgres_changes', { event: '*', schema: 'public', table: 'templates' }, async (payload) => { // No filter here, rely on RLS                console.log('[TemplateService] Realtime template change received:', payload);                const template = (payload.new || payload.old) as Template; // New data for INSERT/UPDATE, old for DELETE                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';                // Check if the change is relevant to the current user (user-owned or public)                // RLS should handle this, but client-side check adds safety.                const relevantTemplate = template || payload.old;                const isRelevant = relevantTemplate?.user_id === userId || relevantTemplate?.is_public === true;                if (isRelevant) {                    console.log("[TemplateService];
Processing;
relevant;
template;
change($, { eventType: eventType });
$;
{
    relevantTemplate.id;
}
");                    // Publish an event via EventBus for other modules/UI to react                    this.context.eventBus?.publish(";
template_$;
{
    eventType.toLowerCase();
}
", template || payload.old, userId); // e.g., 'template_insert', 'template_update', 'template_delete'                    // TODO: Notify SyncService about the remote change                }            })            .subscribe((status, err) => {                 console.log('[TemplateService] Template subscription status:', status);                 if (status === 'CHANNEL_ERROR') {                     console.error('[TemplateService] Template subscription error:', err);                     this.context.loggingService?.logError('Template subscription error', { userId, error: err?.message });                 }            });    }    /**     * Unsubscribes from templates real-time updates.     */    unsubscribeFromTemplatesUpdates(): void {        if (this.templatesSubscription) {            console.log('[TemplateService] Unsubscribing from templates realtime updates.');            this.context.loggingService?.logInfo('Unsubscribing from templates realtime updates');            this.supabase.removeChannel(this.templatesSubscription);            this.templatesSubscription = null;        }    }    // --- End New ---}"(__makeTemplateObject([""], [""]));
