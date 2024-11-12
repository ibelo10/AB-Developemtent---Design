// assets/js/components/device-preview/iframe.js
export class IframeManager {
  static create(device) {
    const iframe = document.createElement("iframe");
    iframe.className = "preview-frame";
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("title", `Website Preview (${device})`);

    // Set mobile-specific attributes
    if (device === "mobile") {
      // Add mobile viewport meta content
      iframe.addEventListener("load", () => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow.document;

          // Insert viewport meta tag
          let viewport = doc.querySelector('meta[name="viewport"]');
          if (!viewport) {
            viewport = doc.createElement("meta");
            viewport.name = "viewport";
            doc.head.appendChild(viewport);
          }
          viewport.content = "width=375, initial-scale=1, shrink-to-fit=no";

          // Add mobile class to body
          doc.body.classList.add("mobile-view");

          // Force mobile user agent via JavaScript
          const script = doc.createElement("script");
          script.textContent = `
              Object.defineProperty(navigator, 'userAgent', {
                get: function () {
                  return 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1';
                }
              });
              // Trigger window resize to force responsive layouts
              window.dispatchEvent(new Event('resize'));
            `;
          doc.head.appendChild(script);
        } catch (error) {
          console.error("Failed to set mobile view:", error);
        }
      });

      // Set iframe sandbox attributes to allow necessary features
      iframe.setAttribute(
        "sandbox",
        "allow-same-origin allow-scripts allow-popups allow-forms"
      );
    }

    return iframe;
  }

  static async load(iframe, url, timeout) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(
        () => reject(new Error("Loading timeout")),
        timeout
      );

      iframe.onload = () => {
        clearTimeout(timeoutId);
        resolve();
      };

      iframe.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error("Loading failed"));
      };

      // Add mobile query parameter and modify URL for mobile view
      const urlObj = new URL(url);
      if (iframe.title.includes("Mobile")) {
        urlObj.searchParams.set("device", "mobile");
        urlObj.searchParams.set("viewport", "width=375");
        // Some sites use different mobile URLs
        if (urlObj.hostname.startsWith("www.")) {
          urlObj.hostname = "m." + urlObj.hostname.slice(4);
        }
      }

      iframe.src = urlObj.toString();
    });
  }

  static updateSize(iframe, device, devices) {
    const size = devices[device];

    switch (device) {
      case "mobile":
        iframe.style.width = size.width;
        iframe.style.height = size.height;
        iframe.style.transform = "scale(1)";
        iframe.style.transformOrigin = "top left";
        // Force mobile viewport meta tag
        const parentDoc = iframe.ownerDocument;
        const viewportMeta = parentDoc.createElement("meta");
        viewportMeta.name = "viewport";
        viewportMeta.content =
          "width=device-width, initial-scale=1, maximum-scale=1";
        parentDoc.head.appendChild(viewportMeta);
        break;

      case "tablet":
        iframe.style.width = size.width;
        iframe.style.height = size.height;
        break;

      default:
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        break;
    }
  }
}
