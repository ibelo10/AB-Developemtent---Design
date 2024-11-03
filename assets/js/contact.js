document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Here you would typically send the data to your server
    // For now, we'll just simulate a submission
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "success-message";
      successMessage.textContent =
        "Thank you for your message! We'll get back to you soon.";
      contactForm.appendChild(successMessage);
      successMessage.style.display = "block";

      // Clear form
      contactForm.reset();

      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error sending your message. Please try again.");
    }
  });

  // Optional: Add form validation
  const inputs = contactForm.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("invalid", (e) => {
      e.preventDefault();
      input.classList.add("invalid");
    });

    input.addEventListener("input", () => {
      if (input.validity.valid) {
        input.classList.remove("invalid");
      }
    });
  });
});
