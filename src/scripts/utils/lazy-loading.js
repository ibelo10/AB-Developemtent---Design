// src/scripts/utils/lazy-loading.js
class LazyLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: "50px 0px",
      threshold: 0.1,
      loadingClass: "is-loading",
      loadedClass: "is-loaded",
      ...options,
    };

    this.observer = null;
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        rootMargin: this.options.rootMargin,
        threshold: this.options.threshold,
      }
    );
  }

  observe(elements) {
    if (typeof elements === "string") {
      elements = document.querySelectorAll(elements);
    }

    elements.forEach((element) => {
      this.observer.observe(element);
      element.classList.add(this.options.loadingClass);
    });
  }

  async handleIntersection(entries) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const element = entry.target;

        try {
          await this.loadElement(element);
          element.classList.remove(this.options.loadingClass);
          element.classList.add(this.options.loadedClass);
        } catch (error) {
          console.error("Error loading element:", error);
          element.classList.add("has-error");
        }

        this.observer.unobserve(element);
      }
    }
  }

  async loadElement(element) {
    // Handle different types of lazy loading
    if (element.tagName === "IMG") {
      await this.loadImage(element);
    } else if (element.dataset.background) {
      await this.loadBackground(element);
    } else if (element.dataset.src) {
      await this.loadGeneric(element);
    }
  }

  loadImage(img) {
    return new Promise((resolve, reject) => {
      const src = img.dataset.src;
      if (!src) {
        reject(new Error("No src specified"));
        return;
      }

      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  loadBackground(element) {
    return new Promise((resolve, reject) => {
      const src = element.dataset.background;
      if (!src) {
        reject(new Error("No background specified"));
        return;
      }

      const img = new Image();
      img.onload = () => {
        element.style.backgroundImage = `url(${src})`;
        resolve(element);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  loadGeneric(element) {
    return new Promise((resolve, reject) => {
      const src = element.dataset.src;
      if (!src) {
        reject(new Error("No src specified"));
        return;
      }

      fetch(src)
        .then((response) => response.text())
        .then((content) => {
          element.innerHTML = content;
          resolve(element);
        })
        .catch(reject);
    });
  }
}

export const lazyLoader = new LazyLoader();
