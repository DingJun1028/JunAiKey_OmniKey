"use strict";
`` `typescript
// src/agents/SuggestionAgent.ts
// \u5efa\u8b70\u4ee3\u7406\u4eba (Suggestion Agent)
// Handles real-time analysis of user input to provide proactive suggestions (smart suggestions, KB results).\
// Part of the Agent System Architecture.\
// Design Principle: Provides timely and relevant assistance based on user context.\
// --- Modified: Add robust error handling and logging --\\\
// --- Modified: Ensure structured error responses are returned --\\\
// --- Modified: Add more detailed logging --\\\
// --- Modified: Ensure handleMessage correctly returns ActionIntent in data --\\\
// --- Modified: Ensure analyzeIntentAndDecideAction can identify create_task intent --\\\
// --- New: Add placeholder logic for recognizing \"deep thinking\" intents --\\\
// --- Modified: Update analyze_input_for_suggestions payload to include multimodal content --\\\
// --- Modified: Update handleMessage to use requestAgent for provider agent calls --\\\
// --- Modified: Update handleMessage to use requestAgent for KnowledgeAgent and WisdomAgent calls ---\\\
\
\
import { SystemContext, ActionIntent, KnowledgeRecord } from '../interfaces'; // Import types\
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\
import { AgentFactory } from './AgentFactory'; // Import AgentFactory\
\
// Import existing services this agent will interact with (temporarily)\
// In a full refactor, the logic from these services might move INTO this agent.\
// For MVP, this agent acts as a proxy to the existing services.\
// import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // Access via context\
// import { KnowledgeSync } from '../modules/knowledgeSync'; // Access via context\
\
\
export class SuggestionAgent extends BaseAgent {\
    // private wisdomSecretArt: WisdomSecretArt; // Access via requestAgent\
    // private knowledgeSync: KnowledgeSync; // Access via requestAgent\
\
    constructor(context: SystemContext) {\
        super('suggestion', context);\
        // Services are accessed via context\
    }\
\
    /**\
     * Initializes the Suggestion Agent.\
     */\
    init(): void {\
        super.init(); // Call base init\
        try {\
            // Services are accessed via requestAgent, no need to get them here explicitly for MVP\
            console.log('[SuggestionAgent] Init completed.');\
        } catch (error) {\
            console.error('[SuggestionAgent] Failed during init:', error);\
            // Handle error\
        }\
    }\
\
\
    /**\
     * Handles messages directed to the Suggestion Agent.\
     * Typically processes user input strings for real-time suggestions.\
     * @param message The message to handle. Expected type: 'analyze_input_for_suggestions'. Payload: { text: string, userId: string, context?: any }.\
     * @returns Promise<AgentResponse> The response containing suggestions and KB results.\
     */\
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\
        console.log(`[SuggestionAgent];
Handling;
message: $;
{
    message.type;
}
(Correlation);
ID: $;
{
    message.correlationId || 'N/A';
}
`);\\\
\\\n        const userId = this.context.currentUser?.id;\\\
        if (!userId) {\\\
             // Cannot provide suggestions without a user\\\
             return { success: false, error: 'User not authenticated.' };\\\
        }\\\n\\\n        if (message.type !== 'analyze_input_for_suggestions') { // Specific type for suggestion requests\\\
             return { success: false, error: `;
Unknown;
message;
type;
for (SuggestionAgent; ; )
    : $;
{
    message.type;
}
` };\\\
        }\\\n\\\n        const { text, context } = message.payload;\\\
\\\n        // If input is empty, clear suggestions and return\\\
        if (!text || text.trim() === '') {\\\
             console.log('[SuggestionAgent] Input is empty, clearing suggestions.');\\\
             // Send an update message back to the UI to clear suggestions\\\
             this.sendMessage({\\\n                 type: 'suggestion_update', // Message type for UI updates\\\n                 payload: { userId: userId, suggestions: [], knowledgeResults: [], isLoadingSuggestions: false, isLoadingKnowledge: false },\\\
                 // No recipient, broadcast to any UI component listening\\\
             });\\\
             return { success: true, data: { message: 'Input empty, suggestions cleared.' } };\\\
        }\\\n\\\n\\\n        console.log(`[SuggestionAgent];
Analyzing;
input;
for (suggestions; ; )
    : ;
