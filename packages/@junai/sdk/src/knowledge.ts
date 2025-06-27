```typescript
// packages/@junai/sdk/src/knowledge.ts
// Knowledge Client Module for SDK

import { ApiProxy } from './apiProxy';
import { KnowledgeRecord, KnowledgeCollection } from '../../../src/interfaces'; // Import interfaces from main project

export class KnowledgeClient {
  private apiProxy: ApiProxy;

  constructor(apiProxy: ApiProxy) {
    this.apiProxy = apiProxy;
  }

  /**
   * Creates a new knowledge record.
   * @param recordDetails The details of the record (without id, timestamp). Must include userId.
   * @returns Promise<KnowledgeRecord> The created record.
   */
  async create(recordDetails: Omit<KnowledgeRecord, 'id' | 'timestamp'>): Promise<KnowledgeRecord> {
    // This assumes your API Gateway has an endpoint like POST /api/v1/knowledge
    // that delegates to the KnowledgeAgent/MemoryEngine.
    // If calling directly to Supabase, use the Supabase client instead.
    // Let's assume the SDK calls the custom API Gateway if configured, otherwise Supabase.

    if (this.apiProxy.getApiEndpoint()) {
        // Call custom API Gateway
        const result = await this.apiProxy.callApi('/api/v1/knowledge', 'POST', recordDetails);
        return result as KnowledgeRecord; // Assuming API returns the created record
    } else {
        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
             throw new Error('Supabase client not available in ApiProxy.');
        }
        const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').insert([recordDetails]).select().single();
        if (error) throw error;
        return data as KnowledgeRecord;
    }
  }

  /**
   * Retrieves knowledge records.
   * @param userId The user ID. Required.
   * @param options Optional filters (e.g., source, tags, isStarred, limit).
   * @returns Promise<KnowledgeRecord[]> An array of results.
   */
  async list(userId: string, options?: { source?: string, tags?: string[], isStarred?: boolean, limit?: number }): Promise<KnowledgeRecord[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge?userId=...&source=...
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/knowledge', 'GET', undefined, { params: { userId, ...options } });
         return result as KnowledgeRecord[]; // Assuming API returns an array of records
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query with filters
         let query = this.apiProxy['supabaseClient'].from('knowledge_records').select('*').eq('user_id', userId);
         if (options?.source) {
             query = query.eq('source', options.source);
         }
         if (options?.tags && options.tags.length > 0) {
             query = query.overlaps('tags', options.tags);
         }
         if (options?.isStarred !== undefined) {
             query = query.eq('is_starred', options.isStarred);
         }
         if (options?.limit) {
             query = query.limit(options.limit);
         }
         const { data, error } = await query;
         if (error) throw error;
         return data as KnowledgeRecord[];
     }
  }


  /**
   * Searches knowledge records.
   * @param query The search query.
   * @param options Search options (e.g., useSemanticSearch).
   * @returns Promise<KnowledgeRecord[]> An array of results.
   */
  async search(query: string, options?: { useSemanticSearch?: boolean }): Promise<KnowledgeRecord[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge?query=...
     // or POST /api/v1/knowledge/search with query/options in body.
     // Let's assume POST /api/v1/knowledge/search for flexibility.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/knowledge/search', 'POST', { query, ...options });
         return result as KnowledgeRecord[]; // Assuming API returns an array of records
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase search requires FTS or vector search setup.
         // For MVP fallback, just do a simple filter or basic text search if available.
         // A real SDK would need more sophisticated direct DB interaction or rely on the API.
         // Let's simulate a basic filter for MVP fallback.
         console.warn('SDK: Custom API endpoint not configured. Falling back to simulated basic Supabase search.');
         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').select('*').ilike('question', `%${query}%`); // Simple ilike search
         if (error) throw error;
         return data as KnowledgeRecord[];
     }
  }

  /**
   * Gets a knowledge record by ID.
   * @param recordId The ID of the record.
   * @returns Promise<KnowledgeRecord | undefined> The record or undefined if not found.
   */
  async getById(recordId: string): Promise<KnowledgeRecord | undefined> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge/:recordId
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/knowledge/${recordId}`, 'GET');
             return result as KnowledgeRecord; // Assuming API returns the record
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase fetch by ID (RLS should enforce ownership)
         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').select('*').eq('id', recordId).single();
         if (error) {
             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)
             throw error;
         }
         return data as KnowledgeRecord;
     }
  }

  /**
   * Updates a knowledge record.
   * @param recordId The ID of the record.
   * @param updates The updates to apply.
   * @returns Promise<KnowledgeRecord | undefined> The updated record or undefined if not found.
   */
  async update(recordId: string, updates: Partial<Omit<KnowledgeRecord, 'id' | 'timestamp' | 'user_id'>>): Promise<KnowledgeRecord | undefined> {
     // This assumes your API Gateway has an endpoint like PUT /api/v1/knowledge/:recordId
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/knowledge/${recordId}`, 'PUT', updates);
             return result as KnowledgeRecord; // Assuming API returns the updated record
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase update by ID (RLS should enforce ownership)
         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').update(updates).eq('id', recordId).select().single();
         if (error) {
             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)
             throw error;
         }
         return data as KnowledgeRecord;
     }
  }

  /**
   * Deletes a knowledge record.
   * @param recordId The ID of the record.
   * @returns Promise<boolean> True if deletion was successful.
   */
  async delete(recordId: string): Promise<boolean> {
     // This assumes your API Gateway has an endpoint like DELETE /api/v1/knowledge/:recordId
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/knowledge/${recordId}`, 'DELETE');
             return result?.success === true; // Assuming API returns { success: true } on success
         } catch (error: any) {
             // Assume 404 means not found/already deleted, other errors are failures
             if (error.response?.status === 404) return false;
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase delete by ID (RLS should enforce ownership)
         const { count, error } = await this.apiProxy['supabaseClient'].from('knowledge_records').delete().eq('id', recordId).select('id', { count: 'exact' });
         if (error) throw error;
         return count !== null && count > 0;
     }
  }

  /**
   * Lists knowledge collections for a user.
   * @param userId The user ID. Required.
   * @returns Promise<KnowledgeCollection[]> An array of collections.
   */
  async listCollections(userId: string): Promise<KnowledgeCollection[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge/collections?userId=...
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/knowledge/collections', 'GET', undefined, { params: { userId } });
         return result as KnowledgeCollection[]; // Assuming API returns an array of collections
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query for collections
         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_collections').select('*').eq('user_id', userId);
         if (error) throw error;
         return data as KnowledgeCollection[];
     }
  }

  /**
   * Gets a knowledge collection by ID.
   * @param collectionId The ID of the collection.
   * @param userId The user ID. Required.
   * @returns Promise<KnowledgeCollection | undefined> The collection or undefined if not found.
   */
  async getCollectionById(collectionId: string, userId: string): Promise<KnowledgeCollection | undefined> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge/collections/:collectionId?userId=...
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/knowledge/collections/${collectionId}`, 'GET', undefined, { params: { userId } });
             return result as KnowledgeCollection; // Assuming API returns the collection
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase fetch by ID (RLS should enforce ownership)
         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_collections').select('*').eq('id', collectionId).eq('user_id', userId).single();
         if (error) {
             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)
             throw error;
         }
         return data as KnowledgeCollection;
     }
  }

  /**
   * Gets records within a knowledge collection.
   * @param collectionId The ID of the collection.
   * @param userId The user ID. Required.
   * @returns Promise<KnowledgeRecord[]> An array of records in the collection.
   */
  async getRecordsInCollection(collectionId: string, userId: string): Promise<KnowledgeRecord[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/knowledge/collections/:collectionId/records?userId=...
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi(`/api/v1/knowledge/collections/${collectionId}/records`, 'GET', undefined, { params: { userId } });
         return result as KnowledgeRecord[]; // Assuming API returns an array of records
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query using the join table (RLS should enforce ownership)
         const { data, error } = await this.apiProxy['supabaseClient']
             .from('knowledge_collection_records')
             .select('record_id, knowledge_records(*)') // Select the record ID and join the full record
             .eq('collection_id', collectionId)
             .eq('user_id', userId); // RLS on join table enforces ownership

         if (error) throw error;

         // Map the result to an array of KnowledgeRecord
         return data.map((item: any) => item.knowledge_records) as KnowledgeRecord[];
     }
  }

  /**
   * Adds a record to a knowledge collection.
   * @param collectionId The ID of the collection.
   * @param recordId The ID of the record to add.
   * @param userId The user ID. Required.
   * @returns Promise<any> The created join table entry or null if already exists.
   */
  async addRecordToCollection(collectionId: string, recordId: string, userId: string): Promise<any> {
     // This assumes your API Gateway has an endpoint like POST /api/v1/knowledge/collections/:collectionId/records
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi(`/api/v1/knowledge/collections/${collectionId}/records`, 'POST', { recordId, userId });
         return result; // Assuming API returns the created join entry or null/error
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase insert into the join table (RLS should enforce ownership)
         // Handle duplicate key error if the record is already in the collection
         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_collection_records').insert([{ collection_id: collectionId, record_id: recordId, user_id: userId }]).select().single();
         if (error) {
             if (error.code === '23505') { // PostgreSQL unique_violation error code
                 console.warn(`SDK: Record ${recordId} is already in collection ${collectionId}.`);
                 return null; // Return null for duplicate
             }
             throw error; // Re-throw other errors
         }
         return data;
     }
  }

  /**
   * Removes a record from a knowledge collection.
   * @param collectionId The ID of the collection.
   * @param recordId The ID of the record to remove.
   * @param userId The user ID. Required.
   * @returns Promise<boolean> True if removal was successful.
   */
  async removeRecordFromCollection(collectionId: string, recordId: string, userId: string): Promise<boolean> {
     // This assumes your API Gateway has an endpoint like DELETE /api/v1/knowledge/collections/:collectionId/records/:recordId
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/knowledge/collections/${collectionId}/records/${recordId}`, 'DELETE', undefined, { params: { userId } });
             return result?.success === true; // Assuming API returns { success: true } on success
         } catch (error: any) {
             // Assume 404 means not found/already removed, other errors are failures
             if (error.response?.status === 404) return false;
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase delete from the join table (RLS should enforce ownership)
         const { count, error } = await this.apiProxy['supabaseClient']
             .from('knowledge_collection_records')
             .delete()
             .eq('collection_id', collectionId)
             .eq('record_id', recordId)
             .eq('user_id', userId) // RLS on join table enforces ownership
             .select('record_id', { count: 'exact' }); // Select count to check if a row was deleted

         if (error) throw error;
         return count !== null && count > 0;
     }
  }

   /**
   * Creates a new knowledge collection.
   * @param name The name of the collection.
   * @param userId The user ID. Required.
   * @param description Optional description.
   * @returns Promise<KnowledgeCollection> The created collection.
   */
  async createCollection(name: string, userId: string, description?: string): Promise<KnowledgeCollection | null> {
    // This assumes your API Gateway has an endpoint like POST /api/v1/knowledge/collections
    // that delegates to the KnowledgeAgent/MemoryEngine.

    if (this.apiProxy.getApiEndpoint()) {
        // Call custom API Gateway
        const result = await this.apiProxy.callApi('/api/v1/knowledge/collections', 'POST', { name, userId, description });
        return result as KnowledgeCollection; // Assuming API returns the created collection
    } else {
        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
             throw new Error('Supabase client not available in ApiProxy.');
        }
        const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_collections').insert([{ name, user_id: userId, description }]).select().single();
        if (error) throw error;
        return data as KnowledgeCollection;
    }
  }

   /**
   * Updates a knowledge collection.
   * @param collectionId The ID of the collection.
   * @param updates The updates to apply.
   * @returns Promise<KnowledgeCollection | undefined> The updated collection or undefined if not found.
   */
  async updateCollection(collectionId: string, updates: Partial<Omit<KnowledgeCollection, 'id' | 'user_id' | 'creation_timestamp' | 'last_updated_timestamp'>>): Promise<KnowledgeCollection | undefined> {
     // This assumes your API Gateway has an endpoint like PUT /api/v1/knowledge/collections/:collectionId
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/knowledge/collections/${collectionId}`, 'PUT', updates);
             return result as KnowledgeCollection; // Assuming API returns the updated collection
         } catch (error: any) {
             if (error.response?.status === 404) return undefined; // Not found
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase update by ID (RLS should enforce ownership)
         const { data, error } = await this.apiProxy['supabaseClient'].from('knowledge_collections').update(updates).eq('id', collectionId).select().single();
         if (error) {
             if (error.code === 'PGRST116') return undefined; // Not found (or not owned)
             throw error;
         }
         return data as KnowledgeCollection;
     }
  }

  /**
   * Deletes a knowledge collection.
   * @param collectionId The ID of the collection.
   * @returns Promise<boolean> True if deletion was successful.
   */
  async deleteCollection(collectionId: string): Promise<boolean> {
     // This assumes your API Gateway has an endpoint like DELETE /api/v1/knowledge/collections/:collectionId
     // that delegates to the KnowledgeAgent/MemoryEngine.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/knowledge/collections/${collectionId}`, 'DELETE');
             return result?.success === true; // Assuming API returns { success: true } on success
         } catch (error: any) {
             // Assume 404 means not found/already deleted, other errors are failures
             if (error.response?.status === 404) return false;
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase delete by ID (RLS should enforce ownership)
         const { count, error } = await this.apiProxy['supabaseClient'].from('knowledge_collections').delete().eq('id', collectionId).select('id', { count: 'exact' });
         if (error) throw error;
         return count !== null && count > 0;
     }
  }


  // Note: Knowledge Graph methods (getGraphData, createRelation, deleteRelation) are in knowledgeGraph.ts
}
```