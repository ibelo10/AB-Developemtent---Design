document.addEventListener("DOMContentLoaded", () => {
  // Get all device switching elements
  const deviceButtons = document.querySelectorAll(".device-button");
  const deviceFrames = document.querySelectorAll(".device-frame");
  const iframes = document.querySelectorAll(".preview-frame");

  // Check if elements exist before adding listeners
  if (deviceButtons.length && deviceFrames.length) {
    // Handle device switching
    deviceButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Update active button
        deviceButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // Update active frame with animation
        const targetDevice = button.dataset.device;
        const targetFrame = document.querySelector(
          `[data-frame="${targetDevice}"]`
        );

        if (targetFrame) {
          // Remove active class from all frames
          deviceFrames.forEach((frame) => {
            frame.classList.remove("active");
            frame.style.opacity = "0";
          });

          // Add active class and fade in new frame
          targetFrame.classList.add("active");
          setTimeout(() => {
            targetFrame.style.opacity = "1";
          }, 50);

          // Ensure iframe is loaded in the new frame
          const iframe = targetFrame.querySelector(".preview-frame");
          if (iframe && !iframe.classList.contains("loaded")) {
            iframe.src = iframe.src;
          }
        }
      });
    });
  }

  // Handle iframe loading
  if (iframes.length) {
    iframes.forEach((iframe) => {
      iframe.addEventListener("load", () => {
        iframe.classList.add("loaded");
        iframe.style.opacity = "1";
      });

      // Add error handling
      iframe.addEventListener("error", () => {
        const container = iframe.parentElement;
        if (container) {
          container.innerHTML = `
                        <div class="iframe-error">
                            <p>Unable to load preview.</p>
                            <a href="${iframe.src}" target="_blank" class="error-link">
                                Open site in new tab
                            </a>
                        </div>
                    `;
        }
      });
    });
  }

  // Add keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.altKey) {
      switch (e.key) {
        case "1": {
          const desktopButton = document.querySelector(
            '[data-device="desktop"]'
          );
          if (desktopButton) desktopButton.click();
          break;
        }
        case "2": {
          const tabletButton = document.querySelector('[data-device="tablet"]');
          if (tabletButton) tabletButton.click();
          break;
        }
        case "3": {
          const phoneButton = document.querySelector('[data-device="phone"]');
          if (phoneButton) phoneButton.click();
          break;
        }
      }
    }
  });

  // Add refresh button
  const frameControls = document.querySelector(".frame-controls");
  if (frameControls) {
    const refreshButton = document.createElement("button");
    refreshButton.className = "refresh-button";
    refreshButton.innerHTML = "↻ Refresh";
    refreshButton.addEventListener("click", () => {
      const activeFrame = document.querySelector(".device-frame.active");
      if (activeFrame) {
        const iframe = activeFrame.querySelector(".preview-frame");
        if (iframe) iframe.src = iframe.src;
      }
    });

    frameControls.appendChild(refreshButton);
  }

  // Add loading progress indicator
  const addLoadingIndicator = (iframe) => {
    const container = iframe.parentElement;
    if (!container) return;

    const progressBar = document.createElement("div");
    progressBar.className = "loading-progress";
    container.appendChild(progressBar);

    let progress = 0;
    const loadingInterval = setInterval(() => {
      progress += 10;
      if (progress <= 90) {
        progressBar.style.width = `${progress}%`;
      }
    }, 200);

    iframe.addEventListener("load", () => {
      clearInterval(loadingInterval);
      progressBar.style.width = "100%";
      setTimeout(() => {
        progressBar.style.opacity = "0";
      }, 300);
    });
  };

  iframes.forEach(addLoadingIndicator);
});
