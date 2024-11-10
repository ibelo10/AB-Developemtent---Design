document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitButton = form.querySelector(".submit-button");
  const buttonText = submitButton.querySelector(".button-text");
  const buttonLoader = submitButton.querySelector(".button-loader");
  const formMessage = document.getElementById("formMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Show loading state
    submitButton.disabled = true;
    buttonText.style.opacity = "0";
    buttonLoader.style.display = "block";
    formMessage.style.display = "none";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message
        formMessage.textContent =
          "Thank you for your message! We'll get back to you soon.";
        formMessage.className = "form-message success";
        form.reset();
      } else {
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      // Show error message
      formMessage.textContent = error.message;
      formMessage.className = "form-message error";
    } finally {
      // Reset button state
      submitButton.disabled = false;
      buttonText.style.opacity = "1";
      buttonLoader.style.display = "none";
      formMessage.style.display = "block";
    }
  });
});
