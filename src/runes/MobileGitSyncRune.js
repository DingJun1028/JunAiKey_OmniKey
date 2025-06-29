"use strict";
// src/runes/MobileGitSyncRune.ts
// Mobile Git Sync Rune Implementation
// Provides methods to interact with a simulated mobile Git client via the SyncService.
// This Rune is an example of a 'device-adapter' type Rune.
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
exports.MobileGitSyncRune = void 0;
// import { SyncService } from '../modules/sync/SyncService'; // Access via context
// import { LoggingService } from '../core/logging/LoggingService'; // Access via context
/**
 * Implements the Mobile Git Sync Rune, allowing interaction with a simulated mobile Git client.
 * This is an example of a 'device-adapter' type Rune.
 */
var MobileGitSyncRune = /** @class */ (function () {
    function MobileGitSyncRune(context, rune) {
        var _a, _b;
        this.context = context;
        this.rune = rune;
        console.log("[Rune] MobileGitSyncRune initialized for ".concat(rune.name, "."));
        // Validate configuration (e.g., check if repoUrl is set)
        if (!((_a = this.rune.configuration) === null || _a === void 0 ? void 0 : _a.repo_url)) {
            console.warn("[Rune] MobileGitSyncRune ".concat(rune.name, " is missing repo_url in configuration."));
            (_b = this.context.loggingService) === null || _b === void 0 ? void 0 : _b.logWarning("MobileGitSyncRune missing repo_url", { runeId: rune.id });
        }
    }
    /**
     * Simulates pulling changes from the remote Git repository on the mobile device.
     * Corresponds to the 'pull' method in the manifest.
     * @param params Optional parameters (e.g., branch).
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The simulated sync result.
     */
    MobileGitSyncRune.prototype.pull = function (params, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var repoUrl, result, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log("[Rune] ".concat(this.rune.name, ".pull called by user ").concat(userId, "."));
                        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo("Executing rune action: ".concat(this.rune.name, ".pull"), { runeId: this.rune.id, userId: userId, params: params });
                        repoUrl = (_b = this.rune.configuration) === null || _b === void 0 ? void 0 : _b.repo_url;
                        if (!repoUrl) {
                            throw new Error("Rune configuration missing 'repo_url'. Cannot perform pull.");
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ((_c = this.context.syncService) === null || _c === void 0 ? void 0 : _c.syncMobileGitRepo(userId, 'pull', __assign({ repoUrl: repoUrl }, params)))];
                    case 2:
                        result = _e.sent();
                        console.log("[Rune] ".concat(this.rune.name, ".pull result:"), result);
                        return [2 /*return*/, { status: 'success', data: result }];
                    case 3:
                        error_1 = _e.sent();
                        console.error("[Rune] Error executing ".concat(this.rune.name, ".pull:"), error_1);
                        (_d = this.context.loggingService) === null || _d === void 0 ? void 0 : _d.logError("Error executing rune action: ".concat(this.rune.name, ".pull"), { runeId: this.rune.id, userId: userId, error: error_1.message });
                        throw new Error("Mobile Git pull failed: ".concat(error_1.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Simulates pushing changes to the remote Git repository from the mobile device.
     * Corresponds to the 'push' method in the manifest.
     * @param params Optional parameters (e.g., branch, commitMessage).
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The simulated sync result.
     */
    MobileGitSyncRune.prototype.push = function (params, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var repoUrl, result, error_2;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log("[Rune] ".concat(this.rune.name, ".push called by user ").concat(userId, "."));
                        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo("Executing rune action: ".concat(this.rune.name, ".push"), { runeId: this.rune.id, userId: userId, params: params });
                        repoUrl = (_b = this.rune.configuration) === null || _b === void 0 ? void 0 : _b.repo_url;
                        if (!repoUrl) {
                            throw new Error("Rune configuration missing 'repo_url'. Cannot perform push.");
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ((_c = this.context.syncService) === null || _c === void 0 ? void 0 : _c.syncMobileGitRepo(userId, 'push', __assign({ repoUrl: repoUrl }, params)))];
                    case 2:
                        result = _e.sent();
                        console.log("[Rune] ".concat(this.rune.name, ".push result:"), result);
                        return [2 /*return*/, { status: 'success', data: result }];
                    case 3:
                        error_2 = _e.sent();
                        console.error("[Rune] Error executing ".concat(this.rune.name, ".push:"), error_2);
                        (_d = this.context.loggingService) === null || _d === void 0 ? void 0 : _d.logError("Error executing rune action: ".concat(this.rune.name, ".push"), { runeId: this.rune.id, userId: userId, error: error_2.message });
                        throw new Error("Mobile Git push failed: ".concat(error_2.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Simulates bidirectional sync (pull then push) for the mobile Git repository.
     * Corresponds to the 'bidirectional' method in the manifest.
     * @param params Optional parameters (e.g., branch, commitMessage).
     * @param userId The user ID executing the action. Required.
     * @returns Promise<any> The simulated sync result.
     */
    MobileGitSyncRune.prototype.bidirectional = function (params, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var repoUrl, result, error_3;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        console.log("[Rune] ".concat(this.rune.name, ".bidirectional called by user ").concat(userId, "."));
                        (_a = this.context.loggingService) === null || _a === void 0 ? void 0 : _a.logInfo("Executing rune action: ".concat(this.rune.name, ".bidirectional"), { runeId: this.rune.id, userId: userId, params: params });
                        repoUrl = (_b = this.rune.configuration) === null || _b === void 0 ? void 0 : _b.repo_url;
                        if (!repoUrl) {
                            throw new Error("Rune configuration missing 'repo_url'. Cannot perform bidirectional sync.");
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ((_c = this.context.syncService) === null || _c === void 0 ? void 0 : _c.syncMobileGitRepo(userId, 'bidirectional', __assign({ repoUrl: repoUrl }, params)))];
                    case 2:
                        result = _e.sent();
                        console.log("[Rune] ".concat(this.rune.name, ".bidirectional result:"), result);
                        return [2 /*return*/, { status: 'success', data: result }];
                    case 3:
                        error_3 = _e.sent();
                        console.error("[Rune] Error executing ".concat(this.rune.name, ".bidirectional:"), error_3);
                        (_d = this.context.loggingService) === null || _d === void 0 ? void 0 : _d.logError("Error executing rune action: ".concat(this.rune.name, ".bidirectional"), { runeId: this.rune.id, userId: userId, error: error_3.message });
                        throw new Error("Mobile Git bidirectional sync failed: ".concat(error_3.message));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Method to update configuration (e.g., repoUrl, credentials).
     * @param config The new configuration object.
     */
    MobileGitSyncRune.prototype.updateConfiguration = function (config) {
        console.log("[Rune] ".concat(this.rune.name, " configuration updated:"), config);
        this.rune.configuration = config; // Update the configuration on the rune object
        // TODO: Re-initialize any internal clients if configuration changes affect them
    };
    return MobileGitSyncRune;
}());
exports.MobileGitSyncRune = MobileGitSyncRune;
