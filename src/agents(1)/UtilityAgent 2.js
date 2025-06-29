var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a, _b;
""(__makeTemplateObject(["typescript\n// src/agents/UtilityAgent.ts\n// \u5DE5\u5177\u4EE3\u7406 (Utility Agent)\n// Handles simple utility tasks that don't belong to other core agents (e.g., date formatting, basic calculations).\n// Part of the Agent System Architecture.\n// Design Principle: Provides common, reusable utility functions.\n\nimport { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\n\n// Import existing services/runes this agent might interact with (temporarily)\n// import { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // Access via context\n// import { UIThemeRune } from '../simulated-runes'; // Access via context\n\n\nexport class UtilityAgent extends BaseAgent {\n    // private runeEngraftingCenter: RuneEngraftingCenter; // Access via context\n\n    constructor(context: SystemContext) {\n        super('utility', context);\n        // this.runeEngraftingCenter = context.sacredRuneEngraver; // Get existing service from context\n    }\n\n    /**\n     * Initializes the Utility Agent.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Services/Runes are accessed via context, no need to get them here explicitly for MVP\n            console.log('[UtilityAgent] Init completed.');\n        } catch (error) {\n            console.error('[UtilityAgent] Failed during init:', error);\n            // Handle error\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the Utility Agent.\n     * Performs simple utility tasks by delegating to relevant services or Runes.\n     * @param message The message to handle. Expected payload varies by type.\n     * @returns Promise<AgentResponse> The response containing the result or error.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\n        console.log("], ["typescript\n// src/agents/UtilityAgent.ts\n// \u5DE5\u5177\u4EE3\u7406 (Utility Agent)\n// Handles simple utility tasks that don't belong to other core agents (e.g., date formatting, basic calculations).\n// Part of the Agent System Architecture.\n// Design Principle: Provides common, reusable utility functions.\n\nimport { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\n\n// Import existing services/runes this agent might interact with (temporarily)\n// import { RuneEngraftingCenter } from '../core/rune-engrafting/SacredRuneEngraver'; // Access via context\n// import { UIThemeRune } from '../simulated-runes'; // Access via context\n\n\nexport class UtilityAgent extends BaseAgent {\n    // private runeEngraftingCenter: RuneEngraftingCenter; // Access via context\n\n    constructor(context: SystemContext) {\n        super('utility', context);\n        // this.runeEngraftingCenter = context.sacredRuneEngraver; // Get existing service from context\n    }\n\n    /**\n     * Initializes the Utility Agent.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Services/Runes are accessed via context, no need to get them here explicitly for MVP\n            console.log('[UtilityAgent] Init completed.');\n        } catch (error) {\n            console.error('[UtilityAgent] Failed during init:', error);\n            // Handle error\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the Utility Agent.\n     * Performs simple utility tasks by delegating to relevant services or Runes.\n     * @param message The message to handle. Expected payload varies by type.\n     * @returns Promise<AgentResponse> The response containing the result or error.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\n        console.log("]))[UtilityAgent];
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
");\n\n        const userId = this.context.currentUser?.id;\n        if (!userId) {\n             return { success: false, error: 'User not authenticated.' };\n        }\n\n        try {\n            let result: any;\n            switch (message.type) {\n                case 'insert_date':\n                    // Payload: { format?: string }\n                    console.warn('[UtilityAgent] Simulating insert date.');\n                    await new Promise(resolve => setTimeout(resolve, 50)); // Simulate delay\n                    const now = new Date();\n                    const formattedDate = message.payload?.format ? now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : now.toLocaleString(); // Simple format simulation\n                    result = { status: 'success', date: formattedDate, message: ";
Inserted;
date: $;
{
    formattedDate;
}
Math.pow(" };\n                    return { success: true, data: result };\n\n                case 'apply_text_effect':\n                    // Payload: { text: string, effect: string }\n                    if (!message.payload?.text || !message.payload?.effect) {\n                         throw new Error('text and effect are required for apply_text_effect.');\n                    }\n                    console.warn('[UtilityAgent] Simulating apply text effect.');\n                    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay\n                    let modifiedText = message.payload.text;\n                    switch (message.payload.effect) {\n                        case 'bold': modifiedText = ", $);
{
    modifiedText;
}
Math.pow(, "; break;\n                        case 'italic': modifiedText = ") * $;
{
    modifiedText;
}
 * "; break;\n                        case 'underline': modifiedText = " < u > $;
{
    modifiedText;
}
/u>`; break; / / HTML;
underline;
console.warn("[UtilityAgent] Unknown text effect: ".concat(message.payload.effect));
break;
result = { status: 'success', output: modifiedText, message: "Applied text effect: ".concat(message.payload.effect) };
return { success: true, data: result };
'qr_generate';
// Payload: { text: string }
if (!((_a = message.payload) === null || _a === void 0 ? void 0 : _a.text)) {
    throw new Error('text is required for qr_generate.');
}
console.warn('[UtilityAgent] Simulating QR code generation.');
await new Promise(function (resolve) { return setTimeout(resolve, 300); }); // Simulate delay
// In a real app, you'd use a QR code library or API
var simulatedQrCodeUrl = "https://simulated-qr-code-service.example.com/?text=".concat(encodeURIComponent(message.payload.text));
result = { status: 'success', qrCodeUrl: simulatedQrCodeUrl, message: "Simulated QR code generated for: ".concat(message.payload.text) };
return { success: true, data: result };
'change_theme';
// Payload: { theme: string }
if (!((_b = message.payload) === null || _b === void 0 ? void 0 : _b.theme)) {
    throw new Error('theme is required for change_theme.');
}
console.warn('[UtilityAgent] Simulating changing UI theme.');
// Delegate to UIThemeRune
// if (!this.uiThemeRune) {
//      throw new Error('UI Theme Rune is not available.');
// }
// result = await this.uiThemeRune.setTheme({ theme: message.payload.theme }, userId); // Call rune method
// For MVP, just simulate success
await new Promise(function (resolve) { return setTimeout(resolve, 200); }); // Simulate delay
result = { status: 'simulated_success', message: "Simulated theme changed to ".concat(message.payload.theme, ".") };
return { success: true, data: result };
console.warn("[UtilityAgent] Unknown message type: ".concat(message.type));
return { success: false, error: "Unknown message type for UtilityAgent: ".concat(message.type) };
try { }
catch (error) {
    console.error("[UtilityAgent] Error handling message ".concat(message.type, ":"), error);
    return { success: false, error: error.message || 'An error occurred in UtilityAgent.' };
}
""(__makeTemplateObject([""], [""]));
