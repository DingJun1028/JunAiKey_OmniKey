var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a, _b, _c;
""(__makeTemplateObject(["typescript\n// packages/@junai/sdk/src/knowledge.ts\n// Knowledge Client Module for SDK\n\nimport { ApiProxy } from './apiProxy';\nimport { KnowledgeRecord, KnowledgeCollection } from '../../../src/interfaces'; // Import interfaces from main project\n\nexport class KnowledgeClient {\n  private apiProxy: ApiProxy;\n\n  constructor(apiProxy: ApiProxy) {\n    this.apiProxy = apiProxy;\n  }\n\n  /**\n   * Creates a new knowledge record.\n   * @param recordDetails The details of the record (without id, timestamp). Must include userId.\n   * @returns Promise<KnowledgeRecord> The created record.\n   */\n  async create(recordDetails: Omit<KnowledgeRecord, 'id' | 'timestamp'>): Promise<KnowledgeRecord> {\n    // This assumes your API Gateway has an endpoint like POST /api/v1/knowledge\n    // that delegates to the KnowledgeAgent/MemoryEngine.\n    // If calling directly to Supabase, use the Supabase client instead.\n    // Let's assume the SDK calls the custom API Gateway if configured, otherwise Supabase.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi('/api/v1/knowledge', 'POST', recordDetails);\n        return result as KnowledgeRecord; // Assuming API returns the created record\n    } else {\n        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n             throw new Error('Supabase client not available in ApiProxy.');\n        }\n        const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').insert([recordDetails]).select().single();\n        if (error) throw error;\n        return data as KnowledgeRecord;\n    }\n  }\n\n  /**\n   * Retrieves knowledge records.\n   * @param userId The user ID. Required.\n   * @param options Optional filters (e.g., source, tags, isStarred, limit).\n   * @returns Promise<KnowledgeRecord[]> An array of results.\n   */\n  async list(userId: string, options?: { source?: string, tags?: string[], isStarred?: boolean, limit?: number }): Promise<KnowledgeRecord[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge?userId=...&source=...\n     // that delegates to the KnowledgeAgent/MemoryEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/knowledge', 'GET', undefined, { params: { userId, ...options } });\n         return result as KnowledgeRecord[]; // Assuming API returns an array of records\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query with filters\n         let query = this.apiProxy['supabaseClient'].from('knowledge_records').select('*').eq('user_id', userId);\n         if (options?.source) {\n             query = query.eq('source', options.source);\n         }\n         if (options?.tags && options.tags.length > 0) {\n             query = query.overlaps('tags', options.tags);\n         }\n         if (options?.isStarred !== undefined) {\n             query = query.eq('is_starred', options.isStarred);\n         }\n         if (options?.limit) {\n             query = query.limit(options.limit);\n         }\n         const { data, error } = await query;\n         if (error) throw error;\n         return data as KnowledgeRecord[];\n     }\n  }\n\n\n  /**\n   * Searches knowledge records.\n   * @param query The search query.\n   * @param options Search options (e.g., useSemanticSearch).\n   * @returns Promise<KnowledgeRecord[]> An array of results.\n   */\n  async search(query: string, options?: { useSemanticSearch?: boolean }): Promise<KnowledgeRecord[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge?query=...\n     // or POST /api/v1/knowledge/search with query/options in body.\n     // Let's assume POST /api/v1/knowledge/search for flexibility.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/knowledge/search', 'POST', { query, ...options });\n         return result as KnowledgeRecord[]; // Assuming API returns an array of records\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase search requires FTS or vector search setup.\n         // For MVP fallback, just do a simple filter or basic text search if available.\n         // A real SDK would need more sophisticated direct DB interaction or rely on the API.\n         // Let's simulate a basic filter for MVP fallback.\n         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated basic Supabase search.');\n         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').select('*').ilike('question', "], ["typescript\n// packages/@junai/sdk/src/knowledge.ts\n// Knowledge Client Module for SDK\n\nimport { ApiProxy } from './apiProxy';\nimport { KnowledgeRecord, KnowledgeCollection } from '../../../src/interfaces'; // Import interfaces from main project\n\nexport class KnowledgeClient {\n  private apiProxy: ApiProxy;\n\n  constructor(apiProxy: ApiProxy) {\n    this.apiProxy = apiProxy;\n  }\n\n  /**\n   * Creates a new knowledge record.\n   * @param recordDetails The details of the record (without id, timestamp). Must include userId.\n   * @returns Promise<KnowledgeRecord> The created record.\n   */\n  async create(recordDetails: Omit<KnowledgeRecord, 'id' | 'timestamp'>): Promise<KnowledgeRecord> {\n    // This assumes your API Gateway has an endpoint like POST /api/v1/knowledge\n    // that delegates to the KnowledgeAgent/MemoryEngine.\n    // If calling directly to Supabase, use the Supabase client instead.\n    // Let's assume the SDK calls the custom API Gateway if configured, otherwise Supabase.\n\n    if (this.apiProxy.getApiEndpoint()) {\n        // Call custom API Gateway\n        const result = await this.apiProxy.callApi('/api/v1/knowledge', 'POST', recordDetails);\n        return result as KnowledgeRecord; // Assuming API returns the created record\n    } else {\n        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n             throw new Error('Supabase client not available in ApiProxy.');\n        }\n        const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').insert([recordDetails]).select().single();\n        if (error) throw error;\n        return data as KnowledgeRecord;\n    }\n  }\n\n  /**\n   * Retrieves knowledge records.\n   * @param userId The user ID. Required.\n   * @param options Optional filters (e.g., source, tags, isStarred, limit).\n   * @returns Promise<KnowledgeRecord[]> An array of results.\n   */\n  async list(userId: string, options?: { source?: string, tags?: string[], isStarred?: boolean, limit?: number }): Promise<KnowledgeRecord[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge?userId=...&source=...\n     // that delegates to the KnowledgeAgent/MemoryEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/knowledge', 'GET', undefined, { params: { userId, ...options } });\n         return result as KnowledgeRecord[]; // Assuming API returns an array of records\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query with filters\n         let query = this.apiProxy['supabaseClient'].from('knowledge_records').select('*').eq('user_id', userId);\n         if (options?.source) {\n             query = query.eq('source', options.source);\n         }\n         if (options?.tags && options.tags.length > 0) {\n             query = query.overlaps('tags', options.tags);\n         }\n         if (options?.isStarred !== undefined) {\n             query = query.eq('is_starred', options.isStarred);\n         }\n         if (options?.limit) {\n             query = query.limit(options.limit);\n         }\n         const { data, error } = await query;\n         if (error) throw error;\n         return data as KnowledgeRecord[];\n     }\n  }\n\n\n  /**\n   * Searches knowledge records.\n   * @param query The search query.\n   * @param options Search options (e.g., useSemanticSearch).\n   * @returns Promise<KnowledgeRecord[]> An array of results.\n   */\n  async search(query: string, options?: { useSemanticSearch?: boolean }): Promise<KnowledgeRecord[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge?query=...\n     // or POST /api/v1/knowledge/search with query/options in body.\n     // Let's assume POST /api/v1/knowledge/search for flexibility.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/knowledge/search', 'POST', { query, ...options });\n         return result as KnowledgeRecord[]; // Assuming API returns an array of records\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase search requires FTS or vector search setup.\n         // For MVP fallback, just do a simple filter or basic text search if available.\n         // A real SDK would need more sophisticated direct DB interaction or rely on the API.\n         // Let's simulate a basic filter for MVP fallback.\n         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated basic Supabase search.');\n         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').select('*').ilike('question', "])) % $;
{
    query;
}
 % "); // Simple ilike search\n         if (error) throw error;\n         return data as KnowledgeRecord[];\n     }\n  }\n\n  /**\n   * Gets a knowledge record by ID.\n   * @param recordId The ID of the record.\n   * @returns Promise<KnowledgeRecord | undefined> The record or undefined if not found.\n   */\n  async getById(recordId: string): Promise<KnowledgeRecord | undefined> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge/:recordId\n     // that delegates to the KnowledgeAgent/MemoryEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi(" / api / v1 / knowledge / $;
{
    recordId;
}
", 'GET');\n             return result as KnowledgeRecord; // Assuming API returns the record\n         } catch (error: any) {\n             if (error.response?.status === 404) return undefined; // Not found\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase fetch by ID (RLS should enforce ownership)\n         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').select('*').eq('id', recordId).single();\n         if (error) {\n             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)\n             throw error;\n         }\n         return data as KnowledgeRecord;\n     }\n  }\n\n  /**\n   * Updates a knowledge record.\n   * @param recordId The ID of the record.\n   * @param updates The updates to apply.\n   * @returns Promise<KnowledgeRecord | undefined> The updated record or undefined if not found.\n   */\n  async update(recordId: string, updates: Partial<Omit<KnowledgeRecord, 'id' | 'timestamp' | 'user_id'>>): Promise<KnowledgeRecord | undefined> {\n     // This assumes your API Gateway has an endpoint like PUT /api/v1/knowledge/:recordId\n     // that delegates to the KnowledgeAgent/MemoryEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi(" / api / v1 / knowledge / $;
{
    recordId;
}
", 'PUT', updates);\n             return result as KnowledgeRecord; // Assuming API returns the updated record\n         } catch (error: any) {\n             if (error.response?.status === 404) return undefined; // Not found\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase update by ID (RLS should enforce ownership)\n         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').update(updates).eq('id', recordId).select().single();\n         if (error) {\n             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)\n             throw error;\n         }\n         return data as KnowledgeRecord;\n     }\n  }\n\n  /**\n   * Deletes a knowledge record.\n   * @param recordId The ID of the record.\n   * @returns Promise<boolean> True if deletion was successful.\n   */\n  async delete(recordId: string): Promise<boolean> {\n     // This assumes your API Gateway has an endpoint like DELETE /api/v1/knowledge/:recordId\n     // that delegates to the KnowledgeAgent/MemoryEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi(" / api / v1 / knowledge / $;
{
    recordId;
}
", 'DELETE');\n             return result?.success === true; // Assuming API returns { success: true } on success\n         } catch (error: any) {\n             // Assume 404 means not found/already deleted, other errors are failures\n             if (error.response?.status === 404) return false;\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase delete by ID (RLS should enforce ownership)\n         const { count, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').delete().eq('id', recordId).select('id', { count: 'exact' });\n         if (error) throw error;\n         return count !== null && count > 0;\n     }\n  }\n\n  /**\n   * Lists knowledge collections for a user.\n   * @param userId The user ID. Required.\n   * @returns Promise<KnowledgeCollection[]> An array of collections.\n   */\n  async listCollections(userId: string): Promise<KnowledgeCollection[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge/collections?userId=...\n     // that delegates to the KnowledgeAgent/MemoryEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi('/api/v1/knowledge/collections', 'GET', undefined, { params: { userId } });\n         return result as KnowledgeCollection[]; // Assuming API returns an array of collections\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase query for collections\n         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_collections').select('*').eq('user_id', userId);\n         if (error) throw error;\n         return data as KnowledgeCollection[];\n     }\n  }\n\n  /**\n   * Gets a knowledge collection by ID.\n   * @param collectionId The ID of the collection.\n   * @param userId The user ID. Required.\n   * @returns Promise<KnowledgeCollection | undefined> The collection or undefined if not found.\n   */\n  async getCollectionById(collectionId: string, userId: string): Promise<KnowledgeCollection | undefined> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge/collections/:collectionId?userId=...\n     // that delegates to the KnowledgeAgent/MemoryEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         try {\n             const result = await this.apiProxy.callApi(" / api / v1 / knowledge / collections / $;
{
    collectionId;
}
", 'GET', undefined, { params: { userId } });\n             return result as KnowledgeCollection; // Assuming API returns the collection\n         } catch (error: any) {\n             if (error.response?.status === 404) return undefined; // Not found\n             throw error; // Re-throw other errors\n         }\n     } else {\n         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)\n         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)\n              throw new Error('Supabase client not available in ApiProxy.');\n         }\n         // Direct Supabase fetch by ID (RLS should enforce ownership)\n         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_collections').select('*').eq('id', collectionId).eq('user_id', userId).single();\n         if (error) {\n             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)\n             throw error;\n         }\n         return data as KnowledgeCollection;\n     }\n  }\n\n  /**\n   * Gets records within a knowledge collection.\n   * @param collectionId The ID of the collection.\n   * @param userId The user ID. Required.\n   * @returns Promise<KnowledgeRecord[]> An array of records in the collection.\n   */\n  async getRecordsInCollection(collectionId: string, userId: string): Promise<KnowledgeRecord[]> {\n     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge/collections/:collectionId/records?userId=...\n     // that delegates to the KnowledgeAgent/MemoryEngine.\n\n     if (this.apiProxy.getApiEndpoint()) {\n         // Call custom API Gateway\n         const result = await this.apiProxy.callApi(" / api / v1 / knowledge / collections / $;
{
    collectionId;
}
/records`, 'GET', undefined, { params: { userId };
;
return result; // Assuming API returns an array of records
{
    // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
    if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
        throw new Error('Supabase client not available in ApiProxy.');
    }
    // Direct Supabase query using the join table (RLS should enforce ownership)
    var _d = await this.apiProxy['supabaseClient']
        .from('knowledge_collection_records')
        .select('record_id, knowledge_records(*)') // Select the record ID and join the full record
        .eq('collection_id', collectionId)
        .eq('user_id', userId), data_1 = _d.data, error_1 = _d.error; // RLS on join table enforces ownership
    if (error_1)
        throw error_1;
    // Map the result to an array of KnowledgeRecord
    return data_1.map(function (item) { return item.knowledge_records; });
}
/**
 * Adds a record to a knowledge collection.
 * @param collectionId The ID of the collection.
 * @param recordId The ID of the record to add.
 * @param userId The user ID. Required.
 * @returns Promise<any> The created join table entry or null if already exists.
 */
async;
addRecordToCollection(collectionId, string, recordId, string, userId, string);
Promise < any > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    var result = await this.apiProxy.callApi("/api/v1/knowledge/collections/".concat(collectionId, "/records"), 'POST', { recordId: recordId, userId: userId });
    return result; // Assuming API returns the created join entry or null/error
}
{
    // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
    if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
        throw new Error('Supabase client not available in ApiProxy.');
    }
    // Direct Supabase insert into the join table (RLS should enforce ownership)
    // Handle duplicate key error if the record is already in the collection
    var _e = await this.apiProxy['supabaseClient'].from('knowledge_collection_records').insert([{ collection_id: collectionId, record_id: recordId, user_id: userId }]).select().single(), data_2 = _e.data, error_2 = _e.error;
    if (error_2) {
        if (error_2.code === '23505') { // PostgreSQL unique_violation error code
            console.warn("SDK: Record ".concat(recordId, " is already in collection ").concat(collectionId, "."));
            return null; // Return null for duplicate
        }
        throw error_2; // Re-throw other errors
    }
    return data_2;
}
/**
 * Removes a record from a knowledge collection.
 * @param collectionId The ID of the collection.
 * @param recordId The ID of the record to remove.
 * @param userId The user ID. Required.
 * @returns Promise<boolean> True if removal was successful.
 */
async;
removeRecordFromCollection(collectionId, string, recordId, string, userId, string);
Promise < boolean > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/knowledge/collections/".concat(collectionId, "/records/").concat(recordId), 'DELETE', undefined, { params: { userId: userId } });
        return (result === null || result === void 0 ? void 0 : result.success) === true; // Assuming API returns { success: true } on success
    }
    catch (error) {
        // Assume 404 means not found/already removed, other errors are failures
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404)
            return false;
        throw error; // Re-throw other errors
    }
}
{
    // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
    if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
        throw new Error('Supabase client not available in ApiProxy.');
    }
    // Direct Supabase delete from the join table (RLS should enforce ownership)
    var _f = await this.apiProxy['supabaseClient']
        .from('knowledge_collection_records')
        .delete()
        .eq('collection_id', collectionId)
        .eq('record_id', recordId)
        .eq('user_id', userId) // RLS on join table enforces ownership
        .select('record_id', { count: 'exact' }), count = _f.count, error_3 = _f.error; // Select count to check if a row was deleted
    if (error_3)
        throw error_3;
    return count !== null && count > 0;
}
/**
* Creates a new knowledge collection.
* @param name The name of the collection.
* @param userId The user ID. Required.
* @param description Optional description.
* @returns Promise<KnowledgeCollection> The created collection.
*/
async;
createCollection(name, string, userId, string, description ?  : string);
Promise < KnowledgeCollection | null > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    var result = await this.apiProxy.callApi('/api/v1/knowledge/collections', 'POST', { name: name, userId: userId, description: description });
    return result; // Assuming API returns the created collection
}
{
    // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
    if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
        throw new Error('Supabase client not available in ApiProxy.');
    }
    var _g = await this.apiProxy['supabaseClient'].from('knowledge_collections').insert([{ name: name, user_id: userId, description: description }]).select().single(), data_3 = _g.data, error_4 = _g.error;
    if (error_4)
        throw error_4;
    return data_3;
}
/**
* Updates a knowledge collection.
* @param collectionId The ID of the collection.
* @param updates The updates to apply.
* @returns Promise<KnowledgeCollection | undefined> The updated collection or undefined if not found.
*/
async;
updateCollection(collectionId, string, updates, (Partial));
Promise < KnowledgeCollection | undefined > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/knowledge/collections/".concat(collectionId), 'PUT', updates);
        return result; // Assuming API returns the updated collection
    }
    catch (error) {
        if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === 404)
            return undefined; // Not found
        throw error; // Re-throw other errors
    }
}
{
    // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
    if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
        throw new Error('Supabase client not available in ApiProxy.');
    }
    // Direct Supabase update by ID (RLS should enforce ownership)
    var _h = await this.apiProxy['supabaseClient'].from('knowledge_collections').update(updates).eq('id', collectionId).select().single(), data_4 = _h.data, error_5 = _h.error;
    if (error_5) {
        if (error_5.code === 'PGRST116')
            return undefined; // Not found (or not owned)
        throw error_5;
    }
    return data_4;
}
/**
 * Deletes a knowledge collection.
 * @param collectionId The ID of the collection.
 * @returns Promise<boolean> True if deletion was successful.
 */
async;
deleteCollection(collectionId, string);
Promise < boolean > {
    : .apiProxy.getApiEndpoint()
};
{
    // Call custom API Gateway
    try {
        var result = await this.apiProxy.callApi("/api/v1/knowledge/collections/".concat(collectionId), 'DELETE');
        return (result === null || result === void 0 ? void 0 : result.success) === true; // Assuming API returns { success: true } on success
    }
    catch (error) {
        // Assume 404 means not found/already deleted, other errors are failures
        if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 404)
            return false;
        throw error; // Re-throw other errors
    }
}
{
    // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
    if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
        throw new Error('Supabase client not available in ApiProxy.');
    }
    // Direct Supabase delete by ID (RLS should enforce ownership)
    var _j = await this.apiProxy['supabaseClient'].from('knowledge_collections').delete().eq('id', collectionId).select('id', { count: 'exact' }), count = _j.count, error_6 = _j.error;
    if (error_6)
        throw error_6;
    return count !== null && count > 0;
}
""(__makeTemplateObject([""], [""]));
