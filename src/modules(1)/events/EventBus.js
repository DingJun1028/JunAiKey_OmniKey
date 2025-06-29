"use strict";
// src/modules/events/EventBus.ts
// 事件總線 (Event Bus) - 輔助模組
// Provides a central mechanism for publishing and subscribing to system events.
// Part of the Six Styles of Infinite Evolution (無限進化循環的六式奧義) - specifically Event Push (事件推送).
// Design Principle: Enables loose coupling between modules and supports reactive workflows.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
var EventBus = /** @class */ (function () {
    // private loggingService: LoggingService; // For logging events
    function EventBus( /* loggingService: LoggingService */) {
        this.subscribers = new Map();
        // this.loggingService = loggingService;
        console.log('EventBus initialized (Placeholder - using in-memory Map).');
        // TODO: Integrate with external event systems (e.g., webhooks, message queues) for cross-platform/service events
    }
    /**
     * Publishes an event to the bus.
     * @param eventType The type of event (e.g., 'new_knowledge', 'task_completed').
     * @param payload The event payload.
     */
    EventBus.prototype.publish = function (eventType, payload) {
        console.log("[EventBus] Publishing event: ".concat(eventType), payload || '');
        // TODO: Log event publication (Supports Observe/Monitor - call loggingService.logInfo)
        var handlers = this.subscribers.get(eventType);
        if (handlers) {
            handlers.forEach(function (handler) {
                try {
                    handler(payload);
                }
                catch (error) {
                    console.error("[EventBus] Error handling event \"".concat(eventType, "\":"), error);
                    // TODO: Log error using LoggingService (Supports Observe/Monitor - call loggingService.logError)
                }
            });
        }
    };
    /**
     * Subscribes to a specific event type.
     * @param eventType The type of event to subscribe to.
     * @param callback The function to call when the event is published.
     * @returns A function to unsubscribe.
     */
    EventBus.prototype.subscribe = function (eventType, callback) {
        var _this = this;
        console.log("[EventBus] Subscribing to event: ".concat(eventType));
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        this.subscribers.get(eventType).push(callback);
        // Return an unsubscribe function
        return function () {
            console.log("[EventBus] Unsubscribing from event: ".concat(eventType));
            var handlers = _this.subscribers.get(eventType);
            if (handlers) {
                _this.subscribers.set(eventType, handlers.filter(function (handler) { return handler !== callback; }));
            }
        };
    };
    /**
     * Subscribes once to a specific event type.
     * @param eventType The type of event to subscribe to.
     * @param callback The function to call when the event is published (will be called only once).
     * @returns A function to unsubscribe (though it will auto-unsubscribe after one call).
     */
    EventBus.prototype.subscribeOnce = function (eventType, callback) {
        var unsubscribe = this.subscribe(eventType, function (payload) {
            unsubscribe(); // Auto-unsubscribe after the first call
            callback(payload);
        });
        return unsubscribe;
    };
    return EventBus;
}());
exports.EventBus = EventBus;
// Example Usage:
// const eventBus = new EventBus();
// const unsubscribe = eventBus.subscribe('task_completed', (payload) => {
//     console.log('Task completed event received:', payload);
// });
// eventBus.publish('task_completed', { taskId: 'task-123', status: 'success' });
// unsubscribe(); // Stop listening
