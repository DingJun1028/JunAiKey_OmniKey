var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a, _b, _c;
""(__makeTemplateObject(["typescript\n// packages/@junai/sdk/src/goals.ts\n// Goal Client Module for SDK\n\nimport { ApiProxy } from './apiProxy';\nimport { Goal, KeyResult } from '../../../src/interfaces'; // Import interfaces from main project\n\nexport class GoalClient {\n  private apiProxy: ApiProxy;\n\n  constructor(apiProxy: ApiProxy) {\n    this.apiProxy = apiProxy;\n  }\n\n  /**\n   * Creates a new goal.\n   * @param goalDetails The details of the goal (without id, status, timestamps). Must include userId.\n   * @param keyResults Optional key results for OKR goals.\n   * @returns Promise<Goal> The created goal.\n   */\n  async create(goalDetails: Omit<Goal, 'id' | 'status' | 'creation_timestamp' | 'key_results'>, keyResults?: any[]): Promise<Goal> {\n    // This assumes your API Gateway has an endpoint like POST /api/v1/goals\n    // that delegates to the GoalManagementAgent/GoalManagementService.\n    // If calling directly to Supabase, use the Supabase client instead.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi('/api/v1/goals', 'POST', { goalDetails, keyResults });\n        return result as Goal; // Assuming API returns the created goal\n    } else {\n        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n             throw new Error('Supabase client not available in ApiProxy.');\n        }\n        // Direct Supabase insert for goals and KRs is more complex (requires two inserts).\n        // Rely on the API Gateway for this or implement the multi-step insert here.\n        // For MVP fallback, just simulate the creation.\n        console.warn('SDK: Custom API endpoint not configured. Falling back to simulated goal creation.');\n        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay\n        const simulatedGoal: Goal = {\n            id: 'sim-goal-' + Date.now(),\n            user_id: goalDetails.user_id,\n            description: goalDetails.description,\n            type: goalDetails.type,\n            status: 'pending',\n            creation_timestamp: new Date().toISOString(),\n            target_completion_date: goalDetails.target_completion_date,\n            linked_task_ids: [],\n            key_results: keyResults || [],\n        };\n        return simulatedGoal;\n    }\n  }\n\n  /**\n   * Retrieves goals for a user.\n   * @param userId The user ID. Required.\n   * @param status Optional filter by status.\n   * @returns Promise<Goal[]> An array of goals.\n   */\n  async list(userId: string, status?: Goal['status']): Promise<Goal[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/goals?userId=...&status=...\n     // that delegates to the GoalManagementAgent/GoalManagementService.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/goals', 'GET', undefined, { params: { userId, status } });\n         return result as Goal[]; // Assuming API returns an array of goals\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query with filters (requires join for key_results)\n         // Rely on the API Gateway for the join or implement it here.\n         // For MVP fallback, just simulate fetching basic goal data.\n         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated basic Supabase goal list.');\n         let query = this.apiProxy['supabaseClient'].from('goals').select('*').eq('user_id', userId);\n         if (status) {\n             query = query.eq('status', status);\n         }\n         const { data, error } = await query;\n         if (error) throw error;\n         return data as Goal[]; // Returns goals without key_results in fallback\n     }\n  }\n\n\n  /**\n   * Gets a goal by ID.\n   * @param goalId The ID of the goal.\n   * @returns Promise<Goal | undefined> The goal or undefined if not found.\n   */\n  async getById(goalId: string): Promise<Goal | undefined> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/goals/:goalId\n     // that delegates to the GoalManagementAgent/GoalManagementService.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi("], ["typescript\n// packages/@junai/sdk/src/goals.ts\n// Goal Client Module for SDK\n\nimport { ApiProxy } from './apiProxy';\nimport { Goal, KeyResult } from '../../../src/interfaces'; // Import interfaces from main project\n\nexport class GoalClient {\n  private apiProxy: ApiProxy;\n\n  constructor(apiProxy: ApiProxy) {\n    this.apiProxy = apiProxy;\n  }\n\n  /**\n   * Creates a new goal.\n   * @param goalDetails The details of the goal (without id, status, timestamps). Must include userId.\n   * @param keyResults Optional key results for OKR goals.\n   * @returns Promise<Goal> The created goal.\n   */\n  async create(goalDetails: Omit<Goal, 'id' | 'status' | 'creation_timestamp' | 'key_results'>, keyResults?: any[]): Promise<Goal> {\n    // This assumes your API Gateway has an endpoint like POST /api/v1/goals\n    // that delegates to the GoalManagementAgent/GoalManagementService.\n    // If calling directly to Supabase, use the Supabase client instead.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi('/api/v1/goals', 'POST', { goalDetails, keyResults });\n        return result as Goal; // Assuming API returns the created goal\n    } else {\n        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n             throw new Error('Supabase client not available in ApiProxy.');\n        }\n        // Direct Supabase insert for goals and KRs is more complex (requires two inserts).\n        // Rely on the API Gateway for this or implement the multi-step insert here.\n        // For MVP fallback, just simulate the creation.\n        console.warn('SDK: Custom API endpoint not configured. Falling back to simulated goal creation.');\n        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay\n        const simulatedGoal: Goal = {\n            id: 'sim-goal-' + Date.now(),\n            user_id: goalDetails.user_id,\n            description: goalDetails.description,\n            type: goalDetails.type,\n            status: 'pending',\n            creation_timestamp: new Date().toISOString(),\n            target_completion_date: goalDetails.target_completion_date,\n            linked_task_ids: [],\n            key_results: keyResults || [],\n        };\n        return simulatedGoal;\n    }\n  }\n\n  /**\n   * Retrieves goals for a user.\n   * @param userId The user ID. Required.\n   * @param status Optional filter by status.\n   * @returns Promise<Goal[]> An array of goals.\n   */\n  async list(userId: string, status?: Goal['status']): Promise<Goal[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/goals?userId=...&status=...\n     // that delegates to the GoalManagementAgent/GoalManagementService.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/goals', 'GET', undefined, { params: { userId, status } });\n         return result as Goal[]; // Assuming API returns an array of goals\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query with filters (requires join for key_results)\n         // Rely on the API Gateway for the join or implement it here.\n         // For MVP fallback, just simulate fetching basic goal data.\n         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated basic Supabase goal list.');\n         let query = this.apiProxy['supabaseClient'].from('goals').select('*').eq('user_id', userId);\n         if (status) {\n             query = query.eq('status', status);\n         }\n         const { data, error } = await query;\n         if (error) throw error;\n         return data as Goal[]; // Returns goals without key_results in fallback\n     }\n  }\n\n\n  /**\n   * Gets a goal by ID.\n   * @param goalId The ID of the goal.\n   * @returns Promise<Goal | undefined> The goal or undefined if not found.\n   */\n  async getById(goalId: string): Promise<Goal | undefined> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/goals/:goalId\n     // that delegates to the GoalManagementAgent/GoalManagementService.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi("])) / api / v1 / goals / $;
{
    goalId;
}
", 'GET');\n             return result as Goal; // Assuming API returns the goal\n         } catch (error: any) {\n             if (error.response?.status === 404) return undefined; // Not found\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase fetch for goal and key_results requires a join.\n         // Rely on the API Gateway for this or implement the join here.\n         // For MVP fallback, just simulate fetching.\n         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated goal fetch.');\n         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay\n         // Simulate finding a goal if the ID looks like a simulated one\n         if (goalId.startsWith('sim-goal-')) {\n              const simulatedGoal: Goal = {\n                 id: goalId,\n                 user_id: this.apiProxy['supabaseClient'].auth.currentUser?.id || 'sim-user', // Link to current user if available\n                 description: ";
Simulated;
Goal;
$;
{
    goalId;
}
",\n                 type: 'okr',\n                 status: 'pending',\n                 creation_timestamp: new Date().toISOString(),\n                 target_completion_date: null,\n                 linked_task_ids: [],\n                 key_results: [{ id: 'sim-kr-1', goal_id: goalId, description: 'Simulated KR', target_value: 100, current_value: 0, unit: 'units', status: 'on-track', linked_task_ids: [] }],\n              };\n              return simulatedGoal;\n         }\n         return undefined; // Simulate not found\n     }\n  }\n\n  /**\n   * Updates a goal.\n   * @param goalId The ID of the goal.\n   * @param updates The updates to apply.\n   * @returns Promise<Goal | undefined> The updated goal or undefined if not found.\n   */\n  async update(goalId: string, updates: Partial<Omit<Goal, 'id' | 'user_id' | 'creation_timestamp' | 'key_results'>>): Promise<Goal | undefined> {\n     // This assumes your API Gateway has an endpoint like PUT /api/v1/goals/:goalId\n     // that delegates to the GoalManagementAgent/GoalManagementService.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi(" / api / v1 / goals / $;
{
    goalId;
}
", 'PUT', updates);\n             return result as Goal; // Assuming API returns the updated goal\n         } catch (error: any) {\n             if (error.response?.status === 404) return undefined; // Not found\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase update by ID (RLS should enforce ownership)\n         const { data, error } = await this.apiProxy['supabaseClient'].from('goals').update(updates).eq('id', goalId).select().single();\n         if (error) {\n             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)\n             throw error;\n         }\n         return data as Goal;\n     }\n  }\n\n  /**\n   * Deletes a goal.\n   * @param goalId The ID of the goal.\n   * @returns Promise<boolean> True if deletion was successful.\n   */\n  async delete(goalId: string): Promise<boolean> {\n     // This assumes your API Gateway has an endpoint like DELETE /api/v1/goals/:goalId\n     // that delegates to the GoalManagementAgent/GoalManagementService.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi(" / api / v1 / goals / $;
{
    goalId;
}
", 'DELETE');\n             return result?.success === true; // Assuming API returns { success: true } on success\n         } catch (error: any) {\n             // Assume 404 means not found/already deleted, other errors are failures\n             if (error.response?.status === 404) return false;\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase delete by ID (RLS should enforce ownership)\n         const { count, error } = await this.apiProxy['supabaseClient'].from('goals').delete().eq('id', goalId).select('id', { count: 'exact' });\n         if (error) throw error;\n         return count !== null && count > 0;\n     }\n  }\n\n  /**\n   * Adds a Key Result to an existing goal.\n   * @param goalId The ID of the goal.\n   * @param krDetails The details of the Key Result (without id, goal_id, status, current_value, linked_task_ids).\n   * @param userId The user ID. Required.\n   * @returns Promise<KeyResult | null> The created KR or null on failure.\n   */\n  async addKeyResult(goalId: string, krDetails: Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'>, userId: string): Promise<KeyResult | null> {\n     // This assumes your API Gateway has an endpoint like POST /api/v1/goals/:goalId/key-results\n     // that delegates to the GoalManagementService.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi(" / api / v1 / goals / $;
{
    goalId;
}
/key-results`, 'POST', { krDetails, userId };
;
return result; // Assuming API returns the created KR
{
    // Fallback to calling Supabase directly is complex (requires RLS on KRs linked to goal owner).
    // Rely on the API Gateway for this.
    console.warn('SDK: Custom API endpoint not configured. Cannot add Key Result via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot add Key Result via SDK.');
}
/**
 * Updates a Key Result.
 * @param krId The ID of the Key Result.
 * @param updates The updates to apply.
 * @param userId The user ID. Required.
 * @returns Promise<KeyResult | undefined> The updated KR or undefined if not found.
 */
async;
updateKeyResult(krId, string, updates, (Partial));
Promise < KeyResult | undefined > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/goals/key-results/".concat(krId), 'PUT', { updates: updates, userId: userId });
        return result; // Assuming API returns the updated KR
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404)
            return undefined; // Not found
        throw error; // Re-throw other errors
    }
}
{
    // Fallback to calling Supabase directly is complex (requires RLS on KRs linked to goal owner).
    // Rely on the API Gateway for this.
    console.warn('SDK: Custom API endpoint not configured. Cannot update Key Result via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot update Key Result via SDK.');
}
/**
 * Deletes a Key Result.
 * @param krId The ID of the Key Result.
 * @param userId The user ID. Required.
 * @returns Promise<boolean> True if deletion was successful.
 */
async;
deleteKeyResult(krId, string, userId, string);
Promise < boolean > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/goals/key-results/".concat(krId), 'DELETE', undefined, { params: { userId: userId } });
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
    // Fallback to calling Supabase directly is complex (requires RLS on KRs linked to goal owner).
    // Rely on the API Gateway for this.
    console.warn('SDK: Custom API endpoint not configured. Cannot delete Key Result via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot delete Key Result via SDK.');
}
/**
 * Updates the progress of a Key Result.
 * @param krId The ID of the Key Result.
 * @param currentValue The new current value.
 * @param userId The user ID. Required.
 * @returns Promise<KeyResult | undefined> The updated KR or undefined if not found.
 */
async;
updateKeyResultProgress(krId, string, currentValue, number, userId, string);
Promise < KeyResult | undefined > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/goals/key-results/".concat(krId, "/progress"), 'POST', { currentValue: currentValue, userId: userId });
        return result; // Assuming API returns the updated KR
    }
    catch (error) {
        if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 404)
            return undefined; // Not found
        throw error; // Re-throw other errors
    }
}
{
    // Fallback to calling Supabase directly is complex (requires RLS on KRs linked to goal owner).
    // Rely on the API Gateway for this.
    console.warn('SDK: Custom API endpoint not configured. Cannot update Key Result progress via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot update Key Result progress via SDK.');
}
""(__makeTemplateObject([""], [""]));
