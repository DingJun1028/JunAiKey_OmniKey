```typescript
// packages/@junai/sdk/src/security.ts
// Security Client Module for SDK

import { ApiProxy } from './apiProxy';
import { SystemEvent, UserAction, CloudSyncConfig } from '../../../src/interfaces'; // Import interfaces from main project

export class SecurityClient {
  private apiProxy: ApiProxy;

  constructor(apiProxy: ApiProxy) {
    this.apiProxy = apiProxy;
  }

  /**
   * Retrieves recent security events for a user.
   * @param userId The user ID. Required.
   * @param options Optional filters (e.g., limit, severity).
   * @returns Promise<SystemEvent[]> An array of security events.
   */
  async getRecentSecurityEvents(userId: string, options?: { limit?: number, severity?: SystemEvent['severity'] }): Promise<SystemEvent[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/security/events?userId=...&limit=...&severity=...
     // that delegates to the SecurityService/LoggingService.
     // If calling directly to Supabase, use the Supabase client instead.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/security/events', 'GET', undefined, { params: { userId, ...options } });
         return result as SystemEvent[]; // Assuming API returns an array of events
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query with filters
         let query = this.apiProxy['supabaseClient'].from('system_events').select('*').eq('user_id', userId).eq('type', 'security_event_recorded'); // Filter for security events
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
   * Retrieves recent user actions (personal usage logs) for a user.
   * @param userId The user ID. Required.
   * @param options Optional filters (e.g., limit, type, searchTerm).
   * @returns Promise<UserAction[]> An array of user actions.
   */
  async getRecentUserActions(userId: string, options?: { limit?: number, type?: string, searchTerm?: string }): Promise<UserAction[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/security/user-actions?userId=...&limit=...&type=...&searchTerm=...
     // that delegates to the SecurityService/AuthorityForgingEngine.
     // If calling directly to Supabase, use the Supabase client instead.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/security/user-actions', 'GET', undefined, { params: { userId, ...options } });
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

  /**
   * Triggers a data integrity check for a user.
   * @param userId The user ID. Required.
   * @returns Promise<any> The results of the integrity check.
   */
  async triggerIntegrityCheck(userId: string): Promise<any> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/security/integrity-check
     // that delegates to the SecurityService.
     // Direct backend process triggering is not feasible in SDK.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/security/integrity-check', 'POST', { userId });
         return result; // Assuming API returns a result object
     } else {
         // Fallback is not possible here as backend process triggering is required.
         console.warn('SDK: Custom API endpoint not configured. Cannot trigger integrity check via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot trigger integrity check via SDK.');
     }
  }

   /**
   * Triggers a security monitoring scan for a user.
   * @param userId The user ID. Required.
   * @returns Promise<any> The results of the security scan.
   */
  async triggerSecurityScan(userId: string): Promise<any> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/security/scan
     // that delegates to the SecurityService.
     // Direct backend process triggering is not feasible in SDK.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/security/scan', 'POST', { userId });
         return result; // Assuming API returns a result object
     } else {
         // Fallback is not possible here as backend process triggering is required.
         console.warn('SDK: Custom API endpoint not configured. Cannot trigger security scan via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot trigger security scan via SDK.');
     }
  }

   /**
   * Resets all user data.
   * WARNING: This is a destructive action.
   * @param userId The user ID. Required.
   * @returns Promise<void>
   */
  async resetUserData(userId: string): Promise<void> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/security/reset-data
     // that delegates to the SecurityService.
     // Direct backend process triggering is not feasible in SDK.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         await this.apiProxy.callApi('/api/v1/security/reset-data', 'POST', { userId });
     } else {
         // Fallback is not possible here as backend process triggering is required.
         console.warn('SDK: Custom API endpoint not configured. Cannot reset user data via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot reset user data via SDK.');
     }
  }

   /**
   * Triggers a full data backup for a user.
   * @param userId The user ID. Required.
   * @param destination Optional destination (e.g., 'google_drive', 'local_file'). Defaults to 'local_file'.
   * @returns Promise<void>
   */
  async triggerBackup(userId: string, destination?: 'google_drive' | 'local_file'): Promise<void> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/security/backup
     // that delegates to the SyncAgent/SyncService.
     // Direct backend process triggering is not feasible in SDK.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         await this.apiProxy.callApi('/api/v1/security/backup', 'POST', { userId, destination });
     } else {
         // Fallback is not possible here as backend process triggering is required.
         console.warn('SDK: Custom API endpoint not configured. Cannot trigger backup via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot trigger backup via SDK.');
     }
  }

   /**
   * Triggers data mirroring for a user.
   * @param userId The user ID. Required.
   * @param dataType Optional data type to mirror. Defaults to 'system' (all data).
   * @param destination Optional destination (e.g., 'boostspace', 'another_db'). Required.
   * @returns Promise<void>
   */
  async triggerMirror(userId: string, dataType?: string, destination?: string): Promise<void> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/security/mirror
     // that delegates to the SyncAgent/SyncService.
     // Direct backend process triggering is not feasible in SDK.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         await this.apiProxy.callApi('/api/v1/security/mirror', 'POST', { userId, dataType, destination });
     } else {
         // Fallback is not possible here as backend process triggering is required.
         console.warn('SDK: Custom API endpoint not configured. Cannot trigger mirroring via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot trigger mirroring via SDK.');
     }
  }


  // TODO: Add other security-related methods (e.g., getSensitiveDataKeys, storeSensitiveData, deleteSensitiveData, getLinkedIntegrations, updateSyncConfig)
}
```