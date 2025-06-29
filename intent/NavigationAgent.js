"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanParser = exports.LLMClient = exports.AgentFactory = exports.NavigationAgent = void 0;
var bindai_agent_1 = require("../integration/bindai.agent");
var NavigationAgent = /** @class */ (function () {
    function NavigationAgent(memory) {
        this.memory = memory;
    }
    /**
     * 執行一個任務，根據記憶自動規劃與執行多步驟
     * @param task 任務描述
     * @returns Promise<Result>
     */
    NavigationAgent.prototype.executeTask = function (task) {
        return __awaiter(this, void 0, void 0, function () {
            var context, plan, _i, _a, step, agent, prompt_1, result, prompt_2, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.memory.retrieveContext(task.userId)];
                    case 1:
                        context = _b.sent();
                        return [4 /*yield*/, this.createPlan(task, context)];
                    case 2:
                        plan = _b.sent();
                        _i = 0, _a = plan.steps;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 10];
                        step = _a[_i];
                        agent = exports.AgentFactory.getAgent(step.skillType);
                        if (!(step.skillType === 'bindai')) return [3 /*break*/, 6];
                        prompt_1 = typeof step.parameters.prompt === 'string' ? step.parameters.prompt : String(step.parameters.query || task.description);
                        return [4 /*yield*/, agent.execute({ prompt: prompt_1 })];
                    case 4:
                        result = _b.sent();
                        return [4 /*yield*/, this.memory.storeExecution(step, result)];
                    case 5:
                        _b.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        prompt_2 = typeof step.parameters.prompt === 'string' ? step.parameters.prompt : String(step.parameters.query || task.description);
                        return [4 /*yield*/, agent.execute({ prompt: prompt_2 })];
                    case 7:
                        result = _b.sent();
                        return [4 /*yield*/, this.memory.storeExecution(step, result)];
                    case 8:
                        _b.sent();
                        _b.label = 9;
                    case 9:
                        _i++;
                        return [3 /*break*/, 3];
                    case 10: return [2 /*return*/, plan.compileFinalResult()];
                }
            });
        });
    };
    /**
     * 使用 LLM 產生任務執行計畫
     * @param task 任務
     * @param context 記憶內容
     * @returns Promise<Plan>
     */
    NavigationAgent.prototype.createPlan = function (task, context) {
        return __awaiter(this, void 0, void 0, function () {
            var llmResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exports.LLMClient.generatePlan({
                            task: task.description,
                            context: context.snippets,
                            availableSkills: this.getAvailableSkills()
                        })];
                    case 1:
                        llmResponse = _a.sent();
                        return [2 /*return*/, exports.PlanParser.parse(llmResponse)];
                }
            });
        });
    };
    NavigationAgent.prototype.getAvailableSkills = function () {
        // TODO: 回傳可用技能列表
        return ['search', 'summarize', 'executeScript', 'bindai']; // 新增 bindai
    };
    return NavigationAgent;
}());
exports.NavigationAgent = NavigationAgent;
// AgentFactory 擴充註冊 bindai agent
exports.AgentFactory = {
    getAgent: function (skillType) {
        if (skillType === 'bindai') {
            return new bindai_agent_1.BindAiAgent(process.env.BINDAI_API_KEY, 'zh-tw');
        }
        return {
            execute: function (_params) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ output: "Executed ".concat(skillType) })];
            }); }); } // 移除未使用警告
        };
    }
};
exports.LLMClient = {
    generatePlan: function (input) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // 模擬 LLM 回應
            return [2 /*return*/, {
                    steps: [
                        { skillType: 'search', parameters: { query: input.task } },
                        { skillType: 'summarize', parameters: {} }
                    ]
                }];
        });
    }); }
};
exports.PlanParser = {
    parse: function (llmResponse) { return ({
        steps: llmResponse.steps,
        compileFinalResult: function () { return ({ output: 'Final result' }); }
    }); }
};
