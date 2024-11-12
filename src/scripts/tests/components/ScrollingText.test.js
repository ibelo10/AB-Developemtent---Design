// src/scripts/tests/components/ScrollingText.test.js
import { ScrollingText } from "../../components/scrolling-text";

describe("ScrollingText Component", () => {
  let container;
  let scrollingText;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    jest.useFakeTimers();
  });

  afterEach(() => {
    container.remove();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("should initialize with default options", () => {
    scrollingText = new ScrollingText(container);
    expect(container.querySelector(".scrolling-text")).toBeTruthy();
    expect(container.querySelector(".scrolling-text__item")).toBeTruthy();
  });

  it("should cycle through texts", async () => {
    scrollingText = new ScrollingText(container, {
      texts: ["Text 1", "Text 2"],
      interval: 1000,
      animationDuration: 500,
    });

    // Initial text
    const textElement = container.querySelector(".scrolling-text__item");
    expect(textElement.textContent).toBe("Text 1");

    // Run all pending timers
    jest.runOnlyPendingTimers();

    // Wait for animation and state updates
    await Promise.resolve();
    jest.advanceTimersByTime(500); // Animation duration
    await Promise.resolve();

    expect(textElement.textContent).toBe("Text 2");
  });

  it("should pause and resume animation", () => {
    const setIntervalSpy = jest.spyOn(window, "setInterval");
    const clearIntervalSpy = jest.spyOn(window, "clearInterval");

    scrollingText = new ScrollingText(container);
    expect(setIntervalSpy).toHaveBeenCalled();

    scrollingText.pause();
    expect(clearIntervalSpy).toHaveBeenCalled();

    scrollingText.resume();
    expect(setIntervalSpy).toHaveBeenCalledTimes(2);

    // Cleanup spies
    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
  });
});
