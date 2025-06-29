// src/runes/MobileGitSyncRune.ts
// Mobile Git Sync Rune Implementation
// Provides methods to interact with a simulated mobile Git client via the SyncService.
// This Rune is an example of a 'device-adapter' type Rune.
// import { SyncService } from '../modules/sync/SyncService'; // Access via context
// import { LoggingService } from '../core/logging/LoggingService'; // Access via context
/**
 * Implements the Mobile Git Sync Rune, allowing interaction with a simulated mobile Git client.
 * This is an example of a 'device-adapter' type Rune.
 */
export class MobileGitSyncRune {
    constructor(context, rune) {
        this.context = context;
        this.rune = rune;
        console.log(`[Rune] MobileGitSyncRune initialized for ${rune.name}.`);
        // Validate configuration (e.g., check if repoUrl is set)
        if (!this.rune.configuration?.repo_url) {
            console.warn(`[Rune] MobileGitSyncRune ${rune.name} is missing repo_url in configuration.`);
            this.context.loggingService?.logWarning(`MobileGitSyncRune missing repo_url`, { runeId: rune.id });
        }
    }
    /**
     * Simulates pulling changes from the remote Git repository on the mobile device.
     * Corresponds to the 'pull' method in the manifest.
     * @param params Optional parameters (e.g., branch).
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The simulated sync result.
     */
    async pull(params, userId) {
        console.log(`[Rune] ${this.rune.name}.pull called by user ${userId}.`);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.pull`, { runeId: this.rune.id, userId, params });
        const repoUrl = this.rune.configuration?.repo_url;
        if (!repoUrl) {
            throw new Error(`Rune configuration missing 'repo_url'. Cannot perform pull.`);
        }
        try {
            // Use SyncService to perform the simulated mobile Git pull
            const result = await this.context.syncService?.syncMobileGitRepo(userId, 'pull', { repoUrl, ...params });
            console.log(`[Rune] ${this.rune.name}.pull result:`, result);
            return { status: 'success', data: result };
        }
        catch (error) {
            console.error(`[Rune] Error executing ${this.rune.name}.pull:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.pull`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Mobile Git pull failed: ${error.message}`);
        }
    }
    /**
     * Simulates pushing changes to the remote Git repository from the mobile device.
     * Corresponds to the 'push' method in the manifest.
     * @param params Optional parameters (e.g., branch, commitMessage).
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The simulated sync result.
     */
    async push(params, userId) {
        console.log(`[Rune] ${this.rune.name}.push called by user ${userId}.`);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.push`, { runeId: this.rune.id, userId, params });
        const repoUrl = this.rune.configuration?.repo_url;
        if (!repoUrl) {
            throw new Error(`Rune configuration missing 'repo_url'. Cannot perform push.`);
        }
        try {
            // Use SyncService to perform the simulated mobile Git push
            const result = await this.context.syncService?.syncMobileGitRepo(userId, 'push', { repoUrl, ...params });
            console.log(`[Rune] ${this.rune.name}.push result:`, result);
            return { status: 'success', data: result };
        }
        catch (error) {
            console.error(`[Rune] Error executing ${this.rune.name}.push:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.push`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Mobile Git push failed: ${error.message}`);
        }
    }
    /**
     * Simulates bidirectional sync (pull then push) for the mobile Git repository.
     * Corresponds to the 'bidirectional' method in the manifest.
     * @param params Optional parameters (e.g., branch, commitMessage).
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The simulated sync result.
     */
    async bidirectional(params, userId) {
        console.log(`[Rune] ${this.rune.name}.bidirectional called by user ${userId}.`);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.bidirectional`, { runeId: this.rune.id, userId, params });
        const repoUrl = this.rune.configuration?.repo_url;
        if (!repoUrl) {
            throw new Error(`Rune configuration missing 'repo_url'. Cannot perform bidirectional sync.`);
        }
        try {
            // Use SyncService to perform the simulated mobile Git bidirectional sync
            const result = await this.context.syncService?.syncMobileGitRepo(userId, 'bidirectional', { repoUrl, ...params });
            console.log(`[Rune] ${this.rune.name}.bidirectional result:`, result);
            return { status: 'success', data: result };
        }
        catch (error) {
            console.error(`[Rune] Error executing ${this.rune.name}.bidirectional:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.bidirectional`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Mobile Git bidirectional sync failed: ${error.message}`);
        }
    }
    /**
     * Method to update configuration (e.g., repoUrl, credentials).
     * @param config The new configuration object.
     */
    updateConfiguration(config) {
        console.log(`[Rune] ${this.rune.name} configuration updated:`, config);
        this.rune.configuration = config; // Update the configuration on the rune object
        // TODO: Re-initialize any internal clients if configuration changes affect them
    }
}
