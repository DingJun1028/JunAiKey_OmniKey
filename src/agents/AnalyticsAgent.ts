```typescript
// src/agents/AnalyticsAgent.ts
// \u5206\u6790\u4ee3\u7406 (Analytics Agent)
// Handles operations related to analytics and KPIs.
// Part of the Agent System Architecture.
// Design Principle: Encapsulates analytics logic.
// --- Modified: Add operations for abilities (forge, get, update, delete, execute) --
// --- New: Implement event listeners for triggering abilities --
// --- Modified: Ensure findMatchingAbilities is called on relevant events --
// --- Modified: Update EvolutionaryInsight interface and Supabase table with 'status' field --
// --- Modified: Update getInsights to filter by status (default pending) --
// --- Modified: Update handleInsightAction to set insight status to 'actioned' on success --
// --- Modified: Update dismissInsight to set insight status to 'dismissed' --
// --- Modified: Update runEvolutionCycle to set insight status to 'pending' and remove 'dismissed' --
// --- Modified: Implement analyzeIncorrectFeedback to call WisdomSecretArt for correction suggestion --
// --- Modified: Implement applying knowledge correction suggestions via KnowledgeAgent --
// --- Modified: Update analyzeIncorrectFeedback to use requestAgent for KnowledgeAgent call --
// --- Modified: Update handleMessage to delegate to AnalyticsService --
// --- Modified: Update handleMessage to use requestAgent for SupabaseAgent calls --


import { SystemContext } from '../../interfaces'; // Assuming SystemContext interface exists
import { BaseAgent, AgentMessage, AgentResponse } from './BaseAgent'; // Import types
import { AgentFactory } from './AgentFactory'; // Import AgentFactory

// Import existing services this agent will interact with (temporarily)
// In a full refactor, the logic from these services would move INTO this agent.
// For MVP, this agent acts as a proxy to the existing services.
// import { AnalyticsService } from '../../modules/analytics/AnalyticsService'; // Access via context
// import { SupabaseAgent } from './SupabaseAgent'; // Access via requestAgent


export class AnalyticsAgent extends BaseAgent {
    // private analyticsService: AnalyticsService; // Access via context
    // private supabaseAgent: SupabaseAgent; // Access via requestAgent


    constructor(context: SystemContext) {
        super('analytics', context);
        // Services are accessed via context
    }

    /**
     * Initializes the Analytics Agent.
     */
    init(): void {
        super.init(); // Call base init
        try {
            // Services are accessed via context, no need to get them here explicitly for MVP
            console.log('[AnalyticsAgent] Init completed.');

            // TODO: Subscribe to relevant events (e.g., task_completed, rune_action_executed) to collect data in realtime
            // This agent might listen to events and store raw data for later processing by AnalyticsService.
            // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompleted(payload));

        } catch (error) {
            console.error('[AnalyticsAgent] Failed during init:', error);
            // Handle error
        }
    }


    /**
     * Handles messages directed to the Analytics Agent.
     * Performs operations by delegating to the AnalyticsService.
     * @param message The message to handle. Expected payload varies by type.
     * @returns Promise<AgentResponse> The response containing the result or error.
     */
    protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {\\\
        console.log(`[AnalyticsAgent] Handling message: ${message.type} (Correlation ID: ${message.correlationId || 'N/A'})`);\\\
\\\n        const userId = this.context.currentUser?.id;\\\
        if (!userId) {\\\
             return { success: false, error: 'User not authenticated.' };\\\
        }\\\n\\\n        try {\\\
            let result: any;\\\
            switch (message.type) {\\\
                case 'calculate_kpis':\\\
                    // Payload: { timeframe?: 'day' | 'week' | 'month' | 'all' }\\\
                    // Delegate to AnalyticsService\\\
                    result = await this.context.analyticsService?.calculateKPIs(message.payload?.timeframe, userId);\\\
                    if (!result) throw new Error('Failed to calculate KPIs.');\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_data_for_evolution':\\\
                    // Payload: { timeframe?: 'day' | 'week' | 'month' | 'all' }\\\
                    // Delegate to AnalyticsService\\\
                    result = await this.context.analyticsService?.getDataForEvolution(userId, message.payload?.timeframe);\\\
                    if (!result) throw new Error('Failed to get data for evolution.');\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_recent_logs':\\\
                    // Payload: { limit?: number, level?: 'info' | 'warn' | 'error' | 'debug' }\\\
                    // Delegate to LoggingService via SupabaseAgent (assuming logs are in DB)\\\
                    if (!this.context.agentFactory?.getAgent('supabase')) {\\\
                         throw new Error('SupabaseAgent not available to fetch logs.');\\\
                    }\\\
                    console.log('[AnalyticsAgent] Requesting recent logs from SupabaseAgent...');\\\
                    // Use query_records message type for SupabaseAgent\\\
                    const logsResponse = await this.requestAgent(\\\n                        'supabase', // Target the SupabaseAgent\\\n                        'query_records', // Message type for SupabaseAgent\\\
                        {\\\n                            table: 'system_events', // Assuming logs are stored in system_events\\\n                            select: '*',\\\n                            query: { user_id: userId }, // Filter by user ID\\\n                            order: { column: 'timestamp', ascending: false },\\\n                            limit: message.payload?.limit || 100,\\\
                        },\\\
                        10000 // Timeout\\\
                    );\\\
\\\n                    if (!logsResponse.success || !Array.isArray(logsResponse.data)) {\\\
                         throw new Error(logsResponse.error || 'SupabaseAgent failed to fetch logs.');\\\
                    }\\\
                    // Filter by severity level if requested (client-side for MVP)\\\
                    const filteredLogs = message.payload?.level\\\
                        ? logsResponse.data.filter((log: any) => log.severity === message.payload.level)\\\
                        : logsResponse.data;\\\
\\\n                    result = filteredLogs;\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_user_activity_summary':\\\
                    // Payload: { timeframe?: 'day' | 'week' | 'month' | 'all' }\\\
                    // Delegate to AnalyticsService (or implement summary logic here)\\\
                    console.warn('[AnalyticsAgent] Simulating get_user_activity_summary.');\\\
                    await new Promise(resolve => setTimeout(resolve, 500));\\\
                    result = { message: 'Simulated user activity summary.', timeframe: message.payload?.timeframe };\\\
                    return { success: true, data: result };\\\
\\\n                case 'get_reports':\\\
                    // Payload: { type: string, options?: any }\\\
                    // Delegate to AnalyticsService (or implement report generation logic here)\\\
                    console.warn(`[AnalyticsAgent] Simulating get_reports for type: ${message.payload?.type}.`);\\\
                    await new Promise(resolve => setTimeout(resolve, 1000));\\\
                    result = { message: `Simulated report generated for type: ${message.payload?.type}.`, reportType: message.payload?.type };\\\
                    return { success: true, data: result };\\\
\\\n                // TODO: Add cases for other Analytics operations (e.g., get_user_activity_summary)\\\
\\\n                default:\\\
                    console.warn(`[AnalyticsAgent] Unknown message type: ${message.type}`);\\\
                    return { success: false, error: `Unknown message type for AnalyticsAgent: ${message.type}` };\\\
            }\\\n        } catch (error: any) {\\\
            console.error(`[AnalyticsAgent] Error handling message ${message.type}:`, error);\\\
            return { success: false, error: error.message || 'An error occurred in AnalyticsAgent.' };\\\
        }\\\n    }\\\n\\\n    // TODO: Implement methods to send messages to other agents if needed\\\
}\\\n```