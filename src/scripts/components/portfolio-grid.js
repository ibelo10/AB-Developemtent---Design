// src/scripts/components/portfolio-grid.js
import { Portfolio } from "./portfolio/Portfolio";
import { eventBus } from "../core/event-bus";
import { viewport } from "../utils/viewport";

export class PortfolioGrid {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Portfolio container with id '${containerId}' not found`);
    }

    this.filters = new Set();
    this.currentLayout = "grid";

    // Initialize without awaiting to allow constructor to complete
    this.initialize();
  }

  async initialize() {
    try {
      await this.setupControls();
      await this.initializePortfolio();
      this.setupEventListeners();
      this.updateLayout(viewport.getCurrentBreakpoint());
    } catch (error) {
      console.error("Portfolio grid initialization error:", error);
      eventBus.emit("portfolioGridError", error);
    }
  }

  async setupControls() {
    // Create controls container
    const controls = document.createElement("div");
    controls.className = "portfolio-controls";

    // Add layout toggle
    controls.appendChild(this.createLayoutToggle());

    // Add filter controls
    controls.appendChild(this.createFilterControls());

    // Insert controls before portfolio grid
    this.container.insertBefore(controls, this.container.firstChild);
  }

  createLayoutToggle() {
    const toggle = document.createElement("div");
    toggle.className = "layout-toggle";

    const gridButton = document.createElement("button");
    gridButton.textContent = "Grid";
    gridButton.className = "active";
    gridButton.addEventListener("click", () => this.setLayout("grid"));

    const listButton = document.createElement("button");
    listButton.textContent = "List";
    listButton.addEventListener("click", () => this.setLayout("list"));

    toggle.appendChild(gridButton);
    toggle.appendChild(listButton);

    return toggle;
  }

  createFilterControls() {
    const filters = document.createElement("div");
    filters.className = "filter-controls";

    // Add filter buttons based on available tags
    this.getTags().forEach((tag) => {
      const button = document.createElement("button");
      button.className = "filter-button";
      button.textContent = tag;
      button.dataset.tag = tag; // Add data attribute for easier selection
      button.addEventListener("click", () => this.toggleFilter(tag));
      filters.appendChild(button);
    });

    return filters;
  }

  getTags() {
    const tags = new Set();
    this.container.querySelectorAll(".tech-tag").forEach((tag) => {
      tags.add(tag.textContent.trim());
    });
    return Array.from(tags);
  }

  async initializePortfolio() {
    const gridElement = this.container.querySelector("#portfolio-grid");
    if (!gridElement) {
      throw new Error("Portfolio grid element not found");
    }

    this.portfolio = new Portfolio(gridElement);
    await this.portfolio.init();
  }

  setupEventListeners() {
    if (typeof viewport.observe === "function") {
      viewport.observe(this.updateLayout.bind(this));
    }
  }

  setLayout(layout) {
    this.currentLayout = layout;
    this.container.classList.remove("layout-grid", "layout-list");
    this.container.classList.add(`layout-${layout}`);

    // Update button states
    const buttons = this.container.querySelectorAll(".layout-toggle button");
    buttons.forEach((button) => {
      button.classList.toggle(
        "active",
        button.textContent.toLowerCase() === layout
      );
    });

    // Emit layout change event
    eventBus.emit("portfolioLayoutChange", { layout });
  }

  updateLayout(breakpoint) {
    if (breakpoint === "mobile" && this.currentLayout === "grid") {
      this.setLayout("list");
    }
  }

  toggleFilter(tag) {
    // Find button using data attribute instead of :contains
    const button = this.container.querySelector(
      `.filter-button[data-tag="${tag}"]`
    );

    if (!button) return;

    if (this.filters.has(tag)) {
      this.filters.delete(tag);
      button.classList.remove("active");
    } else {
      this.filters.add(tag);
      button.classList.add("active");
    }

    this.updateVisibleItems();

    // Emit filter change event
    eventBus.emit("portfolioFilterChange", {
      filters: Array.from(this.filters),
      tag,
      active: this.filters.has(tag),
    });
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

    // Emit visibility update event
    eventBus.emit("portfolioItemsUpdated", {
      visibleCount: Array.from(items).filter(
        (item) => item.style.display !== "none"
      ).length,
      totalCount: items.length,
    });
  }

  // Public methods for external control
  getActiveFilters() {
    return Array.from(this.filters);
  }

  getCurrentLayout() {
    return this.currentLayout;
  }

  resetFilters() {
    this.filters.clear();
    this.container.querySelectorAll(".filter-button").forEach((button) => {
      button.classList.remove("active");
    });
    this.updateVisibleItems();
  }

  destroy() {
    // Clean up event listeners
    this.container.querySelectorAll("button").forEach((button) => {
      button.replaceWith(button.cloneNode(true));
    });

    // Reset state
    this.filters.clear();
    this.currentLayout = "grid";

    // Remove controls
    const controls = this.container.querySelector(".portfolio-controls");
    if (controls) {
      controls.remove();
    }
  }
}
