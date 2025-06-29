var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
""(__makeTemplateObject(["typescript\n// src/core/goal-management/GoalManagementService.ts\n// \u76EE\u6A19\u7BA1\u7406\u670D\u52D9 (Goal Management Service) - \u6838\u5FC3\u6A21\u7D44\n// Handles defining, tracking, and reporting on user goals (SMART, OKR).\n// Integrates with Self-Navigation (Tasks) and Analytics.\n// Design Principle: Provides structure for user objectives, supporting SMART and OKR frameworks.\n// --- Modified: Implement createGoal, getGoals, getGoalById, updateGoal, deleteGoal --\n// --- Modified: Implement updateKeyResultProgress --\n// --- New: Implement addKeyResultToGoal, updateKeyResult, deleteKeyResult --\n// --- New: Implement linkTaskToKeyResult, unlinkTaskFromKeyResult, checkAndCompleteKeyResultIfTaskCompleted --\n// --- New: Implement Realtime Subscriptions for goals and key_results --\n// --- Modified: Add language parameter to relevant methods --\n\n\nimport { SupabaseClient } from '@supabase/supabase-js'; // For persistence\nimport { SystemContext, Goal, KeyResult } from '../../interfaces'; // Dependency on interfaces\n// import { AnalyticsService } from '../../modules/analytics/AnalyticsService'; // Dependency for tracking progress\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n// import { SelfNavigationEngine } from '../self-navigation/SelfNavigationEngine'; // Dependency for task linking\n\n\nexport class GoalManagementService {\n    private supabase: SupabaseClient; // For persisting goals\n    private context: SystemContext;\n    // private analyticsService: AnalyticsService; // Access via context\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n    // private selfNavigationEngine: SelfNavigationEngine; // Access via context\n\n    // --- New: Realtime Subscriptions ---\n    private goalsSubscription: any | null = null;\n    private keyResultsSubscription: any | null = null;\n    // --- End New ---\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.analyticsService = context.analyticsService;\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        // this.selfNavigationEngine = context.selfNavigationEngine;\n        console.log('GoalManagementService initialized.');\n\n        // TODO: Load existing goals from persistence on startup (Supports Bidirectional Sync Domain)\n        // TODO: Subscribe to relevant events (e.g., 'task_completed', 'user_action') to update progress (Supports Event Push)\n        // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompleted(payload));\n\n\n        // --- New: Set up Supabase Realtime subscriptions ---        // Subscribe when the user is authenticated.\\        this.context.securityService?.onAuthStateChange((user) => {\\            if (user) {\\                this.subscribeToGoalsUpdates(user.id);\\                this.subscribeToKeyResultsUpdates(user.id);\\            } else {\\                this.unsubscribeFromGoalsUpdates();\\                this.unsubscribeFromKeyResultsUpdates();\\            }\\        });\\        // --- End New ---\\    }\\\\    /**\\     * Handles a task completed event to potentially update KR progress.\\     * This method is called by the EventBus listener.\\     * @param payload The task completed event payload (includes taskId, userId).\\     */\\    private async handleTaskCompleted(payload: any): Promise<void> {\\        console.log('[GoalManagementService] Handling task_completed event.');\\        // Find KRs linked to this task and check/update their progress\\        // This requires fetching tasks by ID to get the linked_kr_id\\        // Or fetching KRs by linked_task_ids\\        // For MVP, let's assume the task payload includes linked_kr_id\\        if (payload?.taskId && payload?.userId && payload?.linked_kr_id) {\\            console.log("], ["typescript\n// src/core/goal-management/GoalManagementService.ts\n// \\u76ee\\u6a19\\u7ba1\\u7406\\u670d\\u52d9 (Goal Management Service) - \\u6838\\u5fc3\\u6a21\\u7d44\n// Handles defining, tracking, and reporting on user goals (SMART, OKR).\n// Integrates with Self-Navigation (Tasks) and Analytics.\n// Design Principle: Provides structure for user objectives, supporting SMART and OKR frameworks.\n// --- Modified: Implement createGoal, getGoals, getGoalById, updateGoal, deleteGoal --\n// --- Modified: Implement updateKeyResultProgress --\n// --- New: Implement addKeyResultToGoal, updateKeyResult, deleteKeyResult --\n// --- New: Implement linkTaskToKeyResult, unlinkTaskFromKeyResult, checkAndCompleteKeyResultIfTaskCompleted --\n// --- New: Implement Realtime Subscriptions for goals and key_results --\n// --- Modified: Add language parameter to relevant methods --\n\n\nimport { SupabaseClient } from '@supabase/supabase-js'; // For persistence\nimport { SystemContext, Goal, KeyResult } from '../../interfaces'; // Dependency on interfaces\n// import { AnalyticsService } from '../../modules/analytics/AnalyticsService'; // Dependency for tracking progress\n// import { LoggingService } from '../logging/LoggingService'; // Dependency\n// import { EventBus } from '../../modules/events/EventBus'; // Dependency\n// import { SelfNavigationEngine } from '../self-navigation/SelfNavigationEngine'; // Dependency for task linking\n\n\nexport class GoalManagementService {\n    private supabase: SupabaseClient; // For persisting goals\n    private context: SystemContext;\n    // private analyticsService: AnalyticsService; // Access via context\n    // private loggingService: LoggingService; // Access via context\n    // private eventBus: EventBus; // Access via context\n    // private selfNavigationEngine: SelfNavigationEngine; // Access via context\n\n    // --- New: Realtime Subscriptions ---\n    private goalsSubscription: any | null = null;\n    private keyResultsSubscription: any | null = null;\n    // --- End New ---\n\n\n    constructor(context: SystemContext) {\n        this.context = context;\n        this.supabase = context.apiProxy.supabaseClient; // Use the Supabase client from ApiProxy\n        // this.analyticsService = context.analyticsService;\n        // this.loggingService = context.loggingService;\n        // this.eventBus = context.eventBus;\n        // this.selfNavigationEngine = context.selfNavigationEngine;\n        console.log('GoalManagementService initialized.');\n\n        // TODO: Load existing goals from persistence on startup (Supports Bidirectional Sync Domain)\n        // TODO: Subscribe to relevant events (e.g., 'task_completed', 'user_action') to update progress (Supports Event Push)\n        // Example: this.context.eventBus.subscribe('task_completed', (payload) => this.handleTaskCompleted(payload));\n\n\n        // --- New: Set up Supabase Realtime subscriptions ---\\\n        // Subscribe when the user is authenticated.\\\\\\\n        this.context.securityService?.onAuthStateChange((user) => {\\\\\\\n            if (user) {\\\\\\\n                this.subscribeToGoalsUpdates(user.id);\\\\\\\n                this.subscribeToKeyResultsUpdates(user.id);\\\\\\\n            } else {\\\\\\\n                this.unsubscribeFromGoalsUpdates();\\\\\\\n                this.unsubscribeFromKeyResultsUpdates();\\\\\\\n            }\\\\\\\n        });\\\\\\\n        // --- End New ---\\\\\\\n    }\\\\\\\n\\\\\\\n    /**\\\\\\\n     * Handles a task completed event to potentially update KR progress.\\\\\\\n     * This method is called by the EventBus listener.\\\\\\\n     * @param payload The task completed event payload (includes taskId, userId).\\\\\\\n     */\\\\\\\n    private async handleTaskCompleted(payload: any): Promise<void> {\\\\\\\n        console.log('[GoalManagementService] Handling task_completed event.');\\\\\\\n        // Find KRs linked to this task and check/update their progress\\\\\\\n        // This requires fetching tasks by ID to get the linked_kr_id\\\\\\\n        // Or fetching KRs by linked_task_ids\\\\\\\n        // For MVP, let's assume the task payload includes linked_kr_id\\\\\\\n        if (payload?.taskId && payload?.userId && payload?.linked_kr_id) {\\\\\\\n            console.log("]))[GoalManagementService];
Task;
$;
{
    payload.taskId;
}
completed, linked;
to;
KR;
$;
{
    payload.linked_kr_id;
}
Checking;
KR;
completion.(__makeTemplateObject([");\\            try {\\                // Call the service method to check and complete the KR if necessary\\                // This method is already implemented in GoalManagementService\\                await this.context.goalManagementService?.checkAndCompleteKeyResultIfTaskCompleted(payload.linked_kr_id, payload.taskId, payload.userId);\\            } catch (error: any) {\\                console.error("], [");\\\\\\\n            try {\\\\\\\n                // Call the service method to check and complete the KR if necessary\\\\\\\n                // This method is already implemented in GoalManagementService\\\\\\\n                await this.context.goalManagementService?.checkAndCompleteKeyResultIfTaskCompleted(payload.linked_kr_id, payload.taskId, payload.userId);\\\\\\\n            } catch (error: any) {\\\\\\\n                console.error("]))[GoalManagementService];
Error;
checking;
KR;
completion;
after;
task;
$;
{
    payload.taskId;
}
completed: ", error.message);\\                // Log the error\\            }\\        }\\    }\\\\\\    /**\\     * Creates a new goal (SMART or OKR) for a specific user in Supabase.\\\\\\\\\n     * @param goalDetails The details of the goal (without id, status, creation_timestamp, key_results, linked_task_ids). Required.\\\\\\\\\n     * @param keyResults Optional key results for OKR goals (without id, goal_id, status, current_value).\\\\\\\\\\n     * @param userId The user ID to associate the goal with. Required.\\\\\\\\\n     * @returns Promise<Goal | null> The created goal or null on failure.\\\\\\\\\n     */\\\\\\\n    async createGoal(goalDetails: Omit<Goal, 'id' | 'status' | 'creation_timestamp' | 'key_results'>, keyResults: Omit<KeyResult, 'id' | 'goal_id' | 'status' | 'current_value' | 'linked_task_ids'>[] = [], userId: string): Promise<Goal | null> {\\\\\\\\\\\n        console.log('Creating goal in Supabase:', goalDetails.description, 'for user:', userId);\\\\\\\\\\\n        this.context.loggingService?.logInfo('Attempting to create goal', { description: goalDetails.description, userId });\\\\\\\\\\\n\\\\\\\\\\\n        if (!userId) {\\\\\\\\\\\n            console.error('[GoalManagementService] Cannot create goal: User ID is required.');\\\\\\\\\\\n            this.context.loggingService?.logError('Cannot create goal: User ID is required.');\\\\\\\\\\\n            throw new Error('User ID is required to create a goal.');\\\\\\\\\\\n        }\\\\\\\\\\\n\\\\\\\\\\\n        // Create the goal first to get its ID\\\\\\\\\\\n        const newGoalData: Omit<Goal, 'id' | 'key_results' | 'creation_timestamp'> = {\\\\\\\\\\\n            ...goalDetails,\\\\\\\\\\\\n            status: 'pending', // Initial status\\\\\\\\\\\n            user_id: userId, // Associate with user\\\\\\\\\\\n            linked_task_ids: [], // Initialize empty array\\\\\\\\\\\n        };\\\\\\\\\\\n\\\\\\\\\\\n        try {\\\\\\\\\\\n            // Persist goal to Supabase (Supports Bidirectional Sync Domain)\\\\\\\\\\\n            const { data: goalResult, error: goalError } = await this.supabase\\\\\\\\\\\n                .from('goals')\\\\\\\\\\\n                .insert([newGoalData])\\\\\\\\\\\n                .select() // Select the inserted data to get the generated ID and timestamp\\\\\\\\\\\n                .single(); // Expecting a single record back\\\\\\\\\\\n\\\\\\\\\\\n            if (goalError) {\\\\\\\\\\\n                console.error('Error creating goal in Supabase:', goalError);\\\\\\\\\\\n                this.context.loggingService?.logError('Failed to create goal', { description: goalDetails.description, userId: userId, error: goalError.message });\\\\\\\\\\\n                throw goalError; // Re-throw the error\\\\\\\\\\\n            }\\\\\\\\\\\n\\\\\\\\\\\n            const newGoal = goalResult as Goal;\\\\\\\\\\\n            console.log('Goal created:', newGoal.id, '-', newGoal.description, 'for user:', newGoal.user_id);\\\\\\\\\\\n\\\\\\\\\\\n\\\\\\\\\\\n            // Now create the key results, linking them to the new goal ID\\\\\\\\\\\n            const newKeyResultsData = keyResults.map(kr => ({\\\\\\\\\\\n                ...kr,\\\\\\\\\\n                goal_id: newGoal.id, // Link to the parent goal\\\\\\\\\\\n                current_value: 0, // Initial value is 0\\\\\\\\\\\n                status: 'on-track', // Initial status\\\\\\\\\\\n                linked_task_ids: [], // Initialize empty array\\\\\\\\\\\n            }));\\\\\\\\\\\n\\\\\\\\\\\n            if (newKeyResultsData.length > 0) {\\\\\\\\\\\n                 const { data: krsResult, error: krsError } = await this.supabase\\\\\\\\\\\n                    .from('key_results')\\\\\\\\\\\n                    .insert(newKeyResultsData)\\\\\\\\\\\n                    .select(); // Select the inserted key results\\\\\\\\\\\n\\\\\\\\\\\n                if (krsError) {\\\\\\\\\\\n                    console.error('Error creating key results in Supabase:', krsError);\\\\\\\\\\\n                     // TODO: Decide how to handle goal creation if KRs fail (e.g., delete the goal)\\\\\\\\\\\n                     this.context.loggingService?.logError('Failed to create key results', { goalId: newGoal.id, userId: userId, error: krsError.message });\\\\\\\\\\\n                     // For now, just throw, leaving the goal without KRs\\\\\\\\\\\n                     throw krsError; // Re-throw the error\\\\\\\\\\\n                }\\\\\\\\\\\n                 // Attach the created key results to the goal object\\\\\\\\\\\n                newGoal.key_results = krsResult as KeyResult[];\\\\\\\\\\\n            } else {\\\\\\\\\\\n                 newGoal.key_results = []; // Goal has no key results\\\\\\\\\\\n            }\\\\\\\\\\\n\\\\\\\\\\\n\\\\\\\\\\\n            // Publish a 'goal_created' event (part of Six Styles/EventBus - call context.eventBus.publish)\\\\\\\\\\\n            this.context.eventBus?.publish('goal_created', newGoal, userId); // Include userId in event\\\\\\\\\\\n\\\\\\\\\\\n            this.context.loggingService?.logInfo(";
Goal;
created: $;
{
    newGoal.id;
}
", { description: newGoal.description, userId: userId });\\\\\\\\\\\n\\\\\\\\\\\n            return newGoal;\\\\\\\\\\\n\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\n            console.error('Failed to create goal:', error);\\\\\\\\\\\n            this.context.loggingService?.logError('Failed to create goal', { description: goalDetails.description, userId: userId, error: error.message });\\\\\\\\\\\n            return null; // Return null on failure\\\\\\\\\\\n        }\\\\\\\\\\\n    }\\\\\\\\\\\n\\\\\\\\\\\n    /**\\\\\\\\\\\n     * Retrieves goals for a specific user from Supabase, including their key results.\\\\\\\\\\n     * @param userId The user ID. Required.\\\\\\\\\\n     * @param status Optional: Filter by status.\\\\\\\\\\n     * @returns Promise<Goal[]> An array of Goal objects.\\\\\\\\\\n     */\\\\\\\n    async getGoals(userId: string, status?: Goal['status']): Promise<Goal[]> {\\\\\\\\\\\n        console.log('Retrieving goals from Supabase for user:', userId, 'status:', status || 'all');\\\\\\\\\\\n        this.context.loggingService?.logInfo('Attempting to fetch goals', { userId, status });\\\\\\\\\\\n\\\\\\\\\\\n        if (!userId) {\\\\\\\\\\\n            console.warn('[GoalManagementService] Cannot retrieve goals: User ID is required.');\\\\\\\\\\\n            this.context.loggingService?.logWarning('Cannot retrieve goals: User ID is required.');\\\\\\\\\\\n            return []; // Return empty if no user ID\\\\\\\\\\\n        }\\\\\\\\\\\n        try {\\\\\\\\\\\n            // Fetch goals from Supabase, filtered by user_id, and join with key_results\\\\\\\\\\\n            let dbQuery = this.supabase\\\\\\\\\\\n                .from('goals')\\\\\\\\\\\n                .select('*, key_results(*)') // Select goal fields and all related key_results\\\\\\\\\\\n                .eq('user_id', userId);\\\\\\\\\\\n\\\\\\\\\\\n            if (status) {\\\\\\\\\\\n                dbQuery = dbQuery.eq('status', status);\\\\\\\\\\\n            }\\\\\\\\\\\n\\\\\\\\\\\n            dbQuery = dbQuery.order('creation_timestamp', { ascending: false } as any); // Order goals by creation time\\\\\\\\\\\n\\\\\\\\\\\n            const { data, error } = await dbQuery;\\\\\\\\\\\n\\\\\\\\\\\n            if (error) { throw error; }\\\\\\\\\\\n\\\\\\\\\\\n            // Supabase join returns nested objects\\\\\\\\\\\n            const goals = data as Goal[];\\\\\\\\\\\n\\\\\\\\\\\n            console.log(";
Fetched;
$;
{
    goals.length;
}
goals;
for (user; $; { userId: userId }.(__makeTemplateObject([");\\\\\\\\\\\n            this.context.loggingService?.logInfo("], [");\\\\\\\\\\\\\\\\\\\\\\n            this.context.loggingService?.logInfo("])))
    Fetched;
