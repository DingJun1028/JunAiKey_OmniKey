var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/agents/UIAgent.ts\n// UI \u4EE3\u7406 (UI Agent)// Handles interactions with the user interface (e.g., displaying notifications, changing theme, showing modals).// Part of the Agent System Architecture.// Design Principle: Encapsulates UI-specific logic and state management.// --- Modified: Add robust error handling and logging --\\// --- Modified: Ensure structured error responses are returned --\\// --- Modified: Add more detailed logging --\\// --- Modified: Ensure handleMessage correctly returns ActionIntent in data --\\// --- Modified: Ensure analyzeIntentAndDecideAction can identify create_task intent --\\// --- New: Add placeholder logic for recognizing \"deep thinking\" intents --\\// --- Modified: Update analyze_input_for_suggestions payload to include multimodal content --\\// --- Modified: Update handleMessage to use requestAgent for provider agent calls --\\// --- Modified: Update handleMessage to use requestAgent for KnowledgeAgent and NotificationAgent calls ---\\// --- Modified: Update handleMessage to use requestAgent for NotificationAgent and RuneEngraftingAgent calls ---import { SystemContext } from '../../interfaces'; // Assuming SystemContext interface existsimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types// Import existing services/runes this agent might interact with (temporarily)// import { NotificationService } from '../modules/notifications/NotificationService'; // Access via requestAgent// import { UIThemeRune } from '../simulated-runes'; // Access via requestAgentexport class UIAgent extends BaseAgent {    // private notificationService: NotificationService; // Access via requestAgent    // private uiThemeRune: UIThemeRune | null = null; // Access via requestAgent    constructor(context: SystemContext) {        super('ui', context);        // Services/Runes are accessed via requestAgent or context    }    /**     * Initializes the UI Agent by getting references to relevant runes/services.     */    init(): void {        super.init(); // Call base init        try {            // Services/Runes are accessed via requestAgent or context, no need to get them here explicitly for MVP            console.log('[UIAgent] Init completed.');        } catch (error) {            console.error('[UIAgent] Failed during init:', error);            // Handle error        }    }    /**     * Handles messages directed to the UI Agent.     * Performs UI-specific operations (simulated).     * @param message The message to handle. Expected payload varies by type.     * @returns Promise<AgentResponse> The response containing the result or error.     */    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\        console.log("], ["typescript\n// src/agents/UIAgent.ts\n// UI \\u4ee3\\u7406 (UI Agent)\\\n// Handles interactions with the user interface (e.g., displaying notifications, changing theme, showing modals).\\\n// Part of the Agent System Architecture.\\\n// Design Principle: Encapsulates UI-specific logic and state management.\\\n// --- Modified: Add robust error handling and logging --\\\\\\\n// --- Modified: Ensure structured error responses are returned --\\\\\\\n// --- Modified: Add more detailed logging --\\\\\\\n// --- Modified: Ensure handleMessage correctly returns ActionIntent in data --\\\\\\\n// --- Modified: Ensure analyzeIntentAndDecideAction can identify create_task intent --\\\\\\\n// --- New: Add placeholder logic for recognizing \\\"deep thinking\\\" intents --\\\\\\\n// --- Modified: Update analyze_input_for_suggestions payload to include multimodal content --\\\\\\\n// --- Modified: Update handleMessage to use requestAgent for provider agent calls --\\\\\\\n// --- Modified: Update handleMessage to use requestAgent for KnowledgeAgent and NotificationAgent calls ---\\\\\\\n// --- Modified: Update handleMessage to use requestAgent for NotificationAgent and RuneEngraftingAgent calls ---\\\n\\\n\\\nimport { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists\\\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\\\n\\\n// Import existing services/runes this agent might interact with (temporarily)\\\n// import { NotificationService } from '../modules/notifications/NotificationService'; // Access via requestAgent\\\n// import { UIThemeRune } from '../simulated-runes'; // Access via requestAgent\\\n\\\n\\\nexport class UIAgent extends BaseAgent {\\\n    // private notificationService: NotificationService; // Access via requestAgent\\\n    // private uiThemeRune: UIThemeRune | null = null; // Access via requestAgent\\\n\\\n    constructor(context: SystemContext) {\\\n        super('ui', context);\\\n        // Services/Runes are accessed via requestAgent or context\\\n    }\\\n\\\n    /**\\\n     * Initializes the UI Agent by getting references to relevant runes/services.\\\n     */\\\n    init(): void {\\\n        super.init(); // Call base init\\\n        try {\\\n            // Services/Runes are accessed via requestAgent or context, no need to get them here explicitly for MVP\\\n            console.log('[UIAgent] Init completed.');\\\n        } catch (error) {\\\n            console.error('[UIAgent] Failed during init:', error);\\\n            // Handle error\\\n        }\\\n    }\\\n\\\n\\\n    /**\\\n     * Handles messages directed to the UI Agent.\\\n     * Performs UI-specific operations (simulated).\\\n     * @param message The message to handle. Expected payload varies by type.\\\n     * @returns Promise<AgentResponse> The response containing the result or error.\\\n     */\\\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\\\\\n        console.log("]))[UIAgent];
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
");\\\\\n        const userId = this.context.currentUser?.id;\\        if (!userId) {\\             return { success: false, error: 'User not authenticated.' };\\        }\\\n\\\n        try {\\            let result: any;\\            switch (message.type) {\\                case 'display_notification':\\                    // Payload: { type: string, message: string, details?: any }\\                    if (!message.payload?.message || !message.payload?.type) {\\                         throw new Error('message and type are required for display_notification.');\\                    }\\                    console.log('[UIAgent] Sending send_notification message to NotificationAgent...');\\                    // --- Modified: Delegate to NotificationAgent ---\\                    // Use sendMessage (fire and forget) as we don't need to wait for the notification result here\\                    this.sendMessage({\\\n                        type: 'send_notification', // Message type for NotificationAgent\\\n                        payload: { ...message.payload, user_id: userId, channel: 'ui' }, // Pass details, ensure user_id and UI channel\\\n                        recipient: 'notification', // Target the NotificationAgent\\\n                        // No correlationId needed for this fire-and-forget message\\\n                        sender: this.agentName,\\                    });\\                    // --- End Modified ---\\                    result = { status: 'delegated', message: 'Notification message sent to NotificationAgent.' };\\                    return { success: true, data: result };\\\\\n                case 'change_theme':\\                    // Payload: { theme: string }\\                    if (!message.payload?.theme) {\\                         throw new Error('theme is required for change_theme.');\\                    }\\\n                    console.log('[UIAgent] Sending execute_rune_action message to RuneEngraftingAgent for UI theme...');\\                    // --- Modified: Delegate to RuneEngraftingAgent for UIThemeRune ---\\                    // Use requestAgent if you need confirmation, otherwise sendMessage is fine.\\                    // Let's use sendMessage (fire and forget) for UI updates.\\                    this.sendMessage({\\\n                        type: 'execute_rune_action', // Message type for RuneEngraftingAgent\\\n                        payload: { runeId: 'ui-theme-rune', action: 'setTheme', params: { theme: message.payload.theme }, user_id: userId }, // Pass runeId, action, params, user_id\\\n                        recipient: 'rune_engrafting', // Target the RuneEngraftingAgent\\\n                        // No correlationId needed for this fire-and-forget message\\\n                        sender: this.agentName,\\                    });\\                    // --- End Modified ---\\                    result = { status: 'delegated', message: ";
Theme;
change;
message;
sent;
to;
RuneEngraftingAgent;
for (theme; $; { message: message, : .payload.theme }.(__makeTemplateObject([" };\\                    return { success: true, data: result };\\\\\n                case 'show_modal':\\                    // Payload: { type: string, data: any }\\                    if (!message.payload?.type || !message.payload?.data) {\\                         throw new Error('type and data are required for show_modal.');\\                    }\\\n                    console.warn("], [" };\\\\\\\n                    return { success: true, data: result };\\\\\\\n\\\\\\n                case 'show_modal':\\\\\\\n                    // Payload: { type: string, data: any }\\\\\\\n                    if (!message.payload?.type || !message.payload?.data) {\\\\\\\n                         throw new Error('type and data are required for show_modal.');\\\\\\\n                    }\\\\\\n                    console.warn("]))[UIAgent])
    Simulating;
showing;
modal;
of;
type: $;
{
    message.payload.type;
}
");\\                    // In a real app, this would update a UI state to show a specific modal component\\                    // For MVP, just log it\\\n                    this.context.loggingService?.logInfo(";
Simulating;
showing;
modal: $;
{
    message.payload.type;
}
", { userId, modalType: message.payload.type, modalData: message.payload.data });\\                    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay\\                    result = { status: 'simulated_success', message: ";
Simulated;
showing;
modal;
of;
message.payload.type;
" };\\                    return { success: true, data: result };\\\\\n                // TODO: Add cases for other UI interactions (e.g., show_toast, navigate_to_page, update_ui_element)\\\\\n                default:\\                    console.warn("[UIAgent];
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
for (UIAgent; ; )
    : $;
{
    message.type;
}
" };\\            }\\\n        } catch (error: any) {\\            console.error("[UIAgent];
Error;
handling;
message;
$;
{
    message.type;
}
", error);\\            return { success: false, error: error.message || 'An error occurred in UIAgent.' };\\        }\\\n    }\\\n\\\n    // TODO: Implement methods to send messages to other agents if needed\\}\\\n"(__makeTemplateObject([""], [""]));
