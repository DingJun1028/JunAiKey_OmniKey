var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/agents/MessageBus.ts\n// \u8A0A\u606F\u7E3D\u7DDA (Message Bus)\n// Provides a central hub for agents to send and receive messages.\n// Part of the Agent System Architecture.\n// Design Principle: Decouples agents, enabling flexible communication.\n// --- Modified: Implement sendMessageAndWaitForResponse method --\n// --- Modified: Implement handleAgentResponse to match pending requests by correlationId --\n// --- Best Practice: Use stricter typing for messages and responses --\n// --- Best Practice: Add logging for message processing lifecycle --\n\nimport { AgentMessage, AgentResponse, AgentError } from './BaseAgent'; // Import AgentMessage, AgentResponse, AgentError types\nimport { AgentRouter } from './AgentRouter'; // Import AgentRouter\n\n/**\n * The central Message Bus for inter-agent communication.\n */\nclass MessageBus {\n    private static instance: MessageBus;\n    private listeners: Map<string, Function[]> = new Map(); // Direct listeners (less common in pure agent model)\n    private router: AgentRouter | null = null; // The agent router\n\n    // --- New: Map to track pending requests for the request/response pattern ---\n    // Map: correlationId -> { resolve: Function, reject: Function, timer: NodeJS.Timeout }\n    private pendingRequests: Map<string, { resolve: (response: AgentResponse) => void, reject: (error: Error) => void, timer: any }> = new Map();\n    // --- End New ---\n\n\n    private constructor() {\n        console.log('[MessageBus] Initialized.');\n        // --- New: Subscribe to agent_response messages to handle pending requests ---\n        // The router or the agent itself publishes 'agent_response' messages.\n        // The MessageBus listens to these to match them with pending requests.\n        this.subscribe('agent_response', this.handleAgentResponse.bind(this));\n        // --- End New ---\n    }\n\n    /**\n     * Gets the singleton instance of the MessageBus.\n     * @param router The AgentRouter instance (required for the first call).\n     * @returns The MessageBus instance.\n     */\n    public static getInstance(router?: AgentRouter): MessageBus {\n        if (!MessageBus.instance) {\n            if (!router) {\n                throw new Error('AgentRouter instance must be provided on the first call to getInstance.');\n            }\n            MessageBus.instance = new MessageBus();\n            MessageBus.instance.router = router; // Set the router\n        } else {\n             // Ensure the router is set if it wasn't on the very first call (less ideal)\n             if (!MessageBus.instance.router && router) {\n                 MessageBus.instance.router = router;\n             }\n        }\n        return MessageBus.instance;\n    }\n\n    /**\n     * Sends a message to the Message Bus.\n     * If the message has a "], ["typescript\n// src/agents/MessageBus.ts\n// \\u8a0a\\u606f\\u7e3d\\u7dda (Message Bus)\n// Provides a central hub for agents to send and receive messages.\n// Part of the Agent System Architecture.\n// Design Principle: Decouples agents, enabling flexible communication.\n// --- Modified: Implement sendMessageAndWaitForResponse method --\n// --- Modified: Implement handleAgentResponse to match pending requests by correlationId --\n// --- Best Practice: Use stricter typing for messages and responses --\n// --- Best Practice: Add logging for message processing lifecycle --\n\nimport { AgentMessage, AgentResponse, AgentError } from './BaseAgent'; // Import AgentMessage, AgentResponse, AgentError types\nimport { AgentRouter } from './AgentRouter'; // Import AgentRouter\n\n/**\n * The central Message Bus for inter-agent communication.\n */\nclass MessageBus {\n    private static instance: MessageBus;\n    private listeners: Map<string, Function[]> = new Map(); // Direct listeners (less common in pure agent model)\n    private router: AgentRouter | null = null; // The agent router\n\n    // --- New: Map to track pending requests for the request/response pattern ---\n    // Map: correlationId -> { resolve: Function, reject: Function, timer: NodeJS.Timeout }\n    private pendingRequests: Map<string, { resolve: (response: AgentResponse) => void, reject: (error: Error) => void, timer: any }> = new Map();\n    // --- End New ---\n\n\n    private constructor() {\n        console.log('[MessageBus] Initialized.');\n        // --- New: Subscribe to agent_response messages to handle pending requests ---\n        // The router or the agent itself publishes 'agent_response' messages.\n        // The MessageBus listens to these to match them with pending requests.\n        this.subscribe('agent_response', this.handleAgentResponse.bind(this));\n        // --- End New ---\n    }\n\n    /**\n     * Gets the singleton instance of the MessageBus.\n     * @param router The AgentRouter instance (required for the first call).\n     * @returns The MessageBus instance.\n     */\n    public static getInstance(router?: AgentRouter): MessageBus {\n        if (!MessageBus.instance) {\n            if (!router) {\n                throw new Error('AgentRouter instance must be provided on the first call to getInstance.');\n            }\n            MessageBus.instance = new MessageBus();\n            MessageBus.instance.router = router; // Set the router\n        } else {\n             // Ensure the router is set if it wasn't on the very first call (less ideal)\n             if (!MessageBus.instance.router && router) {\n                 MessageBus.instance.router = router;\n             }\n        }\n        return MessageBus.instance;\n    }\n\n    /**\n     * Sends a message to the Message Bus.\n     * If the message has a "]));
recipient(__makeTemplateObject([", it is routed by the AgentRouter.\n     * Otherwise, it is treated as a broadcast event and delivered to direct listeners.\n     * @param message The message to send.\n     */\n    send(message: AgentMessage): void {\n        console.log("], [", it is routed by the AgentRouter.\n     * Otherwise, it is treated as a broadcast event and delivered to direct listeners.\n     * @param message The message to send.\n     */\n    send(message: AgentMessage): void {\n        console.log("]))[MessageBus];
Received;
message;
to;
send: $;
{
    message.type;
}
(function (Recipient, _a) {
    var message = _a.message, recipient = _a.recipient;
    return ;
});
 || 'Broadcast';