$;
{
    data.length;
}
goals;
successfully.(__makeTemplateObject([", { userId });\\\\\\\\\\\n\\\\\\\\\\\n            return goals;\\\\\\\\\\\n\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\n            console.error('Error fetching goals from Supabase:', error);\\\\\\\\\\\n            this.context.loggingService?.logError('Failed to fetch goals', { userId: userId, status: status, error: error.message });\\\\\\\\\\\n            return [];\\\\\\\\\\\n        }\\\\\\\\\\\n    }\\\\\\\\\\\n\\\\\\\\\\\n    /**\\\\\\\\\\\n     * Retrieves a specific goal by ID for a specific user from Supabase, including its key results.\\\\\\\\\\n     * @param goalId The ID of the goal. Required.\\\\\\\\\\n     * @param userId The user ID for verification. Required.\\\\\\\\\\n     * @returns Promise<Goal | undefined> The Goal object or undefined.\\\\\\\\\\n     */\\\\\\\n    async getGoalById(goalId: string, userId: string): Promise<Goal | undefined> {\\\\\\\\\\\n        console.log('Retrieving goal by ID from Supabase:', goalId, 'for user:', userId);\\\\\\\\\\\n        this.context.loggingService?.logInfo("], [", { userId });\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n            return goals;\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\\\\\\\\\\\\n            console.error('Error fetching goals from Supabase:', error);\\\\\\\\\\\\\\\\\\\\\\n            this.context.loggingService?.logError('Failed to fetch goals', { userId: userId, status: status, error: error.message });\\\\\\\\\\\\\\\\\\\\\\n            return [];\\\\\\\\\\\\\\\\\\\\\\n        }\\\\\\\\\\\\\\\\\\\\\\n    }\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n    /**\\\\\\\\\\\\\\\\\\\\\\n     * Retrieves a specific goal by ID for a specific user from Supabase, including its key results.\\\\\\\\\\\\\\\\\\\\n     * @param goalId The ID of the goal. Required.\\\\\\\\\\\\\\\\\\\\n     * @param userId The user ID for verification. Required.\\\\\\\\\\\\\\\\\\\\n     * @returns Promise<Goal | undefined> The Goal object or undefined.\\\\\\\\\\\\\\\\\\\\n     */\\\\\\\\\\\\\\n    async getGoalById(goalId: string, userId: string): Promise<Goal | undefined> {\\\\\\\\\\\\\\\\\\\\\\n        console.log('Retrieving goal by ID from Supabase:', goalId, 'for user:', userId);\\\\\\\\\\\\\\\\\\\\\\n        this.context.loggingService?.logInfo("]));
Attempting;
to;
fetch;
goal;
$;
{
    goalId;
}
", { id: goalId, userId });\\\\\\\\\\\n\\\\\\\\\\\n         if (!userId) {\\\\\\\\\\\n             console.warn('[GoalManagementService] Cannot retrieve goal: User ID is required.');\\\\\\\\\\\n             this.context.loggingService?.logWarning('Cannot retrieve goal: User ID is required.');\\\\\\\\\\\n             return undefined;\\\\\\\\\\\n         }\\\\\\\\\\\n        try {\\\\\\\\\\\n            // Fetch goal from Supabase by ID and user_id, and join with key_results\\\\\\\\\\\n              const { data, error } = await this.supabase\\\\\\\\\\\n                  .from('goals')\\\\\\\\\\\n                  .select('*, key_results(*)') // Select goal fields and all related key_results\\\\\\\\\\\n                  .eq('id', goalId)\\\\\\\\\\\n                  .eq('user_id', userId) // Ensure ownership\\\\\\\\\\\n                  .single();\\\\\\\\\\\n\\\\\\\\\\\n              if (error) { throw error; }\\\\\\\\\\\n              if (!data) { return undefined; } // Goal not found or doesn't belong to user\\\\\\\\\\\n\\\\\\\\\\\n              const goal = data as Goal;\\\\\\\\\\\n\\\\\\\\\\\n              console.log(";
Fetched;
goal;
$;
{
    goalId;
}
for (user; $; { userId: userId }.(__makeTemplateObject([");\\\\\\\\\\\n              this.context.loggingService?.logInfo("], [");\\\\\\\\\\\\\\\\\\\\\\n              this.context.loggingService?.logInfo("])))
    Fetched;
