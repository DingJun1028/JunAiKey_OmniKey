var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/core/authority/AuthorityForgingEngine.ts\n// \u6B0A\u80FD\u935B\u9020\u5F15\u64CE (Authority Forging Engine) - \u6838\u5FC3\u6A20\u7D44\n// Manages the recording of user actions and the forging (creation) and management of automated abilities.\n// Corresponds to the Authority Forging pillar and the \"Observe\", \"Generate\" steps in Six Styles.\n// Design Principle: Translates user behavior and insights into executable automation.// Part of the Bidirectional Sync Domain (\u96D9\u5410\u540C\u6B65\u9818\u57DF).// In the Agent Architecture, this module acts as a service used by the Authority Forging Agent (if one exists) or other agents/services directly.// --- Modified: Add searchUserActions method --// --- Modified: Add forgeAbilityFromActions method --// --- Modified: Add language parameter to relevant methods ---// --- Modified: Ensure forgeAbilityFromActions correctly uses WisdomSecretArt output ---// --- New: Implement Ability Capacity Check ---// --- New: Implement findMatchingAbilities method for event triggers ---// --- Modified: Implement executeAbility to call ScriptSandbox.execute ---import { SupabaseClient } from '@supabase/supabase-js';import { SystemContext, UserAction, ForgedAbility, AbilityTrigger } from '../../interfaces'; // Import UserAction, ForgedAbility, AbilityTrigger// import { LoggingService } from '../logging/LoggingService'; // Access via context// import { EventBus } from '../../modules/events/EventBus'; // Dependency// import { SecurityService } from '../security/SecurityService'; // Access via context for user/auth/permissions// import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // Access via context for generating insights/suggestions// import { ScriptSandbox } from '../core/execution/ScriptSandbox'; // Access via contextexport class AuthorityForgingEngine {    private context: SystemContext;    private supabase: SupabaseClient;    // private loggingService: LoggingService; // Access via context    // private eventBus: EventBus; // Access via context    // private securityService: SecurityService; // Access via context    // private wisdomSecretArt: WisdomSecretArt; // Access via context    // private scriptSandbox: ScriptSandbox; // Access via context    // --- New: Realtime Subscriptions ---    private userActionsSubscription: any | null = null;    private abilitiesSubscription: any | null = null;    // --- End New ---    constructor(context: SystemContext) {        this.context = context;        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy        // this.loggingService = context.loggingService;        // this.eventBus = context.eventBus;        // this.securityService = context.securityService;        // this.wisdomSecretArt = context.wisdomSecretArt;        // this.scriptSandbox = context.scriptSandbox; // Access via context        console.log('AuthorityForgingEngine initialized.');        // TODO: Load initial abilities from persistence on startup (Supports Bidirectional Sync Domain)        // This might involve fetching all abilities for the current user on auth state change.        // --- REMOVE: Initialize with some simulated flows for demo (now using DB) ---        // this.initializeSimulatedFlows();        // --- END REMOVE ---        // --- New: Set up Supabase Realtime subscriptions ---        // Subscribe when the user is authenticated.        this.context.securityService?.onAuthStateChange((user) => {            if (user) {                this.subscribeToUserActionsUpdates(user.id);                this.subscribeToAbilitiesUpdates(user.id);            } else {                this.unsubscribeFromUserActionsUpdates();                this.unsubscribeFromAbilitiesUpdates();            }        });        // --- End New ---    }    /**     * Records a user action in Supabase.\\     * This is a core part of the \"Observe\" step in the Six Styles (\u89C0\u5BDF\u5F0F).\\     * @param actionDetails The details of the user action (without id, timestamp). Required.\\     * @param language Optional: Language of the action details/context description. Defaults to user preference or system default.\\     * @returns Promise<UserAction | null> The created UserAction or null on failure.\\     * Part of the Bidirectional Sync Domain (\u96D9\u5410\u540C\u6B65\u9818\u57DF).\\     * Privacy Note: User Actions are stored with a user_id and are subject to Row Level Security (RLS)\\\n     * policies in Supabase, ensuring users can only access their own data.\\\n     */\\\n    async recordAction(actionDetails: Omit<UserAction, 'id' | 'timestamp'>, language?: string): Promise<UserAction | null> {\\\n        console.log('[AuthorityForgingEngine] Recording user action:', actionDetails.type, 'for user:', actionDetails.user_id);\\\n        this.context.loggingService?.logInfo('Attempting to record user action', { userId: actionDetails.user_id, type: actionDetails.type, context: actionDetails.context, language });\\\n\\\n        if (!actionDetails.user_id || !actionDetails.type) {\\\n            console.error('[AuthorityForgingEngine] Cannot record action: User ID and type are required.');\\\n            this.context.loggingService?.logError('Cannot record user action: Missing required fields.', { details: actionDetails });\\\n            throw new Error('User ID and type are required to record an action.');\\\n        }\\\n\\\n        const contentLanguage = language || this.context.currentUser?.language_preference || 'en'; // Default to English if no preference\\\n\\\n        const newActionData: Omit<UserAction, 'id' | 'timestamp'> = {\\\n            ...actionDetails,\\\n            language: contentLanguage, // Store the language\\\n            // timestamp is set by the database default\\\n        };\\\n\\\n        try {\\\n            // Insert into Supabase (Supports Bidirectional Sync Domain)\\\n            const { data, error } = await this.supabase\\\n                .from('user_actions')\\\n                .insert([newActionData])\\\n                .select() // Select the inserted data to get the generated ID and timestamp\\\n                .single(); // Expecting a single record back\\\n\\\n            if (error) {\\                console.error('Error recording user action to Supabase:', error);\\\n                this.context.loggingService?.logError('Failed to record user action', { userId: actionDetails.user_id, error: error.message });\\                throw error; // Re-throw the error\\\n            }\\\n\\\n            const createdAction = data as UserAction;\\\n            console.log('User action recorded:', createdAction.id, '-', createdAction.type, 'for user:', createdAction.user_id, 'Language:', createdAction.language);\\\n\\\n            // Publish a 'user_action_recorded' event via EventBus (Supports Event Push - call context.eventBus.publish)\\\n            // The Realtime subscription will also publish events, so be careful not to duplicate processing.\\\n            // For now, let's rely on the Realtime subscription to be the source of events for UI updates.\\\n            this.context.eventBus?.publish('user_action_recorded', createdAction, createdAction.user_id); // Include userId in event\\\n\\\n            // --- New: Notify SyncService about local change ---\\\n            // This is handled by the Realtime subscription now, which SyncService can listen to.\\\n            // If Realtime is not used for sync, this manual notification is needed.\\\n            // For MVP, let's assume SyncService listens to Realtime.\\\n            // this.context.syncService?.handleLocalDataChange('authorityForgingEngine', 'INSERT', createdAction, createdAction.user_id)\\\n            //     .catch(syncError => console.error('Error notifying SyncService for UserAction insert:', syncError));\\\n            // --- End New ---\\\n\\\n\\\n            return createdAction;\\\n\\\n        } catch (error: any) {\\            console.error('Failed to record user action:', error);\\            this.context.loggingService?.logError('Failed to record user action', { userId: actionDetails.user_id, error: error.message });\\            return null; // Return null on failure\\\n        }\\\n    }\\\n\\\n    /**\\\n     * Retrieves recent user actions for a specific user from Supabase.\\\n     * @param userId The user ID. Required.\\\n     * @param limit The maximum number of recent actions to retrieve. Optional, defaults to 100.\\\n     * @param language Optional: Filter results by language. Defaults to undefined (all languages).\\\n     * @returns Promise<UserAction[]> An array of recent UserAction objects.\\\n     */\\\n    async getRecentActions(userId: string, limit: number = 100, language?: string): Promise<UserAction[]> {\\\n        console.log('Retrieving recent user actions from Supabase for user:', userId, 'limit:', limit, 'Language:', language || 'all');\\\n        this.context.loggingService?.logInfo('Attempting to fetch recent user actions', { userId, limit, language });\\\\\n        if (!userId) {\\\n            console.warn('[AuthorityForgingEngine] Cannot retrieve actions: User ID is required.');\\\n            this.context.loggingService?.logWarning('Cannot retrieve user actions: User ID is required.');\\            return []; // Return empty if no user ID\\\n        }\\\n        try {\\\n            // Fetch actions from Supabase, filtered by user_id\\\n            let query = this.supabase\\\n                .from('user_actions')\\\n                .select('*')\\\n                .eq('user_id', userId);\\\\\n            // --- New: Add language filter ---\\\n            if (language) {\\                query = query.eq('language', language);\\            }\\\n            // --- End New ---\\\n\\\n            query = query.order('timestamp', { ascending: false } as any) // Order by newest first\\\n                .limit(limit);\\\\\n            const { data, error } = await query;\\\\\n            if (error) throw error;\\\\\n            const actions = data as UserAction[];\\\n            console.log("], ["typescript\n// src/core/authority/AuthorityForgingEngine.ts\n// \\u6b0a\\u80fd\\u935b\\u9020\\u5f15\\u64ce (Authority Forging Engine) - \\u6838\\u5fc3\\u6a20\\u7d44\n// Manages the recording of user actions and the forging (creation) and management of automated abilities.\n// Corresponds to the Authority Forging pillar and the \\\"Observe\\\", \\\"Generate\\\" steps in Six Styles.\n// Design Principle: Translates user behavior and insights into executable automation.\\\n// Part of the Bidirectional Sync Domain (\\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df).\\\n// In the Agent Architecture, this module acts as a service used by the Authority Forging Agent (if one exists) or other agents/services directly.\\\n// --- Modified: Add searchUserActions method --\\\n// --- Modified: Add forgeAbilityFromActions method --\\\n// --- Modified: Add language parameter to relevant methods ---\\\n// --- Modified: Ensure forgeAbilityFromActions correctly uses WisdomSecretArt output ---\\\n// --- New: Implement Ability Capacity Check ---\\\n// --- New: Implement findMatchingAbilities method for event triggers ---\\\n// --- Modified: Implement executeAbility to call ScriptSandbox.execute ---\\\n\\\n\\\nimport { SupabaseClient } from '@supabase/supabase-js';\\\nimport { SystemContext, UserAction, ForgedAbility, AbilityTrigger } from '../../interfaces'; // Import UserAction, ForgedAbility, AbilityTrigger\\\n// import { LoggingService } from '../logging/LoggingService'; // Access via context\\\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\\\n// import { SecurityService } from '../security/SecurityService'; // Access via context for user/auth/permissions\\\n// import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // Access via context for generating insights/suggestions\\\n// import { ScriptSandbox } from '../core/execution/ScriptSandbox'; // Access via context\\\n\\\n\\\nexport class AuthorityForgingEngine {\\\n    private context: SystemContext;\\\n    private supabase: SupabaseClient;\\\n    // private loggingService: LoggingService; // Access via context\\\n    // private eventBus: EventBus; // Access via context\\\n    // private securityService: SecurityService; // Access via context\\\n    // private wisdomSecretArt: WisdomSecretArt; // Access via context\\\n    // private scriptSandbox: ScriptSandbox; // Access via context\\\n\\\n    // --- New: Realtime Subscriptions ---\\\n    private userActionsSubscription: any | null = null;\\\n    private abilitiesSubscription: any | null = null;\\\n    // --- End New ---\\\n\\\n\\\n    constructor(context: SystemContext) {\\\n        this.context = context;\\\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\\\n        // this.loggingService = context.loggingService;\\\n        // this.eventBus = context.eventBus;\\\n        // this.securityService = context.securityService;\\\n        // this.wisdomSecretArt = context.wisdomSecretArt;\\\n        // this.scriptSandbox = context.scriptSandbox; // Access via context\\\n        console.log('AuthorityForgingEngine initialized.');\\\n\\\n        // TODO: Load initial abilities from persistence on startup (Supports Bidirectional Sync Domain)\\\n        // This might involve fetching all abilities for the current user on auth state change.\\\n\\\n        // --- REMOVE: Initialize with some simulated flows for demo (now using DB) ---\\\n        // this.initializeSimulatedFlows();\\\n        // --- END REMOVE ---\\\n\\\n        // --- New: Set up Supabase Realtime subscriptions ---\\\n        // Subscribe when the user is authenticated.\\\n        this.context.securityService?.onAuthStateChange((user) => {\\\n            if (user) {\\\n                this.subscribeToUserActionsUpdates(user.id);\\\n                this.subscribeToAbilitiesUpdates(user.id);\\\n            } else {\\\n                this.unsubscribeFromUserActionsUpdates();\\\n                this.unsubscribeFromAbilitiesUpdates();\\\n            }\\\n        });\\\n        // --- End New ---\\\n    }\\\n\\\n    /**\\\n     * Records a user action in Supabase.\\\\\\\n     * This is a core part of the \\\"Observe\\\" step in the Six Styles (\\u89c0\\u5bdf\\u5f0f).\\\\\\\n     * @param actionDetails The details of the user action (without id, timestamp). Required.\\\\\\\n     * @param language Optional: Language of the action details/context description. Defaults to user preference or system default.\\\\\\\n     * @returns Promise<UserAction | null> The created UserAction or null on failure.\\\\\\\n     * Part of the Bidirectional Sync Domain (\\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df).\\\\\\\n     * Privacy Note: User Actions are stored with a user_id and are subject to Row Level Security (RLS)\\\\\\n     * policies in Supabase, ensuring users can only access their own data.\\\\\\n     */\\\\\\n    async recordAction(actionDetails: Omit<UserAction, 'id' | 'timestamp'>, language?: string): Promise<UserAction | null> {\\\\\\n        console.log('[AuthorityForgingEngine] Recording user action:', actionDetails.type, 'for user:', actionDetails.user_id);\\\\\\n        this.context.loggingService?.logInfo('Attempting to record user action', { userId: actionDetails.user_id, type: actionDetails.type, context: actionDetails.context, language });\\\\\\n\\\\\\n        if (!actionDetails.user_id || !actionDetails.type) {\\\\\\n            console.error('[AuthorityForgingEngine] Cannot record action: User ID and type are required.');\\\\\\n            this.context.loggingService?.logError('Cannot record user action: Missing required fields.', { details: actionDetails });\\\\\\n            throw new Error('User ID and type are required to record an action.');\\\\\\n        }\\\\\\n\\\\\\n        const contentLanguage = language || this.context.currentUser?.language_preference || 'en'; // Default to English if no preference\\\\\\n\\\\\\n        const newActionData: Omit<UserAction, 'id' | 'timestamp'> = {\\\\\\n            ...actionDetails,\\\\\\n            language: contentLanguage, // Store the language\\\\\\n            // timestamp is set by the database default\\\\\\n        };\\\\\\n\\\\\\n        try {\\\\\\n            // Insert into Supabase (Supports Bidirectional Sync Domain)\\\\\\n            const { data, error } = await this.supabase\\\\\\n                .from('user_actions')\\\\\\n                .insert([newActionData])\\\\\\n                .select() // Select the inserted data to get the generated ID and timestamp\\\\\\n                .single(); // Expecting a single record back\\\\\\n\\\\\\n            if (error) {\\\\\\\n                console.error('Error recording user action to Supabase:', error);\\\\\\n                this.context.loggingService?.logError('Failed to record user action', { userId: actionDetails.user_id, error: error.message });\\\\\\\n                throw error; // Re-throw the error\\\\\\n            }\\\\\\n\\\\\\n            const createdAction = data as UserAction;\\\\\\n            console.log('User action recorded:', createdAction.id, '-', createdAction.type, 'for user:', createdAction.user_id, 'Language:', createdAction.language);\\\\\\n\\\\\\n            // Publish a 'user_action_recorded' event via EventBus (Supports Event Push - call context.eventBus.publish)\\\\\\n            // The Realtime subscription will also publish events, so be careful not to duplicate processing.\\\\\\n            // For now, let's rely on the Realtime subscription to be the source of events for UI updates.\\\\\\n            this.context.eventBus?.publish('user_action_recorded', createdAction, createdAction.user_id); // Include userId in event\\\\\\n\\\\\\n            // --- New: Notify SyncService about local change ---\\\\\\n            // This is handled by the Realtime subscription now, which SyncService can listen to.\\\\\\n            // If Realtime is not used for sync, this manual notification is needed.\\\\\\n            // For MVP, let's assume SyncService listens to Realtime.\\\\\\n            // this.context.syncService?.handleLocalDataChange('authorityForgingEngine', 'INSERT', createdAction, createdAction.user_id)\\\\\\n            //     .catch(syncError => console.error('Error notifying SyncService for UserAction insert:', syncError));\\\\\\n            // --- End New ---\\\\\\n\\\\\\n\\\\\\n            return createdAction;\\\\\\n\\\\\\n        } catch (error: any) {\\\\\\\n            console.error('Failed to record user action:', error);\\\\\\\n            this.context.loggingService?.logError('Failed to record user action', { userId: actionDetails.user_id, error: error.message });\\\\\\\n            return null; // Return null on failure\\\\\\n        }\\\\\\n    }\\\\\\n\\\\\\n    /**\\\\\\n     * Retrieves recent user actions for a specific user from Supabase.\\\\\\n     * @param userId The user ID. Required.\\\\\\n     * @param limit The maximum number of recent actions to retrieve. Optional, defaults to 100.\\\\\\n     * @param language Optional: Filter results by language. Defaults to undefined (all languages).\\\\\\n     * @returns Promise<UserAction[]> An array of recent UserAction objects.\\\\\\n     */\\\\\\n    async getRecentActions(userId: string, limit: number = 100, language?: string): Promise<UserAction[]> {\\\\\\n        console.log('Retrieving recent user actions from Supabase for user:', userId, 'limit:', limit, 'Language:', language || 'all');\\\\\\n        this.context.loggingService?.logInfo('Attempting to fetch recent user actions', { userId, limit, language });\\\\\\\n\\\\\\n        if (!userId) {\\\\\\n            console.warn('[AuthorityForgingEngine] Cannot retrieve actions: User ID is required.');\\\\\\n            this.context.loggingService?.logWarning('Cannot retrieve user actions: User ID is required.');\\\\\\\n            return []; // Return empty if no user ID\\\\\\n        }\\\\\\n        try {\\\\\\n            // Fetch actions from Supabase, filtered by user_id\\\\\\n            let query = this.supabase\\\\\\n                .from('user_actions')\\\\\\n                .select('*')\\\\\\n                .eq('user_id', userId);\\\\\\\n\\\\\\n            // --- New: Add language filter ---\\\\\\n            if (language) {\\\\\\\n                query = query.eq('language', language);\\\\\\\n            }\\\\\\n            // --- End New ---\\\\\\n\\\\\\n            query = query.order('timestamp', { ascending: false } as any) // Order by newest first\\\\\\n                .limit(limit);\\\\\\\n\\\\\\n            const { data, error } = await query;\\\\\\\n\\\\\\n            if (error) throw error;\\\\\\\n\\\\\\n            const actions = data as UserAction[];\\\\\\n            console.log("]));
Fetched;
$;
{
    actions.length;
}
recent;
actions;
for (user; $; { userId: userId }.(__makeTemplateObject([");\\\n            this.context.loggingService?.logInfo("], [");\\\\\\n            this.context.loggingService?.logInfo("])))
    Fetched;
