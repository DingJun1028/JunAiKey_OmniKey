var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/agents/BaseAgent.ts\n// \u4EE3\u7406\u57FA\u790E\u985E\u5225 (Base Agent Class)\n// Defines the fundamental structure and behavior for all agents in the system.\n// Part of the Agent System Architecture.\n// Design Principle: Provides encapsulation and a standardized message handling interface.\n// --- Modified: Implement sendMessageAndWaitForResponse method --\n// --- Modified: Implement handleAgentResponse to match pending requests by correlationId --\n// --- New: Add method to send a message to another agent and wait for its response --\n// --- Best Practice: Use stricter typing for messages and responses --\n// --- Best Practice: Implement consistent error handling within handleMessage --\n// --- Best Practice: Add logging for message processing lifecycle --\n\nimport { SystemContext } from '../interfaces'; // Assuming SystemContext interface exists\nimport { MessageBus } from './MessageBus'; // Import MessageBus class\n\n// Re-export types from MessageBus for convenience\nexport type AgentMessage = {\n    type: string; // The type of message/command\n    payload?: any; // The data payload (optional)\n    correlationId?: string; // Optional ID to correlate requests and responses\n    sender?: string; // Optional sender agent name\n    recipient?: string; // Optional recipient agent name (used by router)\n};\n\nexport type AgentResponse = {\n    success: boolean; // Indicates if the operation was successful\n    data?: any; // The response data on success\n    error?: string; // Error message on failure\n};\n\n// --- Best Practice: Define a custom error class for agent errors ---\nexport class AgentError extends Error {\n    constructor(message: string, public details?: any) {\n        super(message);\n        this.name = 'AgentError';\n        // Set the prototype explicitly.\n        Object.setPrototypeOf(this, AgentError.prototype);\n    }\n}\n// --- End Best Practice ---\n\n\n/**\n * Base class for all agents in the Jun.Ai.Key system.\n * Provides message queuing and processing logic.\n */\nabstract class BaseAgent {\n    protected agentName: string;\n    protected context: SystemContext; // Access to system context (including MessageBus, other services)\n    protected messageQueue: AgentMessage[] = [];\n    protected processing = false;\n\n    constructor(name: string, context: SystemContext) {\n        this.agentName = name;\n        this.context = context;\n        console.log("], ["typescript\n// src/agents/BaseAgent.ts\n// \\u4ee3\\u7406\\u57fa\\u790e\\u985e\\u5225 (Base Agent Class)\n// Defines the fundamental structure and behavior for all agents in the system.\n// Part of the Agent System Architecture.\n// Design Principle: Provides encapsulation and a standardized message handling interface.\n// --- Modified: Implement sendMessageAndWaitForResponse method --\n// --- Modified: Implement handleAgentResponse to match pending requests by correlationId --\n// --- New: Add method to send a message to another agent and wait for its response --\n// --- Best Practice: Use stricter typing for messages and responses --\n// --- Best Practice: Implement consistent error handling within handleMessage --\n// --- Best Practice: Add logging for message processing lifecycle --\n\nimport { SystemContext } from '../interfaces'; // Assuming SystemContext interface exists\nimport { MessageBus } from './MessageBus'; // Import MessageBus class\n\n// Re-export types from MessageBus for convenience\nexport type AgentMessage = {\n    type: string; // The type of message/command\n    payload?: any; // The data payload (optional)\n    correlationId?: string; // Optional ID to correlate requests and responses\n    sender?: string; // Optional sender agent name\n    recipient?: string; // Optional recipient agent name (used by router)\n};\n\nexport type AgentResponse = {\n    success: boolean; // Indicates if the operation was successful\n    data?: any; // The response data on success\n    error?: string; // Error message on failure\n};\n\n// --- Best Practice: Define a custom error class for agent errors ---\nexport class AgentError extends Error {\n    constructor(message: string, public details?: any) {\n        super(message);\n        this.name = 'AgentError';\n        // Set the prototype explicitly.\n        Object.setPrototypeOf(this, AgentError.prototype);\n    }\n}\n// --- End Best Practice ---\n\n\n/**\n * Base class for all agents in the Jun.Ai.Key system.\n * Provides message queuing and processing logic.\n */\nabstract class BaseAgent {\n    protected agentName: string;\n    protected context: SystemContext; // Access to system context (including MessageBus, other services)\n    protected messageQueue: AgentMessage[] = [];\n    protected processing = false;\n\n    constructor(name: string, context: SystemContext) {\n        this.agentName = name;\n        this.context = context;\n        console.log("]))[Agent];
$;
{
    this.agentName;
}
initialized.(__makeTemplateObject([");\n    }\n\n    /**\n     * Initializes the agent. Called by the AgentFactory after creation.\n     * Can be overridden by subclasses for specific setup.\n     */\n    init(): void {\n        console.log("], [");\n    }\n\n    /**\n     * Initializes the agent. Called by the AgentFactory after creation.\n     * Can be overridden by subclasses for specific setup.\n     */\n    init(): void {\n        console.log("]))[Agent];
$;
{
    this.agentName;
}
init;
completed.(__makeTemplateObject([");\n        // Subclasses can override this for specific initialization logic\n    }\n\n    /**\n     * Receives a message and adds it to the agent's queue.\n     * @param message The message to receive.\n     */\n    receiveMessage(message: AgentMessage): void {\n        console.log("], [");\n        // Subclasses can override this for specific initialization logic\n    }\n\n    /**\n     * Receives a message and adds it to the agent's queue.\n     * @param message The message to receive.\n     */\n    receiveMessage(message: AgentMessage): void {\n        console.log("]))[Agent];
$;
{
    this.agentName;
}
received;
message: $;
{
    message.type;
}
(Correlation);
ID: $;
{
    message.correlationId || 'N/A';
}
");\n        this.context.loggingService?.logDebug(";
Agent;
received;
message: $;
{
    this.agentName;
}
", { messageType: message.type, correlationId: message.correlationId, sender: message.sender });\n        this.messageQueue.push(message);\n        if (!this.processing) {\n            this.processQueue(); // Start processing if not already busy\n        }\n    }\n\n    /**\n     * Processes messages from the queue sequentially.\n     */\n    private async processQueue(): Promise<void> {\n        this.processing = true;\n        console.log("[Agent];
$;
{
    this.agentName;
}
starting;
queue;
processing.Queue;
size: $;
{
    this.messageQueue.length;
}
");\n        this.context.loggingService?.logDebug(";
Agent;
starting;
queue;
processing: $;
{
    this.agentName;
}
", { queueSize: this.messageQueue.length });\n\n        while (this.messageQueue.length > 0) {\n            // Process one message at a time to maintain order\n            const message = this.messageQueue.shift()!; // Get the next message\n\n            console.log("[Agent];
$;
{
    this.agentName;
}
processing;
message: $;
{
    message.type;
}
(Correlation);
ID: $;
{
    message.correlationId || 'N/A';
}
");\n            this.context.loggingService?.logDebug(";
Agent;
processing;
message: $;
{
    this.agentName;
}
", { messageType: message.type, correlationId: message.correlationId });\n\n\n            let response: AgentResponse;\n            try {\n                // Handle the message using the subclass's implementation\n                // Subclasses should return AgentResponse { success: boolean, data?: any, error?: string }\n                response = await this.handleMessage(message);\n\n                // --- Best Practice: Ensure handleMessage returns a valid AgentResponse ---\n                if (typeof response !== 'object' || response === null || typeof response.success !== 'boolean') {\n                     console.error("[Agent];
$;
{
    this.agentName;
}
handleMessage;
for ($; { message: message, : .type }; returned)
    invalid;