goal;
$;
{
    goalId;
}
successfully.(__makeTemplateObject([", { id: goalId, userId: userId });\\\\\\\\\\\n\\\\\\\\\\\n              return goal;\\\\\\\\\\\n\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\n            console.error("], [", { id: goalId, userId: userId });\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n              return goal;\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\\\\\\\\\\\\n            console.error("]));
Error;
fetching;
goal;
$;
{
    goalId;
}
from;
Supabase: ", error);\\\\\\\\\\\n            this.context.loggingService?.logError(";
Failed;
to;
fetch;
goal;
$;
{
    goalId;
}
", { id: goalId, userId: userId, error: error.message });\\\\\\\\\\\n            return undefined;\\\\\\\\\\\n        }\\\\\\\\\\\n    }\\\\\\\\\\\n\\\\\\\\\\\n\\\\\\\\\\\n    /**\\\\\\\\\\\n     * Updates an existing goal for a specific user in Supabase.\\\\\\\\\\n     * Note: This method is primarily for updating goal-level fields (description, type, status, target_completion_date).\\\\\\\\\\\n     * Updating key results requires separate methods.\\\\\\\\\\n     * @param goalId The ID of the goal. Required.\\\\\\\\\\n     * @param updates The updates to apply. Required.\\\\\\\\\\n     * @param userId The user ID for verification. Required.\\\\\\\\\\n     * @returns Promise<Goal | undefined> The updated Goal or undefined if not found or user mismatch.\\\\\\\\\\n     */\\\\\\\n    async updateGoal(goalId: string, updates: Partial<Omit<Goal, 'id' | 'user_id' | 'creation_timestamp' | 'key_results'>>, userId: string): Promise<Goal | undefined> {\\\\\\\\\\\n        console.log(";
Updating;
goal;
$;
{
    goalId;
}
 in Supabase;
for (user; $; { userId: userId })
    ;
", updates);\\\\\\\\\\\n        this.context.loggingService?.logInfo(";
Attempting;
to;
update;
goal;
$;
{
    goalId;
}
", { id: goalId, updates, userId });\\\\\\\\\\\n\\\\\\\\\\\n         if (!userId) {\\\\\\\\\\\n             console.warn('[GoalManagementService] Cannot update goal: User ID is required.');\\\\\\\\\\\n             this.context.loggingService?.logWarning('Cannot update goal: User ID is required.');\\\\\\\\\\\n             return undefined;\\\\\\\\\\\n         }\\\\\\\\\\\n\\\\\\\\\\\n        try {\\\\\\\\\\\n            // Persist update to Supabase (Supports Bidirectional Sync Domain)\\\\\\\\\\\n            // Filter by ID and user_id to ensure ownership\\\\\\\\\\\n              const { data, error } = await this.supabase\\\\\\\\\\\n                  .from('goals')\\\\\\\\\\\n                  .update(updates)\\\\\\\\\\\n                  .eq('id', goalId)\\\\\\\\\\\n                  .eq('user_id', userId) // Ensure ownership\\\\\\\\\\\n                  .select('*, key_results(*)') // Select updated goal and its key results\\\\\\\\\\\n                  .single();\\\\\\\\\\\n\\\\\\\\\\\n              if (error) { throw error; }\\\\\\\\\\\n              if (!data) { // Should not happen if RLS is correct and ID/user_id match\\\\\\\\\\\n                   console.warn(";
Goal;
$;
{
    goalId;
}
not;
found;
or;
does;
not;
belong;
to;
user;
$;
{
    userId;
}
for (update.(__makeTemplateObject([");\\\\\\\\\\\n                   this.context.loggingService?.logWarning("], [");\\\\\\\\\\\\\\\\\\\\\\n                   this.context.loggingService?.logWarning("])); Goal; not)
    found;
