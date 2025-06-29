"use strict";
`` `typescript
// src/agents/DecisionAgent.ts
// \u610f\u5716\u6c7a\u7b56\u4ee3\u7406 (Decision Agent)
// Responsible for analyzing user input to determine intent and parameters.\n// Part of the Agent System Architecture.\n// Design Principle: Translates natural language input into structured action intents.\n// --- Modified: Add robust error handling and logging --\n// --- Modified: Ensure structured error responses are returned --\n// --- Modified: Add more detailed logging --\n// --- Modified: Ensure handleMessage correctly returns ActionIntent in data --\n// --- Modified: Ensure analyzeIntentAndDecideAction can identify create_task intent --\n// --- New: Add placeholder logic for recognizing \"deep thinking\" intents --\n// --- Modified: Update analyze_intent payload to include multimodal content --\n// --- Modified: Update handleMessage to use requestAgent for provider agent calls --\n// --- Modified: Ensure consistent error handling and logging --\n\n\nimport { SystemContext, ActionIntent } from '../../interfaces'; // Import SystemContext and ActionIntent\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\nimport { AgentFactory } from './AgentFactory'; // Import AgentFactory\n\n// Import existing services this agent will interact with\n// import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // Access via requestAgent\n\n\nexport class DecisionAgent extends BaseAgent { // Extend BaseAgent\n    // private wisdomSecretArt: WisdomSecretArt; // Access via requestAgent\n\n    constructor(context: SystemContext) {\n        // --- Modified: Call super constructor with agent name ---\n        super('decision', context); // Call BaseAgent constructor with agent name 'decision'\n        // --- End Modified ---\n        // this.wisdomSecretArt = context.wisdomSecretArt; // Get existing service from context\n    }\n\n    /**\n     * Initializes the Decision Agent by getting references to other agents.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Get references to other agents from the factory\n            // This is how agents discover and communicate with each other\n            // this.wisdomSecretArt = this.context.wisdomSecretArt; // Access via context\n\n            console.log('[DecisionAgent] Other agents obtained.');\n        } catch (error) {\n            console.error('[DecisionAgent] Failed to get other agents during init:', error);\n            // Handle error - maybe log or set agent status to unhealthy\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the Decision Agent.\n     * Typically processes user input strings to determine intent.\n     * @param message The message to handle. Expected type: 'analyze_intent'. Payload: { text: string, context?: any }.\n     * @returns Promise<AgentResponse> The response containing the determined ActionIntent.\\\n     */\\\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\\\\\n        console.log(`[DecisionAgent];
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
`);\\\\\\\n        this.context.loggingService?.logInfo(`;
DecisionAgent;
received;
message: $;
{
    message.type;
}
`, { messageType: message.type, correlationId: message.correlationId, sender: message.sender, payload: message.payload });\\\\\\\n\\\n\\\n        if (message.type !== 'analyze_intent') { // Specific type for intent analysis requests\\\\\\\n             // Return error response for unknown message types\\\\\\\n             return { success: false, error: `;
Unknown;
message;
type;
for (DecisionAgent; ; )
    : $;
{
    message.type;
}
` };\\\\\\\n        }\\\\\\n\\\n        const userId = this.context.currentUser?.id;\\\\\\\n        if (!userId) {\\\\\\\n             // Return error response if user is not authenticated\\\\\\\
             return { success: false, error: 'User not authenticated.' };\\\\\\\n        }\\\\\\n\\\n        // --- Modified: Extract multimodal input from payload ---\\\\\\
        const { text, imageUrl, audioUrl, fileUrl, fileMetadata, context } = message.payload;\\\\\\\
        // --- End Modified ---\\\\\\
\\\n        if (!text && !imageUrl && !audioUrl && !fileUrl) {\\\\\\\
             // Return error response if input is empty\\\\\\\
             return { success: false, error: 'Input text or multimodal content is required for intent analysis.' };\\\\\\\
        }\\\\\\
\\\n        this.context.loggingService?.logInfo('DecisionAgent analyzing intent.', { userId, input: text, imageUrl, audioUrl, fileUrl, correlationId: message.correlationId });\\\\\\\
\\\n        try {\\\\\\\
            // Use WisdomSecretArt to analyze the user input and decide on an action intent.\\\
            // WisdomSecretArt handles the interaction with LLMs for this purpose.\\\
            // Pass all input types to WisdomSecretArt.\\\
            console.log('[DecisionAgent] Calling WisdomSecretArt to analyze intent...');\\\
            // --- Modified: Use requestAgent for WisdomSecretArt call ---\\\
            if (!this.context.agentFactory?.getAgent('wisdom')) {\\\
                 throw new Error('WisdomAgent not available for intent analysis.');\\\
            }\\\
            const decidedAction: ActionIntent = await this.requestAgent(\\\
                'wisdom', // Target the WisdomAgent\\\
                'analyze_intent_and_decide_action', // Message type for WisdomAgent\\\
                { userInput: text, imageUrl, audioUrl, fileUrl, fileMetadata, inputContext: context }, // Pass input and context\\\
                15000 // Timeout for LLM analysis\\\
            ).then(response => {\\\
                 if (!response.success || !response.data) {\\\
                     throw new Error(response.error || 'WisdomAgent failed to return a valid decision.');\\\
                 }\\\
                 // Assuming WisdomAgent returns the ActionIntent directly in its data field\\\
                 return response.data as ActionIntent;\\\
            });\\\
            // --- End Modified ---\\\
\\\n\\\n            console.log('[DecisionAgent] Intent analysis complete. Decided Action:', decidedAction);\\\
            this.context.loggingService?.logInfo('DecisionAgent intent analysis complete.', { userId, decision: decidedAction, correlationId: message.correlationId });\\\
\\\n            // --- New: Placeholder logic for recognizing \"deep thinking\" intents ---\\\
            // This is where you would add logic to identify requests for complex workflows or specific modes.\\\
            // The LLM might return a specific action like 'trigger_deep_thinking' or include flags in the parameters.\\\
            // For MVP, let's simulate recognizing a specific phrase or action type.\\\
            if (decidedAction.action === 'create_agentic_flow' || decidedAction.action === 'start_agentic_flow') {\\\
                 console.log('[DecisionAgent] Identified potential \"deep thinking\" intent (Agentic Flow).');\\\
                 // The decidedAction already reflects the intent to use a flow.\\\
                 // No need to change decidedAction here, just log or add metadata if needed.\\\
                 // decidedAction.parameters.mode = 'deep_thinking'; // Example: add a mode flag\\\
            } else if (text?.toLowerCase().includes('deep thinking mode')) { // Simulate recognizing a phrase\\\
                 console.log('[DecisionAgent] Identified \"deep thinking\" mode request based on phrase.');\\\
                 // If the user asks for \"deep thinking mode\", maybe override the decided action\\\
                 // to trigger a specific default \"deep thinking\" flow or task.\\\
                 // For MVP, let's just log it.\\\
                 this.context.loggingService?.logInfo('DecisionAgent identified \"deep thinking\" phrase.', { userId, input: text, correlationId: message.correlationId });\\\
                 // You could modify decidedAction here, e.g.:\\\
                 // decidedAction = { action: 'start_agentic_flow', parameters: { flowId: 'default-deep-thinking-flow-id' }, confidence: 1 };\\\
            }\\\
            // --- End New ---\\\
\\\n\\\n            // Return the decided action intent as the data in the AgentResponse\\\
            const successResponse: AgentResponse = { success: true, data: decidedAction };\\\
            // Send response back if the original message had a correlationId\\\
            if (message.correlationId) {\\\
                this.sendResponse(message, successResponse);\\\
            }\\\
            return successResponse; // Also return for internal processing\\\
\\\n\\\n        } catch (error: any) {\\\
            console.error(`[DecisionAgent];
Error;
analyzing;
intent;
for (message; $; { message, : .type }(Correlation, ID, $, { message, : .correlationId || 'N/A' }))
    : `, error);\\\
            this.context.loggingService?.logError(`;
DecisionAgent;
error;
analyzing;
intent. `, { userId, input: text, error: error.message, correlationId: message.correlationId });\\\
\\\n            // If intent analysis fails, return an error response\\\
            const errorResponse: AgentResponse = { success: false, error: error.message || 'An error occurred during intent analysis.' };\\\
            // Send error response back if the original message had a correlationId\\\
            if (message.correlationId) {\\\
                this.sendResponse(message, errorResponse);\\\
            }\\\
            return errorResponse; // Also return for internal processing\\\
        }\\\
    }\\\
\\\n    // TODO: Implement methods to send messages to other agents if needed\\\n    // e.g., notifying EvolutionAgent about a difficult-to-analyze input\\\
}\\\
` ``;
