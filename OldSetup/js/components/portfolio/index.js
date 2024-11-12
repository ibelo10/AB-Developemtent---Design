// assets/js/components/portfolio/index.js
import { PortfolioConfig } from "./config.js";
import { PortfolioItem } from "./portfolio-item.js";

export class Portfolio {
  constructor(container) {
    if (!container) throw new Error("Portfolio container is required");
    this.container = container;
    this.init();
  }

  async init() {
    try {
      await this.loadPortfolioContent();
    } catch (error) {
      console.error("Failed to initialize portfolio:", error);
      this.handleError();
    }
  }

  async loadPortfolioContent() {
    // Load portfolio content template
    const response = await fetch("/components/portfolio/index.html");
    const template = await response.text();
    this.container.innerHTML = template;

    // Initialize portfolio items
    const portfolioGrid = this.container.querySelector(".portfolio-grid");
    if (!portfolioGrid) throw new Error("Portfolio grid not found");

    for (const projectData of PortfolioConfig.projects) {
      const portfolioItem = new PortfolioItem(projectData);
      const element = await portfolioItem.render();
      portfolioGrid.appendChild(element);
    }
  }

  handleError() {
    this.container.innerHTML = `
      <div class="error-message">
        <p>Unable to load portfolio projects. Please try again later.</p>
      </div>
    `;
  }
}
