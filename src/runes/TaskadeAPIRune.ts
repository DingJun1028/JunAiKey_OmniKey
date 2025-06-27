// src/runes/TaskadeAPIRune.ts
// Taskade API Rune Implementation
// Provides methods to interact with the Taskade API via the ApiProxy.
// This Rune is an example of an 'api-adapter' type Rune.

import { SystemContext, Rune } from '../interfaces';
// import { ApiProxy } from '../proxies/apiProxy'; // Access via context
// import { LoggingService } from '../core/logging/LoggingService'; // Access via context

/**
 * Implements the Taskade API Rune, allowing interaction with the Taskade API.
 * This is an example of an 'api-adapter' type Rune.
 */
export class TaskadeAPIRune {
    private context: SystemContext;
    private rune: Rune; // Reference to the Rune definition

    constructor(context: SystemContext, rune: Rune) {
        this.context = context;
        this.rune = rune;
        console.log(`[Rune] TaskadeAPIRune initialized for ${rune.name}.`);

        // Validate configuration (e.g., check if API key is available)
        if (!this.rune.configuration?.apiKey) {
             console.warn(`[Rune] TaskadeAPIRune ${rune.name} is missing API key in configuration.`);
             this.context.loggingService?.logWarning(`TaskadeAPIRune missing API key`, { runeId: rune.id });
             // The ApiProxy will also check for the key, but warning here is good.
        }
    }

    /**
     * Makes a generic API call to the Taskade API.
     * Corresponds to the 'callAPI' method in the manifest.
     * @param params Parameters for the API call, e.g., { endpoint: string, method: string, data?: any, config?: any }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The API response data.
     */
    async callAPI(params: { endpoint: string, method: string, data?: any, config?: any }, userId: string): Promise<any> {
        console.log(`[Rune] ${this.rune.name}.callAPI called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.callAPI`, { runeId: this.rune.id, userId, params: { endpoint: params?.endpoint, method: params?.method } });

        if (!params?.endpoint || !params?.method) {
            throw new Error('Endpoint and method are required for callAPI.');
        }

        try {
            // Use ApiProxy to call the Taskade API endpoint
            // ApiProxy handles authentication, rate limiting, etc.
            const result = await this.context.apiProxy?.callTaskadeAPI(params.endpoint, params.method as any, params.data, params.config);

            console.log(`[Rune] ${this.rune.name}.callAPI result:`, result);
            return { status: 'success', data: result };

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.callAPI:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.callAPI`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Taskade API call failed: ${error.message}`);
        }
    }

    // TODO: Add more specific methods based on Taskade API capabilities if needed
    // Example:
    // async listProjects(params: { workspaceId: string }, userId: string): Promise<any> {
    //     console.log(`[Rune] ${this.rune.name}.listProjects called by user ${userId}.`);
    //     this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.listProjects`, { runeId: this.rune.id, userId, params });
    //     if (!params?.workspaceId) {
    //          throw new Error('workspaceId is required for listProjects.');
    //     }
    //     try {
    //         const result = await this.context.apiProxy?.callTaskadeAPI(`/workspaces/${params.workspaceId}/projects`, 'GET');
    //         return { status: 'success', data: result };
    //     } catch (error: any) {
    //         console.error(`[Rune] Error executing ${this.rune.name}.listProjects:`, error);
    //         this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.listProjects`, { runeId: this.rune.id, userId, error: error.message });
    //         throw new Error(`Taskade API call failed: ${error.message}`);
    //     }
    // }


    /**
     * Method to update configuration (optional, but good practice for API keys).
     * @param config The new configuration object.
     */
    updateConfiguration(config: any): void {
        console.log(`[Rune] ${this.rune.name} configuration updated:`, config);
        this.rune.configuration = config; // Update the configuration on the rune object
        // TODO: Re-initialize any internal clients if configuration changes affect them
    }

    // Add other Taskade interaction methods as needed
}