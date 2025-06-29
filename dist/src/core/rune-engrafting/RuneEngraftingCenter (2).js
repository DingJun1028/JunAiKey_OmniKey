"use strict";
`` `typescript
// src/core/rune-engrafting/RuneEngraftingCenter.ts -> src/core/rune-engrafting/SacredRuneEngraver.ts
// 聖符文匠 (Sacred Rune Engraver) - 核心模組
// Manages the registration, discovery, and execution of external capabilities (Runes).
// Acts as the system's interface to third-party services, devices, and plugins.
// Corresponds to the Rune Engrafting pillar and the Omni-Agent Group concept.
// Design Principle: Provides a standardized, secure, and extensible way to integrate external capabilities.
// --- New: Upgraded to Sacred Rune Engraver - Maximized Capabilities ---

import { SystemContext, Rune, RuneManifest, User } from '../../interfaces';
import { SupabaseClient } from '@supabase/supabase-js';
// import { LoggingService } from '../logging/LoggingService'; // Dependency
// import { EventBus } from '../../modules/events/EventBus'; // Dependency
// import { SecurityService } from '../security/SecurityService'; // Dependency for user/permissions
// import { ApiProxy } from '../../proxies/apiProxy'; // Dependency for API-based runes


// Renamed class from RuneEngraftingCenter to SacredRuneEngraver
export class SacredRuneEngraver {
    private context: SystemContext;
    private supabase: SupabaseClient;
    // private loggingService: LoggingService; // Access via context
    // private eventBus: EventBus; // Access via context
    // private securityService: SecurityService; // Access via context
    // private apiProxy: ApiProxy; // Access via context

    // --- New: In-memory registry for Rune implementations ---
    // This map stores instances of the Rune implementation classes, keyed by Rune ID.
    // These instances are created when runes are registered (e.g., on startup or installation).
    // Store { definition: Rune, instance: any } to keep the definition with the instance.
    private runeImplementations: Map<string, { definition: Rune, instance: any }> = new Map();
    // --- End New ---

    // --- New: Realtime Subscription ---
    private runesSubscription: any | null = null;
    // --- End New ---


    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
        // this.loggingService = context.loggingService;
        // this.eventBus = context.eventBus;
        // this.securityService = context.securityService;
        // this.apiProxy = context.apiProxy;
        console.log('SacredRuneEngraver initialized.'); // Updated log

        // TODO: Load initial public runes and user's installed runes from persistence on startup (Supports Bidirectional Sync Domain)
        // And register their implementations.
        // This might involve fetching all runes for the current user on auth state change.

        // --- REMOVE: Initialize with some simulated flows for demo (now using DB) ---
        // this.initializeSimulatedFlows();
        // --- END REMOVE ---

        // --- New: Set up Supabase Realtime subscriptions ---
        // Subscribe when the user is authenticated.
        this.context.securityService?.onAuthStateChange((user) => {
            if (user) {
                this.subscribeToRunesUpdates(user.id);
                // On login, fetch and register user's runes
                this.loadAndRegisterUserRunes(user.id).catch(err => console.error('Failed to load and register user runes on login:', err));
            } else {
                // On logout, clear user-specific runes from memory and unsubscribe
                this.clearUserRunesFromMemory(this.context.currentUser?.id); // Pass the user ID who just logged out
                this.unsubscribeFromRunesUpdates();
            }
        });
        // --- End New ---
    }

    // --- New: Helper to load and register user's runes ---
    private async loadAndRegisterUserRunes(userId: string): Promise<void> {
        console.log(`[SacredRuneEngraver];
Loading;
and;
registering;
runes;
for (user; ; )
    : $;
{
    userId;
}
`); // Updated log
        this.context.loggingService?.logInfo(`;
Loading;
and;
registering;
runes;
for (user; $; { userId } `, { userId });

        try {
            // Fetch user's runes (is_public = false AND user_id = userId)
            const { data, error } = await this.supabase
                .from('runes')
                .select('*')
                .eq('user_id', userId)
                .eq('is_public', false); // Ensure we only load user-owned, non-public runes here

            if (error) throw error;

            const userRunes = data as Rune[];
            console.log(`[SacredRuneEngraver])
    Found;
