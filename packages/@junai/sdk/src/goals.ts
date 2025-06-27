```typescript
// packages/@junai/sdk/src/goals.ts
// Goal Client Module for SDK

import { ApiProxy } from './apiProxy';
import { Goal, KeyResult } from '../../../src/interfaces'; // Import interfaces from main project

export class GoalClient {
  private apiProxy: ApiProxy;

  constructor(apiProxy: ApiProxy) {
    this.apiProxy = apiProxy;
  }

  /**
   * Creates a new goal.
   * @param goalDetails The details of the goal (without id, status, timestamps). Must include userId.
   * @param keyResults Optional key results for OKR goals.
   * @returns Promise<Goal> The created goal.
   */
  async create(goalDetails: Omit<Goal, 'id' | 'status' | 'creation_timestamp' | 'key_results'>, keyResults?: any[]): Promise<Goal> {
    // This assumes your API Gateway has an endpoint like POST /api/v1/goals
    // that delegates to the GoalManagementAgent/GoalManagementService.
    // If calling directly to Supabase, use the Supabase client instead.

    if (this.apiProxy.getApiEndpoint()) {
        // Call custom API Gateway
        const result = await this.apiProxy.callApi('/api/v1/goals', 'POST', { goalDetails, keyResults });
        return result as Goal; // Assuming API returns the created goal
    } else {
        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
             throw new Error('Supabase client not available in ApiProxy.');
        }
        // Direct Supabase insert for goals and KRs is more complex (requires two inserts).
        // Rely on the API Gateway for this or implement the multi-step insert here.
        // For MVP fallback, just simulate the creation.
        console.warn('SDK: Custom API endpoint not configured. Falling back to simulated goal creation.');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        const simulatedGoal: Goal = {
            id: 'sim-goal-' + Date.now(),
            user_id: goalDetails.user_id,
            description: goalDetails.description,
            type: goalDetails.type,
            status: 'pending',
            creation_timestamp: new Date().toISOString(),
            target_completion_date: goalDetails.target_completion_date,
            linked_task_ids: [],
            key_results: keyResults || [],
        };
        return simulatedGoal;
    }
  }

  /**
   * Retrieves goals for a user.
   * @param userId The user ID. Required.
   * @param status Optional filter by status.
   * @returns Promise<Goal[]> An array of goals.
   */
  async list(userId: string, status?: Goal['status']): Promise<Goal[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/goals?userId=...&status=...
     // that delegates to the GoalManagementAgent/GoalManagementService.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/goals', 'GET', undefined, { params: { userId, status } });
         return result as Goal[]; // Assuming API returns an array of goals
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query with filters (requires join for key_results)
         // Rely on the API Gateway for the join or implement it here.
         // For MVP fallback, just simulate fetching basic goal data.
         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated basic Supabase goal list.');
         let query = this.apiProxy['supabaseClient'].from('goals').select('*').eq('user_id', userId);
         if (status) {
             query = query.eq('status', status);
         }
         const { data, error } = await query;
         if (error) throw error;
         return data as Goal[]; // Returns goals without key_results in fallback
     }
  }


  /**
   * Gets a goal by ID.
   * @param goalId The ID of the goal.
   * @returns Promise<Goal | undefined> The goal or undefined if not found.
   */
  async getById(goalId: string): Promise<Goal | undefined> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/goals/:goalId
     // that delegates to the GoalManagementAgent/GoalManagementService.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/goals/${goalId}`, 'GET');
             return result as Goal; // Assuming API returns the goal
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase fetch for goal and key_results requires a join.
         // Rely on the API Gateway for this or implement the join here.
         // For MVP fallback, just simulate fetching.
         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated goal fetch.');
         await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
         // Simulate finding a goal if the ID looks like a simulated one
         if (goalId.startsWith('sim-goal-')) {
              const simulatedGoal: Goal = {
                 id: goalId,
                 user_id: this.apiProxy['supabaseClient'].auth.currentUser?.id || 'sim-user', // Link to current user if available
                 description: `Simulated Goal ${goalId}`,
                 type: 'okr',
                 status: 'pending',
                 creation_timestamp: new Date().toISOString(),
                 target_completion_date: null,
                 linked_task_ids: [],
                 key_results: [{ id: 'sim-kr-1', goal_id: goalId, description: 'Simulated KR', target_value: 100, current_value: 0, unit: 'units', status: 'on-track', linked_task_ids: [] }],
              };
              return simulatedGoal;
         }
         return undefined; // Simulate not found
     }
  }

  /**
   * Updates a goal.
   * @param goalId The ID of the goal.
   * @param updates The updates to apply.
   * @returns Promise<Goal | undefined> The updated goal or undefined if not found.
   */
  async update(goalId: string, updates: Partial<Omit<Goal, 'id' | 'user_id' | 'creation_timestamp' | 'key_results'>>): Promise<Goal | undefined> {
     // This assumes your API Gateway has an endpoint like PUT /api/v1/goals/:goalId
     // that delegates to the GoalManagementAgent/GoalManagementService.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/goals/${goalId}`, 'PUT', updates);
             return result as Goal; // Assuming API returns the updated goal
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
         const { data, error } = await this.apiProxy['supabaseClient'].from('goals').update(updates).eq('id', goalId).select().single();
         if (error) {
             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)
             throw error;
         }
         return data as Goal;
     }
  }

  /**
   * Deletes a goal.
   * @param goalId The ID of the goal.
   * @returns Promise<boolean> True if deletion was successful.
   */
  async delete(goalId: string): Promise<boolean> {
     // This assumes your API Gateway has an endpoint like DELETE /api/v1/goals/:goalId
     // that delegates to the GoalManagementAgent/GoalManagementService.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/goals/${goalId}`, 'DELETE');
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
         const { count, error } = await this.apiProxy['supabaseClient'].from('goals').delete().eq('id', goalId).select('id', { count: 'exact' });
         if (error) throw error;
         return count !== null && count > 0;
     }
  }

  /**
   * Adds a Key Result to an existing goal.
   * @param goalId The ID of the goal.
   * @param krDetails The details of the Key Result (without id, goal_id, status, current_value, linked_task_ids).
   * @param userId The user ID. Required.
   * @returns Promise<KeyResult | null> The created KR or null on failure.
   */
  async addKeyResult(goalId: string, krDetails: Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'>, userId: string): Promise<KeyResult | null> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/goals/:goalId/key-results
     // that delegates to the GoalManagementService.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi(`/api/v1/goals/${goalId}/key-results`, 'POST', { krDetails, userId });
         return result as KeyResult; // Assuming API returns the created KR
     } else {
         // Fallback to calling Supabase directly is complex (requires RLS on KRs linked to goal owner).
         // Rely on the API Gateway for this.
         console.warn('SDK: Custom API endpoint not configured. Cannot add Key Result via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot add Key Result via SDK.');
     }
  }

  /**
   * Updates a Key Result.
   * @param krId The ID of the Key Result.
   * @param updates The updates to apply.
   * @param userId The user ID. Required.
   * @returns Promise<KeyResult | undefined> The updated KR or undefined if not found.
   */
  async updateKeyResult(krId: string, updates: Partial<Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'>>): Promise<KeyResult | undefined> {
     // This assumes your API Gateway has an endpoint like PUT /api/v1/goals/key-results/:krId
     // that delegates to the GoalManagementService.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/goals/key-results/${krId}`, 'PUT', { updates, userId });
             return result as KeyResult; // Assuming API returns the updated KR
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly is complex (requires RLS on KRs linked to goal owner).
         // Rely on the API Gateway for this.
         console.warn('SDK: Custom API endpoint not configured. Cannot update Key Result via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot update Key Result via SDK.');
     }
  }

  /**
   * Deletes a Key Result.
   * @param krId The ID of the Key Result.
   * @param userId The user ID. Required.
   * @returns Promise<boolean> True if deletion was successful.
   */
  async deleteKeyResult(krId: string, userId: string): Promise<boolean> {
     // This assumes your API Gateway has an endpoint like DELETE /api/v1/goals/key-results/:krId
     // that delegates to the GoalManagementService.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/goals/key-results/${krId}`, 'DELETE', undefined, { params: { userId } });
             return result?.success === true; // Assuming API returns { success: true } on success
         } catch (error: any) {
             // Assume 404 means not found/already deleted, other errors are failures
             if (error.response?.status === 404) return false;
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly is complex (requires RLS on KRs linked to goal owner).
         // Rely on the API Gateway for this.
         console.warn('SDK: Custom API endpoint not configured. Cannot delete Key Result via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot delete Key Result via SDK.');
     }
  }

  /**
   * Updates the progress of a Key Result.
   * @param krId The ID of the Key Result.
   * @param currentValue The new current value.
   * @param userId The user ID. Required.
   * @returns Promise<KeyResult | undefined> The updated KR or undefined if not found.
   */
  async updateKeyResultProgress(krId: string, currentValue: number, userId: string): Promise<KeyResult | undefined> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/goals/key-results/:krId/progress
     // that delegates to the GoalManagementService.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/goals/key-results/${krId}/progress`, 'POST', { currentValue, userId });
             return result as KeyResult; // Assuming API returns the updated KR
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly is complex (requires RLS on KRs linked to goal owner).
         // Rely on the API Gateway for this.
         console.warn('SDK: Custom API endpoint not configured. Cannot update Key Result progress via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot update Key Result progress via SDK.');
     }
  }

  // Note: Task linking methods (linkTaskToKeyResult, unlinkTaskFromKeyResult, checkAndCompleteKeyResultIfTaskCompleted) are in tasks.ts
}
```