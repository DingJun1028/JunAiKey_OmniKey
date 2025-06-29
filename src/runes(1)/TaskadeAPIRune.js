"use strict";
// src/runes/TaskadeAPIRune.ts
// Taskade API Rune Implementation
// Provides methods to interact with the Taskade API via the ApiProxy.
// This Rune is an example of an 'api-adapter' type Rune.
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
exports.TaskadeAPIRune = void 0;
// import { ApiProxy } from '../proxies/apiProxy'; // Access via context
// import { LoggingService } from '../core/logging/LoggingService'; // Access via context
/**
 * Implements the Taskade API Rune, allowing interaction with the Taskade API.
 * This is an example of an 'api-adapter' type Rune.
 */
var TaskadeAPIRune = /** @class */ (function () {
    function TaskadeAPIRune(context, rune) {
        var _a, _b;
        this.context = context;
        this.rune = rune;
        console.log("[Rune] TaskadeAPIRune initialized for ".concat(rune.name, "."));
        // Validate configuration (e.g., check if API key is available)
        if (!((_a = this.rune.configuration) === null || _a === void 0 ? void 0 : _a.apiKey)) {
            console.warn("[Rune] TaskadeAPIRune ".concat(rune.name, " is missing API key in configuration."));
            (_b = this.context.loggingService) === null || _b === void 0 ? void 0 : _b.logWarning("TaskadeAPIRune missing API key", { runeId: rune.id });
            // The ApiProxy will also check for the key, but warning here is good.
        }
    }
    /**
     * Makes a generic API call to the Taskade API.
     * Corresponds to the 'callAPI' method in the manifest.
     * @param params Parameters for the API call, e.g., { endpoint: string, method: string, data?: any, config?: any }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The API response data.
     */
    TaskadeAPIRune.prototype.callAPI = function (params, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_1;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.log("[Rune] ".concat(this.rune.name, ".callAPI called by user ").concat(userId, " with params:"), params);
                        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo("Executing rune action: ".concat(this.rune.name, ".callAPI"), { runeId: this.rune.id, userId: userId, params: { endpoint: params === null || params === void 0 ? void 0 : params.endpoint, method: params === null || params === void 0 ? void 0 : params.method } });
                        if (!(params === null || params === void 0 ? void 0 : params.endpoint) || !(params === null || params === void 0 ? void 0 : params.method)) {
                            throw new Error('Endpoint and method are required for callAPI.');
                        }
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ((_b = this.context.apiProxy) === null || _b === void 0 ? void 0 : _b.callTaskadeAPI(params.endpoint, params.method, params.data, params.config))];
                    case 2:
                        result = _d.sent();
                        console.log("[Rune] ".concat(this.rune.name, ".callAPI result:"), result);
                        return [2 /*return*/, { status: 'success', data: result }];
                    case 3:
                        error_1 = _d.sent();
                        console.error("[Rune] Error executing ".concat(this.rune.name, ".callAPI:"), error_1);
                        (_c = this.context.loggingService) === null || _c === void 0 ? void 0 : _c.logError("Error executing rune action: ".concat(this.rune.name, ".callAPI"), { runeId: this.rune.id, userId: userId, error: error_1.message });
                        throw new Error("Taskade API call failed: ".concat(error_1.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    // TODO: Add more specific methods based on Taskade API capabilities if needed
    // Example:
    // async listProjects(params: { workspaceId: string }, userId: string): Promise<any> {
    //     console.log(`[Rune] ${this.rune.name}.listProjects called by user ${userId}.`);
    //     this.context.loggingService?.logInfo(`Executing rune action: ${this.rune.name}.listProjects`, { runeId: this.rune.id, userId, params });
    //     if (!params?.workspaceId) {
    //          throw new Error('workspaceId is required for listProjects.');
    //     }
    //     try {
    //         const result = await this.context.apiProxy?.callTaskadeAPI(`/workspaces/${params.workspaceId}/projects`, 'GET');
    //         return { status: 'success', data: result };
    //     } catch (error: any) {
    //         console.error(`[Rune] Error executing ${this.rune.name}.listProjects:`, error);
    //         this.context.loggingService?.logError(`Error executing rune action: ${this.rune.name}.listProjects`, { runeId: this.rune.id, userId, error: error.message });
    //         throw new Error(`Taskade API call failed: ${error.message}`);
    //     }
    // }
    /**
     * Method to update configuration (optional, but good practice for API keys).
     * @param config The new configuration object.
     */
    TaskadeAPIRune.prototype.updateConfiguration = function (config) {
        console.log("[Rune] ".concat(this.rune.name, " configuration updated:"), config);
        this.rune.configuration = config; // Update the configuration on the rune object
        // TODO: Re-initialize any internal clients if configuration changes affect them
    };
    return TaskadeAPIRune;
}());
exports.TaskadeAPIRune = TaskadeAPIRune;
