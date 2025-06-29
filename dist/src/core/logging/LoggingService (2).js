// src/core/logging/LoggingService.ts
// 日誌服務 (Logging Service) - 輔助模組
// Provides a standardized interface for logging system events and actions.
// Crucial for the "Observe" step in the Six Styles and for data collection for Analytics.
// Design Principle: Provides visibility into system operations and collects data for analysis.
export class LoggingService {
    constructor(context) {
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
    logInfo(message, context, userId) {
        this.log('info', message, context, userId);
    }
    /**
     * Logs a warning message.
     * @param message The log message. Required.
     * @param context Optional contextual data.
     * @param userId Optional user ID to associate the log with.
     */
    logWarning(message, context, userId) {
        this.log('warn', message, context, userId);
    }
    /**
     * Logs an error message.
     * @param message The log message. Required.
     * @param context Optional contextual data.
     * @param userId Optional user ID to associate the log with.
     */
    logError(message, context, userId) {
        this.log('error', message, context, userId);
    }
    /**
     * Logs a debug message.
     * @param message The log message. Required.
     * @param context Optional contextual data.
     * @param userId Optional user ID to associate the log with.
     */
    logDebug(message, context, userId) {
        // Only log debug messages if debug logging is enabled
        // if (this.isDebugEnabled()) {
        this.log('debug', message, context, userId);
        // }
    }
    /**
     * Generic logging method.
     * @param level The log level. Required.
     * @param message The log message. Required.
     * @param context Optional contextual data.
     * @param userId Optional user ID to associate the log with.
     */
    log(level, message, context, userId) {
        const logEntry = {
            level,
            message,
            timestamp: Date.now(),
            context,
            userId: userId, // Use provided userId or get from context if available
        };
        // Log to console (for development)
        const consoleLog = `[${logEntry.level.toUpperCase()}] [${new Date(logEntry.timestamp).toISOString()}]${logEntry.userId ? ` [User:${logEntry.userId}]` : ''} ${logEntry.message}`;
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
        const MAX_LOGS = 1000;
        if (this.logs.length > MAX_LOGS) {
            this.logs.shift(); // Remove the oldest log
        }
        // TODO: Implement asynchronous persistence to Supabase table or external logging service
        // Example: this.supabase?.from('logs').insert([logEntry]).then(...).catch(...);
    }
    /**
     * Retrieves recent logs (placeholder).
     * @param limit The maximum number of logs to retrieve. Optional.
     * @param userId Filter logs by user ID. Optional.
     * @param level Filter logs by level. Optional.
     * @returns Promise<any[]> An array of log entries.
     */
    async getRecentLogs(limit = 100, userId, level) {
        console.log(`[LoggingService] Getting recent logs (limit: ${limit}, user: ${userId || 'all'}, level: ${level || 'all'}) (Placeholder).`);
        // TODO: Implement fetching from Supabase table or logging service
        // Filter by limit, userId, and level
        // Simulate fetching from in-memory array
        let filteredLogs = this.logs;
        if (userId) {
            filteredLogs = filteredLogs.filter(log => log.userId === userId);
        }
        if (level) {
            filteredLogs = filteredLogs.filter(log => log.level === level);
        }
        // Return the most recent logs up to the limit
        return filteredLogs.slice(-limit).reverse(); // Reverse to show newest first
    }
}
// Example Usage:
// const loggingService = new LoggingService(systemContext);
// loggingService.logInfo('System started.');
// loggingService.logWarning('Cache miss for key: user-abc');
// loggingService.logError('Failed to connect to API', { url: '...', status: 500 });
// loggingService.logDebug('Processing data chunk', { chunkId: 1 });
// const recentErrors = await loggingService.getRecentLogs(10, 'user-sim-123', 'error');
