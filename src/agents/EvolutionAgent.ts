```typescript
// src/agents/EvolutionAgent.ts
// \u9032\u5316\u4ee3\u7406 (Evolution Agent)
// Handles operations related to evolution, insights, and feedback.\n// Part of the Agent System Architecture.\n// Design Principle: Encapsulates evolution logic.\n// --- Modified: Add operations for abilities (forge, get, update, delete, execute) --\n// --- New: Implement event listeners for triggering abilities --\n// --- Modified: Ensure findMatchingAbilities is called on relevant events --\n// --- Modified: Update EvolutionaryInsight interface and Supabase table with 'status' field --\n// --- Modified: Update getInsights to filter by status (default pending) --\n// --- Modified: Update handleInsightAction to set insight status to 'actioned' on success --\n// --- Modified: Update dismissInsight to set insight status to 'dismissed' --\n// --- Modified: Update runEvolutionCycle to set insight status to 'pending' and remove 'dismissed' --\n// --- Modified: Implement analyzeIncorrectFeedback to call WisdomSecretArt for correction suggestion --\n// --- Modified: Implement applying knowledge correction suggestions via KnowledgeAgent --\n// --- Modified: Update analyzeIncorrectFeedback to use requestAgent for KnowledgeAgent call --\n// --- Modified: Update handleMessage to delegate to EvolutionEngine --\n// --- Modified: Update handleMessage to use requestAgent for AnalyticsAgent, WisdomAgent, AuthorityForgingAgent, SupabaseAgent calls --\n// --- Modified: Ensure consistent error handling and logging --\n\n\nimport { SystemContext, EvolutionaryInsight, UserFeedback, UserAction, SystemEvent, KnowledgeRecord } from '../../interfaces'; // Import types\nimport { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import BaseAgent types\nimport { AgentFactory } from './AgentFactory'; // Import AgentFactory\n\n// Import existing services this agent will interact with (temporarily)\n// In a full refactor, the logic from these services would move INTO this agent.\n// For MVP, this agent acts as a proxy to the existing services.\n// import { EvolutionEngine } from '../core/evolution/EvolutionEngine'; // Access via context\n// import { AnalyticsService } from '../../modules/analytics/AnalyticsService'; // Access via requestAgent\n// import { WisdomSecretArt } from '../core/wisdom/WisdomSecretArt'; // Access via requestAgent\n// import { AuthorityForgingAgent } from '../agents/AuthorityForgingAgent'; // Access via requestAgent (for forging abilities)\n// import { SupabaseAgent } from '../agents/SupabaseAgent'; // Access via requestAgent\n// import { KnowledgeAgent } from '../agents/KnowledgeAgent'; // Access via requestAgent (for knowledge updates)\n\n\nexport class EvolutionAgent extends BaseAgent { // Extend BaseAgent\n    // private evolutionEngine: EvolutionEngine; // Access via context\n    // private authorityForgingAgent: AuthorityForgingAgent; // Access via requestAgent\n    // private analyticsService: AnalyticsService; // Access via requestAgent\n    // private wisdomSecretArt: WisdomSecretArt; // Access via requestAgent\n    // private supabaseAgent: SupabaseAgent; // Access via requestAgent\n    // private knowledgeAgent: KnowledgeAgent; // Access via requestAgent\n\n\n    constructor(context: SystemContext) {\n        // --- Modified: Call super constructor with agent name ---\n        super('evolution', context); // Call BaseAgent constructor with agent name 'evolution'\n        // --- End Modified ---\n        // Services are accessed via context\n    }\n\n    /**\n     * Initializes the Evolution Agent.\n     */\n    init(): void {\n        super.init(); // Call base init\n        try {\n            // Services are accessed via requestAgent or context, no need to get them here explicitly for MVP\n            console.log('[EvolutionAgent] Init completed.');\n\n            // --- New: Subscribe to events that trigger analysis or insight generation ---\n            if (this.context.eventBus) {\n                 const userId = this.context.currentUser?.id; // Get current user ID\n                 if (userId) { // Only subscribe if a user is logged in\n                     // Subscribe to task failure events to diagnose them\n                     this.context.eventBus.subscribe('task_failed', (payload: any) => this.handleTaskFailureForEvolution(payload)); // Payload includes taskId, userId, error\n                     // Subscribe to user feedback events to analyze incorrect answers\n                     this.context.eventBus.subscribe('user_feedback_recorded', (payload: UserFeedback) => this.analyzeIncorrectFeedback(payload)); // Payload is UserFeedback\n                     // TODO: Subscribe to other relevant events (e.g., 'frequent_action_sequence_detected' from AnalyticsService)\n                 } else {\n                     console.warn('[EvolutionAgent] User not logged in. Skipping event subscriptions for evolution.');\n                 }\n            } else {\n                 console.warn('[EvolutionAgent] EventBus not available. Cannot subscribe to evolution events.');\n            }\n            // --- End New ---\n\n        } catch (error) {\n            console.error('[EvolutionAgent] Failed during init:', error);\n            // Handle error\n        }\n    }\n\n    /**\n     * Handles incoming trigger events that might require evolutionary analysis.\n     * This method is called by EventBus listeners.\n     * @param payload The payload of the event.\n     * @returns Promise<void>\n     */\n    private async handleTaskFailureForEvolution(payload: { taskId: string, stepId: string, error: string, userId: string }): Promise<void> {\n        console.log(`[EvolutionAgent] Analyzing task failure for task: ${payload.taskId}, step: ${payload.stepId} for user ${payload.userId}`);\n        this.context.loggingService?.logInfo(`Analyzing task failure for evolution`, { userId: payload.userId, taskId: payload.taskId, stepId: payload.stepId, error: payload.error });\n\n        if (!payload?.userId || !payload?.taskId || !payload?.stepId || !payload?.error) {\n            console.warn('[EvolutionAgent] Cannot analyze task failure: Missing required payload fields.');\n            this.context.loggingService?.logWarning('Cannot analyze task failure: Missing required payload fields.', { payload });\n            return; // Do not throw, this is an event handler\n        }\n\n        // --- Simulate Analysis and Insight Generation (Delegate to WisdomAgent) ---\n        console.log('[EvolutionAgent] Requesting task failure analysis from WisdomAgent...');\n        try {\n            // --- Modified: Use requestAgent for WisdomAgent call ---\n            if (!this.context.agentFactory?.getAgent('wisdom')) {\n                 console.warn('[EvolutionAgent] WisdomAgent not available for task failure analysis.');\n                 return; // Do not throw, this is an event handler\n            }\n            const analysisResponse = await this.requestAgent(\n                'wisdom', // Target the WisdomAgent\n                'analyze_task_failure', // Hypothetical message type for WisdomAgent\n                { taskId: payload.taskId, stepId: payload.stepId, error: payload.error, userId: payload.userId }, // Pass failure details\n                15000 // Timeout\n            );\n            // --- End Modified ---\n\n            if (analysisResponse.success && analysisResponse.data?.insight) {\n                 const generatedInsight: EvolutionaryInsight = analysisResponse.data.insight; // Assuming data contains the insight\n                 console.log('[EvolutionAgent] WisdomAgent generated task failure insight:', generatedInsight);\n\n                 // --- Persist the generated insight (Delegate to SupabaseAgent) ---\n                 if (!this.context.agentFactory?.getAgent('supabase')) {\n                      console.warn('[EvolutionAgent] SupabaseAgent not available to persist task failure insight.');\n                      return; // Do not throw, this is an event handler\n                 }\n                 console.log('[EvolutionAgent] Sending insert_record message to SupabaseAgent for task failure insight...');\n                 const insightToPersist: Omit<EvolutionaryInsight, 'id' | 'timestamp'> = {\n                     user_id: payload.userId,\n                     type: 'task_failure_diagnosis', // Ensure correct type\n                     details: generatedInsight.details, // Use details from generated insight\n                     status: 'pending', // New insights are pending\n                 };\n                 const persistenceResponse = await this.requestAgent(\n                     'supabase', // Target the SupabaseAgent\n                     'insert_record', // Message type for SupabaseAgent\n                     { table: 'evolutionary_insights', record: insightToPersist },\n                     5000 // Timeout\n                 );\n\n                 if (!persistenceResponse.success || !persistenceResponse.data) {\n                     console.error('[EvolutionAgent] SupabaseAgent failed to persist task failure insight:', persistenceResponse.error);\n                     this.context.loggingService?.logError('EvolutionEngine failed to persist task failure insight.', { userId: payload.userId, taskId: payload.taskId, error: persistenceResponse.error });\n                 } else {\n                     console.log('[EvolutionAgent] Task failure insight persisted successfully.');\n                     // Publish event (Realtime subscription will trigger UI update)\n                     this.context.eventBus?.publish('evolutionary_insight_generated', persistenceResponse.data, payload.userId); // Include userId in event\n                 }\n\n            } else {\n                 console.warn('[EvolutionAgent] WisdomAgent failed to generate task failure insight:', analysisResponse.error);\n                 this.context.loggingService?.logWarning('EvolutionEngine failed to generate task failure insight.', { userId: payload.userId, taskId: payload.taskId, error: analysisResponse.error });\n                 // Optionally create a simpler insight or log a system event if AI analysis fails\n            }\n\n        } catch (error: any) {\n            console.error(`[EvolutionAgent] Error during task failure analysis for task ${payload.taskId}:`, error.message);\n            this.context.loggingService?.logError(`EvolutionEngine error during task failure analysis.`, { userId: payload.userId, taskId: payload.taskId, error: error.message });\n            // TODO: Record a system event for the analysis failure\n        }\n    }\n\n    /**\n     * Analyzes incorrect user feedback to suggest corrections for knowledge records.\n     * This method is called by the EventBus listener.\n     * @param feedback The UserFeedback record (includes recordId, feedbackType, comments, userId). Required.\n     * @returns Promise<void>\n     */\n    private async analyzeIncorrectFeedback(feedback: UserFeedback): Promise<void> {\n        console.log(`[EvolutionAgent] Analyzing incorrect feedback for record: ${feedback.record_id} for user ${feedback.user_id}`);\n        this.context.loggingService?.logInfo(`Analyzing incorrect feedback`, { userId: feedback.user_id, feedbackId: feedback.id, recordId: feedback.record_id });\n\n        if (!feedback?.user_id || !feedback?.record_id || feedback.feedback_type !== 'incorrect') {\n            console.warn('[EvolutionAgent] Cannot analyze feedback: User ID, record ID, or incorrect feedback type is missing.');\n            this.context.loggingService?.logWarning('Cannot analyze feedback: Missing required fields or not incorrect feedback.', { feedback });\n            return; // Do not throw, this is an event handler\n        }\n\n        // --- 1. Fetch the original knowledge record (Delegate to KnowledgeAgent) ---\n        console.log('[EvolutionAgent] Requesting original knowledge record from KnowledgeAgent...');\n        try {\n            // --- Modified: Use requestAgent for KnowledgeAgent call ---\n            if (!this.context.agentFactory?.getAgent('knowledge')) {\n                 console.warn('[EvolutionAgent] KnowledgeAgent not available to fetch record.');\n                 return; // Do not throw, this is an event handler\n            }\n            const recordResponse = await this.requestAgent(\n                'knowledge', // Target the KnowledgeAgent\n                'get_knowledge_by_id', // Message type for KnowledgeAgent\n                { id: feedback.record_id }, // Pass record ID\n                5000 // Timeout\n            );\n            // --- End Modified ---\n\n            if (!recordResponse.success || !recordResponse.data) {\n                 console.warn(`[EvolutionAgent] KnowledgeAgent failed to get record ${feedback.record_id} for feedback analysis:`, recordResponse.error);\n                 this.context.loggingService?.logWarning('EvolutionEngine failed to get record for feedback analysis.', { userId: feedback.user_id, recordId: feedback.record_id, error: recordResponse.error });\n                 return; // Cannot analyze without the original record\n            }\n            const originalRecord: KnowledgeRecord = recordResponse.data; // Assuming data is the record\n\n            // --- 2. Analyze feedback and record to suggest correction (Delegate to WisdomAgent) ---\n            console.log('[EvolutionAgent] Requesting feedback analysis and correction suggestion from WisdomAgent...');\n            // --- Modified: Use requestAgent for WisdomAgent call ---\n            if (!this.context.agentFactory?.getAgent('wisdom')) {\n                 console.warn('[EvolutionAgent] WisdomAgent not available for feedback analysis.');\n                 return; // Do not throw, this is an event handler\n            }\n\n            const analysisResponse = await this.requestAgent(\n                'wisdom', // Target the WisdomAgent\n                'analyze_incorrect_feedback', // Message type for WisdomAgent\n                { feedback: { ...feedback, record: originalRecord }, userId: feedback.user_id }, // Pass feedback including the record\n                15000 // Timeout\n            );\n            // --- End Modified ---\n\n            if (analysisResponse.success && analysisResponse.data?.suggestedUpdates) {\n                 const suggestedUpdates = analysisResponse.data.suggestedUpdates; // Assuming data contains suggestedUpdates\n                 console.log('[EvolutionAgent] WisdomAgent generated correction suggestion:', suggestedUpdates);\n\n                 // --- 3. Generate an insight for the user to apply the suggestion (Delegate to SupabaseAgent) ---\n                 console.log('[EvolutionEngine] Generating insight for correction suggestion...');\n                 // --- Modified: Use requestAgent for SupabaseAgent call ---\n                 if (!this.context.agentFactory?.getAgent('supabase')) {\n                      console.warn('[EvolutionAgent] SupabaseAgent not available to persist insight.');\n                      return; // Do not throw, this is an event handler\n                 }\n                 const insightToPersist: Omit<EvolutionaryInsight, 'id' | 'timestamp'> = {\n                     user_id: feedback.user_id,\n                     type: 'optimization_recommendation', // Type for correction suggestions\n                     details: {\n                         message: `Suggestion to improve knowledge record "${originalRecord.question.substring(0, 50)}...".`,\n                         recordId: originalRecord.id,\n                         suggestedUpdates: suggestedUpdates, // Store the suggested updates\n                         feedbackId: feedback.id, // Link back to the feedback\n                     },\n                     status: 'pending', // New insights are pending\n                 };\n                 const persistenceResponse = await this.requestAgent(\n                     'supabase', // Target the SupabaseAgent\n                     'insert_record', // Message type for SupabaseAgent\n                     { table: 'evolutionary_insights', record: insightToPersist },\n                     5000 // Timeout\n                 );\n                 // --- End Modified ---\n\n                 if (!persistenceResponse.success || !persistenceResponse.data) {\n                     console.error('[EvolutionAgent] SupabaseAgent failed to persist correction suggestion insight:', persistenceResponse.error);\n                     this.context.loggingService?.logError('EvolutionEngine failed to persist correction suggestion insight.', { userId: feedback.user_id, recordId: feedback.record_id, error: persistenceResponse.error });\n                 } else {\n                     console.log('[EvolutionEngine] Correction suggestion insight persisted successfully.');\n                     // Publish event (Realtime subscription will trigger UI update)\n                     this.context.eventBus?.publish('evolutionary_insight_generated', persistenceResponse.data, feedback.user_id); // Include userId in event\n                 }\n\n            } else {\n                 console.warn('[EvolutionAgent] WisdomAgent failed to generate correction suggestion:', analysisResponse.error);\n                 this.context.loggingService?.logWarning('EvolutionEngine failed to generate correction suggestion.', { userId: feedback.user_id, recordId: feedback.record_id, error: analysisResponse.error });\n                 // Optionally create a simpler insight or log a system event if AI analysis fails\n            }\n\n        } catch (error: any) {\n            console.error(`[EvolutionAgent] Error during incorrect feedback analysis for record ${feedback.record_id}:`, error.message);\n            this.context.loggingService?.logError(`EvolutionEngine error during incorrect feedback analysis.`, { userId: feedback.user_id, recordId: feedback.record_id, error: error.message });\n            // TODO: Record a system event for the analysis failure\n        }\n    }\n\n\n    /**\n     * Handles messages directed to the Evolution Agent.\n     * Performs operations by delegating to the EvolutionEngine's core methods.\n     * @param message The message to handle. Expected payload varies by type.\n     * @returns Promise<AgentResponse> The response containing the result or error.\n     */\n    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\n        console.log(`[EvolutionAgent] Handling message: ${message.type} (Correlation ID: ${message.correlationId || 'N/A'})`);\\\n\\\n        const userId = this.context.currentUser?.id;\\\n        if (!userId) {\\\n             // Return error response if user is not authenticated\\\
             return { success: false, error: 'User not authenticated.' };\\\
        }\\\
\\\
        try {\\\
            let result: any;\\\
            switch (message.type) {\\\
                case 'run_evolution_cycle':\\\
                    // Payload: { timeframe?: 'day' | 'week' | 'month' | 'all' }\\\
                    // Delegate to EvolutionEngine\\\
                    if (!this.context.evolutionEngine) {\\\
                         return { success: false, error: 'EvolutionEngine is not available.' };\\\
                    }\\\
                    result = await this.context.evolutionEngine.runEvolutionCycle(userId, message.payload?.timeframe);\\\
                    if (!result) {\\\
                         // Return error response if delegation failed\\\
                         return { success: false, error: 'Failed to run evolution cycle via EvolutionEngine.' };\\\
                    }\\\
                    return { success: true, data: result };\\\
\\\
                case 'get_insights':\\\
                    // Payload: { status?: EvolutionaryInsight['status'], deprecatedDismissed?: boolean, limit?: number }\\\
                    // Delegate to EvolutionEngine\\\
                    if (!this.context.evolutionEngine) {\\\
                         return { success: false, error: 'EvolutionEngine is not available.' };\\\
                    }\\\
                    result = await this.context.evolutionEngine.getInsights(\\\
                        userId, // Use userId from agent context\\\
                        message.payload?.status, // Pass status filter\\\
                        message.payload?.deprecatedDismissed, // Pass deprecated dismissed filter\\\
                        message.payload?.limit\\\
                    );\\\
                    // Result is an array of insights (can be empty, not an error)\\\
                    return { success: true, data: result };\\\
\\\
                case 'dismiss_insight':\\\
                    // Payload: { insightId: string }\\\
                    if (!message.payload?.insightId) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Insight ID is required to dismiss insight.' };\\\
                    }\\\
                    // Delegate to EvolutionEngine\\\
                    if (!this.context.evolutionEngine) {\\\
                         return { success: false, error: 'EvolutionEngine is not available.' };\\\
                    }\\\
                    result = await this.context.evolutionEngine.dismissInsight(message.payload.insightId, userId);\\\
                    if (!result) {\\\
                         // Return error response if delegation failed (e.g., not found or not owned)\\\
                         return { success: false, error: 'Insight not found or not owned by user.' };\\\
                    }\\\
                    return { success: true, data: result };\\\
\\\
                case 'handle_insight_action':\\\
                    // Payload: { insightId: string, actionType: string, details?: any }\\\
                    if (!message.payload?.insightId || !message.payload?.actionType) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Insight ID and action type are required to handle insight action.' };\\\
                    }\\\
                    // Delegate to EvolutionEngine\\\
                    if (!this.context.evolutionEngine) {\\\
                         return { success: false, error: 'EvolutionEngine is not available.' };\\\
                    }\\\
                    result = await this.context.evolutionEngine.handleInsightAction(\\\
                        message.payload.insightId,\\\
                        message.payload.actionType,\\\
                        userId, // Use userId from agent context\\\
                        message.payload.details\\\
                    );\\\
                    // handleInsightAction returns the result of the action\\\
                    return { success: true, data: result };\\\
\\\
                case 'record_feedback':\\\
                    // Payload: { recordId: string, feedbackType: 'correct' | 'incorrect', comments?: string }\\\
                    if (!message.payload?.recordId || !message.payload?.feedbackType) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Record ID and feedback type are required to record feedback.' };\\\
                    }\\\
                    // Delegate to EvolutionEngine\\\
                    if (!this.context.evolutionEngine) {\\\
                         return { success: false, error: 'EvolutionEngine is not available.' };\\\
                    }\\\
                    result = await this.context.evolutionEngine.recordFeedback(\\\
                        message.payload.recordId,\\\
                        message.payload.feedbackType,\\\
                        userId, // Use userId from agent context\\\
                        message.payload.comments\\\
                    );\\\
                    if (!result) {\\\
                         // Return error response if delegation failed\\\
                         return { success: false, error: 'Failed to record feedback via EvolutionEngine.' };\\\
                    }\\\
                    return { success: true, data: result };\\\
\\\
                case 'handle_task_failure_for_evolution':\\\
                    // Payload: { taskId: string, stepId: string, error: string }\\\
                    if (!message.payload?.taskId || !message.payload?.stepId || !message.payload?.error) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Task ID, step ID, and error are required to handle task failure.' };\\\
                    }\\\
                    // Delegate to EvolutionEngine (This is an event handler, doesn't return result directly)\\\
                    if (!this.context.evolutionEngine) {\\\
                         return { success: false, error: 'EvolutionEngine is not available.' };\\\
                    }\\\
                    await this.context.evolutionEngine.handleTaskFailureForEvolution({\\\
                        taskId: message.payload.taskId,\\\
                        stepId: message.payload.stepId,\\\
                        error: message.payload.error,\\\
                        userId: userId // Use userId from agent context\\\
                    });\\\
                    return { success: true, data: { message: 'Task failure handled for evolution.' } };\\\
\\\
                case 'analyze_incorrect_feedback':\\\
                    // Payload: { feedback: UserFeedback }\\\
                    if (!message.payload?.feedback) {\\\
                         // Return error response if required fields are missing\\\
                         return { success: false, error: 'Feedback details are required to analyze incorrect feedback.' };\\\
                    }\\\
                    // Delegate to EvolutionEngine (This is an event handler, doesn't return result directly)\\\
                    if (!this.context.evolutionEngine) {\\\
                         return { success: false, error: 'EvolutionEngine is not available.' };\\\
                    }\\\
                    await this.context.evolutionEngine.analyzeIncorrectFeedback(message.payload.feedback);\\\
                    return { success: true, data: { message: 'Incorrect feedback analysis initiated.' } };\\\
\\\
                case 'get_recent_feedback':\\\
                    // Payload: { limit?: number }\\\
                    // Delegate to EvolutionEngine (assuming EvolutionEngine has this method)\\\
                    if (!this.context.evolutionEngine) {\\\
                         return { success: false, error: 'EvolutionEngine is not available.' };\\\
                    }\\\
                    result = await this.context.evolutionEngine.getRecentFeedback(userId, message.payload?.limit);\\\
                    // Result is an array of feedback (can be empty, not an error)\\\
                    return { success: true, data: result };\\\
\\\
                default:\\\
                    console.warn(`[EvolutionAgent] Unknown message type: ${message.type}`);\\\
                    // Return error response for unknown message types\\\
                    return { success: false, error: `Unknown message type for EvolutionAgent: ${message.type}` };\\\
            }\\\
        } catch (error: any) {\\\
            console.error(`[EvolutionAgent] Error handling message ${message.type}:`, error);\\\
            // Return error response for any caught errors\\\
            return { success: false, error: error.message || 'An error occurred in EvolutionAgent.' };\\\
        }\\\
    }\\\
\\\
    // TODO: Implement methods to send messages to other agents if needed\\\
}\\\
```