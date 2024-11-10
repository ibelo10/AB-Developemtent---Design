document.addEventListener("DOMContentLoaded", () => {
  const previewContainer = document.querySelector(".preview-container");
  const iframe = document.querySelector(".live-preview");
  const deviceButtons = document.querySelectorAll(".device-button");
  const scaleButtons = document.querySelectorAll(".scale-button");

  // Device frame sizes - using percentage-based sizing
  const deviceSizes = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: "100%", height: "100%" },
    mobile: { width: "100%", height: "100%" },
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

      // Reset scale and ensure content is centered
      scaleButtons.forEach((btn) => btn.classList.remove("active"));
      scaleButtons[0].classList.add("active");
      iframe.style.transform = "scale(1)";

      // Reset scroll position
      const iframeContainer = iframe.parentElement;
      if (iframeContainer) {
        iframeContainer.scrollTop = 0;
        iframeContainer.scrollLeft = 0;
      }
    });
  });

  // Handle scaling
  scaleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const scale = parseFloat(button.dataset.scale);

      // Update active button
      scaleButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Apply scaling with centered transform origin
      iframe.style.transform = `scale(${scale})`;
      iframe.style.transformOrigin = "center top";
    });
  });

  // Handle iframe load
  iframe.addEventListener("load", () => {
    iframe.classList.add("loaded");
    previewContainer.classList.add("loaded");
  });

  // Handle iframe errors with improved error message
  iframe.addEventListener("error", () => {
    previewContainer.innerHTML = `
      <div class="preview-error">
        <p>Unable to load preview. Please check your connection and try again.</p>
        <a href="${iframe.src}" target="_blank" class="preview-error-link">
          Open in New Tab
        </a>
      </div>
    `;
  });

  // Improved touch support for mobile devices
  let touchStartX = 0;
  let touchStartY = 0;
  let isTouching = false;

  previewContainer.addEventListener("touchstart", (e) => {
    if (e.target === previewContainer) {
      isTouching = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  });

  previewContainer.addEventListener("touchmove", (e) => {
    if (!isTouching) return;

    // Prevent default only if we're not in an iframe
    if (e.target === previewContainer) {
      e.preventDefault();
    }

    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    const deltaX = touchStartX - touchX;
    const deltaY = touchStartY - touchY;

    // Update iframe scroll position with smooth behavior
    if (iframe.contentWindow) {
      iframe.contentWindow.scrollBy({
        top: deltaY,
        left: deltaX,
        behavior: "smooth",
      });
    }

    touchStartX = touchX;
    touchStartY = touchY;
  });

  previewContainer.addEventListener("touchend", () => {
    isTouching = false;
  });

  // Add refresh button with loading state
  const refreshButton = document.createElement("button");
  refreshButton.className = "refresh-button";
  refreshButton.innerHTML = "↻ Refresh";
  refreshButton.addEventListener("click", () => {
    refreshButton.classList.add("loading");
    iframe.src = iframe.src;
    setTimeout(() => refreshButton.classList.remove("loading"), 1000);
  });

  // Add refresh button to controls
  document.querySelector(".preview-controls").appendChild(refreshButton);

  // Handle responsive preview with debouncing
  let resizeTimeout;
  function updatePreviewSize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const activeDevice = document.querySelector(".device-button.active")
        .dataset.device;
      const activeScale = parseFloat(
        document.querySelector(".scale-button.active").dataset.scale
      );

      const size = deviceSizes[activeDevice];
      iframe.style.width = size.width;
      iframe.style.height = size.height;
      iframe.style.transform = `scale(${activeScale})`;
      iframe.style.transformOrigin = "center top";
    }, 250);
  }

  // Update on window resize
  window.addEventListener("resize", updatePreviewSize);

  // Handle orientation changes
  window.addEventListener("orientationchange", () => {
    setTimeout(updatePreviewSize, 100);
  });

  // Add keyboard shortcuts with visual feedback
  document.addEventListener("keydown", (e) => {
    if (e.altKey) {
      let button;
      switch (e.key) {
        case "1":
          button = document.querySelector('[data-device="desktop"]');
          break;
        case "2":
          button = document.querySelector('[data-device="tablet"]');
          break;
        case "3":
          button = document.querySelector('[data-device="mobile"]');
          break;
      }

      if (button) {
        button.click();
        button.classList.add("keyboard-activated");
        setTimeout(() => button.classList.remove("keyboard-activated"), 200);
      }
    }
  });

  // Initialize with desktop view
  updatePreviewSize();
});
