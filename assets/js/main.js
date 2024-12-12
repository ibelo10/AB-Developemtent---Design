// main.js
document.addEventListener("DOMContentLoaded", function () {
  // Initialize ripple effect with error handling
  initializeRipples();

  // Initialize navigation
  initializeNavigation();

  // Initialize scroll animations
  initializeScrollAnimations();

  // Initialize performance optimizations
  initializePerformance();
});

function initializeRipples() {
  try {
    $(".hero-container").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
      interactive: true,
      crossOrigin: "",
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

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Navbar visibility on scroll
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
      // Scrolling down & not focusing on navbar
      navbar.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      navbar.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  });
}

function initializeScrollAnimations() {
  // Intersection Observer for fade-in animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  // Observe all animate-on-scroll elements
  document.querySelectorAll(".animate-on-scroll").forEach((element) => {
    observer.observe(element);
  });
}

function initializePerformance() {
  // Lazy load images
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  // Preload critical resources
  const preloadLinks = [
    "/assets/images/ABLogo.png",
    // Add other critical resources here
  ];

  preloadLinks.forEach((link) => {
    const preloadLink = document.createElement("link");
    preloadLink.href = link;
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    document.head.appendChild(preloadLink);
  });
}

// Utility functions
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

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
