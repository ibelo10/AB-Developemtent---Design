// src/scripts/components/scrolling-text.js
import { eventBus } from "../core/event-bus";

export class ScrollingText {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      texts: ["Developer", "Designer", "Creator"],
      interval: 3000,
      animationDuration: 500,
      ...options,
    };

    this.currentIndex = 0;
    this.isAnimating = false;

    this.init();
  }

  init() {
    this.createElements();
    this.startAnimation();
    this.setupEventListeners();
  }

  createElements() {
    this.element = document.createElement("div");
    this.element.className = "scrolling-text";

    this.textElement = document.createElement("span");
    this.textElement.className = "scrolling-text__item";
    this.textElement.textContent = this.options.texts[0];

    this.element.appendChild(this.textElement);
    this.container.appendChild(this.element);
  }

  async animate(newText) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    // Fade out
    this.textElement.style.opacity = "0";
    await this.wait(this.options.animationDuration);

    // Change text
    this.textElement.textContent = newText;

    // Fade in
    this.textElement.style.opacity = "1";
    await this.wait(this.options.animationDuration);

    this.isAnimating = false;
  }

  startAnimation() {
    this.interval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.options.texts.length;
      this.animate(this.options.texts[this.currentIndex]);
    }, this.options.interval);
  }

  setupEventListeners() {
    eventBus.on("pagePause", () => this.pause());
    eventBus.on("pageResume", () => this.resume());
  }

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  pause() {
    clearInterval(this.interval);
  }

  resume() {
    this.startAnimation();
  }

  destroy() {
    this.pause();
    this.element.remove();
  }
}
