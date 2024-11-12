// src/scripts/components/messenger.js
import { siteSettings } from "../../config/site-settings";
import { eventBus } from "../core/event-bus";

export class Messenger {
  constructor() {
    this.config = siteSettings.messenger;
    this.isLoaded = false;
    this.isVisible = false;

    if (this.config.enabled) {
      this.init();
    }
  }

  init() {
    // Load Facebook SDK
    this.loadSDK();

    // Initialize chat widget when SDK is loaded
    window.fbAsyncInit = () => {
      FB.init({
        xfbml: true,
        version: "v12.0",
      });

      this.setupChat();
      this.setupEventListeners();
    };
  }

  loadSDK() {
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js";
    script.defer = true;
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  setupChat() {
    // Create chat container
    const chatContainer = document.createElement("div");
    chatContainer.className = "fb-customerchat";
    chatContainer.setAttribute("page_id", this.config.pageId);
    chatContainer.setAttribute("theme_color", "#2ecc71");
    document.body.appendChild(chatContainer);

    // Show chat after delay if autoShow is enabled
    if (this.config.autoShow) {
      setTimeout(() => this.showChat(), this.config.delay);
    }
  }

  setupEventListeners() {
    FB.Event.subscribe("customerchat.dialogShow", () => {
      this.isVisible = true;
      eventBus.emit("messengerShow");
    });

    FB.Event.subscribe("customerchat.dialogHide", () => {
      this.isVisible = false;
      eventBus.emit("messengerHide");
    });
  }

  showChat() {
    if (FB && FB.CustomerChat) {
      FB.CustomerChat.showDialog();
    }
  }

  hideChat() {
    if (FB && FB.CustomerChat) {
      FB.CustomerChat.hideDialog();
    }
  }
}
