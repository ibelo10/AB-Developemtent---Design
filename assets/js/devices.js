document.addEventListener("DOMContentLoaded", () => {
  // Get all device switching elements
  const deviceButtons = document.querySelectorAll(".device-button");
  const deviceFrames = document.querySelectorAll(".device-frame");
  const iframes = document.querySelectorAll(".preview-frame");

  // Handle device switching
  deviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      deviceButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Update active frame with animation
      const targetDevice = button.dataset.device;
      deviceFrames.forEach((frame) => {
        if (frame.classList.contains("active")) {
          // Fade out current frame
          frame.style.opacity = "0";
          setTimeout(() => {
            frame.classList.remove("active");
            // Show and fade in new frame
            const newFrame = document.querySelector(
              `[data-frame="${targetDevice}"]`
            );
            newFrame.style.opacity = "0";
            newFrame.classList.add("active");
            setTimeout(() => {
              newFrame.style.opacity = "1";
            }, 50);
          }, 300);
        }
      });

      // Ensure iframe is loaded in the new frame
      const targetFrame = document.querySelector(
        `[data-frame="${targetDevice}"]`
      );
      const iframe = targetFrame.querySelector(".preview-frame");
      if (iframe && !iframe.classList.contains("loaded")) {
        iframe.src = iframe.src;
      }
    });
  });

  // Handle iframe loading
  iframes.forEach((iframe) => {
    iframe.addEventListener("load", () => {
      iframe.classList.add("loaded");
      iframe.style.opacity = "1";
    });

    // Add error handling
    iframe.addEventListener("error", () => {
      const container = iframe.parentElement;
      container.innerHTML = `
                <div class="iframe-error">
                    <p>Unable to load preview.</p>
                    <a href="${iframe.src}" target="_blank" class="error-link">
                        Open site in new tab
                    </a>
                </div>
            `;
    });
  });

  // Add keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.altKey) {
      switch (e.key) {
        case "1":
          document.querySelector('[data-device="desktop"]').click();
          break;
        case "2":
          document.querySelector('[data-device="tablet"]').click();
          break;
        case "3":
          document.querySelector('[data-device="phone"]').click();
          break;
      }
    }
  });

  // Add touch gestures for mobile
  let touchStartX = 0;
  let touchStartY = 0;
  const container = document.querySelector(".portfolio-item");

  container.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  container.addEventListener("touchmove", (e) => {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const deltaX = touchStartX - touchEndX;
    const deltaY = touchStartY - touchEndY;

    // If horizontal swipe is greater than vertical swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault(); // Prevent page scroll

      // Determine swipe direction and switch device
      if (deltaX > 50) {
        // Swipe left
        const currentButton = document.querySelector(".device-button.active");
        const nextButton = currentButton.nextElementSibling;
        if (nextButton) nextButton.click();
      } else if (deltaX < -50) {
        // Swipe right
        const currentButton = document.querySelector(".device-button.active");
        const prevButton = currentButton.previousElementSibling;
        if (prevButton) prevButton.click();
      }
    }
  });

  container.addEventListener("touchend", () => {
    touchStartX = 0;
    touchStartY = 0;
  });

  // Add refresh functionality
  const refreshButton = document.createElement("button");
  refreshButton.className = "refresh-button";
  refreshButton.innerHTML = "↻ Refresh";
  refreshButton.addEventListener("click", () => {
    const activeFrame = document.querySelector(".device-frame.active");
    const iframe = activeFrame.querySelector(".preview-frame");
    iframe.src = iframe.src;
  });

  document.querySelector(".frame-controls").appendChild(refreshButton);

  // Optional: Add loading progress indicator
  iframes.forEach((iframe) => {
    const progressBar = document.createElement("div");
    progressBar.className = "loading-progress";
    iframe.parentElement.appendChild(progressBar);

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
  });
});
