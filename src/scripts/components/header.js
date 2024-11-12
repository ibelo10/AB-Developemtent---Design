// src/scripts/components/header.js
import { eventBus } from "../core/event-bus";
import { stateManager } from "../core/state-manager";

export class Header {
  constructor() {
    this.header = document.querySelector(".header");
    this.init();
  }

  init() {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    // Subscribe to scroll state changes
    stateManager.subscribe(
      "isScrolled",
      this.handleScrollStateChange.bind(this)
    );
  }

  handleScrollStateChange(isScrolled) {
    if (isScrolled) {
      this.header.classList.add("header-scrolled");
    } else {
      this.header.classList.remove("header-scrolled");
    }
  }
}

export const initializeHeader = () => {
  const header = new Header();
  return Promise.resolve(header);
};
