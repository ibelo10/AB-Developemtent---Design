document.addEventListener("DOMContentLoaded", function () {
  // Initialize ripple effect
  initializeRipples();

  // Initialize navigation
  initializeNavigation();

  // Initialize interactions
  initializeInteractions();

  // Initialize scroll animations
  initializeScrollAnimations();
});

function initializeRipples() {
  try {
    // Apply ripples effect to the hero container
    $(".hero-container").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
      interactive: true,
      crossOrigin: "",
      imageUrl: "/assets/images/laptop-bg.jpg",
    });

    // Add random ripple drops every 3 seconds
    setInterval(() => {
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
  const currentPath = window.location.pathname;
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-links a");
  let lastScroll = 0;

  // Highlight active nav link
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  // Show/hide navbar on scroll
  window.addEventListener("scroll", debounce(() => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      navbar.style.transform = "translateY(0)";
      return;
    }

    if (currentScroll > lastScroll) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  }, 100));
}

function initializeInteractions() {
  const hero = document.querySelector(".hero-container");

  // Add hover effect to hero container
  hero.addEventListener("mousemove", (e) => {
    const { left, top, width, height } = hero.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    hero.style.setProperty("--mouse-x", x);
    hero.style.setProperty("--mouse-y", y);
  });

  // Enhance hover interactivity with CSS variables
  hero.style.transition = "transform 0.2s ease-in-out";
  hero.addEventListener("mouseenter", () => {
    hero.style.transform = "scale(1.05)";
  });
  hero.addEventListener("mouseleave", () => {
    hero.style.transform = "scale(1)";
  });
}

function initializeScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".fade-in-element").forEach((element) => {
    observer.observe(element);
  });
}

// Debounce utility function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}