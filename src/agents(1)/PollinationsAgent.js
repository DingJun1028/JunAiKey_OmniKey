var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/agents/PollinationsAgent.ts\n// Pollinations AI\u4EE3\u7406 (Pollinations AI Agent)\n// Handles interactions with the Pollinations AI API.\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates Pollinations AI specific logic.\n\nimport { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\n\n// Import existing services this agent will interact with (temporarily)\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n\n\nexport class PollinationsAgent extends BaseAgent {\n    // private apiProxy: ApiProxy; // Access via context\n\n    constructor(context: SystemContext) {\n        super('pollinations', context);\n        // this.apiProxy = context.apiProxy; // Get existing service from context\n    }\n\n    /**\n     * Handles messages directed to the Pollinations AI Agent.\n     * Performs Pollinations AI API calls.\n     * @param message The message to handle. Expected payload varies by type (e.g., { prompt: string } for 'generate_image').\n     * @returns Promise<AgentResponse> The response containing the API result or error.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\n        console.log("], ["typescript\n// src/agents/PollinationsAgent.ts\n// Pollinations AI\u4EE3\u7406 (Pollinations AI Agent)\n// Handles interactions with the Pollinations AI API.\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates Pollinations AI specific logic.\n\nimport { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\n\n// Import existing services this agent will interact with (temporarily)\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n\n\nexport class PollinationsAgent extends BaseAgent {\n    // private apiProxy: ApiProxy; // Access via context\n\n    constructor(context: SystemContext) {\n        super('pollinations', context);\n        // this.apiProxy = context.apiProxy; // Get existing service from context\n    }\n\n    /**\n     * Handles messages directed to the Pollinations AI Agent.\n     * Performs Pollinations AI API calls.\n     * @param message The message to handle. Expected payload varies by type (e.g., { prompt: string } for 'generate_image').\n     * @returns Promise<AgentResponse> The response containing the API result or error.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\n        console.log("]))[PollinationsAgent];
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
");\n\n        const userId = this.context.currentUser?.id;\n        if (!userId) {\n             return { success: false, error: 'User not authenticated.' };\n        }\n\n        try {\n            let result: any;\n            switch (message.type) {\n                case 'callAPI': // Generic API call type, as defined in the Rune manifest\n                    // Payload: { endpoint: string, method: string, data?: any, config?: any }\n                    if (!message.payload?.endpoint || !message.payload?.method) {\n                         throw new Error('Endpoint and method are required for callAPI.');\n                    }\n                    result = await this.context.apiProxy?.callPollinationsAPI(\n                        message.payload.endpoint,\n                        message.payload.method,\n                        message.payload.data,\n                        message.payload.config\n                    );\n                    return { success: true, data: result };\n\n                case 'generate_image': // Specific Pollinations AI task\n                    // Payload: { prompt: string, model?: string }\n                    if (!message.payload?.prompt) {\n                         throw new Error('Prompt is required to generate image.');\n                    }\n                    // Call ApiProxy with specific endpoint/params for image generation\n                    // Assuming Pollinations AI has a /v1/predict endpoint for image generation\n                    result = await this.context.apiProxy?.callPollinationsAPI('/v1/predict', 'POST', { prompt: message.payload.prompt, model: message.payload.model || 'default-image-model' });\n                    return { success: true, data: result };\n\n                // TODO: Add cases for other Pollinations AI tasks if needed (e.g., 'generate_text')\n\n                default:\n                    console.warn("[PollinationsAgent];
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
for (PollinationsAgent; ; )
    : $;
{
    message.type;
}
" };\n            }\n        } catch (error: any) {\n            console.error("[PollinationsAgent];
Error;
handling;
message;
$;
{
    message.type;
}
", error);\n            return { success: false, error: error.message || 'An error occurred in PollinationsAgent.' };\n        }\n    }\n\n    // TODO: Implement methods to send messages to other agents if needed\n}\n"(__makeTemplateObject([""], [""]));
