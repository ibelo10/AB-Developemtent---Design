// assets/js/components/header-effects.js

export function initializeHeaderEffects() {
  const header = document.querySelector(".content-wrapper h1");
  if (!header) return;

  // Split text into individual letters and wrap each in a span
  const text = header.textContent;
  header.innerHTML = text
    .split("")
    .map((letter) =>
      letter === " " ? " " : `<span class="letter">${letter}</span>`
    )
    .join("");

  // Add hover effects to each letter
  const letters = header.querySelectorAll(".letter");
  letters.forEach((letter) => {
    letter.addEventListener("mouseover", () => {
      letter.classList.add("letter-hover");
      // Add hover effect to adjacent letters with delay
      const index = Array.from(letters).indexOf(letter);

      // Previous letter
      if (index > 0) {
        setTimeout(() => {
          letters[index - 1].classList.add("letter-hover-adjacent");
        }, 50);
      }

      // Next letter
      if (index < letters.length - 1) {
        setTimeout(() => {
          letters[index + 1].classList.add("letter-hover-adjacent");
        }, 50);
      }
    });

    letter.addEventListener("mouseout", () => {
      letter.classList.remove("letter-hover");
      letters.forEach((l) => l.classList.remove("letter-hover-adjacent"));
    });
  });
}
