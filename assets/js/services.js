document.addEventListener("DOMContentLoaded", () => {
  const categoryButtons = document.querySelectorAll(".category-btn");
  const serviceCards = document.querySelectorAll(".service-card");
  const inquiryButtons = document.querySelectorAll(".inquiry-btn");

  // Category filtering
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const category = button.dataset.category;

      // Animate and filter services
      serviceCards.forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          // Show matching cards with animation
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 10);
        } else {
          // Hide non-matching cards with animation
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });

  // Handle inquiry buttons
  inquiryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const serviceCard = button.closest(".service-card");
      const serviceName = serviceCard.querySelector("h3").textContent;
      const servicePrice =
        serviceCard.querySelector(".service-price").textContent;

      // Redirect to contact page with pre-filled form data
      window.location.href = `/contact?service=${encodeURIComponent(
        serviceName
      )}&price=${encodeURIComponent(servicePrice)}`;
    });
  });

  // Initialize animation for cards
  serviceCards.forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
  });

  // Animate cards on page load
  setTimeout(() => {
    serviceCards.forEach((card, index) => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, index * 100); // Stagger the animations
    });
  }, 300);

  // Add hover effects for cards
  serviceCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      const icon = card.querySelector(".service-icon");
      icon.style.transform = "scale(1.1) rotate(5deg)";
    });

    card.addEventListener("mouseleave", () => {
      const icon = card.querySelector(".service-icon");
      icon.style.transform = "scale(1) rotate(0)";
    });
  });
});
