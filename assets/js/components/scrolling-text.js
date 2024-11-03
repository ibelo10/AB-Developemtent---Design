// components/scrolling-text.js
export function initializeScrollingText() {
  const texts = [
    "create digital experiences",
    "build innovative solutions",
    "design beautiful interfaces",
    "transform your vision",
  ];

  let currentIndex = 0;
  const textElement = document.querySelector(".scrolling-text__item");

  if (textElement) {
    setInterval(() => {
      textElement.style.opacity = "0";

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % texts.length;
        textElement.textContent = texts[currentIndex];
        textElement.style.opacity = "1";
      }, 500);
    }, 3000);
  }
}
