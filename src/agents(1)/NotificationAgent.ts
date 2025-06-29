```typescript
// src/agents/NotificationAgent.ts
// 通知代理 (Notification Agent)
// Handles operations related to user notifications.
// Part of the Agent System Architecture.
// Design Principle: Encapsulates notification logic.

import { SystemContext, Notification } from '../../interfaces'; // Import types
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types
import { AgentFactory } from './AgentFactory'; // Import AgentFactory

// Import existing services this agent will interact with (temporarily)
// In a full refactor, the logic from these services would move INTO this agent.
// For MVP, this agent acts as a proxy to the existing services.
// import { NotificationService } from '../../modules/notifications/NotificationService'; // Access via context


export class NotificationAgent extends BaseAgent {
    // private notificationService: NotificationService; // Access via context

    constructor(context: SystemContext) {
        super('notification', context);
        // Services are accessed via context
    }

    /**
     * Initializes the Notification Agent.
     */
    init(): void {
        super.init(); // Call base init
        try {
            // Services are accessed via context, no need to get them here explicitly for MVP
            console.log('[NotificationAgent] Init completed.');
        } catch (error) {
            console.error('[NotificationAgent] Failed during init:', error);
            // Handle error
        }
    }


    /**
     * Handles messages directed to the Notification Agent.
     * Performs operations by delegating to the NotificationService.
     * @param message The message to handle. Expected payload varies by type.
     * @returns Promise<AgentResponse> The response containing the result or error.
     */
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
        console.log(`[NotificationAgent] Handling message: ${message.type} (Correlation ID: ${message.correlationId || 'N/A'})`);

        const userId = this.context.currentUser?.id;
        if (!userId) {
             return { success: false, error: 'User not authenticated.' };
        }

        try {
            let result: any;
            switch (message.type) {
                case 'send_notification':
                    // Payload: Omit<Notification, 'id' | 'timestamp' | 'is_read'>
                    if (!message.payload?.message || !message.payload?.type || !message.payload?.channel) {
                         throw new Error('Message, type, and channel are required to send notification.');
                    }
                    // Ensure user_id is set from context if not provided in payload (payload might come from other agents)
                    if (!message.payload.user_id) {
                         message.payload.user_id = userId;
                    }
                    // Delegate to NotificationService
                    result = await this.context.notificationService?.sendNotification(message.payload);
                    if (!result) throw new Error('Failed to send notification.');
                    return { success: true, data: result };

                case 'get_notifications':
                    // Payload: { isRead?: boolean, channel?: Notification['channel'], limit?: number }
                    // Delegate to NotificationService
                    result = await this.context.notificationService?.getNotifications(
                        userId, // Use userId from agent context
                        message.payload?.isRead,
                        message.payload?.channel,
                        message.payload?.limit
                    );
                    return { success: true, data: result };

                case 'mark_as_read':
                    // Payload: { notificationId: string }
                    if (!message.payload?.notificationId) {
                         throw new Error('Notification ID is required to mark as read.');
                    }
                    // Delegate to NotificationService
                    result = await this.context.notificationService?.markAsRead(message.payload.notificationId, userId);
                    if (!result) return { success: false, error: 'Notification not found or not owned by user.' };
                    return { success: true, data: result };


                // TODO: Add cases for other Notification operations (e.g., get_notification_by_id, delete_notification)

                default:
                    console.warn(`[NotificationAgent] Unknown message type: ${message.type}`);
                    return { success: false, error: `Unknown message type for NotificationAgent: ${message.type}` };
            }
        } catch (error: any) {
            console.error(`[NotificationAgent] Error handling message ${message.type}:`, error);
            return { success: false, error: error.message || 'An error occurred in NotificationAgent.' };
        }
    }

    // TODO: Implement methods to send messages to other agents if needed
}
```