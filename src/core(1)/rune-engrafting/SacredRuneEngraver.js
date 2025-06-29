var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a, _b;
var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22;
var _this = this;
""(__makeTemplateObject(["typescript\n// src/core/rune-engrafting/SacredRuneEngraver.ts\n// \u8056\u7B26\u6587\u5320 (Sacred Rune Engraver) - \u6838\u5FC3\u6A21\u7D44\n// Manages the registration, discovery, and execution of external capabilities (Runes).\n// Acts as the system's interface to third-party services, devices, and plugins.\n// Corresponds to the Rune Engrafting pillar and the Omni-Agent Group concept.\n// Design Principle: Provides a standardized, secure, and extensible way to integrate external capabilities.\n// --- New: Upgraded to Sacred Rune Engraver - Maximized Capabilities ---\n// --- Modified: Implement executeRuneAction to call methods on Rune instances ---\n\n\nimport { SystemContext, Rune, RuneManifest, User } from '../../interfaces';\nimport { SupabaseClient } from '@supabase/supabase-js';\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n// import { SecurityService } from '../security/SecurityService'; // Dependency for user/permissions\n// import { ApiProxy } from '../../proxies/apiProxy'; // Dependency for API-based runes\n\n\n// Renamed class from RuneEngraftingCenter to SacredRuneEngraver\nexport class SacredRuneEngraver {\n    private context: SystemContext;\n    private supabase: SupabaseClient;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n    // private securityService: SecurityService; // Access via context\n    // private apiProxy = context.apiProxy; // Access via context\n\n    // --- New: In-memory registry for Rune implementations ---\n    // This map stores instances of the Rune implementation classes, keyed by Rune ID.\n    // These instances are created when runes are registered (e.g., on startup or installation).\n    // Store { definition: Rune, instance: any } to keep the definition with the instance.\n    private runeImplementations: Map<string, { definition: Rune, instance: any }> = new Map();\n    // --- End New ---\n\n    // --- New: Realtime Subscription ---\n    private runesSubscription: any | null = null;\n    // --- End New ---\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        // this.securityService = context.securityService;\n        // this.apiProxy = context.apiProxy;\n        console.log('SacredRuneEngraver initialized.'); // Updated log\n\n        // TODO: Load initial public runes and user's installed runes from persistence on startup (Supports Bidirectional Sync Domain)\n        // And register their implementations.\n        // This might involve fetching all abilities for the current user on auth state change.\n\n        // --- REMOVE: Initialize with some simulated flows for demo (now using DB) ---\n        // this.initializeSimulatedFlows();\n        // --- END REMOVE ---\n\n        // --- New: Set up Supabase Realtime subscriptions ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToRunesUpdates(user.id);\n                // On login, fetch and register user's runes\n                this.loadAndRegisterUserRunes(user.id).catch(err => console.error('Failed to load and register user runes on login:', err));\n            } else {\n                // On logout, clear user-specific runes from memory and unsubscribe\n                this.clearUserRunesFromMemory(this.context.currentUser?.id); // Pass the user ID who just logged out\n                this.unsubscribeFromRunesUpdates();\n            }\n        });\n        // --- End New ---\n    }\n\n    // --- New: Helper to load and register user's runes ---\n    private async loadAndRegisterUserRunes(userId: string): Promise<void> {\n        console.log("], ["typescript\n// src/core/rune-engrafting/SacredRuneEngraver.ts\n// \u8056\u7B26\u6587\u5320 (Sacred Rune Engraver) - \u6838\u5FC3\u6A21\u7D44\n// Manages the registration, discovery, and execution of external capabilities (Runes).\n// Acts as the system's interface to third-party services, devices, and plugins.\n// Corresponds to the Rune Engrafting pillar and the Omni-Agent Group concept.\n// Design Principle: Provides a standardized, secure, and extensible way to integrate external capabilities.\n// --- New: Upgraded to Sacred Rune Engraver - Maximized Capabilities ---\n// --- Modified: Implement executeRuneAction to call methods on Rune instances ---\n\n\nimport { SystemContext, Rune, RuneManifest, User } from '../../interfaces';\nimport { SupabaseClient } from '@supabase/supabase-js';\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n// import { SecurityService } from '../security/SecurityService'; // Dependency for user/permissions\n// import { ApiProxy } from '../../proxies/apiProxy'; // Dependency for API-based runes\n\n\n// Renamed class from RuneEngraftingCenter to SacredRuneEngraver\nexport class SacredRuneEngraver {\n    private context: SystemContext;\n    private supabase: SupabaseClient;\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n    // private securityService: SecurityService; // Access via context\n    // private apiProxy = context.apiProxy; // Access via context\n\n    // --- New: In-memory registry for Rune implementations ---\n    // This map stores instances of the Rune implementation classes, keyed by Rune ID.\n    // These instances are created when runes are registered (e.g., on startup or installation).\n    // Store { definition: Rune, instance: any } to keep the definition with the instance.\n    private runeImplementations: Map<string, { definition: Rune, instance: any }> = new Map();\n    // --- End New ---\n\n    // --- New: Realtime Subscription ---\n    private runesSubscription: any | null = null;\n    // --- End New ---\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        // this.securityService = context.securityService;\n        // this.apiProxy = context.apiProxy;\n        console.log('SacredRuneEngraver initialized.'); // Updated log\n\n        // TODO: Load initial public runes and user's installed runes from persistence on startup (Supports Bidirectional Sync Domain)\n        // And register their implementations.\n        // This might involve fetching all abilities for the current user on auth state change.\n\n        // --- REMOVE: Initialize with some simulated flows for demo (now using DB) ---\n        // this.initializeSimulatedFlows();\n        // --- END REMOVE ---\n\n        // --- New: Set up Supabase Realtime subscriptions ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToRunesUpdates(user.id);\n                // On login, fetch and register user's runes\n                this.loadAndRegisterUserRunes(user.id).catch(err => console.error('Failed to load and register user runes on login:', err));\n            } else {\n                // On logout, clear user-specific runes from memory and unsubscribe\n                this.clearUserRunesFromMemory(this.context.currentUser?.id); // Pass the user ID who just logged out\n                this.unsubscribeFromRunesUpdates();\n            }\n        });\n        // --- End New ---\n    }\n\n    // --- New: Helper to load and register user's runes ---\n    private async loadAndRegisterUserRunes(userId: string): Promise<void> {\n        console.log("]))[SacredRuneEngraver];
Loading;
and;
registering;
runes;
for (user; ; )
    : $;
{
    userId;
}
"); // Updated log\n        this.context.loggingService?.logInfo(";
Loading;
and;
registering;
runes;
for (user; $; { userId: userId }(__makeTemplateObject([", { userId });\n\n        try {\n            // Fetch user's runes (is_public = false AND user_id = userId)\n            const { data, error } = await this.supabase\n                .from('runes')\n                .select('*')\n                .eq('user_id', userId)\n                .eq('is_public', false); // Ensure we only load user-owned, non-public runes here\n\n            if (error) throw error;\n\n            const userRunes = data as Rune[];\n            console.log("], [", { userId });\n\n        try {\n            // Fetch user's runes (is_public = false AND user_id = userId)\n            const { data, error } = await this.supabase\n                .from('runes')\n                .select('*')\n                .eq('user_id', userId)\n                .eq('is_public', false); // Ensure we only load user-owned, non-public runes here\n\n            if (error) throw error;\n\n            const userRunes = data as Rune[];\n            console.log("]))[SacredRuneEngraver])
    Found;
