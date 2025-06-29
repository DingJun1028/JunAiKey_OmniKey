```typescript
// src/agents/GoalManagementAgent.ts
// \u76ee\u6a19\u7ba1\u7406\u4ee3\u7406 (Goal Management Agent)
// Handles operations related to user goals and key results.
// Part of the Agent System Architecture.
// Design Principle: Encapsulates goal management logic.
// --- Modified: Add operations for goals and key results (create, get, update, delete, update progress, link/unlink task) --
// --- Modified: Update handleMessage to delegate to GoalManagementService --
// --- Modified: Update handleMessage to use requestAgent for SupabaseAgent calls --


import { SystemContext, Goal, KeyResult } from '../../interfaces'; // Import types
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types
import { AgentFactory } from './AgentFactory'; // Import AgentFactory

// Import existing services this agent will interact with (temporarily)
// In a full refactor, the logic from these services would move INTO this agent.
// For MVP, this agent acts as a proxy to the existing services.
// import { GoalManagementService } from '../core/goal-management/GoalManagementService'; // Access via context
// import { SupabaseAgent } from './SupabaseAgent'; // Access via requestAgent


export class GoalManagementAgent extends BaseAgent {
    // private goalManagementService: GoalManagementService; // Access via context
    // private supabaseAgent: SupabaseAgent; // Access via requestAgent


    constructor(context: SystemContext) {
        super('goal_management', context);
        // Services are accessed via context
    }

    /**
     * Initializes the Goal Management Agent.
     */
    init(): void {
        super.init(); // Call base init
        try {
            // Services are accessed via context, no need to get them here explicitly for MVP
            console.log('[GoalManagementAgent] Init completed.');

            // TODO: Subscribe to relevant events (e.g., 'task_completed') to trigger KR progress updates
            // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompleted(payload));

        } catch (error) {
            console.error('[GoalManagementAgent] Failed during init:', error);
            // Handle error
        }
    }

    /**
     * Handles a task completed event to potentially update KR progress.
     * This method is called by the EventBus listener.
     * @param payload The task completed event payload (includes taskId, userId).
     */
    private async handleTaskCompleted(payload: any): Promise<void> {
        console.log('[GoalManagementAgent] Handling task_completed event.');
        // Find KRs linked to this task and check/update their progress
        // This requires fetching tasks by ID to get the linked_kr_id
        // Or fetching KRs by linked_task_ids
        // For MVP, let's assume the task payload includes linked_kr_id
        if (payload?.taskId && payload?.userId && payload?.linked_kr_id) {
            console.log(`[GoalManagementAgent] Task ${payload.taskId} completed, linked to KR ${payload.linked_kr_id}. Checking KR completion.`);
            try {
                // Call the service method to check and complete the KR if necessary
                // This method is already implemented in GoalManagementService
                await this.context.goalManagementService?.checkAndCompleteKeyResultIfTaskCompleted(payload.linked_kr_id, payload.taskId, payload.userId);
            } catch (error: any) {
                console.error(`[GoalManagementAgent] Error checking KR completion after task ${payload.taskId} completed:`, error.message);
                // Log the error
            }
        }
    }


    /**
     * Handles messages directed to the Goal Management Agent.
     * Performs operations by delegating to the GoalManagementService.
     * @param message The message to handle. Expected payload varies by type.
     * @returns Promise<AgentResponse> The response containing the result or error.
     */
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\
        console.log(`[GoalManagementAgent] Handling message: ${message.type} (Correlation ID: ${message.correlationId || 'N/A'})`);\\\
\\\n        const userId = this.context.currentUser?.id;\\\
        if (!userId) {\\\
             return { success: false, error: 'User not authenticated.' };\\\
        }\\\n\\\n        try {\\\
            let result: any;\\\
            switch (message.type) {\\\
                case 'create_goal':\\\
                    // Payload: { goalDetails: Omit<Goal, 'id' | 'status' | 'creation_timestamp' | 'key_results'>, keyResults?: Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'>[] }\\\
                    if (!message.payload?.goalDetails?.description || !message.payload?.goalDetails?.type) {\\\
                         throw new Error('Goal description and type are required to create goal.');\\\
                    }\\\
                    // Delegate to GoalManagementService\\\
                    result = await this.context.goalManagementService?.createGoal(\\\n                        message.payload.goalDetails,\\\n                        message.payload.keyResults,\\\n                        userId // Use userId from agent context\\\
                    );\\\
                    if (!result) throw new Error('Failed to create goal.');\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_goals':\\\
                    // Payload: { status?: Goal['status'] }\\\
                    // Delegate to GoalManagementService\\\
                    result = await this.context.goalManagementService?.getGoals(userId, message.payload?.status);\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_goal_by_id':\\\
                    // Payload: { goalId: string }\\\
                    if (!message.payload?.goalId) {\\\
                         throw new Error('Goal ID is required.');\\\
                    }\\\
                    // Delegate to GoalManagementService\\\
                    result = await this.context.goalManagementService?.getGoalById(message.payload.goalId, userId);\\\
                    if (!result) return { success: false, error: 'Goal not found or not accessible.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'update_goal':\\\
                    // Payload: { goalId: string, updates: Partial<Omit<Goal, 'id' | 'user_id' | 'creation_timestamp' | 'key_results'>> }\\\
                    if (!message.payload?.goalId || !message.payload?.updates) {\\\
                         throw new Error('Goal ID and updates are required to update goal.');\\\
                    }\\\
                    // Delegate to GoalManagementService\\\
                    result = await this.context.goalManagementService?.updateGoal(\\\n                        message.payload.goalId,\\\n                        message.payload.updates,\\\
                        userId\\\
                    );\\\
                    if (!result) return { success: false, error: 'Goal not found or not owned by user.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'delete_goal':\\\
                    // Payload: { goalId: string }\\\
                    if (!message.payload?.goalId) {\\\
                         throw new Error('Goal ID is required to delete goal.');\\\
                    }\\\
                    // Delegate to GoalManagementService\\\
                    result = await this.context.goalManagementService?.deleteGoal(message.payload.goalId, userId);\\\
                    if (!result) return { success: false, error: 'Goal not found or not owned by user.' };\\\
                    return { success: true, data: { goalId: message.payload.goalId } }; // Return deleted ID\\\
\\\n                case 'update_key_result_progress':\\\
                    // Payload: { krId: string, currentValue: number }\\\
                    if (!message.payload?.krId || message.payload?.currentValue === undefined) {\\\
                         throw new Error('KR ID and currentValue are required to update KR progress.');\\\
                    }\\\
                    // Delegate to GoalManagementService\\\
                    result = await this.context.goalManagementService?.updateKeyResultProgress(\\\n                        message.payload.krId,\\\n                        message.payload.currentValue,\\\
                        userId // Use userId from agent context\\\
                    );\\\
                    if (!result) return { success: false, error: 'Key Result not found or parent goal not owned by user.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'link_task_to_key_result':\\\
                    // Payload: { taskId: string, krId: string }\\\
                    if (!message.payload?.taskId || !message.payload?.krId) {\\\
                         throw new Error('Task ID and KR ID are required to link task to KR.');\\\
                    }\\\
                    // Delegate to GoalManagementService\\\
                    result = await this.context.goalManagementService?.linkTaskToKeyResult(\\\n                        message.payload.krId, // GoalManagementService expects krId first\\\
                        message.payload.taskId,\\\
                        userId\\\
                    );\\\
                    if (!result) return { success: false, error: 'Task or KR not found or not owned by user.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'unlink_task_from_kr':\\\
                    // Payload: { taskId: string, krId: string }\\\
                    if (!message.payload?.taskId || !message.payload?.krId) {\\\
                         throw new Error('Task ID and KR ID are required to unlink task from KR.');\\\
                    }\\\
                    // Delegate to GoalManagementService\\\
                    result = await this.context.goalManagementService?.unlinkTaskFromKeyResult(\\\n                        message.payload.krId, // GoalManagementService expects krId first\\\
                        message.payload.taskId,\\\
                        userId\\\
                    );\\\
                    if (!result) return { success: false, error: 'Task or KR not found or not owned by user.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'check_and_complete_key_result_if_task_completed':\\\
                    // Payload: { krId: string, taskId: string }\\\
                    if (!message.payload?.krId || !message.payload?.taskId) {\\\
                         throw new Error('KR ID and Task ID are required to check KR completion.');\\\
                    }\\\
                    // Delegate to GoalManagementService\\\
                    result = await this.context.goalManagementService?.checkAndCompleteKeyResultIfTaskCompleted(\\\n                        message.payload.krId,\\\n                        message.payload.taskId,\\\
                        userId\\\
                    );\\\
                    // This method returns the updated KR or undefined/existing KR, not necessarily an error on no update\\\
                    return { success: true, data: result };\\\
\\\n\\\n                // TODO: Add cases for other Goal Management operations (e.g., add_key_result, update_key_result, delete_key_result)\\\
\\\n                default:\\\
                    console.warn(`[GoalManagementAgent] Unknown message type: ${message.type}`);\\\
                    return { success: false, error: `Unknown message type for GoalManagementAgent: ${message.type}` };\\\
            }\\\n        } catch (error: any) {\\\
            console.error(`[GoalManagementAgent] Error handling message ${message.type}:`, error);\\\
            return { success: false, error: error.message || 'An error occurred in GoalManagementAgent.' };\\\
        }\\\n    }\\\n\\\n    // TODO: Implement methods to send messages to other agents if needed\\\
}\\\n```