var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/agents/NotificationAgent.ts\n// \u901A\u77E5\u4EE3\u7406 (Notification Agent)\n// Handles operations related to user notifications.\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates notification logic.\n\nimport { SystemContext, Notification } from '../../interfaces'; // Import types\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\nimport { AgentFactory } from './AgentFactory'; // Import AgentFactory\n\n// Import existing services this agent will interact with (temporarily)\n// In a full refactor, the logic from these services would move INTO this agent.\n// For MVP, this agent acts as a proxy to the existing services.\n// import { NotificationService } from '../../modules/notifications/NotificationService'; // Access via context\n\n\nexport class NotificationAgent extends BaseAgent {\n    // private notificationService: NotificationService; // Access via context\n\n    constructor(context: SystemContext) {\n        super('notification', context);\n        // Services are accessed via context\n    }\n\n    /**\n     * Initializes the Notification Agent.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Services are accessed via context, no need to get them here explicitly for MVP\n            console.log('[NotificationAgent] Init completed.');\n        } catch (error) {\n            console.error('[NotificationAgent] Failed during init:', error);\n            // Handle error\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the Notification Agent.\n     * Performs operations by delegating to the NotificationService.\n     * @param message The message to handle. Expected payload varies by type.\n     * @returns Promise<AgentResponse> The response containing the result or error.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\n        console.log("], ["typescript\n// src/agents/NotificationAgent.ts\n// \u901A\u77E5\u4EE3\u7406 (Notification Agent)\n// Handles operations related to user notifications.\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates notification logic.\n\nimport { SystemContext, Notification } from '../../interfaces'; // Import types\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\nimport { AgentFactory } from './AgentFactory'; // Import AgentFactory\n\n// Import existing services this agent will interact with (temporarily)\n// In a full refactor, the logic from these services would move INTO this agent.\n// For MVP, this agent acts as a proxy to the existing services.\n// import { NotificationService } from '../../modules/notifications/NotificationService'; // Access via context\n\n\nexport class NotificationAgent extends BaseAgent {\n    // private notificationService: NotificationService; // Access via context\n\n    constructor(context: SystemContext) {\n        super('notification', context);\n        // Services are accessed via context\n    }\n\n    /**\n     * Initializes the Notification Agent.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Services are accessed via context, no need to get them here explicitly for MVP\n            console.log('[NotificationAgent] Init completed.');\n        } catch (error) {\n            console.error('[NotificationAgent] Failed during init:', error);\n            // Handle error\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the Notification Agent.\n     * Performs operations by delegating to the NotificationService.\n     * @param message The message to handle. Expected payload varies by type.\n     * @returns Promise<AgentResponse> The response containing the result or error.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\n        console.log("]))[NotificationAgent];
Handling;
message: $;
{
    message.type;
}
(Correlation);
ID: $;
{
    message.correlationId || 'N/A';
}
");\n\n        const userId = this.context.currentUser?.id;\n        if (!userId) {\n             return { success: false, error: 'User not authenticated.' };\n        }\n\n        try {\n            let result: any;\n            switch (message.type) {\n                case 'send_notification':\n                    // Payload: Omit<Notification, 'id' | 'timestamp' | 'is_read'>\n                    if (!message.payload?.message || !message.payload?.type || !message.payload?.channel) {\n                         throw new Error('Message, type, and channel are required to send notification.');\n                    }\n                    // Ensure user_id is set from context if not provided in payload (payload might come from other agents)\n                    if (!message.payload.user_id) {\n                         message.payload.user_id = userId;\n                    }\n                    // Delegate to NotificationService\n                    result = await this.context.notificationService?.sendNotification(message.payload);\n                    if (!result) throw new Error('Failed to send notification.');\n                    return { success: true, data: result };\n\n                case 'get_notifications':\n                    // Payload: { isRead?: boolean, channel?: Notification['channel'], limit?: number }\n                    // Delegate to NotificationService\n                    result = await this.context.notificationService?.getNotifications(\n                        userId, // Use userId from agent context\n                        message.payload?.isRead,\n                        message.payload?.channel,\n                        message.payload?.limit\n                    );\n                    return { success: true, data: result };\n\n                case 'mark_as_read':\n                    // Payload: { notificationId: string }\n                    if (!message.payload?.notificationId) {\n                         throw new Error('Notification ID is required to mark as read.');\n                    }\n                    // Delegate to NotificationService\n                    result = await this.context.notificationService?.markAsRead(message.payload.notificationId, userId);\n                    if (!result) return { success: false, error: 'Notification not found or not owned by user.' };\n                    return { success: true, data: result };\n\n\n                // TODO: Add cases for other Notification operations (e.g., get_notification_by_id, delete_notification)\n\n                default:\n                    console.warn("[NotificationAgent];
Unknown;
message;
type: $;
{
    message.type;
}
");\n                    return { success: false, error: ";
Unknown;
message;
type;
for (NotificationAgent; ; )
    : $;
{
    message.type;
}
" };\n            }\n        } catch (error: any) {\n            console.error("[NotificationAgent];
Error;
handling;
message;
$;
{
    message.type;
}
", error);\n            return { success: false, error: error.message || 'An error occurred in NotificationAgent.' };\n        }\n    }\n\n    // TODO: Implement methods to send messages to other agents if needed\n}\n"(__makeTemplateObject([""], [""]));