$;
{
    userRunes.length;
}
user - owned;
runes.(__makeTemplateObject(["); // Updated log\n\n            // Register each user-owned rune\n            for (const rune of userRunes) {\n                try {\n                    // Note: The actual implementation class needs to be available client-side.\n                    // In a real plugin system, this would involve dynamically loading code.\n                    // For MVP, we assume the implementation class is already imported (e.g., in main.tsx).\n                    // We need a way to map the rune.id or rune.name to the actual class.\n                    // This mapping is currently done in main.tsx when creating the Rune definitions.\n                    // We need to pass the implementation class reference when registering.\n\n                    // Let's assume the rune object fetched from DB includes a reference\n                    // to its implementation class (this is NOT how DBs work, but for MVP simulation).\n                    // A better approach: have a client-side registry mapping rune IDs to classes.\n\n                    // TODO: Refactor Rune interface and main.tsx to pass client-side implementation reference.\n                    // For now, we'll just log a warning that user runes cannot be registered dynamically from DB fetch alone.\n                    // The actual registration of user runes needs to happen in main.tsx after fetching them.\n\n                    // If we had the client-side class available here (e.g., from a passed registry), we would do:\n                    // const clientImplementation = clientRuneRegistry.getImplementation(rune.id);\n                    // if (clientImplementation) {\n                    //     await this.registerRune({ ...rune, implementation: clientImplementation }); // Register the fetched rune with its implementation\n                    // } else {\n                    //      console.warn("], ["); // Updated log\n\n            // Register each user-owned rune\n            for (const rune of userRunes) {\n                try {\n                    // Note: The actual implementation class needs to be available client-side.\n                    // In a real plugin system, this would involve dynamically loading code.\n                    // For MVP, we assume the implementation class is already imported (e.g., in main.tsx).\n                    // We need a way to map the rune.id or rune.name to the actual class.\n                    // This mapping is currently done in main.tsx when creating the Rune definitions.\n                    // We need to pass the implementation class reference when registering.\n\n                    // Let's assume the rune object fetched from DB includes a reference\n                    // to its implementation class (this is NOT how DBs work, but for MVP simulation).\n                    // A better approach: have a client-side registry mapping rune IDs to classes.\n\n                    // TODO: Refactor Rune interface and main.tsx to pass client-side implementation reference.\n                    // For now, we'll just log a warning that user runes cannot be registered dynamically from DB fetch alone.\n                    // The actual registration of user runes needs to happen in main.tsx after fetching them.\n\n                    // If we had the client-side class available here (e.g., from a passed registry), we would do:\n                    // const clientImplementation = clientRuneRegistry.getImplementation(rune.id);\n                    // if (clientImplementation) {\n                    //     await this.registerRune({ ...rune, implementation: clientImplementation }); // Register the fetched rune with its implementation\n                    // } else {\n                    //      console.warn("]))[SacredRuneEngraver];
Client - side;
implementation;
not;
found;
for (user; rune; $) {
    rune.id;
}
($);
{
    rune.name;
}
Cannot;
register.(__makeTemplateObject(["); // Updated log\n                    //      this.context.loggingService?.logWarning("], ["); // Updated log\n                    //      this.context.loggingService?.logWarning("]));
Client - side;
implementation;
not;
found;
for (user; rune(__makeTemplateObject([", { runeId: rune.id, userId });\n                    // }\n\n                    // For MVP, let's just log that we would register them if we had the implementation class here.\n                    console.warn("], [", { runeId: rune.id, userId });\n                    // }\n\n                    // For MVP, let's just log that we would register them if we had the implementation class here.\n                    console.warn("]))[SacredRuneEngraver]; User)
    rune;
$;
{
    rune.id;
}
($);
{
    rune.name;
}
fetched;
from;
DB.Registration;
requires;
client - side;
implementation;
var default_1 = /** @class */ (function () {
    function default_1() {
    }
    return default_1;
}());
"); // Updated log\n                    this.context.loggingService?.logWarning(";
User;
rune;
fetched;
from;
DB, requires;
client - side;
implementation;
for (registration(__makeTemplateObject([", { runeId: rune.id, userId });\n\n\n                } catch (regError: any) {\n                    console.error("], [", { runeId: rune.id, userId });\n\n\n                } catch (regError: any) {\n                    console.error("]))[SacredRuneEngraver]; Error; processing)
    user;
rune;
$;
{
    rune.id;
}
for (registration; ; )
    : ", regError.message); // Updated log\n                    this.context.loggingService?.logError(";
Error;
processing;
user;
rune;
for (registration(__makeTemplateObject([", { runeId: rune.id, userId, error: regError.message });\n                }\n            }\n            console.log("], [", { runeId: rune.id, userId, error: regError.message });\n                }\n            }\n            console.log("]))[SacredRuneEngraver]; User; rune)
    loading;
and;
processing;
complete.(__makeTemplateObject(["); // Updated log\n\n        } catch (error: any) {\n            console.error("], ["); // Updated log\n\n        } catch (error: any) {\n            console.error("]))[SacredRuneEngraver];
Error;
loading;
user;
runes;
for (user; $; { userId: userId })
    : ", error.message); // Updated log\n            this.context.loggingService?.logError(";
