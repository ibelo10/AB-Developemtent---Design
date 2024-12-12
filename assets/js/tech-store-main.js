document.addEventListener("DOMContentLoaded", function () {
  const productsGrid = document.getElementById("tech-store-products-grid");
  let filteredProducts = [...techStoreProducts];

  // Filter handlers
  const categorySelect = document.getElementById("tech-store-category");
  const minPriceInput = document.getElementById("tech-store-min-price");
  const maxPriceInput = document.getElementById("tech-store-max-price");
  const sortSelect = document.getElementById("tech-store-sort");

  function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHtml = "";

    for (let i = 0; i < fullStars; i++) {
      starsHtml += '<i class="fas fa-star"></i>';
    }

    if (hasHalfStar) {
      starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }

    return starsHtml;
  }

  function createProductCard(product) {
    return `
            <div class="tech-store-product-card">
                ${
                  product.badge
                    ? `<span class="tech-store-product-badge">${product.badge}</span>`
                    : ""
                }
                <div class="tech-store-product-image">
                    <img src="https://via.placeholder.com/280x200" alt="${
                      product.name
                    }">
                </div>
                <div class="tech-store-product-details">
                    <span class="tech-store-product-category">${
                      product.category
                    }</span>
                    <h3 class="tech-store-product-title">${product.name}</h3>
                    <span class="tech-store-price-badge">$${
                      product.price
                    }</span>
                    <div class="tech-store-rating">
                        ${renderStars(product.rating)}
                        <span>(${product.rating}/5)</span>
                    </div>
                    <ul class="tech-store-product-features">
                        ${product.features
                          .map((feature) => `<li>${feature}</li>`)
                          .join("")}
                    </ul>
                    <div class="tech-store-action-buttons">
                        <a href="${
                          product.amazonUrl
                        }" class="tech-store-view-button" target="_blank" rel="noopener">View on Amazon</a>
                        <button class="tech-store-compare-button" data-product-id="${
                          product.id
                        }">Compare</button>
                    </div>
                </div>
            </div>
        `;
  }

  function applyFilters() {
    const category = categorySelect.value;
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;
    const sortBy = sortSelect.value;

    filteredProducts = techStoreProducts.filter((product) => {
      if (
        category !== "all" &&
        !product.category.toLowerCase().includes(category.toLowerCase())
      ) {
        return false;
      }
      if (product.price < minPrice || product.price > maxPrice) {
        return false;
      }
      return true;
    });

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default: // featured
        filteredProducts.sort((a, b) => {
          // Sort by badge first (Best Seller > Top Rated > no badge)
          if (a.badge && !b.badge) return -1;
          if (!a.badge && b.badge) return 1;
          if (a.badge === "Best Seller" && b.badge !== "Best Seller") return -1;
          if (a.badge !== "Best Seller" && b.badge === "Best Seller") return 1;
          // Then by rating
          return b.rating - a.rating;
        });
        break;
    }

    renderProducts();
    updateFilterCounts();
  }

  function renderProducts() {
    if (filteredProducts.length === 0) {
      productsGrid.innerHTML = `
                <div class="tech-store-no-results">
                    <p>No products found matching your criteria.</p>
                    <button onclick="resetFilters()" class="tech-store-reset-button">Reset Filters</button>
                </div>
            `;
    } else {
      productsGrid.innerHTML = filteredProducts.map(createProductCard).join("");
      attachCompareListeners();
    }
  }

  function updateFilterCounts() {
    const categoryCount = {};
    techStoreProducts.forEach((product) => {
      const category = product.category.toLowerCase();
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Update category options with counts
    Array.from(categorySelect.options).forEach((option) => {
      const value = option.value;
      if (value !== "all") {
        const count = categoryCount[value] || 0;
        option.textContent = `${option.textContent.split(" (")[0]} (${count})`;
      }
    });
  }

  function attachCompareListeners() {
    const compareButtons = document.querySelectorAll(
      ".tech-store-compare-button"
    );
    compareButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const productId = this.dataset.productId;
        handleCompare(productId);
      });
    });
  }

  function handleCompare(productId) {
    // Store selected products in localStorage for comparison
    const compareList = JSON.parse(
      localStorage.getItem("techStoreCompare") || "[]"
    );

    if (compareList.includes(productId)) {
      // Remove from comparison
      const index = compareList.indexOf(productId);
      compareList.splice(index, 1);
      document.querySelector(`[data-product-id="${productId}"]`).textContent =
        "Compare";
    } else {
      // Add to comparison (max 3 items)
      if (compareList.length >= 3) {
        alert(
          "You can compare up to 3 products at a time. Please remove a product first."
        );
        return;
      }
      compareList.push(productId);
      document.querySelector(`[data-product-id="${productId}"]`).textContent =
        "Remove";
    }

    localStorage.setItem("techStoreCompare", JSON.stringify(compareList));
    updateCompareCount();
  }

  function updateCompareCount() {
    const compareList = JSON.parse(
      localStorage.getItem("techStoreCompare") || "[]"
    );
    const compareCount = compareList.length;

    // Update compare count in UI if you have a counter element
    const counterElement = document.querySelector(".tech-store-compare-count");
    if (counterElement) {
      counterElement.textContent = compareCount;
      counterElement.style.display = compareCount > 0 ? "block" : "none";
    }
  }

  function resetFilters() {
    categorySelect.value = "all";
    minPriceInput.value = "";
    maxPriceInput.value = "";
    sortSelect.value = "featured";
    applyFilters();
  }

  // Event listeners
  categorySelect.addEventListener("change", applyFilters);
  minPriceInput.addEventListener("input", applyFilters);
  maxPriceInput.addEventListener("input", applyFilters);
  sortSelect.addEventListener("change", applyFilters);

  // Initialize
  updateFilterCounts();
  renderProducts();
  updateCompareCount();

  // Export functions for global use
  window.resetFilters = resetFilters;
});
