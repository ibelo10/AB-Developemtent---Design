// src/scripts/core/state-manager.js
class StateManager {
  constructor() {
    this.state = new Map();
    this.listeners = new Map();
    this.history = [];
    this.maxHistory = 10;
  }

  setState(key, value, options = { silent: false }) {
    const oldValue = this.state.get(key);

    // Don't update if value hasn't changed
    if (JSON.stringify(oldValue) === JSON.stringify(value)) return;

    // Save to history
    this.history.push({
      key,
      oldValue,
      newValue: value,
      timestamp: Date.now(),
    });

    // Maintain history size
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Update state
    this.state.set(key, value);

    // Notify listeners unless silent
    if (!options.silent && this.listeners.has(key)) {
      this.listeners.get(key).forEach((listener) => listener(value, oldValue));
    }

    // Emit general state change event
    eventBus.emit("stateChange", { key, value, oldValue });
  }

  getState(key, defaultValue = null) {
    return this.state.has(key) ? this.state.get(key) : defaultValue;
  }

  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(key);
      if (listeners) {
        listeners.delete(callback);
      }
    };
  }

  getHistory(key = null) {
    return key
      ? this.history.filter((entry) => entry.key === key)
      : this.history;
  }

  resetState(key = null) {
    if (key) {
      this.state.delete(key);
      this.listeners.delete(key);
    } else {
      this.state.clear();
      this.listeners.clear();
    }
    eventBus.emit("stateReset", { key });
  }
}

export const stateManager = new StateManager();