Error;
loading;
user;
runes(__makeTemplateObject([", { userId, error: error.message });\n        }\n    }\n    // --- End New ---\n\n    // --- New: Helper to clear user-specific runes from memory ---\n    private clearUserRunesFromMemory(userId?: string | null): void {\n        if (!userId) {\n             console.warn('[SacredRuneEngraver] Cannot clear user runes: User ID is missing.'); // Updated log\n             return;\n        }\n        console.log("], [", { userId, error: error.message });\n        }\n    }\n    // --- End New ---\n\n    // --- New: Helper to clear user-specific runes from memory ---\n    private clearUserRunesFromMemory(userId?: string | null): void {\n        if (!userId) {\n             console.warn('[SacredRuneEngraver] Cannot clear user runes: User ID is missing.'); // Updated log\n             return;\n        }\n        console.log("]))[SacredRuneEngraver];
Clearing;
runes;
for (user; ; )
    : $;
{
    userId;
}
from;
memory.(__makeTemplateObject(["); // Updated log\n        // Iterate through registered runes and remove those owned by the specified user\n        const runeIdsToRemove: string[] = [];\n        this.runeImplementations.forEach((entry, runeId) => {\n            if (entry.definition.user_id === userId) {\n                runeIdsToRemove.push(runeId);\n            }\n        });\n\n        runeIdsToRemove.forEach(runeId => {\n            this.runeImplementations.delete(runeId);\n            console.log("], ["); // Updated log\n        // Iterate through registered runes and remove those owned by the specified user\n        const runeIdsToRemove: string[] = [];\n        this.runeImplementations.forEach((entry, runeId) => {\n            if (entry.definition.user_id === userId) {\n                runeIdsToRemove.push(runeId);\n            }\n        });\n\n        runeIdsToRemove.forEach(runeId => {\n            this.runeImplementations.delete(runeId);\n            console.log("]))[SacredRuneEngraver];
Cleared;
user;
rune;
$;
{
    runeId;
}
from;
memory.(__makeTemplateObject(["); // Updated log\n        });\n        console.log("], ["); // Updated log\n        });\n        console.log("]))[SacredRuneEngraver];
Cleared;
$;
{
    runeIdsToRemove.length;
}
user;
runes;
from;
memory.(__makeTemplateObject(["); // Updated log\n    }\n    // --- End New ---\n\n\n    /**\n     * Registers a Rune implementation in the in-memory registry.\n     * This is typically called on application startup for built-in/public runes,\n     * or after a user installs a new rune.\n     * @param rune The Rune definition object (including implementation reference). Required.\n     * @returns Promise<void>\n     */\n    async registerRune(rune: Rune): Promise<void> {\n        console.log("], ["); // Updated log\n    }\n    // --- End New ---\n\n\n    /**\n     * Registers a Rune implementation in the in-memory registry.\n     * This is typically called on application startup for built-in/public runes,\n     * or after a user installs a new rune.\n     * @param rune The Rune definition object (including implementation reference). Required.\n     * @returns Promise<void>\n     */\n    async registerRune(rune: Rune): Promise<void> {\n        console.log("]))[SacredRuneEngraver];
Registering;
rune: $;
{
    rune.name;
}
($);
{
    rune.id;
}
"); // Updated log\n        this.context.loggingService?.logInfo(";
Registering;
rune: $;
{
    rune.name;
}
", { runeId: rune.id, userId: rune.user_id });\n\n        if (!rune.id || !rune.implementation) {\n            console.error('[SacredRuneEngraver] Cannot register rune: ID and implementation are required.'); // Updated log\n            this.context.loggingService?.logError('Cannot register rune: Missing ID or implementation.', { rune });\n            throw new Error('Rune ID and implementation are required for registration.');\n        }\n\n        if (this.runeImplementations.has(rune.id)) {\n            console.warn("[SacredRuneEngraver];
Rune;
$;
{
    rune.id;
}
is;
already;
registered.Overwriting.(__makeTemplateObject(["); // Updated log\n            this.context.loggingService?.logWarning("], ["); // Updated log\n            this.context.loggingService?.logWarning("]));
Rune;
already;
registered: $;
{
    rune.id;
}
", { runeId: rune.id });\n        }\n\n        try {\n            // Create an instance of the Rune implementation class\n            // Pass the system context and the rune definition to the constructor\n            const runeInstance = new rune.implementation(this.context, rune);\n\n            // Store the instance and the definition\n            this.runeImplementations.set(rune.id, { definition: rune, instance: runeInstance });\n\n            console.log("[SacredRuneEngraver];
Rune;
$;
{
    rune.id;
}
registered;
successfully.(__makeTemplateObject(["); // Updated log\n            // Publish a 'rune_registered' event (part of Six Styles/EventBus - call context.eventBus.publish)\n            this.context.eventBus?.publish('rune_registered', rune, rune.user_id); // Include userId in event\n\n        } catch (error: any) {\n            console.error("], ["); // Updated log\n            // Publish a 'rune_registered' event (part of Six Styles/EventBus - call context.eventBus.publish)\n            this.context.eventBus?.publish('rune_registered', rune, rune.user_id); // Include userId in event\n\n        } catch (error: any) {\n            console.error("]))[SacredRuneEngraver];
Error;
registering;
rune;
$;
{
    rune.id;
}
", error.message); // Updated log\n            this.context.loggingService?.logError(";
Error;
registering;
rune(__makeTemplateObject([", { runeId: rune.id, userId: rune.user_id, error: error.message });\n            throw error; // Re-throw the error\n        }\n    }\n\n    /**\n     * Retrieves a list of available Rune definitions for a specific user.\n     * Includes public runes and runes owned by the user.\n     * @param typeFilter Optional: Filter by rune type.\n     * @param userId The user ID to fetch user-owned runes for. Required.\n     * @returns Promise<Rune[]> An array of Rune definition objects.\n     */\n    async listRunes(typeFilter?: Rune['type'], userId?: string): Promise<Rune[]> {\n        console.log('Retrieving rune definitions from Supabase for user:', userId, 'type filter:', typeFilter || 'all');\n        this.context.loggingService?.logInfo('Attempting to fetch rune definitions', { userId, typeFilter });\n\n        // Allow fetching public runes without a user ID, but log a warning\n        if (!userId) {\n             console.warn('[SacredRuneEngraver] Fetching rune definitions without user ID. Will only retrieve public runes.'); // Updated log\n             this.context.loggingService?.logWarning('Fetching rune definitions without user ID. Will only retrieve public runes.');\n        }\n\n        try {\n            // Fetch runes from Supabase, filtered by user_id OR is_public\n            let dbQuery = this.supabase\n                .from('runes')\n                .select('*'); // Select all columns\n\n            if (userId) {\n                 // Fetch user's own runes OR public runes\n                 dbQuery = dbQuery.or("], [", { runeId: rune.id, userId: rune.user_id, error: error.message });\n            throw error; // Re-throw the error\n        }\n    }\n\n    /**\n     * Retrieves a list of available Rune definitions for a specific user.\n     * Includes public runes and runes owned by the user.\n     * @param typeFilter Optional: Filter by rune type.\n     * @param userId The user ID to fetch user-owned runes for. Required.\n     * @returns Promise<Rune[]> An array of Rune definition objects.\n     */\n    async listRunes(typeFilter?: Rune['type'], userId?: string): Promise<Rune[]> {\n        console.log('Retrieving rune definitions from Supabase for user:', userId, 'type filter:', typeFilter || 'all');\n        this.context.loggingService?.logInfo('Attempting to fetch rune definitions', { userId, typeFilter });\n\n        // Allow fetching public runes without a user ID, but log a warning\n        if (!userId) {\n             console.warn('[SacredRuneEngraver] Fetching rune definitions without user ID. Will only retrieve public runes.'); // Updated log\n             this.context.loggingService?.logWarning('Fetching rune definitions without user ID. Will only retrieve public runes.');\n        }\n\n        try {\n            // Fetch runes from Supabase, filtered by user_id OR is_public\n            let dbQuery = this.supabase\n                .from('runes')\n                .select('*'); // Select all columns\n\n            if (userId) {\n                 // Fetch user's own runes OR public runes\n                 dbQuery = dbQuery.or("]));
user_id.eq.$;
{
    userId;
}
is_public.eq.true(__makeTemplateObject([");\n            } else {\n                 // If no user ID, only fetch public abilities\n                 dbQuery = dbQuery.eq('is_public', true);\n            }\n\n\n            if (typeFilter) {\n                dbQuery = dbQuery.eq('type', typeFilter);\n            }\n\n            dbQuery = dbQuery.order('name', { ascending: true } as any); // Order by name\n\n\n            const { data, error } = await dbQuery;\n\n            if (error) { throw error; }\n\n            const runes = data as Rune[];\n            console.log("], [");\n            } else {\n                 // If no user ID, only fetch public abilities\n                 dbQuery = dbQuery.eq('is_public', true);\n            }\n\n\n            if (typeFilter) {\n                dbQuery = dbQuery.eq('type', typeFilter);\n            }\n\n            dbQuery = dbQuery.order('name', { ascending: true } as any); // Order by name\n\n\n            const { data, error } = await dbQuery;\n\n            if (error) { throw error; }\n\n            const runes = data as Rune[];\n            console.log("]));
Fetched;
$;
{
    data.length;
}
rune;
definitions;
for (user; $; { userId: userId } || 'public')
    ;
