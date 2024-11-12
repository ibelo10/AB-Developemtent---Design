// Chat Toast Management
let toastTimeout;
let progressTimeout;

function initializeChatToast() {
  // Show toast only for first-time visitors or after 7 days
  if (shouldShowToast()) {
    setTimeout(showToast, 3000);
  }
}

function shouldShowToast() {
  const lastShown = localStorage.getItem("chatToastShown");
  if (!lastShown) return true;

  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  const timeSinceLastShown = Date.now() - new Date(lastShown).getTime();

  if (timeSinceLastShown > sevenDays) {
    localStorage.removeItem("chatToastShown");
    return true;
  }

  return false;
}

function showToast() {
  const toast = document.getElementById("chatToast");
  if (!toast) return;

  toast.classList.add("show");

  // Auto-hide toast after 5 seconds
  toastTimeout = setTimeout(() => {
    hideToast();
  }, 5000);

  // Store the current timestamp
  localStorage.setItem("chatToastShown", Date.now());
}

function hideToast() {
  const toast = document.getElementById("chatToast");
  if (!toast) return;

  toast.classList.remove("show");

  // Clear timeouts
  if (toastTimeout) clearTimeout(toastTimeout);
  if (progressTimeout) clearTimeout(progressTimeout);
}

function closeToast() {
  hideToast();
  // Prevent toast from showing again in this session
  sessionStorage.setItem("toastDismissed", "true");
}

// Chat Analytics
function trackChatOpen() {
  // Google Analytics tracking
  if (typeof gtag !== "undefined") {
    gtag("event", "open_chat", {
      event_category: "Engagement",
      event_label: "Messenger Chat",
    });
  }
}

// Mobile Detection
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Chat Position Adjustment
function adjustChatPosition() {
  const isMobileDevice = isMobile();
  const chatWidget = document.querySelector(".fb_dialog");

  if (chatWidget) {
    if (isMobileDevice) {
      chatWidget.style.bottom = "70px";
    } else {
      chatWidget.style.bottom = "80px";
    }
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  // Adjust chat position on load
  adjustChatPosition();

  // Handle window resize
  window.addEventListener("resize", adjustChatPosition);

  // Handle visibility changes
  document.addEventListener("visibilitychange", function () {
    if (
      document.visibilityState === "visible" &&
      shouldShowToast() &&
      !sessionStorage.getItem("toastDismissed")
    ) {
      showToast();
    }
  });
});

// Error Handling
window.addEventListener("error", function (e) {
  if (e.target.classList.contains("fb_dialog_iframe")) {
    console.error("Messenger chat widget failed to load:", e);
    // Implement fallback contact method if needed
  }
});

// Export functions for use in other modules
export { initializeChatToast, showToast, hideToast, closeToast, trackChatOpen };