or;
user;
mismatch;
for (update; ; )
    : $;
{
    goalId;
}
", { userId });\\\\\\\\\\\n                   return undefined;\\\\\\\\\\\n              }\\\\\\\\\\\n\\\\\\\\\\\n              const updatedGoal = data as Goal;\\\\\\\\\\\n\\\\\\\\\\\n            console.log(";
Goal;
$;
{
    goalId;
}
updated in Supabase.(__makeTemplateObject([");\\\\\\\\\\\n            // Publish an event indicating a goal has been updated (part of Six Styles/EventBus)\\\\\\\\\\\n            this.context.eventBus?.publish('goal_updated', updatedGoal, userId); // Include userId in event\\\\\\\\\\\n            this.context.loggingService?.logInfo("], [");\\\\\\\\\\\\\\\\\\\\\\n            // Publish an event indicating a goal has been updated (part of Six Styles/EventBus)\\\\\\\\\\\\\\\\\\\\\\n            this.context.eventBus?.publish('goal_updated', updatedGoal, userId); // Include userId in event\\\\\\\\\\\\\\\\\\\\\\n            this.context.loggingService?.logInfo("]));
Goal;
updated;
successfully: $;
{
    goalId;
}
", { id: goalId, userId: userId });\\\\\\\\\\\n\\\\\\\\\\\n            return updatedGoal;\\\\\\\\\\\n\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\n            console.error(";
Failed;
to;
update;
goal;
$;
{
    goalId;
}
", error);\\\\\\\\\\\n            this.context.loggingService?.logError(";
Failed;
to;
update;
goal;
$;
{
    goalId;
}
", { id: goalId, updates, userId: userId, error: error.message });\\\\\\\\\\\n            throw error; // Re-throw the error\\\\\\\\\\\n        }\\\\\\\\\\\n    }\\\\\\\\\\\n\\\\\\\\\\\n    /**\\\\\\\\\\\n     * Deletes a goal for a specific user from Supabase.\\\\\\\\\\n     * This will also cascade delete associated key_results due to foreign key constraint.\\\\\\\\\\n     * @param goalId The ID of the goal. Required.\\\\\\\\\\n     * @param userId The user ID for verification. Required.\\\\\\\\\\n     * @returns Promise<boolean> True if deletion was successful, false otherwise.\\\\\\\\\\n     */\\\\\\\n    async deleteGoal(goalId: string, userId: string): Promise<boolean> {\\\\\\\\\\\n        console.log(";
Deleting;
goal;
$;
{
    goalId;
}
from;
Supabase;
for (user; $; { userId: userId })
    ;
");\\\\\\\\\\\n        this.context.loggingService?.logInfo(";
Attempting;
to;
delete goal;
$;
{
    goalId;
}
", { id: goalId, userId });\\\\\\\\\\\n\\\\\\\\\\\n         if (!userId) {\\\\\\\\\\\n             console.warn('[GoalManagementService] Cannot delete goal: User ID is required.');\\\\\\\\\\\n             this.context.loggingService?.logWarning('Cannot delete goal: User ID is required.');\\\\\\\\\\\n             return false; // Return false if no user ID\\\\\\\\\\\n         }\\\\\\\\\\\n\\\\\\\\\\\n        try {\\\\\\\\\\\n            // Persist deletion to Supabase (Supports Bidirectional Sync Domain)\\\\\\\\\\\n            // Filter by ID and user_id to ensure ownership\\\\\\\\\\\n              const { count, error } = await this.supabase\\\\\\\\\\\n                  .from('goals')\\\\\\\\\\\n                  .delete()\\\\\\\\\\\n                  .eq('id', goalId)\\\\\\\\\\\n                  .eq('user_id', userId)\\\\\\\\\\\n                  .select('id', { count: 'exact' }); // Select count to check if a row was deleted\\\\\\\\\\\n\\\\\\\\\\\n              if (error) { throw error; }\\\\\\\\\\\n\\\\\\\\\\\n              const deleted = count !== null && count > 0; // Check if count is greater than 0\\\\\\\\\\\n\\\\\\\\\\\n              if (deleted) {\\\\\\\\\\\n                  console.log(";
Goal;
$;
{
    goalId;
}
deleted;
from;
Supabase.(__makeTemplateObject([");\\\\\\\\\\\n                  // Publish an event indicating a goal has been deleted (part of Six Styles/EventBus)\\\\\\\\\\\n                  this.context.eventBus?.publish('goal_deleted', { goalId: goalId, userId: userId }, userId); // Include userId in event\\\\\\\\\\\n                  this.context.loggingService?.logInfo("], [");\\\\\\\\\\\\\\\\\\\\\\n                  // Publish an event indicating a goal has been deleted (part of Six Styles/EventBus)\\\\\\\\\\\\\\\\\\\\\\n                  this.context.eventBus?.publish('goal_deleted', { goalId: goalId, userId: userId }, userId); // Include userId in event\\\\\\\\\\\\\\\\\\\\\\n                  this.context.loggingService?.logInfo("]));
Goal;
deleted;
successfully: $;
{
    goalId;
}
", { id: goalId, userId: userId });\\\\\\\\\\\n              } else {\\\\\\\\\\\n                  console.warn(";
Goal;
not;
found;
for (deletion; or; user)
    mismatch: $;
{
    goalId;
}
");\\\\\\\\\\\n                  this.context.loggingService?.logWarning(";
Goal;
not;
found;
for (deletion; or; user)
    mismatch: $;
{
    goalId;
}
", { id: goalId, userId });\\\\\\\\\\\n              }\\\\\\\\\\\n              return deleted;\\\\\\\\\\\n\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\n            console.error(";
Failed;
to;
delete goal;
$;
{
    goalId;
}
", error);\\\\\\\\\\\n            this.context.loggingService?.logError(";
Failed;
to;
delete goal;
$;
{
    goalId;
}
", { id: goalId, userId: userId, error: error.message });\\\\\\\\\\\n            return false; // Return false on failure\\\\\\\\\\\n        }\\\\\\\\\\\n    }\\\\\\\\\\\n\\\\\\\\\\\n    /**\\\\\\\\\\\n     * Updates the progress of a Key Result for a specific user in Supabase.\\\\\\\\\\n     * This might be triggered by task completion, user action, or manual input.\\\\\\\\\\n     * @param krId The ID of the Key Result. Required.\\\\\\\\\\n     * @param currentValue The new current value. Required.\\\\\\\\\\n     * @param userId The user ID for verification (checks parent goal ownership). Required.\\\\\\\\\\n     * @returns Promise<KeyResult | null> The updated KR or null if not found or user mismatch.\\\\\\\\\\n     */\\\\\\\n    async updateKeyResultProgress(krId: string, currentValue: number, userId: string): Promise<KeyResult | null> {\\\\\\\\\\\n        console.log("[GoalManagementService];
Updating;
KR;
$;
{
    krId;
}
progress;
to;
$;
{
    currentValue;
}
 in Supabase;
for (user; $; { userId: userId })
    ;
");\\\\\\\\\\\n        this.context.loggingService?.logInfo(";
Attempting;
to;
update;
KR;
$;
{
    krId;
}
progress(__makeTemplateObject([", { id: krId, currentValue, userId });\\\\\\\\\\\n\\\\\\\\\\\n         if (!userId) {\\\\\\\\\\\n             console.warn('[GoalManagementService] Cannot update KR progress: User ID is required.');\\\\\\\\\\\n             this.context.loggingService?.logWarning('Cannot update KR progress: User ID is required.');\\\\\\\\\\\n             return null;\\\\\\\\\\\n         }\\\\\\\\\\\n\\\\\\\\\\\n        try {\\\\\\\\\\\n            // Fetch the KR first to get its goal_id and verify user ownership via the goal\\\\\\\\\\\n            const { data: krData, error: fetchError } = await this.supabase\\\\\\\\\\\n                .from('key_results')\\\\\\\\\\\n                .select('*, goals(user_id)') // Select KR and join with parent goal to get user_id\\\\\\\\\\\n                .eq('id', krId)\\\\\\\\\\\n                .single();\\\\\\\\\\\n\\\\\\\\\\\n            if (fetchError) { throw fetchError; }\\\\\\\\\\\n            if (!krData || (krData.goals as any)?.user_id !== userId) { // Check if KR exists and parent goal belongs to user\\\\\\\\\\\n                console.warn("], [", { id: krId, currentValue, userId });\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n         if (!userId) {\\\\\\\\\\\\\\\\\\\\\\n             console.warn('[GoalManagementService] Cannot update KR progress: User ID is required.');\\\\\\\\\\\\\\\\\\\\\\n             this.context.loggingService?.logWarning('Cannot update KR progress: User ID is required.');\\\\\\\\\\\\\\\\\\\\\\n             return null;\\\\\\\\\\\\\\\\\\\\\\n         }\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n        try {\\\\\\\\\\\\\\\\\\\\\\n            // Fetch the KR first to get its goal_id and verify user ownership via the goal\\\\\\\\\\\\\\\\\\\\\\n            const { data: krData, error: fetchError } = await this.supabase\\\\\\\\\\\\\\\\\\\\\\n                .from('key_results')\\\\\\\\\\\\\\\\\\\\\\n                .select('*, goals(user_id)') // Select KR and join with parent goal to get user_id\\\\\\\\\\\\\\\\\\\\\\n                .eq('id', krId)\\\\\\\\\\\\\\\\\\\\\\n                .single();\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n            if (fetchError) { throw fetchError; }\\\\\\\\\\\\\\\\\\\\\\n            if (!krData || (krData.goals as any)?.user_id !== userId) { // Check if KR exists and parent goal belongs to user\\\\\\\\\\\\\\\\\\\\\\n                console.warn("]));
Key;
Result;
$;
{
    krId;
}
not;
found;
or;
parent;
goal;
does;
not;
belong;
to;
user;
$;
{
    userId;
}
for (update.(__makeTemplateObject([");\\\\\\\\\\\n                this.context.loggingService?.logWarning("], [");\\\\\\\\\\\\\\\\\\\\\\n                this.context.loggingService?.logWarning("])); Key; Result)
    not;
