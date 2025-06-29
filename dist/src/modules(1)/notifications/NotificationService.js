"use strict";
`` `typescript
// src/modules/notifications/NotificationService.ts
// 通知服務 (Notification Service) - 輔助模組
// Handles sending and managing user notifications across different channels (UI, Email, Push).
// Part of the Six Styles of Infinite Evolution (無限進化循環的六式奧義) - specifically Event Push (事件推送).
// Design Principle: Provides timely and relevant information to the user.

import { SystemContext } from '../../interfaces';
import { SupabaseClient } from '@supabase/supabase-js'; // For storing notifications or triggering Edge Functions
// import { EventBus } from '../events/EventBus'; // To subscribe to events
// import { LoggingService } from '../core/logging/LoggingService'; // Dependency
// import { SyncService } from '../modules/sync/SyncService'; // Dependency


export interface Notification {
    id: string;
    user_id?: string; // Target user
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    details?: any;
    timestamp: string; // ISO 8601
    is_read: boolean;
    channel: 'ui' | 'email' | 'webhook' | 'push'; // Delivery channel
    // TODO: Add action links, icon, expiry
}

// Define the type for the UI notification listener callback
type UiNotificationCallback = (notifications: Notification[]) => void;


export class NotificationService {
    private supabase: SupabaseClient; // For persisting notifications
    private context: SystemContext; // To access other services like EventBus, LoggingService, SyncService
    // private eventBus: EventBus; // Access via context
    // private loggingService: LoggingService; // Access via context
    // private syncService: SyncService; // Access via context

    // Simple in-memory array for UI notifications (should be synced with DB)
    // private uiNotifications: Notification[] = []; // Now fetching from DB via subscription
    private uiNotificationListeners: UiNotificationCallback[] = []; // Listeners for UI notifications

    // --- New: Realtime Subscription ---
    private notificationSubscription: any | null = null;
    // --- End New ---

    // In-memory cache of unread UI notifications received via realtime
    private unreadUiNotificationsCache: Notification[] = [];


    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
        // this.eventBus = context.eventBus;
        // this.loggingService = context.loggingService;
        // this.syncService = context.syncService;
        console.log('NotificationService initialized.');

        // TODO: Subscribe to relevant events from EventBus (e.g., 'task_completed', 'ability_forged', 'new_knowledge')
        // Example: this.context.eventBus.subscribe('new_knowledge_record_created', (payload) => this.handleNewKnowledgeEvent(payload));
        // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompletedEvent(payload));
        // Example: this.context.eventBus.subscribe('task_failed', (payload) => this.handleTaskFailedEvent(payload));
        // Example: this.context.eventBus.subscribe('evolutionary_insight_generated', (payload) => this.handleInsightGeneratedEvent(payload));
        // Example: this.context.eventBus.subscribe('agentic_flow_completed', (payload) => this.handleAgenticFlowCompletedEvent(payload)); // New
        // Example: this.context.eventBus.subscribe('agentic_flow_failed', (payload) => this.handleAgenticFlowFailedEvent(payload)); // New


        // --- New: Set up Supabase Realtime subscription for notifications table ---
        // Subscribe when the user is authenticated.
        this.context.securityService?.onAuthStateChange((user) => {
            if (user) {
                this.subscribeToNotificationUpdates(user.id);
                // Fetch initial unread UI notifications on login
                this.getNotifications(user.id, false, 'ui').then(notifications => {
                    this.unreadUiNotificationsCache = notifications;
                    this.notifyUiListeners(); // Notify listeners with initial data
                }).catch(err => console.error('Error fetching initial UI notifications:', err));

            } else {
                this.unsubscribeFromNotificationUpdates();
                // Clear cache and notify listeners on logout
                this.unreadUiNotificationsCache = [];
                this.notifyUiListeners();
            }
        });
        // --- End New ---
    }

    /**
     * Handles a new knowledge record event to potentially send a notification.\
     * @param payload The event payload (KnowledgeRecord).
     */
    private async handleNewKnowledgeEvent(payload: any): Promise<void> {
        console.log('[NotificationService] Handling new_knowledge_record_created event.');
        // Simulate sending a notification for a new knowledge record
        if (payload?.user_id) {
            await this.sendNotification({
                user_id: payload.user_id,
                type: 'info',
                message: `;
