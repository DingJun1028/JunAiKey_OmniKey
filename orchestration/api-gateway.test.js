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
var supertest_1 = require("supertest");
var api_gateway_1 = require("./api-gateway");
describe('/v1/forge-authority API', function () {
    it('應能成功鍛造權限', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(api_gateway_1.app)
                        .post('/v1/forge-authority')
                        .send({ name: '測試權限', description: '單元測試用' })];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(200);
                    expect(res.body).toHaveProperty('id');
                    expect(res.body.name).toBe('測試權限');
                    return [2 /*return*/];
            }
        });
    }); });
    it('應能查詢已鍛造權限', function () { return __awaiter(void 0, void 0, void 0, function () {
        var forgeRes, id, getRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(api_gateway_1.app)
                        .post('/v1/forge-authority')
                        .send({ name: '查詢權限', description: '查詢測試' })];
                case 1:
                    forgeRes = _a.sent();
                    id = forgeRes.body.id;
                    return [4 /*yield*/, (0, supertest_1.default)(api_gateway_1.app)
                            .get("/v1/forge-authority/".concat(id))];
                case 2:
                    getRes = _a.sent();
                    expect(getRes.status).toBe(200);
                    expect(getRes.body.id).toBe(id);
                    expect(getRes.body.name).toBe('查詢權限');
                    return [2 /*return*/];
            }
        });
    }); });
    it('應能移除權限', function () { return __awaiter(void 0, void 0, void 0, function () {
        var forgeRes, id, removeRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(api_gateway_1.app)
                        .post('/v1/forge-authority')
                        .send({ name: '移除權限', description: '移除測試' })];
                case 1:
                    forgeRes = _a.sent();
                    id = forgeRes.body.id;
                    return [4 /*yield*/, (0, supertest_1.default)(api_gateway_1.app)
                            .delete("/v1/forge-authority/".concat(id))];
                case 2:
                    removeRes = _a.sent();
                    expect(removeRes.status).toBe(200);
                    expect(removeRes.body.success).toBe(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('查詢不存在權限應回傳 404', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(api_gateway_1.app)
                        .get('/v1/forge-authority/non-existent-id')];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
    it('移除不存在權限應回傳 404', function () { return __awaiter(void 0, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, supertest_1.default)(api_gateway_1.app)
                        .delete('/v1/forge-authority/non-existent-id')];
                case 1:
                    res = _a.sent();
                    expect(res.status).toBe(404);
                    return [2 /*return*/];
            }
        });
    }); });
});