found;
or;
user;
mismatch;
for (update; ; )
    : $;
{
    krId;
}
", { userId });\\\\\\\\\\\n                return null;\\\\\\\\\\\n            }\\\\\\\\\\\n\\\\\\\\\\\n            const kr = krData as KeyResult;\\\\\\\\\\\n\\\\\\\\\\\n            // Determine new status based on current and target values\\\\\\\\\\\n            const targetValue = kr.target_value;\\\\\\\\\\\n            let newStatus: KeyResult['status'] = 'on-track';\\\\\\\\\\\n            if (currentValue >= targetValue) {\\\\\\\\\\\n                newStatus = 'completed';\\\\\\\\\\\n            } else if (targetValue > 0 && currentValue / targetValue > 0.75) { // Example threshold\\\\\\\\\\\n                newStatus = 'on-track';\\\\\\\\\\\n            } else {\\\\\\\\\\\n                newStatus = 'at-risk';\\\\\\\\\\\n            }\\\\\\\\\\\n\\\\\\\\\\\n\\\\\\\\\\\n            // Now update the Key Result in Supabase\\\\\\\\\\\n            const { data: updatedKrData, error: updateError } = await this.supabase\\\\\\\\\\\n                .from('key_results')\\\\\\\\\\\n                .update({ current_value: currentValue, status: newStatus } as Partial<KeyResult>) // Cast to Partial<KeyResult>\\\\\\\\\\\n                .eq('id', krId)\\\\\\\\\\\n                .select() // Select the updated KR data\\\\\\\\\\\n                .single();\\\\\\\\\\\n\\\\\\\\\\\n            if (updateError) { throw updateError; }\\\\\\\\\\\n            if (!updatedKrData) {\\\\\\\\\\\n                console.error(";
Failed;
to;
retrieve;
updated;
KR;
data;
for ($; { krId: krId }; after)
    marking;
completed.(__makeTemplateObject([");\\\\\\\\\\\n                this.context.loggingService?.logError("], [");\\\\\\\\\\\\\\\\\\\\\\n                this.context.loggingService?.logError("]));
Failed;
to;
retrieve;
updated;
KR;
data;
after;
marking;
completed: $;
{
    krId;
}
", { userId });\\\\\\\\\\\n                return null;\\\\\\\\\\\n            }\\\\\\\\\\\n\\\\\\\\\\\n            const updatedKr = updatedKrData as KeyResult;\\\\\\\\\\\n\\\\\\\\\\\n            console.log(";
Key;
Result;
$;
{
    krId;
}
progress;
updated in Supabase.(__makeTemplateObject([");\\\\\\\\\\\n            // TODO: Log KR progress update (Supports Observe/Monitor, KPI - call loggingService.logInfo)\\\\\\\\\\\n            this.context.loggingService?.logInfo('Key Result progress updated', { krId: updatedKr.id, goalId: updatedKr.goal_id, currentValue: updatedKr.current_value, status: updatedKr.status, userId: userId });\\\\\\\\\\\n            // Publish 'key_result_updated' event (Supports Event Push - call eventBus.publish)\\\\\\\\\\\n            this.context.eventBus?.publish('key_result_updated', updatedKr, userId); // Include userId in event\\\\\\\\\\\n\\\\\\\\\\\n\\\\\\\\\\\n            // Optional: Check if the parent goal is now completed based on KR status\\\\\\\\\\\n            // This is more complex and might involve fetching all KRs for the goal\\\\\\\\\\\n            // and checking if all are 'completed'. Can be done asynchronously or via trigger.\\\\\\\\\\n            // For MVP, we won't automatically update goal status here.\\\\\\\\\\n\\\\\\\\\\\n            return updatedKr;\\\\\\\\\\\n\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\n            console.error("], [");\\\\\\\\\\\\\\\\\\\\\\n            // TODO: Log KR progress update (Supports Observe/Monitor, KPI - call loggingService.logInfo)\\\\\\\\\\\\\\\\\\\\\\n            this.context.loggingService?.logInfo('Key Result progress updated', { krId: updatedKr.id, goalId: updatedKr.goal_id, currentValue: updatedKr.current_value, status: updatedKr.status, userId: userId });\\\\\\\\\\\\\\\\\\\\\\n            // Publish 'key_result_updated' event (Supports Event Push - call eventBus.publish)\\\\\\\\\\\\\\\\\\\\\\n            this.context.eventBus?.publish('key_result_updated', updatedKr, userId); // Include userId in event\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n            // Optional: Check if the parent goal is now completed based on KR status\\\\\\\\\\\\\\\\\\\\\\n            // This is more complex and might involve fetching all KRs for the goal\\\\\\\\\\\\\\\\\\\\\\n            // and checking if all are 'completed'. Can be done asynchronously or via trigger.\\\\\\\\\\\\\\\\\\\\n            // For MVP, we won't automatically update goal status here.\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n            return updatedKr;\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\\\\\\\\\\\\n            console.error("]));
Failed;
to;
update;
KR;
$;
{
    krId;
}
progress: ", error);\\\\\\\\\\\n            this.context.loggingService?.logError(";
Failed;
to;
update;
KR;
$;
{
    krId;
}
progress(__makeTemplateObject([", { id: krId, currentValue, userId: userId, error: error.message });\\\\\\\\\\\n            throw error; // Re-throw the error\\\\\\\\\\\n        }\\\\\\\\\\\n    }\\\\\\\\\\\n\\\\\\\\\\\n    /**\\\\\\\\\\\n     * Links a task to a specific Key Result.\\\\\\\\\\n     * Adds the task ID to the KR's "], [", { id: krId, currentValue, userId: userId, error: error.message });\\\\\\\\\\\\\\\\\\\\\\n            throw error; // Re-throw the error\\\\\\\\\\\\\\\\\\\\\\n        }\\\\\\\\\\\\\\\\\\\\\\n    }\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n    /**\\\\\\\\\\\\\\\\\\\\\\n     * Links a task to a specific Key Result.\\\\\\\\\\\\\\\\\\\\n     * Adds the task ID to the KR's "]));
linked_task_ids(__makeTemplateObject([" array.\\\\\\\\\\n     * @param krId The ID of the Key Result. Required.\\\\\\\\\\n     * @param taskId The ID of the task to link. Required.\\\\\\\\\\n     * @param userId The user ID for verification. Required.\\\\\\\\\\n     * @returns Promise<KeyResult | undefined> The updated KR or undefined.\\\\\\\\\\n     */\\\\\\\n    async linkTaskToKeyResult(krId: string, taskId: string, userId: string): Promise<KeyResult | undefined> {\\\\\\\\\\\n        console.log("], [" array.\\\\\\\\\\\\\\\\\\\\n     * @param krId The ID of the Key Result. Required.\\\\\\\\\\\\\\\\\\\\n     * @param taskId The ID of the task to link. Required.\\\\\\\\\\\\\\\\\\\\n     * @param userId The user ID for verification. Required.\\\\\\\\\\\\\\\\\\\\n     * @returns Promise<KeyResult | undefined> The updated KR or undefined.\\\\\\\\\\\\\\\\\\\\n     */\\\\\\\\\\\\\\n    async linkTaskToKeyResult(krId: string, taskId: string, userId: string): Promise<KeyResult | undefined> {\\\\\\\\\\\\\\\\\\\\\\n        console.log("]))[GoalManagementService];
Linking;
task;
$;
{
    taskId;
}
to;
KR;
$;
{
    krId;
}
for (user; $; { userId: userId })
    ;
");\\\\\\\\\\\n        this.context.loggingService?.logInfo(";
Attempting;
to;
link;
task;
$;
{
    taskId;
}
to;
KR;
$;
{
    krId;
}
", { taskId, krId, userId });\\\\\\\\\\\n\\\\\\\\\\\n        if (!userId) {\\\\\\\\\\\n            console.warn('[GoalManagementService] Cannot link task to KR: User ID is required.');\\\\\\\\\\\n            this.context.loggingService?.logWarning('Cannot link task to KR: User ID is required.');\\\\\\\\\\\n            return undefined;\\\\\\\\\\\n        }\\\\\\\\\\\n\\\\\\\\\\\n        try {\\\\\\\\\\\n            // Fetch the KR first to get its current linked_task_ids and verify user ownership via the goal\\\\\\\\\\\n            const { data: krData, error: fetchError } = await this.supabase\\\\\\\\\\\n                .from('key_results')\\\\\\\\\\\n                .select('linked_task_ids, goals(user_id)') // Select current linked_task_ids and join with parent goal to get user_id\\\\\\\\\\\n                .eq('id', krId)\\\\\\\\\\\n                .single();\\\\\\\\\\\n\\\\\\\\\\\n            if (fetchError) { throw fetchError; }\\\\\\\\\\\n            if (!krData || (krData.goals as any)?.user_id !== userId) { // Check if KR exists and parent goal belongs to user\\\\\\\\\\\n                console.warn(";
Key;
Result;
$;
{
    krId;
}
not;
found;
or;
parent;
goal;
does;
not;
belong;
to;
user;
$;
{
    userId;
}
for (linking; task.(__makeTemplateObject([");\\\\\\\\\\\n                this.context.loggingService?.logWarning("], [");\\\\\\\\\\\\\\\\\\\\\\n                this.context.loggingService?.logWarning("])); Key)
    Result;
