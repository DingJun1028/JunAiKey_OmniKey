"use strict";
`` `typescript
// src/core/rune-engrafting/SacredRuneEngraver.ts
// 聖符文匠 (Sacred Rune Engraver) - 核心模組
// Manages the registration, discovery, and execution of external capabilities (Runes).
// Acts as the system's interface to third-party services, devices, and plugins.
// Corresponds to the Rune Engrafting pillar and the Omni-Agent Group concept.
// Design Principle: Provides a standardized, secure, and extensible way to integrate external capabilities.
// --- New: Upgraded to Sacred Rune Engraver - Maximized Capabilities ---
// --- Modified: Implement executeRuneAction to call methods on Rune instances ---


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
    // private apiProxy = context.apiProxy; // Access via context

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
        // This might involve fetching all abilities for the current user on auth state change.

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
                 // If no user ID, only fetch public abilities
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
this.context.loggingService?.logInfo(`Executing rune action: ${runeId}.${actionName}`, { runeId, actionName, userId, params });
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
    console.warn(`[SacredRuneEngraver] Rune ${runeId} is disabled.`); // Updated log
    this.context.loggingService?.logWarning(`Attempted to execute disabled rune`, { runeId, actionName, userId });
    throw new Error(`Rune \"${runeDefinition.name}\" is disabled.`);
}
// 5. Validate parameters against the manifest (Optional but Recommended)
// This is complex and depends on the parameter schema definition in the manifest.
// For MVP, we'll skip detailed parameter validation here and rely on the Rune implementation to handle it.
// TODO: Implement parameter validation based on actionDefinition.parameters schema.
// 6. Execute the Rune action
console.log(`[SacredRuneEngraver] Executing ${runeDefinition.name}.${actionName}...`); // Updated log
this.context.loggingService?.logInfo(`Executing rune action: ${runeId}.${actionName}`, { runeId, actionName, userId });
try {
    // Call the method on the Rune instance, passing parameters and user ID
    const result = await runeAction.call(runeInstance, params, userId); // Use .call() to ensure 'this' context is the rune instance
    console.log(`[SacredRuneEngraver] Rune action \"${actionName}\" on \"${runeId}\" executed successfully. Result:`, result); // Updated log
    this.context.loggingService?.logInfo(`Rune action executed successfully: ${runeId}.${actionName}`, { runeId, actionName, userId, result });
    // Publish a 'rune_action_executed' event (part of Six Styles/EventBus)
    this.context.eventBus?.publish('rune_action_executed', { runeId, actionName, params, result, userId }, userId); // Include userId in event
    // TODO: Update last_used_timestamp for the rune in Supabase (Supports AARRR - Retention)
    // This should be done asynchronously.
    this.updateRuneLastUsedTimestamp(runeId, userId).catch(err => console.error('Failed to update rune last_used_timestamp:', err));
    return result; // Return the result from the Rune action
}
catch (error) {
    console.error(`[SacredRuneEngraver] Error executing rune action \"${actionName}\" on \"${runeId}\":`, error.message); // Updated log
    this.context.loggingService?.logError(`Error executing rune action: ${runeId}.${actionName}`, { runeId, actionName, userId, error: error.message });
    // Publish a 'rune_action_failed' event (part of Six Styles/EventBus)
    this.context.eventBus?.publish('rune_action_failed', { runeId, actionName, params, error: error.message, userId }, userId); // Include userId in event
    // TODO: Trigger EvolutionEngine to handle rune failure for learning (call context.evolutionEngine.handleRuneFailureForEvolution)
    // This requires EvolutionEngine to have a method for this.
    throw error; // Re-throw the error after logging and event publishing
}
async;
updateRuneLastUsedTimestamp(runeId, string, userId ?  : string);
Promise < void  > {
    // Only update if userId is provided (user-specific or public rune used by a user)
    if(, userId) { }, return: ,
    try: {
        // Update the last_used_timestamp in Supabase for the specific rune and user
        // Note: This assumes a user might have their own instance of a public rune,
        // or we track usage of public runes per user.
        // For simplicity, let's update the user's specific rune record if it exists,
        // or the public rune record if it's a public rune being used.
        // This requires checking if the rune is public or user-owned.
        // Fetch the rune definition first to check ownership/public status
        const: runeDefinition = this.runeImplementations.get(runeId)?.definition,
        if(, runeDefinition) {
            console.warn(`[SacredRuneEngraver] Rune definition not found in memory for timestamp update: ${runeId}`); // Updated log
            return; // Cannot update if definition is not in memory
        },
        let, query = this.supabase.from('runes').update({ last_used_timestamp: new Date().toISOString() }),
        if(runeDefinition) { }, : .is_public
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
    console.warn(`[SacredRuneEngraver] Attempted to update timestamp for rune ${runeId} not owned by user ${userId} and not public.`); // Updated log
    return; // Cannot update if not public or user-owned
}
const { error } = await query;
if (error) {
    console.error(`[SacredRuneEngraver] Error updating rune ${runeId} last_used_timestamp:`, error.message); // Updated log
    this.context.loggingService?.logError(`Failed to update rune last_used_timestamp`, { runeId, userId, error: error.message });
}
else {
    // console.log(`[SacredRuneEngraver] Rune ${runeId} last_used_timestamp updated.`); // Avoid excessive logging
}
try { }
catch (error) {
    console.error(`[SacredRuneEngraver] Unexpected error updating rune ${runeId} last_used_timestamp:`, error.message); // Updated log
    this.context.loggingService?.logError(`Unexpected error updating rune last_used_timestamp`, { runeId, userId, error: error.message });
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
    console, : .log(`[SacredRuneEngraver] Attempting to install public rune ${publicRuneId} for user ${userId}...`), // Updated log
    this: .context.loggingService?.logInfo(`Attempting to install public rune ${publicRuneId}`, { publicRuneId, userId }),
    if(, userId) { }
} || !publicRuneId;
{
    console.error('[SacredRuneEngraver] Cannot install rune: User ID and public Rune ID are required.'); // Updated log
    this.context.loggingService?.logError('Cannot install rune: Missing required fields.', { publicRuneId, userId });
    throw new Error('User ID and public Rune ID are required for installation.');
}
try {
    // 1. Fetch the public rune definition
    const { data: publicRuneData, error: fetchError } = await this.supabase
        .from('runes')
        .select('*')
        .eq('id', publicRuneId)
        .eq('is_public', true)
        .single();
    if (fetchError)
        throw fetchError;
    if (!publicRuneData) {
        console.warn(`[SacredRuneEngraver] Public rune ${publicRuneId} not found.`); // Updated log
        this.context.loggingService?.logWarning(`Public rune not found for installation: ${publicRuneId}`, { publicRuneId, userId });
        throw new Error(`Public rune \"${publicRuneId}\" not found.`);
    }
    const publicRune = publicRuneData;
    // 2. Check if the user already has a rune with the same name (prevent duplicate installations by name)
    const existingUserRunes = await this.listRunes(undefined, userId); // Fetch user's runes
    if (existingUserRunes.some(rune => rune.name === publicRune.name && rune.user_id === userId)) {
        console.warn(`[SacredRuneEngraver] User ${userId} already has a rune named \"${publicRune.name}\". Skipping installation.`); // Updated log
        this.context.loggingService?.logWarning(`User already has rune named \"${publicRune.name}\". Skipping installation.`, { publicRuneId, userId });
        // Optionally return the existing user rune
        return existingUserRunes.find(rune => rune.name === publicRune.name && rune.user_id === userId) || null;
    }
    // 3. Check user's rune capacity
    const userCapacity = await this.getUserRuneCapacity(userId);
    if (!userCapacity) {
        console.error('[SacredRuneEngraver] Could not retrieve user rune capacity.'); // Updated log
        this.context.loggingService?.logError('Could not retrieve user rune capacity for installation.', { userId });
        throw new Error('Could not retrieve user capacity.');
    }
    const requiredCapacity = publicRune.capacity_cost || 1; // Default cost is 1
    if (userCapacity.currentCost + requiredCapacity > userCapacity.capacity) {
        console.warn(`[SacredRuneEngraver] User ${userId} has insufficient rune capacity (${userCapacity.currentCost}/${userCapacity.capacity}). Required: ${requiredCapacity}.`); // Updated log
        this.context.loggingService?.logWarning(`Insufficient rune capacity for installation`, { publicRuneId, userId, current: userCapacity.currentCost, capacity: userCapacity.capacity, required: requiredCapacity });
        throw new Error(`Insufficient rune capacity. Required: ${requiredCapacity}, Available: ${userCapacity.capacity - userCapacity.currentCost}.`);
    }
    // 4. Create a user-specific copy of the rune definition in the database
    const newUserRuneData = {
        name: publicRune.name,
        description: publicRune.description,
        type: publicRune.type,
        manifest: publicRune.manifest, // Copy the manifest
        // implementation: publicRune.implementation, // Do NOT copy implementation details to DB
        version: publicRune.version,
        author_id: publicRune.author_id, // Keep original author
        is_enabled: true, // Enabled by default on installation
        configuration: publicRune.configuration || {}, // Copy default configuration or start empty
        user_id: userId, // Link to the installing user
        is_public: false, // This is a user's private copy
        capacity_cost: publicRune.capacity_cost, // Copy the capacity cost
    };
    const { data: newUserRuneResult, error: insertError } = await this.supabase
        .from('runes')
        .insert([newUserRuneData])
        .select() // Select the inserted data to get the generated ID and timestamp
        .single(); // Expecting a single record back
    if (insertError)
        throw insertError;
    const newUserRune = newUserRuneResult;
    console.log('User rune installed:', newUserRune.id, '-', newUserRune.name, 'for user:', newUserRune.user_id);
    // 5. Register the new user-specific rune implementation in memory
    // We need the actual implementation class here. This is the tricky part.
    // The `publicRune` object fetched from DB doesn't contain the class.
    // We need a client-side mapping from publicRuneId or newUserRune.name to the class.
    // Let's assume the `runeImplementations` map already contains the public rune definition with the class.
    const publicRuneRegistration = this.runeImplementations.get(publicRuneId);
    if (publicRuneRegistration?.definition?.implementation) {
        // Create a new Rune object for registration, using the DB data but attaching the client-side implementation
        const runeToRegister = {
            ...newUserRune, // Use the data from the newly created DB record
            implementation: publicRuneRegistration.definition.implementation, // Attach the client-side implementation class
        };
        await this.registerRune(runeToRegister); // Register the user's instance
    }
    else {
        console.error(`[SacredRuneEngraver] Could not find client-side implementation for public rune ${publicRuneId}. User rune ${newUserRune.id} installed in DB but not registered in memory.`); // Updated log
        this.context.loggingService?.logError(`Could not find client-side implementation for public rune`, { publicRuneId, newUserRuneId: newUserRune.id, userId });
        // The user rune exists in DB, but won't be executable until the app restarts or the implementation is otherwise loaded/registered.
        // Decide how to handle this - maybe mark the user rune as 'unregistered' or 'needs_client_update'?
        // For MVP, just log the error and return the DB object.
    }
    // 6. Publish a 'rune_installed' event
    this.context.eventBus?.publish('rune_installed', newUserRune, userId); // Include userId in event
    this.context.loggingService?.logInfo(`Rune installed: ${newUserRune.id}`, { name: newUserRune.name, userId: userId });
    return newUserRune;
}
catch (error) {
    console.error('Failed to install rune:', error);
    this.context.loggingService?.logError('Failed to install rune', { publicRuneId, userId, error: error.message });
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
    console, : .log(`[SacredRuneEngraver] Attempting to uninstall user rune ${userRuneId} for user ${userId}...`), // Updated log
    this: .context.loggingService?.logInfo(`Attempting to uninstall user rune ${userRuneId}`, { userRuneId, userId }),
    if(, userId) { }
} || !userRuneId;
{
    console.error('[SacredRuneEngraver] Cannot uninstall rune: User ID and user Rune ID are required.'); // Updated log
    this.context.loggingService?.logError('Cannot uninstall rune: Missing required fields.', { userRuneId, userId });
    throw new Error('User ID and user Rune ID are required for uninstallation.');
}
try {
    // 1. Delete the user's rune definition from the database
    // Filter by ID and user_id to ensure ownership and that it's not a public rune
    const { count, error } = await this.supabase
        .from('runes')
        .delete()
        .eq('id', userRuneId)
        .eq('user_id', userId)
        .eq('is_public', false) // Ensure we only delete user-owned, non-public runes
        .select('id', { count: 'exact' }); // Select count to check if a row was deleted
    if (error)
        throw error;
    const deleted = count !== null && count > 0; // Check if count is greater than 0
    if (deleted) {
        console.log(`User rune ${userRuneId} deleted from Supabase.`);
        this.context.loggingService?.logInfo(`User rune deleted from DB: ${userRuneId}`, { userRuneId, userId });
        // 2. Remove the rune implementation from the in-memory registry
        if (this.runeImplementations.has(userRuneId)) {
            this.runeImplementations.delete(userRuneId);
            console.log(`[SacredRuneEngraver] User rune ${userRuneId} removed from memory registry.`); // Updated log
        }
        else {
            console.warn(`[SacredRuneEngraver] User rune ${userRuneId} not found in memory registry during uninstallation.`); // Updated log
        }
        // 3. Publish a 'rune_uninstalled' event
        this.context.eventBus?.publish('rune_uninstalled', { runeId: userRuneId, userId: userId }, userId); // Include userId in event
        this.context.loggingService?.logInfo(`User rune uninstalled: ${userRuneId}`, { userRuneId, userId: userId });
    }
    else {
        console.warn(`[SacredRuneEngraver] User rune ${userRuneId} not found for deletion or user mismatch.`); // Updated log
        this.context.loggingService?.logWarning(`User rune not found for uninstallation: ${userRuneId}`, { userRuneId, userId });
    }
    return deleted;
}
catch (error) {
    console.error(`[SacredRuneEngraver] Failed to uninstall user rune ${userRuneId}:`, error);
    this.context.loggingService?.logError(`Failed to uninstall user rune ${userRuneId}`, { userRuneId, userId: userId, error: error.message });
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
    console, : .log(`[SacredRuneEngraver] Attempting to update configuration for user rune ${userRuneId} for user ${userId}...`), // Updated log
    this: .context.loggingService?.logInfo(`Attempting to update rune configuration: ${userRuneId}`, { userRuneId, userId, newConfig }),
    if(, userId) { }
} || !userRuneId || newConfig === undefined;
{
    console.error('[SacredRuneEngraver] Cannot update rune configuration: User ID, rune ID, and new config are required.'); // Updated log
    this.context.loggingService?.logError('Cannot update rune configuration: Missing required fields.', { userRuneId, userId, newConfig });
    throw new Error('User ID, rune ID, and new config are required for configuration update.');
}
try {
    // 1. Update the configuration in the database
    // Filter by ID and user_id to ensure ownership and that it's not a public rune
    const { data, error } = await this.supabase
        .from('runes')
        .update({ configuration: newConfig })
        .eq('id', userRuneId)
        .eq('user_id', userId)
        .eq('is_public', false) // Ensure we only update user-owned, non-public runes
        .select() // Select the updated data
        .single();
    if (error)
        throw error;
    if (!data) {
        console.warn(`[SacredRuneEngraver] User rune ${userRuneId} not found for configuration update or user mismatch.`); // Updated log
        this.context.loggingService?.logWarning(`User rune not found for config update: ${userRuneId}`, { userRuneId, userId });
        return undefined;
    }
    const updatedRune = data;
    console.log(`User rune ${userRuneId} configuration updated in Supabase.`);
    this.context.loggingService?.logInfo(`User rune config updated in DB: ${userRuneId}`, { userRuneId, userId });
    // 2. Update the configuration in the in-memory registry
    const registeredRune = this.runeImplementations.get(userRuneId);
    if (registeredRune) {
        // Update the stored definition and potentially the instance
        registeredRune.definition.configuration = updatedRune.configuration;
        // If the rune instance has an updateConfiguration method, call it
        if (typeof registeredRune.instance.updateConfiguration === 'function') {
            registeredRune.instance.updateConfiguration(updatedRune.configuration);
            console.log(`[SacredRuneEngraver] Called updateConfiguration on rune instance ${userRuneId}.`); // Updated log
        }
        else {
            console.warn(`[SacredRuneEngraver] Rune instance ${userRuneId} does not have an updateConfiguration method.`); // Updated log
        }
        console.log(`[SacredRuneEngraver] User rune ${userRuneId} configuration updated in memory registry.`); // Updated log
    }
    else {
        console.warn(`[SacredRuneEngraver] User rune ${userRuneId} not found in memory registry during configuration update.`); // Updated log
    }
    // 3. Publish a 'rune_configuration_updated' event
    this.context.eventBus?.publish('rune_configuration_updated', updatedRune, userId); // Include userId in event
    this.context.loggingService?.logInfo(`Rune configuration updated: ${userRuneId}`, { userRuneId, userId: userId });
    return updatedRune;
}
catch (error) {
    console.error(`[SacredRuneEngraver] Failed to update rune configuration ${userRuneId}:`, error);
    this.context.loggingService?.logError(`Failed to update rune configuration ${userRuneId}`, { userRuneId, userId: userId, error: error.message });
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
    console, : .log(`[SacredRuneEngraver] Calculating rune capacity for user: ${userId}...`), // Updated log
    this: .context.loggingService?.logInfo(`Calculating rune capacity for user ${userId}`, { userId }),
    if(, userId) {
        console.error('[SacredRuneEngraver] Cannot calculate rune capacity: User ID is required.'); // Updated log
        this.context.loggingService?.logError('Cannot calculate rune capacity: User ID is required.');
        return null;
    },
    try: {
        // 1. Get the user's total capacity from their profile
        const: { data: profileData, error: profileError } = await this.supabase
            .from('profiles')
            .select('rune_capacity')
            .eq('id', userId)
            .single(),
        if(profileError) { }, throw: profileError,
        if(, profileData) {
            console.warn(`[SacredRuneEngraver] User profile not found for capacity calculation: ${userId}.`); // Updated log
            this.context.loggingService?.logWarning(`User profile not found for capacity calculation: ${userId}`, { userId });
            // Return default capacity if profile not found? Or null? Let's return null for now.
            return null;
        },
        const: totalCapacity = profileData.rune_capacity || 100, // Default to 100 if not set
        // 2. Sum the capacity_cost of all runes owned by the user (is_public = false AND user_id = userId)
        const: { data: userRunesData, error: runesError } = await this.supabase
            .from('runes')
            .select('capacity_cost')
            .eq('user_id', userId)
            .eq('is_public', false), // Only count user-owned runes
        if(runesError) { }, throw: runesError,
        const: currentCost = userRunesData.reduce((sum, rune) => sum + (rune.capacity_cost || 1), 0), // Sum costs, default to 1 if cost is null/undefined
        console, : .log(`[SacredRuneEngraver] Rune capacity for user ${userId}: ${currentCost}/${totalCapacity}.`), // Updated log
        this: .context.loggingService?.logInfo(`Rune capacity calculated for user ${userId}`, { userId, currentCost, totalCapacity }),
        return: { currentCost, capacity: totalCapacity }
    }, catch(error) {
        console.error(`[SacredRuneEngraver] Failed to calculate rune capacity for user ${userId}:`, error.message); // Updated log
        this.context.loggingService?.logError(`Failed to calculate rune capacity for user ${userId}`, { userId, error: error.message });
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
    console, : .log('[SacredRuneEngraver] Subscribing to runes realtime updates for user:', userId), // Updated log
    this: .context.loggingService?.logInfo('Subscribing to runes realtime updates', { userId }),
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
    .on('postgres_changes', { event: '*', schema: 'public', table: 'runes' }, (payload) => {
    console.log('[SacredRuneEngraver] Realtime rune change received:', payload); // Updated log
    const rune = payload.new; // New data for INSERT/UPDATE
    const oldRune = payload.old; // Old data for UPDATE/DELETE
    const eventType = payload.eventType;
    // Check if the rune is relevant to the current user (user-owned or public)
    // RLS should handle this, but client-side check adds safety.
    const relevantRune = rune || oldRune;
    const isRelevant = relevantRune?.user_id === userId || relevantRune?.is_public === true;
    if (isRelevant) {
        console.log(`[SacredRuneEngraver] Processing relevant rune change (${eventType}): ${relevantRune.id}`); // Updated log
        if (eventType === 'INSERT') {
            // Attempt to register the new rune if its implementation is available client-side
            // This is the tricky part for user-defined/installed runes.
            // For MVP, we assume public rune implementations are bundled and registered on startup.
            // User-installed runes fetched from DB on login are also processed by loadAndRegisterUserRunes.
            // This realtime insert event might be for a new public rune or a user rune installed elsewhere.
            // We need a way to get the implementation class here.
            // For MVP, we'll just log and rely on loadAndRegisterUserRunes on login/startup for user runes.
            // For public runes, we assume they are already registered. Updates are handled below.
            console.warn(`[SacredRuneEngraver] Realtime INSERT for rune ${rune.id}. Registration requires client-side implementation.`); // Updated log
            this.context.loggingService?.logWarning(`Realtime INSERT for rune ${rune.id}. Registration requires client-side implementation.`, { runeId: rune.id, userId });
            // If the implementation was available, we would do:
            // const clientImplementation = getImplementationForRune(rune); // Hypothetical helper
            // if (clientImplementation) {
            //     this.registerRune({ ...rune, implementation: clientImplementation });
            // }
        }
        else if (eventType === 'UPDATE') {
            // Update the definition and potentially the instance in the in-memory registry
            const registered = this.runeImplementations.get(rune.id);
            if (registered) {
                console.log(`[SacredRuneEngraver] Updating in-memory definition for rune ${rune.id}.`); // Updated log
                // Update the stored definition with the latest data from the DB
                registered.definition = rune;
                // If the rune instance has an updateConfiguration method, call it
                if (typeof registered.instance.updateConfiguration === 'function') {
                    registered.instance.updateConfiguration(rune.configuration);
                    console.log(`[SacredRuneEngraver] Called updateConfiguration on rune instance ${rune.id}.`); // Updated log
                }
            }
            else {
                console.warn(`[SacredRuneEngraver] Realtime UPDATE for rune ${rune.id} not found in memory registry.`); // Updated log
                this.context.loggingService?.logWarning(`Realtime UPDATE for rune ${rune.id} not found in memory registry.`, { runeId: rune.id, userId });
                // If the rune should be in memory (e.g., user rune), attempt to load and register it.
                if (rune.user_id === userId && !rune.is_public) {
                    console.log(`[SacredRuneEngraver] Attempting to load and register user rune ${rune.id} after update.`); // Updated log
                    this.loadAndRegisterUserRunes(userId).catch(err => console.error('Error loading user runes after update:', err));
                }
            }
        }
        else if (eventType === 'DELETE') {
            // Remove the rune from the in-memory registry
            if (this.runeImplementations.has(oldRune.id)) {
                console.log(`[SacredRuneEngraver] Removing rune ${oldRune.id} from in-memory registry.`); // Updated log
                this.runeImplementations.delete(oldRune.id);
            }
            else {
                console.warn(`[SacredRuneEngraver] Realtime DELETE for rune ${oldRune.id} not found in memory registry.`); // Updated log
                this.context.loggingService?.logWarning(`Realtime DELETE for rune ${oldRune.id} not found in memory registry.`, { runeId: oldRune.id, userId });
            }
        }
        // Publish a general rune event for other modules/UI to react
        this.context.eventBus?.publish(`rune_${eventType.toLowerCase()}`, rune || oldRune, userId); // e.g., 'rune_insert', 'rune_update', 'rune_delete'
        // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly
        // this.context.syncService?.handleRemoteDataChange('runeEngraftingCenter', eventType, rune || oldRune, userId);
    }
    else {
        console.log('[SacredRuneEngraver] Received rune change not relevant to current user (filtered by RLS or client-side).'); // Updated log
    }
})
    .subscribe((status, err) => {
    console.log('[SacredRuneEngraver] Rune subscription status:', status); // Updated log
    if (status === 'CHANNEL_ERROR') {
        console.error('[SacredRuneEngraver] Rune subscription error:', err); // Updated log
        this.context.loggingService?.logError('Rune subscription error', { userId, error: err?.message });
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
    this.context.loggingService?.logInfo('Unsubscribing from runes realtime updates');
    this.supabase.removeChannel(this.runesSubscription);
    this.runesSubscription = null;
}
`` `;