New;
knowledge;
record;
added: ;
"${payload.question.substring(0, 50)}...\"`,;
channel: 'ui', // Send to UI by default
    details;
{
    recordId: payload.id, question;
    payload.question;
}
;
async;
handleTaskCompletedEvent(payload, any);
Promise < void  > {
    console, : .log('[NotificationService] Handling task_completed event.'),
    // Simulate sending a notification for a completed task
    if(payload, user_id) {
        await this.sendNotification({
            user_id: payload.user_id,
            type: 'success',
            message: `Task completed: \"${payload.description.substring(0, 50)}...\"`,
            channel: 'ui', // Send to UI by default
            details: { taskId: payload.id, description: payload.description },
        });
    }
};
async;
handleTaskFailedEvent(payload, any);
Promise < void  > {
    console, : .log('[NotificationService] Handling task_failed event.'),
    // Simulate sending a notification for a failed task
    if(payload, user_id) {
        await this.sendNotification({
            user_id: payload.user_id,
            type: 'error',
            message: `Task failed: \"${payload.description.substring(0, 50)}...\"`,
            channel: 'ui', // Send to UI by default
            details: { taskId: payload.id, description: payload.description, error: payload.error },
        });
    }
};
async;
handleInsightGeneratedEvent(payload, any);
Promise < void  > {
    console, : .log('[NotificationService] Handling evolutionary_insight_generated event.'),
    // Simulate sending a notification for a new insight
    if(payload, user_id) {
        await this.sendNotification({
            user_id: payload.user_id,
            type: 'info', // Insights are typically informational
            message: `New Insight: \"${payload.details?.message.substring(0, 50)}...\"`,
            channel: 'ui', // Send to UI by default
            details: { insightId: payload.id, type: payload.type, message: payload.details?.message },
        });
    }
};
async;
handleAgenticFlowCompletedEvent(payload, any);
Promise < void  > {
    console, : .log('[NotificationService] Handling agentic_flow_completed event.'),
    // Simulate sending a notification for a completed flow
    if(payload, userId) {
        // Fetch the flow details to get the name
        const flow = await this.context.selfNavigationEngine?.getAgenticFlowById(payload.flowId, payload.userId);
        const flowName = flow?.name || payload.flowId;
        await this.sendNotification({
            user_id: payload.userId,
            type: 'success',
            message: `Agentic Flow completed: \"${flowName.substring(0, 50)}...\"`,
            channel: 'ui', // Send to UI by default
            details: { flowId: payload.flowId, flowName: flowName, executionLog: payload.executionLog },
        });
    }
};
async;
handleAgenticFlowFailedEvent(payload, any);
Promise < void  > {
    console, : .log('[NotificationService] Handling agentic_flow_failed event.'),
    // Simulate sending a notification for a failed flow
    if(payload, userId) {
        // Fetch the flow details to get the name
        const flow = await this.context.selfNavigationEngine?.getAgenticFlowById(payload.flowId, payload.userId);
        const flowName = flow?.name || payload.flowId;
        await this.sendNotification({
            user_id: payload.userId,
            type: 'error',
            message: `Agentic Flow failed: \"${flowName.substring(0, 50)}...\"`,
            channel: 'ui', // Send to UI by default
            details: { flowId: payload.flowId, flowName: flowName, error: payload.error, executionLog: payload.executionLog },
        });
    }
};
/**
 * Sends a notification to a specific user via one or more channels.
 * Persists the notification to Supabase.
 * @param notificationDetails The notification details (without id, timestamp, is_read). Required.
 * @returns Promise<Notification | null> The created Notification or null on failure.
 */