not;
found;
or;
user;
mismatch;
for (linking; task; )
    : $;
{
    krId;
}
", { userId });\\\\\\\\\\\n                return undefined;\\\\\\\\\\\n            }\\\\\\\\\\\n\\\\\\\\\\\n            const currentLinkedTaskIds = krData.linked_task_ids || [];\\\\\\\\\\\n            // Add the task ID if it's not already present\\\\\\\\\\\n            if (!currentLinkedTaskIds.includes(taskId)) {\\\\\\\\\\\n                 const newLinkedTaskIds = [...currentLinkedTaskIds, taskId];\\\\\\\\\\\n\\\\\\\\\\\n                 // Update the KR's linked_task_ids array in Supabase\\\\\\\\\\\n                 const { data: updatedKrData, error: updateError } = await this.supabase\\\\\\\\\\\n                     .from('key_results')\\\\\\\\\\\n                     .update({ linked_task_ids: newLinkedTaskIds } as Partial<KeyResult>)\\\\\\\\\\\n                     .eq('id', krId)\\\\\\\\\\\n                     .select()\\\\\\\\\\\n                     .single();\\\\\\\\\\\n\\\\\\\\\\\n                 if (updateError) { throw updateError; }\\\\\\\\\\\n                 if (!updatedKrData) {\\\\\\\\\\\n                     console.error(";
Failed;
to;
retrieve;
updated;
KR;
data;
for ($; { krId: krId }; after)
    linking;
task.(__makeTemplateObject([");\\\\\\\\\\\n                     this.context.loggingService?.logError("], [");\\\\\\\\\\\\\\\\\\\\\\n                     this.context.loggingService?.logError("]));
Failed;
to;
retrieve;
updated;
KR;
data;
after;
linking;
task: $;
{
    krId;
}
", { userId });\\\\\\\\\\\n                     return undefined;\\\\\\\\\\\n                 }\\\\\\\\\\\n\\\\\\\\\\\n                 const updatedKr = updatedKrData as KeyResult;\\\\\\\\\\\n\\\\\\\\\\\n                 console.log(";
Task;
$;
{
    taskId;
}
linked;
to;
KR;
$;
{
    krId;
}
 in Supabase.(__makeTemplateObject([");\\\\\\\\\\\n                 // Publish event\\\\\\\\\\\n                 this.context.eventBus?.publish('kr_linked_to_task', { krId, taskId, userId }, userId);\\\\\\\\\\\n                 this.context.loggingService?.logInfo("], [");\\\\\\\\\\\\\\\\\\\\\\n                 // Publish event\\\\\\\\\\\\\\\\\\\\\\n                 this.context.eventBus?.publish('kr_linked_to_task', { krId, taskId, userId }, userId);\\\\\\\\\\\\\\\\\\\\\\n                 this.context.loggingService?.logInfo("]));
KR;
linked;
to;
task: $;
{
    krId;
}
-$;
{
    taskId;
}
", { krId, taskId, userId });\\\\\\\\\\\n\\\\\\\\\\\n                 return updatedKr;\\\\\\\\\\\n\\\\\\\\\\\n            } else {\\\\\\\\\\\n                 console.warn(";
Task;
$;
{
    taskId;
}
is;
already;
linked;
to;
KR;
$;
{
    krId;
}
");\\\\\\\\\\\n                 this.context.loggingService?.logWarning(";
Task;
already;
linked;
to;
KR: $;
{
    krId;
}
-$;
{
    taskId;
}
", { krId, taskId, userId });\\\\\\\\\\\n                 // Optionally return the existing KR\\\\\\\\\\\n                 return krData as KeyResult;\\\\\\\\\\\n            }\\\\\\\\\\\n\\\\\\\\\\\n        } catch (error: any) {\\\\\\\\\\\n            console.error(";
Failed;
to;
link;
task;
$;
{
    taskId;
}
to;
KR;
$;
{
    krId;
}
", error);\\\\\\\\\\\n            this.context.loggingService?.logError(";
Failed;
to;
link;
task;
from;
KR(__makeTemplateObject([", { taskId, krId, userId, error: error.message });\\\\\\\\\\\n            throw error; // Re-throw\\\\\\\\\\\n        }\\\\\\\\\\\n    }\\\\\\\\\\\n\\\\\\\\\\\n    /**\\\\\\\\\\\n     * Unlinks a task from a Key Result.\\\\\\\\\\n     * Removes the task ID from the KR's "], [", { taskId, krId, userId, error: error.message });\\\\\\\\\\\\\\\\\\\\\\n            throw error; // Re-throw\\\\\\\\\\\\\\\\\\\\\\n        }\\\\\\\\\\\\\\\\\\\\\\n    }\\\\\\\\\\\\\\\\\\\\\\n\\\\\\\\\\\\\\\\\\\\\\n    /**\\\\\\\\\\\\\\\\\\\\\\n     * Unlinks a task from a Key Result.\\\\\\\\\\\\\\\\\\\\n     * Removes the task ID from the KR's "]));
linked_task_ids(__makeTemplateObject([" array.\\\\\\\\\\n     * @param krId The ID of the Key Result. Required.\\\\\\\\\\n     * @param taskId The ID of the task to unlink. Required.\\\\\\\\\\n     * @param userId The user ID for verification. Required.\\\\\\\\\\n     * @returns Promise<KeyResult | undefined> The updated KR or undefined.\\\\\\\\\\n     */\\\\\\\n    async unlinkTaskFromKeyResult(krId: string, taskId: string, userId: string): Promise<KeyResult | undefined> {\\\\\\\\\\\n        console.log("], [" array.\\\\\\\\\\\\\\\\\\\\n     * @param krId The ID of the Key Result. Required.\\\\\\\\\\\\\\\\\\\\n     * @param taskId The ID of the task to unlink. Required.\\\\\\\\\\\\\\\\\\\\n     * @param userId The user ID for verification. Required.\\\\\\\\\\\\\\\\\\\\n     * @returns Promise<KeyResult | undefined> The updated KR or undefined.\\\\\\\\\\\\\\\\\\\\n     */\\\\\\\\\\\\\\n    async unlinkTaskFromKeyResult(krId: string, taskId: string, userId: string): Promise<KeyResult | undefined> {\\\\\\\\\\\\\\\\\\\\\\n        console.log("]))[GoalManagementService];
Unlinking;
task;
$;
{
    taskId;
}
from;
KR;
$;
{
    krId;
}
for (user; $; { userId: userId })
    ;
");\\\\\\\\\\\n        this.context.loggingService?.logInfo(";
Attempting;
to;
unlink;
task;
$;
{
    taskId;
}
from;
KR;
$;
{
    krId;
}
", { taskId, krId, userId });\\\\\\\\\\\n\\\\\\\\\\\n        if (!userId) {\\\\\\\\\\\n            console.warn('[GoalManagementService] Cannot unlink task from KR: User ID is required.');\\\\\\\\\\\n            this.context.loggingService?.logWarning('Cannot unlink task from KR: User ID is required.');\\\\\\\\\\\n            return undefined;\\\\\\\\\\\n        }\\\\\\\\\\\n\\\\\\\\\\\n        try {\\\\\\\\\\\n             // Fetch the KR first to get its current linked_task_ids and verify user ownership via the goal\\\\\\\\\\\n            const { data: krData, error: fetchError } = await this.supabase\\\\\\\\\\\n                .from('key_results')\\\\\\\\\\\n                .select('linked_task_ids, goals(user_id)') // Select current linked_task_ids and join with parent goal to get user_id\\\\\\\\\\\n                .eq('id', krId)\\\\\\\\\\\n                .single();\\\\\\\\\\\n\\\\\\\\\\\n            if (fetchError) { throw fetchError; }\\\\\\\\\\\n            if (!krData || (krData.goals as any)?.user_id !== userId) { // Check if KR exists and parent goal belongs to user\\\\\\\\\\\n                console.warn(";
Key;
Result;
$;
{
    krId;
}
not;
found;
or;
parent;
goal;
does;
not;
belong;
to;
user;
$;
{
    userId;
}
for (unlinking; task.(__makeTemplateObject([");\\\\\\\\\\\n                this.context.loggingService?.logWarning("], [");\\\\\\\\\\\\\\\\\\\\\\n                this.context.loggingService?.logWarning("])); Key)
    Result;
