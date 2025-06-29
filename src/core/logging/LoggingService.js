"use strict";
// src/core/logging/LoggingService.ts
// 日誌服務 (Logging Service) - 輔助模組
// Provides a standardized interface for logging system events and actions.
// Crucial for the "Observe" step in the Six Styles and for data collection for Analytics.
// Design Principle: Provides visibility into system operations and collects data for analysis.
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
exports.LoggingService = void 0;
var LoggingService = /** @class */ (function () {
    function LoggingService(context) {
        // Using a simple in-memory array for MVP placeholder
        this.logs = [];
        this.context = context;
        // this.supabase = context.apiProxy.supabaseClient; // Supabase client is optional for logging
        console.log('LoggingService initialized (Placeholder - using in-memory array).');
        // TODO: Implement persistence to Supabase table or external logging service
        // TODO: Implement log level filtering
    }
    /**
     * Logs an informational message.
     * @param message The log message. Required.
     * @param context Optional contextual data.
     * @param userId Optional user ID to associate the log with.
     */
    LoggingService.prototype.logInfo = function (message, context, userId) {
        this.log('info', message, context, userId);
    };
    /**
     * Logs a warning message.
     * @param message The log message. Required.
     * @param context Optional contextual data.
     * @param userId Optional user ID to associate the log with.
     */
    LoggingService.prototype.logWarning = function (message, context, userId) {
        this.log('warn', message, context, userId);
    };
    /**
     * Logs an error message.
     * @param message The log message. Required.
     * @param context Optional contextual data.
     * @param userId Optional user ID to associate the log with.
     */
    LoggingService.prototype.logError = function (message, context, userId) {
        this.log('error', message, context, userId);
    };
    /**
     * Logs a debug message.
     * @param message The log message. Required.
     * @param context Optional contextual data.
     * @param userId Optional user ID to associate the log with.
     */
    LoggingService.prototype.logDebug = function (message, context, userId) {
        // Only log debug messages if debug logging is enabled
        // if (this.isDebugEnabled()) {
        this.log('debug', message, context, userId);
        // }
    };
    /**
     * Generic logging method.
     * @param level The log level. Required.
     * @param message The log message. Required.
     * @param context Optional contextual data.
     * @param userId Optional user ID to associate the log with.
     */
    LoggingService.prototype.log = function (level, message, context, userId) {
        var logEntry = {
            level: level,
            message: message,
            timestamp: Date.now(),
            context: context,
            userId: userId, // Use provided userId or get from context if available
        };
        // Log to console (for development)
        var consoleLog = "[".concat(logEntry.level.toUpperCase(), "] [").concat(new Date(logEntry.timestamp).toISOString(), "]").concat(logEntry.userId ? " [User:".concat(logEntry.userId, "]") : '', " ").concat(logEntry.message);
        switch (level) {
            case 'info':
                console.info(consoleLog, logEntry.context || '');
                break;
            case 'warn':
                console.warn(consoleLog, logEntry.context || '');
                break;
            case 'error':
                console.error(consoleLog, logEntry.context || '');
                break;
            case 'debug':
                console.debug(consoleLog, logEntry.context || '');
                break;
        }
        // Store in in-memory array (for MVP)
        this.logs.push(logEntry);
        // Keep the in-memory log size manageable
        var MAX_LOGS = 1000;
        if (this.logs.length > MAX_LOGS) {
            this.logs.shift(); // Remove the oldest log
        }
        // TODO: Implement asynchronous persistence to Supabase table or external logging service
        // Example: this.supabase?.from('logs').insert([logEntry]).then(...).catch(...);
    };
    /**
     * Retrieves recent logs (placeholder).
     * @param limit The maximum number of logs to retrieve. Optional.
     * @param userId Filter logs by user ID. Optional.
     * @param level Filter logs by level. Optional.
     * @returns Promise<any[]> An array of log entries.
     */
    LoggingService.prototype.getRecentLogs = function () {
        return __awaiter(this, arguments, void 0, function (limit, userId, level) {
            var filteredLogs;
            if (limit === void 0) { limit = 100; }
            return __generator(this, function (_a) {
                console.log("[LoggingService] Getting recent logs (limit: ".concat(limit, ", user: ").concat(userId || 'all', ", level: ").concat(level || 'all', ") (Placeholder)."));
                filteredLogs = this.logs;
                if (userId) {
                    filteredLogs = filteredLogs.filter(function (log) { return log.userId === userId; });
                }
                if (level) {
                    filteredLogs = filteredLogs.filter(function (log) { return log.level === level; });
                }
                // Return the most recent logs up to the limit
                return [2 /*return*/, filteredLogs.slice(-limit).reverse()]; // Reverse to show newest first
            });
        });
    };
    return LoggingService;
}());
exports.LoggingService = LoggingService;
// Example Usage:
// const loggingService = new LoggingService(systemContext);
// loggingService.logInfo('System started.');
// loggingService.logWarning('Cache miss for key: user-abc');
// loggingService.logError('Failed to connect to API', { url: '...', status: 500 });
// loggingService.logDebug('Processing data chunk', { chunkId: 1 });
// const recentErrors = await loggingService.getRecentLogs(10, 'user-sim-123', 'error');