async;
sendNotification(notificationDetails, (Omit));
Promise < Notification | null > {
    console, : .log('Sending notification to user:', notificationDetails.user_id, 'Channel:', notificationDetails.channel),
    this: .context.loggingService?.logInfo('Attempting to send notification', { userId: notificationDetails.user_id, channel: notificationDetails.channel, type: notificationDetails.type }),
    if(, notificationDetails) { }, : .user_id || !notificationDetails.message || !notificationDetails.channel || !notificationDetails.type
};
{
    console.error('[NotificationService] Cannot send notification: Missing required fields.');
    this.context.loggingService?.logError('Cannot send notification: Missing required fields.', { details: notificationDetails });
    throw new Error('User ID, message, channel, and type are required to send a notification.');
}
const newNotificationData = {
    ...notificationDetails,
    // timestamp and is_read are set by the database default
};
try {
    // Insert into Supabase (Supports Bidirectional Sync Domain)
    const { data, error } = await this.supabase
        .from('notifications')
        .insert([newNotificationData])
        .select() // Select the inserted data to get the generated ID and timestamp
        .single(); // Expecting a single record back
    if (error) {
        console.error('Error sending notification to Supabase:', error);
        this.context.loggingService?.logError('Failed to send notification', { userId: notificationDetails.user_id, error: error.message });
        throw error; // Re-throw the error
    }
    const createdNotification = data;
    console.log('Notification sent:', createdNotification.id, 'to user:', createdNotification.user_id, 'Channel:', createdNotification.channel);
    // Publish a 'new_notification' event via EventBus (Supports Event Push - call context.eventBus.publish)
    // The Realtime subscription will also publish events, so be careful not to duplicate processing.
    // For now, let's rely on the Realtime subscription to be the source of events for UI updates.
    this.context.eventBus?.publish('new_notification', createdNotification, createdNotification.user_id); // Include userId in event
    // --- New: Notify SyncService about local change ---
    // This is handled by the Realtime subscription now, which SyncService can listen to.
    // If Realtime is not used for sync, this manual notification is needed.
    // For MVP, let's assume SyncService listens to Realtime.
    // this.context.syncService?.handleLocalDataChange('notificationService', 'INSERT', createdNotification, createdNotification.user_id)
    //     .catch(syncError => console.error('Error notifying SyncService for Notification insert:', syncError));
    // --- End New ---
    // TODO: Implement sending via other channels (Email, Push, Webhook) here or trigger Edge Functions
    if (createdNotification.channel === 'email') {
        console.warn('[NotificationService] Email channel is simulated.');
        // TODO: Call an email sending service via ApiProxy or Edge Function
    }
    if (createdNotification.channel === 'webhook') {
        console.warn('[NotificationService] Webhook channel is simulated.');
        // TODO: Trigger a webhook via ApiProxy or Edge Function
    }
    if (createdNotification.channel === 'push') {
        console.warn('[NotificationService] Push channel is simulated.');
        // TODO: Send a push notification via a push service API or Edge Function
    }
    return createdNotification;
}
catch (error) {
    console.error('Failed to send notification:', error);
    this.context.loggingService?.logError('Failed to send notification', { userId: notificationDetails.user_id, error: error.message });
    return null; // Return null on failure
}
/**
 * Retrieves notifications for a specific user from Supabase.
 * @param userId The user ID. Required.
 * @param isRead Optional: Filter by read status. Defaults to undefined (all).
 * @param channel Optional: Filter by channel. Defaults to undefined (all).
 * @param limit Optional: Maximum number of notifications to retrieve. Defaults to 100.
 * @returns Promise<Notification[]> An array of Notification objects.
 */
async;
getNotifications(userId, string, isRead ?  : boolean, channel ?  : Notification['channel'], limit, number = 100);
Promise < Notification[] > {
    console, : .log(`[NotificationService] Retrieving notifications for user: ${userId}, isRead: ${isRead}, channel: ${channel}, limit: ${limit}`),
    this: .context.loggingService?.logInfo(`Attempting to fetch notifications for user ${userId}`, { userId, isRead, channel, limit }),
    if(, userId) {
        console.warn('[NotificationService] Cannot retrieve notifications: User ID is required.');
        this.context.loggingService?.logWarning('Cannot retrieve notifications: User ID is required.');
        return [];
    },
    try: {
        let, dbQuery = this.supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId),
        if(isRead) { }
    } !== undefined
};
{
    dbQuery = dbQuery.eq('is_read', isRead);
}
if (channel !== undefined) {
    dbQuery = dbQuery.eq('channel', channel);
}
dbQuery = dbQuery.order('timestamp', { ascending: false }) // Order by newest first
    .limit(limit);
