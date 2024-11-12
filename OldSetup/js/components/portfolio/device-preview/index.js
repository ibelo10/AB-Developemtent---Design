// assets/js/components/device-preview/index.js
import { DevicePreviewConfig } from "./config.js";
import { IframeManager } from "./iframe.js";
import { UIManager } from "./ui.js";
import { EventHandler } from "./events.js";

export class DevicePreview {
  constructor(container, config = {}) {
    if (!container) throw new Error("Container element is required");

    this.config = { ...DevicePreviewConfig, ...config };
    this.container = container;
    this.ui = new UIManager(container);
    this.state = {
      currentDevice: "desktop",
      loadAttempts: {},
      isInitialized: false,
    };

    this.init();
  }

  async init() {
    try {
      await this.initializeFrames();
      new EventHandler(this);
      this.state.isInitialized = true;
    } catch (error) {
      console.error("Initialization error:", error);
      this.showError();
    }
  }

  async initializeFrames() {
    this.container.innerHTML = `
      <div class="preview-controls">
        <div class="device-buttons">
          <button class="device-button active" data-device="desktop">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            Desktop
          </button>
          <button class="device-button" data-device="tablet">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            Tablet
          </button>
          <button class="device-button" data-device="mobile">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="6" y="2" width="12" height="20" rx="2" />
              <line x1="10" y1="18" x2="14" y2="18" />
            </svg>
            Mobile
          </button>
        </div>
      </div>
      <div class="preview-frames"></div>
    `;

    const framesContainer = this.container.querySelector(".preview-frames");

    // Create frames for each device type
    for (const device of Object.keys(this.config.devices)) {
      const frame = document.createElement("div");
      frame.className = `device-frame ${device}${
        device === this.state.currentDevice ? " active" : ""
      }`;

      const iframe = IframeManager.create(device);
      frame.appendChild(iframe);
      framesContainer.appendChild(frame);

      this.state.loadAttempts[device] = 0;

      if (device === this.state.currentDevice) {
        await this.loadFrame(iframe, frame, device);
      }
    }
  }

  async loadFrame(iframe, frame, device) {
    this.ui.showLoading(frame);

    try {
      await IframeManager.load(
        iframe,
        this.config.previewUrl,
        this.config.loadTimeout
      );
      IframeManager.updateSize(iframe, device, this.config.devices);
      this.handleFrameSuccess(iframe, frame);
    } catch (error) {
      await this.handleFrameError(iframe, frame, device);
    }
  }

  handleFrameSuccess(iframe, frame) {
    iframe.classList.add("loaded");
    this.ui.hideLoading(frame);
    this.ui.updateLoadingProgress(100);
  }

  async handleFrameError(iframe, frame, device) {
    const attempts = this.state.loadAttempts[device] || 0;

    if (attempts < this.config.retryAttempts) {
      this.state.loadAttempts[device] = attempts + 1;
      await new Promise((resolve) =>
        setTimeout(resolve, this.config.retryDelay)
      );
      return this.loadFrame(iframe, frame, device);
    }

    this.ui.hideLoading(frame);
    this.ui.showError(frame, this.config.previewUrl, () =>
      this.loadFrame(iframe, frame, device)
    );
  }

  switchDevice(device) {
    if (!this.config.devices[device]) return;

    const buttons = this.container.querySelectorAll(".device-button");
    const frames = this.container.querySelectorAll(".device-frame");

    buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.device === device);
    });

    frames.forEach((frame) => {
      const isTarget = frame.classList.contains(device);
      frame.classList.toggle("active", isTarget);

      if (isTarget) {
        const iframe = frame.querySelector(".preview-frame");
        if (iframe && !iframe.src) {
          this.loadFrame(iframe, frame, device);
        }
      }
    });

    this.state.currentDevice = device;
  }

  getActiveFrame() {
    return this.container.querySelector(".device-frame.active");
  }

  showError() {
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
