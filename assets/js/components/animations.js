// components/animations.js
export function initializeAnimations() {
  // Add hover effect for the title
  const title = document.querySelector(".Header-hero h1");
  if (title) {
    title.addEventListener("mouseover", () => {
      title.style.color = "#3498db";
      title.style.textShadow = "3px 3px 6px rgba(52, 152, 219, 0.3)";
    });

    title.addEventListener("mouseout", () => {
      title.style.color = "white";
      title.style.textShadow = "2px 2px 4px rgba(0, 0, 0, 0.3)";
    });
  }

  // Add hover effect for the button
  const button = document.querySelector(".Button");
  if (button) {
    button.addEventListener("mouseover", () => {
      button.style.transform = "translateY(-2px)";
      button.style.background = "rgba(255, 255, 255, 0.25)";
      button.style.boxShadow = "0 12px 40px rgba(31, 38, 135, 0.6)";
    });

    button.addEventListener("mouseout", () => {
      button.style.transform = "translateY(0)";
      button.style.background = "rgba(255, 255, 255, 0.15)";
      button.style.boxShadow = "0 8px 32px 0 rgba(31, 38, 135, 0.37)";
    });
  }
}
