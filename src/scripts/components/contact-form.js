// src/scripts/components/contact-form.js
export class ContactForm {
  constructor(formId) {
    this.form = document.getElementById(formId);
    if (!this.form) {
      throw new Error(`Form with id ${formId} not found`);
    }
    this.setupFormValidation();
  }

  setupFormValidation() {
    this.form.addEventListener("submit", this.handleSubmit.bind(this));

    this.form.querySelectorAll("input, textarea").forEach((field) => {
      field.addEventListener("blur", () => this.validateField(field));
    });
  }

  validateField(field) {
    const errorContainer = field.parentNode.querySelector(".error-container");
    errorContainer.textContent = "";

    if (field.required && !field.value.trim()) {
      errorContainer.textContent = "This field is required";
      return false;
    }

    if (field.type === "email" && !this.isValidEmail(field.value)) {
      errorContainer.textContent = "Please enter a valid email address";
      return false;
    }

    return true;
  }

  validateForm() {
    let isValid = true;
    this.form.querySelectorAll("input, textarea").forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    return isValid;
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.validateForm()) {
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData.entries());
      eventBus.emit("contactFormSubmit", data);
      this.form.reset();
    }
  }
}
