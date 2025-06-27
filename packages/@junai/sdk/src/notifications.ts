```typescript
// packages/@junai/sdk/src/notifications.ts
// Notification Client Module for SDK

import { ApiProxy } from './apiProxy';
import { Notification } from '../../../src/interfaces'; // Import interface from main project

export class NotificationClient {
  private apiProxy: ApiProxy;

  constructor(apiProxy: ApiProxy) {
    this.apiProxy = apiProxy;
  }

  /**
   * Sends a notification to a user.
   * @param notificationDetails The notification details (without id, timestamp, is_read). Must include userId, message, type, channel.
   * @returns Promise<Notification> The created notification.
   */
  async send(notificationDetails: Omit<Notification, 'id' | 'timestamp' | 'is_read'>): Promise<Notification> {
    // This assumes your API Gateway has an endpoint like POST /api/v1/notifications
    // that delegates to the NotificationAgent/NotificationService.
    // If calling directly to Supabase, use the Supabase client instead.

    if (this.apiProxy.getApiEndpoint()) {
        // Call custom API Gateway
        const result = await this.apiProxy.callApi('/api/v1/notifications', 'POST', notificationDetails);
        return result as Notification; // Assuming API returns the created notification
    } else {
        // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
        if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
             throw new Error('Supabase client not available in ApiProxy.');
        }
        // Direct Supabase insert for notifications
        const { data, error } = await this.apiProxy['supabaseClient'].from('notifications').insert([notificationDetails]).select().single();
        if (error) throw error;
        return data as Notification;
    }
  }

  /**
   * Retrieves notifications for a user.
   * @param userId The user ID. Required.
   * @param options Optional filters (e.g., isRead, channel, limit).
   * @returns Promise<Notification[]> An array of notifications.
   */
  async get(userId: string, options?: { isRead?: boolean, channel?: Notification['channel'], limit?: number }): Promise<Notification[]> {
     // This assumes your API Gateway has an endpoint like GET /api/v1/notifications?userId=...&isRead=...&channel=...&limit=...
     // that delegates to the NotificationAgent/NotificationService.
     // If calling directly to Supabase, use the Supabase client instead.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         const result = await this.apiProxy.callApi('/api/v1/notifications', 'GET', undefined, { params: { userId, ...options } });
         return result as Notification[]; // Assuming API returns an array of notifications
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase query with filters
         let query = this.apiProxy['supabaseClient'].from('notifications').select('*').eq('user_id', userId);
         if (options?.isRead !== undefined) {
             query = query.eq('is_read', options.isRead);
         }
         if (options?.channel) {
             query = query.eq('channel', options.channel);
         }
         if (options?.limit) {
             query = query.limit(options.limit);
         }
         query = query.order('timestamp', { ascending: false } as any);
         const { data, error } = await query;
         if (error) throw error;
         return data as Notification[];
     }
  }

  /**
   * Marks a notification as read for a user.
   * @param notificationId The ID of the notification. Required.
   * @param userId The user ID. Required.
   * @returns Promise<boolean> True if successful.
   */
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
     // This assumes your API Gateway has an endpoint like PUT /api/v1/notifications/:notificationId/read
     // that delegates to the NotificationAgent/NotificationService.
     // If calling directly to Supabase, use the Supabase client instead.

     if (this.apiProxy.getApiEndpoint()) {
         // Call custom API Gateway
         try {
             const result = await this.apiProxy.callApi(`/api/v1/notifications/${notificationId}/read`, 'PUT', { userId });
             return result?.success === true; // Assuming API returns { success: true } on success
         } catch (error: any) {
             // Assume 404 means not found/already read, other errors are failures
             if (error.response?.status === 404) return false;
             throw error; // Re-throw other errors
         }
     } else {
         // Fallback to calling Supabase directly (requires user to be authenticated via SDK)
         if (!this.apiProxy['supabaseClient']) { // Access internal client (MVP)
              throw new Error('Supabase client not available in ApiProxy.');
         }
         // Direct Supabase update by ID (RLS should enforce ownership)
         const { count, error } = await this.apiProxy['supabaseClient'].from('notifications').update({ is_read: true }).eq('id', notificationId).eq('user_id', userId).select('id', { count: 'exact' });
         if (error) throw error;
         return count !== null && count > 0;
     }
  }

  // TODO: Add other notification-related methods (e.g., delete, markAllAsRead)
}
```