// src/scripts/components/portfolio/Portfolio.js
export class Portfolio {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("Portfolio container must be a DOM element");
    }
    this.container = container;
    this.items = [];
  }

  async init() {
    await this.loadPortfolioContent();
  }

  async loadPortfolioContent() {
    // Implementation
  }
}

// src/scripts/components/portfolio-grid.js
export class PortfolioGrid {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Portfolio container with id '${containerId}' not found`);
    }

    this.filters = new Set();
    this.currentLayout = "grid";
    this.setupControls();
    this.setupEventListeners();
  }

  async init() {
    try {
      await this.initializePortfolio();
      this.updateLayout(viewport.getCurrentBreakpoint());
    } catch (error) {
      console.error("Portfolio grid initialization error:", error);
      eventBus.emit("portfolioGridError", error);
    }
  }

  async initializePortfolio() {
    const gridElement = this.container.querySelector("#portfolio-grid");
    if (gridElement) {
      this.portfolio = new Portfolio(gridElement);
      await this.portfolio.init();
    }
  }

  toggleFilter(tag) {
    const buttons = Array.from(
      this.container.querySelectorAll(".filter-button")
    );
    const button = buttons.find((btn) => btn.textContent.trim() === tag);

    if (button) {
      if (this.filters.has(tag)) {
        this.filters.delete(tag);
        button.classList.remove("active");
      } else {
        this.filters.add(tag);
        button.classList.add("active");
      }
      this.updateVisibleItems();
    }
  }

  updateVisibleItems() {
    const items = this.container.querySelectorAll(".portfolio-item");
    items.forEach((item) => {
      const tags = Array.from(item.querySelectorAll(".tech-tag")).map((tag) =>
        tag.textContent.trim()
      );

      const isVisible =
        this.filters.size === 0 ||
        Array.from(this.filters).some((filter) => tags.includes(filter));
      item.style.display = isVisible ? "" : "none";
    });
  }
}
