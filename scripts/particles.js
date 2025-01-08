document.addEventListener("DOMContentLoaded", () => {
    class QuantumParticle {
        constructor(container, options = {}) {
            this.container = container;
            this.options = {
                link: null,
                tooltip: null,
                interactive: false,
                ...options,
            };

            this.particle = document.createElement("div");
            this.tooltip = document.createElement("div");
            this.initializeParticle();
            this.addEventListeners();
        }

        initializeParticle() {
            // Particle base styling
            this.particle.className = "quantum-particle";
            const size = Math.random() * 6 + 4; // Random size
            this.particle.style.width = `${size}px`;
            this.particle.style.height = `${size}px`;
            this.particle.style.position = "absolute";

            // Random position
            this.particle.style.left = `${Math.random() * window.innerWidth}px`;
            this.particle.style.top = `${Math.random() * window.innerHeight}px`;

            this.container.appendChild(this.particle);

            if (this.options.interactive) {
                // Add hover tooltip
                this.tooltip.className = "particle-tooltip";
                this.tooltip.textContent = this.options.tooltip;
                this.container.appendChild(this.tooltip);
            }
        }

        addEventListeners() {
            if (this.options.interactive) {
                this.particle.addEventListener("mouseover", (e) => {
                    const rect = this.particle.getBoundingClientRect();
                    this.tooltip.style.left = `${rect.left + rect.width / 2}px`;
                    this.tooltip.style.top = `${rect.top - 10}px`;
                    this.tooltip.style.opacity = 1;
                });

                this.particle.addEventListener("mouseout", () => {
                    this.tooltip.style.opacity = 0;
                });

                this.particle.addEventListener("click", () => {
                    if (this.options.link) {
                        window.location.href = this.options.link;
                    }
                });
            }
        }
    }

    class ParticleSystem {
        constructor() {
            this.container = document.getElementById("particles");
            this.particles = [];
            this.initializeParticles();
        }

        initializeParticles() {
            // Create some interactive particles with links
            const interactiveParticles = [
                { link: "#portfolio", tooltip: "View Portfolio" },
                { link: "#services", tooltip: "Explore Services" },
                { link: "#contact", tooltip: "Contact Us" },
                { link: "#lo-qos", tooltip: "Learn About Lo-QOS" },
            ];

            interactiveParticles.forEach((config) => {
                this.particles.push(
                    new QuantumParticle(this.container, {
                        interactive: true,
                        link: config.link,
                        tooltip: config.tooltip,
                    })
                );
            });

            // Add some static particles
            for (let i = 0; i < 40; i++) {
                this.particles.push(new QuantumParticle(this.container));
            }
        }
    }

    new ParticleSystem();
});
