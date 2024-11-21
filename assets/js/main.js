// assets/js/main.js
import { initializeScrollingText } from "./components/scrolling-text.js";
import { initializeHeaderEffects } from "./components/header-effects.js";
import { initializeSubscription } from "./components/subscription.js";

// Initialize all components
function initializeComponents() {
    try {
        // Initialize basic components
        initializeScrollingText();
        initializeHeaderEffects();
        initializeSubscription();
        
        // Initialize ripples with retry
        initializeRipples();
    } catch (error) {
        console.error("Error initializing components:", error);
    }
}

// Initialize ripples effect
function initializeRipples(retries = 3) {
    const heroContainer = $('.hero-container');
    if (!heroContainer.length) return;

    try {
        if (typeof $.fn.ripples === 'function') {
            heroContainer.ripples({
                resolution: 512,
                dropRadius: 20,
                perturbance: 0.04,
                interactive: true,
                crossOrigin: ''
            });
        } else if (retries > 0) {
            setTimeout(() => initializeRipples(retries - 1), 500);
        }
    } catch (error) {
        console.warn("Ripples effect error:", error);
        if (retries > 0) {
            setTimeout(() => initializeRipples(retries - 1), 500);
        }
    }
}

// Set up event listeners
function setupEventListeners() {
    // Handle window resize for ripples
    let resizeTimeout;
    $(window).on("resize", function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const heroContainer = $('.hero-container');
            if (!heroContainer.length) return;

            try {
                if (typeof heroContainer.ripples === 'function') {
                    heroContainer.ripples('destroy');
                    initializeRipples();
                }
            } catch (error) {
                console.warn("Resize error:", error);
            }
        }, 250);
    });

    // Handle scroll for navbar transparency
    const navbar = $(".navbar");
    if (navbar.length) {
        let lastScroll = 0;
        const throttleTime = 100;

        $(window).on("scroll", function() {
            const now = Date.now();
            if (now - lastScroll >= throttleTime) {
                const scrollPosition = $(window).scrollTop();
                requestAnimationFrame(() => {
                    const opacity = Math.min(0.8, Math.max(0.5, scrollPosition / 100));
                    navbar.css("background", `rgba(0, 0, 0, ${opacity})`);
                });
                lastScroll = now;
            }
        });
    }
}

// Initialize when document is ready
$(document).ready(function() {
    initializeComponents();
    setupEventListeners();
});