");\n            this.context.loggingService?.logInfo(";
Fetched;
$;
{
    data.length;
}
rune;
definitions;
successfully.(__makeTemplateObject([", { userId });\n\n            // Note: The fetched Rune objects from the DB do NOT contain the 'implementation' class reference.\n            // This reference exists only client-side in the code that defines/registers the runes (e.g., main.tsx).\n            // When returning the list, we should ideally merge the DB definition with the in-memory implementation reference.\n            // For MVP, we'll skip this detailed merge here and just return the DB definition.\n            // The "], [", { userId });\n\n            // Note: The fetched Rune objects from the DB do NOT contain the 'implementation' class reference.\n            // This reference exists only client-side in the code that defines/registers the runes (e.g., main.tsx).\n            // When returning the list, we should ideally merge the DB definition with the in-memory implementation reference.\n            // For MVP, we'll skip this detailed merge here and just return the DB definition.\n            // The "]));
executeRuneAction(__makeTemplateObject([" method will need to look up the implementation by ID.\n\n            // To make the returned Rune objects usable for execution, we should attach the implementation reference.\n            // This requires iterating through the fetched runes and finding their corresponding entry in "], [" method will need to look up the implementation by ID.\n\n            // To make the returned Rune objects usable for execution, we should attach the implementation reference.\n            // This requires iterating through the fetched runes and finding their corresponding entry in "]));
runeImplementations(__makeTemplateObject([".\n            const usableRunes = runes.map(rune => {\n                 const registered = this.runeImplementations.get(rune.id);\n                 if (registered) {\n                     // Return the fetched definition with the attached implementation reference\n                     // Ensure we don't overwrite DB data with potentially stale in-memory definition data\n                     // Use the fetched rune data and add the implementation\n                     return { ...rune, implementation: registered.definition.implementation };\n                 }\n                 // If a rune exists in DB but not registered in memory, return it without implementation\n                 // This might happen for user runes if the client-side implementation wasn't loaded/registered correctly.\n                 console.warn("], [".\n            const usableRunes = runes.map(rune => {\n                 const registered = this.runeImplementations.get(rune.id);\n                 if (registered) {\n                     // Return the fetched definition with the attached implementation reference\n                     // Ensure we don't overwrite DB data with potentially stale in-memory definition data\n                     // Use the fetched rune data and add the implementation\n                     return { ...rune, implementation: registered.definition.implementation };\n                 }\n                 // If a rune exists in DB but not registered in memory, return it without implementation\n                 // This might happen for user runes if the client-side implementation wasn't loaded/registered correctly.\n                 console.warn("]))[SacredRuneEngraver];
Rune;
$;
{
    rune.id;
}
found in DB;
but;
not;
registered in memory.Cannot;
attach;
implementation.(__makeTemplateObject(["); // Updated log\n                 return rune; // Return DB definition without implementation\n            });\n\n\n            return usableRunes;\n\n        } catch (error: any) {\n            console.error('Error fetching rune definitions from Supabase:', error);\n            this.context.loggingService?.logError('Failed to fetch rune definitions', { userId: userId, error: error.message });\n            throw error; // Re-throw the error\n        }\n    }\n\n    /**\n     * Executes a specific action on a registered Rune.\n     * This is a core part of the \"Act\" step in the Six Styles.\n     * @param runeId The ID of the Rune. Required.\n     * @param actionName The name of the action/method to execute on the Rune. Required.\n     * @param params Optional parameters for the action.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The result of the Rune action execution.\n     */\n    async executeRuneAction(runeId: string, actionName: string, params?: any, userId?: string): Promise<any> {\n        console.log("], ["); // Updated log\n                 return rune; // Return DB definition without implementation\n            });\n\n\n            return usableRunes;\n\n        } catch (error: any) {\n            console.error('Error fetching rune definitions from Supabase:', error);\n            this.context.loggingService?.logError('Failed to fetch rune definitions', { userId: userId, error: error.message });\n            throw error; // Re-throw the error\n        }\n    }\n\n    /**\n     * Executes a specific action on a registered Rune.\n     * This is a core part of the \"Act\" step in the Six Styles.\n     * @param runeId The ID of the Rune. Required.\n     * @param actionName The name of the action/method to execute on the Rune. Required.\n     * @param params Optional parameters for the action.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The result of the Rune action execution.\n     */\n    async executeRuneAction(runeId: string, actionName: string, params?: any, userId?: string): Promise<any> {\n        console.log("]))[SacredRuneEngraver];
Attempting;
to;
execute;
action;
"${actionName}\" on rune \"${runeId}\" for user: ${userId}`); // Updated log;
(_c = this.context.loggingService) === null || _c === void 0 ? void 0 : _c.logInfo("Executing rune action: ".concat(runeId, ".").concat(actionName), { runeId: runeId, actionName: actionName, userId: userId, params: params });
if (!userId) {
    console.error('[SacredRuneEngraver] Cannot execute rune action: User ID is required.'); // Updated log
    (_d = this.context.loggingService) === null || _d === void 0 ? void 0 : _d.logError('Cannot execute rune action: User ID is required.');
    throw new Error('User ID is required to execute a rune action.');
}
// 1. Find the registered Rune implementation
var registeredRune = this.runeImplementations.get(runeId);
if (!registeredRune) {
    console.error("[SacredRuneEngraver] Rune \"".concat(runeId, "\" not found in registry.")); // Updated log
    (_e = this.context.loggingService) === null || _e === void 0 ? void 0 : _e.logError("Rune not found in registry: ".concat(runeId), { runeId: runeId, actionName: actionName, userId: userId });
    throw new Error("Rune \"".concat(runeId, "\" not found."));
}
var runeInstance = registeredRune.instance;
var runeDefinition = registeredRune.definition;
// 2. Check if the requested action exists in the Rune's manifest
var actionDefinition = (_g = (_f = runeDefinition.manifest) === null || _f === void 0 ? void 0 : _f.methods) === null || _g === void 0 ? void 0 : _g[actionName];
if (!actionDefinition) {
    console.error("[SacredRuneEngraver] Action \"".concat(actionName, "\" not found in manifest for rune \"").concat(runeId, "\".")); // Updated log
    (_h = this.context.loggingService) === null || _h === void 0 ? void 0 : _h.logError("Rune action not found in manifest: ".concat(runeId, ".").concat(actionName), { runeId: runeId, actionName: actionName, userId: userId });
    throw new Error("Action \"".concat(actionName, "\" not found for Rune \"").concat(runeDefinition.name, "\"."));
}
// 3. Check if the action exists on the Rune instance and is a function
var runeAction = runeInstance[actionName];
if (typeof runeAction !== 'function') {
    console.error("[SacredRuneEngraver] Action \"".concat(actionName, "\" on rune \"").concat(runeId, "\" is not a callable function.")); // Updated log
    (_j = this.context.loggingService) === null || _j === void 0 ? void 0 : _j.logError("Rune action is not a function: ".concat(runeId, ".").concat(actionName), { runeId: runeId, actionName: actionName, userId: userId });
    throw new Error("Action \"".concat(actionName, "\" is not callable for Rune \"").concat(runeDefinition.name, "\"."));
}
// 4. Perform permission checks (Placeholder)
// In a real system, you'd check if the user has permission to execute this rune/action.
// This might involve checking user roles, rune permissions, or context.
// For MVP, assume any authenticated user can execute any registered rune action.
// if (!this.context.securityService?.hasPermission(`execute:rune:${runeId}:${actionName}`, { userId })) {
//     console.warn(`[SacredRuneEngraver] Permission denied for user ${userId} to execute ${runeId}.${actionName}.`); // Updated log
//     this.context.loggingService?.logWarning(`Permission denied for rune action`, { runeId, actionName, userId });
//     throw new Error('Permission denied to execute this rune action.');
// }
// Ensure the rune is enabled
if (!runeDefinition.is_enabled) {
    console.warn("[SacredRuneEngraver] Rune ".concat(runeId, " is disabled.")); // Updated log
    (_k = this.context.loggingService) === null || _k === void 0 ? void 0 : _k.logWarning("Attempted to execute disabled rune", { runeId: runeId, actionName: actionName, userId: userId });
    throw new Error("Rune \"".concat(runeDefinition.name, "\" is disabled."));
}
// 5. Validate parameters against the manifest (Optional but Recommended)
// This is complex and depends on the parameter schema definition in the manifest.
// For MVP, we'll skip detailed parameter validation here and rely on the Rune implementation to handle it.
// TODO: Implement parameter validation based on actionDefinition.parameters schema.
// 6. Execute the Rune action
console.log("[SacredRuneEngraver] Executing ".concat(runeDefinition.name, ".").concat(actionName, "...")); // Updated log
(_l = this.context.loggingService) === null || _l === void 0 ? void 0 : _l.logInfo("Executing rune action: ".concat(runeId, ".").concat(actionName), { runeId: runeId, actionName: actionName, userId: userId });
try {
    // Call the method on the Rune instance, passing parameters and user ID
    var result = await runeAction.call(runeInstance, params, userId); // Use .call() to ensure 'this' context is the rune instance
    console.log("[SacredRuneEngraver] Rune action \"".concat(actionName, "\" on \"").concat(runeId, "\" executed successfully. Result:"), result); // Updated log
    (_m = this.context.loggingService) === null || _m === void 0 ? void 0 : _m.logInfo("Rune action executed successfully: ".concat(runeId, ".").concat(actionName), { runeId: runeId, actionName: actionName, userId: userId, result: result });
    // Publish a 'rune_action_executed' event (part of Six Styles/EventBus)
    (_o = this.context.eventBus) === null || _o === void 0 ? void 0 : _o.publish('rune_action_executed', { runeId: runeId, actionName: actionName, params: params, result: result, userId: userId }, userId); // Include userId in event
    // TODO: Update last_used_timestamp for the rune in Supabase (Supports AARRR - Retention)
    // This should be done asynchronously.
    this.updateRuneLastUsedTimestamp(runeId, userId).catch(function (err) { return console.error('Failed to update rune last_used_timestamp:', err); });
    return result; // Return the result from the Rune action
}
catch (error) {
    console.error("[SacredRuneEngraver] Error executing rune action \"".concat(actionName, "\" on \"").concat(runeId, "\":"), error.message); // Updated log
    (_p = this.context.loggingService) === null || _p === void 0 ? void 0 : _p.logError("Error executing rune action: ".concat(runeId, ".").concat(actionName), { runeId: runeId, actionName: actionName, userId: userId, error: error.message });
    // Publish a 'rune_action_failed' event (part of Six Styles/EventBus)
    (_q = this.context.eventBus) === null || _q === void 0 ? void 0 : _q.publish('rune_action_failed', { runeId: runeId, actionName: actionName, params: params, error: error.message, userId: userId }, userId); // Include userId in event
    // TODO: Trigger EvolutionEngine to handle rune failure for learning (call context.evolutionEngine.handleRuneFailureForEvolution)
    // This requires EvolutionEngine to have a method for this.
    throw error; // Re-throw the error after logging and event publishing
}
async;
updateRuneLastUsedTimestamp(runeId, string, userId ?  : string);
Promise < void  > {
    // Only update if userId is provided (user-specific or public rune used by a user)
    if: function (, userId) { },
    return: ,
    try: {
        // Update the last_used_timestamp in Supabase for the specific rune and user
        // Note: This assumes a user might have their own instance of a public rune,
        // or we track usage of public runes per user.
        // For simplicity, let's update the user's specific rune record if it exists,
        // or the public rune record if it's a public rune being used.
        // This requires checking if the rune is public or user-owned.
        // Fetch the rune definition first to check ownership/public status
        const: runeDefinition = (_r = this.runeImplementations.get(runeId)) === null || _r === void 0 ? void 0 : _r.definition,
        if: function (, runeDefinition) {
            console.warn("[SacredRuneEngraver] Rune definition not found in memory for timestamp update: ".concat(runeId)); // Updated log
            return; // Cannot update if definition is not in memory
        },
        let: let,
        query: query,
        if: function (runeDefinition) { },
        : .is_public
    }
};
{
    // Update the public rune record
    query = query.eq('id', runeId).eq('is_public', true);
}
if (runeDefinition.user_id === userId) {
    // Update the user's specific rune record
    query = query.eq('id', runeId).eq('user_id', userId).eq('is_public', false);
}
else {
    console.warn("[SacredRuneEngraver] Attempted to update timestamp for rune ".concat(runeId, " not owned by user ").concat(userId, " and not public.")); // Updated log
    return; // Cannot update if not public or user-owned
}
var error = (await query).error;
if (error) {
    console.error("[SacredRuneEngraver] Error updating rune ".concat(runeId, " last_used_timestamp:"), error.message); // Updated log
    (_s = this.context.loggingService) === null || _s === void 0 ? void 0 : _s.logError("Failed to update rune last_used_timestamp", { runeId: runeId, userId: userId, error: error.message });
}
else {
    // console.log(`[SacredRuneEngraver] Rune ${runeId} last_used_timestamp updated.`); // Avoid excessive logging
}
try { }
catch (error) {
    console.error("[SacredRuneEngraver] Unexpected error updating rune ".concat(runeId, " last_used_timestamp:"), error.message); // Updated log
    (_t = this.context.loggingService) === null || _t === void 0 ? void 0 : _t.logError("Unexpected error updating rune last_used_timestamp", { runeId: runeId, userId: userId, error: error.message });
}
// --- End New ---
// TODO: Implement methods for managing rune permissions (who can execute which rune/action).
// TODO: Implement a secure execution environment for script-based runes (integrates with ScriptSandbox).
// TODO: Implement dynamic loading of rune implementations (complex, might involve WebAssembly or isolated processes).
// TODO: This module is the core of the Rune Engrafting (符文嵌入) pillar and the Omni-Agent Group concept.
// --- New: Rune Installation/Uninstallation ---
/**
 * Installs a public rune for a specific user.
 * Creates a user-specific copy of the public rune definition in the database.
 * Checks user's rune capacity.
 * @param publicRuneId The ID of the public rune to install. Required.
 * @param userId The user ID installing the rune. Required.
 * @returns Promise<Rune | null> The newly created user-specific Rune or null if installation failed (e.g., already installed, insufficient capacity).
 */
