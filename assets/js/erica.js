document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.style.animation = "shake 0.5s ease-in-out";
        });

        card.addEventListener("mouseleave", () => {
            card.style.animation = "";
        });
    });
});

/* Animation keyframe for shaking effect */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        50% { transform: translateX(5px); }
        75% { transform: translateX(-5px); }
    }
`, styleSheet.cssRules.length);