not;
found;
or;
user;
mismatch;
for (unlinking; task; )
    : $;
{
    krId;
}
", { userId });\\\\\\\\\\\n                return undefined;\\\\\\\\\\\n            }\\\\\\\\\\\n\\\\\\\\\\\n            const currentLinkedTaskIds = krData.linked_task_ids || [];\\\\\\\\\\\n            // Remove the task ID if it's present\\\\\\\\\\\n            if (currentLinkedTaskIds.includes(taskId)) {\\\\\\\n                 const newLinkedTaskIds = currentLinkedTaskIds.filter(id => id !== taskId);\\\\\\\n\\\\\\\n                 // Update the KR's linked_task_ids array in Supabase\\\\\\\n                 const { data: updatedKrData, error: updateError } = await this.supabase\\\n                     .from('key_results')\\\n                     .update({ linked_task_ids: newLinkedTaskIds } as Partial<KeyResult>)\\\n                     .eq('id', krId)\\\n                     .select()\\\n                     .single();\\\n\\\n                 if (updateError) { throw updateError; }\\\n                 if (!updatedKrData) {\\\n                     console.error(";
Failed;
to;
retrieve;
updated;
KR;
data;
for ($; { krId: krId }; after)
    unlinking;
task.(__makeTemplateObject([");\\\n                     this.context.loggingService?.logError("], [");\\\\\\n                     this.context.loggingService?.logError("]));
Failed;
to;
retrieve;
updated;
KR;
data;
after;
unlinking;
task: $;
{
    krId;
}
", { userId });\\\n                     return undefined;\\\n                 }\\\n\\\n                 const updatedKr = updatedKrData as KeyResult;\\\n\\\n                 console.log(";
Task;
$;
{
    taskId;
}
unlinked;
from;
KR;
$;
{
    krId;
}
 in Supabase.(__makeTemplateObject([");\\\n                 // Publish event\\\n                 this.context.eventBus?.publish('kr_unlinked_from_task', { krId, taskId, userId }, userId);\\\n                 this.context.loggingService?.logInfo("], [");\\\\\\n                 // Publish event\\\\\\n                 this.context.eventBus?.publish('kr_unlinked_from_task', { krId, taskId, userId }, userId);\\\\\\n                 this.context.loggingService?.logInfo("]));
KR;
unlinked;
from;
task: $;
{
    krId;
}
-$;
{
    taskId;
}
", { krId, taskId, userId });\\\n\\\n                 return updatedKr;\\\n\\\n            } else {\\\n                 console.warn(";
Task;
$;
{
    taskId;
}
is;
not;
linked;
to;
KR;
$;
{
    krId;
}
");\\\n                 this.context.loggingService?.logWarning(";
Task;
not;
linked;
to;
KR: $;
{
    krId;
}
-$;
{
    taskId;
}
", { krId, taskId, userId });\\\n                 // Optionally return the existing KR\\\n                 return krData as KeyResult;\\            }\\\\        } catch (error: any) {\\            console.error(";
Failed;
to;
unlink;
task;
$;
{
    taskId;
}
from;
KR;
$;
{
    krId;
}
", error);\\            this.context.loggingService?.logError(";
Failed;
to;
unlink;
task;
from;
KR(__makeTemplateObject([", { taskId, krId, userId, error: error.message });\\            throw error; // Re-throw\\        }\\    }\\\\    /**\\     * Checks if a Key Result is completed based on its current value and updates its status if necessary.\\     * This method is called after a linked task completes.\\     * @param krId The ID of the Key Result. Required.\\     * @param taskId The ID of the task that just completed (for context/logging). Required.\\     * @param userId The user ID for verification. Required.\\     * @returns Promise<KeyResult | undefined> The updated KR or undefined.\\     */\\    async checkAndCompleteKeyResultIfTaskCompleted(krId: string, taskId: string, userId: string): Promise<KeyResult | undefined> {\\        console.log("], [", { taskId, krId, userId, error: error.message });\\\\\\\n            throw error; // Re-throw\\\\\\\n        }\\\\\\\n    }\\\\\\\n\\\\\\\n    /**\\\\\\\n     * Checks if a Key Result is completed based on its current value and updates its status if necessary.\\\\\\\n     * This method is called after a linked task completes.\\\\\\\n     * @param krId The ID of the Key Result. Required.\\\\\\\n     * @param taskId The ID of the task that just completed (for context/logging). Required.\\\\\\\n     * @param userId The user ID for verification. Required.\\\\\\\n     * @returns Promise<KeyResult | undefined> The updated KR or undefined.\\\\\\\n     */\\\\\\\n    async checkAndCompleteKeyResultIfTaskCompleted(krId: string, taskId: string, userId: string): Promise<KeyResult | undefined> {\\\\\\\n        console.log("]))[GoalManagementService];
Checking;
KR;
$;
{
    krId;
}
completion;
after;
task;
$;
{
    taskId;
}
completed;
for (user; $; { userId: userId })
    ;
");\\        this.context.loggingService?.logInfo(";
Checking;
KR;
completion;
after;
task;
completed(__makeTemplateObject([", { krId, taskId, userId });\\\\        if (!userId) {\\            console.warn('[GoalManagementService] Cannot check KR completion: User ID is required.');\\            this.context.loggingService?.logWarning('Cannot check KR completion: User ID is required.');\\            return undefined;\\        }\\\\        try {\\            // Fetch the KR to get its details and verify user ownership\\            const { data: krData, error: fetchError } = await this.supabase\\                .from('key_results')\\                .select('*, goals(user_id)') // Select KR and join with parent goal to get user_id\\                .eq('id', krId)\\                .single();\\\\            if (fetchError) { throw fetchError; }\\            if (!krData || (krData.goals as any)?.user_id !== userId) { // Check if KR exists and parent goal belongs to user\\                console.warn("], [", { krId, taskId, userId });\\\\\\\n\\\\\\\n        if (!userId) {\\\\\\\n            console.warn('[GoalManagementService] Cannot check KR completion: User ID is required.');\\\\\\\n            this.context.loggingService?.logWarning('Cannot check KR completion: User ID is required.');\\\\\\\n            return undefined;\\\\\\\n        }\\\\\\\n\\\\\\\n        try {\\\\\\\n            // Fetch the KR to get its details and verify user ownership\\\\\\\n            const { data: krData, error: fetchError } = await this.supabase\\\\\\\n                .from('key_results')\\\\\\\n                .select('*, goals(user_id)') // Select KR and join with parent goal to get user_id\\\\\\\n                .eq('id', krId)\\\\\\\n                .single();\\\\\\\n\\\\\\\n            if (fetchError) { throw fetchError; }\\\\\\\n            if (!krData || (krData.goals as any)?.user_id !== userId) { // Check if KR exists and parent goal belongs to user\\\\\\\n                console.warn("]));
Key;
Result;
$;
{
    krId;
}
not;
found;
or;
parent;
goal;
does;
not;
belong;
to;
user;
$;
{
    userId;
}
for (completion; check.(__makeTemplateObject([");\\                this.context.loggingService?.logWarning("], [");\\\\\\\n                this.context.loggingService?.logWarning("])); Key)
    Result;
not;
found;
or;
user;
mismatch;
for (completion; check; )
    : $;
{
    krId;
}
", { userId });\\                return undefined;\\            }\\\\            const kr = krData as KeyResult;\\\\            // Check if the KR's current value meets or exceeds the target value\\            // Note: The task completion itself doesn't automatically update the KR's current_value.\\            // The task must contain a step with action type 'updateGoalProgress' to do that.\\            // This method only checks if the *current* value is sufficient after a linked task finishes.\\            if (kr.current_value >= kr.target_value && kr.status !== 'completed') {\\                console.log(";
KR;
$;
{
    kr.id;
}
reached;
target;
value($, { kr: kr, : .current_value } / $, { kr: kr, : .target_value }).Marking;
");\\                this.context.loggingService?.logInfo(";
KR;
reached;
target;
value.Marking;
", { krId: kr.id, userId });\\\\                // Update KR status to completed in Supabase\\                const { data: updatedKrData, error: updateError } = await this.supabase\\                    .from('key_results')\\                    .update({ status: 'completed' } as Partial<KeyResult>) // Cast to Partial<KeyResult>\\                    .eq('id', kr.id)\\                    .select() // Select the updated KR data\\                    .single();\\\\                if (updateError) { throw updateError; }\\                if (!updatedKrData) {\\                    console.error(";
Failed;
to;
retrieve;
updated;
KR;
data;
for ($; { kr: kr, : .id }; after)
    marking;
