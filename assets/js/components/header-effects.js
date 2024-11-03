// assets/js/components/header-effects.js

export function initializeHeaderEffects() {
  const header = document.querySelector(".content-wrapper h1");
  if (!header) return;

  // Interactive gradient effect on mousemove
  header.addEventListener("mousemove", (e) => {
    const rect = header.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;

    header.style.backgroundPosition = `${percentage}% 50%`;
  });

  // Add click animation
  header.addEventListener("click", () => {
    header.style.transform = "scale(0.95)";
    setTimeout(() => {
      header.style.transform = "scale(1.02)";
    }, 150);
    setTimeout(() => {
      header.style.transform = "scale(1)";
    }, 300);
  });
}
