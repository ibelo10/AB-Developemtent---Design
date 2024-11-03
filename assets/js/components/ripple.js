// components/ripple.js
export function initializeRipples() {
  // Check if WebGL is supported
  function isWebGLSupported() {
    try {
      const canvas = document.createElement("canvas");
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  }

  // Initialize ripple effect
  function setupRipples() {
    if (!isWebGLSupported()) {
      console.log("WebGL is not supported in your browser.");
      return;
    }

    try {
      $(".full-mountain-image")
        .ripples({
          resolution: 512,
          dropRadius: 20,
          perturbance: 0.04,
          interactive: true,
          crossOrigin: "",
        })
        .on("error", function (e, err) {
          console.error("Ripples error: ", err);
        });

      // Handle window resize
      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          try {
            $(".full-mountain-image").ripples("updateSize");
          } catch (e) {
            console.error("Resize error: ", e);
          }
        }, 100);
      });
    } catch (e) {
      console.error("Initialization error: ", e);
    }
  }

  // Wait for jQuery and ripples plugin to load
  if (typeof jQuery === "undefined") {
    const jqueryScript = document.createElement("script");
    jqueryScript.src =
      "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
    jqueryScript.onload = () => {
      const ripplesScript = document.createElement("script");
      ripplesScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/jquery.ripples/0.5.3/jquery.ripples.min.js";
      ripplesScript.onload = setupRipples;
      document.head.appendChild(ripplesScript);
    };
    document.head.appendChild(jqueryScript);
  } else {
    setupRipples();
  }
}
