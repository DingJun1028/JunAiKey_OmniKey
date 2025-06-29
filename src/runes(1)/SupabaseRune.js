var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/runes/SupabaseRune.ts\n// Supabase\u4EE3\u7406 (Supabase Rune) - Placeholder\n// Provides methods to interact with the Supabase client via the ApiProxy or directly.\n// This Rune is an example of an 'api-adapter' type Rune.\n\nimport { SystemContext, Rune } from '../interfaces';\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n// import { LoggingService } from '../core/logging/LoggingService'; // Access via context\nimport { SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient\n\n\n/**\n * Implements the Supabase Rune, allowing interaction with the Supabase API.\n * This is an example of an 'api-adapter' type Rune.\n */\nexport class SupabaseRune {\n    private context: SystemContext;\n    private rune: Rune; // Reference to the Rune definition\n    private supabase: SupabaseClient; // Direct access to Supabase client\n\n    constructor(context: SystemContext, rune: Rune) {\n        this.context = context;\n        this.rune = rune;\n        // Get Supabase client from context (initialized by SecurityService)\n        this.supabase = context.securityService?.supabase;\n\n        if (!this.supabase) {\n             console.error('[Rune] SupabaseRune requires Supabase client to be initialized.');\n             this.context.loggingService?.logError("], ["typescript\n// src/runes/SupabaseRune.ts\n// Supabase\\u4ee3\\u7406 (Supabase Rune) - Placeholder\n// Provides methods to interact with the Supabase client via the ApiProxy or directly.\n// This Rune is an example of an 'api-adapter' type Rune.\n\nimport { SystemContext, Rune } from '../interfaces';\n// import { ApiProxy } from '../proxies/apiProxy'; // Access via context\n// import { LoggingService } from '../core/logging/LoggingService'; // Access via context\nimport { SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient\n\n\n/**\n * Implements the Supabase Rune, allowing interaction with the Supabase API.\n * This is an example of an 'api-adapter' type Rune.\n */\nexport class SupabaseRune {\n    private context: SystemContext;\n    private rune: Rune; // Reference to the Rune definition\n    private supabase: SupabaseClient; // Direct access to Supabase client\n\n    constructor(context: SystemContext, rune: Rune) {\n        this.context = context;\n        this.rune = rune;\n        // Get Supabase client from context (initialized by SecurityService)\n        this.supabase = context.securityService?.supabase;\n\n        if (!this.supabase) {\n             console.error('[Rune] SupabaseRune requires Supabase client to be initialized.');\n             this.context.loggingService?.logError("]));
SupabaseRune;
requires;
Supabase;
client(__makeTemplateObject([", { runeId: rune.id });\n             // Throwing here might prevent the rune from being registered, which is appropriate.\n             throw new Error('Supabase client is not available.');\n        }\n\n        console.log("], [", { runeId: rune.id });\n             // Throwing here might prevent the rune from being registered, which is appropriate.\n             throw new Error('Supabase client is not available.');\n        }\n\n        console.log("]))[Rune];
SupabaseRune;
initialized;
for ($; { rune: rune, : .name }.(__makeTemplateObject([");\n    }\n\n    /**\n     * Calls a Supabase RPC (Remote Procedure Call) function.\n     * Corresponds to the 'callRpc' method in the manifest.\n     * @param params Parameters: { functionName: string, params?: any, useServiceRole?: boolean }. Required.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The result from the RPC.\n     */\n    async callRpc(params: { functionName: string, params?: any, useServiceRole?: boolean }, userId: string): Promise<any> {\n        console.log("], [");\n    }\n\n    /**\n     * Calls a Supabase RPC (Remote Procedure Call) function.\n     * Corresponds to the 'callRpc' method in the manifest.\n     * @param params Parameters: { functionName: string, params?: any, useServiceRole?: boolean }. Required.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The result from the RPC.\n     */\n    async callRpc(params: { functionName: string, params?: any, useServiceRole?: boolean }, userId: string): Promise<any> {\n        console.log("]))[Rune]; $) {
    this.rune.name;
}
callRpc;
called;
by;
user;
$;
{
    userId;
}
with (params)
    : ", params);\n        this.context.loggingService?.logInfo(";
