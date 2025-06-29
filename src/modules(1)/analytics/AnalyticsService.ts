```typescript
// src/modules/analytics/AnalyticsService.ts
// \u5206\u6790\u670d\u52d9 (Analytics Service) - \u8f1輔\u52a9\u6a21\u7d44
// Collects, processes, and analyzes system data and user behavior.
// Calculates Key Performance Indicators (KPIs) and provides data for the Evolution Engine.
// Part of the Six Styles of Infinite Evolution (\u7121\u9650\u9032\u5316\u5faa\u74b0\u7684\u516d\u5f0f\u5967\u7fa9) - specifically Observe (\u89c0\u5bdf) and Monitor (\u76e3\u63a7).
// Design Principle: Provides data-driven insights into system usage and performance.

import { SystemContext, UserAction, Task, Rune, EvolutionaryInsight, Goal, KeyResult, SystemEvent, ForgedAbility } from '../../interfaces'; // Import ForgedAbility
import { SupabaseClient } from '@supabase/supabase-js';
// import { LoggingService } from '../../core/logging/LoggingService'; // Dependency
// import { EventBus } from '../events/EventBus'; // Dependency
// import { AuthorityForgingEngine } from '../../core/authority/AuthorityForgingEngine'; // Dependency for fetching actions/abilities
// import { SelfNavigationEngine } from '../../core/self-navigation/SelfNavigationEngine'; // Dependency for fetching tasks
// import { RuneEngraftingCenter } from '../../core/rune-engrafting/RuneEngraftingCenter'; // Dependency for fetching runes
// import { GoalManagementService } from '../../core/goal-management/GoalManagementService'; // Dependency for fetching goals
// import { KnowledgeSync } from '../../modules/knowledgeSync'; // Dependency for fetching knowledge records


export class AnalyticsService {
    private context: SystemContext;
    private supabase: SupabaseClient;
    // private loggingService: LoggingService; // Access via context
    // private eventBus: EventBus; // Access via context
    // private authorityForgingEngine: AuthorityForgingEngine; // Access via context
    // private selfNavigationEngine: SelfNavigationEngine; // Access via context
    // private runeEngraftingCenter: RuneEngraftingCenter; // Access via context
    // private goalManagementService: GoalManagementService; // Access via context
    // private knowledgeSync: KnowledgeSync; // Access via context


    constructor(context: SystemContext) {
        this.context = context;
        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy
        // this.loggingService = context.loggingService;
        // this.eventBus = context.eventBus;
        // this.authorityForgingEngine = context.authorityForgingEngine;
        // this.selfNavigationEngine = context.selfNavigationEngine;
        // this.runeEngraftingCenter = context.runeEngraftingCenter;
        // this.goalManagementService = context.goalManagementService;
        // this.knowledgeSync = context.knowledgeSync;
        console.log('AnalyticsService initialized.');

        // TODO: Set up listeners for relevant events to collect data in realtime (Supports Event Push)
        // Example: this.context.eventBus.subscribe('user_action_recorded', (payload) => this.handleUserAction(payload));
        // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompleted(payload));
        // Example: this.context.eventBus.subscribe('rune_action_executed', (payload) => this.handleRuneActionExecuted(payload));
    }

    /**
     * Helper to get the start date based on the timeframe.
     * @param timeframe The timeframe (e.g., 'day', 'week', 'month', 'all').
     * @returns Date | undefined The start date or undefined for 'all'.
     */
    private getStartDate(timeframe: 'day' | 'week' | 'month' | 'all'): Date | undefined {
        const now = new Date();
        switch (timeframe) {
            case 'day': return new Date(now.setDate(now.getDate() - 1));
            case 'week': return new Date(now.setDate(now.getDate() - 7));
            case 'month': return new Date(now.setMonth(now.getMonth() - 1));
            case 'all': return undefined;
            default: return undefined;
        }
    }

    /**
     * Collects raw data from various sources for analysis.
     * This is a core part of the \"Observe\" step.
     * @param userId The user ID to collect data for. Required.
     * @param timeframe Optional timeframe (e.g., 'day', 'week', 'month', 'all'). Defaults to 'all'.
     * @returns Promise<any> An object containing collected raw data.
     */
    private async collectRawData(userId: string, timeframe: 'day' | 'week' | 'month' | 'all' = 'all'): Promise<{\n        userActions: UserAction[];\n        tasks: Task[];\n        runes: Rune[]; // Note: Runes are definitions, not executions. Execution data is in user_actions/system_events.\n        abilities: ForgedAbility[]; // Abilities are definitions\n        goals: Goal[];\n        systemEvents: SystemEvent[];\n        knowledgeRecords: KnowledgeRecord[]; // Added knowledge records\n        // Add other data sources like logs, notifications, etc.\n    }> {\n        console.log(`[AnalyticsService] Collecting raw data for user: ${userId}, timeframe: ${timeframe}...`);\n        this.context.loggingService?.logInfo(`Collecting raw data for user ${userId}`, { userId, timeframe });\n\n        const startDate = this.getStartDate(timeframe);\n        const startDateISO = startDate?.toISOString();\n\n\n        // Fetch data from Supabase (or other sources)\n        // NOTE: For MVP, fetching directly from Supabase tables.\n        // In a more mature version, consider using public methods of\n        // AuthorityForgingEngine, SelfNavigationEngine, etc., if those methods\n        // support efficient fetching with timeframe filters.\n        // Direct DB access here bypasses service-specific logic but is simpler for MVP analytics.\n\n        let userActions: UserAction[] = [];\n        try {\n             let query = this.supabase.from('user_actions').select('*').eq('user_id', userId);\n             if (startDateISO) {\n                 query = query.gte('timestamp', startDateISO);\n             }\n             const { data, error } = await query.order('timestamp', { ascending: false } as any);\n             if (error) throw error;\n             userActions = data as UserAction[];\n             console.log(`[AnalyticsService] Fetched ${userActions.length} user actions.`);\n        } catch (error: any) {\n             console.error('[AnalyticsService] Error fetching user actions:', error.message);\n             this.context.loggingService?.logError('Error fetching user actions for analytics', { userId, timeframe, error: error.message });\n        }\n\n\n        let tasks: Task[] = [];\n        try {\n             // Fetch tasks created within the timeframe, including steps\n             let query = this.supabase.from('tasks').select('*, task_steps(*)').eq('user_id', userId);\n              if (startDateISO) {\n                 query = query.gte('creation_timestamp', startDateISO);\n             }\n             const { data, error } = await query.order('creation_timestamp', { ascending: false } as any);\n             if (error) throw error;\n             tasks = (data as Task[]).map(task => ({\n                 ...task,\n                 steps: task.steps.sort((a, b) => a.step_order - b.step_order) // Ensure steps are sorted\n             }));\n             console.log(`[AnalyticsService] Fetched ${tasks.length} tasks.`);\n        } catch (error: any) {\n             console.error('[AnalyticsService] Error fetching tasks:', error.message);\n             this.context.loggingService?.logError('Error fetching tasks for analytics', { userId, timeframe, error: error.message });\n        }\n\n\n        let runes: Rune[] = [];\n         try {\n             // Fetch all runes (user's and public) - timeframe doesn't apply to definitions\n             // Using RuneEngraftingCenter method here is appropriate as it fetches definitions\n             runes = await this.context.runeEngraftingCenter?.listRunes(undefined, userId) || [];\n             console.log(`[AnalyticsService] Fetched ${runes.length} rune definitions.`);\n         } catch (error: any) {\n              console.error('[AnalyticsService] Error fetching rune definitions:', error.message);\n              this.context.loggingService?.logError('Error fetching rune definitions for analytics', { userId, error: error.message });\n         }\n\n        let abilities: ForgedAbility[] = [];\n         try {\n             // Fetch all abilities (user's and public) - timeframe doesn't apply to definitions\n             // Using AuthorityForgingEngine method here is appropriate\n             abilities = await this.context.authorityForgingEngine?.getAbilities(undefined, userId) || [];\n             console.log(`[AnalyticsService] Fetched ${abilities.length} ability definitions.`);\n         } catch (error: any) {\n              console.error('[AnalyticsService] Error fetching ability definitions:', error.message);\n              this.context.loggingService?.logError('Error fetching ability definitions for analytics', { userId, error: error.message });\n         }\n\n\n        let goals: Goal[] = [];\n         try {\n             // Fetch goals created within the timeframe, including key results\n             let query = this.supabase.from('goals').select('*, key_results(*)').eq('user_id', userId);\n              if (startDateISO) {\n                 query = query.gte('creation_timestamp', startDateISO);\n             }\n             const { data, error } = await query.order('creation_timestamp', { ascending: false } as any);\n             if (error) throw error;\n             goals = data as Goal[];\n             console.log(`[AnalyticsService] Fetched ${goals.length} goals.`);\n         } catch (error: any) {\n              console.error('[AnalyticsService] Error fetching goals:', error.message);\n              this.context.loggingService?.logError('Error fetching goals for analytics', { userId, timeframe, error: error.message });\n         }\n\n\n        let systemEvents: SystemEvent[] = [];\n         try {\n             // Fetch system events within the timeframe\n             let query = this.supabase.from('system_events').select('*').eq('user_id', userId);\n              if (startDateISO) {\n                 query = query.gte('timestamp', startDateISO);\n             }\n             const { data, error } = await query.order('timestamp', { ascending: false } as any);\n             if (error) throw error;\n             systemEvents = data as SystemEvent[];\n             console.log(`[AnalyticsService] Fetched ${systemEvents.length} system events.`);\n         } catch (error: any) {\n              console.error('[AnalyticsService] Error fetching system events:', error.message);\n              this.context.loggingService?.logError('Error fetching system events for analytics', { userId, timeframe, error: error.message });\n         }\n\n        let knowledgeRecords: KnowledgeRecord[] = [];\n         try {\n             // Fetch knowledge records within the timeframe\n             let query = this.supabase.from('knowledge_records').select('*').eq('user_id', userId);\n              if (startDateISO) {\n                 query = query.gte('timestamp', startDateISO);\n             }\n             const { data, error } = await query.order('timestamp', { ascending: false } as any);\n             if (error) throw error;\n             knowledgeRecords = data as KnowledgeRecord[];\n             console.log(`[AnalyticsService] Fetched ${knowledgeRecords.length} knowledge records.`);\n         } catch (error: any) {\n              console.error('[AnalyticsService] Error fetching knowledge records:', error.message);\n              this.context.loggingService?.logError('Error fetching knowledge records for analytics', { userId, timeframe, error: error.message });\n         }\n\n\n        // TODO: Fetch other data sources (e.g., logs from LoggingService, notifications from NotificationService)\n\n        console.log(`[AnalyticsService] Raw data collection complete for user: ${userId}.`);\n        return {\n            userActions,\n            tasks,\n            runes,\n            abilities, // Include abilities\n            goals,\n            systemEvents,\n            knowledgeRecords, // Include knowledge records\n            // Include other collected data\n        };\n    }\n\n\n    /**
     * Calculates Key Performance Indicators (KPIs) based on collected data.
     * Part of the \"Monitor\" step.
     * @param timeframe The timeframe for calculation (e.g., 'day', 'week', 'month', 'all'). Required.
     * @param userId The user ID for calculation. Required.
     * @returns Promise<any> An object containing calculated KPIs.
     */
    async calculateKPIs(timeframe: 'day' | 'week' | 'month' | 'all', userId: string): Promise<any> {
        console.log(`[AnalyticsService] Calculating KPIs for user: ${userId}, timeframe: ${timeframe}...`);
        this.context.loggingService?.logInfo(`Calculating KPIs for user ${userId}`, { userId, timeframe });

        if (!userId) {
            console.error('[AnalyticsService] Cannot calculate KPIs: User ID is required.');
            this.context.loggingService?.logError('Cannot calculate KPIs: User ID is required.');
            throw new Error('User ID is required to calculate KPIs.');
        }

        // Collect the necessary raw data for the specified timeframe
        const rawData = await this.collectRawData(userId, timeframe);
        const { userActions, tasks, systemEvents, runes, abilities, goals, knowledgeRecords } = rawData; // Destructure relevant data


        // --- Calculate KPIs ---
        let taskCompletionRate = 0;
        let totalTasksCompleted = 0;
        let totalTasksFailed = 0;
        let totalTasksCancelled = 0;
        let totalTasksStarted = 0; // Tasks that reached 'in-progress' status

        tasks.forEach(task => {
            if (task.status === 'completed') totalTasksCompleted++;
            if (task.status === 'failed') totalTasksFailed++;
            if (task.status === 'cancelled') totalTasksCancelled++;
            if (task.start_timestamp) totalTasksStarted++; // Count tasks that were started
        });

        const totalTasksFinished = totalTasksCompleted + totalTasksFailed + totalTasksCancelled;
        if (totalTasksStarted > 0) { // Calculate rate based on started tasks
             taskCompletionRate = (totalTasksCompleted / totalTasksStarted) * 100;
        } else if (tasks.length > 0) { // If no tasks started, but some exist, rate is 0
             taskCompletionRate = 0;
        } else { // If no tasks at all, rate is N/A (or 100 if you consider 0/0 = 100)
             taskCompletionRate = 100; // Or NaN, depending on desired representation
        }


        let runeExecutionSuccessRate = 0;
        let totalRuneExecutions = 0;
        let successfulRuneExecutions = 0;

        // Filter user actions for rune executions
        const runeExecutionActions = userActions.filter(action => action.type.startsWith('rune:execute:'));
        totalRuneExecutions = runeExecutionActions.length;

        // To determine success/failure, we check the 'rune_action_executed' vs 'rune_action_failed' events.
        const successfulRuneEvents = systemEvents.filter(event => event.type === 'rune_action_executed');
        const failedRuneEvents = systemEvents.filter(event => event.type === 'rune_action_failed');
        successfulRuneExecutions = successfulRuneEvents.length;


        if (totalRuneExecutions > 0) {
            // Calculate rate based on events if available
            const totalEvents = successfulRuneExecutions + failedRuneEvents.length;
            if (totalEvents > 0) {
                 runeExecutionSuccessRate = (successfulRuneExecutions / totalEvents) * 100;
            } else {
                 // If there were executions logged but no success/fail events, assume 0% success?
                 // Or maybe this indicates a logging issue. For MVP, assume 0 if no events.
                 runeExecutionSuccessRate = 0;
            }
        } else {
             runeExecutionSuccessRate = 100; // Or NaN if no executions
        }

        // Calculate Error Rate (System Events with severity 'error')
        const totalSystemEvents = systemEvents.length;
        const errorEvents = systemEvents.filter(event => event.severity === 'error');
        const systemErrorRate = totalSystemEvents > 0 ? (errorEvents.length / totalSystemEvents) * 100 : 0;


        let averageTaskDuration = 0;
        const completedTasksWithDuration = tasks.filter(task => task.status === 'completed' && task.start_timestamp && task.completion_timestamp);
        if (completedTasksWithDuration.length > 0) {
            const totalDuration = completedTasksWithDuration.reduce((sum, task) => {
                const start = new Date(task.start_timestamp!).getTime();
                const end = new Date(task.completion_timestamp!).getTime();
                return sum + (end - start); // Duration in milliseconds
            }, 0);
            averageTaskDuration = (totalDuration / completedTasksWithDuration.length) / 1000; // Average duration in seconds
        }


        // Count Knowledge Records added within the timeframe
        const knowledgeRecordsAdded = knowledgeRecords.length;


        // Count Abilities Forged within the timeframe
        const forgedAbilities = abilities.filter(ability => {
            if (!ability.creation_timestamp) return false;
            const creationTime = new Date(ability.creation_timestamp).getTime();
            return startDate ? creationTime >= startDate.getTime() : true;
        }).length;


        // Count Goals Created within the timeframe
        const createdGoals = goals.filter(goal => {
             if (!goal.creation_timestamp) return false;
             const creationTime = new Date(goal.creation_timestamp).getTime();
             return startDate ? creationTime >= startDate.getTime() : true;
        }).length;


        // Calculate Goal Completion Rate (for goals created within timeframe)
        const completedGoals = goals.filter(goal => {
             if (!goal.creation_timestamp) return false;
             const creationTime = new Date(goal.creation_timestamp).getTime();
             const createdWithinTimeframe = startDate ? creationTime >= startDate.getTime() : true;
             return createdWithinTimeframe && goal.status === 'completed';
        }).length;
        const totalGoalsCreatedWithinTimeframe = goals.filter(goal => {
             if (!goal.creation_timestamp) return false;
             const creationTime = new Date(goal.creation_timestamp).getTime();
             return startDate ? creationTime >= startDate.getTime() : true;
        }).length;
        const goalCompletionRate = totalGoalsCreatedWithinTimeframe > 0 ? (completedGoals / totalGoalsCreatedWithinTimeframe) * 100 : 0;


        // TODO: Calculate other KPIs (e.g., Automation Rate, Feature Usage)
        // Automation Rate: Percentage of tasks/actions initiated by the system/abilities vs. manual user actions.
        // Feature Usage: How often different runes, abilities, or core features are used.


        const kpiResults = {
            timeframe,
            taskCompletionRate: taskCompletionRate.toFixed(2), // Format to 2 decimal places
            totalTasksCompleted,
            totalTasksFailed,
            totalTasksCancelled,
            totalTasksStarted,
            runeExecutionSuccessRate: runeExecutionSuccessRate.toFixed(2), // Format to 2 decimal places
            totalRuneExecutions,
            successfulRuneExecutions,
            systemErrorRate: systemErrorRate.toFixed(2), // Format to 2 decimal places
            averageTaskDuration: averageTaskDuration.toFixed(2), // in seconds, format to 2 decimal places
            knowledgeRecordsAdded,
            forgedAbilities, // Added forged abilities count
            createdGoals, // Added created goals count
            goalCompletionRate: goalCompletionRate.toFixed(2), // Format to 2 decimal places
            // Add other calculated KPIs
        };

        console.log(`[AnalyticsService] KPI calculation complete for user: ${userId}.`, kpiResults);
        this.context.loggingService?.logInfo(`KPI calculation complete for user ${userId}`, { userId, timeframe, kpis: kpiResults });

        // TODO: Persist KPI snapshots for historical tracking (Supports Monitor)

        return kpiResults;
    }


    /**
     * Provides data and insights to the Evolution Engine for pattern identification and suggestions.
     * Part of the \"Observe\" step, feeding into \"Learn\" and \"Generate\".
     * @param userId The user ID. Required.
     * @param timeframe Optional timeframe. Defaults to 'all'.
     * @returns Promise<any> Data structured for the Evolution Engine.
     */
    async getDataForEvolution(userId: string, timeframe: 'day' | 'week' | 'month' | 'all' = 'all'): Promise<any> {
        console.log(`[AnalyticsService] Providing data for Evolution Engine for user: ${userId}, timeframe: ${timeframe}...`);
        this.context.loggingService?.logInfo(`Providing data for Evolution Engine for user ${userId}`, { userId, timeframe });

        if (!userId) {
            console.error('[AnalyticsService] Cannot provide data for evolution: User ID is required.');
            this.context.loggingService?.logError('Cannot provide data for evolution: User ID is required.');
            throw new Error('User ID is required to provide data for evolution.');
        }

        // Collect raw data
        const rawData = await this.collectRawData(userId, timeframe);
        const { userActions, tasks, systemEvents, knowledgeRecords } = rawData; // Destructure relevant data


        // --- Process Data for Evolution Engine ---
        // Structure the data in a way that the Evolution Engine can easily consume
        // This might involve:
        // - Grouping user actions by type, sequence, or context.
        // - Summarizing task outcomes (success/failure rates per task type or action type).
        // - Identifying frequent events or event sequences.
        // - Extracting keywords or topics from knowledge records or logs.

        // For MVP, just return the raw data or slightly processed versions
        const processedData = {
            recentUserActions: userActions, // Evolution Engine can analyze sequences/frequency
            failedTasks: tasks.filter(task => task.status === 'failed'), // Evolution Engine can diagnose failures
            recentSystemEvents: systemEvents, // Evolution Engine can analyze event patterns
            recentKnowledgeRecords: knowledgeRecords, // Evolution Engine can analyze content/sources
            // TODO: Add other processed data (e.g., frequent action sequences, task step success rates, event patterns)
            // Example: processActionSequences(actions: UserAction[]): { sequence: string[], count: number }[]
            // Example: processTaskStepOutcomes(tasks: Task[]): { actionType: string, successRate: number }[]
            // Example: processEventFrequency(systemEvents: SystemEvent[]): { eventType: string, count: number }[]
        };

        console.log(`[AnalyticsService] Data prepared for Evolution Engine for user: ${userId}.`);
        this.context.loggingService?.logInfo(`Data prepared for Evolution Engine for user ${userId}`, { userId, timeframe });

        return processedData;
    }


    // TODO: Implement methods for processing raw data into structured formats for Evolution Engine.
    // Example: processActionSequences(actions: UserAction[]): { sequence: string[], count: number }[]
    // Example: processTaskStepOutcomes(tasks: Task[]): { actionType: string, successRate: number }[]
    // TODO: Implement methods for tracking specific user journeys or workflows.
    // TODO: Implement methods for generating reports or visualizations (integrates with UI).\
    // TODO: This module is the core of the Analytics Service (\u5206\u6790\u670d\u52d9) and supports Observe (\u89c0\u5bdf) and Monitor (\u76e3\u63a7) in the Six Styles.\
    // TODO: Data collected and processed here feeds directly into the Evolution Engine (\u7120\u9650\u9032\u5316\u5faa\u74b0).\
}\
\
// Example Usage (called by EvolutionEngine, UI, or background processes):\\\
// const analyticsService = new AnalyticsService(systemContext);\\\
// const kpis = await analyticsService.calculateKPIs('month', 'user-sim-123');\\\
// console.log('Monthly KPIs:', kpis);\\\
// const evolutionData = await analyticsService.getDataForEvolution('week', 'user-sim-123');\\\
// console.log('Data for Evolution Engine:', evolutionData);\\\
```