$;
{
    userRunes.length;
}
user - owned;
runes. `); // Updated log

            // Register each user-owned rune
            for (const rune of userRunes) {
                try {
                    // Note: The actual implementation class needs to be available client-side.
                    // In a real plugin system, this would involve dynamically loading code.
                    // For MVP, we assume the implementation class is already imported (e.g., in main.tsx).
                    // We need a way to map the rune.id or rune.name to the actual class.
                    // This mapping is currently done in main.tsx when creating the Rune definitions.
                    // We need to pass the implementation class reference when registering.

                    // Let's assume the rune object fetched from DB includes a reference
                    // to its implementation class (this is NOT how DBs work, but for MVP simulation).
                    // A better approach: have a client-side registry mapping rune IDs to classes.

                    // TODO: Refactor Rune interface and main.tsx to pass client-side implementation reference.
                    // For now, we'll just log a warning that user runes cannot be registered dynamically from DB fetch alone.
                    // The actual registration of user runes needs to happen in main.tsx after fetching them.

                    // If we had the client-side class available here (e.g., from a passed registry), we would do:
                    // const clientImplementation = clientRuneRegistry.getImplementation(rune.id);
                    // if (clientImplementation) {
                    //     await this.registerRune({ ...rune, implementation: clientImplementation }); // Register the fetched rune with its implementation
                    // } else {
                    //      console.warn(`[SacredRuneEngraver];
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
register. `); // Updated log
                    //      this.context.loggingService?.logWarning(`;
Client - side;
implementation;
not;
found;
for (user; rune `, { runeId: rune.id, userId });
                    // }

                    // For MVP, let's just log that we would register them if we had the implementation class here.
                    console.warn(`[SacredRuneEngraver]; User)
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
class {
}
`); // Updated log
                    this.context.loggingService?.logWarning(`;
User;
rune;
fetched;
from;
DB, requires;
client - side;
implementation;
for (registration `, { runeId: rune.id, userId });


                } catch (regError: any) {
                    console.error(`[SacredRuneEngraver]; Error; processing)
    user;
rune;
$;
{
    rune.id;
}
for (registration; ; )
    : `, regError.message); // Updated log
                    this.context.loggingService?.logError(`;
Error;
processing;
user;
rune;
for (registration `, { runeId: rune.id, userId, error: regError.message });
                }
            }
            console.log(`[SacredRuneEngraver]; User; rune)
    loading;
and;
processing;
complete. `); // Updated log

        } catch (error: any) {
            console.error(`[SacredRuneEngraver];
Error;
loading;
user;
runes;
for (user; $; { userId })
    : `, error.message); // Updated log
            this.context.loggingService?.logError(`;
Error;
loading;
user;
runes `, { userId, error: error.message });
        }
    }
    // --- End New ---

    // --- New: Helper to clear user-specific runes from memory ---
    private clearUserRunesFromMemory(userId?: string | null): void {
        if (!userId) {
             console.warn('[SacredRuneEngraver] Cannot clear user runes: User ID is missing.'); // Updated log
             return;
        }
        console.log(`[SacredRuneEngraver];
Clearing;
runes;
for (user; ; )
    : $;
{
    userId;
}
from;
memory. `); // Updated log
        // Iterate through registered runes and remove those owned by the specified user
        const runeIdsToRemove: string[] = [];
        this.runeImplementations.forEach((entry, runeId) => {
            if (entry.definition.user_id === userId) {
                runeIdsToRemove.push(runeId);
            }
        });

        runeIdsToRemove.forEach(runeId => {
            this.runeImplementations.delete(runeId);
            console.log(`[SacredRuneEngraver];
Cleared;
user;
rune;
$;
{
    runeId;
}
from;
memory. `); // Updated log
        });
        console.log(`[SacredRuneEngraver];
Cleared;
$;
{
    runeIdsToRemove.length;
}
user;
runes;
from;
memory. `); // Updated log
    }
    // --- End New ---


    /**
     * Registers a Rune implementation in the in-memory registry.
     * This is typically called on application startup for built-in/public runes,
     * or after a user installs a new rune.
     * @param rune The Rune definition object (including implementation reference). Required.
     * @returns Promise<void>
     */
    async registerRune(rune: Rune): Promise<void> {
        console.log(`[SacredRuneEngraver];
Registering;
rune: $;
{
    rune.name;
}
($);
{
    rune.id;
}
`); // Updated log
        this.context.loggingService?.logInfo(`;
Registering;
rune: $;
{
    rune.name;
}
`, { runeId: rune.id, userId: rune.user_id });

        if (!rune.id || !rune.implementation) {
            console.error('[SacredRuneEngraver] Cannot register rune: ID and implementation are required.'); // Updated log
            this.context.loggingService?.logError('Cannot register rune: Missing ID or implementation.', { rune });
            throw new Error('Rune ID and implementation are required for registration.');
        }

        if (this.runeImplementations.has(rune.id)) {
            console.warn(`[SacredRuneEngraver];
