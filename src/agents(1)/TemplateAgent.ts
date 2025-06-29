```typescript
// src/agents/TemplateAgent.ts
// \u7bc4\u672c\u4ee3\u7406\u4eba (Template Agent) - Placeholder
// Handles operations related to user-defined templates.
// Part of the Agent System Architecture.
// Design Principle: Encapsulates template management logic.
// --- Modified: Add operations for templates (create, get, update, delete) --
// --- New: Add Realtime Updates for templates --
// --- Modified: Update handleMessage to delegate to TemplateService --
// --- Modified: Update handleMessage to use requestAgent for SupabaseAgent calls --


import { SystemContext, Template } from '../../interfaces'; // Assuming SystemContext interface exists, Import Template
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types
import { AgentFactory } from './AgentFactory'; // Import AgentFactory

// Import existing services this agent will interact with (temporarily)
// In a full refactor, the logic from these services would move INTO this agent.
// For MVP, this agent acts as a proxy to the existing services.
// import { TemplateService } from '../core/templates/TemplateService'; // Access via context
// import { SupabaseAgent } from './SupabaseAgent'; // Access via requestAgent


export class TemplateAgent extends BaseAgent {
    // private templateService: TemplateService; // Access via context
    // private supabaseAgent: SupabaseAgent; // Access via requestAgent


    constructor(context: SystemContext) {
        super('template', context);
        // Services are accessed via context
    }

    /**
     * Initializes the Template Agent.
     */
    init(): void {
        super.init(); // Call base init
        try {
            // Services are accessed via context, no need to get them here explicitly for MVP
            console.log('[TemplateAgent] Init completed.');

            // TODO: Subscribe to relevant events if needed

        } catch (error) {
            console.error('[TemplateAgent] Failed during init:', error);
            // Handle error
        }
    }


    /**
     * Handles messages directed to the Template Agent.
     * Performs operations by delegating to the TemplateService.
     * @param message The message to handle. Expected payload varies by type.
     * @returns Promise<AgentResponse> The response containing the result or error.
     */
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\
        console.log(`[TemplateAgent] Handling message: ${message.type} (Correlation ID: ${message.correlationId || 'N/A'})`);\\\
\\\n        const userId = this.context.currentUser?.id;\\\
        if (!userId) {\\\
             return { success: false, error: 'User not authenticated.' };\\\
        }\\\n\\\n        try {\\\
            let result: any;\\\
            switch (message.type) {\\\
                case 'create_template':\\\
                    // Payload: Omit<Template, 'id' | 'created_at' | 'updated_at'>\\\
                    if (!message.payload?.name || !message.payload?.type || message.payload?.content === undefined) {\\\
                         throw new Error('Name, type, and content are required to create template.');\\\
                    }\\\
                    // Ensure user_id is set from context if not provided in payload (payload might come from other agents)\\\
                    if (!message.payload.user_id) {\\\
                         message.payload.user_id = userId;\\\
                    }\\\
                    // Delegate to TemplateService\\\
                    result = await this.context.templateService?.createTemplate(message.payload, userId);\\\
                    if (!result) throw new Error('Failed to create template.');\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_templates':\\\
                    // Payload: { typeFilter?: Template['type'], tagsFilter?: string[] }\\\
                    // Delegate to TemplateService\\\
                    result = await this.context.templateService?.getTemplates(userId, message.payload?.typeFilter, message.payload?.tagsFilter);\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_template_by_id':\\\
                    // Payload: { templateId: string }\\\
                    if (!message.payload?.templateId) {\\\
                         throw new Error('Template ID is required.');\\\
                    }\\\
                    // Delegate to TemplateService\\\
                    result = await this.context.templateService?.getTemplateById(message.payload.templateId, userId);\\\
                    if (!result) return { success: false, error: 'Template not found or not accessible.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'update_template':\\\
                    // Payload: { templateId: string, updates: Partial<Omit<Template, 'id' | 'user_id' | 'created_at' | 'updated_at'>> }\\\
                    if (!message.payload?.templateId || !message.payload?.updates) {\\\
                         throw new Error('Template ID and updates are required to update template.');\\\
                    }\\\
                    // Delegate to TemplateService\\\
                    result = await this.context.templateService?.updateTemplate(\\\n                        message.payload.templateId,\\\n                        message.payload.updates,\\\
                        userId // Use userId from agent context\\\
                    );\\\
                    if (!result) return { success: false, error: 'Template not found or not owned by user.' };\\\
                    return { success: true, data: result };\\\
\\\n                case 'delete_template':\\\
                    // Payload: { templateId: string }\\\
                    if (!message.payload?.templateId) {\\\
                         throw new Error('Template ID is required to delete template.');\\\
                    }\\\
                    // Delegate to TemplateService\\\
                    result = await this.context.templateService?.deleteTemplate(message.payload.templateId, userId);\\\
                    if (!result) return { success: false, error: 'Template not found or not owned by user.' };\\\
                    return { success: true, data: { templateId: message.payload.templateId } }; // Return deleted ID\\\
\\\n\\\n                // TODO: Add cases for other Template operations (e.g., import_template, export_template, use_template)\\\
\\\n                default:\\\
                    console.warn(`[TemplateAgent] Unknown message type: ${message.type}`);\\\
                    return { success: false, error: `Unknown message type for TemplateAgent: ${message.type}` };\\\
            }\\\n        } catch (error: any) {\\\
            console.error(`[TemplateAgent] Error handling message ${message.type}:`, error);\\\
            return { success: false, error: error.message || 'An error occurred in TemplateAgent.' };\\\
        }\\\n    }\\\n\\\n    // TODO: Implement methods to send messages to other agents if needed\\\
    // e.g., sending a message to SelfNavigationAgent to create a task from a template\\\
}\\\n```