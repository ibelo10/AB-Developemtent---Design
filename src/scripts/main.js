// src/scripts/main.js
import { eventBus } from "./core/event-bus";
import { stateManager } from "./core/state-manager";
import { initializeScrollingText } from "./components/scrolling-text";
import { initializeHeader } from "./components/header";
import { initializeRippleEffect } from "./components/background-effects";

class App {
  constructor() {
    this.init();
  }

  async init() {
    try {
      // Initialize state
      this.initializeState();

      // Initialize components
      await this.initializeComponents();

      // Set up event listeners
      this.setupEventListeners();

      // Emit app ready event
      eventBus.emit("appReady");
    } catch (error) {
      console.error("Application initialization error:", error);
      eventBus.emit("appError", error);
    }
  }

  initializeState() {
    stateManager.setState("theme", "dark");
    stateManager.setState("isScrolled", false);
    stateManager.setState("isMobile", window.innerWidth < 768);
  }

  async initializeComponents() {
    try {
      // Initialize scrolling text component
      await initializeScrollingText();

      // Initialize header component with scroll effects
      await initializeHeader();

      // Initialize ripple effect
      await initializeRippleEffect(".hero-container");
    } catch (error) {
      console.error("Component initialization error:", error);
      throw error;
    }
  }

  setupEventListeners() {
    // Handle window resize
    window.addEventListener("resize", this.handleResize.bind(this));

    // Handle scroll events
    window.addEventListener("scroll", this.handleScroll.bind(this));
  }

  handleResize() {
    const isMobile = window.innerWidth < 768;
    stateManager.setState("isMobile", isMobile);

    // Emit resize event for components to handle
    eventBus.emit("windowResize", {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile,
    });
  }

  handleScroll() {
    const scrollPosition = window.scrollY;
    const isScrolled = scrollPosition > 50;

    stateManager.setState("isScrolled", isScrolled);
    eventBus.emit("scroll", { position: scrollPosition });
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new App();
});
