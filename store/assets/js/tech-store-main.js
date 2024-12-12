document.addEventListener("DOMContentLoaded", function() {
    const productsGrid = document.getElementById("products-grid");
    const categorySelect = document.getElementById("category");
    const minPriceInput = document.getElementById("minPrice");
    const maxPriceInput = document.getElementById("maxPrice");
    const sortSelect = document.getElementById("sort");
    let filteredProducts = [...techStoreProducts];

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
            <div class="product-card">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
                <div class="product-image">
                    <img src="https://via.placeholder.com/280x200" alt="${product.name}">
                </div>
                <div class="product-details">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <span class="price-badge">$${product.price}</span>
                    <div class="rating">
                        ${renderStars(product.rating)}
                        <span>(${product.rating}/5)</span>
                    </div>
                    <ul class="product-features">
                        ${product.features.map(feature => `<li>${feature}</li>`).join("")}
                    </ul>
                    <div class="action-buttons">
                        <a href="${product.amazonUrl}" class="view-button" target="_blank" rel="noopener">View on Amazon</a>
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

        filteredProducts = techStoreProducts.filter(product => {
            if (category !== "all" && !product.category.toLowerCase().includes(category.toLowerCase())) {
                return false;
            }
            if (product.price < minPrice || product.price > maxPrice) {
                return false;
            }
            return true;
        });

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
        }

        renderProducts();
    }

    function renderProducts() {
        if (filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results">
                    <p>No products found matching your criteria.</p>
                    <button onclick="resetFilters()" class="reset-button">Reset Filters</button>
                </div>
            `;
        } else {
            productsGrid.innerHTML = filteredProducts.map(createProductCard).join("");
        }
    }

    // Event listeners
    categorySelect.addEventListener("change", applyFilters);
    minPriceInput.addEventListener("input", applyFilters);
    maxPriceInput.addEventListener("input", applyFilters);
    sortSelect.addEventListener("change", applyFilters);

    // Initial render
    renderProducts();
});
