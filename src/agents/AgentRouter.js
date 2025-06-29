var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/agents/AgentRouter.ts\n// \u4EE3\u7406\u8DEF\u7531\u5668 (Agent Router)\n// Receives messages from the Message Bus and routes them to the appropriate recipient agent.\n// Part of the Agent System Architecture.\n// Design Principle: Directs messages based on recipient or type.\n// --- Best Practice: Use stricter typing for messages and responses --\n// --- Best Practice: Add logging for routing decisions and errors --\n\nimport { SystemContext } from '../interfaces'; // Assuming SystemContext interface exists\nimport { BaseAgent, AgentMessage, AgentResponse, AgentError } from './BaseAgent'; // Import types\nimport { AgentFactory } from './AgentFactory'; // Import AgentFactory\nimport { MessageBus } from './MessageBus'; // Import MessageBus\n\n\n/**\n * The central router for messages between agents.\n */\nclass AgentRouter {\n    private context: SystemContext;\n    private agentFactory: AgentFactory;\n    private messageBus: MessageBus;\n\n    constructor(context: SystemContext, agentFactory: AgentFactory, messageBus: MessageBus) {\n        this.context = context;\n        this.agentFactory = agentFactory;\n        this.messageBus = messageBus;\n        console.log('[AgentRouter] Initialized.');\n\n        // The router needs to subscribe to the MessageBus to receive all messages\n        // Note: In this model, the router is the *only* subscriber to the bus for agent-to-agent messages.\n        // Direct listeners via MessageBus.subscribe are for non-agent components (like UI) or for broadcasting events.\n        // Let's assume MessageBus.send forwards to router.routeMessage if recipient is set,\n        // or if it's a response message (based on correlationId).\n        // A simpler MVP approach: MessageBus.send always calls router.routeMessage.\n\n        // Re-evaluating: The provided MessageBus.send calls router.routeMessage.\n        // The provided BaseAgent.sendResponse calls MessageBus.send with NO recipient, but WITH correlationId and sender.\n        // This implies responses are NOT routed by the router, but broadcast on the bus.\n        // The original sender must listen for 'agent_response' with their correlationId.\n        // This is a valid pattern. So the router only handles initial requests WITH a recipient.\n\n        // The router subscribes to a specific channel or message type that indicates a message needs routing.\n        // Let's define a convention: messages with a "], ["typescript\n// src/agents/AgentRouter.ts\n// \\u4ee3\\u7406\\u8def\\u7531\\u5668 (Agent Router)\n// Receives messages from the Message Bus and routes them to the appropriate recipient agent.\n// Part of the Agent System Architecture.\n// Design Principle: Directs messages based on recipient or type.\n// --- Best Practice: Use stricter typing for messages and responses --\n// --- Best Practice: Add logging for routing decisions and errors --\n\nimport { SystemContext } from '../interfaces'; // Assuming SystemContext interface exists\nimport { BaseAgent, AgentMessage, AgentResponse, AgentError } from './BaseAgent'; // Import types\nimport { AgentFactory } from './AgentFactory'; // Import AgentFactory\nimport { MessageBus } from './MessageBus'; // Import MessageBus\n\n\n/**\n * The central router for messages between agents.\n */\nclass AgentRouter {\n    private context: SystemContext;\n    private agentFactory: AgentFactory;\n    private messageBus: MessageBus;\n\n    constructor(context: SystemContext, agentFactory: AgentFactory, messageBus: MessageBus) {\n        this.context = context;\n        this.agentFactory = agentFactory;\n        this.messageBus = messageBus;\n        console.log('[AgentRouter] Initialized.');\n\n        // The router needs to subscribe to the MessageBus to receive all messages\n        // Note: In this model, the router is the *only* subscriber to the bus for agent-to-agent messages.\n        // Direct listeners via MessageBus.subscribe are for non-agent components (like UI) or for broadcasting events.\n        // Let's assume MessageBus.send forwards to router.routeMessage if recipient is set,\n        // or if it's a response message (based on correlationId).\n        // A simpler MVP approach: MessageBus.send always calls router.routeMessage.\n\n        // Re-evaluating: The provided MessageBus.send calls router.routeMessage.\n        // The provided BaseAgent.sendResponse calls MessageBus.send with NO recipient, but WITH correlationId and sender.\n        // This implies responses are NOT routed by the router, but broadcast on the bus.\n        // The original sender must listen for 'agent_response' with their correlationId.\n        // This is a valid pattern. So the router only handles initial requests WITH a recipient.\n\n        // The router subscribes to a specific channel or message type that indicates a message needs routing.\n        // Let's define a convention: messages with a "]));
recipient(__makeTemplateObject([" field are for the router.\n        // The MessageBus will check for "], [" field are for the router.\n        // The MessageBus will check for "]));
recipient(__makeTemplateObject([". If present, it sends to the router. If not, it broadcasts.\n\n        // The router subscribes to a special event type that the MessageBus publishes for messages with recipients.\n        // Note: The MessageBus implementation doesn't currently publish a 'message_for_routing' event.\n        // The MessageBus.send method directly calls router.routeMessage if a recipient is present.\n        // So, the router doesn't need to subscribe to a special event type here.        // The constructor is just for setup and getting references.    }    /**     * Routes a message to the intended recipient agent.     * This method is called by the MessageBus when a message with a "], [". If present, it sends to the router. If not, it broadcasts.\n\n        // The router subscribes to a special event type that the MessageBus publishes for messages with recipients.\n        // Note: The MessageBus implementation doesn't currently publish a 'message_for_routing' event.\n        // The MessageBus.send method directly calls router.routeMessage if a recipient is present.\n        // So, the router doesn't need to subscribe to a special event type here.\\\n        // The constructor is just for setup and getting references.\\\n    }\\\n\\\n    /**\\\n     * Routes a message to the intended recipient agent.\\\n     * This method is called by the MessageBus when a message with a "]));
recipient(__makeTemplateObject([" is sent.     * @param message The message to route. Expected to have a "], [" is sent.\\\n     * @param message The message to route. Expected to have a "]));
recipient(__makeTemplateObject([" field.     */    routeMessage(message: AgentMessage): void {        if (!message.recipient) {            console.error("], [" field.\\\n     */\\\n    routeMessage(message: AgentMessage): void {\\\n        if (!message.recipient) {\\\n            console.error("]))[AgentRouter];
Received;
message;
without;
explicit;
recipient: $;
{
    message.type;
}
Cannot;
route.(__makeTemplateObject([");            this.context.loggingService?.logError("], [");\\\n            this.context.loggingService?.logError("]));
AgentRouter;
failed: Received;
message;
without;
recipient.(__makeTemplateObject([", { messageType: message.type, correlationId: message.correlationId, sender: message.sender });            // TODO: Send an error response back to the original sender (if sender is specified and it was a request)            return;        }        console.log("], [", { messageType: message.type, correlationId: message.correlationId, sender: message.sender });\\\n            // TODO: Send an error response back to the original sender (if sender is specified and it was a request)\\\n            return;\\\n        }\\\n\\\n        console.log("]))[AgentRouter];
Routing;
message: $;
{
    message.type;
}
to;
agent;
"${message.recipient}\\\"`);\
        this.context.loggingService?.logDebug(`AgentRouter routing message: ${message.type}`, { recipient: message.recipient, correlationId: message.correlationId, sender: message.sender });\
\
\
        try {\
            // Get the recipient agent instance from the factory\
            const recipientAgent = this.agentFactory.getAgent(message.recipient);\
\
            if (!recipientAgent) {\
                 const errorMsg = `Recipient agent \\\"${message.recipient}\\\" not found in registry.`;\
                 console.error(`[AgentRouter] ${errorMsg}`);\
                 this.context.loggingService?.logError(`AgentRouter failed: Recipient agent not found.`, { recipient: message.recipient, messageType: message.type, correlationId: message.correlationId });\
                 // --- Best Practice: Send an error response back to the original sender ---\
                 if (message.correlationId && message.sender) { // Only send error response if it was a request with a sender\
                     // Need to send the error response back via the MessageBus\
                     // The MessageBus will handle matching the correlationId\
                     this.messageBus.send({\
                         type: 'agent_response', // Generic response type\
                         payload: { success: false, error: errorMsg } as AgentResponse,\
                         correlationId: message.correlationId,\
                         sender: 'agent_router', // Identify the sender as the router\
                         // No recipient for a response on the bus\
                     });\
                 }\
                 // --- End Best Practice ---\
                 return;\
            }\
\
            // Deliver the message to the recipient agent\
            recipientAgent.receiveMessage(message);\
            console.log(`[AgentRouter] Successfully routed message ${message.type} to agent \\\"${message.recipient}\\\".`);\
            this.context.loggingService?.logDebug(`AgentRouter successfully routed message: ${message.type}`, { recipient: message.recipient, correlationId: message.correlationId });\
\
\
        } catch (error: any) {\
            console.error(`[AgentRouter] Unexpected error routing message ${message.type} to agent \\\"${message.recipient}\\\":`, error.message);\
            this.context.loggingService?.logError(`AgentRouter unexpected error during routing: ${message.type}`, { recipient: message.recipient, correlationId: message.correlationId, error: error.message });\
            // --- Best Practice: Send an error response back to the original sender ---\
            if (message.correlationId && message.sender) { // Only send error response if it was a request with a sender\
                 this.messageBus.send({\
                     type: 'agent_response', // Generic response type\
                     payload: { success: false, error: error.message || 'An unexpected error occurred during routing.' } as AgentResponse,\
                     correlationId: message.correlationId,\
                     sender: 'agent_router', // Identify the sender as the router\
                 });\
            }\
            // --- End Best Practice ---\
        }\
    }\
\
    // TODO: Implement logic to handle responses if not using direct listeners (less likely based on BaseAgent)\
    // TODO: Implement logic to route initial messages based on type if the router is the entry point\
}\
```;
