// assets/js/main.js
import { initializeScrollingText } from "./components/scrolling-text.js";
import { initializeHeaderEffects } from "./components/header-effects.js";

// Wait for DOM and jQuery to be ready
$(document).ready(function () {
  // Ensure jQuery and ripples are loaded
  ensureLibraries()
    .then(() => {
      // Initialize all components
      initializeComponents();
      // Set up event listeners
      setupEventListeners();
    })
    .catch(error => {
      console.warn('Library initialization failed:', error);
    });
});

// Ensure required libraries are loaded
function ensureLibraries() {
  return new Promise((resolve, reject) => {
    try {
      if (typeof jQuery === 'undefined') {
        reject('jQuery not loaded');
        return;
      }

      // Check if ripples needs to be loaded
      if (typeof jQuery.fn.ripples === 'undefined') {
        // Load ripples dynamically
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js')
          .done(() => resolve())
          .fail(() => reject('Failed to load ripples plugin'));
      } else {
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
}

// Initialize all components
function initializeComponents() {
  try {
    // Initialize scrolling text
    initializeScrollingText();
    // Initialize header effects
    initializeHeaderEffects();
    // Initialize ripple effect with retry
    initializeRipplesWithRetry();
  } catch (error) {
    console.error("Error initializing components:", error);
  }
}

// Initialize ripple effect with retry mechanism
function initializeRipplesWithRetry(retries = 3) {
  const heroContainer = $('.hero-container');
  if (!heroContainer.length) {
    console.warn('Hero container not found');
    return;
  }

  try {
    if (typeof heroContainer.ripples === 'function') {
      heroContainer.ripples({
        resolution: 512,
        dropRadius: 20,
        perturbance: 0.04,
        interactive: true,
        crossOrigin: ''
      });
    } else if (retries > 0) {
      // Retry after a short delay
      setTimeout(() => {
        initializeRipplesWithRetry(retries - 1);
      }, 500);
    } else {
      console.warn('Ripples plugin not available after retries');
    }
  } catch (error) {
    console.warn("Ripples effect initialization error:", error);
    if (retries > 0) {
      setTimeout(() => {
        initializeRipplesWithRetry(retries - 1);
      }, 500);
    }
  }
}

// Set up event listeners with debouncing
function setupEventListeners() {
  // Debounce resize handler
  let resizeTimeout;
  $(window).on("resize", function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
  });

  // Throttle scroll handler
  let lastScroll = 0;
  const throttleTime = 100;
  
  $(window).on("scroll", function() {
    const now = Date.now();
    if (now - lastScroll >= throttleTime) {
      handleScroll();
      lastScroll = now;
    }
  });
}

// Handle window resize
function handleResize() {
  const heroContainer = $('.hero-container');
  if (!heroContainer.length) return;

  try {
    // First destroy the existing ripples
    if (typeof heroContainer.ripples === 'function') {
      heroContainer.ripples('destroy');
      
      // Reinitialize ripples after a short delay
      setTimeout(() => {
        heroContainer.ripples({
          resolution: 512,
          dropRadius: 20,
          perturbance: 0.04,
          interactive: true,
          crossOrigin: ''
        });
      }, 100);
    }
  } catch (error) {
    console.warn("Resize handling error:", error);
  }
}

// Handle scroll for navbar with improved performance
function handleScroll() {
  const scrollPosition = $(window).scrollTop();
  const navbar = $(".navbar");
  
  if (!navbar.length) return;

  // Use requestAnimationFrame for smooth transitions
  requestAnimationFrame(() => {
    const opacity = Math.min(0.8, Math.max(0.5, scrollPosition / 100));
    navbar.css("background", `rgba(0, 0, 0, ${opacity})`);
  });
}

export { initializeComponents, setupEventListeners };
