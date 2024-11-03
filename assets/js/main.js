// Initialize ripple effect
$(document).ready(function () {
  try {
    $(".hero-container").ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04,
    });

    // Handle window resize
    $(window).on("resize", function () {
      try {
        $(".hero-container").ripples("updateSize");
      } catch (e) {
        console.error("Resize error: ", e);
      }
    });

    // Handle scroll for navbar transparency
    $(window).on("scroll", function () {
      if ($(window).scrollTop() > 50) {
        $(".navbar").css("background", "rgba(0, 0, 0, 0.8)");
      } else {
        $(".navbar").css("background", "rgba(0, 0, 0, 0.5)");
      }
    });
  } catch (e) {
    console.error("Ripples effect error: ", e);
  }
});
