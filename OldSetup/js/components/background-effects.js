// assets/js/components/background-effects.js

export function initializeBackgroundEffects(pageName) {
  const backgroundContainer = document.createElement("div");
  backgroundContainer.className = "background-effects-container";
  document.body.insertBefore(backgroundContainer, document.body.firstChild);

  switch (pageName) {
    case "portfolio":
      initializeParticleBackground(backgroundContainer);
      break;
    case "contact":
      initializeWaveBackground(backgroundContainer);
      break;
    default:
      initializeRippleBackground(backgroundContainer);
  }
}

function initializeParticleBackground(container) {
  const canvas = document.createElement("canvas");
  canvas.className = "background-canvas";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.baseX = this.x;
      this.baseY = this.y;
      this.size = Math.random() * 3 + 1;
      this.density = Math.random() * 30 + 1;
      this.color = "#2ecc71";
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density;
      let directionY = forceDirectionY * force * this.density;

      if (distance < mouse.radius) {
        this.x -= directionX;
        this.y -= directionY;
      } else {
        if (this.x !== this.baseX) {
          let dx = this.x - this.baseX;
          this.x -= dx / 10;
        }
        if (this.y !== this.baseY) {
          let dy = this.y - this.baseY;
          this.y -= dy / 10;
        }
      }
    }
  }

  function init() {
    particles = [];
    for (let i = 0; i < 150; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animate);
  }

  // Mouse interaction
  container.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
  });

  container.addEventListener("mouseleave", () => {
    mouse.x = undefined;
    mouse.y = undefined;
  });

  resizeCanvas();
  init();
  animate();

  window.addEventListener("resize", () => {
    resizeCanvas();
    init();
  });
}

function initializeWaveBackground(container) {
  const canvas = document.createElement("canvas");
  canvas.className = "background-canvas";
  container.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let time = 0;
  let mousePos = { x: 0, y: 0 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawWave(offset, amplitude) {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);

    for (let i = 0; i < canvas.width; i++) {
      const distance = Math.abs(i - mousePos.x);
      const impact = Math.max(0, 1 - distance / 200);
      const heightModifier = impact * 50;

      const y =
        Math.sin(i * 0.02 + time + offset) * amplitude +
        Math.sin(i * 0.02 + time) * heightModifier;
      ctx.lineTo(i, canvas.height / 2 + y);
    }

    ctx.strokeStyle = "#2ecc7133";
    ctx.stroke();
  }

  function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 3; i++) {
      drawWave(i * 0.5, 50);
    }

    time += 0.05;
    requestAnimationFrame(animate);
  }

  container.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  resizeCanvas();
  animate();

  window.addEventListener("resize", resizeCanvas);
}

function initializeRippleBackground(container) {
  try {
    $(container).ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
      interactive: true,
      crossOrigin: "",
    });

    // Add automatic ripples
    setInterval(() => {
      const x = Math.random() * container.offsetWidth;
      const y = Math.random() * container.offsetHeight;
      const dropRadius = 20;
      const strength = 0.04 + Math.random() * 0.04;

      $(container).ripples("drop", x, y, dropRadius, strength);
    }, 3000);
  } catch (e) {
    console.error("Ripples effect error:", e);
  }
}
