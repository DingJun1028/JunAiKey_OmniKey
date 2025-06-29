var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a;
""(__makeTemplateObject(["typescript\n// packages/@junai/sdk/src/evolution.ts\n// Evolution Client Module for SDK\n\nimport { ApiProxy } from './apiProxy';\nimport { EvolutionaryInsight, UserFeedback } from '../../../src/interfaces'; // Import interfaces from main project\n\nexport class EvolutionClient {\n  private apiProxy: ApiProxy;\n\n  constructor(apiProxy: ApiProxy) {\n    this.apiProxy = apiProxy;\n  }\n\n  /**\n   * Triggers a manual evolution cycle for a user.\n   * @param userId The user ID. Required.\n   * @param timeframe Optional timeframe (e.g., 'day', 'week', 'month', 'all'). Defaults to 'all'.\n   * @returns Promise<any> The result of the evolution cycle (e.g., count of new insights).\n   */\n  async runCycle(userId: string, timeframe?: 'day' | 'week' | 'month' | 'all'): Promise<any> {\n    // This assumes your API Gateway has an endpoint like POST /api/v1/evolution/run-cycle\n    // that delegates to the EvolutionAgent/EvolutionEngine.\n    // Direct backend process triggering is not feasible in SDK.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi('/api/v1/evolution/run-cycle', 'POST', { userId, timeframe });\n        return result; // Assuming API returns a result object\n    } else {\n        // Fallback is not possible here as backend process triggering is required.\n        console.warn('SDK: Custom API endpoint not configured. Cannot trigger evolution cycle via SDK.');\n        throw new Error('Custom API endpoint is not configured. Cannot trigger evolution cycle via SDK.');\n    }\n  }\n\n  /**\n   * Retrieves evolutionary insights for a user.\n   * @param userId The user ID. Required.\n   * @param options Optional filters (e.g., status, limit).\n   * @returns Promise<EvolutionaryInsight[]> An array of insights.\n   */\n  async getInsights(userId: string, options?: { status?: EvolutionaryInsight['status'], limit?: number }): Promise<EvolutionaryInsight[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/evolution/insights?userId=...&status=...&limit=...\n     // that delegates to the EvolutionAgent/EvolutionEngine.\n     // If calling directly to Supabase, use the Supabase client instead.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/evolution/insights', 'GET', undefined, { params: { userId, ...options } });\n         return result as EvolutionaryInsight[]; // Assuming API returns an array of insights\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query with filters\n         let query = this.apiProxy['supabaseClient'].from('evolutionary_insights').select('*').eq('user_id', userId);\n         if (options?.status) {\n             query = query.eq('status', options.status);\n         } else {\n             // Default to pending if no status filter is provided\n             query = query.eq('status', 'pending');\n         }\n         if (options?.limit) {\n             query = query.limit(options.limit);\n         }\n         query = query.order('timestamp', { ascending: false } as any);\n         const { data, error } = await query;\n         if (error) throw error;\n         return data as EvolutionaryInsight[];\n     }\n  }\n\n  /**\n   * Dismisses an evolutionary insight for a user.\n   * @param insightId The ID of the insight. Required.\n   * @param userId The user ID. Required.\n   * @returns Promise<boolean> True if dismissal was successful.\n   */\n  async dismissInsight(insightId: string, userId: string): Promise<boolean> {\n     // This assumes your API Gateway has an endpoint like PUT /api/v1/evolution/insights/:insightId/dismiss\n     // that delegates to the EvolutionAgent/EvolutionEngine.\n     // If calling directly to Supabase, use the Supabase client instead.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi("], ["typescript\n// packages/@junai/sdk/src/evolution.ts\n// Evolution Client Module for SDK\n\nimport { ApiProxy } from './apiProxy';\nimport { EvolutionaryInsight, UserFeedback } from '../../../src/interfaces'; // Import interfaces from main project\n\nexport class EvolutionClient {\n  private apiProxy: ApiProxy;\n\n  constructor(apiProxy: ApiProxy) {\n    this.apiProxy = apiProxy;\n  }\n\n  /**\n   * Triggers a manual evolution cycle for a user.\n   * @param userId The user ID. Required.\n   * @param timeframe Optional timeframe (e.g., 'day', 'week', 'month', 'all'). Defaults to 'all'.\n   * @returns Promise<any> The result of the evolution cycle (e.g., count of new insights).\n   */\n  async runCycle(userId: string, timeframe?: 'day' | 'week' | 'month' | 'all'): Promise<any> {\n    // This assumes your API Gateway has an endpoint like POST /api/v1/evolution/run-cycle\n    // that delegates to the EvolutionAgent/EvolutionEngine.\n    // Direct backend process triggering is not feasible in SDK.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi('/api/v1/evolution/run-cycle', 'POST', { userId, timeframe });\n        return result; // Assuming API returns a result object\n    } else {\n        // Fallback is not possible here as backend process triggering is required.\n        console.warn('SDK: Custom API endpoint not configured. Cannot trigger evolution cycle via SDK.');\n        throw new Error('Custom API endpoint is not configured. Cannot trigger evolution cycle via SDK.');\n    }\n  }\n\n  /**\n   * Retrieves evolutionary insights for a user.\n   * @param userId The user ID. Required.\n   * @param options Optional filters (e.g., status, limit).\n   * @returns Promise<EvolutionaryInsight[]> An array of insights.\n   */\n  async getInsights(userId: string, options?: { status?: EvolutionaryInsight['status'], limit?: number }): Promise<EvolutionaryInsight[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/evolution/insights?userId=...&status=...&limit=...\n     // that delegates to the EvolutionAgent/EvolutionEngine.\n     // If calling directly to Supabase, use the Supabase client instead.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/evolution/insights', 'GET', undefined, { params: { userId, ...options } });\n         return result as EvolutionaryInsight[]; // Assuming API returns an array of insights\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query with filters\n         let query = this.apiProxy['supabaseClient'].from('evolutionary_insights').select('*').eq('user_id', userId);\n         if (options?.status) {\n             query = query.eq('status', options.status);\n         } else {\n             // Default to pending if no status filter is provided\n             query = query.eq('status', 'pending');\n         }\n         if (options?.limit) {\n             query = query.limit(options.limit);\n         }\n         query = query.order('timestamp', { ascending: false } as any);\n         const { data, error } = await query;\n         if (error) throw error;\n         return data as EvolutionaryInsight[];\n     }\n  }\n\n  /**\n   * Dismisses an evolutionary insight for a user.\n   * @param insightId The ID of the insight. Required.\n   * @param userId The user ID. Required.\n   * @returns Promise<boolean> True if dismissal was successful.\n   */\n  async dismissInsight(insightId: string, userId: string): Promise<boolean> {\n     // This assumes your API Gateway has an endpoint like PUT /api/v1/evolution/insights/:insightId/dismiss\n     // that delegates to the EvolutionAgent/EvolutionEngine.\n     // If calling directly to Supabase, use the Supabase client instead.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi("])) / api / v1 / evolution / insights / $;
{
    insightId;
}
/dismiss`, 'PUT', { userId };
;
return (result === null || result === void 0 ? void 0 : result.success) === true; // Assuming API returns { success: true } on success
try { }
catch (error) {
    // Assume 404 means not found/already dismissed, other errors are failures
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404)
        return false;
    throw error; // Re-throw other errors
}
{
    // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
    if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
        throw new Error('Supabase client not available in ApiProxy.');
    }
    // Direct Supabase update by ID (RLS should enforce ownership)
    var _b = await this.apiProxy['supabaseClient'].from('evolutionary_insights').update({ status: 'dismissed' }).eq('id', insightId).eq('user_id', userId).select('id', { count: 'exact' }), count = _b.count, error_1 = _b.error;
    if (error_1)
        throw error_1;
    return count !== null && count > 0;
}
/**
* Handles a user action taken on an evolutionary insight.
* @param insightId The ID of the insight. Required.
* @param actionType The type of action taken (e.g., 'automate', 'review_task', 'apply_suggestion'). Required.
* @param userId The user ID. Required.
* @param details Optional details about the action.
* @returns Promise<any> The result of the action (e.g., the created ability).
*/
async;
handleInsightAction(insightId, string, actionType, string, userId, string, details ?  : any);
Promise < any > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    var result = await this.apiProxy.callApi("/api/v1/evolution/insights/".concat(insightId, "/action"), 'POST', { userId: userId, actionType: actionType, details: details });
    return result; // Assuming API returns the result of the action
}
{
    // Fallback is not possible here as backend process triggering is required.
    console.warn('SDK: Custom API endpoint not configured. Cannot handle insight actions via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot handle insight actions via SDK.');
}
/**
* Records user feedback for a knowledge record (e.g., AI response).
* @param feedbackDetails The details of the feedback (without id, timestamp). Must include recordId and userId.
* @returns Promise<UserFeedback> The created feedback object.
*/
async;
recordFeedback(feedbackDetails, (Omit));
Promise < UserFeedback > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    var result = await this.apiProxy.callApi('/api/v1/evolution/feedback', 'POST', feedbackDetails);
    return result; // Assuming API returns the created feedback
}
{
    // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
    if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
        throw new Error('Supabase client not available in ApiProxy.');
    }
    // Direct Supabase insert for feedback
    var _c = await this.apiProxy['supabaseClient'].from('user_feedback').insert([feedbackDetails]).select().single(), data_1 = _c.data, error_2 = _c.error;
    if (error_2)
        throw error_2;
    return data_1;
}
""(__makeTemplateObject([""], [""]));
