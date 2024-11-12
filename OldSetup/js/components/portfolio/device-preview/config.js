// Update config.js
export const DevicePreviewConfig = {
  devices: {
    desktop: {
      width: "100%",
      height: "100%",
    },
    tablet: {
      width: "768px",
      height: "1024px",
      viewport: "width=768, initial-scale=1",
    },
    mobile: {
      width: "375px",
      height: "812px",
      viewport: "width=375, initial-scale=1, maximum-scale=1",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    },
  },
  loadTimeout: 15000,
  retryAttempts: 3,
  retryDelay: 2000,
};
