// src/scripts/pages/home.js
import { ScrollingText } from "../components/scrolling-text";
import { eventBus } from "../core/event-bus";
import { lazyLoader } from "../utils/lazy-loading";

export default async function initializeHomePage() {
  try {
    // Initialize scrolling text
    const scrollingContainer = document.querySelector(
      ".scrolling-text-container"
    );
    if (scrollingContainer) {
      new ScrollingText(scrollingContainer, {
        texts: ["Developer", "Designer", "Creator", "Problem Solver"],
      });
    }

    // Initialize lazy loading for images
    lazyLoader.observe("[data-src]");

    // Setup any home-specific event listeners
    setupEventListeners();

    eventBus.emit("homePageReady");
  } catch (error) {
    console.error("Home page initialization error:", error);
    eventBus.emit("pageError", { page: "home", error });
  }
}

function setupEventListeners() {
  // Add scroll-based animations
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((element) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(element);
  });

  // Handle CTA clicks
  const ctaButtons = document.querySelectorAll(".cta-button");
  ctaButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      eventBus.emit("ctaClick", {
        button: e.target.textContent,
        location: "home",
      });
    });
  });
}