async;
installRune(publicRuneId, string, userId, string);
Promise < Rune | null > {
    console: console,
    : .log("[SacredRuneEngraver] Attempting to install public rune ".concat(publicRuneId, " for user ").concat(userId, "...")), // Updated log
    this: (_u = .context.loggingService) === null || _u === void 0 ? void 0 : _u.logInfo("Attempting to install public rune ".concat(publicRuneId), { publicRuneId: publicRuneId, userId: userId }),
    if: function (, userId) { }
} || !publicRuneId;
{
    console.error('[SacredRuneEngraver] Cannot install rune: User ID and public Rune ID are required.'); // Updated log
    (_v = this.context.loggingService) === null || _v === void 0 ? void 0 : _v.logError('Cannot install rune: Missing required fields.', { publicRuneId: publicRuneId, userId: userId });
    throw new Error('User ID and public Rune ID are required for installation.');
}
try {
    // 1. Fetch the public rune definition
    var _23 = await this.supabase
        .from('runes')
        .select('*')
        .eq('id', publicRuneId)
        .eq('is_public', true)
        .single(), publicRuneData = _23.data, fetchError = _23.error;
    if (fetchError)
        throw fetchError;
    if (!publicRuneData) {
        console.warn("[SacredRuneEngraver] Public rune ".concat(publicRuneId, " not found.")); // Updated log
        (_w = this.context.loggingService) === null || _w === void 0 ? void 0 : _w.logWarning("Public rune not found for installation: ".concat(publicRuneId), { publicRuneId: publicRuneId, userId: userId });
        throw new Error("Public rune \"".concat(publicRuneId, "\" not found."));
    }
    var publicRune_1 = publicRuneData;
    // 2. Check if the user already has a rune with the same name (prevent duplicate installations by name)
    var existingUserRunes = await this.listRunes(undefined, userId); // Fetch user's runes
    if (existingUserRunes.some(function (rune) { return rune.name === publicRune_1.name && rune.user_id === userId; })) {
        console.warn("[SacredRuneEngraver] User ".concat(userId, " already has a rune named \"").concat(publicRune_1.name, "\". Skipping installation.")); // Updated log
        (_x = this.context.loggingService) === null || _x === void 0 ? void 0 : _x.logWarning("User already has rune named \"".concat(publicRune_1.name, "\". Skipping installation."), { publicRuneId: publicRuneId, userId: userId });
        // Optionally return the existing user rune
        return existingUserRunes.find(function (rune) { return rune.name === publicRune_1.name && rune.user_id === userId; }) || null;
    }
    // 3. Check user's rune capacity
    var userCapacity = await this.getUserRuneCapacity(userId);
    if (!userCapacity) {
        console.error('[SacredRuneEngraver] Could not retrieve user rune capacity.'); // Updated log
        (_y = this.context.loggingService) === null || _y === void 0 ? void 0 : _y.logError('Could not retrieve user rune capacity for installation.', { userId: userId });
        throw new Error('Could not retrieve user capacity.');
    }
    var requiredCapacity = publicRune_1.capacity_cost || 1; // Default cost is 1
    if (userCapacity.currentCost + requiredCapacity > userCapacity.capacity) {
        console.warn("[SacredRuneEngraver] User ".concat(userId, " has insufficient rune capacity (").concat(userCapacity.currentCost, "/").concat(userCapacity.capacity, "). Required: ").concat(requiredCapacity, ".")); // Updated log
        (_z = this.context.loggingService) === null || _z === void 0 ? void 0 : _z.logWarning("Insufficient rune capacity for installation", { publicRuneId: publicRuneId, userId: userId, current: userCapacity.currentCost, capacity: userCapacity.capacity, required: requiredCapacity });
        throw new Error("Insufficient rune capacity. Required: ".concat(requiredCapacity, ", Available: ").concat(userCapacity.capacity - userCapacity.currentCost, "."));
    }
    // 4. Create a user-specific copy of the rune definition in the database
    var newUserRuneData = {
        name: publicRune_1.name,
        description: publicRune_1.description,
        type: publicRune_1.type,
        manifest: publicRune_1.manifest, // Copy the manifest
        // implementation: publicRune.implementation, // Do NOT copy implementation details to DB
        version: publicRune_1.version,
        author_id: publicRune_1.author_id, // Keep original author
        is_enabled: true, // Enabled by default on installation
        configuration: publicRune_1.configuration || {}, // Copy default configuration or start empty
        user_id: userId, // Link to the installing user
        is_public: false, // This is a user's private copy
        capacity_cost: publicRune_1.capacity_cost, // Copy the capacity cost
    };
    var _24 = await this.supabase
        .from('runes')
        .insert([newUserRuneData])
        .select() // Select the inserted data to get the generated ID and timestamp
        .single(), newUserRuneResult = _24.data, insertError = _24.error; // Expecting a single record back
    if (insertError)
        throw insertError;
    var newUserRune = newUserRuneResult;
    console.log('User rune installed:', newUserRune.id, '-', newUserRune.name, 'for user:', newUserRune.user_id);
    // 5. Register the new user-specific rune implementation in memory
    // We need the actual implementation class here. This is the tricky part.
    // The `publicRune` object fetched from DB doesn't contain the class.
    // We need a client-side mapping from publicRuneId or newUserRune.name to the class.
    // Let's assume the `runeImplementations` map already contains the public rune definition with the class.
    var publicRuneRegistration = this.runeImplementations.get(publicRuneId);
    if ((_0 = publicRuneRegistration === null || publicRuneRegistration === void 0 ? void 0 : publicRuneRegistration.definition) === null || _0 === void 0 ? void 0 : _0.implementation) {
        // Create a new Rune object for registration, using the DB data but attaching the client-side implementation
        var runeToRegister = __assign(__assign({}, newUserRune), { implementation: publicRuneRegistration.definition.implementation });
        await this.registerRune(runeToRegister); // Register the user's instance
    }
    else {
        console.error("[SacredRuneEngraver] Could not find client-side implementation for public rune ".concat(publicRuneId, ". User rune ").concat(newUserRune.id, " installed in DB but not registered in memory.")); // Updated log
        (_1 = this.context.loggingService) === null || _1 === void 0 ? void 0 : _1.logError("Could not find client-side implementation for public rune", { publicRuneId: publicRuneId, newUserRuneId: newUserRune.id, userId: userId });
        // The user rune exists in DB, but won't be executable until the app restarts or the implementation is otherwise loaded/registered.
        // Decide how to handle this - maybe mark the user rune as 'unregistered' or 'needs_client_update'?
        // For MVP, just log the error and return the DB object.
    }
    // 6. Publish a 'rune_installed' event
    (_2 = this.context.eventBus) === null || _2 === void 0 ? void 0 : _2.publish('rune_installed', newUserRune, userId); // Include userId in event
    (_3 = this.context.loggingService) === null || _3 === void 0 ? void 0 : _3.logInfo("Rune installed: ".concat(newUserRune.id), { name: newUserRune.name, userId: userId });
    return newUserRune;
}
catch (error) {
    console.error('Failed to install rune:', error);
    (_4 = this.context.loggingService) === null || _4 === void 0 ? void 0 : _4.logError('Failed to install rune', { publicRuneId: publicRuneId, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Uninstalls a user-specific rune.
 * Deletes the user's copy of the rune definition from the database.
 * @param userRuneId The ID of the user-specific rune to uninstall. Required.
 * @param userId The user ID uninstalling the rune. Required.
 * @returns Promise<boolean> True if uninstallation was successful, false otherwise.
 */
async;
uninstallRune(userRuneId, string, userId, string);
Promise < boolean > {
    console: console,
    : .log("[SacredRuneEngraver] Attempting to uninstall user rune ".concat(userRuneId, " for user ").concat(userId, "...")), // Updated log
    this: (_5 = .context.loggingService) === null || _5 === void 0 ? void 0 : _5.logInfo("Attempting to uninstall user rune ".concat(userRuneId), { userRuneId: userRuneId, userId: userId }),
    if: function (, userId) { }
} || !userRuneId;
{
    console.error('[SacredRuneEngraver] Cannot uninstall rune: User ID and user Rune ID are required.'); // Updated log
    (_6 = this.context.loggingService) === null || _6 === void 0 ? void 0 : _6.logError('Cannot uninstall rune: Missing required fields.', { userRuneId: userRuneId, userId: userId });
    throw new Error('User ID and user Rune ID are required for uninstallation.');
}
try {
    // 1. Delete the user's rune definition from the database
    // Filter by ID and user_id to ensure ownership and that it's not a public rune
    var _25 = await this.supabase
        .from('runes')
        .delete()
        .eq('id', userRuneId)
        .eq('user_id', userId)
        .eq('is_public', false) // Ensure we only delete user-owned, non-public runes
        .select('id', { count: 'exact' }), count = _25.count, error_1 = _25.error; // Select count to check if a row was deleted
    if (error_1)
        throw error_1;
    var deleted = count !== null && count > 0; // Check if count is greater than 0
    if (deleted) {
        console.log("User rune ".concat(userRuneId, " deleted from Supabase."));
        (_7 = this.context.loggingService) === null || _7 === void 0 ? void 0 : _7.logInfo("User rune deleted from DB: ".concat(userRuneId), { userRuneId: userRuneId, userId: userId });
        // 2. Remove the rune implementation from the in-memory registry
        if (this.runeImplementations.has(userRuneId)) {
            this.runeImplementations.delete(userRuneId);
            console.log("[SacredRuneEngraver] User rune ".concat(userRuneId, " removed from memory registry.")); // Updated log
        }
        else {
            console.warn("[SacredRuneEngraver] User rune ".concat(userRuneId, " not found in memory registry during uninstallation.")); // Updated log
        }
        // 3. Publish a 'rune_uninstalled' event
        (_8 = this.context.eventBus) === null || _8 === void 0 ? void 0 : _8.publish('rune_uninstalled', { runeId: userRuneId, userId: userId }, userId); // Include userId in event
        (_9 = this.context.loggingService) === null || _9 === void 0 ? void 0 : _9.logInfo("User rune uninstalled: ".concat(userRuneId), { userRuneId: userRuneId, userId: userId });
    }
    else {
        console.warn("[SacredRuneEngraver] User rune ".concat(userRuneId, " not found for deletion or user mismatch.")); // Updated log
        (_10 = this.context.loggingService) === null || _10 === void 0 ? void 0 : _10.logWarning("User rune not found for uninstallation: ".concat(userRuneId), { userRuneId: userRuneId, userId: userId });
    }
    return deleted;
}
catch (error) {
    console.error("[SacredRuneEngraver] Failed to uninstall user rune ".concat(userRuneId, ":"), error);
    (_11 = this.context.loggingService) === null || _11 === void 0 ? void 0 : _11.logError("Failed to uninstall user rune ".concat(userRuneId), { userRuneId: userRuneId, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Updates the configuration of a user-specific rune.
 * @param userRuneId The ID of the user-specific rune. Required.
 * @param newConfig The new configuration object. Required.
 * @param userId The user ID for verification. Required.
 * @returns Promise<Rune | undefined> The updated Rune or undefined if not found or user mismatch.
 */
async;
updateRuneConfiguration(userRuneId, string, newConfig, any, userId, string);
Promise < Rune | undefined > {
    console: console,
    : .log("[SacredRuneEngraver] Attempting to update configuration for user rune ".concat(userRuneId, " for user ").concat(userId, "...")), // Updated log
    this: (_12 = .context.loggingService) === null || _12 === void 0 ? void 0 : _12.logInfo("Attempting to update rune configuration: ".concat(userRuneId), { userRuneId: userRuneId, userId: userId, newConfig: newConfig }),
    if: function (, userId) { }
} || !userRuneId || newConfig === undefined;
{
    console.error('[SacredRuneEngraver] Cannot update rune configuration: User ID, rune ID, and new config are required.'); // Updated log
    (_13 = this.context.loggingService) === null || _13 === void 0 ? void 0 : _13.logError('Cannot update rune configuration: Missing required fields.', { userRuneId: userRuneId, userId: userId, newConfig: newConfig });
    throw new Error('User ID, rune ID, and new config are required for configuration update.');
}
try {
    // 1. Update the configuration in the database
    // Filter by ID and user_id to ensure ownership and that it's not a public rune
    var _26 = await this.supabase
        .from('runes')
        .update({ configuration: newConfig })
        .eq('id', userRuneId)
        .eq('user_id', userId)
        .eq('is_public', false) // Ensure we only update user-owned, non-public runes
        .select() // Select the updated data
        .single(), data_1 = _26.data, error_2 = _26.error;
    if (error_2)
        throw error_2;
    if (!data_1) {
        console.warn("[SacredRuneEngraver] User rune ".concat(userRuneId, " not found for configuration update or user mismatch.")); // Updated log
        (_14 = this.context.loggingService) === null || _14 === void 0 ? void 0 : _14.logWarning("User rune not found for config update: ".concat(userRuneId), { userRuneId: userRuneId, userId: userId });
        return undefined;
    }
    var updatedRune = data_1;
    console.log("User rune ".concat(userRuneId, " configuration updated in Supabase."));
    (_15 = this.context.loggingService) === null || _15 === void 0 ? void 0 : _15.logInfo("User rune config updated in DB: ".concat(userRuneId), { userRuneId: userRuneId, userId: userId });
    // 2. Update the configuration in the in-memory registry
    var registeredRune_1 = this.runeImplementations.get(userRuneId);
    if (registeredRune_1) {
        // Update the stored definition and potentially the instance
        registeredRune_1.definition.configuration = updatedRune.configuration;
        // If the rune instance has an updateConfiguration method, call it
        if (typeof registeredRune_1.instance.updateConfiguration === 'function') {
            registeredRune_1.instance.updateConfiguration(updatedRune.configuration);
            console.log("[SacredRuneEngraver] Called updateConfiguration on rune instance ".concat(userRuneId, ".")); // Updated log
        }
        else {
            console.warn("[SacredRuneEngraver] Rune instance ".concat(userRuneId, " does not have an updateConfiguration method.")); // Updated log
        }
        console.log("[SacredRuneEngraver] User rune ".concat(userRuneId, " configuration updated in memory registry.")); // Updated log
    }
    else {
        console.warn("[SacredRuneEngraver] User rune ".concat(userRuneId, " not found in memory registry during configuration update.")); // Updated log
    }
    // 3. Publish a 'rune_configuration_updated' event
    (_16 = this.context.eventBus) === null || _16 === void 0 ? void 0 : _16.publish('rune_configuration_updated', updatedRune, userId); // Include userId in event
    (_17 = this.context.loggingService) === null || _17 === void 0 ? void 0 : _17.logInfo("Rune configuration updated: ".concat(userRuneId), { userRuneId: userRuneId, userId: userId });
    return updatedRune;
}
catch (error) {
    console.error("[SacredRuneEngraver] Failed to update rune configuration ".concat(userRuneId, ":"), error);
    (_18 = this.context.loggingService) === null || _18 === void 0 ? void 0 : _18.logError("Failed to update rune configuration ".concat(userRuneId), { userRuneId: userRuneId, userId: userId, error: error.message });
    throw error; // Re-throw the error
}
/**
 * Calculates the current rune capacity cost for a specific user.
 * Sums up the capacity_cost of all runes owned by the user.
 * @param userId The user ID. Required.
 * @returns Promise<{ currentCost: number, capacity: number } | null> The current cost and total capacity, or null on failure.
 */
async;
getUserRuneCapacity(userId, string);
Promise < { currentCost: number, capacity: number } | null > {
    console: console,
    : .log("[SacredRuneEngraver] Calculating rune capacity for user: ".concat(userId, "...")), // Updated log
    this: (_19 = .context.loggingService) === null || _19 === void 0 ? void 0 : _19.logInfo("Calculating rune capacity for user ".concat(userId), { userId: userId }),
    if: function (, userId) {
        var _a;
        console.error('[SacredRuneEngraver] Cannot calculate rune capacity: User ID is required.'); // Updated log
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Cannot calculate rune capacity: User ID is required.');
        return null;
    },
    try: {
        // 1. Get the user's total capacity from their profile
        const: (_a = await this.supabase
            .from('profiles')
            .select('rune_capacity')
            .eq('id', userId)
            .single(), profileData = _a.data, profileError = _a.error, _a),
        if: function (profileError) { },
        throw: profileError,
        if: function (, profileData) {
            var _a;
            console.warn("[SacredRuneEngraver] User profile not found for capacity calculation: ".concat(userId, ".")); // Updated log
            (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning("User profile not found for capacity calculation: ".concat(userId), { userId: userId });
            // Return default capacity if profile not found? Or null? Let's return null for now.
            return null;
        },
        const: totalCapacity = profileData.rune_capacity || 100, // Default to 100 if not set
        // 2. Sum the capacity_cost of all runes owned by the user (is_public = false AND user_id = userId)
        const: (_b = await this.supabase
            .from('runes')
            .select('capacity_cost')
            .eq('user_id', userId)
            .eq('is_public', false), userRunesData = _b.data, runesError = _b.error, _b), // Only count user-owned runes
        if: function (runesError) { },
        throw: runesError,
        const: currentCost = userRunesData.reduce(function (sum, rune) { return sum + (rune.capacity_cost || 1); }, 0), // Sum costs, default to 1 if cost is null/undefined
        console: console,
        : .log("[SacredRuneEngraver] Rune capacity for user ".concat(userId, ": ").concat(currentCost, "/").concat(totalCapacity, ".")), // Updated log
        this: (_20 = .context.loggingService) === null || _20 === void 0 ? void 0 : _20.logInfo("Rune capacity calculated for user ".concat(userId), { userId: userId, currentCost: currentCost, totalCapacity: totalCapacity }),
        return: { currentCost: currentCost, capacity: totalCapacity }
    },
    catch: function (error) {
        var _a;
        console.error("[SacredRuneEngraver] Failed to calculate rune capacity for user ".concat(userId, ":"), error.message); // Updated log
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Failed to calculate rune capacity for user ".concat(userId), { userId: userId, error: error.message });
        throw error; // Re-throw the error
    }
};
// --- End New ---
// TODO: Implement methods for managing rune permissions (who can execute which rune/action).
// TODO: Implement a secure execution environment for script-based runes (integrates with ScriptSandbox).
// TODO: Implement dynamic loading of rune implementations (complex, might involve WebAssembly or isolated processes).
// TODO: This module is the core of the Rune Engrafting (符文嵌入) pillar and the Omni-Agent Group concept.
// --- New: Realtime Subscription Methods ---
/**
 * Subscribes to real-time updates from the runes table for the current user (user-owned and public).
 * @param userId The user ID to filter updates by. Required.
 */
subscribeToRunesUpdates(userId, string);
void {
    console: console,
    : .log('[SacredRuneEngraver] Subscribing to runes realtime updates for user:', userId), // Updated log
    this: (_21 = .context.loggingService) === null || _21 === void 0 ? void 0 : _21.logInfo('Subscribing to runes realtime updates', { userId: userId }),
    : .runesSubscription
};
{
    console.warn('[SacredRuneEngraver] Already subscribed to runes updates. Unsubscribing existing.'); // Updated log
    this.unsubscribeFromRunesUpdates();
}
// Subscribe to changes where user_id is null (public) OR user_id is the current user.
// RLS should ensure user only receives updates for runes they can see.
// We subscribe to all changes on the table and filter client-side for safety/simplicity in MVP.
// A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.
// Let's subscribe to a channel that should include both user and public data based on RLS.
// A simple channel name like the table name, relying entirely on RLS, is often used.
// Let's switch to subscribing to the table name channel and rely on RLS.
this.runesSubscription = this.supabase
    .channel('runes') // Subscribe to all changes on the table (RLS will filter)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'runes' }, function (payload) {
    var _a, _b, _c, _d;
    console.log('[SacredRuneEngraver] Realtime rune change received:', payload); // Updated log
    var rune = payload.new; // New data for INSERT/UPDATE
    var oldRune = payload.old; // Old data for UPDATE/DELETE
    var eventType = payload.eventType;
    // Check if the rune is relevant to the current user (user-owned or public)
    // RLS should handle this, but client-side check adds safety.
    var relevantRune = rune || oldRune;
    var isRelevant = (relevantRune === null || relevantRune === void 0 ? void 0 : relevantRune.user_id) === userId || (relevantRune === null || relevantRune === void 0 ? void 0 : relevantRune.is_public) === true;
    if (isRelevant) {
        console.log("[SacredRuneEngraver] Processing relevant rune change (".concat(eventType, "): ").concat(relevantRune.id)); // Updated log
        if (eventType === 'INSERT') {
            // Attempt to register the new rune if its implementation is available client-side
            // This is the tricky part for user-defined/installed runes.
            // For MVP, we assume public rune implementations are bundled and registered on startup.
            // User-installed runes fetched from DB on login are also processed by loadAndRegisterUserRunes.
            // This realtime insert event might be for a new public rune or a user rune installed elsewhere.
            // We need a way to get the implementation class here.
            // For MVP, we'll just log and rely on loadAndRegisterUserRunes on login/startup for user runes.
            // For public runes, we assume they are already registered. Updates are handled below.
            console.warn("[SacredRuneEngraver] Realtime INSERT for rune ".concat(rune.id, ". Registration requires client-side implementation.")); // Updated log
            (_a = _this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning("Realtime INSERT for rune ".concat(rune.id, ". Registration requires client-side implementation."), { runeId: rune.id, userId: userId });
            // If the implementation was available, we would do:
            // const clientImplementation = getImplementationForRune(rune); // Hypothetical helper
            // if (clientImplementation) {
            //     this.registerRune({ ...rune, implementation: clientImplementation });
            // }
        }
        else if (eventType === 'UPDATE') {
            // Update the definition and potentially the instance in the in-memory registry
            var registered = _this.runeImplementations.get(rune.id);
            if (registered) {
                console.log("[SacredRuneEngraver] Updating in-memory definition for rune ".concat(rune.id, ".")); // Updated log
                // Update the stored definition with the latest data from the DB
                registered.definition = rune;
                // If the rune instance has an updateConfiguration method, call it
                if (typeof registered.instance.updateConfiguration === 'function') {
                    registered.instance.updateConfiguration(rune.configuration);
                    console.log("[SacredRuneEngraver] Called updateConfiguration on rune instance ".concat(rune.id, ".")); // Updated log
                }
            }
            else {
                console.warn("[SacredRuneEngraver] Realtime UPDATE for rune ".concat(rune.id, " not found in memory registry.")); // Updated log
                (_b = _this.context.loggingService) === null || _b === void 0 ? void 0 : _b.logWarning("Realtime UPDATE for rune ".concat(rune.id, " not found in memory registry."), { runeId: rune.id, userId: userId });
                // If the rune should be in memory (e.g., user rune), attempt to load and register it.
                if (rune.user_id === userId && !rune.is_public) {
                    console.log("[SacredRuneEngraver] Attempting to load and register user rune ".concat(rune.id, " after update.")); // Updated log
                    _this.loadAndRegisterUserRunes(userId).catch(function (err) { return console.error('Error loading user runes after update:', err); });
                }
            }
        }
        else if (eventType === 'DELETE') {
            // Remove the rune from the in-memory registry
            if (_this.runeImplementations.has(oldRune.id)) {
                console.log("[SacredRuneEngraver] Removing rune ".concat(oldRune.id, " from in-memory registry.")); // Updated log
                _this.runeImplementations.delete(oldRune.id);
            }
            else {
                console.warn("[SacredRuneEngraver] Realtime DELETE for rune ".concat(oldRune.id, " not found in memory registry.")); // Updated log
                (_c = _this.context.loggingService) === null || _c === void 0 ? void 0 : _c.logWarning("Realtime DELETE for rune ".concat(oldRune.id, " not found in memory registry."), { runeId: oldRune.id, userId: userId });
            }
        }
        // Publish a general rune event for other modules/UI to react
        (_d = _this.context.eventBus) === null || _d === void 0 ? void 0 : _d.publish("rune_".concat(eventType.toLowerCase()), rune || oldRune, userId); // e.g., 'rune_insert', 'rune_update', 'rune_delete'
        // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly
        // this.context.syncService?.handleRemoteDataChange('runeEngraftingCenter', eventType, rune || oldRune, userId);
    }
    else {
        console.log('[SacredRuneEngraver] Received rune change not relevant to current user (filtered by RLS or client-side).'); // Updated log
    }
})
    .subscribe(function (status, err) {
    var _a;
    console.log('[SacredRuneEngraver] Rune subscription status:', status); // Updated log
    if (status === 'CHANNEL_ERROR') {
        console.error('[SacredRuneEngraver] Rune subscription error:', err); // Updated log
        (_a = _this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Rune subscription error', { userId: userId, error: err === null || err === void 0 ? void 0 : err.message });
    }
});
/**
 * Unsubscribes from runes real-time updates.
 */
unsubscribeFromRunesUpdates();
void {
    : .runesSubscription
};
{
    console.log('[SacredRuneEngraver] Unsubscribing from runes realtime updates.'); // Updated log
    (_22 = this.context.loggingService) === null || _22 === void 0 ? void 0 : _22.logInfo('Unsubscribing from runes realtime updates');
    this.supabase.removeChannel(this.runesSubscription);
    this.runesSubscription = null;
}
""(__makeTemplateObject([""], [""]));