Rune;
$;
{
    rune.id;
}
is;
already;
registered.Overwriting. `); // Updated log
            this.context.loggingService?.logWarning(`;
Rune;
already;
registered: $;
{
    rune.id;
}
`, { runeId: rune.id });
        }

        try {
            // Create an instance of the Rune implementation class
            // Pass the system context and the rune definition to the constructor
            const runeInstance = new rune.implementation(this.context, rune);

            // Store the instance and the definition
            this.runeImplementations.set(rune.id, { definition: rune, instance: runeInstance });

            console.log(`[SacredRuneEngraver];
Rune;
$;
{
    rune.id;
}
registered;
successfully. `); // Updated log
            // Publish a 'rune_registered' event (part of Six Styles/EventBus - call context.eventBus.publish)
            this.context.eventBus?.publish('rune_registered', rune, rune.user_id); // Include userId in event

        } catch (error: any) {
            console.error(`[SacredRuneEngraver];
Error;
registering;
rune;
$;
{
    rune.id;
}
`, error.message); // Updated log
            this.context.loggingService?.logError(`;
Error;
registering;
rune `, { runeId: rune.id, userId: rune.user_id, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Retrieves a list of available Rune definitions for a specific user.
     * Includes public runes and runes owned by the user.
     * @param typeFilter Optional: Filter by rune type.
     * @param userId The user ID to fetch user-owned runes for. Required.
     * @returns Promise<Rune[]> An array of Rune definition objects.
     */
    async listRunes(typeFilter?: Rune['type'], userId?: string): Promise<Rune[]> {
        console.log('Retrieving rune definitions from Supabase for user:', userId, 'type filter:', typeFilter || 'all');
        this.context.loggingService?.logInfo('Attempting to fetch rune definitions', { userId, typeFilter });

        // Allow fetching public runes without a user ID, but log a warning
        if (!userId) {
             console.warn('[SacredRuneEngraver] Fetching rune definitions without user ID. Will only retrieve public runes.'); // Updated log
             this.context.loggingService?.logWarning('Fetching rune definitions without user ID. Will only retrieve public runes.');
        }

        try {
            // Fetch runes from Supabase, filtered by user_id OR is_public
            let dbQuery = this.supabase
                .from('runes')
                .select('*'); // Select all columns

            if (userId) {
                 // Fetch user's own runes OR public runes
                 dbQuery = dbQuery.or(`;
user_id.eq.$;
{
    userId;
}
is_public.eq.true `);
            } else {
                 // If no user ID, only fetch public runes
                 dbQuery = dbQuery.eq('is_public', true);
            }


            if (typeFilter) {
                dbQuery = dbQuery.eq('type', typeFilter);
            }

            dbQuery = dbQuery.order('name', { ascending: true } as any); // Order by name


            const { data, error } = await dbQuery;

            if (error) { throw error; }

            const runes = data as Rune[];
            console.log(`;
Fetched;
$;
{
    data.length;
}
rune;
definitions;
for (user; $; { userId } || 'public')
    ;
`);
            this.context.loggingService?.logInfo(`;
Fetched;
$;
{
    data.length;
}
rune;
definitions;
successfully. `, { userId });

            // Note: The fetched Rune objects from the DB do NOT contain the 'implementation' class reference.
            // This reference exists only client-side in the code that defines/registers the runes (e.g., main.tsx).
            // When returning the list, we should ideally merge the DB definition with the in-memory implementation reference.
            // For MVP, we'll skip this detailed merge here and just return the DB definition.
            // The `;
executeRuneAction ` method will need to look up the implementation by ID.

            // To make the returned Rune objects usable for execution, we should attach the implementation reference.
            // This requires iterating through the fetched runes and finding their corresponding entry in `;
