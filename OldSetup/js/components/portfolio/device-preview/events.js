// assets/js/components/device-preview/events.js
export class EventHandler {
  constructor(preview) {
    this.preview = preview;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.setupDeviceSwitching();
    this.setupTouchSupport();
  }

  setupDeviceSwitching() {
    const deviceButtons =
      this.preview.container.querySelectorAll(".device-button");
    deviceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const device = button.dataset.device;
        if (device) this.preview.switchDevice(device);
      });
    });
  }

  setupTouchSupport() {
    if (!("ontouchstart" in window)) return;

    let touchStartX = 0;
    let touchStartY = 0;

    this.preview.container.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    this.preview.container.addEventListener(
      "touchmove",
      (e) => {
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const deltaX = touchStartX - touchX;
        const deltaY = touchStartY - touchY;

        const activeFrame = this.preview.getActiveFrame();
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
}
