```typescript
// src/agents/MessageBus.ts
// \u8a0a\u606f\u7e3d\u7dda (Message Bus)
// Provides a central hub for agents to send and receive messages.
// Part of the Agent System Architecture.
// Design Principle: Decouples agents, enabling flexible communication.
// --- Modified: Implement sendMessageAndWaitForResponse method --
// --- Modified: Implement handleAgentResponse to match pending requests by correlationId --
// --- Best Practice: Use stricter typing for messages and responses --
// --- Best Practice: Add logging for message processing lifecycle --

import { AgentMessage, AgentResponse, AgentError } from './BaseAgent'; // Import AgentMessage, AgentResponse, AgentError types
import { AgentRouter } from './AgentRouter'; // Import AgentRouter

/**
 * The central Message Bus for inter-agent communication.
 */
class MessageBus {
    private static instance: MessageBus;
    private listeners: Map<string, Function[]> = new Map(); // Direct listeners (less common in pure agent model)
    private router: AgentRouter | null = null; // The agent router

    // --- New: Map to track pending requests for the request/response pattern ---
    // Map: correlationId -> { resolve: Function, reject: Function, timer: NodeJS.Timeout }
    private pendingRequests: Map<string, { resolve: (response: AgentResponse) => void, reject: (error: Error) => void, timer: any }> = new Map();
    // --- End New ---


    private constructor() {
        console.log('[MessageBus] Initialized.');
        // --- New: Subscribe to agent_response messages to handle pending requests ---
        // The router or the agent itself publishes 'agent_response' messages.
        // The MessageBus listens to these to match them with pending requests.
        this.subscribe('agent_response', this.handleAgentResponse.bind(this));
        // --- End New ---
    }

    /**
     * Gets the singleton instance of the MessageBus.
     * @param router The AgentRouter instance (required for the first call).
     * @returns The MessageBus instance.
     */
    public static getInstance(router?: AgentRouter): MessageBus {
        if (!MessageBus.instance) {
            if (!router) {
                throw new Error('AgentRouter instance must be provided on the first call to getInstance.');
            }
            MessageBus.instance = new MessageBus();
            MessageBus.instance.router = router; // Set the router
        } else {
             // Ensure the router is set if it wasn't on the very first call (less ideal)
             if (!MessageBus.instance.router && router) {
                 MessageBus.instance.router = router;
             }
        }
        return MessageBus.instance;
    }

    /**
     * Sends a message to the Message Bus.
     * If the message has a `recipient`, it is routed by the AgentRouter.
     * Otherwise, it is treated as a broadcast event and delivered to direct listeners.
     * @param message The message to send.
     */
    send(message: AgentMessage): void {
        console.log(`[MessageBus] Received message to send: ${message.type} (Recipient: ${message.recipient || 'Broadcast'}) (Correlation ID: ${message.correlationId || 'N/A'})`);
        // --- Best Practice: Add logging for message sending ---
        // Access loggingService via context (assuming context is available in MessageBus, which it is via AgentFactory)
        // Note: MessageBus doesn't directly have context, but AgentFactory does.
        // For MVP, we can assume context is available globally or passed during setup.
        // Let's add a placeholder log here. Real logging should use the service.
        // this.context.loggingService?.logDebug(`MessageBus sending message: ${message.type}`, { messageType: message.type, recipient: message.recipient, correlationId: message.correlationId, sender: message.sender });
        // --- End Best Practice ---


        if (message.recipient) {
            // Message has a specific recipient, route it
            if (!this.router) {
                console.error('[MessageBus] AgentRouter is not set. Cannot route message with recipient.');
                // Handle error - maybe log or send a system error event
                // If it's a request with correlationId, reject the pending promise
                if (message.correlationId && this.pendingRequests.has(message.correlationId)) {
                    const { reject, timer } = this.pendingRequests.get(message.correlationId)!;
                    clearTimeout(timer);
                    this.pendingRequests.delete(message.correlationId);
                    reject(new Error(`MessageBus Error: AgentRouter not available to route message to ${message.recipient}.`));
                }
                return;
            }
            // Forward the message to the router for routing
            this.router.routeMessage(message);
        } else {
            // Message has no specific recipient, treat as broadcast event
            this._deliverToListeners(message);
        }
    }

    /**
     * Subscribes a callback function to a specific message type.\
     * Note: In a pure agent model, agents primarily receive messages via receiveMessage().\
     * This subscribe method might be used by non-agent components (like UI) or for broadcasting events.\
     * @param eventType The type of message/event to subscribe to.\
     * @param callback The function to call when a message of this type is sent.\
     * @returns A function to unsubscribe.\
     */\
    subscribe(eventType: string, callback: Function): () => void {\
        console.log(`[MessageBus] Subscriber added for event type: ${eventType}`);\
        if (!this.listeners.has(eventType)) {\
            this.listeners.set(eventType, []);\
        }\
        this.listeners.get(eventType)!.push(callback);\
\
        // Return an unsubscribe function\
        return () => {\
            console.log(`[MessageBus] Subscriber removed for event type: ${eventType}`);\
            const handlers = this.listeners.get(eventType);\
            if (handlers) {\
                this.listeners.set(eventType, handlers.filter(handler => handler !== callback));\
            }\
        };\
    }\
\
    /**\
     * Internal method used by the MessageBus itself (when no recipient is set)\
     * to deliver a message to direct listeners.\
     * @param message The message to deliver.\
     */\
    private _deliverToListeners(message: AgentMessage): void {\
         console.log(`[MessageBus] Delivering message to listeners: ${message.type}`);\
         const handlers = this.listeners.get(message.type);\
         if (handlers) {\
             handlers.forEach(handler => {\
                 try {\
                     handler(message);\
                 } catch (error: any) {\
                     console.error(`[MessageBus] Error in listener for event type \\\"${message.type}\\\":`, error);\
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
```