class QuantumParticle {
    constructor(canvas) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.connections = [];
      this.maxConnections = 3;
      this.connectionDistance = 150;
      this.color = `rgba(0, 240, 255, ${Math.random() * 0.5 + 0.25})`;
    }
  
    update(canvas) {
      this.x += this.speedX;
      this.y += this.speedY;
  
      // Boundary checks with smooth wrapping
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
  
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  class QuantumField {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.particles = [];
      this.mousePosition = { x: 0, y: 0 };
      this.isMouseOver = false;
      this.particleCount = 100;
      
      this.init();
      this.animate();
      this.setupEventListeners();
    }
  
    init() {
      // Setup canvas
      document.getElementById('particles').appendChild(this.canvas);
      this.resize();
  
      // Create particles
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(new QuantumParticle(this.canvas));
      }
    }
  
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  
    setupEventListeners() {
      window.addEventListener('resize', () => this.resize());
      
      this.canvas.addEventListener('mousemove', (e) => {
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
        this.isMouseOver = true;
      });
  
      this.canvas.addEventListener('mouseout', () => {
        this.isMouseOver = false;
      });
    }
  
    drawConnections() {
      for (let i = 0; i < this.particles.length; i++) {
        const particle = this.particles[i];
        particle.connections = [];
  
        for (let j = i + 1; j < this.particles.length; j++) {
          const other = this.particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < particle.connectionDistance &&
              particle.connections.length < particle.maxConnections &&
              other.connections.length < other.maxConnections) {
            
            particle.connections.push(other);
            other.connections.push(particle);
  
            const opacity = (1 - distance / particle.connectionDistance) * 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(other.x, other.y);
            this.ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
            this.ctx.stroke();
          }
        }
      }
    }
  
    drawMouseConnections() {
      if (!this.isMouseOver) return;
  
      for (const particle of this.particles) {
        const dx = particle.x - this.mousePosition.x;
        const dy = particle.y - this.mousePosition.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
  
        if (distance < particle.connectionDistance * 1.5) {
          const opacity = (1 - distance / (particle.connectionDistance * 1.5)) * 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(this.mousePosition.x, this.mousePosition.y);
          this.ctx.strokeStyle = `rgba(123, 47, 247, ${opacity})`;
          this.ctx.stroke();
        }
      }
    }
  
    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      // Update and draw particles
      for (const particle of this.particles) {
        particle.update(this.canvas);
        particle.draw(this.ctx);
      }
  
      // Draw connections
      this.drawConnections();
      this.drawMouseConnections();
  
      requestAnimationFrame(() => this.animate());
    }
  }
  
  // Initialize quantum field when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    new QuantumField();
  });