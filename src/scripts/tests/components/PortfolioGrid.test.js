// src/scripts/tests/components/PortfolioGrid.test.js
import { PortfolioGrid } from "../../components/portfolio-grid";
import { viewport } from "../../utils/viewport";
import { eventBus } from "../../core/event-bus";

describe("PortfolioGrid Component", () => {
  let container;
  let portfolioGrid;

  beforeEach(() => {
    // Setup DOM
    container = document.createElement("div");
    container.id = "portfolio-container";
    document.body.appendChild(container);

    container.innerHTML = `
            <div id="portfolio-grid">
                <div class="portfolio-item" data-tags="react">
                    <div class="tech-tag">React</div>
                </div>
                <div class="portfolio-item" data-tags="vue">
                    <div class="tech-tag">Vue</div>
                </div>
            </div>
        `;

    // Mock viewport
    viewport.observe = jest.fn((callback) => {
      viewport.callback = callback;
    });
    viewport.getCurrentBreakpoint = jest.fn().mockReturnValue("desktop");
    viewport.emit = jest.fn();

    portfolioGrid = new PortfolioGrid("portfolio-container");
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  it("should initialize with controls", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const controls = container.querySelector(".portfolio-controls");
    expect(controls).toBeTruthy();
    expect(controls.querySelector(".layout-toggle")).toBeTruthy();
    expect(controls.querySelector(".filter-controls")).toBeTruthy();
  });

  it("should toggle layout", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const layoutToggle = container.querySelector(".layout-toggle");
    const listButton = layoutToggle.querySelector("button:last-child");
    const gridButton = layoutToggle.querySelector("button:first-child");

    listButton.click();
    expect(container.classList.contains("layout-list")).toBeTruthy();

    gridButton.click();
    expect(container.classList.contains("layout-grid")).toBeTruthy();
  });

  it("should filter items", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const filterButtons = container.querySelectorAll(".filter-button");
    const reactFilter = Array.from(filterButtons).find(
      (button) => button.textContent === "React"
    );

    reactFilter.click();

    const visibleItems = Array.from(
      container.querySelectorAll(".portfolio-item")
    ).filter((item) => !item.style.display || item.style.display !== "none");

    const reactItems = Array.from(
      container.querySelectorAll('.portfolio-item[data-tags="react"]')
    );
    expect(visibleItems).toEqual(reactItems);
  });

  it("should respond to viewport changes", async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    const updateLayoutSpy = jest.spyOn(portfolioGrid, "updateLayout");

    // Trigger viewport change using stored callback
    viewport.callback("mobile");

    expect(updateLayoutSpy).toHaveBeenCalledWith("mobile");
    expect(container.classList.contains("layout-list")).toBeTruthy();
  });
});
