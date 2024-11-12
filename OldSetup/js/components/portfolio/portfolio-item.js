// assets/js/components/portfolio/portfolio-item.js
import { DevicePreview } from "../device-preview/index.js";

export class PortfolioItem {
  constructor(data) {
    this.data = data;
  }

  render() {
    const element = document.createElement("div");
    element.className = "portfolio-item";

    element.innerHTML = `
      <div class="preview-section">
        <div class="preview-container">
          <!-- Device preview will be initialized here -->
        </div>
      </div>
      <div class="preview-info">
        <h2 class="site-title">${this.data.title}</h2>
        <div class="site-links">
          <a href="${
            this.data.url
          }" target="_blank" rel="noopener noreferrer" class="site-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Visit Site
          </a>
        </div>
        <p class="preview-description">${this.data.description}</p>
        <div class="tech-stack">
          ${this.data.techStack
            .map((tech) => `<span class="tech-tag">${tech}</span>`)
            .join("")}
        </div>
      </div>
    `;

    // Initialize device preview
    const previewContainer = element.querySelector(".preview-container");
    if (previewContainer) {
      // Wait for next tick to ensure container is in DOM
      setTimeout(() => {
        try {
          new DevicePreview(previewContainer, {
            previewUrl: this.data.url,
          });
        } catch (error) {
          console.error("Failed to initialize device preview:", error);
          previewContainer.innerHTML = `
            <div class="preview-error">
              <div class="error-content">
                <h3>Preview Unavailable</h3>
                <p>Unable to load preview. Please try visiting the site directly.</p>
                <a href="${this.data.url}" target="_blank" rel="noopener noreferrer" class="error-button">
                  Visit Website
                </a>
              </div>
            </div>
          `;
        }
      }, 0);
    }

    return element;
  }
}
