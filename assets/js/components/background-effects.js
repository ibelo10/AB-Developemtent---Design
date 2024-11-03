// assets/js/components/background-effects.js

export function initializeBackgroundEffects(pageName) {
  switch (pageName) {
    case "portfolio":
      initializeParticleBackground();
      break;
    case "contact":
      initializeWaveBackground();
      break;
    default:
      initializeRippleBackground();
  }
}

// Ripple effect (similar to home page)
function initializeRippleBackground() {
  try {
    $(".page-container").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
    });

    // Handle window resize
    $(window).on("resize", function () {
      try {
        $(".page-container").ripples("updateSize");
      } catch (e) {
        console.error("Ripples resize error:", e);
      }
    });
  } catch (e) {
    console.error("Ripples init error:", e);
  }
}

// Particle effect
function initializeParticleBackground() {
  const canvas = document.createElement("canvas");
  canvas.className = "background-canvas";
  document.querySelector(".page-container").prepend(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 5 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.color = "#2ecc71";
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    requestAnimationFrame(animate);
  }

  resizeCanvas();
  init();
  animate();

  window.addEventListener("resize", () => {
    resizeCanvas();
    init();
  });
}

// Wave background effect
function initializeWaveBackground() {
  const canvas = document.createElement("canvas");
  canvas.className = "background-canvas";
  document.querySelector(".page-container").prepend(canvas);

  const ctx = canvas.getContext("2d");
  let time = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawWave(offset) {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    for (let i = 0; i < canvas.width; i++) {
      const y = Math.sin(i * 0.02 + time + offset) * 50;
      ctx.lineTo(i, canvas.height / 2 + y);
    }

    ctx.strokeStyle = "#2ecc7133";
    ctx.stroke();
  }

  function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 3; i++) {
      drawWave(i * 0.5);
    }

    time += 0.05;
    requestAnimationFrame(animate);
  }

  resizeCanvas();
  animate();

  window.addEventListener("resize", resizeCanvas);
}
