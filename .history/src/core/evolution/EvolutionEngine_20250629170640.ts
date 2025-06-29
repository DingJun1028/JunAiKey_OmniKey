// 繁中英碼, 矩陣圖說

import { SystemContext, UserAction, Task, EvolutionaryInsight } from '../../interfaces';

/**
 * @class EvolutionEngine
 * @description 負責執行「無限進化循環」中的「學習」階段。
 *              它分析系統中的數據，識別模式，並產生「進化洞見」。
 *
 * This class is responsible for the "Learn" phase of the "Infinite Evolution Cycle".
 * It analyzes data within the system, identifies patterns, and generates "Evolutionary Insights".
 */
export class EvolutionEngine {
    private context: SystemContext;

    constructor(context: SystemContext) {
        this.context = context;
    }

    /**
     * @method runEvolutionCycle
     * @description 執行一次完整的進化學習週期。
     *              會觸發所有內建的分析器來尋找可產生洞見的模式。
     *
     * Runs a full evolutionary learning cycle.
     * Triggers all built-in analyzers to find patterns that can generate insights.
     * @returns {Promise<EvolutionaryInsight[]>} A promise that resolves with an array of newly generated insights.
     */
    public async runEvolutionCycle(): Promise<EvolutionaryInsight[]> {
        this.context.loggingService?.logInfo('[EvolutionEngine] Starting evolution cycle...');
        const allNewInsights: EvolutionaryInsight[] = [];

        try {
            // 執行各種分析器 (Execute various analyzers)
            const repetitiveActionInsights = await this.analyzeRepetitiveActions();
            const taskFailureInsights = await this.analyzeTaskFailures();
            // ... 在此處加入更多分析器 (...add more analyzers here)

            // 收集所有新產生的洞見 (Collect all new insights)
            allNewInsights.push(...repetitiveActionInsights, ...taskFailureInsights);

            // 將新洞見存入資料庫 (Save new insights to the database)
            if (allNewInsights.length > 0) {
                await this.saveInsights(allNewInsights);
            }

            this.context.loggingService?.logInfo(`[EvolutionEngine] Evolution cycle completed. Found ${allNewInsights.length} new insights.`);
            return allNewInsights;
        } catch (error: any) {
            this.context.loggingService?.logError('[EvolutionEngine] Error during evolution cycle', { error: error.message });
            return [];
        }
    }

    /**
     * @private @method analyzeRepetitiveActions
     * @description (範例分析器 1) 分析使用者行為紀錄，找出重複的動作序列，並產生自動化機會的洞見。
     *
     * (Example Analyzer 1) Analyzes user action logs to find repetitive action sequences and generate insights for automation opportunities.
     * @returns {Promise<EvolutionaryInsight[]>}
     */
    private async analyzeRepetitiveActions(): Promise<Partial<EvolutionaryInsight>[]> {
        // 這是此功能的簡化模擬。真實世界的實作會需要複雜的模式匹配演算法。
        // This is a simplified simulation. A real-world implementation would require complex pattern-matching algorithms.
        this.context.loggingService?.logInfo('[EvolutionEngine] Analyzing repetitive actions...');

        // 模擬：從資料庫獲取最近的使用者行為 (UserAction)
        const actions: UserAction[] = []; // Simulated data

        // 模擬：假設我們發現使用者連續執行了 'git_add', 'git_commit', 'git_push'
        const patternFound = true; // Simulate finding a pattern

        if (patternFound && this.context.currentUser) {
            const insight: Partial<EvolutionaryInsight> = {
                user_id: this.context.currentUser.id,
                type: 'automation_opportunity',
                details: {
                    pattern: ['git_add', 'git_commit', 'git_push'],
                    suggestion: 'Create a "Sync to Remote" script to automate this workflow.',
                    actions: [ { label: 'Create Script', action: 'forge_ability', params: { /* ... */ } } ]
                }
            };
            return [insight];
        }
        return [];
    }

    /**
     * @private @method analyzeTaskFailures
     * @description (範例分析器 2) 分析失敗的任務，診斷可能的原因，並產生修正建議的洞見。
     *
     * (Example Analyzer 2) Analyzes failed tasks, diagnoses potential causes, and generates insights with suggestions for fixes.
     * @returns {Promise<EvolutionaryInsight[]>}
     */
    private async analyzeTaskFailures(): Promise<Partial<EvolutionaryInsight>[]> {
        this.context.loggingService?.logInfo('[EvolutionEngine] Analyzing task failures...');

        // 模擬：從資料庫獲取狀態為 'failed' 的任務 (Task)
        const failedTasks: Task[] = []; // Simulated data

        // 模擬：假設我們發現一個任務因為 API Key 無效而失敗
        const taskWithError = failedTasks.find(task => task.error?.includes('Invalid API Key'));

        if (taskWithError && this.context.currentUser) {
            const insight: Partial<EvolutionaryInsight> = {
                user_id: this.context.currentUser.id,
                type: 'task_failure_diagnosis',
                details: {
                    taskId: taskWithError.id,
                    suggestion: 'The API key for a service used in this task might be incorrect. Please check your credentials in Settings.',
                    actions: [ { label: 'Go to Settings', action: 'navigate', params: { path: '/settings' } } ]
                }
            };
            return [insight];
        }
        return [];
    }

    private async saveInsights(insights: Partial<EvolutionaryInsight>[]): Promise<void> {
        // 模擬：將洞見批次寫入 Supabase 的 'evolutionary_insights' 資料表
        console.log('[EvolutionEngine] Saving new insights to database:', insights);
        // const { error } = await this.context.apiProxy.post('/evolutionary_insights', insights);
        this.context.loggingService?.logInfo(`[EvolutionEngine] Successfully saved ${insights.length} new insights.`);
    }
}