"${text}\\\\\\\\\\\\\\\" for user: ${userId}`);\\\
        this.context.loggingService?.logInfo(`SuggestionAgent analyzing input: \\\\\\\\\\\\\\\"${text}\\\\\\\\\\\\\\\"`, { userId, input: text, context });\\\
\\\n\\\n\\\n        let smartSuggestions: ActionIntent[] = [];\\\
        let knowledgeResults: KnowledgeRecord[] = [];\\\
        let suggestionsError: string | null = null;\\\
        let knowledgeError: string | null = null;\\\
\\\n\\\n        // --- Modified: Fetch suggestions from WisdomAgent ---\\\
        if (this.context.agentFactory?.getAgent('wisdom')) { // Check if WisdomAgent is available\\\
            try {\\\
                // Call the WisdomAgent to get suggestions\\\
                const wisdomResponse = await this.requestAgent(\\\n                    'wisdom', // Target the WisdomAgent\\\n                    'get_suggestions_for_input', // Message type for WisdomAgent\\\
                    { text: text, context: context }, // Pass input text and context\\\
                    5000 // Timeout for suggestion generation\\\
                );\\\
\\\n                if (wisdomResponse.success && Array.isArray(wisdomResponse.data)) {\\\
                    smartSuggestions = wisdomResponse.data;\\\
                } else {\\\
                    suggestionsError = wisdomResponse.error || 'WisdomAgent failed to get suggestions.';\\\
                    console.error('[SuggestionAgent] Error fetching suggestions from WisdomAgent:', suggestionsError);\\\
                    this.context.loggingService?.logError('SuggestionAgent error fetching suggestions.', { userId, input: text, error: suggestionsError });\\\
                }\\\
            } catch (err: any) {\\\
                console.error('[SuggestionAgent] Error fetching suggestions from WisdomAgent:', err);\\\
                this.context.loggingService?.logError('SuggestionAgent error fetching suggestions.', { userId, input: text, error: err.message });\\\
                suggestionsError = `Failed to get suggestions: ${err.message}`;\\\
            }\\\
        } else {\\\
             console.warn('[SuggestionAgent] WisdomAgent not available for suggestions.');\\\
             suggestionsError = 'Suggestion service unavailable.';\\\
        }\\\n        // --- End Modified ---\\\
\\\n\\\n        // --- Modified: Fetch knowledge results from KnowledgeAgent ---\\\
        if (this.context.agentFactory?.getAgent('knowledge')) { // Check if KnowledgeAgent is available\\\
            try {\\\
                // Call the KnowledgeAgent to search knowledge\\\
                const knowledgeResponse = await this.requestAgent(\\\n                    'knowledge', // Target the KnowledgeAgent\\\n                    'query_knowledge', // Message type for KnowledgeAgent\\\
                    { query: text, useSemanticSearch: true, context: context }, // Pass query, options, context\\\
                    5000 // Timeout for knowledge search\\\
                );\\\
\\\n                if (knowledgeResponse.success && Array.isArray(knowledgeResponse.data)) {\\\
                    knowledgeResults = knowledgeResponse.data;\\\
                } else {\\\
                    knowledgeError = knowledgeResponse.error || 'KnowledgeAgent failed to search knowledge.';\\\
                    console.error('[SuggestionAgent] Error fetching knowledge results from KnowledgeAgent:', knowledgeError);\\\
                    this.context.loggingService?.logError('SuggestionAgent error fetching knowledge.', { userId, input: text, error: knowledgeError });\\\
                }\\\
            } catch (err: any) {\\\
                console.error('[SuggestionAgent] Error fetching knowledge results from KnowledgeAgent:', err);\\\
                this.context.loggingService?.logError('SuggestionAgent error fetching knowledge.', { userId, input: text, error: err.message });\\\
                knowledgeError = `Failed to get knowledge results: ${err.message}`;\\\
            }\\\n        } else {\\\
             console.warn('[SuggestionAgent] KnowledgeAgent not available for knowledge results.');\\\
             knowledgeError = 'Knowledge search unavailable.';\\\
        }\\\n        // --- End Modified ---\\\n\\\n\\\n        // Simulate processing time (if not already included in service calls)\\\n        // await new Promise(resolve => setTimeout(resolve, 300));\\\n\\\n\\\n        console.log(`[SuggestionAgent] Analysis complete. Found ${smartSuggestions.length} suggestions and ${knowledgeResults.length} KB results.`);\\\
        this.context.loggingService?.logInfo(`SuggestionAgent analysis complete.`, { userId, input: text, suggestionsCount: smartSuggestions.length, kbResultsCount: knowledgeResults.length });\\\
\\\n\\\n        // --- Send update message back to the UI ---\\\
        // Publish a message on the MessageBus for UI components to listen to\\\
        this.sendMessage({\\\n            type: 'suggestion_update', // Message type for UI updates\\\n            payload: {\\\n                userId: userId, // Include user ID so UI can filter\\\n                suggestions: smartSuggestions,\\\n                knowledgeResults: knowledgeResults,\\\n                isLoadingSuggestions: false, // Indicate loading is finished\\\n                isLoadingKnowledge: false, // Indicate loading is finished\\\n                error: suggestionsError || knowledgeError, // Include any errors\\\n            },\\\n            sender: this.agentName, // Identify the sender agent\\\n            // No recipient, broadcast to any UI component listening\\\n        });\\\
\\\n\\\n        // Return a success response (the actual data is sent via the update message)\\\
        return { success: true, data: { message: 'Suggestions analysis complete.' } };\\\
\\\n    } catch (error: any) {\\\
        console.error(`[SuggestionAgent] Error handling message ${message.type}:`, error);\\\
        this.context.loggingService?.logError(`SuggestionAgent error handling message ${message.type}.`, { userId, input: message.payload?.text, error: error.message });\\\
\\\n        // Send an error update message back to the UI\\\
        this.sendMessage({\\\n            type: 'suggestion_update', // Message type for UI updates\\\n            payload: {\\\n                userId: userId, // Include user ID\\\n                suggestions: [], // Clear suggestions on error\\\n                knowledgeResults: [], // Clear KB results on error\\\n                isLoadingSuggestions: false, // Indicate loading is finished\\\n                isLoadingKnowledge: false, // Indicate loading is finished\\\n                error: error.message, // Include error message\\\n            },\\\n            sender: this.agentName, // Identify the sender agent\\\n            // No recipient, broadcast\\\n        });\\\
\\\n        // Return an error response\\\
        return { success: false, error: error.message || 'An error occurred in SuggestionAgent.' };\\\
    }\\\n}\\\n```;
