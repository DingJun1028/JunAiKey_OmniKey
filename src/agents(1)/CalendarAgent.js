var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/agents/CalendarAgent.ts\n// \u65E5\u66C6\u4EE3\u7406\u4EBA (Calendar Agent) - Placeholder\n// Handles operations related to the user's calendar events.\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates calendar management logic.\n// --- Modified: Add operations for calendar events (create, get, update, delete) --\n// --- New: Add Realtime Updates for calendar_events --\n// --- Modified: Update handleMessage to delegate to CalendarService --\n// --- Modified: Update handleMessage to use requestAgent for SupabaseAgent calls --\n\n\nimport { SystemContext, CalendarEvent } from '../../interfaces'; // Assuming SystemContext interface exists, Import CalendarEvent\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\nimport { AgentFactory } from './AgentFactory'; // Import AgentFactory\n\n// Import existing services this agent will interact with (temporarily)\n// In a full refactor, the logic from these services would move INTO this agent.\n// For MVP, this agent acts as a proxy to the existing services.\n// import { CalendarService } from '../core/calendar/CalendarService'; // Access via context\n// import { SupabaseAgent } from './SupabaseAgent'; // Access via requestAgent\n\n\nexport class CalendarAgent extends BaseAgent {\n    // private calendarService: CalendarService; // Access via context\n    // private supabaseAgent: SupabaseAgent; // Access via requestAgent\n\n\n    constructor(context: SystemContext) {\n        super('calendar', context);\n        // Services are accessed via context\n    }\n\n    /**\n     * Initializes the Calendar Agent.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Services are accessed via context, no need to get them here explicitly for MVP\n            console.log('[CalendarAgent] Init completed.');\n\n            // TODO: Subscribe to relevant events (e.g., 'task_completed' with date/time info) to potentially create calendar events\n            // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompleted(payload));\n\n        } catch (error) {\n            console.error('[CalendarAgent] Failed during init:', error);\n            // Handle error\n        }\n    }\n\n    /**\n     * Handles a task completed event to potentially create a calendar event (e.g., for review).\n     * This method is called by the EventBus listener.\n     * @param payload The task completed event payload (includes taskId, userId).\n     */\n    private async handleTaskCompleted(payload: any): Promise<void> {\n        console.log('[CalendarAgent] Handling task_completed event.');\n        // Simulate creating a calendar event for task review 1 day later\n        if (payload?.taskId && payload?.userId) {\n            console.log("], ["typescript\n// src/agents/CalendarAgent.ts\n// \\u65e5\\u66c6\\u4ee3\\u7406\\u4eba (Calendar Agent) - Placeholder\n// Handles operations related to the user's calendar events.\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates calendar management logic.\n// --- Modified: Add operations for calendar events (create, get, update, delete) --\n// --- New: Add Realtime Updates for calendar_events --\n// --- Modified: Update handleMessage to delegate to CalendarService --\n// --- Modified: Update handleMessage to use requestAgent for SupabaseAgent calls --\n\n\nimport { SystemContext, CalendarEvent } from '../../interfaces'; // Assuming SystemContext interface exists, Import CalendarEvent\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\nimport { AgentFactory } from './AgentFactory'; // Import AgentFactory\n\n// Import existing services this agent will interact with (temporarily)\n// In a full refactor, the logic from these services would move INTO this agent.\n// For MVP, this agent acts as a proxy to the existing services.\n// import { CalendarService } from '../core/calendar/CalendarService'; // Access via context\n// import { SupabaseAgent } from './SupabaseAgent'; // Access via requestAgent\n\n\nexport class CalendarAgent extends BaseAgent {\n    // private calendarService: CalendarService; // Access via context\n    // private supabaseAgent: SupabaseAgent; // Access via requestAgent\n\n\n    constructor(context: SystemContext) {\n        super('calendar', context);\n        // Services are accessed via context\n    }\n\n    /**\n     * Initializes the Calendar Agent.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Services are accessed via context, no need to get them here explicitly for MVP\n            console.log('[CalendarAgent] Init completed.');\n\n            // TODO: Subscribe to relevant events (e.g., 'task_completed' with date/time info) to potentially create calendar events\n            // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompleted(payload));\n\n        } catch (error) {\n            console.error('[CalendarAgent] Failed during init:', error);\n            // Handle error\n        }\n    }\n\n    /**\n     * Handles a task completed event to potentially create a calendar event (e.g., for review).\n     * This method is called by the EventBus listener.\n     * @param payload The task completed event payload (includes taskId, userId).\n     */\n    private async handleTaskCompleted(payload: any): Promise<void> {\n        console.log('[CalendarAgent] Handling task_completed event.');\n        // Simulate creating a calendar event for task review 1 day later\n        if (payload?.taskId && payload?.userId) {\n            console.log("]))[CalendarAgent];
Task;
$;
{
    payload.taskId;
}
completed.Simulating;
creating;
review;
event.(__makeTemplateObject([");\n            const reviewDate = new Date();\n            reviewDate.setDate(reviewDate.getDate() + 1); // 1 day later\n            try {\n                // Call the service method to create the event\n                await this.context.calendarService?.createEvent({\n                    user_id: payload.userId,\n                    title: "], [");\n            const reviewDate = new Date();\n            reviewDate.setDate(reviewDate.getDate() + 1); // 1 day later\n            try {\n                // Call the service method to create the event\n                await this.context.calendarService?.createEvent({\n                    user_id: payload.userId,\n                    title: "]));
Review;
Task: $;
{
    payload.taskId;
}
", // Use task ID for title\n                    description: ";
Review;
the;
outcome;
of;
task;
$;
{
    payload.taskId;
}
",\n                    start_timestamp: reviewDate.toISOString(),\n                    all_day: true, // All day event\n                    source: 'task-review', // Source indicates origin\n                    tags: ['task', 'review'],\n                }, payload.userId);\n            } catch (error: any) {\n                console.error("[CalendarAgent];
Error;
creating;
review;
event;
for (task; $; { payload: payload, : .taskId })
    : ", error.message);\n                // Log the error\n            }\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the Calendar Agent.\n     * Performs operations by delegating to the CalendarService.\n     * @param message The message to handle. Expected payload varies by type.\n     * @returns Promise<AgentResponse> The response containing the result or error.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\        console.log("[CalendarAgent];
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
");\\\\\n        const userId = this.context.currentUser?.id;\\        if (!userId) {\\             return { success: false, error: 'User not authenticated.' };\\        }\\\n\\\n        try {\\            let result: any;\\            switch (message.type) {\\                case 'create_event':\\                    // Payload: Omit<CalendarEvent, 'id' | 'created_at' | 'updated_at'>\\                    if (!message.payload?.title || !message.payload?.start_timestamp) {\\                         throw new Error('Title and start_timestamp are required to create event.');\\                    }\\                    // Ensure user_id is set from context if not provided in payload (payload might come from other agents)\\                    if (!message.payload.user_id) {\\                         message.payload.user_id = userId;\\                    }\\                    // Delegate to CalendarService\\                    result = await this.context.calendarService?.createEvent(message.payload, userId);\\                    if (!result) throw new Error('Failed to create event.');\\                    return { success: true, data: result };\\\\\n                case 'get_events':\\                    // Payload: { start?: string, end?: string }\\                    // Delegate to CalendarService\\                    result = await this.context.calendarService?.getEvents(userId, message.payload?.start, message.payload?.end);\\                    return { success: true, data: result };\\\\\n                case 'get_event_by_id':\\                    // Payload: { eventId: string }\\                    if (!message.payload?.eventId) {\\                         throw new Error('Event ID is required.');\\                    }\\                    // Delegate to CalendarService\\                    result = await this.context.calendarService?.getEventById(message.payload.eventId, userId);\\                    if (!result) return { success: false, error: 'Event not found or not accessible.' };\\                    return { success: true, data: result };\\\\\n                case 'update_event':\\                    // Payload: { eventId: string, updates: Partial<Omit<CalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>> }\\                    if (!message.payload?.eventId || !message.payload?.updates) {\\                         throw new Error('Event ID and updates are required to update event.');\\                    }\\                    // Delegate to CalendarService\\                    result = await this.context.calendarService?.updateEvent(\\\n                        message.payload.eventId,\\\n                        message.payload.updates,\\                        userId // Use userId from agent context\\                    );\\                    if (!result) return { success: false, error: 'Event not found or not owned by user.' };\\                    return { success: true, data: result };\\\\\n                case 'delete_event':\\                    // Payload: { eventId: string }\\                    if (!message.payload?.eventId) {\\                         throw new Error('Event ID is required to delete event.');\\                    }\\                    // Delegate to CalendarService\\                    result = await this.context.calendarService?.deleteEvent(message.payload.eventId, userId);\\                    if (!result) return { success: false, error: 'Event not found or not owned by user.' };\\                    return { success: true, data: { eventId: message.payload.eventId } }; // Return deleted ID\\\\\n\\\n                // TODO: Add cases for other Calendar operations (e.g., sync_with_external_calendar)\\\\\n                default:\\                    console.warn("[CalendarAgent];
Unknown;
message;
type: $;
{
    message.type;
}
");\\                    return { success: false, error: ";
Unknown;
message;
type;
for (CalendarAgent; ; )
    : $;
{
    message.type;
}
" };\\            }\\\n        } catch (error: any) {\\            console.error("[CalendarAgent];
Error;
handling;
message;
$;
{
    message.type;
}
", error);\\            return { success: false, error: error.message || 'An error occurred in CalendarAgent.' };\\        }\\\n    }\\\n\\\n    // TODO: Implement methods to send messages to other agents if needed\\    // e.g., notifying NotificationAgent about upcoming events\\}\\\n"(__makeTemplateObject([""], [""]));
