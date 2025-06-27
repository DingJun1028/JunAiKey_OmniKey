```typescript
// packages/@junai/sdk/src/runes.ts
// Rune Client Module for SDK
// Provides methods to interact with Runes via the API Gateway.

import { ApiProxy } from './apiProxy';
import { Rune } from '../../../src/interfaces'; // Import interface from main project

export class RuneClient {
  private apiProxy: ApiProxy;

  constructor(apiProxy: ApiProxy) {
    this.apiProxy = apiProxy;
  }

  /**
   * Lists available public runes.
   * @returns Promise<Rune[]> An array of public rune definitions.
   */
  async listPublic(): Promise<Rune[]> {
    // This assumes your API Gateway has an endpoint like GET /api/v1/runes/public
    // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.

    if (this.apiProxy.getApiEndpoint()) {
        // Call custom API Gateway
        const result = await this.apiProxy.callApi('/api/v1/runes/public', 'GET');
        return result as Rune[]; // Assuming API returns an array of runes
    } else {
        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
             throw new Error('Supabase client not available in ApiProxy.');
        }
        // Direct Supabase query for public runes
        const { data, error } = await this.apiProxy['supabaseClient'].from('runes').select('*').eq('is_public', true);
        if (error) throw error;
        return data as Rune[];
    }
  }

  /**
   * Lists runes installed by a user (private runes).
   * @param userId The user ID. Required.
   * @returns Promise<Rune[]> An array of user-owned rune definitions.
   */
  async listUserRunes(userId: string): Promise<Rune[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/runes/user?userId=...
     // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/runes/user', 'GET', undefined, { params: { userId } });
         return result as Rune[]; // Assuming API returns an array of runes
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query for user-owned runes
         const { data, error } = await this.apiProxy['supabaseClient'].from('runes').select('*').eq('user_id', userId).eq('is_public', false);
         if (error) throw error;
         return data as Rune[];
     }
  }

  /**
   * Gets a rune definition by ID (public or user-owned).
   * @param runeId The ID of the rune.
   * @param userId The user ID. Required.
   * @returns Promise<Rune | undefined> The rune or undefined if not found or not accessible.
   */
  async getById(runeId: string, userId: string): Promise<Rune | undefined> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/runes/:runeId?userId=...
     // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/runes/${runeId}`, 'GET', undefined, { params: { userId } });
             return result as Rune; // Assuming API returns the rune
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase fetch by ID (RLS should enforce ownership or public status)
         const { data, error } = await this.apiProxy['supabaseClient'].from('runes').select('*').eq('id', runeId).or(`user_id.eq.${userId},is_public.eq.true`).single();
         if (error) {
             if (error.code === 'PGRST116') return undefined; // Not found (or not owned/public)
             throw error;
         }
         return data as Rune;
     }
  }


  /**
   * Executes a specific action on a rune.
   * @param runeId The ID of the rune.
   * @param actionName The name of the action/method to execute.
   * @param params Optional parameters for the action.
   * @returns Promise<any> The result of the rune action execution.
   */
  async executeAction(runeId: string, actionName: string, params?: any): Promise<any> {
    // This assumes your API Gateway has an endpoint like POST /api/v1/runes/:runeId/:action
    // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.

    if (this.apiProxy.getApiEndpoint()) {
        // Call custom API Gateway
        const result = await this.apiProxy.callApi(`/api/v1/runes/${runeId}/${actionName}`, 'POST', params);
        return result; // Assuming API returns the action result
    } else {
        // Fallback is not possible here as rune execution requires the actual rune implementation
        // which is not part of the SDK. The SDK must call the API Gateway for execution.
        throw new Error('Custom API endpoint is not configured. Cannot execute rune actions via SDK.');
    }
  }

  /**
   * Installs a public rune for a user.
   * @param publicRuneId The ID of the public rune.
   * @param userId The user ID. Required.
   * @returns Promise<Rune | null> The newly created user-specific rune or null if installation failed.
   */
  async install(publicRuneId: string, userId: string): Promise<Rune | null> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/runes/:publicRuneId/install
     // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi(`/api/v1/runes/${publicRuneId}/install`, 'POST', { userId });
         return result as Rune; // Assuming API returns the created user rune
     } else {
         // Fallback is not possible here as it involves backend logic (capacity check, DB insert).
         console.warn('SDK: Custom API endpoint not configured. Cannot install rune via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot install rune via SDK.');
     }
  }

  /**
   * Uninstalls a user-specific rune.
   * @param userRuneId The ID of the user's rune.
   * @param userId The user ID. Required.
   * @returns Promise<boolean> True if uninstallation was successful.
   */
  async uninstall(userRuneId: string, userId: string): Promise<boolean> {
     // This assumes your API Gateway has an endpoint like DELETE /api/v1/runes/:userRuneId/uninstall
     // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/runes/${userRuneId}/uninstall`, 'DELETE', undefined, { params: { userId } });
             return result?.success === true; // Assuming API returns { success: true } on success
         } catch (error: any) {
             // Assume 404 means not found/already uninstalled, other errors are failures
             if (error.response?.status === 404) return false;
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback is not possible here.
         console.warn('SDK: Custom API endpoint not configured. Cannot uninstall rune via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot uninstall rune via SDK.');
     }
  }

  /**
   * Updates the configuration of a user-specific rune.
   * @param userRuneId The ID of the user's rune.
   * @param newConfig The new configuration object.
   * @param userId The user ID. Required.
   * @returns Promise<Rune | undefined> The updated rune or undefined if not found.
   */
  async updateConfig(userRuneId: string, newConfig: any, userId: string): Promise<Rune | undefined> {
     // This assumes your API Gateway has an endpoint like PUT /api/v1/runes/:userRuneId/config
     // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/runes/${userRuneId}/config`, 'PUT', { newConfig, userId });
             return result as Rune; // Assuming API returns the updated rune
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly is complex (requires RLS on user-owned runes).
         // Rely on the API Gateway for this.
         console.warn('SDK: Custom API endpoint not configured. Cannot update rune config via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot update rune config via SDK.');
     }
  }

  /**
   * Gets the rune capacity status for a user.
   * @param userId The user ID. Required.
   * @returns Promise<{ currentCost: number, capacity: number } | null> The capacity status or null on failure.
   */
  async getUserCapacity(userId: string): Promise<{ currentCost: number, capacity: number } | null> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/runes/capacity?userId=...
     // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/runes/capacity', 'GET', undefined, { params: { userId } });
         return result as { currentCost: number, capacity: number }; // Assuming API returns the capacity object
     } else {
         // Fallback to calling Supabase directly is complex (requires joining profiles and runes tables).
         // Rely on the API Gateway for this.
         console.warn('SDK: Custom API endpoint not configured. Cannot get rune capacity via SDK.');
         throw new Error('Custom API endpoint is not configured. Cannot get rune capacity via SDK.');
     }
  }

}
```