// src/scripts/utils/ripple.js
export class RippleEffect {
  constructor(options = {}) {
    this.options = {
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
      ...options,
    };
  }

  init(element) {
    if (!element) return;

    this.element = element;
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.setupCanvas();
    this.setupEventListeners();

    requestAnimationFrame(() => this.render());
  }

  setupCanvas() {
    const { width, height } = this.element.getBoundingClientRect();

    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.element.appendChild(this.canvas);

    this.createRippleTexture();
  }

  createRippleTexture() {
    // Initialize ripple data
    this.ripples = [];

    // Create initial texture
    this.imageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    );
  }

  addRipple(x, y) {
    const ripple = {
      x: x * window.devicePixelRatio,
      y: y * window.devicePixelRatio,
      radius: this.options.dropRadius,
      strength: 0.5,
      age: 0,
    };

    this.ripples.push(ripple);
  }

  updateRipples() {
    this.ripples = this.ripples.filter((ripple) => {
      ripple.age++;
      ripple.strength *= 0.95;
      return ripple.strength > 0.01;
    });
  }

  setupEventListeners() {
    this.element.addEventListener("mousemove", (e) => {
      const rect = this.element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.addRipple(x, y);
    });

    window.addEventListener("resize", () => {
      this.setupCanvas();
    });
  }

  render() {
    this.updateRipples();

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw ripples
    this.ripples.forEach((ripple) => {
      this.ctx.beginPath();
      this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${ripple.strength})`;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.render());
  }

  destroy() {
    if (this.canvas) {
      this.canvas.remove();
    }
  }
}
