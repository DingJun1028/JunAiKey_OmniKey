"use strict";
`` `typescript
// src/agents/BaseAgent.ts
// \u4ee3\u7406\u57fa\u790e\u985e\u5225 (Base Agent Class)
// Defines the fundamental structure and behavior for all agents in the system.
// Part of the Agent System Architecture.
// Design Principle: Provides encapsulation and a standardized message handling interface.
// --- Modified: Implement sendMessageAndWaitForResponse method --
// --- Modified: Implement handleAgentResponse to match pending requests by correlationId --
// --- New: Add method to send a message to another agent and wait for its response --
// --- Best Practice: Use stricter typing for messages and responses --
// --- Best Practice: Implement consistent error handling within handleMessage --
// --- Best Practice: Add logging for message processing lifecycle --

import { SystemContext } from '../interfaces'; // Assuming SystemContext interface exists
import { MessageBus } from './MessageBus'; // Import MessageBus class

// Re-export types from MessageBus for convenience
export type AgentMessage = {
    type: string; // The type of message/command
    payload?: any; // The data payload (optional)
    correlationId?: string; // Optional ID to correlate requests and responses
    sender?: string; // Optional sender agent name
    recipient?: string; // Optional recipient agent name (used by router)
};

export type AgentResponse = {
    success: boolean; // Indicates if the operation was successful
    data?: any; // The response data on success
    error?: string; // Error message on failure
};

// --- Best Practice: Define a custom error class for agent errors ---
export class AgentError extends Error {
    constructor(message: string, public details?: any) {
        super(message);
        this.name = 'AgentError';
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, AgentError.prototype);
    }
}
// --- End Best Practice ---


/**
 * Base class for all agents in the Jun.Ai.Key system.
 * Provides message queuing and processing logic.
 */
abstract class BaseAgent {
    protected agentName: string;
    protected context: SystemContext; // Access to system context (including MessageBus, other services)
    protected messageQueue: AgentMessage[] = [];
    protected processing = false;

    constructor(name: string, context: SystemContext) {
        this.agentName = name;
        this.context = context;
        console.log(`[Agent];
$;
{
    this.agentName;
}
initialized. `);
    }

    /**
     * Initializes the agent. Called by the AgentFactory after creation.
     * Can be overridden by subclasses for specific setup.
     */
    init(): void {
        console.log(`[Agent];
$;
{
    this.agentName;
}
init;
completed. `);
        // Subclasses can override this for specific initialization logic
    }

    /**
     * Receives a message and adds it to the agent's queue.
     * @param message The message to receive.
     */
    receiveMessage(message: AgentMessage): void {
        console.log(`[Agent];
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
`);
        this.context.loggingService?.logDebug(`;
Agent;
received;
message: $;
{
    this.agentName;
}
`, { messageType: message.type, correlationId: message.correlationId, sender: message.sender });
        this.messageQueue.push(message);
        if (!this.processing) {
            this.processQueue(); // Start processing if not already busy
        }
    }

    /**
     * Processes messages from the queue sequentially.
     */
    private async processQueue(): Promise<void> {
        this.processing = true;
        console.log(`[Agent];
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
`);
        this.context.loggingService?.logDebug(`;
Agent;
starting;
queue;
processing: $;
{
    this.agentName;
}
`, { queueSize: this.messageQueue.length });

        while (this.messageQueue.length > 0) {
            // Process one message at a time to maintain order
            const message = this.messageQueue.shift()!; // Get the next message

            console.log(`[Agent];
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
`);
            this.context.loggingService?.logDebug(`;
Agent;
processing;
message: $;
{
    this.agentName;
}
`, { messageType: message.type, correlationId: message.correlationId });


            let response: AgentResponse;
            try {
                // Handle the message using the subclass's implementation
                // Subclasses should return AgentResponse { success: boolean, data?: any, error?: string }
                response = await this.handleMessage(message);

                // --- Best Practice: Ensure handleMessage returns a valid AgentResponse ---
                if (typeof response !== 'object' || response === null || typeof response.success !== 'boolean') {
                     console.error(`[Agent];
$;
{
    this.agentName;
}
handleMessage;
for ($; { message, : .type }; returned)
    invalid;
response;
format: `, response);
                     this.context.loggingService?.logError(`;
Agent;
handleMessage;
returned;
invalid;
response;
format: $;
{
    this.agentName;
}
`, { messageType: message.type, correlationId: message.correlationId, response });
                     response = { success: false, error: `;
Agent;
$;
{
    this.agentName;
}
returned;
invalid;
response;
format. ` };
                }
                // --- End Best Practice ---


                // Send response only if the original message had a correlationId (indicating it was a request)
                if (message.correlationId) {
                    this.sendResponse(message, response); // Send response via MessageBus
                } else {
                    console.log(`[Agent];
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
sent. `);
                    this.context.loggingService?.logDebug(`;
Agent;
finished;
processing;
message;
without;
correlationId: $;
{
    this.agentName;
}
`, { messageType: message.type });
                }

            } catch (error: any) {
                console.error(`[Agent];
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
`, error);
                this.context.loggingService?.logError(`;