runeImplementations `.
            const usableRunes = runes.map(rune => {
                 const registered = this.runeImplementations.get(rune.id);
                 if (registered) {
                     // Return the fetched definition with the attached implementation reference
                     // Ensure we don't overwrite DB data with potentially stale in-memory definition data
                     // Use the fetched rune data and add the implementation
                     return { ...rune, implementation: registered.definition.implementation };
                 }
                 // If a rune exists in DB but not registered in memory, return it without implementation
                 // This might happen for user runes if the client-side implementation wasn't loaded/registered correctly.
                 console.warn(`[SacredRuneEngraver];
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
implementation. `); // Updated log
                 return rune; // Return DB definition without implementation
            });


            return usableRunes;

        } catch (error: any) {
            console.error('Error fetching rune definitions from Supabase:', error);
            this.context.loggingService?.logError('Failed to fetch rune definitions', { userId: userId, error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Executes a specific action on a registered Rune.
     * This is a core part of the "Act" step in the Six Styles.
     * @param runeId The ID of the Rune. Required.
     * @param actionName The name of the action/method to execute on the Rune. Required.
     * @param params Optional parameters for the action.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The result of the Rune action execution.
     */
    async executeRuneAction(runeId: string, actionName: string, params?: any, userId?: string): Promise<any> {
        console.log(`[SacredRuneEngraver];
