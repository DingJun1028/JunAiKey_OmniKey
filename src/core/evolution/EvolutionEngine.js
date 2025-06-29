"use strict";
// 繁中英碼, 矩陣圖說
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvolutionEngine = void 0;
/**
 * @class EvolutionEngine
 * @description 負責執行「無限進化循環」中的「學習」階段。
 *              它分析系統中的數據，識別模式，並產生「進化洞見」。
 *
 * This class is responsible for the "Learn" phase of the "Infinite Evolution Cycle".
 * It analyzes data within the system, identifies patterns, and generates "Evolutionary Insights".
 */
var EvolutionEngine = /** @class */ (function () {
    function EvolutionEngine(context) {
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
    EvolutionEngine.prototype.runEvolutionCycle = function () {
        return __awaiter(this, void 0, void 0, function () {
            var allNewInsights, repetitiveActionInsights, taskFailureInsights, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo('[EvolutionEngine] Starting evolution cycle...');
                        allNewInsights = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, this.analyzeRepetitiveActions()];
                    case 2:
                        repetitiveActionInsights = _d.sent();
                        return [4 /*yield*/, this.analyzeTaskFailures()];
                    case 3:
                        taskFailureInsights = _d.sent();
                        // ... 在此處加入更多分析器 (...add more analyzers here)
                        // 收集所有新產生的洞見 (Collect all new insights)
                        allNewInsights.push.apply(allNewInsights, __spreadArray(__spreadArray([], repetitiveActionInsights, false), taskFailureInsights, false));
                        if (!(allNewInsights.length > 0)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.saveInsights(allNewInsights)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        (_b = this.context.loggingService) === null || _b === void 0 ? void 0 : _b.logInfo("[EvolutionEngine] Evolution cycle completed. Found ".concat(allNewInsights.length, " new insights."));
                        return [2 /*return*/, allNewInsights];
                    case 6:
                        error_1 = _d.sent();
                        (_c = this.context.loggingService) === null || _c === void 0 ? void 0 : _c.logError('[EvolutionEngine] Error during evolution cycle', { error: error_1.message });
                        return [2 /*return*/, []];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @private @method analyzeRepetitiveActions
     * @description (範例分析器 1) 分析使用者行為紀錄，找出重複的動作序列，並產生自動化機會的洞見。
     *
     * (Example Analyzer 1) Analyzes user action logs to find repetitive action sequences and generate insights for automation opportunities.
     * @returns {Promise<EvolutionaryInsight[]>}
     */
    EvolutionEngine.prototype.analyzeRepetitiveActions = function () {
        return __awaiter(this, void 0, void 0, function () {
            var actions, patternFound, insight;
            var _a;
            return __generator(this, function (_b) {
                // 這是此功能的簡化模擬。真實世界的實作會需要複雜的模式匹配演算法。
                // This is a simplified simulation. A real-world implementation would require complex pattern-matching algorithms.
                (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo('[EvolutionEngine] Analyzing repetitive actions...');
                actions = [];
                patternFound = true;
                if (patternFound && this.context.currentUser) {
                    insight = {
                        user_id: this.context.currentUser.id,
                        type: 'automation_opportunity',
                        details: {
                            pattern: ['git_add', 'git_commit', 'git_push'],
                            suggestion: 'Create a "Sync to Remote" script to automate this workflow.',
                            actions: [{ label: 'Create Script', action: 'forge_ability', params: { /* ... */} }]
                        }
                    };
                    return [2 /*return*/, [insight]];
                }
                return [2 /*return*/, []];
            });
        });
    };
    /**
     * @private @method analyzeTaskFailures
     * @description (範例分析器 2) 分析失敗的任務，診斷可能的原因，並產生修正建議的洞見。
     *
     * (Example Analyzer 2) Analyzes failed tasks, diagnoses potential causes, and generates insights with suggestions for fixes.
     * @returns {Promise<EvolutionaryInsight[]>}
     */
    EvolutionEngine.prototype.analyzeTaskFailures = function () {
        return __awaiter(this, void 0, void 0, function () {
            var failedTasks, taskWithError, insight;
            var _a;
            return __generator(this, function (_b) {
                (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo('[EvolutionEngine] Analyzing task failures...');
                failedTasks = [];
                taskWithError = failedTasks.find(function (task) { var _a; return (_a = task.error) === null || _a === void 0 ? void 0 : _a.includes('Invalid API Key'); });
                if (taskWithError && this.context.currentUser) {
                    insight = {
                        user_id: this.context.currentUser.id,
                        type: 'task_failure_diagnosis',
                        details: {
                            taskId: taskWithError.id,
                            suggestion: 'The API key for a service used in this task might be incorrect. Please check your credentials in Settings.',
                            actions: [{ label: 'Go to Settings', action: 'navigate', params: { path: '/settings' } }]
                        }
                    };
                    return [2 /*return*/, [insight]];
                }
                return [2 /*return*/, []];
            });
        });
    };
    EvolutionEngine.prototype.saveInsights = function (insights) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                // 模擬：將洞見批次寫入 Supabase 的 'evolutionary_insights' 資料表
                console.log('[EvolutionEngine] Saving new insights to database:', insights);
                // const { error } = await this.context.apiProxy.post('/evolutionary_insights', insights);
                (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo("[EvolutionEngine] Successfully saved ".concat(insights.length, " new insights."));
                return [2 /*return*/];
            });
        });
    };
    return EvolutionEngine;
}());
exports.EvolutionEngine = EvolutionEngine;