completed.(__makeTemplateObject([");\\                    this.context.loggingService?.logError("], [");\\\\\\\n                    this.context.loggingService?.logError("]));
Failed;
to;
retrieve;
updated;
KR;
data;
after;
marking;
completed: $;
{
    kr.id;
}
", { userId });\\                    return undefined;\\                }\\\\                const updatedKr = updatedKrData as KeyResult;\\\\                console.log(";
Key;
Result;
$;
{
    updatedKr.id;
}
status;
updated;
to;
completed.(__makeTemplateObject([");\\                // Publish 'key_result_updated' event\\                this.context.eventBus?.publish('key_result_updated', updatedKr, userId);\\                this.context.loggingService?.logInfo("], [");\\\\\\\n                // Publish 'key_result_updated' event\\\\\\\n                this.context.eventBus?.publish('key_result_updated', updatedKr, userId);\\\\\\\n                this.context.loggingService?.logInfo("]));
KR;
status;
updated;
to;
completed: $;
{
    updatedKr.id;
}
", { userId: userId });\\\\                // TODO: Check if the parent goal is now completed if all its KRs are completed\\                // This would involve fetching all KRs for kr.goal_id and checking their statuses.\\                // Can be done asynchronously or via a database trigger.\\\\                return updatedKr;\\\\            } else {\\                console.log(";
KR;
$;
{
    kr.id;
}
did;
not;
reach;
target;
value($, { kr: kr, : .current_value } / $, { kr: kr, : .target_value });
or;
is;
already;
completed.No;
status;
update;
needed.(__makeTemplateObject([");\\                this.context.loggingService?.logInfo("], [");\\\\\\\n                this.context.loggingService?.logInfo("]));
KR;
did;
not;
reach;
target;
or;
already;
completed.(__makeTemplateObject([", { krId: kr.id, userId });\\                return kr; // Return the existing KR\\            }\\\\        } catch (error: any) {\\            console.error("], [", { krId: kr.id, userId });\\\\\\\n                return kr; // Return the existing KR\\\\\\\n            }\\\\\\\n\\\\\\\n        } catch (error: any) {\\\\\\\n            console.error("]));
Failed;
to;
check;
or;
complete;
KR;
$;
{
    krId;
}
", error);\\            this.context.loggingService?.logError(";
Failed;
to;
check;
or;
complete;
KR;
$;
{
    krId;
}
", { krId, taskId, userId: userId, error: error.message });\\            throw error; // Re-throw the error\\        }\\    }\\\\\\    // TODO: Implement methods to link tasks/actions to Key Results.\\    // TODO: Implement automatic progress updates based on linked tasks/actions and data from AnalyticsService.\\    // TODO: Implement reporting features (e.g., generate summary of OKR progress).\\    // TODO: Integrate with UI to display goals and progress.\\    // TODO: This module is part of the Bidirectional Sync Domain (\\u96d9\\u5410\\u540c\\u6b65\\u9818\\u57df) for persistence.\\\\    // --- New: Realtime Subscription Methods ---\\    /**\\     * Subscribes to real-time updates from the goals table for the current user.\\     * @param userId The user ID to filter updates by. Required.\\     */\\    subscribeToGoalsUpdates(userId: string): void {\\        console.log('[GoalManagementService] Subscribing to goals realtime updates for user:', userId);\\        this.context.loggingService?.logInfo('Subscribing to goals realtime updates', { userId });\\\\        if (this.goalsSubscription) {\\            console.warn('[GoalManagementService] Already subscribed to goals updates. Unsubscribing existing.');\\            this.unsubscribeFromGoalsUpdates();\\        }\\\\        this.goalsSubscription = this.supabase\\            .channel(";
goals: user_id = eq.$;
{
    userId;
}
") // Channel filtered by user_id\\            .on('postgres_changes', { event: '*', schema: 'public', table: 'goals', filter: ";
user_id = eq.$;
{
    userId;
}
" }, (payload) => {\\                console.log('[GoalManagementService] Realtime goal change received:', payload);\\                const goal = payload.new as Goal; // New data for INSERT/UPDATE\\                const oldGoal = payload.old as Goal; // Old data for UPDATE/DELETE\\                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\\\\\n                // Publish an event via EventBus for other modules/UI to react\\\n                this.context.eventBus?.publish(";
goal_$;
{
    eventType.toLowerCase();
}
", goal || oldGoal, userId); // e.g., 'goal_insert', 'goal_update', 'goal_delete'\\\n\\\n                // TODO: Notify SyncService about the remote change if SyncService is not listening to Realtime directly\\\n                // this.context.syncService?.handleRemoteDataChange('goalManagementService', eventType, goal || oldGoal, userId);\\\n            })\\\n            .subscribe((status, err) => {\\\n                 console.log('[GoalManagementService] Goal subscription status:', status);\\\n                 if (status === 'CHANNEL_ERROR') {\\\n                     console.error('[GoalManagementService] Goal subscription error:', err);\\\n                     this.context.loggingService?.logError('Goal subscription error', { userId, error: err?.message });\\\n                 }\\\n            });\\\n    }\\\n\\\n    /**\\\n     * Unsubscribes from goals real-time updates.\\\n     */\\    unsubscribeFromGoalsUpdates(): void {\\        if (this.goalsSubscription) {\\            console.log('[GoalManagementService] Unsubscribing from goals realtime updates.');\\            this.context.loggingService?.logInfo('Unsubscribing from goals realtime updates');\\            this.supabase.removeChannel(this.goalsSubscription);\\            this.goalsSubscription = null;\\        }\\    }\\\n\\\n    /**\\     * Subscribes to real-time updates from the key_results table for the current user's goals.\\     * @param userId The user ID to filter updates by. Required.\\     */\\    subscribeToKeyResultsUpdates(userId: string): void {\\        console.log('[GoalManagementService] Subscribing to key result realtime updates for user:', userId);\\        this.context.loggingService?.logInfo('Subscribing to key result realtime updates', { userId });\\\\\n        if (this.keyResultsSubscription) {\\            console.warn('[GoalManagementService] Already subscribed to key result updates. Unsubscribing existing.');\\            this.unsubscribeFromKeyResultsUpdates();\\        }\\\\\n        // Note: RLS on key_results should ensure user can only see KRs for their goals.\\        // Rely on RLS and subscribe to all changes on the table.\\        this.keyResultsSubscription = this.supabase\\            .channel('key_results') // Subscribe to all changes on the table\\            .on('postgres_changes', { event: '*', schema: 'public', table: 'key_results' }, async (payload) => { // No filter here, rely on RLS\\                console.log('[GoalManagementService] Realtime key result change received:', payload);\\                const kr = payload.new as KeyResult & { goal_id: string }; // New data for INSERT/UPDATE\\                const oldKr = payload.old as KeyResult & { goal_id: string }; // Old data for UPDATE/DELETE\\                const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';\\\\\n                // To publish with user_id, we need the user_id of the parent goal.\\                const krWithGoalId = kr || oldKr;\\                if (krWithGoalId?.goal_id) {\\                    const parentGoal = await this.getGoalById(krWithGoalId.goal_id, userId); // Fetch parent goal to get user_id\\                    if (parentGoal?.user_id === userId) { // Ensure it belongs to the current user\\                         // Publish an event via EventBus for other modules/UI to react\\                         this.context.eventBus?.publish(";
key_result_$;
{
    eventType.toLowerCase();
}
", kr || oldKr, userId); // e.g., 'key_result_insert', 'key_result_update', 'key_result_delete'\\\\\n                         // TODO: Notify SyncService about the remote change\\                         // this.context.syncService?.handleRemoteDataChange('goalManagementService', eventType, kr || oldKr, userId);\\                    } else {\\                         console.log('[GoalManagementService] Received key result change for a goal not belonging to the current user (filtered by RLS or client-side).');\\                    }\\                } else {\\                     console.warn('[GoalManagementService] Received key result change without goal_id.');\\                }\\            })\\            .subscribe((status, err) => {\\                 console.log('[GoalManagementService] Key result subscription status:', status);\\                 if (status === 'CHANNEL_ERROR') {\\                     console.error('[GoalManagementService] Key result subscription error:', err);\\                     this.context.loggingService?.logError('Key result subscription error', { userId, error: err?.message });\\                 }\\            });\\    }\\\\\n    /**\\     * Unsubscribes from key result real-time updates.\\     */\\    unsubscribeFromKeyResultsUpdates(): void {\\        if (this.keyResultsSubscription) {\\            console.log('[GoalManagementService] Unsubscribing from key result realtime updates.');\\            this.context.loggingService?.logInfo('Unsubscribing from key result realtime updates');\\            this.supabase.removeChannel(this.keyResultsSubscription);\\            this.keyResultsSubscription = null;\\        }\\    }\\    // --- End New ---\\}\\"(__makeTemplateObject([""], [""]));
