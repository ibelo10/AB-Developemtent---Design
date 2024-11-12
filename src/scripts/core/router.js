// src/scripts/core/router.js
class Router {
  constructor() {
    this.routes = new Map();
    this.notFoundHandler = () => console.error("Route not found");
    this.currentRoute = null;

    // Handle browser navigation events
    window.addEventListener("popstate", () => this.handleRoute());
    window.addEventListener("DOMContentLoaded", () => this.handleRoute());
  }

  addRoute(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  setNotFound(handler) {
    this.notFoundHandler = handler;
    return this;
  }

  async navigate(path, data = {}) {
    window.history.pushState(data, "", path);
    await this.handleRoute();
  }

  async handleRoute() {
    const path = window.location.pathname;
    const handler = this.routes.get(path);

    // Clean up current route if exists
    if (this.currentRoute) {
      eventBus.emit("routeExit", this.currentRoute);
    }

    try {
      if (handler) {
        this.currentRoute = path;
        eventBus.emit("routeEnter", { path, data: window.history.state });
        await handler(window.history.state);
      } else {
        this.notFoundHandler();
      }
    } catch (error) {
      console.error("Route handling error:", error);
      eventBus.emit("routeError", { path, error });
    }
  }
}

export const router = new Router();
