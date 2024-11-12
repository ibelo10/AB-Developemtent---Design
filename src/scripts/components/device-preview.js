// assets/js/components/device-preview.js

export class DevicePreview {
  constructor() {
    // DOM Elements
    this.container = document.querySelector(".preview-container");
    this.deviceButtons = document.querySelectorAll(".device-button");
    this.deviceFrames = document.querySelectorAll(".device-frame");
    this.controls = document.querySelector(".preview-controls");

    // Configuration
    this.config = {
      previewUrl: "https://msvivalasvegas.org",
      devices: {
        desktop: { width: "100%", height: "100%" },
        tablet: { width: "768px", height: "1024px" },
        mobile: { width: "375px", height: "812px" },
      },
      loadTimeout: 15000, // 15 seconds
      retryAttempts: 3,
      retryDelay: 2000, // 2 seconds
    };

    // State
    this.state = {
      currentDevice: "desktop",
      loadingProgress: 0,
      loadingInterval: null,
      loadAttempts: {},
      isInitialized: false,
    };

    this.init();
  }

  async init() {
    try {
      console.log("Initializing device preview...");
      await this.initializeFrames();
      this.setupEventListeners();
      this.initializeActiveFrame();
      this.state.isInitialized = true;
    } catch (error) {
      console.error("Initialization error:", error);
      this.handleInitializationError();
    }
  }

  async initializeFrames() {
    for (const frame of this.deviceFrames) {
      const device = frame.dataset.device;
      if (!device) continue;

      const container = frame.querySelector(".iframe-container");
      if (!container) continue;

      // Create and configure iframe
      const iframe = this.createIframe();
      container.appendChild(iframe);

      // Setup frame-specific state
      this.state.loadAttempts[device] = 0;

      // Initialize if active frame
      if (frame.classList.contains("active")) {
        await this.loadFrame(iframe, frame);
      }
    }
  }

  createIframe() {
    const iframe = document.createElement("iframe");
    iframe.className = "preview-frame";

    // Security attributes
    iframe.setAttribute(
      "sandbox",
      [
        "allow-same-origin",
        "allow-scripts",
        "allow-popups",
        "allow-forms",
      ].join(" ")
    );

    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("referrerpolicy", "no-referrer");

    return iframe;
  }

