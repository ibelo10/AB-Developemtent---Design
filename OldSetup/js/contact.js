document.addEventListener("DOMContentLoaded", () => {
  // Get the iframe element
  const formIframe = document.querySelector(".google-form-container iframe");

  // Function to handle message from iframe
  window.addEventListener("message", (event) => {
    // Verify the origin is from Google Forms
    if (event.origin !== "https://docs.google.com") return;

    try {
      // Check if the form was submitted
      if (event.data.includes("formResponse")) {
        // You could add custom behavior here, such as:
        // - Show a custom thank you message
        // - Track the submission in analytics
        // - Redirect to a thank you page
        console.log("Form submitted successfully");

        // Example: Show a custom success message
        const successMessage = document.createElement("div");
        successMessage.className = "success-message";
        successMessage.innerHTML = `
          <div class="success-content">
            <span class="success-icon">✓</span>
            <p>Thank you for your message! We'll get back to you soon.</p>
          </div>
        `;
        document
          .querySelector(".google-form-container")
          .appendChild(successMessage);

        // Remove success message after 5 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }
    } catch (error) {
      console.error("Error processing form submission:", error);
    }
  });
});