$;
{
    actions.length;
}
recent;
user;
actions;
successfully.(__makeTemplateObject([", { userId, language });\\\\\n            return actions;\\\\\n        } catch (error: any) {\\            console.error('Error fetching recent user actions from Supabase:', error);\\            this.context.loggingService?.logError('Failed to fetch recent user actions', { userId: userId, language, error: error.message });\\            return [];\\        }\\\n    }\\\n\\\n    /**\\\n     * Searches user actions for a specific user based on a query.\\\n     * Uses full-text search on action type, details, and context.\\\n     * @param query The search query. Required.\\     * @param userId The user ID. Required.\\     * @param limit The maximum number of matching actions to retrieve. Optional, defaults to 100.\\     * @param language Optional: Filter results by language. Defaults to undefined (all languages).\\\n     * @returns Promise<UserAction[]> An array of matching UserAction objects.\\     */\\\n    async searchUserActions(query: string, userId: string, limit: number = 100, language?: string): Promise<UserAction[]> {\\\n        console.log('Searching user actions from Supabase for user:', userId, 'query:', query, 'limit:', limit, 'Language:', language || 'all');\\\n        this.context.loggingService?.logInfo('Attempting to search user actions', { userId, query, limit, language });\\\\\n        if (!userId || !query) {\\\n            console.warn('[AuthorityForgingEngine] Search query and user ID are required.');\\\n            this.context.loggingService?.logWarning('Search query and user ID are required.');\\            return [];\\        }\\\n        try {\\\n            // Search actions from Supabase using the fts_vector column, filtered by user_id\\\n            let queryBuilder = this.supabase\\\n                .from('user_actions')\\\n                .select('*')\\\n                .eq('user_id', userId);\\\\\n            // --- Modified: Use language-specific text search if language is provided ---\\\n            // This requires language-specific text search configurations in PostgreSQL.\\\n            // For MVP, we'll just use the default 'english' config or rely on the 'language' column filter.\\\n            // Let's add the language filter to the text search query.\\\n            if (language) {\\                 // Note: This assumes your FTS index is configured to handle multiple languages or you have separate indexes.\\\n                 // For MVP, we'll just filter by the language column AND perform the text search.\\\n                 // A more advanced approach would use a language-specific tsvector column and index.\\\n                 queryBuilder = queryBuilder.eq('language', language);\\\n            }\\\n\\\n            queryBuilder = queryBuilder.textSearch('fts_vector', query); // Use textSearch on the generated fts_vector column\\\n\\\n            queryBuilder = queryBuilder.order('timestamp', { ascending: false } as any) // Order by newest first\\\n                .limit(limit);\\\\\n            const { data, error } = await queryBuilder;\\\\\n            if (error) throw error;\\\\\n            const actions = data as UserAction[];\\\n            console.log("], [", { userId, language });\\\\\\\n\\\\\\n            return actions;\\\\\\\n\\\\\\n        } catch (error: any) {\\\\\\\n            console.error('Error fetching recent user actions from Supabase:', error);\\\\\\\n            this.context.loggingService?.logError('Failed to fetch recent user actions', { userId: userId, language, error: error.message });\\\\\\\n            return [];\\\\\\\n        }\\\\\\n    }\\\\\\n\\\\\\n    /**\\\\\\n     * Searches user actions for a specific user based on a query.\\\\\\n     * Uses full-text search on action type, details, and context.\\\\\\n     * @param query The search query. Required.\\\\\\\n     * @param userId The user ID. Required.\\\\\\\n     * @param limit The maximum number of matching actions to retrieve. Optional, defaults to 100.\\\\\\\n     * @param language Optional: Filter results by language. Defaults to undefined (all languages).\\\\\\n     * @returns Promise<UserAction[]> An array of matching UserAction objects.\\\\\\\n     */\\\\\\n    async searchUserActions(query: string, userId: string, limit: number = 100, language?: string): Promise<UserAction[]> {\\\\\\n        console.log('Searching user actions from Supabase for user:', userId, 'query:', query, 'limit:', limit, 'Language:', language || 'all');\\\\\\n        this.context.loggingService?.logInfo('Attempting to search user actions', { userId, query, limit, language });\\\\\\\n\\\\\\n        if (!userId || !query) {\\\\\\n            console.warn('[AuthorityForgingEngine] Search query and user ID are required.');\\\\\\n            this.context.loggingService?.logWarning('Search query and user ID are required.');\\\\\\\n            return [];\\\\\\\n        }\\\\\\n        try {\\\\\\n            // Search actions from Supabase using the fts_vector column, filtered by user_id\\\\\\n            let queryBuilder = this.supabase\\\\\\n                .from('user_actions')\\\\\\n                .select('*')\\\\\\n                .eq('user_id', userId);\\\\\\\n\\\\\\n            // --- Modified: Use language-specific text search if language is provided ---\\\\\\n            // This requires language-specific text search configurations in PostgreSQL.\\\\\\n            // For MVP, we'll just use the default 'english' config or rely on the 'language' column filter.\\\\\\n            // Let's add the language filter to the text search query.\\\\\\n            if (language) {\\\\\\\n                 // Note: This assumes your FTS index is configured to handle multiple languages or you have separate indexes.\\\\\\n                 // For MVP, we'll just filter by the language column AND perform the text search.\\\\\\n                 // A more advanced approach would use a language-specific tsvector column and index.\\\\\\n                 queryBuilder = queryBuilder.eq('language', language);\\\\\\n            }\\\\\\n\\\\\\n            queryBuilder = queryBuilder.textSearch('fts_vector', query); // Use textSearch on the generated fts_vector column\\\\\\n\\\\\\n            queryBuilder = queryBuilder.order('timestamp', { ascending: false } as any) // Order by newest first\\\\\\n                .limit(limit);\\\\\\\n\\\\\\n            const { data, error } = await queryBuilder;\\\\\\\n\\\\\\n            if (error) throw error;\\\\\\\n\\\\\\n            const actions = data as UserAction[];\\\\\\n            console.log("]));
Found;
$;
{
    actions.length;
}
matching;
actions;
for (user; $; { userId: userId })
    with (query)
        ;
