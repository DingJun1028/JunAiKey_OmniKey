// src/runes/BlueccAPIRune.ts
// Blue.cc API Rune Implementation
// Provides methods to interact with the Blue.cc API via the ApiProxy.
// This Rune is an example of an 'api-adapter' type Rune.

import { SystemContext, Rune } from '../interfaces';
// import { ApiProxy } from '../proxies/apiProxy'; // Access via context
// import { LoggingService } from '../core/logging/LoggingService'; // Access via context

/**
 * Implements the Blue.cc API Rune, allowing interaction with the Blue.cc API.
 * This is an example of an 'api-adapter' type Rune.
 */
export class BlueccAPIRune {
    private context: SystemContext;
    private rune: Rune; // Reference to the Rune definition

    constructor(context: SystemContext, rune: Rune) {
        this.context = context;
        this.rune = rune;
        console.log(`[Rune] BlueccAPIRune initialized for ${rune.name}.`);

        // Validate configuration (e.g., check if API key is available)
        if (!this.rune.configuration?.apiKey) {
             console.warn(`[Rune] BlueccAPIRune ${rune.name} is missing API key in configuration.`);
             this.context.loggingService?.logWarning(`BlueccAPIRune missing API key`, { runeId: rune.id });
             // The ApiProxy will also check for the key, but warning here is good.
        }
    }

    /**
     * Makes a generic API call to the Blue.cc API.
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
            // Use ApiProxy to call the Blue.cc API endpoint
            // ApiProxy handles authentication, rate limiting, etc.
            const result = await this.context.apiProxy?.callBlueAPI(params.endpoint, params.method as any, params.data, params.config);

            console.log(`[Rune] ${this.rune.name}.callAPI result:`, result);
            return { status: 'success', data: result };

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.callAPI:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.callAPI`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Blue.cc API call failed: ${error.message}`);
        }
    }

    // TODO: Add more specific methods based on Blue.cc API capabilities if needed
    // Example:
    // async listUsers(params: { query?: string }, userId: string): Promise<any> {
    //     console.log(`[Rune] ${this.rune.name}.listUsers called by user ${userId}.`);
    //     this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.listUsers`, { runeId: this.rune.id, userId, params });
    //     try {
    //         const result = await this.context.apiProxy?.callBlueAPI('/v1/users', 'GET', undefined, { params });
    //         return { status: 'success', data: result };
    //     } catch (error: any) {
    //         console.error(`[Rune] Error executing ${this.rune.name}.listUsers:`, error);
    //         this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.listUsers`, { runeId: this.rune.id, userId, error: error.message });
    //         throw new Error(`Blue.cc API call failed: ${error.message}`);
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

    // Add other Blue.cc interaction methods as needed
}