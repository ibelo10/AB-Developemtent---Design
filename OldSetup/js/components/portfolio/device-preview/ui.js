// assets/js/components/device-preview/ui.js
export class UIManager {
  constructor(container) {
    this.container = container;
    this.loadingProgress = 0;
    this.loadingInterval = null;
  }

  showLoading(frame) {
    let loader = frame.querySelector(".loading-indicator");
    if (!loader) {
      loader = document.createElement("div");
      loader.className = "loading-indicator";
      loader.innerHTML = `
          <div class="loading-spinner"></div>
          <p>Loading preview...</p>
        `;
      frame.appendChild(loader);
    }
  }

  hideLoading(frame) {
    const loader = frame.querySelector(".loading-indicator");
    if (loader) loader.remove();
  }

  showError(frame, previewUrl, onRetry) {
    const errorContainer = document.createElement("div");
    errorContainer.className = "preview-error";
    errorContainer.innerHTML = `
        <div class="error-content">
          <h3>Unable to Load Preview</h3>
          <p>The preview is currently unavailable. Please try again later or visit the full site.</p>
          <div class="error-actions">
            <button class="retry-button">Retry</button>
            <a href="${previewUrl}" target="_blank" rel="noopener noreferrer" class="error-button">
              Open in New Tab
            </a>
          </div>
        </div>
      `;

    const retryButton = errorContainer.querySelector(".retry-button");
    retryButton.addEventListener("click", onRetry);
    frame.appendChild(errorContainer);
  }

  updateLoadingProgress(progress) {
    this.container.style.setProperty("--loading-progress", `${progress}%`);
    if (progress === 100) {
      setTimeout(() => {
        this.container.classList.add("preview-loaded");
      }, 300);
    }
  }
}