Executing;
rune;
action: $;
{
    this.rune.name;
}
callRpc(__makeTemplateObject([", { runeId: this.rune.id, userId, params: { functionName: params?.functionName } });\n\n        if (!params?.functionName) {\n            throw new Error('functionName is required for callRpc.');\n        }\n\n        try {\n            // Use the direct Supabase client for RPC calls\n            // Note: RLS applies to RPCs. Service Role Key bypasses RLS (use with caution).\n            // Access the service role key securely if useServiceRole is true\n            const headers: Record<string, string> = {};\n            if (params.useServiceRole) {\n                 const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;\n                 if (!serviceRoleKey) {\n                     throw new Error('Supabase Service Role Key is not configured.');\n                 }\n                 headers['Authorization'] = "], [", { runeId: this.rune.id, userId, params: { functionName: params?.functionName } });\n\n        if (!params?.functionName) {\n            throw new Error('functionName is required for callRpc.');\n        }\n\n        try {\n            // Use the direct Supabase client for RPC calls\n            // Note: RLS applies to RPCs. Service Role Key bypasses RLS (use with caution).\n            // Access the service role key securely if useServiceRole is true\n            const headers: Record<string, string> = {};\n            if (params.useServiceRole) {\n                 const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;\n                 if (!serviceRoleKey) {\n                     throw new Error('Supabase Service Role Key is not configured.');\n                 }\n                 headers['Authorization'] = "]));
Bearer;
$;
{
    serviceRoleKey;
}
";\n                 console.warn('[Rune] Using Supabase Service Role Key. Ensure this is only done in secure backend contexts.');\n            } else if (this.context.currentUser) {\n                 // If not using service role, ensure user JWT is included (handled by ApiProxy interceptor if using callSupabaseAPI)\n                 // When using the direct client, we need to ensure the session is set or pass the token.\n                 // The client instance from SecurityService should already have the session if logged in.\n            } else {\n                 // If not using service role and no user, RPC might fail based on RLS\n                 console.warn('[Rune] Calling Supabase RPC without user session or service role.');\n            }\n\n\n            const { data, error } = await this.supabase.rpc(params.functionName, params.params, { headers });\n\n\n            if (error) throw error;\n            console.log("[Rune];
$;
{
    this.rune.name;
}
callRpc;
result: ", data);\n            return { status: 'success', data: data };\n\n        } catch (error: any) {\n            console.error("[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
callRpc: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
callRpc(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
Supabase;
RPC;
call;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    /**\n     * Calls a Supabase REST API endpoint (e.g., for tables).\n     * Corresponds to the 'callRestApi' method in the manifest.\n     * @param params Parameters: { endpoint: string, method: string, data?: any, config?: any, useServiceRole?: boolean }. Required.\n     * @param userId The user ID executing the action. Required.\n     * @returns Promise<any> The result from the API call.\n     */\n    async callRestApi(params: { endpoint: string, method: string, data?: any, config?: any, useServiceRole?: boolean }, userId: string): Promise<any> {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
callRestApi;
called;
by;
user;
$;
{
    userId;
}
with (params)
    : ", params);\n        this.context.loggingService?.logInfo(";
Executing;
rune;
action: $;
{
    this.rune.name;
}
callRestApi(__makeTemplateObject([", { runeId: this.rune.id, userId, params: { endpoint: params?.endpoint, method: params?.method } });\n\n        if (!params?.endpoint || !params?.method) {\n            throw new Error('endpoint and method are required for callRestApi.');\n        }\n\n        try {\n            // Use ApiProxy to call the Supabase API endpoint\n            // ApiProxy handles authentication (user JWT) and rate limiting based on config.\n            // Need to handle Service Role Key usage carefully - ApiProxy interceptor needs to support this flag.\n            const result = await this.context.apiProxy?.callSupabaseAPI(params.endpoint, params.method as any, params.data, params.config, params.useServiceRole);\n\n            console.log("], [", { runeId: this.rune.id, userId, params: { endpoint: params?.endpoint, method: params?.method } });\n\n        if (!params?.endpoint || !params?.method) {\n            throw new Error('endpoint and method are required for callRestApi.');\n        }\n\n        try {\n            // Use ApiProxy to call the Supabase API endpoint\n            // ApiProxy handles authentication (user JWT) and rate limiting based on config.\n            // Need to handle Service Role Key usage carefully - ApiProxy interceptor needs to support this flag.\n            const result = await this.context.apiProxy?.callSupabaseAPI(params.endpoint, params.method as any, params.data, params.config, params.useServiceRole);\n\n            console.log("]))[Rune];
$;
{
    this.rune.name;
}
callRestApi;
result: ", result);\n            return { status: 'success', data: result };\n\n        } catch (error: any) {\n            console.error("[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
callRestApi: ", error);\n            this.context.loggingService?.logError(";
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
callRestApi(__makeTemplateObject([", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("], [", { runeId: this.rune.id, userId, error: error.message });\n            throw new Error("]));
Supabase;
REST;
API;
call;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    // TODO: Add methods for Storage, Auth, Realtime control via Rune\n\n    /**\n     * Method to update configuration (optional).\n     * @param config The new configuration object.\n     */\n    updateConfiguration(config: any): void {\n        console.log("[Rune];
$;
{
    this.rune.name;
}
configuration;
updated: ", config);\n        this.rune.configuration = config; // Update the configuration on the rune object\n        // TODO: Re-initialize any internal clients if configuration changes affect them\n    }\n}\n"(__makeTemplateObject([""], [""]));
n;
