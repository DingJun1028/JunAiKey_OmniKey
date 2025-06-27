```typescript
// src/agents/AuthorityForgingAgent.ts
// \u6b0a\u80fd\u935b\u9020\u4ee3\u7406 (Authority Forging Agent)
// Handles operations related to user actions and automated abilities.
// Part of the Agent System Architecture.
// Design Principle: Encapsulates authority forging logic.
// --- Modified: Add operations for abilities (forge, get, update, delete, execute) --
// --- New: Implement event listeners for triggering abilities --
// --- Modified: Ensure findMatchingAbilities is called on relevant events --
\
\
import { SystemContext, UserAction, ForgedAbility, AbilityTrigger, SystemEvent } from '../../interfaces'; // Import types including SystemEvent\
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\
import { AgentFactory } from './AgentFactory'; // Import AgentFactory\
\
// Import existing services this agent will interact with (temporarily)\
// In a full refactor, the logic from these services would move INTO this agent.\
// For MVP, this agent acts as a proxy to the existing services.\
// import { AuthorityForgingEngine } from '../core/authority/AuthorityForgingEngine'; // Access via context\
\
\
export class AuthorityForgingAgent extends BaseAgent {\
    // private authorityForgingEngine: AuthorityForgingEngine; // Access via context\
\
    constructor(context: SystemContext) {\
        super('authority_forging', context);\
        // Services are accessed via context\
    }\
\
    /**\
     * Initializes the Authority Forging Agent.\
     */\
    init(): void {\
        super.init(); // Call base init\
        try {\
            // Services are accessed via context, no need to get them here explicitly for MVP\
            console.log('[AuthorityForgingAgent] Init completed.');\
\
            // --- New: Subscribe to events that can trigger abilities ---\
            if (this.context.eventBus) {\
                 const userId = this.context.currentUser?.id; // Get current user ID\
                 if (userId) { // Only subscribe if a user is logged in\
                     // Subscribe to user action recorded events\
                     this.context.eventBus.subscribe('user_action_recorded', (payload: UserAction) => this.handleTriggerEvent(payload, userId));\
                     // Subscribe to system event recorded events\
                     this.context.eventBus.subscribe('system_event_recorded', (payload: SystemEvent) => this.handleTriggerEvent(payload, userId));\
                     // TODO: Subscribe to other relevant events (e.g., 'task_completed', 'goal_updated', 'notification_received')\
                 } else {\
                     console.warn('[AuthorityForgingAgent] User not logged in. Skipping event subscriptions for triggers.');\
                 }\
            } else {\
                 console.warn('[AuthorityForgingAgent] EventBus not available. Cannot subscribe to trigger events.');\
            }\
            // --- End New ---\
\
        } catch (error) {\
            console.error('[AuthorityForgingAgent] Failed during init:', error);\
            // Handle error\
        }\
    }\
\
    // --- New: Handle incoming trigger events ---\
    /**\
     * Handles incoming events that might trigger automated abilities.\
     * @param eventPayload The payload of the event (e.g., UserAction, SystemEvent).\
     * @param userId The user ID associated with the event.\
     * @returns Promise<void>\
     */\
    private async handleTriggerEvent(eventPayload: any, userId: string): Promise<void> {\
        console.log(`[AuthorityForgingAgent] Received potential trigger event for user ${userId}: ${eventPayload?.type || 'Unknown Type'}`);\
        this.context.loggingService?.logInfo(`AuthorityForgingAgent received potential trigger event`, { userId, eventType: eventPayload?.type, eventSource: eventPayload?.source, correlationId: eventPayload?.context?.correlationId });\
\
        if (!userId || !eventPayload) {\
             console.warn('[AuthorityForgingAgent] Cannot handle trigger event: User ID or event payload missing.');\
             return;\
        }\
\
        if (!this.context.authorityForgingEngine) {\
             console.warn('[AuthorityForgingAgent] AuthorityForgingEngine not available. Cannot find matching abilities.');\
             return;\
        }\
\
        try {\
            // Find enabled abilities for this user whose triggers match the event payload\
            const matchingAbilities = await this.context.authorityForgingEngine.findMatchingAbilities(eventPayload, userId);\
\
            if (matchingAbilities.length > 0) {\
                console.log(`[AuthorityForgingAgent] Found ${matchingAbilities.length} matching abilities for event type: ${eventPayload?.type}. Triggering execution.`);\
                this.context.loggingService?.logInfo(`Found ${matchingAbilities.length} matching abilities for event type: ${eventPayload?.type}. Triggering execution.`, { userId, eventType: eventPayload?.type, matchingAbilityIds: matchingAbilities.map(a => a.id) });\
\
                // Trigger the execution of each matching ability\
                // Send a message back to the AuthorityForgingAgent itself to execute the ability\
                // This ensures execution goes through the agent's queue and handleMessage logic.\
                for (const ability of matchingAbilities) {\
                    console.log(`[AuthorityForgingAgent] Sending execute_ability message for ability: ${ability.id}`);\
                    // Generate a new correlationId for the execution triggered by this event\
                    const executionCorrelationId = `exec-trigger-${ability.id}-${eventPayload?.id || Date.now()}-${Math.random().toString(16).slice(2)}`;\
                    this.sendMessage({\
                        type: 'execute_ability', // Message type to execute an ability\
                        payload: { id: ability.id, params: { triggerEvent: eventPayload } }, // Pass ability ID and the trigger event payload as params\
                        recipient: this.agentName, // Send back to AuthorityForgingAgent for execution\
                        correlationId: executionCorrelationId, // Include correlation ID for this execution\
                        sender: this.agentName, // Sender is AuthorityForgingAgent\
                    });\
                }\
\
            } else {\
                // console.log(`[AuthorityForgingAgent] No matching abilities found for event type: ${eventPayload?.type}.`); // Avoid excessive logging\
            }\
\
        } catch (error: any) {\
            console.error(`[AuthorityForgingAgent] Error handling trigger event for user ${userId}:`, error);\
            this.context.loggingService?.logError(`AuthorityForgingAgent error handling trigger event`, { userId, eventType: eventPayload?.type, error: error.message });\
            // TODO: Record a system event for the trigger handling failure\
        }\
    }\
    // --- End New ---\
\
\
    /**\
     * Handles messages directed to the Authority Forging Agent.\
     * Performs operations by delegating to the AuthorityForgingEngine.\
     * @param message The message to handle. Expected payload varies by type.\
     * @returns Promise<AgentResponse> The response containing the result or error.\
     */\
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\n        console.log(`[AuthorityForgingAgent] Handling message: ${message.type} (Correlation ID: ${message.correlationId || 'N/A'})`);\\\n\\\n        const userId = this.context.currentUser?.id;\\\n        if (!userId) {\\\n             return { success: false, error: 'User not authenticated.' };\\\n        }\\\n\\\n        try {\\\n            let result: any;\\\n            switch (message.type) {\\\n                case 'record_action':\\\n                    // Payload: Omit<UserAction, 'id' | 'timestamp'>\\\n                    if (!message.payload?.type) {\\\n                         throw new Error('Action type is required to record action.');\\\n                    }\\\n                    // Ensure user_id is set from context if not provided in payload (payload might come from UI)\\\n                    if (!message.payload.user_id) {\\\n                         message.payload.user_id = userId;\\\n                    }\\\n                    // Delegate to AuthorityForgingEngine\\\n                    result = await this.context.authorityForgingEngine?.recordAction(message.payload);\\\n                    if (!result) throw new Error('Failed to record action.');\\\n                    return { success: true, data: result };\\\n\\\n                case 'manually_forge_ability':\\\n                    // Payload: { name: string, description: string, script: string, trigger: AbilityTrigger }\\\n                    if (!message.payload?.name || !message.payload?.script || !message.payload?.trigger) {\\\n                         throw new Error('Name, script, and trigger are required to forge ability.');\\\n                    }\\\n                    // Delegate to AuthorityForgingEngine\\\n                    result = await this.context.authorityForgingEngine?.manuallyForgeAbility(\\\n                        message.payload.name,\\\\\n                        message.payload.description,\\\\\n                        message.payload.script,\\\\\n                        message.payload.trigger,\\\\\n                        userId // Use userId from agent context\\\\\\\n                    );\\\\\\\n                    if (!result) throw new Error('Failed to forge ability.');\\\\\\\n                    return { success: true, data: result };\\\\\\\n\\\\\\n                case 'forge_ability_from_actions':\\\\\\\n                    // Payload: { actionDetails: UserAction['details'][], forgedFromInsightId?: string }\\\\\\\n                    if (!message.payload?.actionDetails || !Array.isArray(message.payload.actionDetails) || message.payload.actionDetails.length === 0) {\\\\\\\n                         throw new Error('Action details are required to forge ability from actions.');\\\\\\\n                    }\\\\\\n                    // Delegate to AuthorityForgingEngine\\\\\\\n                    result = await this.context.authorityForgingEngine?.forgeAbilityFromActions(\\\\\\n                        message.payload.actionDetails,\\\\\\n                        userId, // Use userId from agent context\\\\\\\n                        message.payload.forgedFromInsightId\\\\\\n                    );\\\\\\\n                    if (!result) throw new Error('Failed to forge ability from actions.');\\\\\\\n                    return { success: true, data: result };\\\\\\\n\\\\\\n                case 'get_abilities':\\\\\\\n                    // Payload: { typeFilter?: string }\\\\\\\n                    // Delegate to AuthorityForgingEngine\\\\\\\n                    result = await this.context.authorityForgingEngine?.getAbilities(message.payload?.typeFilter, userId);\\\\\\\n                    return { success: true, data: result };\\\\\\\n\\\\\\n                case 'update_ability':\\\\\\\n                    // Payload: { id: string, updates: Partial<Omit<ForgedAbility, 'id' | 'user_id' | 'creation_timestamp' | 'last_used_timestamp' | 'forged_from_actions'>> }\\\\\\\n                    if (!message.payload?.id || !message.payload?.updates) {\\\\\\\n                         throw new Error('ID and updates are required to update ability.');\\\\\\\n                    }\\\\\\n                    // Delegate to AuthorityForgingEngine\\\\\\\n                    result = await this.context.authorityForgingEngine?.updateAbility(\\\\\\n                        message.payload.id,\\\\\\n                        message.payload.updates,\\\\\\n                        userId // Use userId from agent context\\\\\\\n                    );\\\\\\\n                    if (!result) return { success: false, error: 'Ability not found or not owned by user.' };\\\\\\\n                    return { success: true, data: result };\\\\\\\n\\\\\\n                case 'delete_ability':\\\\\\\n                    // Payload: { id: string }\\\\\\\n                    if (!message.payload?.id) {\\\\\\\n                         throw new Error('ID is required to delete ability.');\\\\\\\n                    }\\\\\\n                    // Delegate to AuthorityForgingEngine\\\\\\\n                    result = await this.context.authorityForgingEngine?.deleteAbility(\\\\\\n                        message.payload.id,\\\\\\n                        userId // Use userId from agent context\\\\\\\n                    );\\\\\\\n                    if (!result) return { success: false, error: 'Ability not found or not owned by user.' };\\\\\\\n                    return { success: true, data: { id: message.payload.id } }; // Return deleted ID\\\\\\\n\\\\\\n                case 'execute_ability':\\\\\\\n                    // Payload: { id: string, params?: any }\\\\\\\n                    if (!message.payload?.id) {\\\\\\\n                         throw new Error('ID is required to execute ability.');\\\\\\\n                    }\\\\\\n                    // Delegate to AuthorityForgingEngine\\\\\\\n                    result = await this.context.authorityForgingEngine?.executeAbility(\\\\\\n                        message.payload.id,\\\\\\n                        userId, // Use userId from agent context\\\\\\\n                        message.payload.params\\\\\\\n                    );\\\\\\\n                    // executeAbility returns the result directly\\\\\\\n                    return { success: true, data: result };\\\\\\\n\\\\\\n\\\n                // TODO: Add cases for other Authority Forging operations (e.g., get_recent_actions)\\\n\\\n                default:\\\n                    console.warn(`[AuthorityForgingAgent] Unknown message type: ${message.type}`);\\\n                    return { success: false, error: `Unknown message type for AuthorityForgingAgent: ${message.type}` };\\\n            }\\\n        } catch (error: any) {\\\n            console.error(`[AuthorityForgingAgent] Error handling message ${message.type}:`, error);\\\n            return { success: false, error: error.message || 'An error occurred in AuthorityForgingAgent.' };\\\n        }\\\n    }\\\n\\\n    // TODO: Implement methods to send messages to other agents if needed\\\n}\\\n```