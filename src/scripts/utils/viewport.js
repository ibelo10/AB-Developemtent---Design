// src/scripts/utils/viewport.js
class ViewportManager {
  constructor() {
    this.breakpoints = {
      mobile: 480,
      tablet: 768,
      desktop: 1024,
      wide: 1200,
    };

    this.observers = new Set();
    this.currentBreakpoint = this.getCurrentBreakpoint();

    this.init();
  }

  init() {
    window.addEventListener("resize", this.handleResize.bind(this));
    window.addEventListener("orientationchange", this.handleResize.bind(this));
  }

  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width <= this.breakpoints.mobile) return "mobile";
    if (width <= this.breakpoints.tablet) return "tablet";
    if (width <= this.breakpoints.desktop) return "desktop";
    return "wide";
  }

  handleResize() {
    const newBreakpoint = this.getCurrentBreakpoint();
    if (newBreakpoint !== this.currentBreakpoint) {
      const oldBreakpoint = this.currentBreakpoint;
      this.currentBreakpoint = newBreakpoint;
      this.notifyObservers(newBreakpoint, oldBreakpoint);
    }
  }

  observe(callback) {
    this.observers.add(callback);
    callback(this.currentBreakpoint, null);
    return () => this.observers.delete(callback);
  }

  notifyObservers(newBreakpoint, oldBreakpoint) {
    this.observers.forEach((observer) => {
      observer(newBreakpoint, oldBreakpoint);
    });
  }

  isBreakpoint(breakpoint) {
    return this.currentBreakpoint === breakpoint;
  }

  isMobile() {
    return this.isBreakpoint("mobile");
  }

  isTablet() {
    return this.isBreakpoint("tablet");
  }

  isDesktop() {
    return this.isBreakpoint("desktop") || this.isBreakpoint("wide");
  }
}

export const viewport = new ViewportManager();