"${query}\\\\\\\".`);\\\n            this.context.loggingService?.logInfo(`Found ${actions.length} matching user actions successfully.`, { userId, query, language });\\\
\\\n            return actions;\\\
\\\n        } catch (error: any) {\\\
            console.error('Error searching user actions from Supabase:', error);\\\
            this.context.loggingService?.logError('Failed to search user actions', { userId: userId, query: query, language, error: error.message });\\\
            return [];\\\
        }\\\n    }\\\n\\\n\\\n    /**\\\n     * Manually forges (creates) a new automated ability for a user.\\\n     * This is a core part of the \"Generate\" step in the Six Styles (\u751f\u6210\u5f0f).\\\n     * @param name The name of the ability. Required.\\\
     * @param description A description of the ability. Optional.\\\
     * @param script The script code for the ability. Required.\\\
     * @param trigger The trigger configuration for the ability. Required.\\\
     * @param userId The user ID to associate the ability with. Required.\\\
     * @param language Optional: Language of the name, description, script comments. Defaults to user preference or system default.\\\
     * @returns Promise<ForgedAbility | null> The created ForgedAbility or null on failure.\\\
     * Part of the Bidirectional Sync Domain (\u96d9\u5410\u540c\u6b65\u9818\u57df).\\\
     * Privacy Note: Abilities are stored with a user_id and are subject to Row Level Security (RLS)\\\n     * policies in Supabase, ensuring users can only access their own private abilities and all public abilities.\\\n     */\\\n    async manuallyForgeAbility(name: string, description: string, script: string, trigger: AbilityTrigger, userId: string, language?: string): Promise<ForgedAbility | null> {\\\n        console.log('Manually forging ability in Supabase:', name, 'for user:', userId);\\\n        this.context.loggingService?.logInfo('Attempting to manually forge ability', { name, userId, language });\\\
\\\n        if (!userId) {\\\n            console.error('[AuthorityForgingEngine] Cannot forge ability: User ID is required.');\\\n            this.context.loggingService?.logError('Cannot forge ability: User ID is required.');\\\
            throw new Error('User ID is required to forge an ability.');\\\
        }\\\n        if (!name || !script || !trigger) {\\\n            console.error('[AuthorityForgingEngine] Cannot forge ability: Name, script, and trigger are required.');\\\
            this.context.loggingService?.logError('Cannot forge ability: Missing required fields.', { name, userId });\\\
            throw new Error('Name, script, and trigger are required to forge an ability.');\\\
        }\\\n\\\n        const contentLanguage = language || this.context.currentUser?.language_preference || 'en'; // Default to English if no preference\\\n\\\n        // --- New: Check user's ability capacity ---\\\n        const abilityCost = 1; // Default cost for a manually forged ability (can be made dynamic)\\\n        const capacityCheck = await this.checkAbilityCapacity(userId, abilityCost);\\\
        if (!capacityCheck.hasCapacity) {\\\
             console.warn(`[AuthorityForgingEngine] User ${userId} has insufficient ability capacity (${capacityCheck.currentCost}/${capacityCheck.capacity}). Required: ${abilityCost}.`);\\\
             this.context.loggingService?.logWarning(`Insufficient ability capacity for manual forging`, { userId, current: capacityCheck.currentCost, capacity: capacityCheck.capacity, required: abilityCost });\\\
             throw new Error(`Insufficient ability capacity. Required: ${abilityCost}, Available: ${capacityCheck.capacity - capacityCheck.currentCost}.`);\\\
        }\\\n        // --- End New ---\\\n\\\n\\\n        const newAbilityData: Omit<ForgedAbility, 'id' | 'creation_timestamp' | 'last_used_timestamp'> = {\\\n            name,\\\\\n            description: description || null,\\\\\n            script,\\\\\n            trigger,\\\\\n            forged_from_actions: [], // Manually forged abilities are not from actions\\\\\\\n            user_id: userId, // Associate with user\\\\\\\n            is_public: false, // Manually forged abilities are private by default\\\\\\\n            version: '1.0', // Default version\\\\\\\n            capacity_cost: abilityCost, // Store the capacity cost\\\\\\\n            is_enabled: true, // Enabled by default\\\\\\\n            language: contentLanguage, // Store the language\\\\\\\n            // creation_timestamp and last_used_timestamp are set by the database default/trigger\\\\\\\n        };\\\\\\\n\\\\\\n        try {\\\\\\\n            // Persist ability to Supabase (Supports Bidirectional Sync Domain)\\\\\\n            const { data, error } = await this.supabase\\\\\\n                .from('abilities')\\\\\\n                .insert([newAbilityData])\\\\\\n                .select() // Select the inserted data to get the generated ID and timestamps\\\\\\n                .single(); // Expecting a single record back\\\\\\n\\\\\\n            if (error) {\\\\\\\n                console.error('Error forging ability to Supabase:', error);\\\\\\\n                this.context.loggingService?.logError('Failed to forge ability', { name: name, userId: userId, error: error.message });\\\\\\\n                throw error; // Re-throw the error\\\\\\\n            }\\\\\\n\\\\\\n            const createdAbility = data as ForgedAbility;\\\\\\\n            console.log('Ability forged:', createdAbility.id, '-', createdAbility.name, 'for user:', createdAbility.user_id, 'Language:', createdAbility.language);\\\\\\\n\\\\\\n            // Publish a 'ability_forged' event (part of Six Styles/EventBus - call context.eventBus.publish)\\\\\\n            this.context.eventBus?.publish('ability_forged', createdAbility, userId); // Include userId in event\\\\\\\n\\\n            // TODO: Notify SyncService about local change if SyncService is not listening to Realtime directly\\\n            // this.context.syncService?.handleLocalDataChange('authorityForgingEngine', 'INSERT', createdAbility, userId)\\\n            //     .catch(syncError => console.error('Error notifying SyncService for Ability insert:', syncError));\\\n\\\n\\\n            return createdAbility;\\\n\\\n        } catch (error: any) {\\\
            console.error('Failed to manually forge ability:', error);\\\
            this.context.loggingService?.logError('Failed to manually forge ability', { name: name, userId: userId, error: error.message });\\\
            throw error; // Re-throw the error after logging\\\
        }\\\n    }\\\n\\\n    /**\\\n     * Forges (creates) a new automated ability for a user based on a sequence of user actions.\\\n     * This is a core part of the \"Generate\" step in the Six Styles (\u751f\u6210\u5f0f).\\\n     * Leverages WisdomSecretArt to generate the script and trigger from action details.\\\
     * @param actionDetails An array of user action details (from the insight). Required.\\\
     * @param userId The user ID to associate the ability with. Required.\\\
     * @param forgedFromInsightId Optional: The ID of the insight that triggered this forging.\\\
     * @param language Optional: Language preference for the generated ability (name, description, script comments).\\\n     * @returns Promise<ForgedAbility | null> The created ForgedAbility or null on failure.\\\
     */\\\n    async forgeAbilityFromActions(actionDetails: UserAction['details'][], userId: string, forgedFromInsightId?: string, language?: string): Promise<ForgedAbility | null> {\\\n        console.log(`[AuthorityForgingEngine] Forging ability from actions for user: ${userId}, actions count: ${actionDetails.length}`);\\\
        this.context.loggingService?.logInfo(`Attempting to forge ability from actions for user ${userId}`, { userId, actionCount: actionDetails.length, forgedFromInsightId, language });\\\
\\\n        if (!userId || !actionDetails || actionDetails.length === 0) {\\\
            console.error('[AuthorityForgingEngine] Cannot forge ability from actions: User ID and action details are required.');\\\
            this.context.loggingService?.logError('Cannot forge ability from actions: Missing required fields.', { userId, actionCount: actionDetails.length });\\\
            throw new Error('User ID and action details are required to forge an ability from actions.');\\\
        }\\\n\\\n        if (!this.context.wisdomSecretArt) {\\\
             console.error('[AuthorityForgingEngine] WisdomSecretArt is not initialized. Cannot generate ability components.');\\\
             this.context.loggingService?.logError('WisdomSecretArt not available for ability generation.');\\\
             throw new Error('AI generation service is not available.');\\\
        }\\\n\\\n        const contentLanguage = language || this.context.currentUser?.language_preference || 'en'; // Default to English if no preference\\\n\\\n        try {\\\n            // Use WisdomSecretArt to generate the script, trigger, name, and description\\\n            // Pass the language preference to the generator\\\n            const generated = await this.context.wisdomSecretArt.generateAbilityScriptAndTrigger(actionDetails, userId, forgedFromInsightId, contentLanguage); // Pass language\\\n\\\n            if (!generated || !generated.script || !generated.trigger || !generated.name || !generated.description) {\\\
                 throw new Error('WisdomSecretArt failed to generate complete ability components.');\\\
            }\\\n\\\n            // --- New: Check user's ability capacity ---\\\n            const abilityCost = 1; // Default cost for an AI-forged ability (can be made dynamic based on complexity)\\\n            const capacityCheck = await this.checkAbilityCapacity(userId, abilityCost);\\\
            if (!capacityCheck.hasCapacity) {\\\
                 console.warn(`[AuthorityForgingEngine] User ${userId} has insufficient ability capacity (${capacityCheck.currentCost}/${capacityCheck.capacity}). Required: ${abilityCost}.`);\\\
                 this.context.loggingService?.logWarning(`Insufficient ability capacity for AI forging`, { userId, current: capacityCheck.currentCost, capacity: capacityCheck.capacity, required: abilityCost });\\\
                 throw new Error(`Insufficient ability capacity. Required: ${abilityCost}, Available: ${capacityCheck.capacity - capacityCheck.currentCost}.`);\\\
            }\\\n            // --- End New ---\\\n\\\n\\\n            // Now, use the generated components to create the ability in the database\\\n            const newAbilityData: Omit<ForgedAbility, 'id' | 'creation_timestamp' | 'last_used_timestamp'> = {\\\n                name: generated.name,\\\\\n                description: generated.description,\\\\\n                script: generated.script,\\\\\n                trigger: generated.trigger,\\\\\n                forged_from_actions: actionDetails.map(action => action.id).filter(id => id), // Link to the original action IDs if available\\\\\\\n                user_id: userId, // Associate with user\\\\\\\n                is_public: false, // Abilities forged from user actions are private by default\\\\\\\n                version: '1.0', // Default version\\\\\\\n                capacity_cost: abilityCost, // Store the capacity cost\\\\\\\n                is_enabled: true, // Enabled by default\\\\\\\n                language: contentLanguage, // Store the language\\\\\\\n                // creation_timestamp and last_used_timestamp are set by the database default/trigger\\\\\\\n            };\\\\\\\n\\\n            // Persist ability to Supabase (Supports Bidirectional Sync Domain)\\\\\\n            const { data, error } = await this.supabase\\\\\\n                .from('abilities')\\\\\\n                .insert([newAbilityData])\\\\\\n                .select() // Select the inserted data to get the generated ID and timestamps\\\\\\n                .single(); // Expecting a single record back\\\\\\n\\\n            if (error) {\\\
                console.error('Error forging ability from actions to Supabase:', error);\\\
                this.context.loggingService?.logError('Failed to forge ability from actions', { userId: userId, error: error.message });\\\
                throw error; // Re-throw the error\\\
            }\\\n\\\n            const createdAbility = data as ForgedAbility;\\\
            console.log('Ability forged from actions:', createdAbility.id, '-', createdAbility.name, 'for user:', createdAbility.user_id, 'Language:', createdAbility.language);\\\
\\\n            // Publish a 'ability_forged' event\\\
            this.context.eventBus?.publish('ability_forged', createdAbility, userId); // Include userId in event\\\
\\\n            // TODO: Notify SyncService about local change\\\n\\\n            return createdAbility;\\\
\\\n        } catch (error: any) {\\\
            console.error('Failed to forge ability from actions:', error);\\\
            this.context.loggingService?.logError('Failed to forge ability from actions', { userId: userId, error: error.message });\\\
            throw error; // Re-throw the error after logging\\\
        }\\\n    }\\\n\\\n\\\n    /**\\\n     * Retrieves abilities for a specific user from Supabase, including public ones.\\\n     * @param typeFilter Optional: Filter by ability type (e.g., 'script').\\\n     * @param userId The user ID. Required.\\\
     * @param language Optional: Filter results by language. Defaults to undefined (all languages).\\\n     * @returns Promise<ForgedAbility[]> An array of ForgedAbility objects.\\\
     */\\\n    async getAbilities(typeFilter?: string, userId?: string, language?: string): Promise<ForgedAbility[]> {\\\n        console.log('Retrieving abilities from Supabase for user:', userId, 'type filter:', typeFilter || 'all', 'Language:', language || 'all');\\\
        this.context.loggingService?.logInfo('Attempting to fetch abilities', { userId, typeFilter, language });\\\
\\\n        // Allow fetching public abilities without a user ID, but log a warning\\\n        if (!userId) {\\\
             console.warn('[AuthorityForgingEngine] Fetching abilities without user ID. Will only retrieve public abilities.');\\\
             this.context.loggingService?.logWarning('Fetching abilities without user ID. Will only retrieve public abilities.');\\\
        }\\\n\\\n        try {\\\n            // Fetch abilities from Supabase, filtered by user_id OR is_public\\\n            let dbQuery = this.supabase\\\n                .from('abilities')\\\n                .select('*'); // Select all columns\\\n\\\n            if (userId) {\\\
                 // Fetch user's own abilities OR public abilities\\\n                 dbQuery = dbQuery.or(`user_id.eq.${userId},is_public.eq.true`);\\\
            } else {\\\
                 // If no user ID, only fetch public abilities\\\n                 dbQuery = dbQuery.eq('is_public', true);\\\
            }\\\n\\\n\\\n            if (typeFilter) {\\\
                // Assuming ability type is stored in a 'type' column or within the 'trigger' JSONB\\\n                // For MVP, let's assume filtering by trigger type if typeFilter is provided\\\n                dbQuery = dbQuery.eq('trigger->>type', typeFilter);\\\
            }\\\n\\\n            // --- New: Add language filter ---\\\n            if (language) {\\\
                dbQuery = dbQuery.eq('language', language);\\\
            }\\\n            // --- End New ---\\\n\\\n            dbQuery = dbQuery.order('creation_timestamp', { ascending: false } as any); // Order by newest first\\\n\\\n\\\n            const { data, error } = await dbQuery;\\\
\\\n            if (error) { throw error; }\\\
\\\n            const abilities = data as ForgedAbility[];\\\
            console.log(`Fetched ${data.length} abilities for user ${userId || 'public'}.`);\\\
            this.context.loggingService?.logInfo(`Fetched ${data.length} abilities successfully.`, { userId, language });\\\
\\\n            return abilities;\\\
\\\n        } catch (error: any) {\\\
            console.error('Error fetching abilities from Supabase:', error);\\\
            this.context.loggingService?.logError('Failed to fetch abilities', { userId: userId, language, error: error.message });\\\
            return [];\\\
        }\\\n    }\\\n\\\n    /**\\\n     * Retrieves a specific ability by ID for a specific user from Supabase.\\\n     * Checks if the ability is public or owned by the user.\\\
     * @param abilityId The ID of the ability. Required.\\\
     * @param userId The user ID for verification. Required.\\\
     * @returns Promise<ForgedAbility | undefined> The ForgedAbility object or undefined.\\\
     */\\\n    async getAbilityById(abilityId: string, userId: string): Promise<ForgedAbility | undefined> {\\\
        console.log('Retrieving ability by ID from Supabase:', abilityId, 'for user:', userId);\\\
        this.context.loggingService?.logInfo(`Attempting to fetch ability ${abilityId}`, { id: abilityId, userId });\\\
\\\n         if (!userId) {\\\
             console.warn('[AuthorityForgingEngine] Cannot retrieve ability: User ID is required.');\\\
             this.context.loggingService?.logWarning('Cannot retrieve ability: User ID is required.');\\\
             return undefined;\\\
         }\\\n        try {\\\
            // Fetch ability from Supabase by ID and check if it's public OR owned by the user\\\n              const { data, error } = await this.supabase\\\n                  .from('abilities')\\\n                  .select('*')\\\n                  .eq('id', abilityId)\\\
                  .or(`user_id.eq.${userId},is_public.eq.true`) // Ensure ownership OR public status\\\
                  .single();\\\
\\\n              if (error) { throw error; }\\\
              if (!data) { return undefined; } // Ability not found or doesn't belong to user/is not public\\\
\\\n              const ability = data as ForgedAbility;\\\
\\\n              console.log(`Fetched ability ${abilityId} for user ${userId}. Language: ${ability.language}`);\\\
              this.context.loggingService?.logInfo(`Fetched ability ${abilityId} successfully.`, { id: abilityId, userId: userId, language: ability.language });\\\
\\\n              return ability;\\\
\\\n        } catch (error: any) {\\\
            console.error(`Error fetching ability ${abilityId} from Supabase:`, error);\\\
            this.context.loggingService?.logError(`Failed to fetch ability ${abilityId}`, { id: abilityId, userId: userId, error: error.message });\\\
            return undefined;\\\
        }\\\n    }\\\n\\\n\\\n    /**\\\n     * Updates an existing ability for a specific user in Supabase.\\\n     * Only allows updating abilities owned by the user.\\\
     * @param abilityId The ID of the ability. Required.\\\
     * @param updates The updates to apply (name, description, script, trigger, is_enabled, is_public, language). Required.\\\
     * @param userId The user ID for verification (checks ownership). Required.\\\
     * @returns Promise<ForgedAbility | undefined> The updated ForgedAbility or undefined if not found or user mismatch.\\\
     */\\\n    async updateAbility(abilityId: string, updates: Partial<Omit<ForgedAbility, 'id' | 'user_id' | 'creation_timestamp' | 'last_used_timestamp' | 'forged_from_actions'>>, userId: string): Promise<ForgedAbility | undefined> {\\\
        console.log(`Updating ability ${abilityId} in Supabase for user ${userId}...`, updates);\\\
        this.context.loggingService?.logInfo(`Attempting to update ability ${abilityId}`, { id: abilityId, updates, userId });\\\
\\\n         if (!userId) {\\\
             console.warn('[AuthorityForgingEngine] Cannot update ability: User ID is required.');\\\
             this.context.loggingService?.logWarning('Cannot update ability: User ID is required.');\\\
             return undefined;\\\
         }\\\n\\\n        try {\\\
            // Persist update to Supabase (Supports Bidirectional Sync Domain)\\\n            // Filter by ID and user_id to ensure ownership and that it's not a public ability (unless admin)\\\
              const { data, error } = await this.supabase\\\n                  .from('abilities')\\\n                  .update(updates)\\\n                  .eq('id', abilityId)\\\n                  .eq('user_id', userId) // Ensure ownership (users can only update their own abilities)\\\n                  .eq('is_public', false) // Users can only update their *private* abilities via this method\\\n                  .select() // Select updated ability data\\\n                  .single();\\\
\\\n              if (error) throw error;\\\
              if (!data) { // Should not happen if RLS is correct and ID/user_id match\\\
                   console.warn(`Ability ${abilityId} not found or does not belong to user ${userId} (or is public) for update.`);\\\
                   this.context.loggingService?.logWarning(`Ability not found or user mismatch for update: ${abilityId}`, { userId });\\\
                   return undefined;\\\
              }\\\n\\\n              const updatedAbility = data as ForgedAbility;\\\
\\\n            console.log(`Ability ${abilityId} updated in Supabase. Language: ${updatedAbility.language}`);\\\
            // Publish an event indicating an ability has been updated (part of Six Styles/EventBus)\\\n            this.context.eventBus?.publish('ability_updated', updatedAbility, userId); // Include userId in event\\\
            this.context.loggingService?.logInfo(`Ability updated successfully: ${abilityId}`, { id: abilityId, userId: userId, language: updatedAbility.language });\\\
\\\n            // TODO: Notify SyncService about local change\\\n\\\n            return updatedAbility;\\\
\\\n          } catch (error: any) {\\\
              console.error(`Failed to update ability ${abilityId}:`, error);\\\
              this.context.loggingService?.logError(`Failed to update ability ${abilityId}`, { id: abilityId, updates, userId: userId, error: error.message });\\\
              throw error; // Re-throw the error\\\
          }\\\n    }\\\n\\\n    /**\\\n     * Deletes an ability for a specific user from Supabase.\\\n     * Only allows deleting abilities owned by the user.\\\
     * @param abilityId The ID of the ability. Required.\\\
     * @param userId The user ID for verification (checks ownership). Required.\\\
     * @returns Promise<boolean> True if deletion was successful, false otherwise.\\\
     */\\\n    async deleteAbility(abilityId: string, userId: string): Promise<boolean> {\\\
        console.log(`Deleting ability ${abilityId} from Supabase for user ${userId}...`);\\\
        this.context.loggingService?.logInfo(`Attempting to delete ability ${abilityId}`, { id: abilityId, userId });\\\
\\\n         if (!abilityId || !userId) {\\\
             console.warn('[AuthorityForgingEngine] Cannot delete ability: ID and user ID are required.');\\\
             this.context.loggingService?.logWarning('Cannot delete ability: ID and user ID are required.');\\\
             return false; // Return false if no user ID\\\
         }\\\n\\\n        try {\\\
            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)\\\n            // Filter by ID and user_id to ensure ownership and that it's not a public ability (unless admin)\\\
              const { count, error } = await this.supabase\\\n                  .from('abilities')\\\n                  .delete()\\\n                  .eq('id', abilityId)\\\n                  .eq('user_id', userId)\\\n                  .eq('is_public', false) // Users can only delete their *private* abilities via this method\\\n                  .select('id', { count: 'exact' }); // Select count to check if a row was deleted\\\
\\\n              if (error) { throw error; }\\\
\\\n              const deleted = count !== null && count > 0; // Check if count is greater than 0\\\
\\\n              if (deleted) {\\\
                  console.log(`Ability ${abilityId} deleted from Supabase.`);\\\
                  // Publish an event indicating an ability has been deleted (part of Six Styles/EventBus)\\\n                  this.context.eventBus?.publish('ability_delete', { abilityId: abilityId, userId: userId }, userId); // Include userId in event\\\
                  this.context.loggingService?.logInfo(`Ability deleted successfully: ${abilityId}`, { id: abilityId, userId: userId });\\\
              } else {\\\
                  console.warn(`Ability ${abilityId} not found for deletion or user mismatch (or is public).`);\\\
                  this.context.loggingService?.logWarning(`Ability not found for deletion or user mismatch: ${abilityId}`, { id: abilityId, userId });\\\
              }\\\n              return deleted;\\\
\\\n        } catch (error: any) {\\\
            console.error(`Failed to delete ability ${abilityId}:`, error);\\\
            this.context.loggingService?.logError(`Failed to delete ability ${abilityId}`, { id: abilityId, userId: userId, error: error.message });\\\
            return false; // Return false on failure\\\
        }\\\n    }\\\n\\\n\\\n    /**\\\n     * Executes a specific automated ability for a user.\\\n     * This is a core part of the \"Act\" step in the Six Styles (\u884c\u52d5\u5f0f).\\\n     * Delegates the script execution to the ScriptSandbox.\\\
     * @param abilityId The ID of the ability to execute. Required.\\\
     * @param userId The user ID executing the ability. Required.\\\
     * @param params Optional parameters to pass to the ability script.\\\
     * @returns Promise<any> The result of the ability execution.\\\
     * @throws Error if the ability is not found, not enabled, or execution fails.\\\
     */\\\n    async executeAbility(abilityId: string, userId: string, params?: any): Promise<any> {\\\n        console.log(`[AuthorityForgingEngine] Attempting to execute ability: ${abilityId} for user ${userId}`);\\\
        this.context.loggingService?.logInfo(`Attempting to execute ability: ${abilityId}`, { abilityId, userId, params });\\\
\\\n        if (!userId) {\\\
            console.error('[AuthorityForgingEngine] Cannot execute ability: User ID is required.');\\\
            this.context.loggingService?.logError('Cannot execute ability: User ID is required.');\\\
            throw new Error('User ID is required to execute an ability.');\\\
        }\\\n\\\n        // 1. Retrieve the ability definition\\\n        const ability = await this.getAbilityById(abilityId, userId);\\\
\\\n        if (!ability) {\\\
            console.error(`[AuthorityForgingEngine] Ability \\\\\\\"${abilityId}\\\\\\\" not found or not accessible for user ${userId}.`);\\\
            this.context.loggingService?.logError(`Ability not found or not accessible for execution: ${abilityId}`, { abilityId, userId });\\\
            throw new Error(`Ability \\\\\\\"${abilityId}\\\\\\\" not found or not accessible.`);\\\
        }\\\n\\\n        // 2. Check if the ability is enabled\\\n        if (!ability.is_enabled) {\\\
            console.warn(`[AuthorityForgingEngine] Ability \\\\\\\"${ability.name}\\\\\\\" (${ability.id}) is disabled.`);\\\
            this.context.loggingService?.logWarning(`Attempted to execute disabled ability: ${ability.id}`, { abilityId: ability.id, userId });\\\
            throw new Error(`Ability \\\\\\\"${ability.name}\\\\\\\" is disabled.`);\\\
        }\\\n\\\n        // 3. Check if ScriptSandbox is available\\\n        if (!this.context.scriptSandbox) {\\\
             console.error('[AuthorityForgingEngine] ScriptSandbox is not initialized. Cannot execute ability script.');\\\
             this.context.loggingService?.logError('ScriptSandbox not available for ability execution.');\\\
             throw new Error('Script execution environment is not available.');\\\
        }\\\n\\\n        // 4. Execute the ability script in the sandbox\\\n        console.log(`[AuthorityForgingEngine] Executing script for ability \\\\\\\"${ability.name}\\\\\\\" (${ability.id})...`);\\\
        this.context.loggingService?.logInfo(`Executing script for ability: ${ability.id}`, { abilityId: ability.id, userId, stepIndex: undefined, stepId: undefined, actionType: 'runScript' }); // Log as a system action\\\
\\\n        try {\\\
            // Pass the script code, parameters, and user ID to the ScriptSandbox\\\
            // --- Modified: Call ScriptSandbox.execute and await the result ---\\\n            const executionResult = await this.context.scriptSandbox.execute(ability.script, params, userId);\\\
            // --- End Modified ---\\\
\\\n            console.log(`[AuthorityForgingEngine] Script execution for ability \\\\\\\"${ability.name}\\\\\\\" (${ability.id}) completed. Result:`, executionResult);\\\
            this.context.loggingService?.logInfo(`Script execution completed for ability: ${ability.id}`, { abilityId: ability.id, userId, result: executionResult });\\\
\\\n            // Publish a 'ability_executed' event (part of Six Styles/EventBus)\\\
            this.context.eventBus?.publish('ability_executed', { abilityId: ability.id, userId: userId, result: executionResult }, userId); // Include userId in event\\\
\\\n            // TODO: Update last_used_timestamp for the ability in Supabase (Supports AARRR - Retention)\\\
            // This should be done asynchronously.\\\
            this.updateAbilityLastUsedTimestamp(ability.id, userId).catch(err => console.error('Failed to update ability last_used_timestamp:', err));\\\
\\\n\\\n            return executionResult; // Return the result from the script execution\\\
\\\n        } catch (error: any) {\\\
            console.error(`[AuthorityForgingEngine] Error executing script for ability \\\\\\\"${ability.name}\\\\\\\" (${ability.id}):`, error.message);\\\
            this.context.loggingService?.logError(`Error executing script for ability: ${ability.id}`, { abilityId: ability.id, userId, error: error.message });\\\
\\\n            // Publish a 'ability_execution_failed' event (part of Six Styles/EventBus)\\\
            this.context.eventBus?.publish('ability_execution_failed', { abilityId: ability.id, userId: userId, error: error.message }, userId); // Include userId in event\\\
\\\n            // TODO: Trigger EvolutionEngine to handle ability failure for learning (call context.evolutionEngine.handleAbilityFailureForEvolution)\\\
            // This requires EvolutionEngine to have a method for this.\\\
\\\n            throw error; // Re-throw the error after logging and event publishing\\\
        }\\\n    }\\\n\\\n    /**\\\n     * Helper to update ability last_used_timestamp.\\\n     * @param abilityId The ID of the ability. Required.\\\
     * @param userId The user ID. Required.\\\
     * @returns Promise<void>\\\n     */\\\n    private async updateAbilityLastUsedTimestamp(abilityId: string, userId: string): Promise<void> {\\\
        try {\\\
            // Update the last_used_timestamp in Supabase for the specific ability and user\\\n            // Note: This assumes a user might have their own instance of a public ability,\\\n            // or we track usage of public abilities per user.\\\n            // For simplicity, let's update the user's specific ability record if it exists,\\\n            // or the public ability record if it's a public ability being used.\\\n            // This requires checking if the ability is public or user-owned.\\\n\\\n            // Fetch the ability definition first to check ownership/public status\\\n            const abilityDefinition = await this.getAbilityById(abilityId, userId); // Use getAbilityById to check ownership/public status\\\n            if (!abilityDefinition) {\\\
                 console.warn(`[AuthorityForgingEngine] Ability definition not found for timestamp update: ${abilityId}`);\\\
                 return; // Cannot update if definition is not found or not accessible\\\n            }\\\n\\\n            let query = this.supabase.from('abilities').update({ last_used_timestamp: new Date().toISOString() } as Partial<ForgedAbility>);\\\
\\\n            if (abilityDefinition.is_public) {\\\
                 // Update the public ability record\\\n                 query = query.eq('id', abilityId).eq('is_public', true);\\\
            } else if (abilityDefinition.user_id === userId) {\\\
                 // Update the user's specific ability record\\\n                 query = query.eq('id', abilityId).eq('user_id', userId).eq('is_public', false);\\\
            } else {\\\
                 console.warn(`[AuthorityForgingEngine] Attempted to update timestamp for ability ${abilityId} not owned by user ${userId} and not public.`);\\\
                 return; // Cannot update if not public or user-owned\\\
            }\\\n\\\n\\\n            const { error } = await query;\\\
\\\n            if (error) {\\\
                console.error(`[AuthorityForgingEngine] Error updating ability ${abilityId} last_used_timestamp:`, error.message);\\\
                this.context.loggingService?.logError(`Failed to update ability last_used_timestamp`, { abilityId, userId, error: error.message });\\\
            } else {\\\
                // console.log(`[AuthorityForgingEngine] Ability ${abilityId} last_used_timestamp updated.`); // Avoid excessive logging\\\
            }\\\n\\\n        } catch (error: any) {\\\
            console.error(`[AuthorityForgingEngine] Unexpected error updating ability ${abilityId} last_used_timestamp:`, error.message);\\\
            this.context.loggingService?.logError(`Unexpected error updating ability last_used_timestamp`, { abilityId, userId, error: error.message });\\\
            throw error; // Re-throw the error\\\
        }\\\n    }\\\n\\\n    // --- New: Implement Ability Capacity Check ---\\\n    /**\\\n     * Calculates the current ability capacity cost for a specific user.\\\n     * Sums up the capacity_cost of all abilities owned by the user.\\\
     * @param userId The user ID. Required.\\\
     * @returns Promise<{ currentCost: number, capacity: number }> The current cost and total capacity.\\\
     * @throws Error if user profile not found or Supabase error occurs.\\\
     */\\\n    async getUserAbilityCapacity(userId: string): Promise<{ currentCost: number, capacity: number }> {\\\
        console.log(`[AuthorityForgingEngine] Calculating ability capacity for user: ${userId}...`);\\\
        this.context.loggingService?.logInfo(`Calculating ability capacity for user ${userId}`, { userId });\\\
\\\n        if (!userId) {\\\
             console.error('[AuthorityForgingEngine] Cannot calculate ability capacity: User ID is required.');\\\
             this.context.loggingService?.logError('Cannot calculate ability capacity: User ID is required.');\\\
             throw new Error('User ID is required.');\\\
        }\\\n\\\n        try {\\\
            // 1. Get the user's total capacity from their profile\\\n            // For MVP, reuse rune_capacity from the profiles table.\\\
            const { data: profileData, error: profileError } = await this.supabase\\\n                .from('profiles')\\\n                .select('rune_capacity') // Reuse rune_capacity for MVP ability capacity\\\n                .eq('id', userId)\\\n                .single();\\\
\\\n            if (profileError) throw profileError;\\\
            if (!profileData) {\\\
                 console.error(`[AuthorityForgingEngine] User profile not found for capacity calculation: ${userId}.`);\\\
                 this.context.loggingService?.logError(`User profile not found for capacity calculation: ${userId}`, { userId });\\\
                 throw new Error(`User profile not found for capacity calculation.`);\\\
            }\\\n\\\n            const totalCapacity = profileData.rune_capacity || 100; // Default to 100 if not set\\\n\\\n\\\n            // 2. Sum the capacity_cost of all abilities owned by the user (is_public = false AND user_id = userId)\\\n            const { data: userAbilitiesData, error: abilitiesError } = await this.supabase\\\n                .from('abilities')\\\n                .select('capacity_cost')\\\n                .eq('user_id', userId)\\\n                .eq('is_public', false); // Only count user-owned abilities\\\
\\\n            if (abilitiesError) throw abilitiesError;\\\
\\\n            const currentCost = userAbilitiesData.reduce((sum, ability) => sum + (ability.capacity_cost || 1), 0); // Sum costs, default to 1 if cost is null/undefined\\\
\\\n\\\n            console.log(`[AuthorityForgingEngine] Ability capacity for user ${userId}: ${currentCost}/${totalCapacity}.`);\\\
            this.context.loggingService?.logInfo(`Ability capacity calculated for user ${userId}`, { userId, currentCost, totalCapacity });\\\
\\\n            return { currentCost, capacity: totalCapacity };\\\
\\\n        } catch (error: any) {\\\
            console.error(`[AuthorityForgingEngine] Failed to calculate ability capacity for user ${userId}:`, error.message);\\\
            this.context.loggingService?.logError(`Failed to calculate ability capacity for user ${userId}`, { userId: userId, error: error.message });\\\
            throw error; // Re-throw the error\\\
        }\\\n    }\\\n\\\n    /**\\\n     * Checks if a user has enough ability capacity for a new ability.\\\n     * @param userId The user ID. Required.\\\
     * @param requiredCost The capacity cost of the new ability. Required.\\\
     * @returns Promise<{ hasCapacity: boolean, currentCost: number, capacity: number }> Result of the check.\\\
     * @throws Error if user profile not found or Supabase error occurs during capacity calculation.\\\
     */\\\n    async checkAbilityCapacity(userId: string, requiredCost: number): Promise<{ hasCapacity: boolean, currentCost: number, capacity: number }> {\\\
        console.log(`[AuthorityForgingEngine] Checking ability capacity for user: ${userId}, required: ${requiredCost}...`);\\\
        this.context.loggingService?.logInfo(`Checking ability capacity for user ${userId}`, { userId, requiredCost });\\\
\\\n        if (!userId) {\\\
             console.error('[AuthorityForgingEngine] Cannot check ability capacity: User ID is required.');\\\
             this.context.loggingService?.logWarning('Cannot check ability capacity: User ID is required.');\\\
             throw new Error('User ID is required.');\\\
        }\\\n\\\n        try {\\\
            const { currentCost, capacity } = await this.getUserAbilityCapacity(userId);\\\
            const hasCapacity = (currentCost + requiredCost) <= capacity;\\\
\\\n            console.log(`[AuthorityForgingEngine] Ability capacity check for user ${userId}: Has Capacity = ${hasCapacity} (${currentCost}/${capacity}, Required: ${requiredCost}).`);\\\
            this.context.loggingService?.logInfo(`Ability capacity check for user ${userId}`, { userId, requiredCost, currentCost, capacity, hasCapacity });\\\
\\\n            return { hasCapacity, currentCost, capacity };\\\
\\\n        } catch (error: any) {\\\
            console.error(`[AuthorityForgingEngine] Error during ability capacity check for user ${userId}:`, error.message);\\\
            this.context.loggingService?.logError(`Error during ability capacity check for user ${userId}`, { userId: userId, requiredCost, error: error.message });\\\
            throw error; // Re-throw the error\\\
        }\\\n    }\\\n    // --- End New ---\\\n\\\n    // --- New: Implement findMatchingAbilities method for event triggers ---\\\n    /**\\\n     * Finds enabled abilities for a user whose triggers match a given event payload.\\\n     * @param eventPayload The payload of the event (e.g., from UserAction or SystemEvent).\\\
     * @param userId The user ID. Required.\\\
     * @returns Promise<ForgedAbility[]> An array of matching abilities.\\\
     */\\\n    async findMatchingAbilities(eventPayload: any, userId: string): Promise<ForgedAbility[]> {\\\
        console.log(`[AuthorityForgingEngine] Finding matching abilities for user: ${userId}, event type: ${eventPayload?.type}`);\\\
        this.context.loggingService?.logInfo('Attempting to find matching abilities for event', { userId, eventType: eventPayload?.type });\\\
\\\n        if (!userId || !eventPayload) {\\\
            console.warn('[AuthorityForgingEngine] Cannot find matching abilities: User ID or event payload missing.');\\\
            return [];\\\
        }\\\n\\\n        try {\\\n            // 1. Fetch all enabled abilities for the user (private) and public enabled abilities\\\n            // Use getAbilities method with is_enabled filter (assuming it supports it or filter client-side)\\\n            // Let's filter client-side for MVP simplicity.\\\n            const allAbilities = await this.getAbilities(undefined, userId); // Get all accessible abilities\\\n            const enabledAbilities = allAbilities.filter(ability => ability.is_enabled);\\\n\\\n            console.log(`[AuthorityForgingEngine] Found ${allAbilities.length} accessible abilities, ${enabledAbilities.length} enabled.`);\\\
\\\n            // 2. Iterate through enabled abilities and check if their trigger matches the event payload\\\n            const matchingAbilities: ForgedAbility[] = [];\\\n\\\n            for (const ability of enabledAbilities) {\\\n                const trigger = ability.trigger;\\\n                if (!trigger) continue; // Skip abilities without triggers\\\n\\\n                let isMatch = false;\\\n\\\n                // --- Implement Trigger Matching Logic (Simplified for MVP) ---\\\n                switch (trigger.type) {\\\n                    case 'event':\\\n                        // Match if the event payload type matches the trigger's eventType\\\n                        // And potentially match based on other details in trigger.details and eventPayload\\\n                        if (trigger.details?.eventType && eventPayload?.type === trigger.details.eventType) {\\\n                            // TODO: Add more sophisticated matching based on trigger.details (e.g., filter by source, specific payload values)\\\n                            isMatch = true;\\\n                            console.log(`[AuthorityForgingEngine] Matched event trigger for ability ${ability.id}: ${trigger.details.eventType}`);\\\n                        }\\\n                        break;\\\n                    case 'keyword':\\\n                        // Keyword triggers are typically matched against user input, not system events.\\\n                        // This type of trigger would be handled by the InputAgent/DecisionAgent.\\\n                        // We include it here for completeness but it won't match system events.\\\n                        break;\\\n                    case 'schedule':\\\n                        // Schedule triggers are matched based on time, handled by a scheduler service.\\\n                        // They don't match event payloads.\\\n                        break;\\\n                    case 'manual':\\\n                        // Manual triggers are not matched by events.\\\n                        break;\\\n                    // TODO: Add matching logic for other trigger types (location, time, webhook)\\\n                    // Webhook triggers are handled by the WebhookAgent.\\\n\\\n                    default:\\\n                        // console.warn(`[AuthorityForgingEngine] Unsupported trigger type for event matching: ${trigger.type}`);\\\n                        break;\\\
                }\\\n                // --- End Trigger Matching Logic ---\\\n\\\n                if (isMatch) {\\\n                    matchingAbilities.push(ability);\\\n                }\\\n            }\\\n\\\n            console.log(`[AuthorityForgingEngine] Found ${matchingAbilities.length} matching abilities for event type: ${eventPayload?.type}.`);\\\
            this.context.loggingService?.logInfo(`Found ${matchingAbilities.length} matching abilities for event type: ${eventPayload?.type}.`, { userId, eventType: eventPayload?.type, matchingAbilityIds: matchingAbilities.map(a => a.id) });\\\
\\\n            return matchingAbilities;\\\
\\\n        } catch (error: any) {\\\
            console.error('[AuthorityForgingEngine] Error finding matching abilities:', error);\\\
            this.context.loggingService?.logError('Error finding matching abilities for event', { userId, eventType: eventPayload?.type, error: error.message });\\\
            throw new Error(`Failed to find matching abilities: ${error.message}`);\\\
        }\\\n    }\\\n    // --- End New ---\\\n\\\n\\\n    // TODO: Implement methods for managing ability permissions (who can execute which ability).\\\n    // TODO: Implement methods for suggesting new abilities based on user actions (integrates with EvolutionEngine).\\\n    // TODO: This module is the core of the Authority Forging (\u6b0a\u80fd\u935b\u9020) pillar.\\\
\\\n\\\n    // --- New: Realtime Subscription Methods ---\\\n    /**\\\n     * Subscribes to real-time updates from the user_actions table for the current user.\\\
     * @param userId The user ID to filter updates by. Required.\\\
     */\\\n    subscribeToUserActionsUpdates(userId: string): void {\\\n        console.log('[AuthorityForgingEngine] Subscribing to user_actions realtime updates for user:', userId);\\\
        this.context.loggingService?.logInfo('Subscribing to user_actions realtime updates', { userId });\\\
\\\n        if (this.userActionsSubscription) {\\\
            console.warn('[AuthorityForgingEngine] Already subscribed to user_actions updates. Unsubscribing existing.');\\\
            this.unsubscribeFromUserActionsUpdates();\\\
        }\\\n\\\n        // Subscribe to changes for the current user's actions\\\n        this.userActionsSubscription = this.supabase\\\n            .channel(`user_actions:user_id=eq.${userId}`) // Channel filtered by user_id\\\n            .on('postgres_changes', { event: '*', schema: 'public', table: 'user_actions', filter: `user_id=eq.${userId}` }, (payload) => {\\\
                console.log('[AuthorityForgingEngine] Realtime user_action change received:', payload);\\\
                const action = (payload.new || payload.old) as UserAction; // New data for INSERT/UPDATE, old for DELETE\\\
                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\\\
\\\n                // Publish an event via EventBus for other modules/UI to react\\\n                // Include the user_id in the event payload for filtering\\\n                this.context.eventBus?.publish(`user_action_${eventType.toLowerCase()}`, action, userId); // e.g., 'user_action_insert', 'user_action_update', 'user_action_delete'\\\n\\\n                // Also publish a generic 'user_action_recorded' event for inserts\\\n                if (eventType === 'INSERT') {\\\
                     this.context.eventBus?.publish('user_action_recorded', action, userId); // This event can be used for triggering abilities\\\n                }\\\n\\\n                // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly\\\n                // this.context.syncService?.handleRemoteDataChange('authorityForgingEngine', eventType, action, userId);\n\n            })\\\n            .subscribe((status, err) => {\\\n                 console.log('[AuthorityForgingEngine] User_actions subscription status:', status);\\\n                 if (status === 'CHANNEL_ERROR') {\\\n                     console.error('[AuthorityForgingEngine] User_actions subscription error:', err);\\\
                     this.context.loggingService?.logError('User_actions subscription error', { userId, error: err?.message });\\\
                 }\\\n            });\\\n    }\\\n\\\n    /**\\\n     * Unsubscribes from user_actions real-time updates.\\\n     */\\\n    unsubscribeFromUserActionsUpdates(): void {\\\
        if (this.userActionsSubscription) {\\\
            console.log('[AuthorityForgingEngine] Unsubscribing from user_actions realtime updates.');\\\
            this.context.loggingService?.logInfo('Unsubscribing from user_actions realtime updates');\\\
            this.supabase.removeChannel(this.userActionsSubscription);\\\
            this.userActionsSubscription = null;\\\
        }\\\n    }\\\n\\\n    /**\\\n     * Subscribes to real-time updates from the abilities table for the current user (user-owned and public).\\\n     * @param userId The user ID to filter updates by. Required.\\\
     */\\\n    subscribeToAbilitiesUpdates(userId: string): void {\\\
        console.log('[AuthorityForgingEngine] Subscribing to abilities realtime updates for user:', userId);\\\
        this.context.loggingService?.logInfo('Subscribing to abilities realtime updates', { userId });\\\
\\\n        if (this.abilitiesSubscription) {\\\
            console.warn('[AuthorityForgingEngine] Already subscribed to abilities updates. Unsubscribing existing.');\\\
            this.unsubscribeFromAbilitiesUpdates();\\\
        }\\\n\\\n        // Subscribe to changes where user_id is null (public) OR user_id is the current user.\\\n        // RLS should ensure user only receives updates for abilities they can see.\\\n        // We subscribe to all changes on the table and filter client-side for safety/simplicity in MVP.\\\n        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.\\\n        // Let's subscribe to a channel that should include both user and public data based on RLS.\\\
        // A simple channel name like the table name, relying entirely on RLS, is often used.\\\
        // Let's switch to subscribing to the table name channel and rely on RLS.\\\
\\\n        this.abilitiesSubscription = this.supabase\\\
            .channel('abilities') // Subscribe to all changes on the table (RLS will filter)\\\n            .on('postgres_changes', { event: '*', schema: 'public', table: 'abilities' }, (payload) => { // No filter here, rely on RLS\\\
                console.log('[AuthorityForgingEngine] Realtime ability change received:', payload);\\\
                const ability = payload.new as ForgedAbility; // New data for INSERT/UPDATE\\\
                const oldAbility = payload.old as ForgedAbility; // Old data for UPDATE/DELETE\\\
                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\\\
\\\n                // Check if the change is relevant to the current user (user-owned or public)\\\n                // RLS should handle this, but client-side check adds safety.\\\
                const relevantAbility = ability || oldAbility;\\\
                const isRelevant = relevantAbility?.user_id === userId || relevantAbility?.is_public === true;\\\
\\\n                if (isRelevant) {\\\
                    console.log(`[AuthorityForgingEngine] Processing relevant ability change (${eventType}): ${relevantAbility.id}`);\\\
\\\n                    if (eventType === 'INSERT') {\\\
                        // Attempt to register the new ability if its implementation is available client-side\\\
                        // This is the tricky part for user-defined/installed abilities.\\\
                        // For MVP, we assume public ability implementations are bundled and registered on startup.\\\
                        // User-installed abilities fetched from DB on login are also processed by loadAndRegisterUserAbilities.\\\
                        // This realtime insert event might be for a new public ability or a user ability installed elsewhere.\\\
                        // We need a way to get the implementation class here.\\\
                        // For MVP, we'll just log and rely on loadAndRegisterUserAbilities on login/startup for user abilities.\\\
                        // For public abilities, we assume they are already registered. Updates are handled below.\\\
                        console.warn(`[AuthorityForgingEngine] Realtime INSERT for ability ${ability.id}. Registration requires client-side implementation.`);\\\
                        this.context.loggingService?.logWarning(`Realtime INSERT for ability ${ability.id}. Registration requires client-side implementation.`, { abilityId: ability.id, userId });\\\
                        // If the implementation was available, we would do:\\\
                        // const clientImplementation = getImplementationForAbility(ability); // Hypothetical helper\\\
                        // if (clientImplementation) {\\\
                        //     this.registerAbility({ ...ability, implementation: clientImplementation });\\\
                        // }\\\
\\\n                    } else if (eventType === 'UPDATE') {\\\
                        // Update the definition and potentially the instance in the in-memory registry\\\
                        // For abilities, the 'implementation' is the script string, which is stored in the DB.\\\
                        // We need to update the in-memory representation if we cache it.\\\
                        // The ScriptSandbox's execute method fetches the ability definition dynamically.\\\
                        // So, updating the DB is sufficient. We just need to publish the event.\\\
                        console.log(`[AuthorityForgingEngine] Realtime UPDATE for ability ${ability.id}.`);\\\
                        // If the ability instance needed to be notified of config changes, call its updateConfiguration method\\\
                        // (Abilities don't have updateConfiguration like Runes in this model)\\\
\\\n                    } else if (eventType === 'DELETE') {\\\
                        // Remove the ability from any in-memory caches if needed (not applicable for MVP AuthorityForgingEngine)\\\
                        console.log(`[AuthorityForgingEngine] Realtime DELETE for ability ${oldAbility.id}.`);\\\
                    }\\\n\\\n                    // Publish a general ability event for other modules/UI to react\\\n                    this.context.eventBus?.publish(`ability_${eventType.toLowerCase()}`, ability || oldAbility, userId); // e.g., 'ability_insert', 'ability_update', 'ability_delete'\\\
\\\n                    // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly\\\n                    // this.context.syncService?.handleRemoteDataChange('authorityForgingEngine', eventType, ability || oldAbility, userId);\\\
\\\n                } else {\\\
                    console.log('[AuthorityForgingEngine] Received ability change not relevant to current user (filtered by RLS or client-side).');\\\
                }\\\n            })\\\
            .subscribe((status, err) => {\\\
                 console.log('[AuthorityForgingEngine] Abilities subscription status:', status);\\\
                 if (status === 'CHANNEL_ERROR') {\\\
                     console.error('[AuthorityForgingEngine] Abilities subscription error:', err);\\\
                     this.context.loggingService?.logError('Abilities subscription error', { userId, error: err?.message });\\\
                 }\\\n            });\\\
    }\\\n\\\n    /**\\\n     * Unsubscribes from abilities real-time updates.\\\n     */\\\n    unsubscribeFromAbilitiesUpdates(): void {\\\
        if (this.abilitiesSubscription) {\\\
            console.log('[AuthorityForgingEngine] Unsubscribing from abilities realtime updates.');\\\
            this.context.loggingService?.logInfo('Unsubscribing from abilities realtime updates');\\\
            this.supabase.removeChannel(this.abilitiesSubscription);\\\
            this.abilitiesSubscription = null;\\\
        }\\\n    }\\\n    // --- End New ---\\\n}\\\n```(__makeTemplateObject([""], [""]))(__makeTemplateObject([""], [""]));
