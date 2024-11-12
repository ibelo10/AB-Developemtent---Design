// src/scripts/pages/contact.js
import { ContactForm } from "../components/contact-form";
import { Messenger } from "../components/messenger";
import { eventBus } from "../core/event-bus";

export default async function initializeContactPage() {
  try {
    // Initialize contact form
    const contactForm = new ContactForm("contact-form");

    // Initialize messenger if enabled
    const messenger = new Messenger();

    // Setup page-specific event listeners
    setupEventListeners();

    eventBus.emit("contactPageReady");

    return {
      contactForm,
      messenger,
    };
  } catch (error) {
    console.error("Contact page initialization error:", error);
    eventBus.emit("pageError", { page: "contact", error });
  }
}

function setupEventListeners() {
  // Track successful form submissions
  eventBus.on("contactFormSubmit", (data) => {
    if (window.gtag) {
      gtag("event", "contact_form_submit", {
        form_type: "contact",
      });
    }
  });

  // Track messenger interactions
  eventBus.on("messengerShow", () => {
    if (window.gtag) {
      gtag("event", "messenger_open");
    }
  });
}