  setupEventListeners() {
    // Device switching
    this.deviceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const device = button.dataset.device;
        if (device) this.switchDevice(device);
      });
    });

    // Refresh button
    this.setupRefreshButton();

    // Keyboard shortcuts
    this.setupKeyboardShortcuts();

    // Touch support
    if ("ontouchstart" in window) {
      this.setupTouchSupport();
    }

    // Error handling
    window.addEventListener(
      "error",
      (e) => {
        if (e.target.tagName === "IFRAME") {
          this.handleFrameError(e.target);
        }
      },
      true
    );
  }

  setupRefreshButton() {
    const refreshButton = document.createElement("button");
    refreshButton.className = "refresh-button";
    refreshButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M13.666 2.334A7.95 7.95 0 008 0C3.582 0 0 3.582 0 8s3.582 8 8 8c3.866 0 7.11-2.746 7.84-6.4h-2.174c-.667 2.295-2.776 4-5.333 4A5.331 5.331 0 012.667 8 5.331 5.331 0 018 2.667c1.467 0 2.793.587 3.773 1.533L9.333 6.667H16V0l-2.334 2.334z"/>
        </svg>
        Refresh
      `;

    refreshButton.addEventListener("click", () => this.refreshActiveFrame());
    this.controls.appendChild(refreshButton);
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      if (e.altKey) {
        const shortcuts = {
          1: "desktop",
          2: "tablet",
          3: "mobile",
          r: "refresh",
        };

        const action = shortcuts[e.key];
        if (action === "refresh") {
          this.refreshActiveFrame();
        } else if (action) {
          this.switchDevice(action);
        }
      }
    });
  }

  setupTouchSupport() {
    let touchStartX = 0;
    let touchStartY = 0;

    this.container.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    this.container.addEventListener(
      "touchmove",
      (e) => {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchStartX - touchX;
        const deltaY = touchStartY - touchY;

        const activeFrame = this.getActiveFrame();
        const iframe = activeFrame?.querySelector(".preview-frame");

        if (iframe?.contentWindow) {
          iframe.contentWindow.scrollBy(deltaX, deltaY);
        }

        touchStartX = touchX;
        touchStartY = touchY;
      },
      { passive: true }
    );
  }

  async switchDevice(device) {
    if (!this.config.devices[device]) return;

    // Update UI state
    this.deviceButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.device === device);
    });

    this.deviceFrames.forEach((frame) => {
      const isTarget = frame.dataset.device === device;
      frame.classList.toggle("active", isTarget);

      if (isTarget) {
        const iframe = frame.querySelector(".preview-frame");
        if (iframe) {
          this.updateFrameSize(iframe, device);
          if (!iframe.src) {
            this.loadFrame(iframe, frame);
          }
        }
      }
    });

    this.state.currentDevice = device;
  }

  updateFrameSize(iframe, device) {
    const size = this.config.devices[device];
    iframe.style.width = size.width;
    iframe.style.height = size.height;
  }

  async loadFrame(iframe, frame) {
    const device = frame.dataset.device;
    if (!device) return;

    this.showLoading(frame);
    this.startLoadingProgress();

    try {
      iframe.src = this.config.previewUrl;

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Loading timeout"));
        }, this.config.loadTimeout);

        iframe.onload = () => {
          clearTimeout(timeout);
          resolve();
        };

        iframe.onerror = () => {
          clearTimeout(timeout);
          reject(new Error("Loading failed"));
        };
      });

      this.handleFrameSuccess(iframe, frame);
    } catch (error) {
      await this.handleFrameError(iframe, frame, device);
    }
  }

  refreshActiveFrame() {
    const activeFrame = this.getActiveFrame();
    if (!activeFrame) return;

    const iframe = activeFrame.querySelector(".preview-frame");
    if (iframe) {
      this.loadFrame(iframe, activeFrame);
    }
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

  startLoadingProgress() {
    if (this.state.loadingInterval) {
      clearInterval(this.state.loadingInterval);
    }

    this.state.loadingProgress = 0;
    this.updateLoadingProgress(0);

    this.state.loadingInterval = setInterval(() => {
      this.state.loadingProgress = Math.min(
        this.state.loadingProgress + 10,
        90
      );
      this.updateLoadingProgress(this.state.loadingProgress);

      if (this.state.loadingProgress >= 90) {
        clearInterval(this.state.loadingInterval);
      }
    }, 200);
  }

  updateLoadingProgress(progress) {
    this.container.style.setProperty("--loading-progress", `${progress}%`);
  }

  handleFrameSuccess(iframe, frame) {
    iframe.classList.add("loaded");
    this.hideLoading(frame);
    this.updateLoadingProgress(100);

    setTimeout(() => {
      this.container.classList.add("preview-loaded");
    }, 300);
  }

  async handleFrameError(iframe, frame, device) {
    const attempts = this.state.loadAttempts[device] || 0;

    if (attempts < this.config.retryAttempts) {
      this.state.loadAttempts[device] = attempts + 1;
      await new Promise((resolve) =>
        setTimeout(resolve, this.config.retryDelay)
      );
      return this.loadFrame(iframe, frame);
    }

    this.hideLoading(frame);
    this.showErrorMessage(frame);
  }

  showErrorMessage(frame) {
    const errorContainer = document.createElement("div");
    errorContainer.className = "preview-error";
    errorContainer.innerHTML = `
        <div class="error-content">
          <h3>Unable to Load Preview</h3>
          <p>The preview is currently unavailable. Please try again later or visit the full site.</p>
          <div class="error-actions">
            <button class="retry-button" onclick="window.devicePreview.refreshActiveFrame()">
              Retry
            </button>
            <a href="${this.config.previewUrl}" target="_blank" rel="noopener noreferrer" class="error-button">
              Open in New Tab
            </a>
          </div>
        </div>
      `;

    frame.appendChild(errorContainer);
  }

  getActiveFrame() {
    return document.querySelector(".device-frame.active");
  }

  handleInitializationError() {
    this.container.innerHTML = `
        <div class="preview-error">
          <div class="error-content">
            <h3>Preview Unavailable</h3>
            <p>Unable to initialize the preview. Please try again later.</p>
            <a href="${this.config.previewUrl}" target="_blank" rel="noopener noreferrer" class="error-button">
              Visit Website
            </a>
          </div>
        </div>
      `;
  }
}

// Initialize when imported
export default DevicePreview;
