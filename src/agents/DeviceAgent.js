var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var _a, _b;
""(__makeTemplateObject(["typescript\n// src/agents/DeviceAgent.ts\n// \u88DD\u7F6E\u4EE3\u7406 (Device Agent)\n// Handles interactions with the user's device (e.g., clipboard, notifications, file system access).\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates device-specific logic and permissions.\n// --- Modified: Add operations for device interactions (clipboard, share, workingCopy, file, web) --\n// --- Modified: Update handleMessage to delegate to relevant services or Runes --\n// --- Modified: Update handleMessage to use requestAgent for RuneEngraftingCenter, FileService, WisdomSecretArt calls --\n\n\nimport { SystemContext, CalendarEvent } from '../../interfaces'; // Assuming SystemContext interface exists, Import CalendarEvent\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\n\n// Import existing services/runes this agent might interact with (temporarily)\n// import { FileService } from '../core/files/FileService'; // Access via context\n// import { NotificationService } from '../modules/notifications/NotificationService'; // Access via context\n// import { WorkingCopyRune } from '../runes/WorkingCopyRune'; // Access via context\n// import { DeviceClipboardRune } from '../simulated-runes'; // Access via context\n// import { WebRune } from '../runes/WebRune'; // Access via context\n// import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // Access via context\n\n\nexport class DeviceAgent extends BaseAgent {\n    // private fileService: FileService; // Access via context\n    // private notificationService: NotificationService; // Access via context\n    // private workingCopyRune: WorkingCopyRune | null = null; // Reference to the WorkingCopyRune\n    // private deviceClipboardRune: DeviceClipboardRune | null = null; // Reference to the DeviceClipboardRune\n    // private webRune: WebRune | null = null; // Reference to the WebRune\n    // private wisdomSecretArt: WisdomSecretArt; // Access via context\n\n\n    constructor(context: SystemContext) {\n        super('device', context);\n        // Services/Runes are accessed via context\n    }\n\n    /**\n     * Initializes the Device Agent by getting references to relevant runes/services.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Get references to Runes from the RuneEngraftingCenter via context\n            // This is how agents interact with specific Rune implementations\n            // this.workingCopyRune = this.context.sacredRuneEngraver?.runeImplementations.get('working-copy-rune')?.instance || null;\n            // this.deviceClipboardRune = this.context.sacredRuneEngraver?.runeImplementations.get('device-clipboard-rune')?.instance || null;\n            // this.webRune = this.context.sacredRuneEngraver?.runeImplementations.get('web-rune')?.instance || null;\n            console.log('[DeviceAgent] Init completed.');\n        } catch (error) {\n            console.error('[DeviceAgent] Failed during init:', error);\n            // Handle error\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the Device Agent.\n     * Performs device-specific operations by delegating to relevant services or Runes.\n     * @param message The message to handle. Expected payload varies by type.\n     * @returns Promise<AgentResponse> The response containing the result or error.     */    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\        console.log("], ["typescript\n// src/agents/DeviceAgent.ts\n// \\u88dd\\u7f6e\\u4ee3\\u7406 (Device Agent)\n// Handles interactions with the user's device (e.g., clipboard, notifications, file system access).\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates device-specific logic and permissions.\n// --- Modified: Add operations for device interactions (clipboard, share, workingCopy, file, web) --\n// --- Modified: Update handleMessage to delegate to relevant services or Runes --\n// --- Modified: Update handleMessage to use requestAgent for RuneEngraftingCenter, FileService, WisdomSecretArt calls --\n\n\nimport { SystemContext, CalendarEvent } from '../../interfaces'; // Assuming SystemContext interface exists, Import CalendarEvent\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types\n\n// Import existing services/runes this agent might interact with (temporarily)\n// import { FileService } from '../core/files/FileService'; // Access via context\n// import { NotificationService } from '../modules/notifications/NotificationService'; // Access via context\n// import { WorkingCopyRune } from '../runes/WorkingCopyRune'; // Access via context\n// import { DeviceClipboardRune } from '../simulated-runes'; // Access via context\n// import { WebRune } from '../runes/WebRune'; // Access via context\n// import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // Access via context\n\n\nexport class DeviceAgent extends BaseAgent {\n    // private fileService: FileService; // Access via context\n    // private notificationService: NotificationService; // Access via context\n    // private workingCopyRune: WorkingCopyRune | null = null; // Reference to the WorkingCopyRune\n    // private deviceClipboardRune: DeviceClipboardRune | null = null; // Reference to the DeviceClipboardRune\n    // private webRune: WebRune | null = null; // Reference to the WebRune\n    // private wisdomSecretArt: WisdomSecretArt; // Access via context\n\n\n    constructor(context: SystemContext) {\n        super('device', context);\n        // Services/Runes are accessed via context\n    }\n\n    /**\n     * Initializes the Device Agent by getting references to relevant runes/services.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Get references to Runes from the RuneEngraftingCenter via context\n            // This is how agents interact with specific Rune implementations\n            // this.workingCopyRune = this.context.sacredRuneEngraver?.runeImplementations.get('working-copy-rune')?.instance || null;\n            // this.deviceClipboardRune = this.context.sacredRuneEngraver?.runeImplementations.get('device-clipboard-rune')?.instance || null;\n            // this.webRune = this.context.sacredRuneEngraver?.runeImplementations.get('web-rune')?.instance || null;\n            console.log('[DeviceAgent] Init completed.');\n        } catch (error) {\n            console.error('[DeviceAgent] Failed during init:', error);\n            // Handle error\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the Device Agent.\n     * Performs device-specific operations by delegating to relevant services or Runes.\n     * @param message The message to handle. Expected payload varies by type.\n     * @returns Promise<AgentResponse> The response containing the result or error.\\\n     */\\\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\\\\\n        console.log("]))[DeviceAgent];
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
");\\        const userId = this.context.currentUser?.id;\\        if (!userId) {\\             return { success: false, error: 'User not authenticated.' };\\        }\\        try {\\            let result: any;\\            switch (message.type) {\\                case 'trigger_clipboard_action':\\                    // Payload: { action: 'get' | 'set', content?: string }\\                    if (!message.payload?.action) {\\                         throw new Error('action is required for trigger_clipboard_action.');\\                    }\\                    // Delegate to DeviceClipboardRune via RuneEngraftingCenter\\                    if (!this.context.sacredRuneEngraver) { // Check if RuneEngraver is available\\                         throw new Error('RuneEngraftingCenter is not available.');\\                    }\\                    // Request the action from the RuneEngraftingCenter\\                    // --- Modified: Use requestAgent for RuneEngraftingCenter call ---\\\n                    result = await this.requestAgent(\\\n                        'rune_engrafting', // Target the RuneEngrafting Agent\\\n                        'execute_rune_action', // Message type for RuneEngrafting Agent\\                        {\\\n                            runeId: 'device-clipboard-rune', // The specific Rune ID\\\n                            action: message.payload.action === 'get' ? 'getClipboard' : 'setClipboard', // Map action to rune method\\                            params: { content: message.payload.content }, // Pass parameters\\                        },\\\n                        5000 // Timeout for rune execution\\                    );\\                    // The result from requestAgent is already an AgentResponse from RuneEngraftingAgent.\\\n                    // We just return it directly.\\\n                    return result;\\                    // --- End Modified ---\\                case 'share_content':\\                    // Payload: { content: string, type?: 'text' | 'url' | 'file' }\\                    if (!message.payload?.content) {\\                         throw new Error('content is required for share_content.');\\                    }\\                    console.warn('[DeviceAgent] Simulating share content.');\\                    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay\\                    result = { status: 'simulated_success', message: 'Simulated sharing content.' };\\                    return { success: true, data: result };\\\\\n                case 'interact_with_working_copy':\\                    // Payload: { command: string, params?: any }\\                    if (!message.payload?.command) {\\                         throw new Error('command is required for interact_with_working_copy.');\\                    }\\                    // Delegate to WorkingCopyRune via RuneEngraftingCenter\\                    if (!this.context.sacredRuneEngraver) { // Check if RuneEngraver is available\\                         throw new Error('RuneEngraftingCenter is not available.');\\                    }\\                    // Request the action from the RuneEngraftingCenter\\                    result = await this.requestAgent(\\\n                        'rune_engrafting', // Target the RuneEngrafting Agent\\\n                        'execute_rune_action', // Message type for RuneEngrafting Agent\\                        {\\\n                            runeId: 'working-copy-rune', // The specific Rune ID\\\n                            action: message.payload.command, // The command to execute on the rune\\\n                            params: message.payload.params, // Pass parameters\\                        },\\\n                        10000 // Timeout for rune execution\\                    );\\                    // The result from requestAgent is already an AgentResponse from RuneEngraftingAgent.\\\n                    // We just return it directly.\\\n                    return result;\\                case 'read_file': // Example using FileService\\                    // Payload: { filePath: string }\\                    if (!message.payload?.filePath) throw new Error('filePath is required.');\\                    // Delegate to FileService (or a dedicated FileAgent if one exists)\\                    if (!this.context.fileService) throw new Error('FileService is not available.');\\                    result = await this.context.fileService.readFile(message.payload.filePath, userId);\\                    return { success: true, data: { content: result } };\\                case 'write_file': // Example using FileService\\                    // Payload: { filePath: string, content: string }\\                    if (!message.payload?.filePath || message.payload?.content === undefined) throw new Error('filePath and content are required.');\\                    // Delegate to FileService\\                    if (!this.context.fileService) throw new Error('FileService is not available.');\\                    await this.context.fileService.writeFile(message.payload.filePath, message.payload.content, userId);\\                    return { success: true, data: { message: ";
File;
written: $;
{
    message.payload.filePath;
}
" } };\\                case 'delete_file': // Example using FileService\\                    // Payload: { filePath: string }\\                    if (!message.payload?.filePath) throw new Error('filePath is required.');\\                    // Delegate to FileService\\                    if (!this.context.fileService) throw new Error('FileService is not available.');\\                    await this.context.fileService.deleteFile(message.payload.filePath, userId);\\                    return { success: true, data: { message: ";
File;
deleted: $;
{
    message.payload.filePath;
}
" } };\\                case 'list_files': // Example using FileService\\                    // Payload: { dirPath?: string }\\                    if (!this.context.fileService) throw new Error('FileService is not available.');\\                    result = await this.context.fileService.listFiles(message.payload?.dirPath, userId);\\                    return { success: true, data: { entries: result } };\\                case 'merge_and_write_file': // Example using FileService\\                     // Payload: { filePath: string, newContent: string, mergeStrategy?: string }\\\\\\                    if (!message.payload?.filePath || message.payload?.newContent === undefined) throw new Error('filePath and newContent are required.');\\                    // Delegate to FileService\\                    if (!this.context.fileService) throw new Error('FileService is not available.');\\                    await this.context.fileService.mergeAndWriteFile(message.payload.filePath, message.payload.newContent, userId, message.payload.mergeStrategy);\\                    return { success: true, data: { message: ";
File;
merged;
and;
written: $;
{
    message.payload.filePath;
}
" } };\\                // --- New: Handle Web and File Analysis Actions ---\\                case 'read_url':\\                    // Payload: { url: string }\\                    if (!message.payload?.url) throw new Error('url is required for read_url.');\\                    // Delegate to WebRune via RuneEngraftingCenter\\                    if (!this.context.sacredRuneEngraver) throw new Error('RuneEngraftingCenter is not available.');\\                    // Request the action from the WebRune\\                    const webResult = await this.requestAgent(\\\n                        'rune_engrafting', // Target the RuneEngrafting Agent\\\n                        'execute_rune_action', // Message type for RuneEngrafting Agent\\                        {\\\n                            runeId: 'web-rune', // The specific Rune ID\\\n                            action: 'fetchContent', // The action to execute on the rune\\\n                            params: { url: message.payload.url }, // Pass parameters\\                        },\\\n                        30000 // Timeout for rune execution\\                    );\\                    // The result from requestAgent is an AgentResponse from RuneEngraftingAgent.\\\n                    // The data payload from WebRune.fetchContent is expected to be { url: string, content: string }.\\\n                    // Now, delegate the analysis of the fetched content to WisdomSecretArt.\\                    if (!webResult.success || !webResult.data?.content) {\\                         throw new Error(webResult.error || 'Failed to fetch URL content.');\\                    }\\                    console.log('[DeviceAgent] URL content fetched. Delegating analysis to WisdomSecretArt...');\\                    if (!this.context.wisdomSecretArt) throw new Error('WisdomSecretArt is not available for analysis.');\\                    const analysisResult = await this.context.wisdomSecretArt.analyzeWebPage(\\\n                        webResult.data.url,\\\n                        webResult.data.content,\\\n                        userId\\                    );\\                    console.log('[DeviceAgent] URL content analysis complete. Delegating saving to KnowledgeAgent...');\\                    // Now, delegate saving the analysis result as a knowledge record.\\                    if (!this.context.knowledgeSync) throw new Error('KnowledgeSync is not available for saving analysis.');\\                    const savedRecord = await this.context.knowledgeSync.saveKnowledge(\\\n                        ";
Analysis;
of;
URL: $;
{
    webResult.data.url;
}
", // Question\\\n                        ";
Summary: $;
{
    analysisResult.summary;
}
n;
nKeywords: $;
{
    analysisResult.keywords.join(', ');
}
n;
nStructured;
Data: $;
{
    JSON.stringify(analysisResult.structuredData || {}, null, 2);
}
", // Answer\\\n                        userId,\\\n                        'web-analysis', // Source\\\n                        { url: webResult.data.url, analysis: analysisResult } // Dev log details\\                    );\\                    if (!savedRecord) throw new Error('Failed to save URL analysis to knowledge base.');\\                    return { success: true, data: { message: ";
Analysis;
of;
$;
{
    webResult.data.url;
}
saved;
to;
knowledge;
base.(__makeTemplateObject([", recordId: savedRecord.id, analysis: analysisResult } };\\                case 'analyze_file_content':\\                    // Payload: { fileUrl?: string, fileMetadata?: any, content?: string }\\                    if (!message.payload?.content) throw new Error('File content is required for analyze_file_content.');\\                    // Delegate the analysis of the file content to WisdomSecretArt.\\                    if (!this.context.wisdomSecretArt) throw new Error('WisdomSecretArt is not available for analysis.');\\                    console.log('[DeviceAgent] File content received. Delegating analysis to WisdomSecretArt...');\\                    const fileAnalysisResult = await this.context.wisdomSecretArt.analyzeFileContent(\\\n                        message.payload.content,\\\n                        userId,\\\n                        message.payload.fileMetadata\\                    );\\                    console.log('[DeviceAgent] File content analysis complete. Delegating saving to KnowledgeAgent...');\\                    // Now, delegate saving the analysis result as a knowledge record.\\                    if (!this.context.knowledgeSync) throw new Error('KnowledgeSync is not available for saving analysis.');\\                    const savedFileRecord = await this.context.knowledgeSync.saveKnowledge(\\\n                        "], [", recordId: savedRecord.id, analysis: analysisResult } };\\\\\\\n\\\n\\\n                case 'analyze_file_content':\\\\\\\n                    // Payload: { fileUrl?: string, fileMetadata?: any, content?: string }\\\\\\\n                    if (!message.payload?.content) throw new Error('File content is required for analyze_file_content.');\\\\\\\n                    // Delegate the analysis of the file content to WisdomSecretArt.\\\\\\\n                    if (!this.context.wisdomSecretArt) throw new Error('WisdomSecretArt is not available for analysis.');\\\\\\\n                    console.log('[DeviceAgent] File content received. Delegating analysis to WisdomSecretArt...');\\\\\\\n                    const fileAnalysisResult = await this.context.wisdomSecretArt.analyzeFileContent(\\\\\\n                        message.payload.content,\\\\\\n                        userId,\\\\\\n                        message.payload.fileMetadata\\\\\\\n                    );\\\\\\\n                    console.log('[DeviceAgent] File content analysis complete. Delegating saving to KnowledgeAgent...');\\\\\\\n                    // Now, delegate saving the analysis result as a knowledge record.\\\\\\\n                    if (!this.context.knowledgeSync) throw new Error('KnowledgeSync is not available for saving analysis.');\\\\\\\n                    const savedFileRecord = await this.context.knowledgeSync.saveKnowledge(\\\\\\n                        "]));
Analysis;
of;
File: $;
{
    ((_a = message.payload.fileMetadata) === null || _a === void 0 ? void 0 : _a.name) || 'Unknown File';
}
", // Question\\\n                        ";
Summary: $;
{
    fileAnalysisResult.summary;
}
n;
nKeywords: $;
{
    fileAnalysisResult.keywords.join(', ');
}
n;
nStructured;
Data: $;
{
    JSON.stringify(fileAnalysisResult.structuredData || {}, null, 2);
}
", // Answer\\                        userId,\\                        'file-analysis', // Source\\                        { fileMetadata: message.payload.fileMetadata, analysis: fileAnalysisResult } // Dev log details\\                    );\\                    if (!savedFileRecord) throw new Error('Failed to save file analysis to knowledge base.');\\                    return { success: true, data: { message: ";
Analysis;
of;
$;
{
    ((_b = message.payload.fileMetadata) === null || _b === void 0 ? void 0 : _b.name) || 'file';
}
saved;
to;
knowledge;
base.(__makeTemplateObject([", recordId: savedFileRecord.id, analysis: fileAnalysisResult } };\\                case 'simulate_visual_reading':\\                    // Payload: { imageUrl: string }\\                    if (!message.payload?.imageUrl) throw new Error('imageUrl is required for simulate_visual_reading.');\\                    // Delegate the text extraction and analysis to WisdomSecretArt.\\                    if (!this.context.wisdomSecretArt) throw new Error('WisdomSecretArt is not available for analysis.');\\                    console.log('[DeviceAgent] Image URL received. Delegating text extraction and analysis to WisdomSecretArt...');\\                    const extractionResult = await this.context.wisdomSecretArt.extractStructuredDataFromText(\\\n                        'Simulated text extracted from image.', // Simulate extracted text\\\n                        userId,\\\n                        { source: 'visual_reading', imageUrl: message.payload.imageUrl } // Pass context\\                    );\\                    console.log('[DeviceAgent] Visual reading analysis complete. Delegating saving to KnowledgeAgent...');\\                    // Now, delegate saving the extracted text and structured data as a knowledge record.\\                    if (!this.context.knowledgeSync) throw new Error('KnowledgeSync is not available for saving analysis.');\\                    const savedVisualRecord = await this.context.knowledgeSync.saveKnowledge(\\\n                        "], [", recordId: savedFileRecord.id, analysis: fileAnalysisResult } };\\\\\\\n\\\n                case 'simulate_visual_reading':\\\\\\\n                    // Payload: { imageUrl: string }\\\\\\\n                    if (!message.payload?.imageUrl) throw new Error('imageUrl is required for simulate_visual_reading.');\\\\\\\n                    // Delegate the text extraction and analysis to WisdomSecretArt.\\\\\\\n                    if (!this.context.wisdomSecretArt) throw new Error('WisdomSecretArt is not available for analysis.');\\\\\\\n                    console.log('[DeviceAgent] Image URL received. Delegating text extraction and analysis to WisdomSecretArt...');\\\\\\\n                    const extractionResult = await this.context.wisdomSecretArt.extractStructuredDataFromText(\\\\\\n                        'Simulated text extracted from image.', // Simulate extracted text\\\\\\n                        userId,\\\\\\n                        { source: 'visual_reading', imageUrl: message.payload.imageUrl } // Pass context\\\\\\\n                    );\\\\\\\n                    console.log('[DeviceAgent] Visual reading analysis complete. Delegating saving to KnowledgeAgent...');\\\\\\\n                    // Now, delegate saving the extracted text and structured data as a knowledge record.\\\\\\\n                    if (!this.context.knowledgeSync) throw new Error('KnowledgeSync is not available for saving analysis.');\\\\\\\n                    const savedVisualRecord = await this.context.knowledgeSync.saveKnowledge(\\\\\\n                        "]));
Text;
extracted;
from;
image(__makeTemplateObject([", // Question\\\n                        "], [", // Question\\\\\\n                        "]));
Extracted;
Text: $;
{
    extractionResult.extractedText || 'N/A';
}
n;
nStructured;
Data: $;
{
    JSON.stringify({ calendarEvents: extractionResult.calendarEvents, tasks: extractionResult.tasks, contacts: extractionResult.contacts }, null, 2);
}
", // Answer\\                        userId,\\                        'visual-reading', // Source\\                        { imageUrl: message.payload.imageUrl, extraction: extractionResult } // Dev log details\\                    );\\                    if (!savedVisualRecord) throw new Error('Failed to save visual reading analysis to knowledge base.');\\                    return { success: true, data: { message: ";
Text;
extracted;
from;
image;
and;
saved;
to;
knowledge;
base.(__makeTemplateObject([", recordId: savedVisualRecord.id, extraction: extractionResult } };\\                // --- End New ---\\                case 'handle_url_scheme':\\                    // Payload: { url: string }\\                    if (!message.payload?.url) throw new Error('URL is required for handle_url_scheme.');\\                    // Delegate to URLSchemeRune via RuneEngraftingCenter\\                    if (!this.context.sacredRuneEngraver) throw new Error('RuneEngraftingCenter is not available.');\\                    // Request the action from the URLSchemeRune\\                    // Note: URLSchemeRune doesn't have callable methods, it's triggered by the system.\\                    // This case should ideally not be executed *within* a flow/task.\\                    // If it is, it might just log the URL or trigger a specific flow.\\                    console.warn('[DeviceAgent] handle_url_scheme action executed within a flow/task. This is unusual.');\\                    console.log("], [", recordId: savedVisualRecord.id, extraction: extractionResult } };\\\\\\\n\\\n                // --- End New ---\\\\\\\n\\\n\\\n                case 'handle_url_scheme':\\\\\\\n                    // Payload: { url: string }\\\\\\\n                    if (!message.payload?.url) throw new Error('URL is required for handle_url_scheme.');\\\\\\\n                    // Delegate to URLSchemeRune via RuneEngraftingCenter\\\\\\\n                    if (!this.context.sacredRuneEngraver) throw new Error('RuneEngraftingCenter is not available.');\\\\\\\n                    // Request the action from the URLSchemeRune\\\\\\\n                    // Note: URLSchemeRune doesn't have callable methods, it's triggered by the system.\\\\\\\n                    // This case should ideally not be executed *within* a flow/task.\\\\\\\n                    // If it is, it might just log the URL or trigger a specific flow.\\\\\\\n                    console.warn('[DeviceAgent] handle_url_scheme action executed within a flow/task. This is unusual.');\\\\\\\n                    console.log("]))[DeviceAgent];
URL;
Scheme;
received: $;
{
    message.payload.url;
}
");\\                    // For MVP, just log and return success\\                    return { success: true, data: { message: ";
Handled;
URL;
Scheme: $;
{
    message.payload.url;
}
" } };\\                default:\\                    console.warn("[DeviceAgent];
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
for (DeviceAgent; ; )
    : $;
{
    message.type;
}
" };\\            }\\\n        } catch (error: any) {\\            console.error("[DeviceAgent];
Error;
handling;
message;
$;
{
    message.type;
}
", error);\\            return { success: false, error: error.message || 'An error occurred in DeviceAgent.' };\\        }\\\n    }\\\n\\\n    // TODO: Implement methods to send messages to other agents if needed\\}\\\n"(__makeTemplateObject([""], [""]));