Attempting;
to;
execute;
action;
"${actionName}\" on rune \"${runeId}\" for user: ${userId}`); // Updated log;
this.context.loggingService?.logInfo(`Attempting to execute rune action: ${runeId}.${actionName}`, { runeId, actionName, userId, params });
if (!userId) {
    console.error('[SacredRuneEngraver] Cannot execute rune action: User ID is required.'); // Updated log
    this.context.loggingService?.logError('Cannot execute rune action: User ID is required.');
    throw new Error('User ID is required to execute a rune action.');
}
// 1. Find the registered Rune implementation
const registeredRune = this.runeImplementations.get(runeId);
if (!registeredRune) {
    console.error(`[SacredRuneEngraver] Rune \"${runeId}\" not found in registry.`); // Updated log
    this.context.loggingService?.logError(`Rune not found in registry: ${runeId}`, { runeId, actionName, userId });
    throw new Error(`Rune \"${runeId}\" not found.`);
}
const runeInstance = registeredRune.instance;
const runeDefinition = registeredRune.definition;
// 2. Check if the requested action exists in the Rune's manifest
const actionDefinition = runeDefinition.manifest?.methods?.[actionName];
if (!actionDefinition) {
    console.error(`[SacredRuneEngraver] Action \"${actionName}\" not found in manifest for rune \"${runeId}\".`); // Updated log
    this.context.loggingService?.logError(`Rune action not found in manifest: ${runeId}.${actionName}`, { runeId, actionName, userId });
    throw new Error(`Action \"${actionName}\" not found for Rune \"${runeDefinition.name}\".`);
}
// 3. Check if the action exists on the Rune instance and is a function
const runeAction = runeInstance[actionName];
if (typeof runeAction !== 'function') {
    console.error(`[SacredRuneEngraver] Action \"${actionName}\" on rune \"${runeId}\" is not a callable function.`); // Updated log
    this.context.loggingService?.logError(`Rune action is not a function: ${runeId}.${actionName}`, { runeId, actionName, userId });
    throw new Error(`Action \"${actionName}\" is not callable for Rune \"${runeDefinition.name}\".`);
}
n;
n; /**\n     * Calculates the current rune capacity cost for a specific user.\n     * Sums up the capacity_cost of all runes owned by the user.\n     * @param userId The user ID. Required.\n     * @returns Promise<{ currentCost: number, capacity: number } | null> The current cost and total capacity, or null on failure.\n     */
n;
async;
getUserRuneCapacity(userId, string);
Promise < { currentCost: number, capacity: number } | null > { n, console, : .log(`[SacredRuneEngraver] Calculating rune capacity for user: ${userId}...`) } // Updated log\n        this.context.loggingService?.logInfo(`Calculating rune capacity for user ${userId}`, { userId });\n\n        if (!userId) {\n             console.error('[SacredRuneEngraver] Cannot calculate rune capacity: User ID is required.'); // Updated log\n             this.context.loggingService?.logError('Cannot calculate rune capacity: User ID is required.');\n             return null;\n        }\n\n        try {\n            // 1. Get the user's total capacity from their profile\n            const { data: profileData, error: profileError } = await this.supabase\n                .from('profiles')\n                .select('rune_capacity')\n                .eq('id', userId)\n                .single();\n\n            if (profileError) throw profileError;\n            if (!profileData) {\n                 console.warn(`[SacredRuneEngraver] User profile not found for capacity calculation: ${userId}.`); // Updated log\n                 this.context.loggingService?.logWarning(`User profile not found for capacity calculation: ${userId}`, { userId });\n                 // Return default capacity if profile not found? Or null? Let's return null for now.\n                 return null;\n            }\n\n            const totalCapacity = profileData.rune_capacity || 100; // Default to 100 if not set\n\n\n            // 2. Sum the capacity_cost of all runes owned by the user (is_public = false AND user_id = userId)\n            const { data: userRunesData, error: runesError } = await this.supabase\n                .from('runes')\n                .select('capacity_cost')\n                .eq('user_id', userId)\n                .eq('is_public', false); // Only count user-owned runes\n\n            if (runesError) throw runesError;\n\n            const currentCost = userRunesData.reduce((sum, rune) => sum + (rune.capacity_cost || 1), 0); // Sum costs, default to 1 if cost is null/undefined\n\n\n            console.log(`[SacredRuneEngraver] Rune capacity for user ${userId}: ${currentCost}/${totalCapacity}.`); // Updated log\n            this.context.loggingService?.logInfo(`Rune capacity calculated for user ${userId}`, { userId, currentCost, totalCapacity });\n\n            return { currentCost, capacity: totalCapacity };\n\n        } catch (error: any) {\n            console.error(`[SacredRuneEngraver] Failed to calculate rune capacity for user ${userId}:`, error.message); // Updated log\n            this.context.loggingService?.logError(`Failed to calculate rune capacity for user ${userId}`, { userId, error: error.message });\n            throw error; // Re-throw the error\n        }\n    }\n    // --- End New ---\n\n\n    // TODO: Implement methods for managing rune permissions (who can execute which rune/action).\n    // TODO: Implement a secure execution environment for script-based runes (integrates with ScriptSandbox).\n    // TODO: Implement dynamic loading of rune implementations (complex, might involve WebAssembly or isolated processes).\n    // TODO: This module is the core of the Rune Engrafting (\u7b26\u6587\u5d4c\u5165) pillar and the Omni-Agent Group concept.\n\n    // --- New: Realtime Subscription Methods ---\n    /**\n     * Subscribes to real-time updates from the runes table for the current user (user-owned and public).\n     * @param userId The user ID to filter updates by. Required.\n     */\n    subscribeToRunesUpdates(userId: string): void {\n        console.log('[SacredRuneEngraver] Subscribing to runes realtime updates for user:', userId); // Updated log\n        this.context.loggingService?.logInfo('Subscribing to runes realtime updates', { userId });\n\n        if (this.runesSubscription) {\n            console.warn('[SacredRuneEngraver] Already subscribed to runes updates. Unsubscribing existing.'); // Updated log\n            this.unsubscribeFromRunesUpdates();\n        }\n\n        // Subscribe to changes where user_id is null (public) OR user_id is the current user.\n        // RLS should ensure user only receives updates for runes they can see.\n        // We subscribe to all changes on the table and filter client-side for safety/simplicity in MVP.\n        // A better approach for performance with large tables is to filter at the channel level if Supabase supports complex filters.\n        // Let's subscribe to a channel that should include both user and public data based on RLS.\n        // A simple channel name like the table name, relying entirely on RLS, is often used.\n        // Let's switch to subscribing to the table name channel and rely on RLS.\n\n        this.runesSubscription = this.supabase\n            .channel('runes') // Subscribe to all changes on the table (RLS will filter)\n            .on('postgres_changes', { event: '*', schema: 'public', table: 'runes' }, (payload) => { // No filter here, rely on RLS\n                console.log('[SacredRuneEngraver] Realtime rune change received:', payload); // Updated log\n                const rune = payload.new as Rune; // New data for INSERT/UPDATE\n                const oldRune = payload.old as Rune; // Old data for UPDATE/DELETE\n                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\n\n                // Check if the rune is relevant to the current user (user-owned or public)\n                // RLS should handle this, but client-side check adds safety.\n                const relevantRune = rune || oldRune;\n                const isRelevant = relevantRune?.user_id === userId || relevantRune?.is_public === true;\n\n                if (isRelevant) {\n                    console.log(`[SacredRuneEngraver] Processing relevant rune change (${eventType}): ${relevantRune.id}`); // Updated log\n\n                    if (eventType === 'INSERT') {\n                        // Attempt to register the new rune if its implementation is available client-side\n                        // This is the tricky part for user-defined/installed runes.\n                        // For MVP, we assume public rune implementations are bundled and registered on startup.\n                        // User-installed runes fetched from DB on login are also processed by loadAndRegisterUserRunes.\n                        // This realtime insert event might be for a new public rune or a user rune installed elsewhere.\n                        // We need a way to get the implementation class here.\n                        // For MVP, we'll just log and rely on loadAndRegisterUserRunes on login/startup for user runes.\n                        // For public runes, we assume they are already registered. Updates are handled below.\n                        console.warn(`[SacredRuneEngraver] Realtime INSERT for rune ${rune.id}. Registration requires client-side implementation.`); // Updated log\n                        this.context.loggingService?.logWarning(`Realtime INSERT for rune ${rune.id}. Registration requires client-side implementation.`, { runeId: rune.id, userId });\n                        // If the implementation was available, we would do:\n                        // const clientImplementation = getImplementationForRune(rune); // Hypothetical helper\n                        // if (clientImplementation) {\n                        //     this.registerRune({ ...rune, implementation: clientImplementation });\n                        // }\n\n                    } else if (eventType === 'UPDATE') {\n                        // Update the definition and potentially the instance in the in-memory registry\n                        const registered = this.runeImplementations.get(rune.id);\n                        if (registered) {\n                            console.log(`[SacredRuneEngraver] Updating in-memory definition for rune ${rune.id}.`); // Updated log\n                            // Update the stored definition with the latest data from the DB\n                            registered.definition = rune;\n                            // If the rune instance has an updateConfiguration method, call it\n                            if (typeof registered.instance.updateConfiguration === 'function') {\n                                registered.instance.updateConfiguration(rune.configuration);\n                                console.log(`[SacredRuneEngraver] Called updateConfiguration on rune instance ${rune.id}.`); // Updated log\n                            }\n                        } else {\n                             console.warn(`[SacredRuneEngraver] Realtime UPDATE for rune ${rune.id} not found in memory registry.`); // Updated log\n                             this.context.loggingService?.logWarning(`Realtime UPDATE for rune ${rune.id} not found in memory registry.`, { runeId: rune.id, userId });\n                             // If the rune should be in memory (e.g., user rune), attempt to load and register it.\n                             if (rune.user_id === userId && !rune.is_public) {\n                                 console.log(`[SacredRuneEngraver] Attempting to load and register user rune ${rune.id} after update.`); // Updated log\n                                 this.loadAndRegisterUserRunes(userId).catch(err => console.error('Error loading user runes after update:', err));\n                             }\n                        }\n\n                    } else if (eventType === 'DELETE') {\n                        // Remove the rune from the in-memory registry\n                        if (this.runeImplementations.has(oldRune.id)) {\n                            console.log(`[SacredRuneEngraver] Removing rune ${oldRune.id} from in-memory registry.`); // Updated log\n                            this.runeImplementations.delete(oldRune.id);\n                        } else {\n                             console.warn(`[SacredRuneEngraver] Realtime DELETE for rune ${oldRune.id} not found in memory registry.`); // Updated log\n                             this.context.loggingService?.logWarning(`Realtime DELETE for rune ${oldRune.id} not found in memory registry.`, { runeId: oldRune.id, userId });\n                        }\n                    }\n\n                    // Publish a general rune event for other modules/UI to react\n                    this.context.eventBus?.publish(`rune_${eventType.toLowerCase()}`, rune || oldRune, userId); // e.g., 'rune_insert', 'rune_update', 'rune_delete'\n\n                    // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly\n                    // this.context.syncService?.handleRemoteDataChange('runeEngraftingCenter', eventType, rune || oldRune, userId);\n\n                } else {\n                    console.log('[SacredRuneEngraver] Received rune change not relevant to current user (filtered by RLS or client-side).'); // Updated log\n                }\n            })\n            .subscribe((status, err) => {\n                 console.log('[SacredRuneEngraver] Rune subscription status:', status); // Updated log\n                 if (status === 'CHANNEL_ERROR') {\n                     console.error('[SacredRuneEngraver] Rune subscription error:', err); // Updated log\n                     this.context.loggingService?.logError('Rune subscription error', { userId, error: err?.message });\n                 }\n            });\n    }\n\n    /**\n     * Unsubscribes from runes real-time updates.\n     */\n    unsubscribeFromRunesUpdates(): void {\n        if (this.runesSubscription) {\n            console.log('[SacredRuneEngraver] Unsubscribing from runes realtime updates.'); // Updated log\n            this.context.loggingService?.logInfo('Unsubscribing from runes realtime updates');\n            this.supabase.removeChannel(this.runesSubscription);\n            this.runesSubscription = null;\n        }\n    }\n    // --- End New ---\n}\n```
 `` `;
