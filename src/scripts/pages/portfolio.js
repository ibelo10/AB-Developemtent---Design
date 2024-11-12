// src/scripts/pages/portfolio.js
import { PortfolioGrid } from "../components/portfolio-grid";
import { eventBus } from "../core/event-bus";

export default async function initializePortfolioPage() {
  try {
    // Initialize portfolio grid
    const portfolioGrid = await PortfolioGrid.initialize("portfolio-container");

    // Setup page-specific event listeners
    setupEventListeners();

    eventBus.emit("portfolioPageReady");
    return portfolioGrid;
  } catch (error) {
    console.error("Portfolio page initialization error:", error);
    eventBus.emit("pageError", { page: "portfolio", error });
  }
}

function setupEventListeners() {
  // Handle portfolio item clicks for analytics
  eventBus.on("portfolioItemClick", (data) => {
    // Track portfolio item interactions
    if (window.gtag) {
      gtag("event", "portfolio_item_click", {
        item_id: data.id,
      });
    }
  });

  // Handle filter changes for analytics
  eventBus.on("portfolioFilter", (data) => {
    if (window.gtag) {
      gtag("event", "portfolio_filter", {
        filters: data.filters.join(","),
        visible_items: data.visibleItems,
      });
    }
  });
}
