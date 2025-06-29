var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a, _b, _c, _d, _e;
""(__makeTemplateObject(["typescript\n// packages/@junai/sdk/src/tasks.ts\n// Task Client Module for SDK\n\nimport { ApiProxy } from './apiProxy';\nimport { Task, TaskStep, AgenticFlowExecution, KeyResult } from '../../../src/interfaces'; // Import interfaces from main project\n\nexport class TaskClient {\n  private apiProxy: ApiProxy;\n\n  constructor(apiProxy: ApiProxy) {\n    this.apiProxy = apiProxy;\n  }\n\n  /**\n   * Creates a new task.\n   * @param taskDetails The details of the task (without id, status, timestamps). Must include userId.\n   * @returns Promise<Task> The created task.\n   */\n  async create(taskDetails: Omit<Task, 'id' | 'status' | 'current_step_index' | 'creation_timestamp' | 'start_timestamp' | 'completion_timestamp'>): Promise<Task> {\n    // This assumes your API Gateway has an endpoint like POST /api/v1/tasks\n    // that delegates to the SelfNavigationAgent/SelfNavigationEngine.\n    // If calling directly to Supabase, use the Supabase client instead.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi('/api/v1/tasks', 'POST', taskDetails);\n        return result as Task; // Assuming API returns the created task\n    } else {\n        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n             throw new Error('Supabase client not available in ApiProxy.');\n        }\n        // Direct Supabase insert for tasks and steps is more complex (requires two inserts).\n        // Rely on the API Gateway for this or implement the multi-step insert here.\n        // For MVP fallback, just simulate the creation.\n        console.warn('SDK: Custom API endpoint not configured. Falling back to simulated task creation.');\n        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay\n        const simulatedTask: Task = {\n            id: 'sim-task-' + Date.now(),\n            user_id: taskDetails.user_id,\n            description: taskDetails.description,\n            status: 'pending',\n            current_step_index: 0,\n            creation_timestamp: new Date().toISOString(),\n            start_timestamp: null,\n            completion_timestamp: null,\n            linked_task_ids: taskDetails.linked_task_ids,\n            key_results: [], // KRs are linked separately\n            steps: taskDetails.steps || [], // Include steps if provided\n        };\n        return simulatedTask;\n    }\n  }\n\n  /**\n   * Retrieves tasks for a user.\n   * @param userId The user ID. Required.\n   * @param status Optional filter by status.\n   * @returns Promise<Task[]> An array of tasks.\n   */\n  async list(userId: string, status?: Task['status']): Promise<Task[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/tasks?userId=...&status=...\n     // that delegates to the SelfNavigationAgent/SelfNavigationEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/tasks', 'GET', undefined, { params: { userId, status } });\n         return result as Task[]; // Assuming API returns an array of tasks\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query with filters (requires join for steps)\n         // Rely on the API Gateway for the join or implement it here.\n         // For MVP fallback, just simulate fetching basic task data.\n         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated basic Supabase task list.');\n         let query = this.apiProxy['supabaseClient'].from('tasks').select('*').eq('user_id', userId);\n         if (status) {\n             query = query.eq('status', status);\n         }\n         const { data, error } = await query;\n         if (error) throw error;\n         return data as Task[]; // Returns tasks without steps in fallback\n     }\n  }\n\n\n  /**\n   * Gets a task by ID.\n   * @param taskId The ID of the task.\n   * @returns Promise<Task | undefined> The task or undefined if not found.\n   */\n  async getById(taskId: string): Promise<Task | undefined> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/tasks/:taskId\n     // that delegates to the SelfNavigationAgent/SelfNavigationEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi("], ["typescript\n// packages/@junai/sdk/src/tasks.ts\n// Task Client Module for SDK\n\nimport { ApiProxy } from './apiProxy';\nimport { Task, TaskStep, AgenticFlowExecution, KeyResult } from '../../../src/interfaces'; // Import interfaces from main project\n\nexport class TaskClient {\n  private apiProxy: ApiProxy;\n\n  constructor(apiProxy: ApiProxy) {\n    this.apiProxy = apiProxy;\n  }\n\n  /**\n   * Creates a new task.\n   * @param taskDetails The details of the task (without id, status, timestamps). Must include userId.\n   * @returns Promise<Task> The created task.\n   */\n  async create(taskDetails: Omit<Task, 'id' | 'status' | 'current_step_index' | 'creation_timestamp' | 'start_timestamp' | 'completion_timestamp'>): Promise<Task> {\n    // This assumes your API Gateway has an endpoint like POST /api/v1/tasks\n    // that delegates to the SelfNavigationAgent/SelfNavigationEngine.\n    // If calling directly to Supabase, use the Supabase client instead.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi('/api/v1/tasks', 'POST', taskDetails);\n        return result as Task; // Assuming API returns the created task\n    } else {\n        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n             throw new Error('Supabase client not available in ApiProxy.');\n        }\n        // Direct Supabase insert for tasks and steps is more complex (requires two inserts).\n        // Rely on the API Gateway for this or implement the multi-step insert here.\n        // For MVP fallback, just simulate the creation.\n        console.warn('SDK: Custom API endpoint not configured. Falling back to simulated task creation.');\n        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay\n        const simulatedTask: Task = {\n            id: 'sim-task-' + Date.now(),\n            user_id: taskDetails.user_id,\n            description: taskDetails.description,\n            status: 'pending',\n            current_step_index: 0,\n            creation_timestamp: new Date().toISOString(),\n            start_timestamp: null,\n            completion_timestamp: null,\n            linked_task_ids: taskDetails.linked_task_ids,\n            key_results: [], // KRs are linked separately\n            steps: taskDetails.steps || [], // Include steps if provided\n        };\n        return simulatedTask;\n    }\n  }\n\n  /**\n   * Retrieves tasks for a user.\n   * @param userId The user ID. Required.\n   * @param status Optional filter by status.\n   * @returns Promise<Task[]> An array of tasks.\n   */\n  async list(userId: string, status?: Task['status']): Promise<Task[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/tasks?userId=...&status=...\n     // that delegates to the SelfNavigationAgent/SelfNavigationEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/tasks', 'GET', undefined, { params: { userId, status } });\n         return result as Task[]; // Assuming API returns an array of tasks\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query with filters (requires join for steps)\n         // Rely on the API Gateway for the join or implement it here.\n         // For MVP fallback, just simulate fetching basic task data.\n         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated basic Supabase task list.');\n         let query = this.apiProxy['supabaseClient'].from('tasks').select('*').eq('user_id', userId);\n         if (status) {\n             query = query.eq('status', status);\n         }\n         const { data, error } = await query;\n         if (error) throw error;\n         return data as Task[]; // Returns tasks without steps in fallback\n     }\n  }\n\n\n  /**\n   * Gets a task by ID.\n   * @param taskId The ID of the task.\n   * @returns Promise<Task | undefined> The task or undefined if not found.\n   */\n  async getById(taskId: string): Promise<Task | undefined> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/tasks/:taskId\n     // that delegates to the SelfNavigationAgent/SelfNavigationEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi("])) / api / v1 / tasks / $;
{
    taskId;
}
", 'GET');\n             return result as Task; // Assuming API returns the task\n         } catch (error: any) {\n             if (error.response?.status === 404) return undefined; // Not found\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase fetch for task and steps requires a join.\n         // Rely on the API Gateway for this or implement the join here.\n         // For MVP fallback, just simulate fetching.\n         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated task fetch.');\n         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay\n         // Simulate finding a task if the ID looks like a simulated one\n         if (taskId.startsWith('sim-task-')) {\n              const simulatedTask: Task = {\n                 id: taskId,\n                 user_id: this.apiProxy['supabaseClient'].auth.currentUser?.id || 'sim-user', // Link to current user if available\n                 description: ";
Simulated;
Task;
$;
{
    taskId;
}
",\n                 status: 'pending',\n                 current_step_index: 0,\n                 creation_timestamp: new Date().toISOString(),\n                 start_timestamp: null,\n                 completion_timestamp: null,\n                 linked_task_ids: [],\n                 key_results: [],\n                 steps: [{ id: 'sim-step-1', task_id: taskId, step_order: 0, description: 'Simulated Step', action: { type: 'log', details: { message: 'Simulated log' } }, status: 'pending', result: null, error: null, start_timestamp: null, end_timestamp: null }],\n              };\n              return simulatedTask;\n         }\n         return undefined; // Simulate not found\n     }\n  }\n\n  /**\n   * Updates a task.\n   * @param taskId The ID of the task.\n   * @param updates The updates to apply.\n   * @returns Promise<Task | undefined> The updated task or undefined if not found.\n   */\n  async update(taskId: string, updates: Partial<Omit<Task, 'id' | 'user_id' | 'steps' | 'creation_timestamp'>>): Promise<Task | undefined> {\n     // This assumes your API Gateway has an endpoint like PUT /api/v1/tasks/:taskId\n     // that delegates to the SelfNavigationAgent/SelfNavigationEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi(" / api / v1 / tasks / $;
{
    taskId;
}
", 'PUT', updates);\n             return result as Task; // Assuming API returns the updated task\n         } catch (error: any) {\n             if (error.response?.status === 404) return undefined; // Not found\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase update by ID (RLS should enforce ownership)\n         const { data, error } = await this.apiProxy['supabaseClient'].from('tasks').update(updates).eq('id', taskId).select().single();\n         if (error) {\n             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)\n             throw error;\n         }\n         return data as Task;\n     }\n  }\n\n  /**\n   * Deletes a task.\n   * @param taskId The ID of the task.\n   * @returns Promise<boolean> True if deletion was successful.\n   */\n  async delete(taskId: string): Promise<boolean> {\n     // This assumes your API Gateway has an endpoint like DELETE /api/v1/tasks/:taskId\n     // that delegates to the SelfNavigationAgent/SelfNavigationEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi(" / api / v1 / tasks / $;
{
    taskId;
}
", 'DELETE');\n             return result?.success === true; // Assuming API returns { success: true } on success\n         } catch (error: any) {\n             // Assume 404 means not found/already deleted, other errors are failures\n             if (error.response?.status === 404) return false;\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase delete by ID (RLS should enforce ownership)\n         const { count, error } = await this.apiProxy['supabaseClient'].from('tasks').delete().eq('id', taskId).select('id', { count: 'exact' });\n         if (error) throw error;\n         return count !== null && count > 0;\n     }\n  }\n\n  /**\n   * Starts the execution of a task.\n   * @param taskId The ID of the task.\n   * @param userId The user ID. Required.\n   * @param initialParams Optional initial parameters for the task.\n   * @returns Promise<AgenticFlowExecution | null> The created execution record or null on failure.\n   */\n  async start(taskId: string, userId: string, initialParams?: any): Promise<AgenticFlowExecution | null> {\n     // This assumes your API Gateway has an endpoint like POST /api/v1/tasks/:taskId/start\n     // that delegates to the SelfNavigationEngine.\n     // Direct backend process triggering is not feasible in SDK fallback.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi(" / api / v1 / tasks / $;
{
    taskId;
}
/start`, 'POST', { userId, initialParams };
;
return result; // Assuming API returns the execution record
{
    // Fallback is not possible here as backend process triggering is required.
    console.warn('SDK: Custom API endpoint not configured. Cannot start task via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot start task via SDK.');
}
/**
 * Pauses the execution of a task.
 * @param taskId The ID of the task.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 */
async;
pause(taskId, string, userId, string);
Promise < void  > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    await this.apiProxy.callApi("/api/v1/tasks/".concat(taskId, "/pause"), 'POST', { userId: userId });
}
{
    // Fallback is not possible here.
    console.warn('SDK: Custom API endpoint not configured. Cannot pause task via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot pause task via SDK.');
}
/**
 * Resumes the execution of a task.
 * @param taskId The ID of the task.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 */
async;
resume(taskId, string, userId, string);
Promise < void  > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    await this.apiProxy.callApi("/api/v1/tasks/".concat(taskId, "/resume"), 'POST', { userId: userId });
}
{
    // Fallback is not possible here.
    console.warn('SDK: Custom API endpoint not configured. Cannot resume task via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot resume task via SDK.');
}
/**
 * Cancels the execution of a task.
 * @param taskId The ID of the task.
 * @param userId The user ID. Required.
 * @returns Promise<void>
 */
async;
cancel(taskId, string, userId, string);
Promise < void  > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    await this.apiProxy.callApi("/api/v1/tasks/".concat(taskId, "/cancel"), 'POST', { userId: userId });
}
{
    // Fallback is not possible here.
    console.warn('SDK: Custom API endpoint not configured. Cannot cancel task via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot cancel task via SDK.');
}
/**
 * Adds a step to an existing task.
 * @param taskId The ID of the task.
 * @param stepDetails The details of the step (without id, task_id, status, result, error, timestamps).
 * @param userId The user ID. Required.
 * @returns Promise<TaskStep | null> The created step or null on failure.
 */
async;
addTaskStep(taskId, string, stepDetails, (Omit), userId, string);
Promise < TaskStep | null > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    var result = await this.apiProxy.callApi("/api/v1/tasks/".concat(taskId, "/steps"), 'POST', { stepDetails: stepDetails, userId: userId });
    return result; // Assuming API returns the created step
}
{
    // Fallback to calling Supabase directly is complex (requires getting next step_order).
    // Rely on the API Gateway for this or implement the logic here.
    // For MVP fallback, just simulate the creation.
    console.warn('SDK: Custom API endpoint not configured. Falling back to simulated task step creation.');
    await new Promise(function (resolve) { return setTimeout(resolve, 500); }); // Simulate delay
    var simulatedStep = {
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
/**
 * Updates a task step.
 * @param stepId The ID of the step.
 * @param updates The updates to apply.
 * @param userId The user ID. Required.
 * @returns Promise<TaskStep | undefined> The updated step or undefined if not found.
 */
async;
updateTaskStep(stepId, string, updates, (Partial), userId, string);
Promise < TaskStep | undefined > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/tasks/steps/".concat(stepId), 'PUT', { updates: updates, userId: userId });
        return result; // Assuming API returns the updated step
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404)
            return undefined; // Not found
        throw error; // Re-throw other errors
    }
}
{
    // Fallback to calling Supabase directly is complex (requires RLS on steps linked to task owner).
    // Rely on the API Gateway for this.
    console.warn('SDK: Custom API endpoint not configured. Cannot update task step via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot update task step via SDK.');
}
/**
 * Deletes a task step.
 * @param stepId The ID of the step.
 * @param userId The user ID. Required.
 * @returns Promise<boolean> True if deletion was successful.
 */
async;
deleteTaskStep(stepId, string, userId, string);
Promise < boolean > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/tasks/steps/".concat(stepId), 'DELETE', undefined, { params: { userId: userId } });
        return (result === null || result === void 0 ? void 0 : result.success) === true; // Assuming API returns { success: true } on success
    }
    catch (error) {
        // Assume 404 means not found/already deleted, other errors are failures
        if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 404)
            return false;
        throw error; // Re-throw other errors
    }
}
{
    // Fallback to calling Supabase directly is complex (requires RLS on steps linked to task owner).
    // Rely on the API Gateway for this.
    console.warn('SDK: Custom API endpoint not configured. Cannot delete task step via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot delete task step via SDK.');
}
/**
 * Links a task to a Key Result.
 * @param taskId The ID of the task.
 * @param krId The ID of the Key Result.
 * @param userId The user ID. Required.
 * @returns Promise<KeyResult | undefined> The updated KR or undefined.
 */
async;
linkToKr(taskId, string, krId, string, userId, string);
Promise < KeyResult | undefined > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/tasks/".concat(taskId, "/link-kr/").concat(krId), 'POST', { userId: userId });
        return result; // Assuming API returns the updated KR
    }
    catch (error) {
        if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 404)
            return undefined; // Not found
        throw error; // Re-throw other errors
    }
}
{
    // Fallback is not possible here as it involves updating another data type (KeyResult).
    console.warn('SDK: Custom API endpoint not configured. Cannot link task to KR via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot link task to KR via SDK.');
}
/**
 * Unlinks a task from a Key Result.
 * @param taskId The ID of the task.
 * @param krId The ID of the Key Result.
 * @param userId The user ID. Required.
 * @returns Promise<KeyResult | undefined> The updated KR or undefined.
 */
async;
unlinkFromKr(taskId, string, krId, string, userId, string);
Promise < KeyResult | undefined > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/tasks/".concat(taskId, "/link-kr/").concat(krId), 'DELETE', undefined, { params: { userId: userId } });
        return result; // Assuming API returns the updated KR
    }
    catch (error) {
        if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === 404)
            return undefined; // Not found
        throw error; // Re-throw other errors
    }
}
{
    // Fallback is not possible here.
    console.warn('SDK: Custom API endpoint not configured. Cannot unlink task from KR via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot unlink task from KR via SDK.');
}
/**
 * Gets execution history for a task.
 * @param taskId The ID of the task.
 * @param userId The user ID. Required.
 * @param limit Optional limit for the number of executions.
 * @returns Promise<AgenticFlowExecution[]> An array of execution records.
 */
async;
getExecutions(taskId, string, userId, string, limit ?  : number);
Promise < AgenticFlowExecution[] > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    var result = await this.apiProxy.callApi("/api/v1/tasks/".concat(taskId, "/executions"), 'GET', undefined, { params: { userId: userId, limit: limit } });
    return result; // Assuming API returns an array of executions
}
{
    // Fallback to calling Supabase directly (requires RLS on executions linked to task owner).
    // Rely on the API Gateway for this.
    console.warn('SDK: Custom API endpoint not configured. Falling back to simulated task execution fetch.');
    if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
        throw new Error('Supabase client not available in ApiProxy.');
    }
    // Direct Supabase query for executions linked to the task (requires RLS)
    var _f = await this.apiProxy['supabaseClient'].from('agentic_flow_executions').select('*').eq('flow_id', taskId).eq('user_id', userId).order('start_timestamp', { ascending: false }).limit(limit || 10), data_1 = _f.data, error_1 = _f.error; // Assuming task executions are stored in agentic_flow_executions with flow_id = taskId
    if (error_1)
        throw error_1;
    return data_1;
}
/**
 * Gets a specific task execution record by ID.
 * @param executionId The ID of the execution record.
 * @param userId The user ID. Required.
 * @returns Promise<AgenticFlowExecution | undefined> The execution record or undefined if not found.
 */
async;
getExecutionById(executionId, string, userId, string);
Promise < AgenticFlowExecution | undefined > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/tasks/executions/".concat(executionId), 'GET', undefined, { params: { userId: userId } });
        return result; // Assuming API returns the execution record
    }
    catch (error) {
        if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) === 404)
            return undefined; // Not found
        throw error; // Re-throw other errors
    }
}
{
    // Fallback to calling Supabase directly (requires RLS on executions linked to task owner).
    // Rely on the API Gateway for this.
    console.warn('SDK: Custom API endpoint not configured. Cannot fetch task execution by ID via SDK.');
    if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
        throw new Error('Supabase client not available in ApiProxy.');
    }
    // Direct Supabase fetch by ID (RLS should enforce ownership)
    var _g = await this.apiProxy['supabaseClient'].from('agentic_flow_executions').select('*').eq('id', executionId).eq('user_id', userId).single(), data_2 = _g.data, error_2 = _g.error;
    if (error_2) {
        if (error_2.code === 'PGRST116')
            return undefined; // Not found (or not owned)
        throw error_2;
    }
    return data_2;
}
""(__makeTemplateObject([""], [""]));
