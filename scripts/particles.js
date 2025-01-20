class QuantumParticle {
    constructor(canvas, config = {}) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * (config.isClickable ? 3 : 2);
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.connections = [];
      this.maxConnections = 3;
      this.connectionDistance = 150;
      this.isClickable = config.isClickable || false;
      this.blogLink = config.blogLink || null;
      this.blogTitle = config.blogTitle || null;
      this.blogDate = config.blogDate || null;
      this.color = this.isClickable ? 
        `rgba(255, 41, 117, ${Math.random() * 0.5 + 0.5})` : 
        `rgba(0, 240, 255, ${Math.random() * 0.5 + 0.25})`;
      this.originalSize = this.size;
      this.isHovered = false;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.05;
    }
  
    update(canvas, mouseX, mouseY, time) {
      this.x += this.speedX;
      this.y += this.speedY;
  
      // Boundary checks with smooth wrapping
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
  
      // Update hover state and size
      if (this.isClickable) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        this.isHovered = distance < this.size + 15;
        
        // Pulse effect for clickable particles
        const pulse = Math.sin(this.pulsePhase + time * this.pulseSpeed) * 0.5 + 1;
        this.size = this.isHovered ? 
          this.originalSize * 2.5 : 
          this.originalSize * (1 + pulse * 0.3);
      }
    }
  
    draw(ctx) {
      // Particle glow effect
      const gradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, this.size * 2
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
  
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
  
      // Draw blog information if hovered
      if (this.isHovered && this.blogTitle) {
        this.drawBlogTooltip(ctx);
      }
    }
  
    drawBlogTooltip(ctx) {
      const padding = 10;
      const fontSize = 14;
      ctx.font = `${fontSize}px Inter`;
      
      // Measure text for background
      const titleWidth = ctx.measureText(this.blogTitle).width;
      const dateWidth = this.blogDate ? ctx.measureText(this.blogDate).width : 0;
      const maxWidth = Math.max(titleWidth, dateWidth);
      
      // Draw background with blur effect
      ctx.save();
      ctx.shadowColor = 'rgba(0, 240, 255, 0.3)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = 'rgba(10, 11, 30, 0.9)';
      const tooltipHeight = this.blogDate ? 50 : 30;
      const tooltipX = this.x - maxWidth/2 - padding;
      const tooltipY = this.y - 40;
      
      // Rounded rectangle background
      this.roundRect(
        ctx,
        tooltipX,
        tooltipY,
        maxWidth + padding * 2,
        tooltipHeight,
        5
      );
  
      // Draw title and date
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(this.blogTitle, this.x, tooltipY + 20);
      
      if (this.blogDate) {
        ctx.font = `12px Inter`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(this.blogDate, this.x, tooltipY + 35);
      }
      
      ctx.restore();
    }
  
    roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
    }
  
    containsPoint(x, y) {
      const dx = this.x - x;
      const dy = this.y - y;
      return Math.sqrt(dx * dx + dy * dy) <= this.size * 2;
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
      this.time = 0;
      this.blogPosts = [];
      
      this.init();
      this.loadBlogPosts();
      this.animate();
      this.setupEventListeners();
    }
  
    async loadBlogPosts() {
      try {
        // First try to load from the /blog directory
        const response = await fetch('/blog/posts.json');
        if (!response.ok) throw new Error('Blog posts not found');
        
        const posts = await response.json();
        this.blogPosts = posts.map(post => ({
          title: post.title,
          link: `/blog/${post.slug}`,
          date: new Date(post.date).toLocaleDateString()
        }));
      } catch (error) {
        console.warn('Failed to load blog posts, falling back to directory scan');
        try {
          // Fallback to scanning the blog directory
          const blogFiles = await this.scanBlogDirectory();
          this.blogPosts = blogFiles.map(file => ({
            title: this.formatBlogTitle(file),
            link: `/blog/${file}`,
            date: null
          }));
        } catch (fallbackError) {
          console.error('Error loading blog posts:', fallbackError);
          // Use sample posts as final fallback
          this.blogPosts = [
            { 
              title: "Quantum Computing Innovations", 
              link: "/blog/quantum-computing",
              date: "2025-01-20"
            },
            { 
              title: "Lo-QOS Development Updates", 
              link: "/blog/lo-qos-updates",
              date: "2025-01-15"
            }
          ];
        }
      }
      
      // Create particles for blog posts
      this.createBlogParticles();
    }
  
    formatBlogTitle(filename) {
      return filename
        .replace(/\.html$/, '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  
    async scanBlogDirectory() {
      const response = await fetch('/blog/');
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = Array.from(doc.querySelectorAll('a'));
      return links
        .map(link => link.href)
        .filter(href => href.endsWith('.html'))
        .map(href => href.split('/').pop());
    }
  
    init() {
      document.getElementById('particles').appendChild(this.canvas);
      this.resize();
  
      // Create regular particles
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(new QuantumParticle(this.canvas));
      }
    }
  
    createBlogParticles() {
      // Add blog particles
      this.blogPosts.forEach(post => {
        this.particles.push(new QuantumParticle(this.canvas, {
          isClickable: true,
          blogLink: post.link,
          blogTitle: post.title,
          blogDate: post.date
        }));
      });
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
        this.canvas.style.cursor = this.getClickableParticle(e.clientX, e.clientY) ? 'pointer' : 'default';
      });
  
      this.canvas.addEventListener('mouseout', () => {
        this.isMouseOver = false;
      });
  
      this.canvas.addEventListener('click', (e) => {
        const clickedParticle = this.getClickableParticle(e.clientX, e.clientY);
        if (clickedParticle && clickedParticle.blogLink) {
          window.location.href = clickedParticle.blogLink;
        }
      });
    }
  
    getClickableParticle(x, y) {
      return this.particles.find(p => p.isClickable && p.containsPoint(x, y));
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
            
            // Create gradient for connections
            const gradient = this.ctx.createLinearGradient(
              particle.x, particle.y, other.x, other.y
            );
            
            if (particle.isClickable || other.isClickable) {
              gradient.addColorStop(0, `rgba(255, 41, 117, ${opacity})`);
              gradient.addColorStop(1, `rgba(123, 47, 247, ${opacity})`);
            } else {
              gradient.addColorStop(0, `rgba(0, 240, 255, ${opacity})`);
              gradient.addColorStop(1, `rgba(0, 240, 255, ${opacity})`);
            }
  
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(other.x, other.y);
            this.ctx.strokeStyle = gradient;
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
          
          // Create gradient for mouse connections
          const gradient = this.ctx.createLinearGradient(
            particle.x, particle.y,
            this.mousePosition.x, this.mousePosition.y
          );
          
          if (particle.isClickable) {
            gradient.addColorStop(0, `rgba(255, 41, 117, ${opacity})`);
            gradient.addColorStop(1, `rgba(123, 47, 247, ${opacity})`);
          } else {
            gradient.addColorStop(0, `rgba(0, 240, 255, ${opacity})`);
            gradient.addColorStop(1, `rgba(0, 240, 255, ${opacity * 0.5})`);
          }
  
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(this.mousePosition.x, this.mousePosition.y);
          this.ctx.strokeStyle = gradient;
          this.ctx.stroke();
        }
      }
    }
  
    animate() {
      this.time += 0.016; // Approximate for 60fps
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      // Update and draw particles
      for (const particle of this.particles) {
        particle.update(this.canvas, this.mousePosition.x, this.mousePosition.y, this.time);
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