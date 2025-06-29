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
exports.app = void 0;
/**
 * API 網關（API Gateway）
 * 提供統一 API 入口，串接 NavigationAgent 與記憶庫。
 */
var express_1 = require("express");
var NavigationAgent_1 = require("../intent/NavigationAgent");
var MemoryPalace_1 = require("../knowledge/MemoryPalace");
var Orchestrator_1 = require("./Orchestrator");
// 假設的 OutputFormatterFactory
var OutputFormatterFactory = {
    getFormatter: function () { return ({
        format: function (result) { return result; }
    }); }
};
// 假設的向量資料庫實作
var vectorDB = {
    query: function (_params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                void _params;
                return [2 /*return*/, [{ content: '記憶片段1' }, { content: '記憶片段2' }]];
            });
        });
    },
    insert: function (_record) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                void _record;
                return [2 /*return*/];
            });
        });
    }
};
var memoryPalace = new MemoryPalace_1.MemoryPalace(vectorDB);
var orchestrator = new Orchestrator_1.Orchestrator();
var app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
// 統一API端點
app.post('/v1/execute', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, task, agent, result, formatter, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, task = _a.task;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                agent = new NavigationAgent_1.NavigationAgent(memoryPalace);
                return [4 /*yield*/, agent.executeTask({ userId: userId, description: task })];
            case 2:
                result = _b.sent();
                formatter = OutputFormatterFactory.getFormatter();
                res.json(formatter.format(result));
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                res.status(500).json({ error: (error_1 instanceof Error ? error_1.message : String(error_1)) });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// 新增權能冶煉 API
app.post('/v1/forge-authority', function (req, res) {
    /**
     * @api {post} /v1/forge-authority 鍛造權限物件
     * @apiParam {string} type 權限類型
     * @apiParam {string[]} permissions 權限清單
     * @apiSuccess {object} authority 權限物件
     */
    var _a = req.body, type = _a.type, permissions = _a.permissions;
    if (!type || !Array.isArray(permissions)) {
        return res.status(400).json({ error: 'type 與 permissions 必填' });
    }
    try {
        var result = orchestrator.dispatch({
            userId: 'api', // 可根據需求擴充
            action: 'forgeAuthority',
            payload: { type: type, permissions: permissions }
        });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
    }
});
// 啟動服務
app.listen(3000, function () {
    console.log('OmniKey Gateway running on port 3000');
});