const { data, error } = await dbQuery;
if (error) {
    throw error;
}
console.log(`Fetched ${data.length} notifications for user ${userId}.`);
this.context.loggingService?.logInfo(`Fetched ${data.length} notifications successfully.`, { userId: userId });
return data;
try { }
catch (error) {
    console.error(`[NotificationService] Error fetching notifications for user ${userId}:`, error);
    this.context.loggingService?.logError(`Failed to fetch notifications for user ${userId}`, { userId: userId, error: error.message });
    return [];
}
/**
 * Marks a notification as read for a specific user in Supabase.
 * @param notificationId The ID of the notification. Required.
 * @param userId The user ID for verification. Required.
 * @returns Promise<Notification | undefined> The updated notification or undefined.
 */
async;
markAsRead(notificationId, string, userId, string);
Promise < Notification | undefined > {
    console, : .log(`[NotificationService] Marking notification ${notificationId} as read for user ${userId}...`),
    this: .context.loggingService?.logInfo(`Attempting to mark notification ${notificationId} as read`, { id: notificationId, userId }),
    if(, userId) {
        console.warn('[NotificationService] Cannot mark notification as read: User ID is required.');
        this.context.loggingService?.logWarning('Cannot mark notification as read: User ID is required.');
        return undefined;
    },
    try: {
        const: { data, error } = await this.supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .eq('user_id', userId) // Ensure ownership
            .select()
            .single(),
        if(error) { throw error; },
        if(, data) {
            console.warn(`Notification ${notificationId} not found or does not belong to user ${userId} for marking as read.`);
            this.context.loggingService?.logWarning(`Notification not found or user mismatch for marking as read: ${notificationId}`, { userId });
            return undefined;
        },
        const: updatedNotification = data,
        console, : .log(`Notification ${notificationId} marked as read in Supabase.`),
        // Publish 'notification_updated' event (Realtime subscription will also trigger this)
        this: .context.eventBus?.publish('notification_updated', updatedNotification, userId),
        this: .context.loggingService?.logInfo(`Notification marked as read: ${notificationId}`, { id: notificationId, userId: userId }),
        // --- New: Notify SyncService about local change ---
        // This is handled by the Realtime subscription now, which SyncService can listen to.
        // If Realtime is not used for sync, this manual notification is needed.
        // For MVP, let's assume SyncService listens to Realtime.
        // this.context.syncService?.handleLocalDataChange('notificationService', 'UPDATE', updatedNotification, userId)
        //      .catch(syncError => console.error('Error notifying SyncService for Notification update:', syncError));
        // --- End New ---
        return: updatedNotification
    }, catch(error) {
        console.error(`Failed to mark notification ${notificationId} as read:`, error);
        this.context.loggingService?.logError(`Failed to mark notification ${notificationId} as read`, { id: notificationId, userId: userId, error: error.message });
        throw error; // Re-throw the error
    }
};
/**
 * Subscribes UI components to receive updates for unread UI notifications.
 * @param callback The function to call with the current list of unread UI notifications.
 * @returns A function to unsubscribe the listener.
 */
subscribeToUiNotifications(callback, UiNotificationCallback);
() => void {
    console, : .log('[NotificationService] UI subscribing to notifications.'),
    this: .uiNotificationListeners.push(callback),
    : .unreadUiNotificationsCache, // Pass a copy
    // Return an unsubscribe function
    return() { }
};
{
    console.log('[NotificationService] UI unsubscribing from notifications.');
    this.uiNotificationListeners = this.uiNotificationListeners.filter(listener => listener !== callback);
}
;
notifyUiListeners();
void {
    console, : .log(`[NotificationService] Notifying ${this.uiNotificationListeners.length} UI listeners with ${this.unreadUiNotificationsCache.length} notifications.`),
    const: notificationsCopy = [...this.unreadUiNotificationsCache], // Pass a copy to prevent external modification
    this: .uiNotificationListeners.forEach(listener => {
        try {
            listener(notificationsCopy);
        }
        catch (error) {
            console.error('[NotificationService] Error in UI notification listener:', error);
            this.context.loggingService?.logError('Error in UI notification listener', { error: error });
        }
    })
};
/**
 * Subscribes to real-time updates from the notifications table for the current user.
 * This is crucial for cross-device synchronization (雙向同步領域).
 * @param userId The user ID to filter updates by. Required.
 */
