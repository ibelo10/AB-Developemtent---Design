document.addEventListener("DOMContentLoaded", () => {
  const previewContainer = document.querySelector(".preview-container");
  const iframe = document.querySelector(".live-preview");
  const deviceButtons = document.querySelectorAll(".device-button");
  const scaleButtons = document.querySelectorAll(".scale-button");

  // Device frame sizes
  const deviceSizes = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: "768px", height: "1024px" },
    mobile: { width: "375px", height: "812px" },
  };

  // Handle device switching
  deviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const device = button.dataset.device;

      // Update active button
      deviceButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update active frame
      document.querySelectorAll(".device-frame").forEach((frame) => {
        frame.classList.remove("active");
      });
      document.querySelector(`.device-frame.${device}`).classList.add("active");

      // Set iframe size based on device
      const size = deviceSizes[device];
      iframe.style.width = size.width;
      iframe.style.height = size.height;

      // Reset scale
      scaleButtons.forEach((btn) => btn.classList.remove("active"));
      scaleButtons[0].classList.add("active");
      iframe.style.transform = "scale(1)";
    });
  });

  // Handle scaling
  scaleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const scale = parseFloat(button.dataset.scale);

      // Update active button
      scaleButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Apply scaling
      iframe.style.transform = `scale(${scale})`;

      // Adjust container if needed
      if (scale !== 1) {
        iframe.style.transformOrigin = "top left";
      }
    });
  });

  // Handle iframe load
  iframe.addEventListener("load", () => {
    iframe.classList.add("loaded");
  });

  // Handle iframe errors
  iframe.addEventListener("error", () => {
    previewContainer.innerHTML = `
            <div class="preview-error">
                <p>Unable to load preview. Please visit the full site.</p>
            </div>
        `;
  });

  // Optional: Add touch support for mobile devices
  let touchStartX = 0;
  let touchStartY = 0;

  previewContainer.addEventListener("touchmove", (e) => {
    // Prevent default only if we're not in an iframe
    if (e.target === previewContainer) {
      e.preventDefault();
    }

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    const deltaX = touchStartX - touchX;
    const deltaY = touchStartY - touchY;

    // Update iframe scroll position
    if (iframe.contentWindow) {
      iframe.contentWindow.scrollBy(deltaX, deltaY);
    }

    touchStartX = touchX;
    touchStartY = touchY;
  });

  // Add refresh button functionality
  const refreshButton = document.createElement("button");
  refreshButton.className = "refresh-button";
  refreshButton.innerHTML = "↻ Refresh";
  refreshButton.addEventListener("click", () => {
    iframe.src = iframe.src;
  });

  // Add refresh button to controls
  document.querySelector(".preview-controls").appendChild(refreshButton);

  // Handle responsive preview
  function updatePreviewSize() {
    const activeDevice = document.querySelector(".device-button.active").dataset
      .device;
    const activeScale = parseFloat(
      document.querySelector(".scale-button.active").dataset.scale
    );

    const size = deviceSizes[activeDevice];
    iframe.style.width = size.width;
    iframe.style.height = size.height;
    iframe.style.transform = `scale(${activeScale})`;
  }

  // Update on window resize
  window.addEventListener("resize", updatePreviewSize);

  // Initialize with desktop view
  updatePreviewSize();

  // Add keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Alt + 1/2/3 for device switching
    if (e.altKey) {
      switch (e.key) {
        case "1":
          document.querySelector('[data-device="desktop"]').click();
          break;
        case "2":
          document.querySelector('[data-device="tablet"]').click();
          break;
        case "3":
          document.querySelector('[data-device="mobile"]').click();
          break;
      }
    }
  });

  // Optional: Add loading progress indicator
  let loadingProgress = 0;
  const loadingInterval = setInterval(() => {
    loadingProgress += 10;
    if (loadingProgress <= 90) {
      previewContainer.style.setProperty(
        "--loading-progress",
        `${loadingProgress}%`
      );
    }
  }, 200);

  iframe.addEventListener("load", () => {
    clearInterval(loadingInterval);
    previewContainer.style.setProperty("--loading-progress", "100%");
    setTimeout(() => {
      previewContainer.classList.add("loaded");
    }, 300);
  });

  // Add error boundary
  window.addEventListener("error", (e) => {
    if (e.target === iframe) {
      console.error("Preview failed to load:", e);
      previewContainer.innerHTML = `
                <div class="preview-error">
                    <p>Preview unavailable. Please visit the full site.</p>
                    <a href="${iframe.src}" target="_blank" class="portfolio-button">
                        Open in New Tab
                    </a>
                </div>
            `;
    }
  });
});
