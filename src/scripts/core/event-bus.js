// src/scripts/core/event-bus.js
class EventBus {
  constructor() {
    this.events = new Map();
    this.recentEvents = [];
    this.maxRecentEvents = 50;
  }

  on(event, callback, options = {}) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    const listeners = this.events.get(event);
    const listener = { callback, options };
    listeners.add(listener);

    // Return unsubscribe function
    return () => {
      if (listeners.has(listener)) {
        listeners.delete(listener);
      }
    };
  }

  once(event, callback) {
    return this.on(event, callback, { once: true });
  }

  off(event, callback) {
    if (!this.events.has(event)) return;

    const listeners = this.events.get(event);
    for (const listener of listeners) {
      if (listener.callback === callback) {
        listeners.delete(listener);
      }
    }
  }

  emit(event, data = null) {
    // Log event
    this.logEvent(event, data);

    // Execute listeners
    if (this.events.has(event)) {
      const listeners = this.events.get(event);
      for (const listener of listeners) {
        try {
          listener.callback(data);

          // Remove if once option was set
          if (listener.options.once) {
            listeners.delete(listener);
          }
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      }
    }
  }

  logEvent(event, data) {
    this.recentEvents.unshift({
      event,
      data,
      timestamp: Date.now(),
    });

    // Maintain history size
    if (this.recentEvents.length > this.maxRecentEvents) {
      this.recentEvents.pop();
    }
  }

  getEventHistory(event = null) {
    return event
      ? this.recentEvents.filter((e) => e.event === event)
      : this.recentEvents;
  }

  clearHistory() {
    this.recentEvents = [];
  }
}

export const eventBus = new EventBus();
