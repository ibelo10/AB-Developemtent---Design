// assets/js/main.js

import { initializeScrollingText } from "./components/scrolling-text.js";
import { initializeHeaderEffects } from "./components/header-effects.js";

// Wait for DOM and jQuery to be ready
$(document).ready(function () {
  // Initialize all components
  initializeComponents();

  // Set up event listeners
  setupEventListeners();
});

// Initialize all components
function initializeComponents() {
  try {
    // Initialize scrolling text
    initializeScrollingText();

    // Initialize header effects
    initializeHeaderEffects();

    // Initialize ripple effect
    initializeRipples();
  } catch (error) {
    console.error("Error initializing components:", error);
  }
}

// Initialize ripple effect
function initializeRipples() {
  try {
    $(".hero-container").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
    });
  } catch (error) {
    console.error("Ripples effect error:", error);
  }
}

// Set up event listeners
function setupEventListeners() {
  // Handle window resize for ripples
  $(window).on("resize", handleResize);

  // Handle scroll for navbar transparency
  $(window).on("scroll", handleScroll);
}

// Handle window resize
function handleResize() {
  try {
    $(".hero-container").ripples("updateSize");
  } catch (error) {
    console.error("Resize error:", error);
  }
}

// Handle scroll for navbar
function handleScroll() {
  const scrollPosition = $(window).scrollTop();
  const navbar = $(".navbar");

  if (scrollPosition > 50) {
    navbar.css("background", "rgba(0, 0, 0, 0.8)");
  } else {
    navbar.css("background", "rgba(0, 0, 0, 0.5)");
  }
}
