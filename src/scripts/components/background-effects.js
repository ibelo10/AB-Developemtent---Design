// src/scripts/components/background-effects.js
import { eventBus } from "../core/event-bus";

export class RippleEffect {
  constructor(selector) {
    this.container = document.querySelector(selector);
    this.config = {
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
    };
  }

  async init() {
    try {
      // If using a modern ripple effect library
      await this.initializeRipples();
      this.setupEventListeners();
      return this;
    } catch (error) {
      console.error("Ripple effect initialization error:", error);
      throw error;
    }
  }

  async initializeRipples() {
    // Implementation will depend on which modern ripple library you choose
    // Here's a placeholder for the implementation
    if (this.container && typeof this.container.ripples === "function") {
      this.container.ripples(this.config);
    }
  }

  setupEventListeners() {
    eventBus.on("windowResize", () => this.handleResize());
  }

  handleResize() {
    if (this.container && typeof this.container.ripples === "function") {
      this.container.ripples("updateSize");
    }
  }
}

export const initializeRippleEffect = async (selector) => {
  const rippleEffect = new RippleEffect(selector);
  return rippleEffect.init();
};