(Correlation);
ID: $;
{
    message.correlationId || 'N/A';
}
");\n        // --- Best Practice: Add logging for message sending ---\n        // Access loggingService via context (assuming context is available in MessageBus, which it is via AgentFactory)\n        // Note: MessageBus doesn't directly have context, but AgentFactory does.\n        // For MVP, we can assume context is available globally or passed during setup.\n        // Let's add a placeholder log here. Real logging should use the service.\n        // this.context.loggingService?.logDebug(";
MessageBus;
sending;
message: $;
{
    message.type;
}
", { messageType: message.type, recipient: message.recipient, correlationId: message.correlationId, sender: message.sender });\n        // --- End Best Practice ---\n\n\n        if (message.recipient) {\n            // Message has a specific recipient, route it\n            if (!this.router) {\n                console.error('[MessageBus] AgentRouter is not set. Cannot route message with recipient.');\n                // Handle error - maybe log or send a system error event\n                // If it's a request with correlationId, reject the pending promise\n                if (message.correlationId && this.pendingRequests.has(message.correlationId)) {\n                    const { reject, timer } = this.pendingRequests.get(message.correlationId)!;\n                    clearTimeout(timer);\n                    this.pendingRequests.delete(message.correlationId);\n                    reject(new Error(";
MessageBus;
Error: AgentRouter;
not;
available;
to;
route;
message;
to;
$;
{
    message.recipient;
}
"));\n                }\n                return;\n            }\n            // Forward the message to the router for routing\n            this.router.routeMessage(message);\n        } else {\n            // Message has no specific recipient, treat as broadcast event\n            this._deliverToListeners(message);\n        }\n    }\n\n    /**\n     * Subscribes a callback function to a specific message type.     * Note: In a pure agent model, agents primarily receive messages via receiveMessage().     * This subscribe method might be used by non-agent components (like UI) or for broadcasting events.     * @param eventType The type of message/event to subscribe to.     * @param callback The function to call when a message of this type is sent.     * @returns A function to unsubscribe.     */    subscribe(eventType: string, callback: Function): () => void {        console.log("[MessageBus];
Subscriber;
added;
for (event; type; )
    : $;
{
    eventType;
}
");        if (!this.listeners.has(eventType)) {            this.listeners.set(eventType, []);        }        this.listeners.get(eventType)!.push(callback);        // Return an unsubscribe function        return () => {            console.log("[MessageBus];
Subscriber;
removed;
for (event; type; )
    : $;
{
    eventType;
}
");            const handlers = this.listeners.get(eventType);            if (handlers) {                this.listeners.set(eventType, handlers.filter(handler => handler !== callback));            }        };    }    /**     * Internal method used by the MessageBus itself (when no recipient is set)     * to deliver a message to direct listeners.     * @param message The message to deliver.     */    private _deliverToListeners(message: AgentMessage): void {         console.log("[MessageBus];
Delivering;
message;
to;
listeners: $;
{
    message.type;
}
");         const handlers = this.listeners.get(message.type);         if (handlers) {             handlers.forEach(handler => {                 try {                     handler(message);                 } catch (error: any) {                     console.error("[MessageBus];
Error in listener;
for (event; type; )
    ;
