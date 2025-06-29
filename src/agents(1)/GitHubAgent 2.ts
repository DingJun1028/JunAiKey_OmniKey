```typescript
// src/agents/GitHubAgent.ts
// GitHub代理 (GitHub Agent)
// Handles interactions with the GitHub API.
// Part of the Agent System Architecture.
// Design Principle: Encapsulates GitHub specific logic.

import { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types

// Import existing services/runes this agent will interact with (temporarily)
// In a full refactor, the logic from these services/runes might move INTO this agent.
// For MVP, this agent acts as a proxy to the existing services/runes.
// import { GitHubRune } from '../runes/GitHubRune'; // Import the GitHubRune


export class GitHubAgent extends BaseAgent {
    // private gitHubRune: GitHubRune | null = null; // Reference to the GitHubRune

    constructor(context: SystemContext) {
        super('github', context);
    }

    /**
     * Initializes the GitHub Agent by getting a reference to the GitHubRune.
     */
    init(): void {
        super.init(); // Call base init
        try {
            // Get reference to the GitHubRune from the RuneEngraftingCenter via context
            // this.gitHubRune = this.context.sacredRuneEngraver?.runeImplementations.get('github-rune')?.instance || null; // Access internal map for MVP
            // if (!this.gitHubRune) {
            //      console.warn('[GitHubAgent] GitHubRune is not registered or available.');
            //      // Handle error - maybe set agent status to unhealthy for GitHub features
            // } else {
            //      console.log('[GitHubAgent] GitHubRune obtained.');
            // }
        } catch (error) {
            console.error('[GitHubAgent] Failed to get GitHubRune during init:', error);
            // Handle error - maybe log or set agent status to unhealthy
        }
    }


    /**
     * Handles messages directed to the GitHub Agent.
     * Performs GitHub API calls by calling the GitHubRune.
     * @param message The message to handle. Expected payload varies by type.
     * @returns Promise<AgentResponse> The response containing the API result or error.
     */
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
        console.log(`[GitHubAgent] Handling message: ${message.type} (Correlation ID: ${message.correlationId || 'N/A'})`);

        const userId = this.context.currentUser?.id;
        if (!userId) {
             return { success: false, error: 'User not authenticated.' };
        }

        // Delegate to the GitHubRune via RuneEngraftingCenter
        // This agent acts as a router/proxy to the Rune
        if (!this.context.sacredRuneEngraver) { // Check if RuneEngraver is available
             return { success: false, error: 'RuneEngraftingCenter is not available.' };
        }

        try {
            let result: any;
            switch (message.type) {
                case 'callAPI': // Generic API call type, as defined in the Rune manifest
                    // Payload: { endpoint: string, method: string, data?: any, config?: any }
                    if (!message.payload?.endpoint || !message.payload?.method) {
                         throw new Error('Endpoint and method are required for callAPI.');
                    }
                    // Request the action from the RuneEngraftingCenter
                    result = await this.requestAgent(
                        'rune_engrafting', // Target the RuneEngrafting Agent
                        'execute_rune_action', // Message type for RuneEngrafting Agent
                        {
                            runeId: 'github-rune', // The specific Rune ID
                            action: 'callAPI', // The action to execute on the rune
                            params: message.payload, // Pass parameters to the rune action
                        },
                        15000 // Timeout for rune execution
                    );
                    // The result from requestAgent is already an AgentResponse from RuneEngraftingAgent.
                    // We just return it directly.
                    return result;


                case 'getUser': // Specific GitHub task
                    // Payload: {}
                    // Request the action from the RuneEngraftingCenter
                    result = await this.requestAgent(
                        'rune_engrafting', // Target the RuneEngrafting Agent
                        'execute_rune_action', // Message type for RuneEngrafting Agent
                        {
                            runeId: 'github-rune', // The specific Rune ID
                            action: 'getUser', // The action to execute on the rune
                            params: message.payload, // Pass parameters (should be empty for getUser)
                        },
                        10000 // Timeout for rune execution
                    );
                    // The result from requestAgent is already an AgentResponse from RuneEngraftingAgent.
                    // We just return it directly.
                    return result;


                case 'listRepos': // Specific GitHub task
                    // Payload: { type?: 'all' | 'owner' | 'member' }
                    // Request the action from the RuneEngraftingCenter
                    result = await this.requestAgent(
                        'rune_engrafting', // Target the RuneEngrafting Agent
                        'execute_rune_action', // Message type for RuneEngrafting Agent
                        {
                            runeId: 'github-rune', // The specific Rune ID
                            action: 'listRepos', // The action to execute on the rune
                            params: message.payload, // Pass parameters
                        },
                        15000 // Timeout for rune execution
                    );
                    // The result from requestAgent is already an AgentResponse from RuneEngraftingAgent.
                    // We just return it directly.
                    return result;


                case 'createIssue': // Specific GitHub task
                    // Payload: { owner: string, repo: string, title: string, body?: string, labels?: string[] }
                    if (!message.payload?.owner || !message.payload?.repo || !message.payload?.title) {
                         throw new Error('owner, repo, and title are required for createIssue.');
                    }
                    // Request the action from the RuneEngraftingCenter
                    result = await this.requestAgent(
                        'rune_engrafting', // Target the RuneEngrafting Agent
                        'execute_rune_action', // Message type for RuneEngrafting Agent
                        {
                            runeId: 'github-rune', // The specific Rune ID
                            action: 'createIssue', // The action to execute on the rune
                            params: message.payload, // Pass parameters
                        },
                        20000 // Timeout for rune execution
                    );
                    // The result from requestAgent is already an AgentResponse from RuneEngraftingAgent.
                    // We just return it directly.
                    return result;


                // TODO: Add cases for other GitHub tasks if needed (e.g., 'getRepoContent', 'createCommit', 'listPullRequests')

                default:
                    console.warn(`[GitHubAgent] Unknown message type: ${message.type}`);
                    return { success: false, error: `Unknown message type for GitHubAgent: ${message.type}` };
            }
        } catch (error: any) {
            console.error(`[GitHubAgent] Error handling message ${message.type}:`, error);
            return { success: false, error: error.message || 'An error occurred in GitHubAgent.' };
        }
    }

    // TODO: Implement methods to send messages to other agents if needed
}
```