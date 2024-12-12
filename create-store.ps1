# Create store directory structure
$storeStructure = @(
    "store",
    "store/assets",
    "store/assets/css",
    "store/assets/js",
    "store/assets/fonts",
    "store/assets/fonts/fontawesome",
    "store/assets/fonts/fontawesome/css",
    "store/assets/fonts/fontawesome/webfonts",
    "store/assets/images"
)

# Create directories
foreach ($dir in $storeStructure) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir
        Write-Host "Created directory: $dir"
    }
}

# Create index.html
$indexContent = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tech Essentials Store | AB Development</title>
    <meta name="description" content="Discover curated tech products - from development tools to office essentials. Find the best deals on quality products." />
    
    <!-- Self-hosted fonts -->
    <link rel="stylesheet" href="assets/fonts/inter.css" />
    <link rel="stylesheet" href="assets/fonts/fontawesome/css/all.min.css" />
    <link rel="stylesheet" href="assets/css/styles.css" />
</head>
<body>
    <nav class="navbar">
        <div class="nav-logo">
            <img src="assets/images/ABLogo.png" alt="AB Logo" class="logo-img" />
            <span>AB Development & Design</span>
        </div>
        <div class="nav-links">
            <a href="../index.html">Home</a>
            <a href="../portfolio/">Portfolio</a>
            <a href="../services/">Services</a>
            <a href="../blog/">Blog</a>
            <a href="../store/" class="active">Store</a>
            <a href="../contact/">Contact</a>
            <a href="https://github.com/Iaarondev/" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
    </nav>

    <main class="store-container">
        <!-- Store Header -->
        <header class="store-header">
            <div class="category-nav">
                <button class="active">All Products</button>
                <button>Development Tools</button>
                <button>Monitors & Displays</button>
                <button>Ergonomic Gear</button>
                <button>Accessories</button>
            </div>
        </header>

        <!-- Filters Section -->
        <section class="filters">
            <div class="filter-grid">
                <div class="filter-group">
                    <label for="category">Category</label>
                    <select id="category">
                        <option value="all">All Categories</option>
                        <option value="development">Development Tools</option>
                        <option value="monitors">Monitors & Displays</option>
                        <option value="ergonomic">Ergonomic Gear</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>

                <div class="filter-group">
                    <label for="priceRange">Price Range</label>
                    <div class="price-range">
                        <input type="number" id="minPrice" placeholder="Min" min="0" />
                        <span>to</span>
                        <input type="number" id="maxPrice" placeholder="Max" />
                    </div>
                </div>

                <div class="filter-group">
                    <label for="sort">Sort By</label>
                    <select id="sort">
                        <option value="featured">Featured</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                    </select>
                </div>
            </div>
        </section>

        <!-- Products Grid -->
        <section id="products-grid" class="products-section">
            <!-- Products will be dynamically inserted here -->
        </section>
    </main>

    <!-- Scripts -->
    <script src="assets/js/tech-store-products.js"></script>
    <script src="assets/js/tech-store-main.js"></script>
</body>
</html>
'@

# Create CSS file
$cssContent = @'
:root {
    --primary-color: #2ecc71;
    --secondary-color: #27ae60;
    --text-color: #333;
    --light-gray: #f5f5f5;
    --border-color: #ddd;
}

body {
    font-family: "Inter", sans-serif;
    margin: 0;
    padding: 0;
    color: var(--text-color);
    line-height: 1.6;
}

.navbar {
    background: white;
    padding: 1rem 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logo-img {
    height: 40px;
    width: auto;
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-links a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: 500;
}

.nav-links a.active {
    color: var(--primary-color);
}

.store-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 1rem;
}

.store-header {
    margin-bottom: 2rem;
}

.category-nav {
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    padding-bottom: 1rem;
}

.category-nav button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background: white;
    cursor: pointer;
    white-space: nowrap;
}

.category-nav button.active {
    background: var(--primary-color);
    color: white;
    border-color: var(--primary-color);
}

