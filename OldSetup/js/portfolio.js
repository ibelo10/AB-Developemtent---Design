// assets/js/portfolio.js (main portfolio page script)
import { initializeBackgroundEffects } from "./components/background-effects.js";
import { Portfolio } from "./components/portfolio/index.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing portfolio page...");

  // Initialize background effects
  initializeBackgroundEffects("portfolio");

  // Initialize portfolio
  const portfolioContainer = document.querySelector(".portfolio-grid");
  if (portfolioContainer) {
    new Portfolio(portfolioContainer);
  } else {
    console.error("Portfolio container not found");
  }
});
