// src/scripts/tests/components/Messenger.test.js
import { Messenger } from "../../components/messenger";
import { eventBus } from "../../core/event-bus";

describe("Messenger Component", () => {
  let messenger;
  let eventCallbacks = {};

  beforeEach(() => {
    // Mock Facebook SDK
    global.FB = {
      init: jest.fn(),
      CustomerChat: {
        showDialog: jest.fn(),
        hideDialog: jest.fn(),
      },
      Event: {
        subscribe: jest.fn((event, callback) => {
          eventCallbacks[event] = callback;
        }),
      },
    };

    // Mock DOM methods
    document.createElement = jest.fn().mockReturnValue({
      setAttribute: jest.fn(),
      appendChild: jest.fn(),
    });

    document.head.appendChild = jest.fn();
    document.body.appendChild = jest.fn();

    messenger = new Messenger();
  });

  afterEach(() => {
    delete global.FB;
    jest.clearAllMocks();
    document.body.innerHTML = "";
    eventCallbacks = {};
  });

  it("should initialize Facebook SDK", () => {
    expect(document.createElement).toHaveBeenCalledWith("script");
    expect(document.head.appendChild).toHaveBeenCalled();

    window.fbAsyncInit();
    expect(FB.init).toHaveBeenCalled();
  });

  it("should create chat container", () => {
    window.fbAsyncInit();
    expect(document.body.appendChild).toHaveBeenCalled();
  });

  it("should handle show/hide events", () => {
    const eventSpy = jest.spyOn(eventBus, "emit");
    window.fbAsyncInit();

    // Trigger show and hide events in sequence
    if (eventCallbacks["customerchat.dialogShow"]) {
      eventCallbacks["customerchat.dialogShow"]();
    }
    expect(eventSpy).toHaveBeenCalledWith("messengerShow");

    if (eventCallbacks["customerchat.dialogHide"]) {
      eventCallbacks["customerchat.dialogHide"]();
      expect(eventSpy).toHaveBeenLastCalledWith("messengerHide");
    }

    eventSpy.mockRestore();
  });
});
