document.addEventListener('DOMContentLoaded', function() {
  // Initialize ripple effect if available
  try {
    $('.hero-container').ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04
    });
  } catch (e) {
    console.log('Ripples effect not supported');
  }

  // Update active nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});
