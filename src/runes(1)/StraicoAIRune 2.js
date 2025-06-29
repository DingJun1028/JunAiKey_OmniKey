"use strict";
// src/runes/StraicoAIRune.ts
// Straico AI Rune Implementation
// Provides methods to interact with the Straico AI API via the ApiProxy.
// This Rune is an example of an 'ai-agent' type Rune.
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
exports.StraicoAIRune = void 0;
// import { ApiProxy } from '../proxies/apiProxy'; // Access via context
// import { LoggingService } from '../core/logging/LoggingService'; // Access via context
/**
 * Implements the Straico AI Rune, allowing interaction with the Straico AI API.
 * This is an example of an 'ai-agent' type Rune.
 */
var StraicoAIRune = /** @class */ (function () {
    function StraicoAIRune(context, rune) {
        var _a, _b;
        this.context = context;
        this.rune = rune;
        console.log("[Rune] StraicoAIRune initialized for ".concat(rune.name, "."));
        // Validate configuration (e.g., check if API key is available)
        if (!((_a = this.rune.configuration) === null || _a === void 0 ? void 0 : _a.apiKey)) {
            console.warn("[Rune] StraicoAIRune ".concat(rune.name, " is missing API key in configuration."));
            (_b = this.context.loggingService) === null || _b === void 0 ? void 0 : _b.logWarning("StraicoAIRune missing API key", { runeId: rune.id });
            // The ApiProxy will also check for the key, but warning here is good.
        }
    }
    /**
     * Sends a prompt for text completion to the Straico AI API.
     * Corresponds to the 'promptCompletion' method in the manifest.
     * @param params Parameters for the completion, e.g., { prompt: string, max_tokens?: number }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The AI completion result.
     */
    StraicoAIRune.prototype.promptCompletion = function (params, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, method, data_1, result, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log("[Rune] ".concat(this.rune.name, ".promptCompletion called by user ").concat(userId, "."));
                        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo("Executing rune action: ".concat(this.rune.name, ".promptCompletion"), { runeId: this.rune.id, userId: userId, params: { promptLength: (_b = params === null || params === void 0 ? void 0 : params.prompt) === null || _b === void 0 ? void 0 : _b.length, max_tokens: params === null || params === void 0 ? void 0 : params.max_tokens } });
                        if (!(params === null || params === void 0 ? void 0 : params.prompt)) {
                            throw new Error('Prompt is required for promptCompletion.');
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        endpoint = '/completions';
                        method = 'POST';
                        data_1 = {
                            prompt: params.prompt,
                            max_tokens: params.max_tokens || 150, // Default max tokens
                            temperature: params.temperature || 0.7, // Default temperature
                            // Add other Straico-specific parameters as needed
                        };
                        return [4 /*yield*/, ((_c = this.context.apiProxy) === null || _c === void 0 ? void 0 : _c.callStraicoAPI(endpoint, method, data_1))];
                    case 2:
                        result = _e.sent();
                        console.log("[Rune] ".concat(this.rune.name, ".promptCompletion result:"), result);
                        // Assuming the result structure is like { text: string } or similar
                        return [2 /*return*/, { status: 'success', data: result }];
                    case 3:
                        error_1 = _e.sent();
                        console.error("[Rune] Error executing ".concat(this.rune.name, ".promptCompletion:"), error_1);
                        (_d = this.context.loggingService) === null || _d === void 0 ? void 0 : _d.logError("Error executing rune action: ".concat(this.rune.name, ".promptCompletion"), { runeId: this.rune.id, userId: userId, error: error_1.message });
                        throw new Error("Straico AI API call failed: ".concat(error_1.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sends messages for a chat-based interaction to the Straico AI API.
     * Corresponds to the 'chat' method in the manifest.
     * @param params Parameters for the chat, e.g., { messages: Array<{ role: string, content: string }>, model?: string }. Required.
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The AI chat response.
     */
    StraicoAIRune.prototype.chat = function (params, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, method, data_2, result, error_2;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log("[Rune] ".concat(this.rune.name, ".chat called by user ").concat(userId, "."));
                        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo("Executing rune action: ".concat(this.rune.name, ".chat"), { runeId: this.rune.id, userId: userId, params: { messageCount: (_b = params === null || params === void 0 ? void 0 : params.messages) === null || _b === void 0 ? void 0 : _b.length, model: params === null || params === void 0 ? void 0 : params.model, max_tokens: params === null || params === void 0 ? void 0 : params.max_tokens } });
                        if (!(params === null || params === void 0 ? void 0 : params.messages) || !Array.isArray(params.messages) || params.messages.length === 0) {
                            throw new Error('Messages array is required for chat.');
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        endpoint = '/chat/completions';
                        method = 'POST';
                        data_2 = {
                            messages: params.messages,
                            model: params.model || 'straico-default-chat-model', // Default model
                            max_tokens: params.max_tokens || 500, // Default max tokens
                            temperature: params.temperature || 0.7, // Default temperature
                            // Add other Straico-specific parameters as needed
                        };
                        return [4 /*yield*/, ((_c = this.context.apiProxy) === null || _c === void 0 ? void 0 : _c.callStraicoAPI(endpoint, method, data_2))];
                    case 2:
                        result = _e.sent();
                        console.log("[Rune] ".concat(this.rune.name, ".chat result:"), result);
                        // Assuming the result structure is like { choices: [{ message: { role: string, content: string } }] } or similar
                        return [2 /*return*/, { status: 'success', data: result }];
                    case 3:
                        error_2 = _e.sent();
                        console.error("[Rune] Error executing ".concat(this.rune.name, ".chat:"), error_2);
                        (_d = this.context.loggingService) === null || _d === void 0 ? void 0 : _d.logError("Error executing rune action: ".concat(this.rune.name, ".chat"), { runeId: this.rune.id, userId: userId, error: error_2.message });
                        throw new Error("Straico AI API call failed: ".concat(error_2.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Method to update configuration (optional, but good practice for API keys).
     * @param config The new configuration object.
     */
    StraicoAIRune.prototype.updateConfiguration = function (config) {
        console.log("[Rune] ".concat(this.rune.name, " configuration updated:"), config);
        this.rune.configuration = config; // Update the configuration on the rune object
        // TODO: Re-initialize any internal clients if configuration changes affect them
    };
    return StraicoAIRune;
}());
exports.StraicoAIRune = StraicoAIRune;
