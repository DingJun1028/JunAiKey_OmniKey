var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
var _this = this;
""(__makeTemplateObject(["typescript\n// src/modules/notifications/NotificationService.ts\n// \u901A\u77E5\u670D\u52D9 (Notification Service) - \u8F14\u52A9\u6A21\u7D44\n// Handles sending and managing user notifications across different channels (UI, Email, Push).\n// Part of the Six Styles of Infinite Evolution (\u7121\u9650\u9032\u5316\u5FAA\u74B0\u7684\u516D\u5F0F\u5967\u7FA9) - specifically Event Push (\u4E8B\u4EF6\u63A8\u9001).\n// Design Principle: Provides timely and relevant information to the user.\n\nimport { SystemContext } from '../../interfaces';\nimport { SupabaseClient } from '@supabase/supabase-js'; // For storing notifications or triggering Edge Functions\n// import { EventBus } from '../events/EventBus'; // To subscribe to events\n// import { LoggingService } from '../core/logging/LoggingService'; // Dependency\n// import { SyncService } from '../modules/sync/SyncService'; // Dependency\n\n\nexport interface Notification {\n    id: string;\n    user_id?: string; // Target user\n    type: 'info' | 'warning' | 'error' | 'success';\n    message: string;\n    details?: any;\n    timestamp: string; // ISO 8601\n    is_read: boolean;\n    channel: 'ui' | 'email' | 'webhook' | 'push'; // Delivery channel\n    // TODO: Add action links, icon, expiry\n}\n\n// Define the type for the UI notification listener callback\ntype UiNotificationCallback = (notifications: Notification[]) => void;\n\n\nexport class NotificationService {\n    private supabase: SupabaseClient; // For persisting notifications\n    private context: SystemContext; // To access other services like EventBus, LoggingService, SyncService\n    // private eventBus: EventBus; // Access via context\n    // private loggingService: LoggingService; // Access via context\n    // private syncService: SyncService; // Access via context\n\n    // Simple in-memory array for UI notifications (should be synced with DB)\n    // private uiNotifications: Notification[] = []; // Now fetching from DB via subscription\n    private uiNotificationListeners: UiNotificationCallback[] = []; // Listeners for UI notifications\n\n    // --- New: Realtime Subscription ---\n    private notificationSubscription: any | null = null;\n    // --- End New ---\n\n    // In-memory cache of unread UI notifications received via realtime\n    private unreadUiNotificationsCache: Notification[] = [];\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.eventBus = context.eventBus;\n        // this.loggingService = context.loggingService;\n        // this.syncService = context.syncService;\n        console.log('NotificationService initialized.');\n\n        // TODO: Subscribe to relevant events from EventBus (e.g., 'task_completed', 'ability_forged', 'new_knowledge')\n        // Example: this.context.eventBus.subscribe('new_knowledge_record_created', (payload) => this.handleNewKnowledgeEvent(payload));\n        // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompletedEvent(payload));\n        // Example: this.context.eventBus.subscribe('task_failed', (payload) => this.handleTaskFailedEvent(payload));\n        // Example: this.context.eventBus.subscribe('evolutionary_insight_generated', (payload) => this.handleInsightGeneratedEvent(payload));\n        // Example: this.context.eventBus.subscribe('agentic_flow_completed', (payload) => this.handleAgenticFlowCompletedEvent(payload)); // New\n        // Example: this.context.eventBus.subscribe('agentic_flow_failed', (payload) => this.handleAgenticFlowFailedEvent(payload)); // New\n\n\n        // --- New: Set up Supabase Realtime subscription for notifications table ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToNotificationUpdates(user.id);\n                // Fetch initial unread UI notifications on login\n                this.getNotifications(user.id, false, 'ui').then(notifications => {\n                    this.unreadUiNotificationsCache = notifications;\n                    this.notifyUiListeners(); // Notify listeners with initial data\n                }).catch(err => console.error('Error fetching initial UI notifications:', err));\n\n            } else {\n                this.unsubscribeFromNotificationUpdates();\n                // Clear cache and notify listeners on logout\n                this.unreadUiNotificationsCache = [];\n                this.notifyUiListeners();\n            }\n        });\n        // --- End New ---\n    }\n\n    /**\n     * Handles a new knowledge record event to potentially send a notification.     * @param payload The event payload (KnowledgeRecord).\n     */\n    private async handleNewKnowledgeEvent(payload: any): Promise<void> {\n        console.log('[NotificationService] Handling new_knowledge_record_created event.');\n        // Simulate sending a notification for a new knowledge record\n        if (payload?.user_id) {\n            await this.sendNotification({\n                user_id: payload.user_id,\n                type: 'info',\n                message: "], ["typescript\n// src/modules/notifications/NotificationService.ts\n// \u901A\u77E5\u670D\u52D9 (Notification Service) - \u8F14\u52A9\u6A21\u7D44\n// Handles sending and managing user notifications across different channels (UI, Email, Push).\n// Part of the Six Styles of Infinite Evolution (\u7121\u9650\u9032\u5316\u5FAA\u74B0\u7684\u516D\u5F0F\u5967\u7FA9) - specifically Event Push (\u4E8B\u4EF6\u63A8\u9001).\n// Design Principle: Provides timely and relevant information to the user.\n\nimport { SystemContext } from '../../interfaces';\nimport { SupabaseClient } from '@supabase/supabase-js'; // For storing notifications or triggering Edge Functions\n// import { EventBus } from '../events/EventBus'; // To subscribe to events\n// import { LoggingService } from '../core/logging/LoggingService'; // Dependency\n// import { SyncService } from '../modules/sync/SyncService'; // Dependency\n\n\nexport interface Notification {\n    id: string;\n    user_id?: string; // Target user\n    type: 'info' | 'warning' | 'error' | 'success';\n    message: string;\n    details?: any;\n    timestamp: string; // ISO 8601\n    is_read: boolean;\n    channel: 'ui' | 'email' | 'webhook' | 'push'; // Delivery channel\n    // TODO: Add action links, icon, expiry\n}\n\n// Define the type for the UI notification listener callback\ntype UiNotificationCallback = (notifications: Notification[]) => void;\n\n\nexport class NotificationService {\n    private supabase: SupabaseClient; // For persisting notifications\n    private context: SystemContext; // To access other services like EventBus, LoggingService, SyncService\n    // private eventBus: EventBus; // Access via context\n    // private loggingService: LoggingService; // Access via context\n    // private syncService: SyncService; // Access via context\n\n    // Simple in-memory array for UI notifications (should be synced with DB)\n    // private uiNotifications: Notification[] = []; // Now fetching from DB via subscription\n    private uiNotificationListeners: UiNotificationCallback[] = []; // Listeners for UI notifications\n\n    // --- New: Realtime Subscription ---\n    private notificationSubscription: any | null = null;\n    // --- End New ---\n\n    // In-memory cache of unread UI notifications received via realtime\n    private unreadUiNotificationsCache: Notification[] = [];\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.eventBus = context.eventBus;\n        // this.loggingService = context.loggingService;\n        // this.syncService = context.syncService;\n        console.log('NotificationService initialized.');\n\n        // TODO: Subscribe to relevant events from EventBus (e.g., 'task_completed', 'ability_forged', 'new_knowledge')\n        // Example: this.context.eventBus.subscribe('new_knowledge_record_created', (payload) => this.handleNewKnowledgeEvent(payload));\n        // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompletedEvent(payload));\n        // Example: this.context.eventBus.subscribe('task_failed', (payload) => this.handleTaskFailedEvent(payload));\n        // Example: this.context.eventBus.subscribe('evolutionary_insight_generated', (payload) => this.handleInsightGeneratedEvent(payload));\n        // Example: this.context.eventBus.subscribe('agentic_flow_completed', (payload) => this.handleAgenticFlowCompletedEvent(payload)); // New\n        // Example: this.context.eventBus.subscribe('agentic_flow_failed', (payload) => this.handleAgenticFlowFailedEvent(payload)); // New\n\n\n        // --- New: Set up Supabase Realtime subscription for notifications table ---\n        // Subscribe when the user is authenticated.\n        this.context.securityService?.onAuthStateChange((user) => {\n            if (user) {\n                this.subscribeToNotificationUpdates(user.id);\n                // Fetch initial unread UI notifications on login\n                this.getNotifications(user.id, false, 'ui').then(notifications => {\n                    this.unreadUiNotificationsCache = notifications;\n                    this.notifyUiListeners(); // Notify listeners with initial data\n                }).catch(err => console.error('Error fetching initial UI notifications:', err));\n\n            } else {\n                this.unsubscribeFromNotificationUpdates();\n                // Clear cache and notify listeners on logout\n                this.unreadUiNotificationsCache = [];\n                this.notifyUiListeners();\n            }\n        });\n        // --- End New ---\n    }\n\n    /**\n     * Handles a new knowledge record event to potentially send a notification.\\\n     * @param payload The event payload (KnowledgeRecord).\n     */\n    private async handleNewKnowledgeEvent(payload: any): Promise<void> {\n        console.log('[NotificationService] Handling new_knowledge_record_created event.');\n        // Simulate sending a notification for a new knowledge record\n        if (payload?.user_id) {\n            await this.sendNotification({\n                user_id: payload.user_id,\n                type: 'info',\n                message: "]));
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
    console: console,
    : .log('[NotificationService] Handling task_completed event.'),
    // Simulate sending a notification for a completed task
    if: function (payload, user_id) {
        yield this.sendNotification({
            user_id: payload.user_id,
            type: 'success',
            message: "Task completed: \"".concat(payload.description.substring(0, 50), "...\""),
            channel: 'ui', // Send to UI by default
            details: { taskId: payload.id, description: payload.description },
        });
    }
};
async;
handleTaskFailedEvent(payload, any);
Promise < void  > {
    console: console,
    : .log('[NotificationService] Handling task_failed event.'),
    // Simulate sending a notification for a failed task
    if: function (payload, user_id) {
        yield this.sendNotification({
            user_id: payload.user_id,
            type: 'error',
            message: "Task failed: \"".concat(payload.description.substring(0, 50), "...\""),
            channel: 'ui', // Send to UI by default
            details: { taskId: payload.id, description: payload.description, error: payload.error },
        });
    }
};
async;
handleInsightGeneratedEvent(payload, any);
Promise < void  > {
    console: console,
    : .log('[NotificationService] Handling evolutionary_insight_generated event.'),
    // Simulate sending a notification for a new insight
    if: function (payload, user_id) {
        var _a, _b;
        yield this.sendNotification({
            user_id: payload.user_id,
            type: 'info', // Insights are typically informational
            message: "New Insight: \"".concat((_a = payload.details) === null || _a === void 0 ? void 0 : _a.message.substring(0, 50), "...\""),
            channel: 'ui', // Send to UI by default
            details: { insightId: payload.id, type: payload.type, message: (_b = payload.details) === null || _b === void 0 ? void 0 : _b.message },
        });
    }
};
async;
handleAgenticFlowCompletedEvent(payload, any);
Promise < void  > {
    console: console,
    : .log('[NotificationService] Handling agentic_flow_completed event.'),
    // Simulate sending a notification for a completed flow
    if: function (payload, userId) {
        var _a;
        // Fetch the flow details to get the name
        var flow = yield ((_a = this.context.selfNavigationEngine) === null || _a === void 0 ? void 0 : _a.getAgenticFlowById(payload.flowId, payload.userId));
        var flowName = (flow === null || flow === void 0 ? void 0 : flow.name) || payload.flowId;
        yield this.sendNotification({
            user_id: payload.userId,
            type: 'success',
            message: "Agentic Flow completed: \"".concat(flowName.substring(0, 50), "...\""),
            channel: 'ui', // Send to UI by default
            details: { flowId: payload.flowId, flowName: flowName, executionLog: payload.executionLog },
        });
    }
};
async;
handleAgenticFlowFailedEvent(payload, any);
Promise < void  > {
    console: console,
    : .log('[NotificationService] Handling agentic_flow_failed event.'),
    // Simulate sending a notification for a failed flow
    if: function (payload, userId) {
        var _a;
        // Fetch the flow details to get the name
        var flow = yield ((_a = this.context.selfNavigationEngine) === null || _a === void 0 ? void 0 : _a.getAgenticFlowById(payload.flowId, payload.userId));
        var flowName = (flow === null || flow === void 0 ? void 0 : flow.name) || payload.flowId;
        yield this.sendNotification({
            user_id: payload.userId,
            type: 'error',
            message: "Agentic Flow failed: \"".concat(flowName.substring(0, 50), "...\""),
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
    console: console,
    : .log('Sending notification to user:', notificationDetails.user_id, 'Channel:', notificationDetails.channel),
    this: (_b = .context.loggingService) === null || _b === void 0 ? void 0 : _b.logInfo('Attempting to send notification', { userId: notificationDetails.user_id, channel: notificationDetails.channel, type: notificationDetails.type }),
    if: function (, notificationDetails) { },
    : .user_id || !notificationDetails.message || !notificationDetails.channel || !notificationDetails.type
};
{
    console.error('[NotificationService] Cannot send notification: Missing required fields.');
    (_c = this.context.loggingService) === null || _c === void 0 ? void 0 : _c.logError('Cannot send notification: Missing required fields.', { details: notificationDetails });
    throw new Error('User ID, message, channel, and type are required to send a notification.');
}
var newNotificationData = __assign({}, notificationDetails);
try {
    // Insert into Supabase (Supports Bidirectional Sync Domain)
    var _q = await this.supabase
        .from('notifications')
        .insert([newNotificationData])
        .select() // Select the inserted data to get the generated ID and timestamp
        .single(), data_1 = _q.data, error_1 = _q.error; // Expecting a single record back
    if (error_1) {
        console.error('Error sending notification to Supabase:', error_1);
        (_d = this.context.loggingService) === null || _d === void 0 ? void 0 : _d.logError('Failed to send notification', { userId: notificationDetails.user_id, error: error_1.message });
        throw error_1; // Re-throw the error
    }
    var createdNotification = data_1;
    console.log('Notification sent:', createdNotification.id, 'to user:', createdNotification.user_id, 'Channel:', createdNotification.channel);
    // Publish a 'new_notification' event via EventBus (Supports Event Push - call context.eventBus.publish)
    // The Realtime subscription will also publish events, so be careful not to duplicate processing.
    // For now, let's rely on the Realtime subscription to be the source of events for UI updates.
    (_e = this.context.eventBus) === null || _e === void 0 ? void 0 : _e.publish('new_notification', createdNotification, createdNotification.user_id); // Include userId in event
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
    (_f = this.context.loggingService) === null || _f === void 0 ? void 0 : _f.logError('Failed to send notification', { userId: notificationDetails.user_id, error: error.message });
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
    console: console,
    : .log("[NotificationService] Retrieving notifications for user: ".concat(userId, ", isRead: ").concat(isRead, ", channel: ").concat(channel, ", limit: ").concat(limit)),
    this: (_g = .context.loggingService) === null || _g === void 0 ? void 0 : _g.logInfo("Attempting to fetch notifications for user ".concat(userId), { userId: userId, isRead: isRead, channel: channel, limit: limit }),
    if: function (, userId) {
        var _a;
        console.warn('[NotificationService] Cannot retrieve notifications: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot retrieve notifications: User ID is required.');
        return [];
    },
    try: {
        let: let,
        dbQuery: dbQuery,
        if: function (isRead) { }
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
var _r = await dbQuery, data = _r.data, error = _r.error;
if (error) {
    throw error;
}
console.log("Fetched ".concat(data.length, " notifications for user ").concat(userId, "."));
(_h = this.context.loggingService) === null || _h === void 0 ? void 0 : _h.logInfo("Fetched ".concat(data.length, " notifications successfully."), { userId: userId });
return data;
try { }
catch (error) {
    console.error("[NotificationService] Error fetching notifications for user ".concat(userId, ":"), error);
    (_j = this.context.loggingService) === null || _j === void 0 ? void 0 : _j.logError("Failed to fetch notifications for user ".concat(userId), { userId: userId, error: error.message });
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
    console: console,
    : .log("[NotificationService] Marking notification ".concat(notificationId, " as read for user ").concat(userId, "...")),
    this: (_k = .context.loggingService) === null || _k === void 0 ? void 0 : _k.logInfo("Attempting to mark notification ".concat(notificationId, " as read"), { id: notificationId, userId: userId }),
    if: function (, userId) {
        var _a;
        console.warn('[NotificationService] Cannot mark notification as read: User ID is required.');
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning('Cannot mark notification as read: User ID is required.');
        return undefined;
    },
    try: {
        const: (_a = await this.supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', notificationId)
            .eq('user_id', userId) // Ensure ownership
            .select()
            .single(), data = _a.data, error = _a.error, _a),
        if: function (error) { throw error; },
        if: function (, data) {
            var _a;
            console.warn("Notification ".concat(notificationId, " not found or does not belong to user ").concat(userId, " for marking as read."));
            (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logWarning("Notification not found or user mismatch for marking as read: ".concat(notificationId), { userId: userId });
            return undefined;
        },
        const: updatedNotification = data,
        console: console,
        : .log("Notification ".concat(notificationId, " marked as read in Supabase.")),
        // Publish 'notification_updated' event (Realtime subscription will also trigger this)
        this: (_l = .context.eventBus) === null || _l === void 0 ? void 0 : _l.publish('notification_updated', updatedNotification, userId),
        this: (_m = .context.loggingService) === null || _m === void 0 ? void 0 : _m.logInfo("Notification marked as read: ".concat(notificationId), { id: notificationId, userId: userId }),
        // --- New: Notify SyncService about local change ---
        // This is handled by the Realtime subscription now, which SyncService can listen to.
        // If Realtime is not used for sync, this manual notification is needed.
        // For MVP, let's assume SyncService listens to Realtime.
        // this.context.syncService?.handleLocalDataChange('notificationService', 'UPDATE', updatedNotification, userId)
        //      .catch(syncError => console.error('Error notifying SyncService for Notification update:', syncError));
        // --- End New ---
        return: updatedNotification
    },
    catch: function (error) {
        var _a;
        console.error("Failed to mark notification ".concat(notificationId, " as read:"), error);
        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError("Failed to mark notification ".concat(notificationId, " as read"), { id: notificationId, userId: userId, error: error.message });
        throw error; // Re-throw the error
    }
};
/**
 * Subscribes UI components to receive updates for unread UI notifications.
 * @param callback The function to call with the current list of unread UI notifications.
 * @returns A function to unsubscribe the listener.
 */
subscribeToUiNotifications(callback, UiNotificationCallback);
(function () { return void {
    console: console,
    : .log('[NotificationService] UI subscribing to notifications.'),
    this: .uiNotificationListeners.push(callback),
    : .unreadUiNotificationsCache, // Pass a copy
    // Return an unsubscribe function
    return: function () { }
}; });
{
    console.log('[NotificationService] UI unsubscribing from notifications.');
    this.uiNotificationListeners = this.uiNotificationListeners.filter(function (listener) { return listener !== callback; });
}
;
notifyUiListeners();
void {
    console: console,
    : .log("[NotificationService] Notifying ".concat(this.uiNotificationListeners.length, " UI listeners with ").concat(this.unreadUiNotificationsCache.length, " notifications.")),
    const: notificationsCopy = __spreadArray([], this.unreadUiNotificationsCache, true), // Pass a copy to prevent external modification
    this: .uiNotificationListeners.forEach(function (listener) {
        var _a;
        try {
            listener(notificationsCopy);
        }
        catch (error) {
            console.error('[NotificationService] Error in UI notification listener:', error);
            (_a = _this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Error in UI notification listener', { error: error });
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
    console: console,
    : .log('[NotificationService] Subscribing to notification realtime updates for user:', userId),
    this: (_o = .context.loggingService) === null || _o === void 0 ? void 0 : _o.logInfo('Subscribing to notification realtime updates', { userId: userId }),
    : .notificationSubscription
};
{
    console.warn('[NotificationService] Already subscribed to notification updates. Unsubscribing existing.');
    this.unsubscribeFromNotificationUpdates();
}
// Subscribe to changes for the current user's notifications
this.notificationSubscription = this.supabase
    .channel("notifications:user_id=eq.".concat(userId)) // Channel filtered by user_id
    .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: "user_id=eq.".concat(userId) }, function (payload) {
    var _a;
    console.log('[NotificationService] Realtime notification change received:', payload);
    var notification = (payload.new || payload.old); // New data for INSERT/UPDATE, old for DELETE
    var eventType = payload.eventType;
    // Update the in-memory cache of unread UI notifications
    if (notification.channel === 'ui') { // Only cache UI notifications
        if (eventType === 'INSERT') {
            if (!notification.is_read) { // Add to cache only if unread
                _this.unreadUiNotificationsCache = __spreadArray(__spreadArray([], _this.unreadUiNotificationsCache, true), [notification], false);
                _this.notifyUiListeners(); // Notify UI listeners
            }
        }
        else if (eventType === 'UPDATE') {
            // Find the notification in the cache
            var index = _this.unreadUiNotificationsCache.findIndex(function (n) { return n.id === notification.id; });
            if (notification.is_read) {
                // If marked as read, remove from cache
                if (index > -1) {
                    _this.unreadUiNotificationsCache = _this.unreadUiNotificationsCache.filter(function (n) { return n.id !== notification.id; });
                    _this.notifyUiListeners(); // Notify UI listeners
                }
            }
            else { // If status changed to unread (less common for updates)
                if (index === -1) { // Add to cache if not already there
                    _this.unreadUiNotificationsCache = __spreadArray(__spreadArray([], _this.unreadUiNotificationsCache, true), [notification], false);
                    _this.notifyUiListeners(); // Notify UI listeners
                }
                else { // Update existing notification in cache
                    _this.unreadUiNotificationsCache = _this.unreadUiNotificationsCache.map(function (n) { return n.id === notification.id ? notification : n; });
                    _this.notifyUiListeners(); // Notify UI listeners
                }
            }
        }
        else if (eventType === 'DELETE') {
            // Remove from cache if deleted
            _this.unreadUiNotificationsCache = _this.unreadUiNotificationsCache.filter(function (n) { return n.id !== notification.id; });
            _this.notifyUiListeners(); // Notify UI listeners
        }
    }
    // Publish a general 'notification_updated' event via EventBus for other modules
    (_a = _this.context.eventBus) === null || _a === void 0 ? void 0 : _a.publish("notification_".concat(eventType.toLowerCase()), notification, userId); // e.g., 'notification_insert', 'notification_update', 'notification_delete'
    // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly
    // this.context.syncService?.handleRemoteDataChange('notificationService', eventType, notification, userId);
})
    .subscribe(function (status, err) {
    var _a;
    console.log('[NotificationService] Notification subscription status:', status);
    if (status === 'CHANNEL_ERROR') {
        console.error('[NotificationService] Notification subscription error:', err);
        (_a = _this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logError('Notification subscription error', { userId: userId, error: err === null || err === void 0 ? void 0 : err.message });
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
    (_p = this.context.loggingService) === null || _p === void 0 ? void 0 : _p.logInfo('Unsubscribing from notification realtime updates');
    this.supabase.removeChannel(this.notificationSubscription);
    this.notificationSubscription = null;
}
""(__makeTemplateObject([""], [""]));