response;
format: ", response);\n                     this.context.loggingService?.logError(";
Agent;
handleMessage;
returned;
invalid;
response;
format: $;
{
    this.agentName;
}
", { messageType: message.type, correlationId: message.correlationId, response });\n                     response = { success: false, error: ";
Agent;
$;
{
    this.agentName;
}
returned;
invalid;
response;
format.(__makeTemplateObject([" };\n                }\n                // --- End Best Practice ---\n\n\n                // Send response only if the original message had a correlationId (indicating it was a request)\n                if (message.correlationId) {\n                    this.sendResponse(message, response); // Send response via MessageBus\n                } else {\n                    console.log("], [" };\n                }\n                // --- End Best Practice ---\n\n\n                // Send response only if the original message had a correlationId (indicating it was a request)\n                if (message.correlationId) {\n                    this.sendResponse(message, response); // Send response via MessageBus\n                } else {\n                    console.log("]))[Agent];
$;
{
    this.agentName;
}
finished;
processing;
message;
$;
{
    message.type;
}
without;
correlationId.No;
response;
sent.(__makeTemplateObject([");\n                    this.context.loggingService?.logDebug("], [");\n                    this.context.loggingService?.logDebug("]));
Agent;
finished;
processing;
message;
without;
correlationId: $;
{
    this.agentName;
}
", { messageType: message.type });\n                }\n\n            } catch (error: any) {\n                console.error("[Agent];
$;
{
    this.agentName;
}
failed;
to;
handle;
message;
$;
{
    message.type;
}
(Correlation);
ID: $;
{
    message.correlationId || 'N/A';
}
", error);\n                this.context.loggingService?.logError(";
Agent;
failed;
to;
handle;
message: $;
{
    this.agentName;
}
", { messageType: message.type, correlationId: message.correlationId, error: error.message });\n\n                // Send an error response via MessageBus if the original message had a correlationId\n                if (message.correlationId) {\n                    // --- Best Practice: Send a structured error response ---\n                    this.sendError(message, error.message || 'An unknown error occurred.');\n                    // --- End Best Practice ---\n                } else {\n                     console.error("[Agent];
$;
{
    this.agentName;
}
failed;
to;
process;
message;
$;
{
    message.type;
}
without;
correlationId.Error;
logged.(__makeTemplateObject([");\n                }\n            }\n        }\n        this.processing = false;\n        console.log("], [");\n                }\n            }\n        }\n        this.processing = false;\n        console.log("]))[Agent];
$;
{
    this.agentName;
}
queue;
empty.Stopping;
processing.(__makeTemplateObject([");\n        this.context.loggingService?.logDebug("], [");\n        this.context.loggingService?.logDebug("]));
Agent;
queue;
empty: $;
{
    this.agentName;
}
");\n    }\n\n    /**\n     * Abstract method to be implemented by subclasses to handle specific message types.\n     * Subclasses should perform the core logic for the message type.\n     * They should return an ";
AgentResponse(__makeTemplateObject([" object indicating success or failure.\n     * If an unhandled error occurs within "], [" object indicating success or failure.\n     * If an unhandled error occurs within "]));
handleMessage(__makeTemplateObject([", it should be thrown,\n     * and the "], [", it should be thrown,\n     * and the "]));
processQueue(__makeTemplateObject([" method will catch it and send an error response.\n     * @param message The message to handle.\n     * @returns Promise<AgentResponse> The response to the message.\n     */\n    protected abstract handleMessage(message: AgentMessage): Promise<AgentResponse>;\n\n    /**\n     * Sends a response message via the MessageBus.\n     * @param originalMessage The original message this is a response to.\n     * @param response The response payload.\n     */\n    protected sendResponse(originalMessage: AgentMessage, response: AgentResponse): void {        // Publish the response on the MessageBus        // The response type is typically 'agent_response'        // It includes the original correlationId and the sender's name.        const responseMessage: AgentMessage = {            type: 'agent_response', // Generic response type            payload: response,            correlationId: originalMessage.correlationId, // Link back to the original request            sender: this.agentName, // Identify the sender agent            // recipient is not needed for a response on a bus        };        console.log("], [" method will catch it and send an error response.\n     * @param message The message to handle.\n     * @returns Promise<AgentResponse> The response to the message.\n     */\n    protected abstract handleMessage(message: AgentMessage): Promise<AgentResponse>;\n\n    /**\n     * Sends a response message via the MessageBus.\n     * @param originalMessage The original message this is a response to.\n     * @param response The response payload.\n     */\n    protected sendResponse(originalMessage: AgentMessage, response: AgentResponse): void {\\\n        // Publish the response on the MessageBus\\\n        // The response type is typically 'agent_response'\\\n        // It includes the original correlationId and the sender's name.\\\n        const responseMessage: AgentMessage = {\\\n            type: 'agent_response', // Generic response type\\\n            payload: response,\\\n            correlationId: originalMessage.correlationId, // Link back to the original request\\\n            sender: this.agentName, // Identify the sender agent\\\n            // recipient is not needed for a response on a bus\\\n        };\\\n        console.log("]))[Agent];
$;
{
    this.agentName;
}
sending;
response;
for (Correlation; ID; )
    : $;
{
    originalMessage.correlationId;
}
");        this.context.loggingService?.logDebug(";
Agent;
sending;
response: $;
{
    this.agentName;
}
", { correlationId: originalMessage.correlationId, success: response.success });        this.context.messageBus?.send(responseMessage);    }    /**     * Sends an error response message via the MessageBus.     * @param originalMessage The original message that caused the error.     * @param errorMessage The error message.     */    protected sendError(originalMessage: AgentMessage, errorMessage: string): void {        const errorResponse: AgentResponse = {            success: false,            error: errorMessage,        };        this.sendResponse(originalMessage, errorResponse);    }    /**     * Sends a message to the Message Bus for routing or broadcasting.     * Agents should use this method to publish events (no recipient) or send requests (with recipient).     * @param message The message to send. Should include ";
type(__makeTemplateObject([" and "], [" and "]));
payload(__makeTemplateObject([".     *                Can include "], [".\\\n     *                Can include "]));
recipient(__makeTemplateObject([" for targeted messages.     */    protected sendMessage(message: AgentMessage): void {        // Add sender to the message if not already present        const messageToSend = {            sender: this.agentName,            ...message,        };        console.log("], [" for targeted messages.\\\n     */\\\n    protected sendMessage(message: AgentMessage): void {\\\n        // Add sender to the message if not already present\\\n        const messageToSend = {\\\n            sender: this.agentName,\\\n            ...message,\\\n        };\\\n        console.log("]))[Agent];
$;
{
    this.agentName;
}
sending;
message: $;
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
");        this.context.loggingService?.logDebug(";
Agent;
sending;
message: $;
{
    this.agentName;
}
", { messageType: message.type, recipient: message.recipient, correlationId: message.correlationId });        this.context.messageBus?.send(messageToSend);    }    // --- New: Method to send a message to another agent and wait for its response ---    /**     * Sends a message to a specific recipient agent and waits for a response     * with a matching correlation ID.     * @param recipient The name of the recipient agent. Required.     * @param type The type of message/command. Required.     * @param payload The data payload. Optional.     * @param timeout Optional timeout in milliseconds. Defaults to 10000 (10 seconds).     * @returns Promise<AgentResponse> The response from the recipient agent.     * @throws Error if the message bus is not available, if the request times out, or if the response indicates an error.     */    protected async requestAgent(recipient: string, type: string, payload?: any, timeout: number = 10000): Promise<AgentResponse> {        if (!this.context.messageBus) {            throw new Error('MessageBus is not available to send requests.');        }        // Generate a unique correlation ID for this request if not already provided        // Use the sender's name in the correlation ID for easier debugging        const correlationId = ";
req - $;
{
    this.agentName;
}
-$;
{
    recipient;
}
-$;
{
    type;
}
-$;
{
    Date.now();
}
-$;
{
    Math.random().toString(16).slice(2);
}
";        // Note: We don't modify the original message object here, as it's created internally.        console.log("[Agent];
$;
{
    this.agentName;
}
sending;
request;
and;
waiting;
for (response; ; )
    : $;
{
    type;
}
to;
$;
{
    recipient;
}
(Correlation);
ID: $;
{
    correlationId;
}
");        this.context.loggingService?.logDebug(";
Agent;
sending;
request;
and;
waiting: $;
{
    this.agentName;
}
", { recipient, messageType: type, correlationId });        return new Promise<AgentResponse>((resolve, reject) => {            // Store the resolve/reject functions and the timer ID keyed by correlation ID            const timer = setTimeout(() => {                if (this.pendingRequests.has(correlationId)) {                    this.pendingRequests.delete(correlationId);                    console.error("[MessageBus];
Request;
timed;
out: $;
{
    type;
}
to;
$;
{
    recipient;
}
(Correlation);
ID: $;
{
    correlationId;
}
");                    // --- Best Practice: Reject with AgentError ---                    reject(new AgentError(";
Request;
to;
agent;
$;
{
    recipient;
}
timed;
out;
after;
$;
{
    timeout;
}
ms.(__makeTemplateObject(["));                    // --- End Best Practice ---                }            }, timeout);            this.pendingRequests.set(correlationId, { resolve, reject, timer });            // Send the message via the bus (which routes it to the recipient agent)            this.send(message);        });    }    // --- End New ---}"], ["));\\\n                    // --- End Best Practice ---\\\n                }\\\n            }, timeout);\\\n\\\n            this.pendingRequests.set(correlationId, { resolve, reject, timer });\\\n\\\n            // Send the message via the bus (which routes it to the recipient agent)\\\n            this.send(message);\\\n        });\\\n    }\\\n    // --- End New ---\\\n}\\\n"]))(__makeTemplateObject([""], [""]));