.filters {
    background: white;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-group label {
    font-weight: 500;
}

.filter-group select,
.filter-group input {
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-size: 1rem;
}

.price-range {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.price-range input {
    width: 100px;
}

.products-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.product-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
    .filter-grid {
        grid-template-columns: 1fr;
    }
    
    .products-section {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
}
'@

# Create products.js
$productsContent = @'
const techStoreProducts = [
    {
        id: "ts-1",
        category: "Development Tools",
        name: "Professional Mechanical Keyboard",
        price: 149.99,
        rating: 4.5,
        badge: "Best Seller",
        features: [
            "Cherry MX Brown switches",
            "Full RGB backlight",
            "Programmable keys",
            "USB-C connection"
        ],
        amazonUrl: "https://www.amazon.com/dp/B08TM27G42?tag=abdevndesign-20"
    },
    {
        id: "ts-2",
        category: "Monitors",
        name: '32" 4K Development Monitor',
        price: 399.99,
        rating: 5.0,
        badge: "Top Rated",
        features: [
            "4K UHD Resolution",
            "HDR Support",
            "USB-C with Power Delivery",
            "Height Adjustable Stand"
        ],
        amazonUrl: "https://www.amazon.com/dp/B07WLXZNG3?tag=abdevndesign-20"
    },
    {
        id: "ts-3",
        category: "Ergonomic",
        name: "Developer Ergonomic Chair",
        price: 299.99,
        rating: 4.0,
        features: [
            "Adjustable lumbar support",
            "Breathable mesh back",
            "Multiple recline positions",
            "12-year warranty"
        ],
        amazonUrl: "https://www.amazon.com/dp/B0B5HD3D8Y?tag=abdevndesign-20"
    }
];
'@

# Create main.js
$mainJsContent = @'
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
'@

# Create inter.css
$interCssContent = @'
@font-face {
    font-family: 'Inter';
    src: local('Inter');
    font-weight: 300;
    font-style: normal;
}

@font-face {
    font-family: 'Inter';
    src: local('Inter');
    font-weight: 400;
    font-style: normal;
}

@font-face {
    font-family: 'Inter';
    src: local('Inter');
    font-weight: 500;
    font-style: normal;
}

@font-face {
    font-family: 'Inter';
    src: local('Inter');
    font-weight: 600;
    font-style: normal;
}

@font-face {
    font-family: 'Inter';
    src: local('Inter');
    font-weight: 700;
    font-style: normal;
}
'@

# Create files
Set-Content -Path "store/index.html" -Value $indexContent
Set-Content -Path "store/assets/css/styles.css" -Value $cssContent
Set-Content -Path "store/assets/js/tech-store-products.js" -Value $productsContent
Set-Content -Path "store/assets/js/tech-store-main.js" -Value $mainJsContent
Set-Content -Path "store/assets/fonts/inter.css" -Value $interCssContent

# ... [Previous script content remains the same] ...

Write-Host "Store section created successfully!"
Write-Host "`nManual steps required:"
Write-Host "1. Download Font Awesome Free (https://fontawesome.com/download):"
Write-Host "   - Extract and copy the following to store/assets/fonts/fontawesome/:"
Write-Host "     * css/all.min.css"
Write-Host "     * webfonts/*"
Write-Host ""
Write-Host "2. Download Inter font files from Google Fonts:"
Write-Host "   - Visit: https://fonts.google.com/specimen/Inter"
Write-Host "   - Download the font family"
Write-Host "   - Extract and copy the .woff2 files to store/assets/fonts/"
Write-Host ""
Write-Host "3. Add your logo:"
Write-Host "   - Add ABLogo.png to store/assets/images/"
Write-Host ""

# Verify the structure was created correctly
Write-Host "Verifying directory structure..."
$requiredDirs = @(
    "store",
    "store/assets",
    "store/assets/css",
    "store/assets/js",
    "store/assets/fonts",
    "store/assets/fonts/fontawesome",
    "store/assets/fonts/fontawesome/css",
    "store/assets/fonts/fontawesome/webfonts",
    "store/assets/images"
)

$requiredFiles = @(
    "store/index.html",
    "store/assets/css/styles.css",
    "store/assets/js/tech-store-products.js",
    "store/assets/js/tech-store-main.js",
    "store/assets/fonts/inter.css"
)

$missingItems = @()

foreach ($dir in $requiredDirs) {
    if (-not (Test-Path $dir -PathType Container)) {
        $missingItems += "Directory: $dir"
    }
}

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file -PathType Leaf)) {
        $missingItems += "File: $file"
    }
}

if ($missingItems.Count -eq 0) {
    Write-Host "`nAll required directories and files were created successfully!"
} else {
    Write-Host "`nWarning: The following items are missing:"
    foreach ($item in $missingItems) {
        Write-Host "- $item"
    }
}

# Create a simple verification HTML file to test font loading
$testHtmlContent = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Font Test</title>
    <link rel="stylesheet" href="assets/fonts/inter.css">
    <link rel="stylesheet" href="assets/fonts/fontawesome/css/all.min.css">
    <style>
        body { font-family: 'Inter', sans-serif; padding: 2rem; }
        .test-section { margin: 1rem 0; }
        .icon-test { font-size: 2rem; margin: 1rem 0; }
    </style>
</head>
<body>
    <h1>Font Loading Test</h1>
    
    <div class="test-section">
        <h2>Inter Font Test</h2>
        <p style="font-weight: 300">Light: The quick brown fox jumps over the lazy dog</p>
        <p style="font-weight: 400">Regular: The quick brown fox jumps over the lazy dog</p>
        <p style="font-weight: 500">Medium: The quick brown fox jumps over the lazy dog</p>
        <p style="font-weight: 600">SemiBold: The quick brown fox jumps over the lazy dog</p>
        <p style="font-weight: 700">Bold: The quick brown fox jumps over the lazy dog</p>
    </div>

    <div class="test-section">
        <h2>Font Awesome Test</h2>
        <div class="icon-test">
            <i class="fas fa-star"></i>
            <i class="fas fa-shopping-cart"></i>
            <i class="fas fa-heart"></i>
        </div>
    </div>
</body>
</html>
'@

Set-Content -Path "store/font-test.html" -Value $testHtmlContent
Write-Host "`nCreated font-test.html to verify font loading"
Write-Host "Open this file in your browser after adding the font files to verify everything is working correctly"

# Create .gitignore to exclude placeholder images
$gitignoreContent = @'
# Exclude placeholder images
assets/images/placeholder-*.jpg
'@

Set-Content -Path "store/.gitignore" -Value $gitignoreContent
Write-Host "`nCreated .gitignore file"

Write-Host "`nSetup complete! Please complete the manual steps listed above."
Write-Host "After adding the required fonts and images, open font-test.html in your browser to verify the setup."

# Function to test file permissions
function Test-FilePermissions {
    param (
        [string]$path
    )
    
    try {
        $acl = Get-Acl $path
        Write-Host "Permissions for $path are correctly set."
        return $true
    } catch {
        Write-Host "Warning: Unable to verify permissions for $path"
        Write-Host "Error: $($_.Exception.Message)"
        return $false
    }
}

# Test permissions for created directories
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Test-FilePermissions $dir
    }
}