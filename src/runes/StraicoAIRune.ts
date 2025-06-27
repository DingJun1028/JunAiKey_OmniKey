// src/runes/StraicoAIRune.ts
// Straico AI Rune Implementation
// Provides methods to interact with the Straico AI API via the ApiProxy.
// This Rune is an example of an 'ai-agent' type Rune.

import { SystemContext, Rune } from '../interfaces';
// import { ApiProxy } from '../proxies/apiProxy'; // Access via context
// import { LoggingService } from '../core/logging/LoggingService'; // Access via context

/**
 * Implements the Straico AI Rune, allowing interaction with the Straico AI API.
 * This is an example of an 'ai-agent' type Rune.
 */
export class StraicoAIRune {
    private context: SystemContext;
    private rune: Rune; // Reference to the Rune definition

    constructor(context: SystemContext, rune: Rune) {
        this.context = context;
        this.rune = rune;
        console.log(`[Rune] StraicoAIRune initialized for ${rune.name}.`);

        // Validate configuration (e.g., check if API key is available)
        if (!this.rune.configuration?.apiKey) {
             console.warn(`[Rune] StraicoAIRune ${rune.name} is missing API key in configuration.`);
             this.context.loggingService?.logWarning(`StraicoAIRune missing API key`, { runeId: rune.id });
             // The ApiProxy will also check for the key, but warning here is good.
        }
    }

    /**
     * Sends a prompt for text completion to the Straico AI API.
     * Corresponds to the 'promptCompletion' method in the manifest.
     * @param params Parameters for the completion, e.g., { prompt: string, max_tokens?: number }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The AI completion result.
     */
    async promptCompletion(params: { prompt: string, max_tokens?: number, temperature?: number }, userId: string): Promise<any> {
        console.log(`[Rune] ${this.rune.name}.promptCompletion called by user ${userId}.`);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.promptCompletion`, { runeId: this.rune.id, userId, params: { promptLength: params?.prompt?.length, max_tokens: params?.max_tokens } });

        if (!params?.prompt) {
            throw new Error('Prompt is required for promptCompletion.');
        }

        try {
            // Use ApiProxy to call the Straico AI API endpoint for completion
            // Assuming Straico uses a standard completion endpoint like /completions or /generate
            // The actual endpoint and payload structure need to be confirmed from Straico API docs.
            // For simulation, let's assume a /completions endpoint with prompt, max_tokens, temperature.
            const endpoint = '/completions'; // Hypothetical Straico endpoint
            const method = 'POST';
            const data = {
                prompt: params.prompt,
                max_tokens: params.max_tokens || 150, // Default max tokens
                temperature: params.temperature || 0.7, // Default temperature
                // Add other Straico-specific parameters as needed
            };

            const result = await this.context.apiProxy?.callStraicoAPI(endpoint, method, data);

            console.log(`[Rune] ${this.rune.name}.promptCompletion result:`, result);
            // Assuming the result structure is like { text: string } or similar
            return { status: 'success', data: result };

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.promptCompletion:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.promptCompletion`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Straico AI API call failed: ${error.message}`);
        }
    }

    /**
     * Sends messages for a chat-based interaction to the Straico AI API.
     * Corresponds to the 'chat' method in the manifest.
     * @param params Parameters for the chat, e.g., { messages: Array<{ role: string, content: string }>, model?: string }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The AI chat response.
     */
    async chat(params: { messages: Array<{ role: string, content: string }>, model?: string, max_tokens?: number, temperature?: number }, userId: string): Promise<any> {
         console.log(`[Rune] ${this.rune.name}.chat called by user ${userId}.`);
         this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.chat`, { runeId: this.rune.id, userId, params: { messageCount: params?.messages?.length, model: params?.model, max_tokens: params?.max_tokens } });

         if (!params?.messages || !Array.isArray(params.messages) || params.messages.length === 0) {
             throw new Error('Messages array is required for chat.');
         }

         try {
             // Use ApiProxy to call the Straico AI API endpoint for chat completions
             // Assuming Straico uses a standard chat endpoint like /chat/completions
             // The actual endpoint and payload structure need to be confirmed from Straico API docs.
             // For simulation, let's assume a /chat/completions endpoint with messages, model, max_tokens, temperature.
             const endpoint = '/chat/completions'; // Hypothetical Straico endpoint
             const method = 'POST';
             const data = {
                 messages: params.messages,
                 model: params.model || 'straico-default-chat-model', // Default model
                 max_tokens: params.max_tokens || 500, // Default max tokens
                 temperature: params.temperature || 0.7, // Default temperature
                 // Add other Straico-specific parameters as needed
             };

             const result = await this.context.apiProxy?.callStraicoAPI(endpoint, method, data);

             console.log(`[Rune] ${this.rune.name}.chat result:`, result);
             // Assuming the result structure is like { choices: [{ message: { role: string, content: string } }] } or similar
             return { status: 'success', data: result };

         } catch (error: any) {
             console.error(`[Rune] Error executing ${this.rune.name}.chat:`, error);
             this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.chat`, { runeId: this.rune.id, userId, error: error.message });
             throw new Error(`Straico AI API call failed: ${error.message}`);
         }
    }


    /**
     * Method to update configuration (optional, but good practice for API keys).
     * @param config The new configuration object.
     */
    updateConfiguration(config: any): void {
        console.log(`[Rune] ${this.rune.name} configuration updated:`, config);
        this.rune.configuration = config; // Update the configuration on the rune object
        // TODO: Re-initialize any internal clients if configuration changes affect them
    }

    // Add other Straico AI interaction methods as needed
    // e.g., generateImage, analyzeSentiment, summarizeText
}