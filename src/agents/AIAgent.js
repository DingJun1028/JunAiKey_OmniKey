var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/agents/AIAgent.ts\n// AI\u670D\u52D9\u4EE3\u7406 (AI Service Agent) - Placeholder\n// Routes AI-related tasks to specific AI provider agents.\n// Part of the Agent System Architecture.\n// Design Principle: Acts as a facade for various AI capabilities.\n// --- Modified: Add robust error handling and logging --\n// --- Modified: Ensure structured error responses are returned --\n// --- Modified: Add more detailed logging --\n// --- Modified: Ensure handleMessage correctly returns ActionIntent in data --\n// --- Modified: Ensure analyzeIntentAndDecideAction can identify create_task intent --\n// --- New: Add placeholder logic for recognizing \"deep thinking\" intents --\n// --- Modified: Update analyze_intent payload to include multimodal content --\n// --- Modified: Update handleMessage to use requestAgent for provider agent calls --\n\n\nimport { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\nimport { AgentFactory } from './AgentFactory'; // Import AgentFactory\n\n// Import placeholder AI provider agents\n// import { PollinationsAgent } from './PollinationsAgent'; // Assuming this exists\n// import { ChatXAgent } from './ChatXAgent'; // Assuming this exists\n// import { StraicoAgent } from './StraicoAgent'; // Assuming this exists\n\n\nexport class AIAgent extends BaseAgent {\n    // References to specific AI provider agents (obtained from AgentFactory)\n    // private pollinationsAgent: PollinationsAgent | null = null; // Access via requestAgent\n    // private chatxAgent: ChatXAgent | null = null; // Access via requestAgent\n    // private straicoAgent: StraicoAgent | null = null; // Access via requestAgent\n\n    constructor(context: SystemContext) {\n        super('ai_service', context);\n        // Agents are obtained from the factory during initialization\n    }\n\n    /**\n     * Initializes the AI Agent by getting references to provider agents.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Agents are accessed via requestAgent, no need to get them here explicitly for MVP\n            console.log('[AIAgent] Init completed.');\n        } catch (error) {\n            console.error('[AIAgent] Failed during init:', error);\n            // Handle error - maybe set agent status to unhealthy\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the AI Service Agent.\n     * Routes the message to the appropriate AI provider agent based on the payload.\n     * @param message The message to handle. Expected type: 'process_ai_task'. Payload: { provider: string, task: string, params: any }.\n     * @returns Promise<AgentResponse> The response from the provider agent.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\        console.log("], ["typescript\n// src/agents/AIAgent.ts\n// AI\\u670d\\u52d9\\u4ee3\\u7406 (AI Service Agent) - Placeholder\n// Routes AI-related tasks to specific AI provider agents.\n// Part of the Agent System Architecture.\n// Design Principle: Acts as a facade for various AI capabilities.\n// --- Modified: Add robust error handling and logging --\n// --- Modified: Ensure structured error responses are returned --\n// --- Modified: Add more detailed logging --\n// --- Modified: Ensure handleMessage correctly returns ActionIntent in data --\n// --- Modified: Ensure analyzeIntentAndDecideAction can identify create_task intent --\n// --- New: Add placeholder logic for recognizing \\\"deep thinking\\\" intents --\n// --- Modified: Update analyze_intent payload to include multimodal content --\n// --- Modified: Update handleMessage to use requestAgent for provider agent calls --\n\n\nimport { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\nimport { AgentFactory } from './AgentFactory'; // Import AgentFactory\n\n// Import placeholder AI provider agents\n// import { PollinationsAgent } from './PollinationsAgent'; // Assuming this exists\n// import { ChatXAgent } from './ChatXAgent'; // Assuming this exists\n// import { StraicoAgent } from './StraicoAgent'; // Assuming this exists\n\n\nexport class AIAgent extends BaseAgent {\n    // References to specific AI provider agents (obtained from AgentFactory)\n    // private pollinationsAgent: PollinationsAgent | null = null; // Access via requestAgent\n    // private chatxAgent: ChatXAgent | null = null; // Access via requestAgent\n    // private straicoAgent: StraicoAgent | null = null; // Access via requestAgent\n\n    constructor(context: SystemContext) {\n        super('ai_service', context);\n        // Agents are obtained from the factory during initialization\n    }\n\n    /**\n     * Initializes the AI Agent by getting references to provider agents.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Agents are accessed via requestAgent, no need to get them here explicitly for MVP\n            console.log('[AIAgent] Init completed.');\n        } catch (error) {\n            console.error('[AIAgent] Failed during init:', error);\n            // Handle error - maybe set agent status to unhealthy\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the AI Service Agent.\n     * Routes the message to the appropriate AI provider agent based on the payload.\n     * @param message The message to handle. Expected type: 'process_ai_task'. Payload: { provider: string, task: string, params: any }.\n     * @returns Promise<AgentResponse> The response from the provider agent.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\\\\\n        console.log("]))[AIAgent];
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
");\\\\        if (message.type !== 'process_ai_task') { // Use a generic type for tasks routed to AI\\             const errorResponse = { success: false, error: ";
Unknown;
message;
type;
for (AIAgent; ; )
    : $;
{
    message.type;
}
" };\\             if (message.correlationId) this.sendResponse(message, errorResponse);\\             this.context.loggingService?.logError(";
AIAgent;
failed: Unknown;
message;
message.type;
", { messageType: message.type, correlationId: message.correlationId });\\             return errorResponse;\\        }\\\\        const userId = this.context.currentUser?.id;\\        if (!userId) {\\             const errorResponse: AgentResponse = { success: false, error: 'User not authenticated.' };\\             if (message.correlationId) this.sendResponse(message, errorResponse);\\             this.context.loggingService?.logError('AIAgent failed: User not authenticated.', { correlationId: message.correlationId });\\             return errorResponse;\\        }\\\\        const { provider, task, params } = message.payload;\\\\        if (!provider || !task) {\\             const errorResponse = { success: false, error: 'Provider and task are required in payload.' };\\             if (message.correlationId) this.sendResponse(message, errorResponse);\\             this.context.loggingService?.logError('AIAgent failed: Provider or task missing in payload.', { payload: message.payload, correlationId: message.correlationId });\\             return errorResponse;\\        }\\\\        let targetAgentName: string;\\        switch (provider) {\\            case 'pollinations':\\                targetAgentName = 'pollinations';\\                break;\\            case 'chatx':\\                targetAgentName = 'chatx';\\                break;\\            case 'straico':\\                targetAgentName = 'straico';\\                break;\\            // Add cases for other AI providers\\            default:\\                 const errorResponse = { success: false, error: ";
Invalid;
AI;
provider;
specified: $;
{
    provider;
}
" };\\                 if (message.correlationId) this.sendResponse(message, errorResponse);\\                 this.context.loggingService?.logError(";
AIAgent;
failed: Invalid;
AI;
provider;
$;
{
    provider;
}
", { provider, correlationId: message.correlationId });\\                 return errorResponse;\\        }\\\\        console.log("[AIAgent];
Routing;
message;
type;
"${message.type}\\\" to provider agent \\\"${targetAgentName}\\\"...`);\\\
        this.context.loggingService?.logInfo(`AIAgent routing task to provider agent`, { userId, provider, task, correlationId: message.correlationId });\\\
\\\
        try {\\\
            // --- Modified: Use requestAgent to send the task message to the specific provider agent ---\\\
            // The provider agent will handle the specific task (e.g., 'generate_text', 'chat')\\\
            // The provider agent will send its response back via the MessageBus, linked by correlationId.\\\
            // The original sender of the 'process_ai_task' message needs to listen\\\
            // for the response from the provider agent (using the original correlationId).\\\
\
            // We forward the original correlationId to the provider agent\\\
            const providerResponse = await this.requestAgent(\\\
                targetAgentName, // Recipient agent name\\\
                task, // Message type for the provider agent (the specific task name)\\\
                params, // Payload for the provider agent (task parameters)\\\
                30000 // Timeout for the provider agent's response (can be adjusted)\\\
            );\\\
\
            // The response from the provider agent is already an AgentResponse object.\\\
            // We just return it directly.\\\
            console.log(`[AIAgent] Received response from provider agent \\\"${targetAgentName}\\\". Success: ${providerResponse.success}`);\\\
            this.context.loggingService?.logInfo(`AIAgent received response from provider agent`, { userId, provider, task, success: providerResponse.success, correlationId: message.correlationId });\\\
\
            return providerResponse; // Return the response from the provider agent\\\
\
        } catch (error: any) {\\\
            console.error(`[AIAgent] Error routing message ${message.type} to agent \\\"${targetAgentName}\\\":`, error.message);\\\
            this.context.loggingService?.logError(`AIAgent error routing task to provider agent`, { userId, provider: targetAgentName, task, error: error.message, correlationId: message.correlationId });\\\
\
            // If routing or the provider agent's execution failed, return an error response\\\
            const errorResponse: AgentResponse = { success: false, error: error.message || `Failed to route task to ${targetAgentName} agent.` };\\\
            if (message.correlationId) {\\\
                this.sendResponse(message, errorResponse);\\\
            }\\\
            return errorResponse;\\\
        }\\\
    }\\\
\
    // TODO: Implement methods to send messages to other agents if needed\\\
}\\\
```;
