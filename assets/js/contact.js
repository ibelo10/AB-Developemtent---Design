document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const submitButton = contactForm.querySelector(".submit-button");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';

    // Get form data
    const formData = new FormData(contactForm);
    const templateParams = {
      from_name: formData.get("name"),
      from_email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      to_name: "AB Development & Design", // Your name or business name
    };

    try {
      // Send email using EmailJS
      const response = await emailjs.send(
        "service_6alpgw9", // Add your EmailJS service ID
        "template_qw8v24j", // Add your EmailJS template ID
        templateParams
      );

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className = "success-message";
      successMessage.innerHTML = `
              <div class="success-content">
                  <span class="success-icon">✓</span>
                  <p>Thank you for your message! We'll get back to you soon.</p>
              </div>
          `;
      contactForm.appendChild(successMessage);
      successMessage.style.display = "block";

      // Clear form
      contactForm.reset();

      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 5000);
    } catch (error) {
      console.error("Error sending email:", error);
      // Show error message
      const errorMessage = document.createElement("div");
      errorMessage.className = "error-message";
      errorMessage.innerHTML = `
              <div class="error-content">
                  <span class="error-icon">⚠</span>
                  <p>There was an error sending your message. Please try again or email us directly.</p>
              </div>
          `;
      contactForm.appendChild(errorMessage);
      errorMessage.style.display = "block";

      setTimeout(() => {
        errorMessage.style.display = "none";
      }, 5000);
    } finally {
      // Re-enable submit button
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });

  // Form validation
  const inputs = contactForm.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    // Show validation messages
    input.addEventListener("invalid", (e) => {
      e.preventDefault();
      input.classList.add("invalid");

      // Add custom validation message
      const errorDiv = input.parentElement.querySelector(".error-text");
      if (!errorDiv) {
        const error = document.createElement("div");
        error.className = "error-text";
        error.textContent = input.validationMessage;
        input.parentElement.appendChild(error);
      }
    });

    // Remove validation messages on input
    input.addEventListener("input", () => {
      if (input.validity.valid) {
        input.classList.remove("invalid");
        const errorDiv = input.parentElement.querySelector(".error-text");
        if (errorDiv) {
          errorDiv.remove();
        }
      }
    });
  });
});