subscribeToNotificationUpdates(userId, string);
void {
    console, : .log('[NotificationService] Subscribing to notification realtime updates for user:', userId),
    this: .context.loggingService?.logInfo('Subscribing to notification realtime updates', { userId }),
    : .notificationSubscription
};
{
    console.warn('[NotificationService] Already subscribed to notification updates. Unsubscribing existing.');
    this.unsubscribeFromNotificationUpdates();
}
// Subscribe to changes for the current user's notifications
this.notificationSubscription = this.supabase
    .channel(`notifications:user_id=eq.${userId}`) // Channel filtered by user_id
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
    console.log('[NotificationService] Realtime notification change received:', payload);
    const notification = (payload.new || payload.old); // New data for INSERT/UPDATE, old for DELETE
    const eventType = payload.eventType;
    // Update the in-memory cache of unread UI notifications
    if (notification.channel === 'ui') { // Only cache UI notifications
        if (eventType === 'INSERT') {
            if (!notification.is_read) { // Add to cache only if unread
                this.unreadUiNotificationsCache = [...this.unreadUiNotificationsCache, notification];
                this.notifyUiListeners(); // Notify UI listeners
            }
        }
        else if (eventType === 'UPDATE') {
            // Find the notification in the cache
            const index = this.unreadUiNotificationsCache.findIndex(n => n.id === notification.id);
            if (notification.is_read) {
                // If marked as read, remove from cache
                if (index > -1) {
                    this.unreadUiNotificationsCache = this.unreadUiNotificationsCache.filter(n => n.id !== notification.id);
                    this.notifyUiListeners(); // Notify UI listeners
                }
            }
            else { // If status changed to unread (less common for updates)
                if (index === -1) { // Add to cache if not already there
                    this.unreadUiNotificationsCache = [...this.unreadUiNotificationsCache, notification];
                    this.notifyUiListeners(); // Notify UI listeners
                }
                else { // Update existing notification in cache
                    this.unreadUiNotificationsCache = this.unreadUiNotificationsCache.map(n => n.id === notification.id ? notification : n);
                    this.notifyUiListeners(); // Notify UI listeners
                }
            }
        }
        else if (eventType === 'DELETE') {
            // Remove from cache if deleted
            this.unreadUiNotificationsCache = this.unreadUiNotificationsCache.filter(n => n.id !== notification.id);
            this.notifyUiListeners(); // Notify UI listeners
        }
    }
    // Publish a general 'notification_updated' event via EventBus for other modules
    this.context.eventBus?.publish(`notification_${eventType.toLowerCase()}`, notification, userId); // e.g., 'notification_insert', 'notification_update', 'notification_delete'
    // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly
    // this.context.syncService?.handleRemoteDataChange('notificationService', eventType, notification, userId);
})
    .subscribe((status, err) => {
    console.log('[NotificationService] Notification subscription status:', status);
    if (status === 'CHANNEL_ERROR') {
        console.error('[NotificationService] Notification subscription error:', err);
        this.context.loggingService?.logError('Notification subscription error', { userId, error: err?.message });
    }
});
/**
 * Unsubscribes from real-time updates.
 */
unsubscribeFromNotificationUpdates();
void {
    : .notificationSubscription
};
{
    console.log('[NotificationService] Unsubscribing from notification realtime updates.');
    this.context.loggingService?.logInfo('Unsubscribing from notification realtime updates');
    this.supabase.removeChannel(this.notificationSubscription);
    this.notificationSubscription = null;
}
`` `;
