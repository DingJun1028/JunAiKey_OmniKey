"use strict";
`` `typescript
// src/agents/RuneEngraftingAgent.ts
// \u7b26\u6587\u9444\u9020\u4ee3\u7406 (Rune Engrafting Agent)
// Handles operations related to Runes (registration, discovery, execution, installation, configuration).
// Part of the Agent System Architecture.
// Design Principle: Encapsulates Rune management and interaction logic.
// --- Modified: Add operations for runes (register, list, executeAction, install, uninstall, updateConfiguration) --
// --- New: Implement event listeners for rune events --
// --- Modified: Update handleMessage to delegate to SacredRuneEngraver --


import { SystemContext, Rune } from '../../interfaces'; // Import types
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types
import { AgentFactory } from './AgentFactory'; // Import AgentFactory

// Import existing services this agent will interact with (temporarily)
// In a full refactor, the logic from these services would move INTO this agent.
// For MVP, this agent acts as a proxy to the existing services.
// import { SacredRuneEngraver } from '../core/rune-engrafting/SacredRuneEngraver'; // Access via context


export class RuneEngraftingAgent extends BaseAgent {
    // private sacredRuneEngraver: SacredRuneEngraver; // Access via context


    constructor(context: SystemContext) {
        super('rune_engrafting', context);
        // Services are accessed via context
    }

    /**
     * Initializes the Rune Engrafting Agent.
     */
    init(): void {
        super.init(); // Call base init
        try {
            // Services are accessed via context, no need to get them here explicitly for MVP
            console.log('[RuneEngraftingAgent] Init completed.');

            // TODO: Subscribe to relevant events from SacredRuneEngraver if needed (e.g., 'rune_registered', 'rune_uninstalled')
            // This agent might need to react to these events, although the UI also listens directly.
            // Example: this.context.eventBus.subscribe('rune_registered', (payload) => this.handleRuneRegistered(payload));

        } catch (error) {
            console.error('[RuneEngraftingAgent] Failed during init:', error);
            // Handle error
        }
    }


    /**
     * Handles messages directed to the Rune Engrafting Agent.
     * Performs operations by delegating to the SacredRuneEngraver.
     * @param message The message to handle. Expected payload varies by type.
     * @returns Promise<AgentResponse> The response containing the result or error.
     */
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
        console.log(`[RuneEngraftingAgent];
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
`);

        const userId = this.context.currentUser?.id;
        if (!userId) {
             return { success: false, error: 'User not authenticated.' };
        }

        if (!this.context.sacredRuneEngraver) { // Check if SacredRuneEngraver is available
             return { success: false, error: 'SacredRuneEngraver service is not available.' };
        }

        try {
            let result: any;
            switch (message.type) {
                case 'register_rune':
                    // Payload: Rune (including implementation reference)
                    if (!message.payload?.id || !message.payload?.implementation) {
                         throw new Error('Rune ID and implementation are required to register rune.');
                    }
                    // Delegate to SacredRuneEngraver
                    await this.context.sacredRuneEngraver.registerRune(message.payload);
                    result = { message: `;
Rune;
$;
{
    message.payload.name;
}
registered. ` };
                    return { success: true, data: result };

                case 'list_runes':
                    // Payload: { typeFilter?: Rune['type'] }
                    // Delegate to SacredRuneEngraver
                    result = await this.context.sacredRuneEngraver.listRunes(message.payload?.typeFilter, userId); // Pass userId
                    return { success: true, data: result };

                case 'execute_rune_action':
                    // Payload: { runeId: string, action: string, params?: any }
                    if (!message.payload?.runeId || !message.payload?.action) {
                         throw new Error('Rune ID and action are required to execute rune action.');
                    }
                    // Delegate to SacredRuneEngraver
                    result = await this.context.sacredRuneEngraver.executeRuneAction(
                        message.payload.runeId,
                        message.payload.action,
                        message.payload.params,
                        userId // Pass userId
                    );
                    // executeRuneAction returns the result directly
                    return { success: true, data: result };

                case 'install_rune':
                    // Payload: { publicRuneId: string }
                    if (!message.payload?.publicRuneId) {
                         throw new Error('Public Rune ID is required to install rune.');
                    }
                    // Delegate to SacredRuneEngraver
                    result = await this.context.sacredRuneEngraver.installRune(message.payload.publicRuneId, userId); // Pass publicRuneId and userId
                    // installRune returns the new user rune or null if already installed
                    return { success: true, data: result };

                case 'uninstall_rune':
                    // Payload: { userRuneId: string }
                    if (!message.payload?.userRuneId) {
                         throw new Error('User Rune ID is required to uninstall rune.');
                    }
                    // Delegate to SacredRuneEngraver
                    result = await this.context.sacredRuneEngraver.uninstallRune(message.payload.userRuneId, userId); // Pass userRuneId and userId
                    if (!result) return { success: false, error: 'User Rune not found or not owned by user.' };
                    return { success: true, data: { userRuneId: message.payload.userRuneId } }; // Return deleted ID

                case 'update_rune_configuration':
                    // Payload: { userRuneId: string, newConfig: any }
                    if (!message.payload?.userRuneId || message.payload?.newConfig === undefined) {
                         throw new Error('User Rune ID and new config are required to update configuration.');
                    }
                    // Delegate to SacredRuneEngraver
                    result = await this.context.sacredRuneEngraver.updateRuneConfiguration(
                        message.payload.userRuneId,
                        message.payload.newConfig,
                        userId // Pass userId
                    );
                    if (!result) return { success: false, error: 'User Rune not found or not owned by user.' };
                    return { success: true, data: result };

                case 'get_user_rune_capacity':
                    // Payload: {}
                    // Delegate to SacredRuneEngraver
                    result = await this.context.sacredRuneEngraver.getUserRuneCapacity(userId); // Pass userId
                    if (!result) throw new Error('Failed to get user rune capacity.');
                    return { success: true, data: result };


                // TODO: Add cases for other Rune operations (e.g., get_rune_by_id, get_rune_manifest)

                default:
                    console.warn(`[RuneEngraftingAgent];
Unknown;
message;
type: $;
{
    message.type;
}
`);
                    return { success: false, error: `;
Unknown;
message;
type;
for (RuneEngraftingAgent; ; )
    : $;
{
    message.type;
}
` };
            }
        } catch (error: any) {
            console.error(`[RuneEngraftingAgent];
Error;
handling;
message;
$;
{
    message.type;
}
`, error);
            return { success: false, error: error.message || 'An error occurred in RuneEngraftingAgent.' };
        }
    }

    // TODO: Implement methods to send messages to other agents if needed
}
` ``;
