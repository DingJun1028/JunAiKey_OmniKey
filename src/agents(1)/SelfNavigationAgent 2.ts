```typescript
// src/agents/SelfNavigationAgent.ts
// \u81ea\u6211\u5c0e\u822a\u4ee3\u7406 (Self-Navigation Agent)
// Handles operations related to tasks and agentic flows.
// Part of the Agent System Architecture.
// Design Principle: Encapsulates self-navigation logic.
// --- Modified: Add operations for tasks and flows (create, get, update, delete, start, pause, resume, cancel) --
// --- Modified: Add operations for task steps (add, update, delete) --
// --- Modified: Add operations for flow structure (update) --
// --- Modified: Add operations for flow executions (get) --
// --- Modified: Add operations for linking tasks to KRs --
// --- Modified: Update handleMessage to delegate to SelfNavigationEngine --
// --- Modified: Update handleMessage to use requestAgent for GoalManagementAgent calls --


import { SystemContext, Task, TaskStep, AgenticFlow, AgenticFlowExecution } from '../../interfaces'; // Import types
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types
import { AgentFactory } from './AgentFactory'; // Import AgentFactory

// Import existing services this agent will interact with (temporarily)
// In a full refactor, the logic from these services would move INTO this agent.
// For MVP, this agent acts as a proxy to the existing services.
// import { SelfNavigationEngine } from '../core/self-navigation/SelfNavigationEngine'; // Access via context
// import { GoalManagementService } from '../core/goal-management/GoalManagementService'; // Access via context


export class SelfNavigationAgent extends BaseAgent {
    // private selfNavigationEngine: SelfNavigationEngine; // Access via context
    // private goalManagementService: GoalManagementService; // Access via context


    constructor(context: SystemContext) {
        super('self_navigation', context);
        // Services are accessed via context
    }

    /**
     * Initializes the Self-Navigation Agent.
     */
    init(): void {
        super.init(); // Call base init
        try {
            // Services are accessed via context, no need to get them here explicitly for MVP
            console.log('[SelfNavigationAgent] Init completed.');
        } catch (error) {
            console.error('[SelfNavigationAgent] Failed during init:', error);
            // Handle error
        }
    }


    /**
     * Handles messages directed to the Self-Navigation Agent.
     * Performs operations by delegating to the SelfNavigationEngine.
     * @param message The message to handle. Expected payload varies by type.
     * @returns Promise<AgentResponse> The response containing the result or error.
     */
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\
        console.log(`[SelfNavigationAgent] Handling message: ${message.type} (Correlation ID: ${message.correlationId || 'N/A'})`);\\\
\
        const userId = this.context.currentUser?.id;\\\
        if (!userId) {\\\
             return { success: false, error: 'User not authenticated.' };\\\
        }\\\
\
        try {\\\
            let result: any;\\\
            switch (message.type) {\\\
                // --- Task Management Messages ---\\\
                case 'create_task':\\\
                    // Payload: { description: string, steps: Omit<TaskStep, 'id' | 'task_id' | 'status' | 'result' | 'error' | 'start_timestamp' | 'end_timestamp'>[], linkedKrId?: string }\\\
                    if (!message.payload?.description || !message.payload?.steps || !Array.isArray(message.payload.steps) || message.payload.steps.length === 0) {\\\
                         throw new Error('Description and steps are required to create task.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.createTask(\\\n                        message.payload.description,\\\
                        message.payload.steps,\\\
                        userId, // Use userId from agent context\\\
                        message.payload.linkedKrId\\\
                    );\\\
                    if (!result) throw new Error('Failed to create task.');\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_tasks':\\\
                    // Payload: { status?: Task['status'] }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.getTasks(userId, message.payload?.status);\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_task_by_id':\\\
                    // Payload: { taskId: string }\\\
                    if (!message.payload?.taskId) {\\\
                         throw new Error('Task ID is required.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.getTaskById(message.payload.taskId, userId);\\\
                    if (!result) return { success: false, error: 'Task not found or not accessible.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'update_task':\\\
                    // Payload: { taskId: string, updates: Partial<Omit<Task, 'id' | 'user_id' | 'steps' | 'creation_timestamp'>> }\\\
                    if (!message.payload?.taskId || !message.payload?.updates) {\\\
                         throw new Error('Task ID and updates are required to update task.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.updateTask(\\\n                        message.payload.taskId,\\\
                        message.payload.updates,\\\
                        userId\\\
                    );\\\
                    if (!result) return { success: false, error: 'Task not found or not owned by user.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'delete_task':\\\
                    // Payload: { taskId: string }\\\
                    if (!message.payload?.taskId) {\\\
                         throw new Error('Task ID is required to delete task.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.deleteTask(message.payload.taskId, userId);\\\
                    if (!result) return { success: false, error: 'Task not found or not owned by user.' };\\\
                    return { success: true, data: { taskId: message.payload.taskId } }; // Return deleted ID\\\
\\\n                case 'add_task_step':\\\
                    // Payload: { taskId: string, stepDetails: Omit<TaskStep, 'id' | 'task_id' | 'status' | 'result' | 'error' | 'start_timestamp' | 'end_timestamp'> }\\\
                    if (!message.payload?.taskId || !message.payload?.stepDetails) {\\\
                         throw new Error('Task ID and step details are required to add task step.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.addTaskStep(\\\n                        message.payload.taskId,\\\
                        message.payload.stepDetails,\\\
                        userId\\\
                    );\\\
                    if (!result) throw new Error('Failed to add task step.');\\\
                    return { success: true, data: result };\\\
\\\n                case 'update_task_step':\\\
                    // Payload: { stepId: string, updates: Partial<Omit<TaskStep, 'id' | 'task_id' | 'step_order' | 'status' | 'result' | 'error' | 'start_timestamp' | 'end_timestamp'>> }\\\
                    if (!message.payload?.stepId || !message.payload?.updates) {\\\
                         throw new Error('Step ID and updates are required to update task step.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.updateTaskStep(\\\n                        message.payload.stepId,\\\
                        message.payload.updates,\\\
                        userId\\\
                    );\\\
                    if (!result) return { success: false, error: 'Task step not found or parent task not owned by user.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'delete_task_step':\\\
                    // Payload: { stepId: string }\\\
                    if (!message.payload?.stepId) {\\\
                         throw new Error('Step ID is required to delete task step.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.deleteTaskStep(message.payload.stepId, userId);\\\
                    if (!result) return { success: false, error: 'Task step not found or parent task not owned by user.' };\\\
                    return { success: true, data: { stepId: message.payload.stepId } }; // Return deleted ID\\\
\\\n                case 'start_task':\\\
                    // Payload: { taskId: string }\\\
                    if (!message.payload?.taskId) {\\\
                         throw new Error('Task ID is required to start task.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    await this.context.selfNavigationEngine?.startTask(message.payload.taskId, userId);\\\
                    return { success: true, data: { message: 'Task started.' } };\\\
\\\n                case 'pause_task':\\\
                    // Payload: { taskId: string }\\\
                    if (!message.payload?.taskId) {\\\
                         throw new Error('Task ID is required to pause task.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    await this.context.selfNavigationEngine?.pauseTask(message.payload.taskId, userId);\\\
                    return { success: true, data: { message: 'Task paused.' } };\\\
\\\n                case 'resume_task':\\\
                    // Payload: { taskId: string }\\\
                    if (!message.payload?.taskId) {\\\
                         throw new Error('Task ID is required to resume task.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    await this.context.selfNavigationEngine?.resumeTask(message.payload.taskId, userId);\\\
                    return { success: true, data: { message: 'Task resumed.' } };\\\
\\\n                case 'cancel_task':\\\
                    // Payload: { taskId: string }\\\
                    if (!message.payload?.taskId) {\\\
                         throw new Error('Task ID is required to cancel task.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    await this.context.selfNavigationEngine?.cancelTask(message.payload.taskId, userId);\\\
                    return { success: true, data: { message: 'Task cancelled.' } };\\\
\\\n                case 'link_task_to_kr':\\\
                    // Payload: { taskId: string, krId: string }\\\
                    if (!message.payload?.taskId || !message.payload?.krId) {\\\
                         throw new Error('Task ID and KR ID are required to link task to KR.');\\\
                    }\\\
                    // Delegate to GoalManagementService via GoalManagementAgent\\\
                    // --- Modified: Use requestAgent for GoalManagementAgent call ---\\\n                    result = await this.requestAgent(\\\n                        'goal_management', // Target the GoalManagement Agent\\\n                        'link_task_to_key_result', // Message type for GoalManagement Agent\\\
                        { taskId: message.payload.taskId, krId: message.payload.krId }, // Pass parameters\\\
                        10000 // Timeout\\\
                    );\\\
                    // The result from requestAgent is already an AgentResponse from GoalManagementAgent.\\\n                    // We just return it directly.\\\n                    return result;\\\
                    // --- End Modified ---\\\
\\\n                case 'unlink_task_from_kr':\\\
                    // Payload: { taskId: string, krId: string }\\\
                    if (!message.payload?.taskId || !message.payload?.krId) {\\\
                         throw new Error('Task ID and KR ID are required to unlink task from KR.');\\\
                    }\\\
                    // Delegate to GoalManagementService via GoalManagementAgent\\\
                    // --- Modified: Use requestAgent for GoalManagementAgent call ---\\\n                    result = await this.requestAgent(\\\n                        'goal_management', // Target the GoalManagement Agent\\\n                        'unlink_task_from_key_result', // Message type for GoalManagement Agent\\\
                        { taskId: message.payload.taskId, krId: message.payload.krId }, // Pass parameters\\\
                        10000 // Timeout\\\
                    );\\\
                    // The result from requestAgent is already an AgentResponse from GoalManagementAgent.\\\n                    // We just return it directly.\\\
                    return result;\\\
                    // --- End Modified ---\\\
\\\n                case 'check_and_complete_key_result_if_task_completed':\\\
                    // Payload: { krId: string, taskId: string }\\\
                    if (!message.payload?.krId || !message.payload?.taskId) {\\\
                         throw new Error('KR ID and Task ID are required to check KR completion.');\\\
                    }\\\
                    // Delegate to GoalManagementService via GoalManagementAgent\\\
                    // --- Modified: Use requestAgent for GoalManagementAgent call ---\\\n                    result = await this.requestAgent(\\\n                        'goal_management', // Target the GoalManagement Agent\\\n                        'check_and_complete_key_result_if_task_completed', // Message type for GoalManagement Agent\\\
                        { krId: message.payload.krId, taskId: message.payload.taskId }, // Pass parameters\\\
                        10000 // Timeout\\\
                    );\\\
                    // This method returns the updated KR or undefined/existing KR, not necessarily an error on no update\\\n                    return { success: true, data: result };\\\
                    // --- End Modified ---\\\
\\\n\\\n                // --- Agentic Flow Management Messages ---\\\n                case 'create_agentic_flow':\\\
                    // Payload: Omit<AgenticFlow, 'id' | 'status' | 'current_node_id' | 'creation_timestamp' | 'start_timestamp' | 'completion_timestamp' | 'last_execution_result'>\\\
                    if (!message.payload?.name || !message.payload?.entry_node_id || !Array.isArray(message.payload.nodes) || message.payload.nodes.length === 0 || !Array.isArray(message.payload.edges)) {\\\
                         throw new Error('Name, entry node ID, nodes, and edges are required to create agentic flow.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.createAgenticFlow(message.payload, userId);\\\
                    if (!result) throw new Error('Failed to create agentic flow.');\\\
                    return { success: true, data: result };\\\
\\\n                case 'update_agentic_flow_structure':\\\
                    // Payload: { flowId: string, updatedNodes: AgenticFlowNode[], updatedEdges: AgenticFlowEdge[] }\\\
                    if (!message.payload?.flowId || !Array.isArray(message.payload.updatedNodes) || !Array.isArray(message.payload.updatedEdges)) {\\\
                         throw new Error('Flow ID, updated nodes, and updated edges are required to update flow structure.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.updateAgenticFlowStructure(\\\n                        message.payload.flowId,\\\
                        message.payload.updatedNodes,\\\
                        message.payload.updatedEdges,\\\
                        userId\\\
                    );\\\
                    if (!result) return { success: false, error: 'Agentic Flow not found or not owned by user.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_agentic_flows':\\\
                    // Payload: { status?: AgenticFlow['status'] }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.getAgenticFlows(userId, message.payload?.status);\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_agentic_flow_by_id':\\\
                    // Payload: { flowId: string }\\\
                    if (!message.payload?.flowId) {\\\
                         throw new Error('Flow ID is required.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.getAgenticFlowById(message.payload.flowId, userId);\\\
                    if (!result) return { success: false, error: 'Agentic Flow not found or not accessible.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'delete_agentic_flow':\\\
                    // Payload: { flowId: string }\\\
                    if (!message.payload?.flowId) {\\\
                         throw new Error('Flow ID is required to delete agentic flow.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.deleteAgenticFlow(message.payload.flowId, userId);\\\
                    if (!result) return { success: false, error: 'Agentic Flow not found or not owned by user.' };\\\
                    return { success: true, data: { flowId: message.payload.flowId } }; // Return deleted ID\\\
\\\n                case 'start_agentic_flow':\\\
                    // Payload: { flowId: string, initialParams?: any }\\\
                    if (!message.payload?.flowId) {\\\
                         throw new Error('Flow ID is required to start agentic flow.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.startAgenticFlow(\\\n                        message.payload.flowId,\\\
                        userId, // Use userId from agent context\\\
                        message.payload.initialParams\\\
                    );\\\
                    if (!result) throw new Error('Failed to start agentic flow.');\\\
                    return { success: true, data: result }; // Returns the execution record\\\
\\\n                case 'pause_agentic_flow':\\\
                    // Payload: { flowId: string }\\\
                    if (!message.payload?.flowId) {\\\
                         throw new Error('Flow ID is required to pause agentic flow.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    await this.context.selfNavigationEngine?.pauseAgenticFlow(message.payload.flowId, userId);\\\
                    return { success: true, data: { message: 'Agentic Flow paused.' } };\\\
\\\n                case 'resume_agentic_flow':\\\
                    // Payload: { flowId: string }\\\
                    if (!message.payload?.flowId) {\\\
                         throw new Error('Flow ID is required to resume agentic flow.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    await this.context.selfNavigationEngine?.resumeAgenticFlow(message.payload.flowId, userId);\\\
                    return { success: true, data: { message: 'Agentic Flow resumed.' } };\\\
\\\n                case 'cancel_agentic_flow':\\\
                    // Payload: { flowId: string }\\\
                    if (!message.payload?.flowId) {\\\
                         throw new Error('Flow ID is required to cancel agentic flow.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    await this.context.selfNavigationEngine?.cancelAgenticFlow(message.payload.flowId, userId);\\\
                    return { success: true, data: { message: 'Agentic Flow cancelled.' } };\\\
\\\n                case 'get_agentic_flow_executions':\\\
                    // Payload: { flowId: string, limit?: number }\\\
                    if (!message.payload?.flowId) {\\\
                         throw new Error('Flow ID is required to get executions.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.getAgenticFlowExecutions(\\\n                        message.payload.flowId,\\\
                        userId,\\\
                        message.payload.limit\\\
                    );\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_agentic_flow_execution_by_id':\\\
                    // Payload: { executionId: string }\\\
                    if (!message.payload?.executionId) {\\\
                         throw new Error('Execution ID is required.');\\\
                    }\\\
                    // Delegate to SelfNavigationEngine\\\
                    result = await this.context.selfNavigationEngine?.getAgenticFlowExecutionById(message.payload.executionId, userId);\\\
                    if (!result) return { success: false, error: 'Agentic Flow Execution not found or not accessible.' };\\\
                    return { success: true, data: result };\\\
\\\n\\\n                default:\\\
                    console.warn(`[SelfNavigationAgent] Unknown message type: ${message.type}`);\\\
                    return { success: false, error: `Unknown message type for SelfNavigationAgent: ${message.type}` };\\\
            }\\\n        } catch (error: any) {\\\
            console.error(`[SelfNavigationAgent] Error handling message ${message.type}:`, error);\\\
            return { success: false, error: error.message || 'An error occurred in SelfNavigationAgent.' };\\\
        }\\\n    }\\\n\\\n    // TODO: Implement methods to send messages to other agents if needed\\\n}\\\n```
```