// eventBus 實作（簡易版，支援 on/off/emit）
export type EventHandler = (payload: any) => void;

class EventBus {
  private listeners: Record<string, EventHandler[]> = {};

  on(event: string, handler: EventHandler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
  }
  off(event: string, handler: EventHandler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }
  emit(event: string, payload: any) {
    (this.listeners[event] || []).forEach(h => h(payload));
  }
}

export const eventBus = new EventBus();
if (typeof window !== 'undefined') {
  (window as any).eventBus = eventBus;
}
