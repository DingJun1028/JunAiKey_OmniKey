```typescript
// packages/@junai/sdk/src/evolution.ts
// Evolution Client Module for SDK

import { ApiProxy } from './apiProxy';
import { EvolutionaryInsight, UserFeedback } from '../../../src/interfaces'; // Import interfaces from main project

export class EvolutionClient {
  private apiProxy: ApiProxy;

  constructor(apiProxy: ApiProxy) {
    this.apiProxy = apiProxy;
  }

  /**
   * Triggers a manual evolution cycle for a user.
   * @param userId The user ID. Required.
   * @param timeframe Optional timeframe (e.g., 'day', 'week', 'month', 'all'). Defaults to 'all'.
   * @returns Promise<any> The result of the evolution cycle (e.g., count of new insights).
   */
  async runCycle(userId: string, timeframe?: 'day' | 'week' | 'month' | 'all'): Promise<any> {
    // This assumes your API Gateway has an endpoint like POST /api/v1/evolution/run-cycle
    // that delegates to the EvolutionAgent/EvolutionEngine.
    // Direct backend process triggering is not feasible in SDK.

    if (this.apiProxy.getApiEndpoint()) {
        // Call custom API Gateway
        const result = await this.apiProxy.callApi('/api/v1/evolution/run-cycle', 'POST', { userId, timeframe });
        return result; // Assuming API returns a result object
    } else {
        // Fallback is not possible here as backend process triggering is required.
        console.warn('SDK: Custom API endpoint not configured. Cannot trigger evolution cycle via SDK.');
        throw new Error('Custom API endpoint is not configured. Cannot trigger evolution cycle via SDK.');
    }
  }

  /**
   * Retrieves evolutionary insights for a user.
   * @param userId The user ID. Required.
   * @param options Optional filters (e.g., status, limit).
   * @returns Promise<EvolutionaryInsight[]> An array of insights.
   */
  async getInsights(userId: string, options?: { status?: EvolutionaryInsight['status'], limit?: number }): Promise<EvolutionaryInsight[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/evolution/insights?userId=...&status=...&limit=...
     // that delegates to the EvolutionAgent/EvolutionEngine.
     // If calling directly to Supabase, use the Supabase client instead.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/evolution/insights', 'GET', undefined, { params: { userId, ...options } });
         return result as EvolutionaryInsight[]; // Assuming API returns an array of insights
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query with filters
         let query = this.apiProxy['supabaseClient'].from('evolutionary_insights').select('*').eq('user_id', userId);
         if (options?.status) {
             query = query.eq('status', options.status);
         } else {
             // Default to pending if no status filter is provided
             query = query.eq('status', 'pending');
         }
         if (options?.limit) {
             query = query.limit(options.limit);
         }
         query = query.order('timestamp', { ascending: false } as any);
         const { data, error } = await query;
         if (error) throw error;
         return data as EvolutionaryInsight[];
     }
  }

  /**
   * Dismisses an evolutionary insight for a user.
   * @param insightId The ID of the insight. Required.
   * @param userId The user ID. Required.
   * @returns Promise<boolean> True if dismissal was successful.
   */
  async dismissInsight(insightId: string, userId: string): Promise<boolean> {
     // This assumes your API Gateway has an endpoint like PUT /api/v1/evolution/insights/:insightId/dismiss
     // that delegates to the EvolutionAgent/EvolutionEngine.
     // If calling directly to Supabase, use the Supabase client instead.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/evolution/insights/${insightId}/dismiss`, 'PUT', { userId });
             return result?.success === true; // Assuming API returns { success: true } on success
         } catch (error: any) {
             // Assume 404 means not found/already dismissed, other errors are failures
             if (error.response?.status === 404) return false;
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase update by ID (RLS should enforce ownership)
         const { count, error } = await this.apiProxy['supabaseClient'].from('evolutionary_insights').update({ status: 'dismissed' }).eq('id', insightId).eq('user_id', userId).select('id', { count: 'exact' });
         if (error) throw error;
         return count !== null && count > 0;
     }
  }

   /**
   * Handles a user action taken on an evolutionary insight.
   * @param insightId The ID of the insight. Required.
   * @param actionType The type of action taken (e.g., 'automate', 'review_task', 'apply_suggestion'). Required.
   * @param userId The user ID. Required.
   * @param details Optional details about the action.
   * @returns Promise<any> The result of the action (e.g., the created ability).
   */
  async handleInsightAction(insightId: string, actionType: string, userId: string, details?: any): Promise<any> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/evolution/insights/:insightId/action
     // that delegates to the EvolutionAgent/EvolutionEngine.
     // Direct backend process triggering is not feasible in SDK.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi(`/api/v1/evolution/insights/${insightId}/action`, 'POST', { userId, actionType, details });
         return result; // Assuming API returns the result of the action
     } else {
         // Fallback is not possible here as backend process triggering is required.
         console.warn('SDK: Custom API endpoint not configured. Cannot handle insight actions via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot handle insight actions via SDK.');
     }
  }

   /**
   * Records user feedback for a knowledge record (e.g., AI response).
   * @param feedbackDetails The details of the feedback (without id, timestamp). Must include recordId and userId.
   * @returns Promise<UserFeedback> The created feedback object.
   */
  async recordFeedback(feedbackDetails: Omit<UserFeedback, 'id' | 'timestamp'>): Promise<UserFeedback> {
    // This assumes your API Gateway has an endpoint like POST /api/v1/evolution/feedback
    // that delegates to the EvolutionAgent/EvolutionEngine.
    // If calling directly to Supabase, use the Supabase client instead.

    if (this.apiProxy.getApiEndpoint()) {
        // Call custom API Gateway
        const result = await this.apiProxy.callApi('/api/v1/evolution/feedback', 'POST', feedbackDetails);
        return result as UserFeedback; // Assuming API returns the created feedback
    } else {
        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
             throw new Error('Supabase client not available in ApiProxy.');
        }
        // Direct Supabase insert for feedback
        const { data, error } = await this.apiProxy['supabaseClient'].from('user_feedback').insert([feedbackDetails]).select().single();
        if (error) throw error;
        return data as UserFeedback;
    }
  }


  // TODO: Add other evolution-related methods (e.g., getRecentFeedback, analyzeIncorrectFeedback)
}
```