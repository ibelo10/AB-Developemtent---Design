document.addEventListener("DOMContentLoaded", function () {
  // Initialize ripple effect
  initializeRipples();

  // Initialize navigation
  initializeNavigation();

  // Initialize interactions
  initializeInteractions();
});

function initializeRipples() {
  try {
    $(".hero-container").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
      interactive: true,
      crossOrigin: "",
      imageUrl: "/assets/images/laptop-bg.jpg",
    });

    // Add automatic ripples
    setInterval(function () {
      const x = Math.random() * $(".hero-container").outerWidth();
      const y = Math.random() * $(".hero-container").outerHeight();
      const dropRadius = 20;
      const strength = 0.04 + Math.random() * 0.04;

      $(".hero-container").ripples("drop", x, y, dropRadius, strength);
    }, 3000);
  } catch (e) {
    console.warn("Ripples effect not supported:", e);
  }
}

function initializeNavigation() {
  // Update active nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  // Handle navbar visibility on scroll
  let lastScroll = 0;
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      navbar.style.transform = "translateY(0)";
      return;
    }

    if (
      currentScroll > lastScroll &&
      !navbar.contains(document.activeElement)
    ) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  });
}

function initializeInteractions() {
  // Add hover effect for hero container
  const hero = document.querySelector(".hero-container");

  hero.addEventListener("mousemove", (e) => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    hero.style.setProperty("--mouse-x", x);
    hero.style.setProperty("--mouse-y", y);
  });
}

// Utility function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
