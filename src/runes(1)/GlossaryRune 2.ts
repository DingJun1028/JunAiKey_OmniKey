```typescript
// src/runes/GlossaryRune.ts
// Glossary Rune Implementation
// Provides methods to interact with the GlossaryService.
// This Rune is an example of a 'system-adapter' type Rune.

import { SystemContext, Rune, GlossaryTerm } from '../interfaces';
// import { GlossaryService } from '../core/glossary/GlossaryService'; // Access via context
// import { LoggingService } from '../core/logging/LoggingService'; // Access via context

/**
 * Implements the Glossary Rune, allowing interaction with the system's glossary storage.
 * This is an example of a 'system-adapter' type Rune.
 */
export class GlossaryRune {
    private context: SystemContext;
    private rune: Rune; // Reference to the Rune definition

    constructor(context: SystemContext, rune: Rune) {
        this.context = context;
        this.rune = rune;
        console.log(`[Rune] GlossaryRune initialized for ${rune.name}.`);

        // GlossaryRune relies on GlossaryService being initialized
        if (!this.context.glossaryService) {
             console.error(`[Rune] GlossaryRune ${rune.name} requires GlossaryService to be initialized.`);
             this.context.loggingService?.logError(`GlossaryRune requires GlossaryService`, { runeId: rune.id });
             // Throwing here might prevent the rune from being registered, which is appropriate.
             throw new Error('GlossaryService is not available.');
        }
    }

    /**
     * Creates a new glossary term.
     * Corresponds to the 'createTerm' method in the manifest.
     * @param params Parameters: { term: string, definition: string, related_concepts?: string[], pillar_domain?: string, is_public?: boolean }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The created term object.
     */
    async createTerm(params: { term: string, definition: string, related_concepts?: string[], pillar_domain?: string, is_public?: boolean }, userId: string): Promise<any> {
        console.log(`[Rune] ${this.rune.name}.createTerm called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.createTerm`, { runeId: this.rune.id, userId, params: { term: params?.term, is_public: params?.is_public } });

        if (!params?.term || !params?.definition) {
            throw new Error('term and definition are required for createTerm.');
        }

        try {
            // Use GlossaryService to create the term
            const createdTerm = await this.context.glossaryService.createTerm(params, userId, params.is_public);

            console.log(`[Rune] ${this.rune.name}.createTerm result:`, createdTerm);
            return { status: 'success', data: createdTerm, message: `Glossary term created: ${createdTerm?.term || params.term}` };

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.createTerm:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.createTerm`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Glossary term creation failed: ${error.message}`);
        }
    }

    /**
     * Retrieves glossary terms.
     * Corresponds to the 'getTerms' method in the manifest.
     * @param params Parameters: { pillarDomain?: string, searchTerm?: string }. Optional.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> An array of glossary term objects.
     */
    async getTerms(params: { pillarDomain?: string, searchTerm?: string }, userId: string): Promise<any> {
        console.log(`[Rune] ${this.rune.name}.getTerms called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.getTerms`, { runeId: this.rune.id, userId, params });

        try {
            // Use GlossaryService to get terms
            const terms = await this.context.glossaryService.getTerms(userId, params?.pillarDomain, params?.searchTerm);

            console.log(`[Rune] ${this.rune.name}.getTerms result (${terms.length} entries).`);
            return { status: 'success', data: { terms } };

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.getTerms:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.getTerms`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Glossary term retrieval failed: ${error.message}`);
        }
    }

    /**
     * Retrieves a specific glossary term by ID.
     * Corresponds to the 'getTermById' method in the manifest.
     * @param params Parameters: { termId: string }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The glossary term object or undefined.
     */
    async getTermById(params: { termId: string }, userId: string): Promise<any> {
        console.log(`[Rune] ${this.rune.name}.getTermById called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.getTermById`, { runeId: this.rune.id, userId, params });

        if (!params?.termId) {
            throw new Error('termId is required for getTermById.');
        }

        try {
            // Use GlossaryService to get the term by ID
            const term = await this.context.glossaryService.getTermById(params.termId, userId);

            console.log(`[Rune] ${this.rune.name}.getTermById result:`, term);
            if (term) {
                 return { status: 'success', data: term };
            } else {
                 return { status: 'not_found', message: `Glossary term ${params.termId} not found or not accessible.` };
            }

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.getTermById:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.getTermById`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Glossary term retrieval failed: ${error.message}`);
        }
    }

    /**
     * Updates an existing glossary term.
     * Corresponds to the 'updateTerm' method in the manifest.
     * @param params Parameters: { termId: string, updates: Partial<Omit<GlossaryTerm, 'id' | 'user_id' | 'creation_timestamp' | 'last_updated_timestamp'>> }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The updated term object or undefined.
     */
    async updateTerm(params: { termId: string, updates: Partial<Omit<GlossaryTerm, 'id' | 'user_id' | 'creation_timestamp' | 'last_updated_timestamp'>> }, userId: string): Promise<any> {
        console.log(`[Rune] ${this.rune.name}.updateTerm called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.updateTerm`, { runeId: this.rune.id, userId, params: { termId: params?.termId, updates: params?.updates } });

        if (!params?.termId || !params?.updates || Object.keys(params.updates).length === 0) {
            throw new Error('termId and updates are required for updateTerm.');
        }

        try {
            // Use GlossaryService to update the term
            const updatedTerm = await this.context.glossaryService.updateTerm(params.termId, params.updates, userId);

            console.log(`[Rune] ${this.rune.name}.updateTerm result:`, updatedTerm);
            if (updatedTerm) {
                 return { status: 'success', data: updatedTerm, message: `Glossary term updated: ${updatedTerm?.term || params.termId}` };
            } else {
                 return { status: 'not_found', message: `Glossary term ${params.termId} not found or not owned by user.` };
            }

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.updateTerm:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.updateTerm`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Glossary term update failed: ${error.message}`);
        }
    }

    /**
     * Deletes a glossary term.
     * Corresponds to the 'deleteTerm' method in the manifest.
     * @param params Parameters: { termId: string }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> Success status.
     */
    async deleteTerm(params: { termId: string }, userId: string): Promise<any> {
        console.log(`[Rune] ${this.rune.name}.deleteTerm called by user ${userId} with params:`, params);
        this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.deleteTerm`, { runeId: this.rune.id, userId, params });

        if (!params?.termId) {
            throw new Error('termId is required for deleteTerm.');
        }

        try {
            // Use GlossaryService to delete the term
            const success = await this.context.glossaryService.deleteTerm(params.termId, userId);

            console.log(`[Rune] ${this.rune.name}.deleteTerm successful:`, success);
            if (success) {
                 return { status: 'success', message: `Glossary term deleted: ${params.termId}` };
            } else {
                 return { status: 'not_found', message: `Glossary term ${params.termId} not found or not owned by user.` };
            }

        } catch (error: any) {
            console.error(`[Rune] Error executing ${this.rune.name}.deleteTerm:`, error);
            this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.deleteTerm`, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`Glossary term deletion failed: ${error.message}`);
        }
    }


    /**
     * Method to update configuration (optional).
     * @param config The new configuration object.
     */
    updateConfiguration(config: any): void {
        console.log(`[Rune] ${this.rune.name} configuration updated:`, config);
        this.rune.configuration = config; // Update the configuration on the rune object
        // TODO: Re-initialize any internal clients if configuration changes affect them
    }

    // Add other glossary interaction methods as needed
    // e.g., importTerms, exportTerms
}
```