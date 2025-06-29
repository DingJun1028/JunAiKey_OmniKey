```typescript
// src/agents/SupabaseAgent.ts
// Supabase\u4ee3\u7406 (Supabase Agent)
// Handles direct interactions with the Supabase client.
// Part of the Agent System Architecture.
// Design Principle: Encapsulates database access logic.

import { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types
import { SupabaseClient } from '@supabase/supabase-js'; // Import SupabaseClient


export class SupabaseAgent extends BaseAgent {
    private supabase: SupabaseClient;

    constructor(context: SystemContext) {
        super('supabase', context);
        // Get Supabase client from context (initialized by SecurityService)
        this.supabase = context.securityService?.supabase;

        if (!this.supabase) {
             console.error('[SupabaseAgent] Supabase client is not available in context.');
             // Handle error - maybe set agent status to unhealthy
        }
    }

    /**
     * Handles messages directed to the Supabase Agent.
     * Performs database operations using the Supabase client.
     * @param message The message to handle. Expected payload varies by type.
     * @returns Promise<AgentResponse> The response containing the DB operation result or error.
     */
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
        console.log(`[SupabaseAgent] Handling message: ${message.type} (Correlation ID: ${message.correlationId || 'N/A'})`);

        if (!this.supabase) {
             return { success: false, error: 'Supabase client is not initialized.' };
        }

        const userId = this.context.currentUser?.id;
        // Note: Some Supabase operations (like public reads or service role calls) might not require a logged-in user.
        // However, for most user data operations, userId is needed for RLS.
        // Let's add a check if the operation *requires* a user. For now, assume most do.
        // If an operation doesn't require a user, the RLS policy should allow it.

        try {
            let result: any;
            let error: any;

            switch (message.type) {
                case 'insert_record':
                    // Payload: { table: string, record: any }
                    if (!message.payload?.table || !message.payload?.record) {
                         throw new Error('Table and record are required for insert_record.');
                    }
                    // Ensure user_id is added to the record if not present and required by RLS
                    if (userId && !message.payload.record.user_id) {
                         message.payload.record.user_id = userId;
                    }
                    ({ data: result, error } = await this.supabase
                        .from(message.payload.table)
                        .insert([message.payload.record])
                        .select() // Select the inserted data
                        .single()); // Expecting a single record back
                    break;

                case 'query_records':
                    // Payload: { table: string, query?: any, select?: string, limit?: number, order?: { column: string, ascending: boolean } }
                    if (!message.payload?.table) {
                         throw new Error('Table is required for query_records.');
                    }
                    let query = this.supabase.from(message.payload.table).select(message.payload.select || '*');
                    if (message.payload.query) {
                        query = query.match(message.payload.query); // Apply match filter
                    }
                    // Add user_id filter if user is logged in and table has user_id (RLS should handle this, but explicit filter is safer)
                    // This is complex to do generically. Rely on RLS for filtering.
                    if (message.payload.limit !== undefined) {
                        query = query.limit(message.payload.limit);
                    }
                    if (message.payload.order) {
                        query = query.order(message.payload.order.column, { ascending: message.payload.order.ascending });
                    }
                    ({ data: result, error } = await query);
                    break;

                case 'update_record':
                    // Payload: { table: string, id: string, updates: any }
                    if (!message.payload?.table || !message.payload?.id || !message.payload?.updates) {
                         throw new Error('Table, id, and updates are required for update_record.');
                    }\
                    // RLS should ensure user can only update their own records.\
                    ({ data: result, error } = await this.supabase\
                        .from(message.payload.table)\
                        .update(message.payload.updates)\
                        .eq('id', message.payload.id)\
                        // Add user_id filter here explicitly for safety, even if RLS is on\
                        // .eq('user_id', userId) // This requires knowing the table has a user_id column\
                        .select() // Select the updated data\
                        .single()); // Expecting a single record back\
                    break;\
\
                case 'delete_record':\
                    // Payload: { table: string, id: string }\
                    if (!message.payload?.table || !message.payload?.id) {\
                         throw new Error('Table and id are required for delete_record.');\
                    }\
                    // RLS should ensure user can only delete their own records.\
                    ({ data: result, error } = await this.supabase\
                        .from(message.payload.table)\
                        .delete()\
                        .eq('id', message.payload.id)\
                         // Add user_id filter here explicitly for safety, even if RLS is on\
                        // .eq('user_id', userId) // This requires knowing the table has a user_id column\
                        .select('id') // Select ID to confirm deletion\
                        .single()); // Expecting a single record back\
                    break;\
\
                case 'call_rpc':\
                    // Payload: { functionName: string, params?: any, useServiceRole?: boolean }\
                    if (!message.payload?.functionName) {\
                         throw new Error('functionName is required for call_rpc.');\
                    }\
                     // Note: Handling useServiceRole securely requires context/permissions check\
                    // For MVP, we'll allow passing useServiceRole flag, but the SecurityService\
                    // should enforce that only authorized agents/contexts can use it.\
                    // The Supabase client instance from SecurityService might be configured\
                    // differently (e.g., anon vs authenticated vs service role).\
                    // Using the client from context means it's the authenticated user's client.\
                    // To use service role, we'd need a separate client instance or method.\
                    // Let's assume for MVP that the client from context is sufficient,\
                    // and RLS/RPC definitions handle permissions.\
                    ({ data: result, error } = await this.supabase.rpc(message.payload.functionName, message.payload.params));\
                    break;\
\
                // TODO: Add cases for other Supabase operations (storage, auth admin, etc.)\
                // case 'upload_file': // Payload: { bucket: string, path: string, file: File | Blob | ArrayBuffer }\
                // case 'delete_file': // Payload: { bucket: string, path: string }\
                // case 'list_files': // Payload: { bucket: string, path?: string }\
                // case 'delete_user': // Payload: { userId: string } (requires admin)\
\
                default:\
                    console.warn(`[SupabaseAgent] Unknown message type: ${message.type}`);\
                    return { success: false, error: `Unknown message type for SupabaseAgent: ${message.type}` };\
            }\
\
            if (error) {\
                console.error(`[SupabaseAgent] Supabase operation failed (${message.type}):`, error.message);\
                // TODO: Log error using LoggingService\
                return { success: false, error: error.message };\
            }\
\
            console.log(`[SupabaseAgent] Supabase operation successful (${message.type}).`);\
            return { success: true, data: result };\
\
        } catch (error: any) {\
            console.error(`[SupabaseAgent] Unexpected error handling message ${message.type}:`, error);\
            // TODO: Log error using LoggingService\
            return { success: false, error: error.message || 'An unexpected error occurred in SupabaseAgent.' };\
        }\
    }\
\
    // TODO: Implement methods to send messages to other agents if needed\
}\
```