"${message.type}\\\":`, error);\
                     // TODO: Log error using LoggingService\
                 }\
             });\
         }\
         // Also deliver to a wildcard listener if implemented\
         // const wildcardHandlers = this.listeners.get('*'); // Example wildcard\
         // if (wildcardHandlers) { ... }\
    }\
\
    // --- New: Handle incoming agent_response messages ---\
    private handleAgentResponse(responseMessage: AgentMessage): void {\
        // Check if this response matches a pending request by correlationId\
        if (responseMessage.correlationId && this.pendingRequests.has(responseMessage.correlationId)) {\
            console.log(`[MessageBus] Received response for pending request: ${responseMessage.correlationId}`);\
            const { resolve, timer } = this.pendingRequests.get(responseMessage.correlationId)!;\
\
            // Clear the timeout and remove the request from pending state\
            clearTimeout(timer);\
            this.pendingRequests.delete(responseMessage.correlationId);\
\
            // Resolve the waiting promise with the response payload\
            // The payload of an 'agent_response' message is expected to be an AgentResponse object { success: boolean, data?: any, error?: string }\
            // --- Best Practice: Ensure the payload is a valid AgentResponse ---\
            const responsePayload = responseMessage.payload as AgentResponse;\
            if (typeof responsePayload !== 'object' || responsePayload === null || typeof responsePayload.success !== 'boolean') {\
                 console.error(`[MessageBus] Received agent_response with invalid payload format for correlationId ${responseMessage.correlationId}:`, responseMessage.payload);\
                 // Reject the promise with an error\
                 reject(new Error(`MessageBus Error: Received invalid response payload format for correlationId ${responseMessage.correlationId}.`));\
            } else {\
                 resolve(responsePayload); // Resolve with the valid AgentResponse\
            }\
            // --- End Best Practice ---\
\
        } else {\
            // If no matching pending request, this is likely a broadcast response or an unhandled response.\
            // It might be intended for a direct listener (e.g., UI).\
            console.log(`[MessageBus] Received agent_response without matching pending request: ${responseMessage.correlationId || 'N/A'}. Delivering to direct listeners if any.`);\
            // The _deliverToListeners method is already called for messages without recipients.\
            // Since 'agent_response' messages are sent without recipients by BaseAgent.sendResponse,\
            // they will be delivered to any direct subscribers of 'agent_response'.\
            // This is the intended behavior for UI listeners.\
        }\
    }\
    // --- End New ---\
\
\
    // --- New: Method for sending a message and waiting for a response ---\
    /**\
     * Sends a message to a specific recipient agent and waits for a response\
     * with a matching correlation ID.\
     * @param message The message to send. Must include `recipient`.\
     * @param timeout Optional timeout in milliseconds. Defaults to 10000 (10 seconds).\
     * @returns Promise<AgentResponse> The response from the recipient agent.\
     * @throws Error if the message does not have a recipient, if the request times out, or if the response indicates an error.\
     */\
    async sendMessageAndWaitForResponse(message: AgentMessage, timeout: number = 10000): Promise<AgentResponse> {\
        if (!message.recipient) {\
            throw new Error('Message must have a recipient to wait for a response.');\
        }\
\
        // Generate a unique correlation ID for this request if not already provided\
        // Use the sender's name in the correlation ID for easier debugging\
        const correlationId = message.correlationId || `req-${message.sender || 'unknown'}-${message.recipient}-${message.type}-${Date.now()}-${Math.random().toString(16).slice(2)}`;\
        message.correlationId = correlationId; // Add correlation ID to the message\
\
        console.log(`[MessageBus] Sending request and waiting for response: ${message.type} to ${message.recipient} (Correlation ID: ${correlationId})`);\
        // --- Best Practice: Add logging for request/response ---\
        // this.context.loggingService?.logDebug(`MessageBus sending request and waiting: ${message.type}`, { recipient: message.recipient, correlationId });\
        // --- End Best Practice ---\
\
\
        return new Promise<AgentResponse>((resolve, reject) => {\
            // Store the resolve/reject functions and the timer ID keyed by correlation ID\
            const timer = setTimeout(() => {\
                if (this.pendingRequests.has(correlationId)) {\
                    this.pendingRequests.delete(correlationId);\
                    console.error(`[MessageBus] Request timed out: ${message.type} to ${message.recipient} (Correlation ID: ${correlationId})`);\
                    // --- Best Practice: Reject with AgentError ---\
                    reject(new AgentError(`Request to agent ${message.recipient} timed out after ${timeout}ms.`));\
                    // --- End Best Practice ---\
                }\
            }, timeout);\
\
            this.pendingRequests.set(correlationId, { resolve, reject, timer });\
\
            // Send the message via the bus (which routes it to the recipient agent)\
            this.send(message);\
        });\
    }\
    // --- End New ---\
}\
```;
