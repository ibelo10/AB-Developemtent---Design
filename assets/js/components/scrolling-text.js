// assets/js/components/scrolling-text.js

export function initializeScrollingText() {
    const texts = [
        "create digital experiences",
        "build innovative solutions",
        "design beautiful interfaces",
        "transform your vision"
    ];

    let currentIndex = 0;
    const textElement = document.querySelector(".scrolling-text__item");

    if (!textElement) {
        console.warn("Scrolling text element not found");
        return;
    }

    // Add CSS for smooth transitions
    textElement.style.transition = "opacity 0.5s ease-in-out";

    // Set initial text
    textElement.textContent = texts[currentIndex];
    textElement.style.opacity = "1";

    function updateText() {
        textElement.style.opacity = "0";
        
        setTimeout(() => {
            try {
                currentIndex = (currentIndex + 1) % texts.length;
                textElement.textContent = texts[currentIndex];
                textElement.style.opacity = "1";
            } catch (error) {
                console.warn("Error updating scrolling text:", error);
            }
        }, 500);
    }

    // Start the interval with error handling
    try {
        let intervalId = setInterval(updateText, 3000);

        // Cleanup on page hidden/visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(intervalId);
            } else {
                intervalId = setInterval(updateText, 3000);
            }
        });

        // Optional: Pause on hover
        textElement.addEventListener('mouseenter', () => clearInterval(intervalId));
        textElement.addEventListener('mouseleave', () => {
            intervalId = setInterval(updateText, 3000);
        });
    } catch (error) {
        console.warn("Error initializing scrolling text:", error);
    }
}
