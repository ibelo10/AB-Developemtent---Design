document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const pageCountSlider = document.getElementById('pageCount');
    const trafficCountSlider = document.getElementById('trafficCount');
    const pageValue = document.getElementById('pageValue');
    const trafficValue = document.getElementById('trafficValue');
    
    // Cost elements
    const builderYearOne = document.getElementById('builderYearOne');
    const builderRecurring = document.getElementById('builderRecurring');
    const builderTotal = document.getElementById('builderTotal');
    const customYearOne = document.getElementById('customYearOne');
    const customRecurring = document.getElementById('customRecurring');
    const customTotal = document.getElementById('customTotal');
    const totalSavings = document.getElementById('totalSavings');

    // Base costs
    const costs = {
        builder: {
            platformFee: 432,
            setup: 500,
            templates: 199,
            apps: 299,
            storage: 96,
            maintenance: 200
        },
        custom: {
            development: 2500,
            hosting: 100,
            domain: 15
        }
    };

    // Formatter functions
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    function formatNumber(num) {
        return new Intl.NumberFormat('en-US').format(num);
    }

    // Calculate costs based on page count and traffic
    function calculateCosts() {
        const pages = parseInt(pageCountSlider.value);
        const traffic = parseInt(trafficCountSlider.value);

        // Calculate builder costs
        const builderStorageMultiplier = Math.ceil(pages / 100);
        const builderYearOneCost = 
            costs.builder.platformFee + 
            costs.builder.setup + 
            costs.builder.templates + 
            (costs.builder.storage * builderStorageMultiplier);

        const builderRecurringCost = 
            costs.builder.platformFee + 
            (costs.builder.storage * builderStorageMultiplier) + 
            costs.builder.maintenance;

        const builderTotalCost = builderYearOneCost + (builderRecurringCost * 2);

        // Calculate custom development costs
        const customHostingMultiplier = Math.ceil(traffic / 10000);
        const customYearOneCost = 
            costs.custom.development + 
            (costs.custom.hosting * customHostingMultiplier) + 
            costs.custom.domain;

        const customRecurringCost = 
            (costs.custom.hosting * customHostingMultiplier) + 
            costs.custom.domain;

        const customTotalCost = customYearOneCost + (customRecurringCost * 2);

        // Update the DOM
        builderYearOne.textContent = formatCurrency(builderYearOneCost);
        builderRecurring.textContent = formatCurrency(builderRecurringCost);
        builderTotal.textContent = formatCurrency(builderTotalCost);
        
        customYearOne.textContent = formatCurrency(customYearOneCost);
        customRecurring.textContent = formatCurrency(customRecurringCost);
        customTotal.textContent = formatCurrency(customTotalCost);

        // Calculate and display savings
        const savings = builderTotalCost - customTotalCost;
        totalSavings.textContent = formatCurrency(Math.abs(savings));
        totalSavings.style.color = savings > 0 ? '#4CAF50' : '#f44336';
    }

    // Event listeners for sliders
    pageCountSlider.addEventListener('input', function() {
        pageValue.textContent = `${formatNumber(this.value)} pages`;
        calculateCosts();
    });

    trafficCountSlider.addEventListener('input', function() {
        trafficValue.textContent = `${formatNumber(this.value)} visitors`;
        calculateCosts();
    });

    // Initialize calculations
    calculateCosts();

    // Optional: Add animations for cost changes
    function animateValue(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const value = start + (range * progress);
            element.textContent = formatCurrency(Math.round(value));
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    // Optional: Add tooltip functionality
    document.querySelectorAll('.tooltip-trigger').forEach(trigger => {
        trigger.addEventListener('mouseenter', function() {
            const tooltip = this.nextElementSibling;
            tooltip.style.display = 'block';
        });
        
        trigger.addEventListener('mouseleave', function() {
            const tooltip = this.nextElementSibling;
            tooltip.style.display = 'none';
        });
    });
});