var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
""(__makeTemplateObject(["typescript\n// src/core/execution/ScriptSandbox.ts\n// \u8173\u672C\u6C99\u7BB1 (Script Sandbox) - \u8F14\u52A9\u6A20\u7D44 (Placeholder)\n// Provides a simulated or actual secure environment for executing user-defined scripts (Abilities).\n// In a real application, this would be a robust sandboxing mechanism (e.g., WebAssembly, isolated process).\n// For MVP, this is a placeholder that simulates execution and provides limited access to the system context.\n// Design Principle: Ensures safe and controlled execution of user code.\n// --- Modified: Implement actual script execution using new Function --\n// --- Modified: Refine limitedContextForScript to expose necessary and safe methods --\n// --- Modified: Implement limitedContextForScript methods to use requestAgent --\n\n\nimport { SystemContext } from '../../interfaces';\n// import { RuneEngraftingAgent } from '../agents/RuneEngraftingAgent'; // Access via requestAgent\n// import { SelfNavigationAgent } from '../agents/SelfNavigationAgent'; // Access via requestAgent\n// import { KnowledgeAgent } from '../agents/KnowledgeAgent'; // Access via requestAgent\n// import { NotificationAgent } from '../agents/NotificationAgent'; // Access via requestAgent\n// import { GoalManagementAgent } from '../agents/GoalManagementAgent'; // Access via requestAgent\n// import { LoggingService } from '../logging/LoggingService'; // Access via context\n\n\n/**\n * Simulates a secure sandbox for executing JavaScript/TypeScript code.\n * WARNING: This is NOT a real security sandbox. Executing arbitrary user code\n * in a browser or Node.js environment without a proper sandbox is dangerous.\n * This implementation uses "], ["typescript\n// src/core/execution/ScriptSandbox.ts\n// \\u8173\\u672c\\u6c99\\u7bb1 (Script Sandbox) - \\u8f14\\u52a9\\u6a20\\u7d44 (Placeholder)\n// Provides a simulated or actual secure environment for executing user-defined scripts (Abilities).\n// In a real application, this would be a robust sandboxing mechanism (e.g., WebAssembly, isolated process).\n// For MVP, this is a placeholder that simulates execution and provides limited access to the system context.\n// Design Principle: Ensures safe and controlled execution of user code.\n// --- Modified: Implement actual script execution using new Function --\n// --- Modified: Refine limitedContextForScript to expose necessary and safe methods --\n// --- Modified: Implement limitedContextForScript methods to use requestAgent --\n\n\nimport { SystemContext } from '../../interfaces';\n// import { RuneEngraftingAgent } from '../agents/RuneEngraftingAgent'; // Access via requestAgent\n// import { SelfNavigationAgent } from '../agents/SelfNavigationAgent'; // Access via requestAgent\n// import { KnowledgeAgent } from '../agents/KnowledgeAgent'; // Access via requestAgent\n// import { NotificationAgent } from '../agents/NotificationAgent'; // Access via requestAgent\n// import { GoalManagementAgent } from '../agents/GoalManagementAgent'; // Access via requestAgent\n// import { LoggingService } from '../logging/LoggingService'; // Access via context\n\n\n/**\n * Simulates a secure sandbox for executing JavaScript/TypeScript code.\n * WARNING: This is NOT a real security sandbox. Executing arbitrary user code\n * in a browser or Node.js environment without a proper sandbox is dangerous.\n * This implementation uses "]));
new (Function(__makeTemplateObject([" which provides some isolation but is not\n * a full security sandbox. It is for MVP demonstration purposes only.\n */\nexport class ScriptSandbox {\n    private context: SystemContext;\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        console.log('ScriptSandbox initialized (using new Function).'); // Updated log\n        // TODO: Initialize actual sandboxing mechanism if used (e.g., WebAssembly runtime)\n    }\n\n    /**\n     * Executes a script within the simulated sandbox.\n     * Provides limited access to the system context for the script.\n     * @param script The script code (as a string). Required.\n     * @param params Optional parameters to pass to the script.\n     * @param userId The user ID executing the script. Required.\n     * @returns Promise<any> The result of the script execution.\n     */\n    async execute(script: string, params: any, userId: string): Promise<any> {\n        console.log("], [" which provides some isolation but is not\n * a full security sandbox. It is for MVP demonstration purposes only.\n */\nexport class ScriptSandbox {\n    private context: SystemContext;\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        console.log('ScriptSandbox initialized (using new Function).'); // Updated log\n        // TODO: Initialize actual sandboxing mechanism if used (e.g., WebAssembly runtime)\n    }\n\n    /**\n     * Executes a script within the simulated sandbox.\n     * Provides limited access to the system context for the script.\n     * @param script The script code (as a string). Required.\n     * @param params Optional parameters to pass to the script.\n     * @param userId The user ID executing the script. Required.\n     * @returns Promise<any> The result of the script execution.\n     */\n    async execute(script: string, params: any, userId: string): Promise<any> {\n        console.log("]))[ScriptSandbox]);
Executing;
script;
for (user; ; )
    : $;
{
    userId;
}
params: ", params); // Updated log\n        this.context.loggingService?.logInfo(";
Executing;
script(__makeTemplateObject([", { userId, scriptLength: script.length, params });\n\n\n        if (!userId) {\n             console.error('[ScriptSandbox] Cannot execute script: User ID is required.');\n             this.context.loggingService?.logError('Script execution failed: User ID is required.');\n             throw new Error('User ID is required to execute script.');\n        }\n\n        // --- Modified: Provide a limited system context to the script --\n        // This is a crucial part of enabling scripts to interact with the system.\n        // We expose only necessary and safe methods by accessing them via the main context.\n        // WARNING: Exposing the full context directly is a security risk.\n        // --- Modified: Implement methods to use requestAgent --\n        const limitedContextForScript = {\n            // Expose specific Rune execution method\n            executeRuneAction: async (runeId: string, action: string, actionParams: any) => {\n                console.log("], [", { userId, scriptLength: script.length, params });\n\n\n        if (!userId) {\n             console.error('[ScriptSandbox] Cannot execute script: User ID is required.');\n             this.context.loggingService?.logError('Script execution failed: User ID is required.');\n             throw new Error('User ID is required to execute script.');\n        }\n\n        // --- Modified: Provide a limited system context to the script --\n        // This is a crucial part of enabling scripts to interact with the system.\n        // We expose only necessary and safe methods by accessing them via the main context.\n        // WARNING: Exposing the full context directly is a security risk.\n        // --- Modified: Implement methods to use requestAgent --\n        const limitedContextForScript = {\n            // Expose specific Rune execution method\n            executeRuneAction: async (runeId: string, action: string, actionParams: any) => {\n                console.log("]))[ScriptSandbox];
Script;
calling;
executeRuneAction: $;
{
    runeId;
}
$;
{
    action;
}
");\n                // Call the RuneEngraftingAgent via requestAgent\n                if (!this.context.agentFactory?.getAgent('rune_engrafting')) {\n                     console.error('[ScriptSandbox] RuneEngraftingAgent not available for script.');\n                     throw new Error('Rune execution service not available.');\n                }\n                const response = await this.context.agentFactory.getAgent('rune_engrafting')!.requestAgent(\n                    'rune_engrafting', // Target agent name (itself)\n                    'execute_rune_action', // Message type\n                    { runeId, action, params: actionParams }, // Payload\n                    60000 // Timeout\n                );\n                if (!response.success) throw new Error(response.error || 'Rune execution failed.');\n                return response.data; // Return the data from the agent's response\n            },\n            // Expose specific Task/Flow creation methods\n            createTask: async (description: string, steps: any[], linkedKrId?: string) => {\n                 console.log("[ScriptSandbox];
Script;
calling;
createTask: $;
{
    description.substring(0, 50);
}
");\n                 // Call the SelfNavigationAgent via requestAgent\n                 if (!this.context.agentFactory?.getAgent('self_navigation')) {\n                     console.error('[ScriptSandbox] SelfNavigationAgent not available for script.');\n                     throw new Error('Task creation service not available.');\n                 }\n                 const response = await this.context.agentFactory.getAgent('self_navigation')!.requestAgent(\n                     'self_navigation', // Target agent name (itself)\n                     'create_task', // Message type\n                     { description, steps, linkedKrId }, // Payload\n                     15000 // Timeout\n                 );\n                 if (!response.success) throw new Error(response.error || 'Task creation failed.');\n                 return response.data; // Return the created task data\n            },\n             createAgenticFlow: async (flowDetails: any) => {\n                 console.log("[ScriptSandbox];
Script;
calling;
createAgenticFlow: $;
{
    flowDetails.name || 'Unnamed Flow';
}
");\n                 // Call the SelfNavigationAgent via requestAgent\n                 if (!this.context.agentFactory?.getAgent('self_navigation')) {\n                     console.error('[ScriptSandbox] SelfNavigationAgent not available for script.');\n                     throw new Error('Agentic Flow creation service not available.');\n                 }\n                 const response = await this.context.agentFactory.getAgent('self_navigation')!.requestAgent(\n                     'self_navigation', // Target agent name (itself)\n                     'create_agentic_flow', // Message type\n                     flowDetails, // Payload (the flow details)\n                     15000 // Timeout\n                 );\n                 if (!response.success) throw new Error(response.error || 'Agentic Flow creation failed.');\n                 return response.data; // Return the created flow data\n             },\n            // Expose specific Knowledge Sync methods\n            saveKnowledge: async (question: string, answer: string, source?: string, devLogDetails?: any) => {\n                 console.log("[ScriptSandbox];
Script;
calling;
saveKnowledge: $;
{
    question.substring(0, 50);
}
");\n                 // Call the KnowledgeAgent via requestAgent\n                 if (!this.context.agentFactory?.getAgent('knowledge')) {\n                     console.error('[ScriptSandbox] KnowledgeAgent not available for script.');\n                     throw new Error('Knowledge saving service not available.');\n                 }\n                 const response = await this.context.agentFactory.getAgent('knowledge')!.requestAgent(\n                     'knowledge', // Target agent name (itself)\n                     'create_knowledge_point', // Message type\n                     { question, answer, source, devLogDetails }, // Payload\n                     10000 // Timeout\n                 );\n                 if (!response.success) throw new Error(response.error || 'Knowledge saving failed.');\n                 return response.data; // Return the saved record data\n            },\n             searchKnowledge: async (query: string, useSemanticSearch?: boolean) => {\n                 console.log("[ScriptSandbox];
Script;
calling;
searchKnowledge: $;
{
    query.substring(0, 50);
}
");\n                 // Call the KnowledgeAgent via requestAgent\n                 if (!this.context.agentFactory?.getAgent('knowledge')) {\n                     console.error('[ScriptSandbox] KnowledgeAgent not available for script.');\n                     throw new Error('Knowledge search service not available.');\n                 }\n                 const response = await this.context.agentFactory.getAgent('knowledge')!.requestAgent(\n                     'knowledge', // Target agent name (itself)\n                     'query_knowledge', // Message type\n                     { query, useSemanticSearch }, // Payload\n                     10000 // Timeout\n                 );\n                 if (!response.success) throw new Error(response.error || 'Knowledge search failed.');\n                 return response.data; // Return the search results (array of records)\n             },\n            // Expose specific Notification sending method\n            sendNotification: async (notificationDetails: any) => {\n                 console.log("[ScriptSandbox];
Script;
calling;
sendNotification: $;
{
    notificationDetails.message.substring(0, 50);
}
");\n                 // Call the NotificationAgent via requestAgent\n                 // Ensure user_id is set to the executing user\n                 if (!this.context.agentFactory?.getAgent('notification')) {\n                     console.error('[ScriptSandbox] NotificationAgent not available for script.');\n                     throw new Error('Notification service not available.');\n                 }\n                 const response = await this.context.agentFactory.getAgent('notification')!.requestAgent(\n                     'notification', // Target agent name (itself)\n                     'send_notification', // Message type\n                     notificationDetails, // Payload (includes user_id set by the agent)\n                     5000 // Timeout\n                 );\n                 if (!response.success) throw new Error(response.error || 'Notification sending failed.');\n                 return response.data; // Return the created notification data\n            },\n             // Expose specific Goal Management methods\n             updateGoalProgress: async (krId: string, currentValue: number) => {\n                 console.log("[ScriptSandbox];
Script;
calling;
updateGoalProgress: KR;
$;
{
    krId;
}
to;
$;
{
    currentValue;
}
");\n                 // Call the GoalManagementAgent via requestAgent\n                 if (!this.context.agentFactory?.getAgent('goal_management')) {\n                     console.error('[ScriptSandbox] GoalManagementAgent not available for script.');\n                     throw new Error('Goal management service not available.');\n                 }\n                 const response = await this.context.agentFactory.getAgent('goal_management')!.requestAgent(\n                     'goal_management', // Target agent name (itself)\n                     'update_key_result_progress', // Message type\n                     { krId, currentValue }, // Payload\n                     10000 // Timeout\n                 );\n                 if (!response.success) throw new Error(response.error || 'Goal progress update failed.');\n                 return response.data; // Return the updated KR data\n             },\n            // Expose logging methods (optional, but useful for script debugging)\n            logInfo: (message: string, details?: any) => {\n                 console.log("[ScriptSandbox];
Script;
Log(Info);
$;
{
    message;
}
", details);\n                 this.context.loggingService?.logInfo(";
Script;
Log: $;
{
    message;
}
", { userId, details, scriptParams: params });\n            },\n             logWarning: (message: string, details?: any) => {\n                 console.warn("[ScriptSandbox];
Script;
Log(Warning);
$;
{
    message;
}
", details);\n                 this.context.loggingService?.logWarning(";
Script;
Log: $;
{
    message;
}
", { userId, details, scriptParams: params });\n             },\n             logError: (message: string, details?: any) => {\n                 console.error("[ScriptSandbox];
Script;
Log(Error);
$;
{
    message;
}
", details);\n                 this.context.loggingService?.logError(";
Script;
Log: $;
{
    message;
}
", { userId, details, scriptParams: params });\n             },\n            // Add other safe methods the script should be able to call\n            // e.g., access to user profile data (read-only), access to linked integrations (read-only status)\n            currentUser: this.context.currentUser, // Provide current user info (read-only)\n        };\n        // --- End Modified --\n\n\n        // Simulate execution by evaluating the script string using new Function.\n        // This provides some scope isolation but is not a full security sandbox.\n        // WARNING: Do NOT use ";
eval(__makeTemplateObject([" or "], [" or "]));
new (Function(__makeTemplateObject([" with untrusted code in production\n        // without a proper sandboxing mechanism (like vm2 in Node.js or WebAssembly).\n        try {\n            // Wrap the script in an async function to allow await inside\n            // Pass 'params' and 'context' as arguments to the function\n            const scriptFunction = new Function('params', 'context', "], [" with untrusted code in production\n        // without a proper sandboxing mechanism (like vm2 in Node.js or WebAssembly).\n        try {\n            // Wrap the script in an async function to allow await inside\n            // Pass 'params' and 'context' as arguments to the function\n            const scriptFunction = new Function('params', 'context', "])));
"use strict"; // Enforce strict mode inside the script
return (function () { return __awaiter(_this, void 0, void 0, function () {
    var executeRuneAction, createTask, createAgenticFlow, saveKnowledge, searchKnowledge, sendNotification, updateGoalProgress, logInfo, logWarning, logError, currentUser;
    return __generator(this, function (_a) {
        executeRuneAction = context.executeRuneAction, createTask = context.createTask, createAgenticFlow = context.createAgenticFlow, saveKnowledge = context.saveKnowledge, searchKnowledge = context.searchKnowledge, sendNotification = context.sendNotification, updateGoalProgress = context.updateGoalProgress, logInfo = context.logInfo, logWarning = context.logWarning, logError = context.logError, currentUser = context.currentUser;
        // Execute the user's script code
        // The script is expected to be the body of an async function.
        // It can use 'await' and the provided 'context' methods.
        // The return value of the script code will be the result of the function.
        $;
        {
            script;
        }
        return [2 /*return*/];
    });
}); })(); // Immediately invoke the async wrapper function
");\n\n            // Execute the wrapped script function, passing params and the limited context\n            // The result will be the promise returned by the async function.\n            const result = await scriptFunction(params, limitedContextForScript);\n\n            console.log('[ScriptSandbox] Script execution finished.');\n            // Return the result obtained from the script's execution\n            return result;\n\n        } catch (error: any) {\n            console.error('[ScriptSandbox] Error during script execution:', error);\n            this.context.loggingService?.logError('Error during script execution', { userId, scriptLength: script.length, params, error: error.message });\n            // Return a structured error result\n            throw new Error(";
Script;
execution;
failed: $;
{
    error.message;
}
");\n        }\n    }\n\n    // TODO: Implement a real, secure sandboxing mechanism (e.g., vm2, WebAssembly, isolated process).\n    // TODO: Define a clear API/interface that scripts can use to interact with the system (via the limited context).\n    // TODO: Implement resource limits (CPU, memory, time) for script execution.\n    // TODO: Implement logging and monitoring of script execution within the sandbox.\n}\n"(__makeTemplateObject([""], [""]));
