// src/scripts/components/portfolio/PortfolioItem.js
import { eventBus } from "../../core/event-bus";
import { DevicePreview } from "../device-preview/DevicePreview";

export class PortfolioItem {
  constructor(data) {
    this.data = data;
    this.element = null;
    this.devicePreview = null;
  }

  async render() {
    try {
      this.element = document.createElement("div");
      this.element.className = "portfolio-item";
      this.element.setAttribute("data-project-id", this.data.id);

      this.element.innerHTML = this.getTemplate();

      await this.initializeDevicePreview();
      this.setupEventListeners();

      return this.element;
    } catch (error) {
      console.error(`Error rendering portfolio item ${this.data.id}:`, error);
      return this.renderError();
    }
  }

  getTemplate() {
    return `
            <div class="preview-section">
                <div class="preview-container" data-preview="${
                  this.data.id
                }"></div>
            </div>
            <div class="portfolio-content">
                <h3>${this.data.title}</h3>
                <div class="portfolio-links">
                    <a href="${this.data.url}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="site-link">
                        <span class="icon">🔗</span>
                        Visit Site
                    </a>
                </div>
                <p class="portfolio-description">${this.data.description}</p>
                <div class="tech-stack">
                    ${this.data.techStack
                      .map((tech) => `<span class="tech-tag">${tech}</span>`)
                      .join("")}
                </div>
            </div>
        `;
  }

  async initializeDevicePreview() {
    const previewContainer = this.element.querySelector(
      `[data-preview="${this.data.id}"]`
    );
    if (!previewContainer) return;

    try {
      this.devicePreview = new DevicePreview(previewContainer, {
        url: this.data.url,
        images: this.data.previewImages,
      });

      await this.devicePreview.initialize();
    } catch (error) {
      console.error(
        `Device preview initialization error for ${this.data.id}:`,
        error
      );
      previewContainer.innerHTML = this.getPreviewErrorTemplate();
    }
  }

  setupEventListeners() {
    const links = this.element.querySelectorAll("a");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        eventBus.emit("portfolioItemClick", {
          projectId: this.data.id,
          url: link.href,
        });
      });
    });
  }

  getPreviewErrorTemplate() {
    return `
            <div class="preview-error">
                <div class="error-content">
                    <h3>Preview Unavailable</h3>
                    <p>Unable to load preview. Please visit the site directly.</p>
                    <a href="${this.data.url}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="error-button">
                        Visit Website
                    </a>
                </div>
            </div>
        `;
  }

  renderError() {
    const errorElement = document.createElement("div");
    errorElement.className = "portfolio-item portfolio-item-error";
    errorElement.innerHTML = `
            <div class="error-content">
                <h3>Error Loading Project</h3>
                <p>Unable to load project details.</p>
            </div>
        `;
    return errorElement;
  }
}
