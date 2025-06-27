```typescript
// packages/@junai/sdk/src/tasks.ts
// Task Client Module for SDK

import { ApiProxy } from './apiProxy';
import { Task, TaskStep, AgenticFlowExecution, KeyResult } from '../../../src/interfaces'; // Import interfaces from main project

export class TaskClient {
  private apiProxy: ApiProxy;

  constructor(apiProxy: ApiProxy) {
    this.apiProxy = apiProxy;
  }

  /**
   * Creates a new task.
   * @param taskDetails The details of the task (without id, status, timestamps). Must include userId.
   * @returns Promise<Task> The created task.
   */
  async create(taskDetails: Omit<Task, 'id' | 'status' | 'current_step_index' | 'creation_timestamp' | 'start_timestamp' | 'completion_timestamp'>): Promise<Task> {
    // This assumes your API Gateway has an endpoint like POST /api/v1/tasks
    // that delegates to the SelfNavigationAgent/SelfNavigationEngine.
    // If calling directly to Supabase, use the Supabase client instead.

    if (this.apiProxy.getApiEndpoint()) {
        // Call custom API Gateway
        const result = await this.apiProxy.callApi('/api/v1/tasks', 'POST', taskDetails);
        return result as Task; // Assuming API returns the created task
    } else {
        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
             throw new Error('Supabase client not available in ApiProxy.');
        }
        // Direct Supabase insert for tasks and steps is more complex (requires two inserts).
        // Rely on the API Gateway for this or implement the multi-step insert here.
        // For MVP fallback, just simulate the creation.
        console.warn('SDK: Custom API endpoint not configured. Falling back to simulated task creation.');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        const simulatedTask: Task = {
            id: 'sim-task-' + Date.now(),
            user_id: taskDetails.user_id,
            description: taskDetails.description,
            status: 'pending',
            current_step_index: 0,
            creation_timestamp: new Date().toISOString(),
            start_timestamp: null,
            completion_timestamp: null,
            linked_task_ids: taskDetails.linked_task_ids,
            key_results: [], // KRs are linked separately
            steps: taskDetails.steps || [], // Include steps if provided
        };
        return simulatedTask;
    }
  }

  /**
   * Retrieves tasks for a user.
   * @param userId The user ID. Required.
   * @param status Optional filter by status.
   * @returns Promise<Task[]> An array of tasks.
   */
  async list(userId: string, status?: Task['status']): Promise<Task[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/tasks?userId=...&status=...
     // that delegates to the SelfNavigationAgent/SelfNavigationEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/tasks', 'GET', undefined, { params: { userId, status } });
         return result as Task[]; // Assuming API returns an array of tasks
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query with filters (requires join for steps)
         // Rely on the API Gateway for the join or implement it here.
         // For MVP fallback, just simulate fetching basic task data.
         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated basic Supabase task list.');
         let query = this.apiProxy['supabaseClient'].from('tasks').select('*').eq('user_id', userId);
         if (status) {
             query = query.eq('status', status);
         }
         const { data, error } = await query;
         if (error) throw error;
         return data as Task[]; // Returns tasks without steps in fallback
     }
  }


  /**
   * Gets a task by ID.
   * @param taskId The ID of the task.
   * @returns Promise<Task | undefined> The task or undefined if not found.
   */
  async getById(taskId: string): Promise<Task | undefined> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/tasks/:taskId
     // that delegates to the SelfNavigationAgent/SelfNavigationEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/tasks/${taskId}`, 'GET');
             return result as Task; // Assuming API returns the task
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase fetch for task and steps requires a join.
         // Rely on the API Gateway for this or implement the join here.
         // For MVP fallback, just simulate fetching.
         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated task fetch.');
         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
         // Simulate finding a task if the ID looks like a simulated one
         if (taskId.startsWith('sim-task-')) {
              const simulatedTask: Task = {
                 id: taskId,
                 user_id: this.apiProxy['supabaseClient'].auth.currentUser?.id || 'sim-user', // Link to current user if available
                 description: `Simulated Task ${taskId}`,
                 status: 'pending',
                 current_step_index: 0,
                 creation_timestamp: new Date().toISOString(),
                 start_timestamp: null,
                 completion_timestamp: null,
                 linked_task_ids: [],
                 key_results: [],
                 steps: [{ id: 'sim-step-1', task_id: taskId, step_order: 0, description: 'Simulated Step', action: { type: 'log', details: { message: 'Simulated log' } }, status: 'pending', result: null, error: null, start_timestamp: null, end_timestamp: null }],
              };
              return simulatedTask;
         }
         return undefined; // Simulate not found
     }
  }

  /**
   * Updates a task.
   * @param taskId The ID of the task.
   * @param updates The updates to apply.
   * @returns Promise<Task | undefined> The updated task or undefined if not found.
   */
  async update(taskId: string, updates: Partial<Omit<Task, 'id' | 'user_id' | 'steps' | 'creation_timestamp'>>): Promise<Task | undefined> {
     // This assumes your API Gateway has an endpoint like PUT /api/v1/tasks/:taskId
     // that delegates to the SelfNavigationAgent/SelfNavigationEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/tasks/${taskId}`, 'PUT', updates);
             return result as Task; // Assuming API returns the updated task
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase update by ID (RLS should enforce ownership)
         const { data, error } = await this.apiProxy['supabaseClient'].from('tasks').update(updates).eq('id', taskId).select().single();
         if (error) {
             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)
             throw error;
         }
         return data as Task;
     }
  }

  /**
   * Deletes a task.
   * @param taskId The ID of the task.
   * @returns Promise<boolean> True if deletion was successful.
   */
  async delete(taskId: string): Promise<boolean> {
     // This assumes your API Gateway has an endpoint like DELETE /api/v1/tasks/:taskId
     // that delegates to the SelfNavigationAgent/SelfNavigationEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/tasks/${taskId}`, 'DELETE');
             return result?.success === true; // Assuming API returns { success: true } on success
         } catch (error: any) {
             // Assume 404 means not found/already deleted, other errors are failures
             if (error.response?.status === 404) return false;
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase delete by ID (RLS should enforce ownership)
         const { count, error } = await this.apiProxy['supabaseClient'].from('tasks').delete().eq('id', taskId).select('id', { count: 'exact' });
         if (error) throw error;
         return count !== null && count > 0;
     }
  }

  /**
   * Starts the execution of a task.
   * @param taskId The ID of the task.
   * @param userId The user ID. Required.
   * @param initialParams Optional initial parameters for the task.
   * @returns Promise<AgenticFlowExecution | null> The created execution record or null on failure.
   */
  async start(taskId: string, userId: string, initialParams?: any): Promise<AgenticFlowExecution | null> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/tasks/:taskId/start
     // that delegates to the SelfNavigationEngine.
     // Direct backend process triggering is not feasible in SDK fallback.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi(`/api/v1/tasks/${taskId}/start`, 'POST', { userId, initialParams });
         return result as AgenticFlowExecution; // Assuming API returns the execution record
     } else {
         // Fallback is not possible here as backend process triggering is required.
         console.warn('SDK: Custom API endpoint not configured. Cannot start task via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot start task via SDK.');
     }
  }

  /**
   * Pauses the execution of a task.
   * @param taskId The ID of the task.
   * @param userId The user ID. Required.
   * @returns Promise<void>
   */
  async pause(taskId: string, userId: string): Promise<void> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/tasks/:taskId/pause
     // that delegates to the SelfNavigationEngine.
     // Direct backend process signaling is not feasible in SDK fallback.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         await this.apiProxy.callApi(`/api/v1/tasks/${taskId}/pause`, 'POST', { userId });
     } else {
         // Fallback is not possible here.
         console.warn('SDK: Custom API endpoint not configured. Cannot pause task via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot pause task via SDK.');
     }
  }

  /**
   * Resumes the execution of a task.
   * @param taskId The ID of the task.
   * @param userId The user ID. Required.
   * @returns Promise<void>
   */
  async resume(taskId: string, userId: string): Promise<void> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/tasks/:taskId/resume
     // that delegates to the SelfNavigationEngine.
     // Direct backend process signaling is not feasible in SDK fallback.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         await this.apiProxy.callApi(`/api/v1/tasks/${taskId}/resume`, 'POST', { userId });
     } else {
         // Fallback is not possible here.
         console.warn('SDK: Custom API endpoint not configured. Cannot resume task via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot resume task via SDK.');
     }
  }

  /**
   * Cancels the execution of a task.
   * @param taskId The ID of the task.
   * @param userId The user ID. Required.
   * @returns Promise<void>
   */
  async cancel(taskId: string, userId: string): Promise<void> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/tasks/:taskId/cancel
     // that delegates to the SelfNavigationEngine.
     // Direct backend process signaling is not feasible in SDK fallback.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         await this.apiProxy.callApi(`/api/v1/tasks/${taskId}/cancel`, 'POST', { userId });
     } else {
         // Fallback is not possible here.
         console.warn('SDK: Custom API endpoint not configured. Cannot cancel task via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot cancel task via SDK.');
     }
  }

  /**
   * Adds a step to an existing task.
   * @param taskId The ID of the task.
   * @param stepDetails The details of the step (without id, task_id, status, result, error, timestamps).
   * @param userId The user ID. Required.
   * @returns Promise<TaskStep | null> The created step or null on failure.
   */
  async addTaskStep(taskId: string, stepDetails: Omit<TaskStep, 'id' | 'task_id' | 'status' | 'result' | 'error' | 'start_timestamp' | 'end_timestamp'>, userId: string): Promise<TaskStep | null> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/tasks/:taskId/steps
     // that delegates to the SelfNavigationEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi(`/api/v1/tasks/${taskId}/steps`, 'POST', { stepDetails, userId });
         return result as TaskStep; // Assuming API returns the created step
     } else {
         // Fallback to calling Supabase directly is complex (requires getting next step_order).
         // Rely on the API Gateway for this or implement the logic here.
         // For MVP fallback, just simulate the creation.
         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated task step creation.');
         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
         const simulatedStep: TaskStep = {
             id: 'sim-step-' + Date.now(),
             task_id: taskId,
             step_order: stepDetails.step_order,
             description: stepDetails.description,
             action: stepDetails.action,
             status: 'pending',
             result: null,
             error: null,
             start_timestamp: null,
             end_timestamp: null,
         };
         return simulatedStep;
     }
  }

  /**
   * Updates a task step.
   * @param stepId The ID of the step.
   * @param updates The updates to apply.
   * @param userId The user ID. Required.
   * @returns Promise<TaskStep | undefined> The updated step or undefined if not found.
   */
  async updateTaskStep(stepId: string, updates: Partial<Omit<TaskStep, 'id' | 'task_id' | 'step_order' | 'status' | 'result' | 'error' | 'start_timestamp' | 'end_timestamp'>>, userId: string): Promise<TaskStep | undefined> {
     // This assumes your API Gateway has an endpoint like PUT /api/v1/tasks/steps/:stepId
     // that delegates to the SelfNavigationEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/tasks/steps/${stepId}`, 'PUT', { updates, userId });
             return result as TaskStep; // Assuming API returns the updated step
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly is complex (requires RLS on steps linked to task owner).
         // Rely on the API Gateway for this.
         console.warn('SDK: Custom API endpoint not configured. Cannot update task step via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot update task step via SDK.');
     }
  }

  /**
   * Deletes a task step.
   * @param stepId The ID of the step.
   * @param userId The user ID. Required.
   * @returns Promise<boolean> True if deletion was successful.
   */
  async deleteTaskStep(stepId: string, userId: string): Promise<boolean> {
     // This assumes your API Gateway has an endpoint like DELETE /api/v1/tasks/steps/:stepId
     // that delegates to the SelfNavigationEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/tasks/steps/${stepId}`, 'DELETE', undefined, { params: { userId } });
             return result?.success === true; // Assuming API returns { success: true } on success
         } catch (error: any) {
             // Assume 404 means not found/already deleted, other errors are failures
             if (error.response?.status === 404) return false;
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly is complex (requires RLS on steps linked to task owner).
         // Rely on the API Gateway for this.
         console.warn('SDK: Custom API endpoint not configured. Cannot delete task step via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot delete task step via SDK.');
     }
  }

  /**
   * Links a task to a Key Result.
   * @param taskId The ID of the task.
   * @param krId The ID of the Key Result.
   * @param userId The user ID. Required.
   * @returns Promise<KeyResult | undefined> The updated KR or undefined.
   */
  async linkToKr(taskId: string, krId: string, userId: string): Promise<KeyResult | undefined> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/tasks/:taskId/link-kr/:krId
     // that delegates to the SelfNavigationEngine/GoalManagementService.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/tasks/${taskId}/link-kr/${krId}`, 'POST', { userId });
             return result as KeyResult; // Assuming API returns the updated KR
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback is not possible here as it involves updating another data type (KeyResult).
         console.warn('SDK: Custom API endpoint not configured. Cannot link task to KR via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot link task to KR via SDK.');
     }
  }

  /**
   * Unlinks a task from a Key Result.
   * @param taskId The ID of the task.
   * @param krId The ID of the Key Result.
   * @param userId The user ID. Required.
   * @returns Promise<KeyResult | undefined> The updated KR or undefined.
   */
  async unlinkFromKr(taskId: string, krId: string, userId: string): Promise<KeyResult | undefined> {
     // This assumes your API Gateway has an endpoint like DELETE /api/v1/tasks/:taskId/link-kr/:krId
     // that delegates to the SelfNavigationEngine/GoalManagementService.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/tasks/${taskId}/link-kr/${krId}`, 'DELETE', undefined, { params: { userId } });
             return result as KeyResult; // Assuming API returns the updated KR
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback is not possible here.
         console.warn('SDK: Custom API endpoint not configured. Cannot unlink task from KR via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot unlink task from KR via SDK.');
     }
  }

  /**
   * Gets execution history for a task.
   * @param taskId The ID of the task.
   * @param userId The user ID. Required.
   * @param limit Optional limit for the number of executions.
   * @returns Promise<AgenticFlowExecution[]> An array of execution records.
   */
  async getExecutions(taskId: string, userId: string, limit?: number): Promise<AgenticFlowExecution[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/tasks/:taskId/executions?userId=...&limit=...
     // that delegates to the SelfNavigationEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi(`/api/v1/tasks/${taskId}/executions`, 'GET', undefined, { params: { userId, limit } });
         return result as AgenticFlowExecution[]; // Assuming API returns an array of executions
     } else {
         // Fallback to calling Supabase directly (requires RLS on executions linked to task owner).
         // Rely on the API Gateway for this.
         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated task execution fetch.');
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query for executions linked to the task (requires RLS)
         const { data, error } = await this.apiProxy['supabaseClient'].from('agentic_flow_executions').select('*').eq('flow_id', taskId).eq('user_id', userId).order('start_timestamp', { ascending: false } as any).limit(limit || 10); // Assuming task executions are stored in agentic_flow_executions with flow_id = taskId
         if (error) throw error;
         return data as AgenticFlowExecution[];
     }
  }

  /**
   * Gets a specific task execution record by ID.
   * @param executionId The ID of the execution record.
   * @param userId The user ID. Required.
   * @returns Promise<AgenticFlowExecution | undefined> The execution record or undefined if not found.
   */
  async getExecutionById(executionId: string, userId: string): Promise<AgenticFlowExecution | undefined> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/tasks/executions/:executionId?userId=...
     // that delegates to the SelfNavigationEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/tasks/executions/${executionId}`, 'GET', undefined, { params: { userId } });
             return result as AgenticFlowExecution; // Assuming API returns the execution record
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires RLS on executions linked to task owner).
         // Rely on the API Gateway for this.
         console.warn('SDK: Custom API endpoint not configured. Cannot fetch task execution by ID via SDK.');
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase fetch by ID (RLS should enforce ownership)
         const { data, error } = await this.apiProxy['supabaseClient'].from('agentic_flow_executions').select('*').eq('id', executionId).eq('user_id', userId).single();
         if (error) {
             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)
             throw error;
         }
         return data as AgenticFlowExecution;
     }
  }

}
```