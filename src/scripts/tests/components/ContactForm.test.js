// src/scripts/tests/components/ContactForm.test.js
import { ContactForm } from "../../components/contact-form";
import { eventBus } from "../../core/event-bus";

describe("ContactForm Component", () => {
  let form;
  let contactForm;

  beforeEach(() => {
    document.body.innerHTML = `
            <form id="contact-form">
                <div class="form-group">
                    <input type="text" name="name" required>
                    <div class="error-container"></div>
                </div>
                <div class="form-group">
                    <input type="email" name="email" required>
                    <div class="error-container"></div>
                </div>
                <div class="form-group">
                    <textarea name="message" required></textarea>
                    <div class="error-container"></div>
                </div>
                <button type="submit">Send</button>
            </form>
        `;

    form = document.getElementById("contact-form");
    contactForm = new ContactForm("contact-form");
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  it("should validate required fields", async () => {
    // Create and dispatch submit event
    const submitEvent = new Event("submit");
    submitEvent.preventDefault = jest.fn();
    form.dispatchEvent(submitEvent);

    // Wait for validation
    await new Promise((resolve) => setTimeout(resolve, 100));

    const errorContainers = form.querySelectorAll(
      ".form-group .error-container"
    );
    const errors = Array.from(errorContainers).filter(
      (container) => container.textContent
    );

    expect(errors.length).toBe(3);
  });

  it("should validate email format", async () => {
    const emailInput = form.querySelector('input[name="email"]');
    const errorContainer =
      emailInput.parentNode.querySelector(".error-container");

    // Enter invalid email and trigger blur
    emailInput.value = "invalid-email";
    const blurEvent = new Event("blur");
    emailInput.dispatchEvent(blurEvent);

    // Wait for validation
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(errorContainer.textContent.toLowerCase()).toContain("email");
  });

  it("should emit event on successful submission", async () => {
    const eventSpy = jest.spyOn(eventBus, "emit");

    // Fill form with valid data
    form.querySelector('input[name="name"]').value = "Test User";
    form.querySelector('input[name="email"]').value = "test@example.com";
    form.querySelector('textarea[name="message"]').value = "Test message";

    // Submit form
    const submitEvent = new Event("submit");
    submitEvent.preventDefault = jest.fn();
    form.dispatchEvent(submitEvent);

    // Wait for submission
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(eventSpy).toHaveBeenCalledWith(
      "contactFormSubmit",
      expect.any(Object)
    );
  });
});
