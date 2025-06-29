"use strict";
`` `typescript
// src/runes/SupabaseRune.ts
// Supabase\u4ee3\u7406 (Supabase Rune) - Placeholder
// Provides methods to interact with the Supabase client via the ApiProxy or directly.
// This Rune is an example of an 'api-adapter' type Rune.

import { SystemContext, Rune } from '../interfaces';
// import { ApiProxy } from '../proxies/apiProxy'; // Access via context
// import { LoggingService } from '../core/logging/LoggingService'; // Access via context
import { SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient


/**
 * Implements the Supabase Rune, allowing interaction with the Supabase API.
 * This is an example of an 'api-adapter' type Rune.
 */
export class SupabaseRune {
    private context: SystemContext;
    private rune: Rune; // Reference to the Rune definition
    private supabase: SupabaseClient; // Direct access to Supabase client

    constructor(context: SystemContext, rune: Rune) {
        this.context = context;
        this.rune = rune;
        // Get Supabase client from context (initialized by SecurityService)
        this.supabase = context.securityService?.supabase;

        if (!this.supabase) {
             console.error('[Rune] SupabaseRune requires Supabase client to be initialized.');
             this.context.loggingService?.logError(`;
SupabaseRune;
requires;
Supabase;
client `, { runeId: rune.id });
             // Throwing here might prevent the rune from being registered, which is appropriate.
             throw new Error('Supabase client is not available.');
        }

        console.log(`[Rune];
SupabaseRune;
initialized;
for ($; { rune, : .name }. `);
    }

    /**
     * Calls a Supabase RPC (Remote Procedure Call) function.
     * Corresponds to the 'callRpc' method in the manifest.
     * @param params Parameters: { functionName: string, params?: any, useServiceRole?: boolean }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The result from the RPC.
     */
    async callRpc(params: { functionName: string, params?: any, useServiceRole?: boolean }, userId: string): Promise<any> {
        console.log(`[Rune]; $) {
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
    : `, params);
        this.context.loggingService?.logInfo(`;
Executing;
rune;
action: $;
{
    this.rune.name;
}
callRpc `, { runeId: this.rune.id, userId, params: { functionName: params?.functionName } });

        if (!params?.functionName) {
            throw new Error('functionName is required for callRpc.');
        }

        try {
            // Use the direct Supabase client for RPC calls
            // Note: RLS applies to RPCs. Service Role Key bypasses RLS (use with caution).
            // Access the service role key securely if useServiceRole is true
            const headers: Record<string, string> = {};
            if (params.useServiceRole) {
                 const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
                 if (!serviceRoleKey) {
                     throw new Error('Supabase Service Role Key is not configured.');
                 }
                 headers['Authorization'] = `;
Bearer;
$;
{
    serviceRoleKey;
}
`;
                 console.warn('[Rune] Using Supabase Service Role Key. Ensure this is only done in secure backend contexts.');
            } else if (this.context.currentUser) {
                 // If not using service role, ensure user JWT is included (handled by ApiProxy interceptor if using callSupabaseAPI)
                 // When using the direct client, we need to ensure the session is set or pass the token.
                 // The client instance from SecurityService should already have the session if logged in.
            } else {
                 // If not using service role and no user, RPC might fail based on RLS
                 console.warn('[Rune] Calling Supabase RPC without user session or service role.');
            }


            const { data, error } = await this.supabase.rpc(params.functionName, params.params, { headers });


            if (error) throw error;
            console.log(`[Rune];
$;
{
    this.rune.name;
}
callRpc;
result: `, data);
            return { status: 'success', data: data };

        } catch (error: any) {
            console.error(`[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
callRpc: `, error);
            this.context.loggingService?.logError(`;
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
callRpc `, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`;
Supabase;
RPC;
call;
failed: $;
{
    error.message;
}
`);
        }
    }

    /**
     * Calls a Supabase REST API endpoint (e.g., for tables).
     * Corresponds to the 'callRestApi' method in the manifest.
     * @param params Parameters: { endpoint: string, method: string, data?: any, config?: any, useServiceRole?: boolean }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The result from the API call.
     */
    async callRestApi(params: { endpoint: string, method: string, data?: any, config?: any, useServiceRole?: boolean }, userId: string): Promise<any> {
        console.log(`[Rune];
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
    : `, params);
        this.context.loggingService?.logInfo(`;
Executing;
rune;
action: $;
{
    this.rune.name;
}
callRestApi `, { runeId: this.rune.id, userId, params: { endpoint: params?.endpoint, method: params?.method } });

        if (!params?.endpoint || !params?.method) {
            throw new Error('endpoint and method are required for callRestApi.');
        }

        try {
            // Use ApiProxy to call the Supabase API endpoint
            // ApiProxy handles authentication (user JWT) and rate limiting based on config.
            // Need to handle Service Role Key usage carefully - ApiProxy interceptor needs to support this flag.
            const result = await this.context.apiProxy?.callSupabaseAPI(params.endpoint, params.method as any, params.data, params.config, params.useServiceRole);

            console.log(`[Rune];
$;
{
    this.rune.name;
}
callRestApi;
result: `, result);
            return { status: 'success', data: result };

        } catch (error: any) {
            console.error(`[Rune];
Error;
executing;
$;
{
    this.rune.name;
}
callRestApi: `, error);
            this.context.loggingService?.logError(`;
Error;
executing;
rune;
action: $;
{
    this.rune.name;
}
callRestApi `, { runeId: this.rune.id, userId, error: error.message });
            throw new Error(`;
Supabase;
REST;
API;
call;
failed: $;
{
    error.message;
}
`);
        }
    }

    // TODO: Add methods for Storage, Auth, Realtime control via Rune

    /**
     * Method to update configuration (optional).\n     * @param config The new configuration object.\n     */\n    updateConfiguration(config: any): void {\n        console.log(`[Rune];
$;
{
    this.rune.name;
}
configuration;
updated: `, config);\n        this.rune.configuration = config; // Update the configuration on the rune object\n        // TODO: Re-initialize any internal clients if configuration changes affect them\n    }\n}\n` ``;
n;
