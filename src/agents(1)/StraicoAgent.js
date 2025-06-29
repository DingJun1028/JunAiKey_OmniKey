var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/agents/StraicoAgent.ts\n// Straico AI\u4EE3\u7406 (Straico AI Agent)\n// Handles interactions with the Straico AI API.\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates Straico AI specific logic.\n\nimport { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\n\n// Import existing services this agent will interact with (temporarily)\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n\n\nexport class StraicoAgent extends BaseAgent {\n    // private apiProxy: ApiProxy; // Access via context\n\n    constructor(context: SystemContext) {\n        super('straico', context);\n        // this.apiProxy = context.apiProxy; // Get existing service from context\n    }\n\n    /**\n     * Handles messages directed to the Straico Agent.\n     * Performs Straico AI API calls.\n     * @param message The message to handle. Expected payload varies by type (e.g., { prompt: string } for 'promptCompletion').\n     * @returns Promise<AgentResponse> The response containing the API result or error.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\n        console.log("], ["typescript\n// src/agents/StraicoAgent.ts\n// Straico AI\u4EE3\u7406 (Straico AI Agent)\n// Handles interactions with the Straico AI API.\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates Straico AI specific logic.\n\nimport { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\n\n// Import existing services this agent will interact with (temporarily)\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n\n\nexport class StraicoAgent extends BaseAgent {\n    // private apiProxy: ApiProxy; // Access via context\n\n    constructor(context: SystemContext) {\n        super('straico', context);\n        // this.apiProxy = context.apiProxy; // Get existing service from context\n    }\n\n    /**\n     * Handles messages directed to the Straico Agent.\n     * Performs Straico AI API calls.\n     * @param message The message to handle. Expected payload varies by type (e.g., { prompt: string } for 'promptCompletion').\n     * @returns Promise<AgentResponse> The response containing the API result or error.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\n        console.log("]))[StraicoAgent];
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
");\n\n        const userId = this.context.currentUser?.id;\n        if (!userId) {\n             return { success: false, error: 'User not authenticated.' };\n        }\n\n        try {\n            let result: any;\n            switch (message.type) {\n                case 'callAPI': // Generic API call type, as defined in the Rune manifest\n                    // Payload: { endpoint: string, method: string, data?: any, config?: any }\n                    if (!message.payload?.endpoint || !message.payload?.method) {\n                         throw new Error('Endpoint and method are required for callAPI.');\n                    }\n                    result = await this.context.apiProxy?.callStraicoAPI(\n                        message.payload.endpoint,\n                        message.payload.method,\n                        message.payload.data,\n                        message.payload.config\n                    );\n                    return { success: true, data: result };\n\n                case 'promptCompletion': // Specific Straico task\n                    // Payload: { prompt: string, max_tokens?: number, temperature?: number }\n                    if (!message.payload?.prompt) {\n                         throw new Error('Prompt is required for promptCompletion.');\n                    }\n                    // Call ApiProxy with specific endpoint/params for completion\n                    // Assuming Straico uses a standard completion endpoint like /completions or /generate\n                    result = await this.context.apiProxy?.callStraicoAPI('/completions', 'POST', {\n                        prompt: message.payload.prompt,\n                        max_tokens: message.payload.max_tokens,\n                        temperature: message.payload.temperature,\n                    });\n                    return { success: true, data: result };\n\n                case 'chat': // Specific Straico task\n                    // Payload: { messages: Array<{ role: string, content: string }>, model?: string, max_tokens?: number, temperature?: number }\n                    if (!message.payload?.messages) {\n                         throw new Error('Messages are required for chat.');\n                    }\n                    // Call ApiProxy with specific endpoint/params for chat\n                    // Assuming Straico uses a standard chat endpoint like /chat/completions\n                    result = await this.context.apiProxy?.callStraicoAPI('/chat/completions', 'POST', {\n                        messages: message.payload.messages,\n                        model: message.payload.model,\n                        max_tokens: message.payload.max_tokens,\n                        temperature: message.payload.temperature,\n                    });\n                    return { success: true, data: result };\n\n                // TODO: Add cases for other Straico tasks if needed\n\n                default:\n                    console.warn("[StraicoAgent];
Unknown;
message;
type: $;
{
    message.type;
}
");\n                    return { success: false, error: ";
Unknown;
message;
type;
for (StraicoAgent; ; )
    : $;
{
    message.type;
}
" };\n            }\n        } catch (error: any) {\n            console.error("[StraicoAgent];
Error;
handling;
message;
$;
{
    message.type;
}
", error);\n            return { success: false, error: error.message || 'An error occurred in StraicoAgent.' };\n        }\n    }\n\n    // TODO: Implement methods to send messages to other agents if needed\n}\n"(__makeTemplateObject([""], [""]));
