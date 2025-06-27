```typescript
// packages/@junai/sdk/src/analytics.ts
// Analytics Client Module for SDK

import { ApiProxy } from './apiProxy';
import { SystemEvent, UserAction } from '../../../src/interfaces'; // Import interfaces from main project

export class AnalyticsClient {
  private apiProxy: ApiProxy;

  constructor(apiProxy: ApiProxy) {
    this.apiProxy = apiProxy;
  }

  /**
   * Calculates Key Performance Indicators (KPIs) for a user.
   * @param userId The user ID. Required.
   * @param timeframe Optional timeframe (e.g., 'day', 'week', 'month', 'all'). Defaults to 'all'.
   * @returns Promise<any> An object containing calculated KPIs.
   */
  async getKPIs(userId: string, timeframe?: 'day' | 'week' | 'month' | 'all'): Promise<any> {
    // This assumes your API Gateway has an endpoint like GET /api/v1/analytics/kpis?userId=...&timeframe=...
    // that delegates to the AnalyticsAgent/AnalyticsService.
    // Direct Supabase calculation is complex and not feasible in SDK.

    if (this.apiProxy.getApiEndpoint()) {
        // Call custom API Gateway
        const result = await this.apiProxy.callApi('/api/v1/analytics/kpis', 'GET', undefined, { params: { userId, timeframe } });
        return result; // Assuming API returns the KPI object
    } else {
        // Fallback is not possible here as KPI calculation requires backend processing.
        console.warn('SDK: Custom API endpoint not configured. Cannot calculate KPIs via SDK.');
        throw new Error('Custom API endpoint is not configured. Cannot calculate KPIs via SDK.');
    }
  }

  /**
   * Retrieves recent system events for a user.
   * @param userId The user ID. Required.
   * @param options Optional filters (e.g., limit, severity).
   * @returns Promise<SystemEvent[]> An array of system events.
   */
  async getRecentSystemEvents(userId: string, options?: { limit?: number, severity?: SystemEvent['severity'] }): Promise<SystemEvent[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/analytics/system-events?userId=...&limit=...&severity=...
     // that delegates to the AnalyticsAgent/LoggingService.
     // If calling directly to Supabase, use the Supabase client instead.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/analytics/system-events', 'GET', undefined, { params: { userId, ...options } });
         return result as SystemEvent[]; // Assuming API returns an array of events
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query with filters
         let query = this.apiProxy['supabaseClient'].from('system_events').select('*').eq('user_id', userId);
         if (options?.severity) {
             query = query.eq('severity', options.severity);
         }
         if (options?.limit) {
             query = query.limit(options.limit);
         }
         query = query.order('timestamp', { ascending: false } as any);
         const { data, error } = await query;
         if (error) throw error;
         return data as SystemEvent[];
     }
  }

   /**
   * Retrieves recent user actions for a user.
   * @param userId The user ID. Required.
   * @param options Optional filters (e.g., limit, type, searchTerm).
   * @returns Promise<UserAction[]> An array of user actions.
   */
  async getRecentUserActions(userId: string, options?: { limit?: number, type?: string, searchTerm?: string }): Promise<UserAction[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/analytics/user-actions?userId=...&limit=...&type=...&searchTerm=...
     // that delegates to the AnalyticsAgent/AuthorityForgingEngine.
     // If calling directly to Supabase, use the Supabase client instead.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/analytics/user-actions', 'GET', undefined, { params: { userId, ...options } });
         return result as UserAction[]; // Assuming API returns an array of actions
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query with filters
         let query = this.apiProxy['supabaseClient'].from('user_actions').select('*').eq('user_id', userId);
         if (options?.type) {
             query = query.eq('type', options.type);
         }
         if (options?.searchTerm) {
             // Basic text search filter on details/context (requires FTS setup in DB)
             // For MVP fallback, simulate a basic filter or rely on FTS if configured.
             // Let's simulate a basic ilike search on type and details text representation.
             query = query.ilike('type', `%${options.searchTerm}%`).ilike('details::text', `%${options.searchTerm}%`);
         }
         if (options?.limit) {
             query = query.limit(options.limit);
         }
         query = query.order('timestamp', { ascending: false } as any);
         const { data, error } = await query;
         if (error) throw error;
         return data as UserAction[];
     }
  }


  // TODO: Add other analytics-related methods (e.g., getUserActivitySummary, getReports)
}
```