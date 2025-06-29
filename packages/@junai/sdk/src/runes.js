var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a, _b;
""(__makeTemplateObject(["typescript\n// packages/@junai/sdk/src/runes.ts\n// Rune Client Module for SDK\n// Provides methods to interact with Runes via the API Gateway.\n\nimport { ApiProxy } from './apiProxy';\nimport { Rune } from '../../../src/interfaces'; // Import interface from main project\n\nexport class RuneClient {\n  private apiProxy: ApiProxy;\n\n  constructor(apiProxy: ApiProxy) {\n    this.apiProxy = apiProxy;\n  }\n\n  /**\n   * Lists available public runes.\n   * @returns Promise<Rune[]> An array of public rune definitions.\n   */\n  async listPublic(): Promise<Rune[]> {\n    // This assumes your API Gateway has an endpoint like GET /api/v1/runes/public\n    // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi('/api/v1/runes/public', 'GET');\n        return result as Rune[]; // Assuming API returns an array of runes\n    } else {\n        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n             throw new Error('Supabase client not available in ApiProxy.');\n        }\n        // Direct Supabase query for public runes\n        const { data, error } = await this.apiProxy['supabaseClient'].from('runes').select('*').eq('is_public', true);\n        if (error) throw error;\n        return data as Rune[];\n    }\n  }\n\n  /**\n   * Lists runes installed by a user (private runes).\n   * @param userId The user ID. Required.\n   * @returns Promise<Rune[]> An array of user-owned rune definitions.\n   */\n  async listUserRunes(userId: string): Promise<Rune[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/runes/user?userId=...\n     // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/runes/user', 'GET', undefined, { params: { userId } });\n         return result as Rune[]; // Assuming API returns an array of runes\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query for user-owned runes\n         const { data, error } = await this.apiProxy['supabaseClient'].from('runes').select('*').eq('user_id', userId).eq('is_public', false);\n         if (error) throw error;\n         return data as Rune[];\n     }\n  }\n\n  /**\n   * Gets a rune definition by ID (public or user-owned).\n   * @param runeId The ID of the rune.\n   * @param userId The user ID. Required.\n   * @returns Promise<Rune | undefined> The rune or undefined if not found or not accessible.\n   */\n  async getById(runeId: string, userId: string): Promise<Rune | undefined> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/runes/:runeId?userId=...\n     // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi("], ["typescript\n// packages/@junai/sdk/src/runes.ts\n// Rune Client Module for SDK\n// Provides methods to interact with Runes via the API Gateway.\n\nimport { ApiProxy } from './apiProxy';\nimport { Rune } from '../../../src/interfaces'; // Import interface from main project\n\nexport class RuneClient {\n  private apiProxy: ApiProxy;\n\n  constructor(apiProxy: ApiProxy) {\n    this.apiProxy = apiProxy;\n  }\n\n  /**\n   * Lists available public runes.\n   * @returns Promise<Rune[]> An array of public rune definitions.\n   */\n  async listPublic(): Promise<Rune[]> {\n    // This assumes your API Gateway has an endpoint like GET /api/v1/runes/public\n    // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi('/api/v1/runes/public', 'GET');\n        return result as Rune[]; // Assuming API returns an array of runes\n    } else {\n        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n             throw new Error('Supabase client not available in ApiProxy.');\n        }\n        // Direct Supabase query for public runes\n        const { data, error } = await this.apiProxy['supabaseClient'].from('runes').select('*').eq('is_public', true);\n        if (error) throw error;\n        return data as Rune[];\n    }\n  }\n\n  /**\n   * Lists runes installed by a user (private runes).\n   * @param userId The user ID. Required.\n   * @returns Promise<Rune[]> An array of user-owned rune definitions.\n   */\n  async listUserRunes(userId: string): Promise<Rune[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/runes/user?userId=...\n     // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/runes/user', 'GET', undefined, { params: { userId } });\n         return result as Rune[]; // Assuming API returns an array of runes\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query for user-owned runes\n         const { data, error } = await this.apiProxy['supabaseClient'].from('runes').select('*').eq('user_id', userId).eq('is_public', false);\n         if (error) throw error;\n         return data as Rune[];\n     }\n  }\n\n  /**\n   * Gets a rune definition by ID (public or user-owned).\n   * @param runeId The ID of the rune.\n   * @param userId The user ID. Required.\n   * @returns Promise<Rune | undefined> The rune or undefined if not found or not accessible.\n   */\n  async getById(runeId: string, userId: string): Promise<Rune | undefined> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/runes/:runeId?userId=...\n     // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi("])) / api / v1 / runes / $;
{
    runeId;
}
", 'GET', undefined, { params: { userId } });\n             return result as Rune; // Assuming API returns the rune\n         } catch (error: any) {\n             if (error.response?.status === 404) return undefined; // Not found\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase fetch by ID (RLS should enforce ownership or public status)\n         const { data, error } = await this.apiProxy['supabaseClient'].from('runes').select('*').eq('id', runeId).or(";
user_id.eq.$;
{
    userId;
}
is_public.eq.true(__makeTemplateObject([").single();\n         if (error) {\n             if (error.code === 'PGRST116') return undefined; // Not found (or not owned/public)\n             throw error;\n         }\n         return data as Rune;\n     }\n  }\n\n\n  /**\n   * Executes a specific action on a rune.\n   * @param runeId The ID of the rune.\n   * @param actionName The name of the action/method to execute.\n   * @param params Optional parameters for the action.\n   * @returns Promise<any> The result of the rune action execution.\n   */\n  async executeAction(runeId: string, actionName: string, params?: any): Promise<any> {\n    // This assumes your API Gateway has an endpoint like POST /api/v1/runes/:runeId/:action\n    // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi("], [").single();\n         if (error) {\n             if (error.code === 'PGRST116') return undefined; // Not found (or not owned/public)\n             throw error;\n         }\n         return data as Rune;\n     }\n  }\n\n\n  /**\n   * Executes a specific action on a rune.\n   * @param runeId The ID of the rune.\n   * @param actionName The name of the action/method to execute.\n   * @param params Optional parameters for the action.\n   * @returns Promise<any> The result of the rune action execution.\n   */\n  async executeAction(runeId: string, actionName: string, params?: any): Promise<any> {\n    // This assumes your API Gateway has an endpoint like POST /api/v1/runes/:runeId/:action\n    // that delegates to the RuneEngraftingAgent/SacredRuneEngraver.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi("])) / api / v1 / runes / $;
{
    runeId;
}
/${actionName}`, 'POST', params;
;
return result; // Assuming API returns the action result
{
    // Fallback is not possible here as rune execution requires the actual rune implementation
    // which is not part of the SDK. The SDK must call the API Gateway for execution.
    throw new Error('Custom API endpoint is not configured. Cannot execute rune actions via SDK.');
}
/**
 * Installs a public rune for a user.
 * @param publicRuneId The ID of the public rune.
 * @param userId The user ID. Required.
 * @returns Promise<Rune | null> The newly created user-specific rune or null if installation failed.
 */
async;
install(publicRuneId, string, userId, string);
Promise < Rune | null > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    var result = await this.apiProxy.callApi("/api/v1/runes/".concat(publicRuneId, "/install"), 'POST', { userId: userId });
    return result; // Assuming API returns the created user rune
}
{
    // Fallback is not possible here as it involves backend logic (capacity check, DB insert).
    console.warn('SDK: Custom API endpoint not configured. Cannot install rune via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot install rune via SDK.');
}
/**
 * Uninstalls a user-specific rune.
 * @param userRuneId The ID of the user's rune.
 * @param userId The user ID. Required.
 * @returns Promise<boolean> True if uninstallation was successful.
 */
async;
uninstall(userRuneId, string, userId, string);
Promise < boolean > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/runes/".concat(userRuneId, "/uninstall"), 'DELETE', undefined, { params: { userId: userId } });
        return (result === null || result === void 0 ? void 0 : result.success) === true; // Assuming API returns { success: true } on success
    }
    catch (error) {
        // Assume 404 means not found/already uninstalled, other errors are failures
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404)
            return false;
        throw error; // Re-throw other errors
    }
}
{
    // Fallback is not possible here.
    console.warn('SDK: Custom API endpoint not configured. Cannot uninstall rune via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot uninstall rune via SDK.');
}
/**
 * Updates the configuration of a user-specific rune.
 * @param userRuneId The ID of the user's rune.
 * @param newConfig The new configuration object.
 * @param userId The user ID. Required.
 * @returns Promise<Rune | undefined> The updated rune or undefined if not found.
 */
async;
updateConfig(userRuneId, string, newConfig, any, userId, string);
Promise < Rune | undefined > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/runes/".concat(userRuneId, "/config"), 'PUT', { newConfig: newConfig, userId: userId });
        return result; // Assuming API returns the updated rune
    }
    catch (error) {
        if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 404)
            return undefined; // Not found
        throw error; // Re-throw other errors
    }
}
{
    // Fallback to calling Supabase directly is complex (requires RLS on user-owned runes).
    // Rely on the API Gateway for this.
    console.warn('SDK: Custom API endpoint not configured. Cannot update rune config via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot update rune config via SDK.');
}
/**
 * Gets the rune capacity status for a user.
 * @param userId The user ID. Required.
 * @returns Promise<{ currentCost: number, capacity: number } | null> The capacity status or null on failure.
 */
async;
getUserCapacity(userId, string);
Promise < { currentCost: number, capacity: number } | null > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    var result = await this.apiProxy.callApi('/api/v1/runes/capacity', 'GET', undefined, { params: { userId: userId } });
    return result; // Assuming API returns the capacity object
}
{
    // Fallback to calling Supabase directly is complex (requires joining profiles and runes tables).
    // Rely on the API Gateway for this.
    console.warn('SDK: Custom API endpoint not configured. Cannot get rune capacity via SDK.');
    throw new Error('Custom API endpoint is not configured. Cannot get rune capacity via SDK.');
}
""(__makeTemplateObject([""], [""]));