Agent;
failed;
to;
handle;
message: $;
{
    this.agentName;
}
`, { messageType: message.type, correlationId: message.correlationId, error: error.message });

                // Send an error response via MessageBus if the original message had a correlationId
                if (message.correlationId) {
                    // --- Best Practice: Send a structured error response ---
                    this.sendError(message, error.message || 'An unknown error occurred.');
                    // --- End Best Practice ---
                } else {
                     console.error(`[Agent];
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
logged. `);
                }
            }
        }
        this.processing = false;
        console.log(`[Agent];
$;
{
    this.agentName;
}
queue;
empty.Stopping;
processing. `);
        this.context.loggingService?.logDebug(`;
Agent;
queue;
empty: $;
{
    this.agentName;
}
`);
    }

    /**
     * Abstract method to be implemented by subclasses to handle specific message types.
     * Subclasses should perform the core logic for the message type.
     * They should return an `;
AgentResponse ` object indicating success or failure.
     * If an unhandled error occurs within `;
handleMessage `, it should be thrown,
     * and the `;
processQueue ` method will catch it and send an error response.
     * @param message The message to handle.
     * @returns Promise<AgentResponse> The response to the message.
     */
    protected abstract handleMessage(message: AgentMessage): Promise<AgentResponse>;

    /**
     * Sends a response message via the MessageBus.
     * @param originalMessage The original message this is a response to.
     * @param response The response payload.
     */
    protected sendResponse(originalMessage: AgentMessage, response: AgentResponse): void {\
        // Publish the response on the MessageBus\
        // The response type is typically 'agent_response'\
        // It includes the original correlationId and the sender's name.\
        const responseMessage: AgentMessage = {\
            type: 'agent_response', // Generic response type\
            payload: response,\
            correlationId: originalMessage.correlationId, // Link back to the original request\
            sender: this.agentName, // Identify the sender agent\
            // recipient is not needed for a response on a bus\
        };\
        console.log(`[Agent];
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
`);\
        this.context.loggingService?.logDebug(`;
Agent;
sending;
response: $;
{
    this.agentName;
}
`, { correlationId: originalMessage.correlationId, success: response.success });\
        this.context.messageBus?.send(responseMessage);\
    }\
\
    /**\
     * Sends an error response message via the MessageBus.\
     * @param originalMessage The original message that caused the error.\
     * @param errorMessage The error message.\
     */\
    protected sendError(originalMessage: AgentMessage, errorMessage: string): void {\
        const errorResponse: AgentResponse = {\
            success: false,\
            error: errorMessage,\
        };\
        this.sendResponse(originalMessage, errorResponse);\
    }\
\
    /**\
     * Sends a message to the Message Bus for routing or broadcasting.\
     * Agents should use this method to publish events (no recipient) or send requests (with recipient).\
     * @param message The message to send. Should include `;
type ` and `;
payload `.\
     *                Can include `;
recipient ` for targeted messages.\
     */\
    protected sendMessage(message: AgentMessage): void {\
        // Add sender to the message if not already present\
        const messageToSend = {\
            sender: this.agentName,\
            ...message,\
        };\
        console.log(`[Agent];
$;
{
    this.agentName;
}
sending;
message: $;
{
    message.type;
}
(Recipient, { message, recipient }) => ;
 || 'Broadcast';
(Correlation);
ID: $;
{
    message.correlationId || 'N/A';
}
`);\
        this.context.loggingService?.logDebug(`;
Agent;
sending;
message: $;
{
    this.agentName;
}
`, { messageType: message.type, recipient: message.recipient, correlationId: message.correlationId });\
        this.context.messageBus?.send(messageToSend);\
    }\
\
    // --- New: Method to send a message to another agent and wait for its response ---\
    /**\
     * Sends a message to a specific recipient agent and waits for a response\
     * with a matching correlation ID.\
     * @param recipient The name of the recipient agent. Required.\
     * @param type The type of message/command. Required.\
     * @param payload The data payload. Optional.\
     * @param timeout Optional timeout in milliseconds. Defaults to 10000 (10 seconds).\
     * @returns Promise<AgentResponse> The response from the recipient agent.\
     * @throws Error if the message bus is not available, if the request times out, or if the response indicates an error.\
     */\
    protected async requestAgent(recipient: string, type: string, payload?: any, timeout: number = 10000): Promise<AgentResponse> {\
        if (!this.context.messageBus) {\
            throw new Error('MessageBus is not available to send requests.');\
        }\
\
        // Generate a unique correlation ID for this request if not already provided\
        // Use the sender's name in the correlation ID for easier debugging\
        const correlationId = `;
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
`;\
        // Note: We don't modify the original message object here, as it's created internally.\
\
        console.log(`[Agent];
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
`);\
        this.context.loggingService?.logDebug(`;
Agent;
sending;
request;
and;
waiting: $;
{
    this.agentName;
}
`, { recipient, messageType: type, correlationId });\
\
\
        return new Promise<AgentResponse>((resolve, reject) => {\
            // Store the resolve/reject functions and the timer ID keyed by correlation ID\
            const timer = setTimeout(() => {\
                if (this.pendingRequests.has(correlationId)) {\
                    this.pendingRequests.delete(correlationId);\
                    console.error(`[MessageBus];
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
`);\
                    // --- Best Practice: Reject with AgentError ---\
                    reject(new AgentError(`;
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
ms. `));\
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
` ``;
