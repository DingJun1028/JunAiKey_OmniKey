"use strict";
// 繁中英碼, 矩陣圖說
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var lucide_react_1 = require("lucide-react"); // Using lucide-react for icons
var systemContext = window.systemContext;
// Mock data for demonstration purposes, matching the EvolutionaryInsight interface
var mockInsights = [
    {
        id: 'insight-1',
        user_id: 'user-123',
        type: 'automation_opportunity',
        details: {
            pattern: ['git_add', 'git_commit', 'git_push'],
            suggestion: 'You frequently run a git sync sequence. Would you like to create a "Sync to Remote" script to automate this workflow?',
            actions: [{ label: 'Create Script', action: 'forge_ability', params: { name: 'Sync to Remote' } }]
        },
        timestamp: new Date().toISOString(),
        status: 'pending',
        dismissed: false,
    },
    {
        id: 'insight-2',
        user_id: 'user-123',
        type: 'task_failure_diagnosis',
        details: {
            taskId: 'task-abc',
            suggestion: 'A task failed because the API key for an external service was invalid. Please check your credentials in Settings.',
            actions: [{ label: 'Go to Settings', action: 'navigate', params: { path: '/settings/security' } }]
        },
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        status: 'pending',
        dismissed: false,
    },
    {
        id: 'insight-3',
        user_id: 'user-123',
        type: 'optimization_recommendation',
        details: {
            suggestion: 'Your knowledge base search performance can be improved by generating embeddings for new records. Enable automatic embedding?',
            actions: [{ label: 'Enable Auto-Embedding', action: 'update_setting', params: { setting: 'auto_embed', value: true } }]
        },
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        status: 'actioned',
        dismissed: false,
    }
];
var InsightIcon = function (_a) {
    var type = _a.type;
    switch (type) {
        case 'automation_opportunity':
            return <lucide_react_1.Wrench className="h-6 w-6 text-cyan-400"/>;
        case 'task_failure_diagnosis':
            return <lucide_react_1.AlertTriangle className="h-6 w-6 text-red-400"/>;
        case 'optimization_recommendation':
        case 'skill_suggestion':
        default:
            return <lucide_react_1.Lightbulb className="h-6 w-6 text-yellow-400"/>;
    }
};
var Insights = function () {
    var _a = (0, react_1.useState)([]), insights = _a[0], setInsights = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    (0, react_1.useEffect)(function () {
        var fetchInsights = function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                setLoading(true);
                try {
                    // In a real app, you would fetch this from your backend/database
                    // e.g., const data = await systemContext.evolutionEngine.getPendingInsights();
                    setInsights(mockInsights);
                }
                catch (error) {
                    console.error("Failed to fetch insights:", error);
                }
                finally {
                    setLoading(false);
                }
                return [2 /*return*/];
            });
        }); };
        fetchInsights();
    }, []);
    var handleAction = function (insightId, action) {
        console.log("Action triggered for insight ".concat(insightId, ":"), action);
        // TODO: Call a service to execute the action, e.g., systemContext.junaiAssistant.processInput(...)
        setInsights(function (prev) { return prev.map(function (i) { return i.id === insightId ? __assign(__assign({}, i), { status: 'actioned' }) : i; }); });
    };
    var handleDismiss = function (insightId) {
        console.log("Dismissing insight ".concat(insightId));
        setInsights(function (prev) { return prev.map(function (i) { return i.id === insightId ? __assign(__assign({}, i), { status: 'dismissed' }) : i; }); });
    };
    if (loading) {
        return <div className="p-6 text-center text-neutral-400">Loading insights...</div>;
    }
    return (<div className="p-4 md:p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Evolutionary Insights</h1>
        <p className="text-neutral-400 mt-1">The system has learned from your actions and found opportunities for evolution.</p>
      </header>

      <div className="space-y-4">
        {insights.filter(function (i) { return i.status === 'pending'; }).map(function (insight) {
            var _a;
            return (<div key={insight.id} className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1"><InsightIcon type={insight.type}/></div>
              <div className="flex-grow"><p className="text-neutral-200">{insight.details.suggestion}</p><p className="text-xs text-neutral-500 mt-2">{new Date(insight.timestamp).toLocaleString()}</p></div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={function () { return handleDismiss(insight.id); }} className="px-3 py-1 text-sm bg-neutral-700 hover:bg-neutral-600 rounded-md text-neutral-300 transition-colors">Dismiss</button>
              {(_a = insight.details.actions) === null || _a === void 0 ? void 0 : _a.map(function (action, index) { return (<button key={index} onClick={function () { return handleAction(insight.id, action); }} className="px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-500 rounded-md text-white font-semibold transition-colors">{action.label}</button>); })}
            </div>
          </div>);
        })}
        {insights.filter(function (i) { return i.status === 'pending'; }).length === 0 && (<div className="text-center py-12 text-neutral-500"><lucide_react_1.Lightbulb className="mx-auto h-12 w-12 mb-4"/><h3 className="text-lg font-semibold">No New Insights</h3><p>The system is continuously learning. Check back later for new suggestions.</p></div>)}
      </div>
    </div>);
};
exports.default = Insights;
