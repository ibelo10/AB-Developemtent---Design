// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS with custom settings
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: 'ease-out',
        disable: 'mobile' // Better performance on mobile
    });

    // Initialize all components
    initNavigation();
    initAnimations();
    initScrollEffects();
    initFAQ();
    initCostCalculator();
});

// Navigation functionality
function initNavigation() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    // Mobile menu toggle
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.setAttribute('aria-expanded', 
                navLinks.classList.contains('active'));
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Hide/Show navbar on scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

// Animations and counters
function initAnimations() {
    // Animate statistics when in view
    const stats = document.querySelectorAll('.insight-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach(stat => statsObserver.observe(stat));
}

function animateValue(element) {
    const value = parseFloat(element.textContent);
    const duration = 2000;
    const steps = 60;
    let current = 0;
    const increment = value / steps;
    const isPercentage = element.textContent.includes('%');
    
    function update() {
        current += increment;
        if (current < value) {
            element.textContent = `${current.toFixed(1)}${isPercentage ? '%' : ''}`;
            requestAnimationFrame(update);
        } else {
            element.textContent = `${value}${isPercentage ? '%' : ''}`;
        }
    }
    
    requestAnimationFrame(update);
}

// Smooth scroll functionality
function initScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update URL without scroll
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        
        summary.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.hasAttribute('open')) {
                    otherItem.removeAttribute('open');
                }
            });
            
            // Toggle current item
            item.toggleAttribute('open');
        });
    });
}

// Cost calculator functionality
function initCostCalculator() {
    const costCards = document.querySelectorAll('.cost-card');
    
    costCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
        });
    });
}

// Performance optimizations
document.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        document.body.style.setProperty('--scroll', scrolled);
    });
}, { passive: true });

// Handle errors gracefully
window.addEventListener('error', (e) => {
    console.error('JS Error:', e.message);
    // Implement error tracking here if needed
});

// Cleanup function for SPA
function cleanup() {
    AOS.refresh();
    // Add any cleanup code here
}

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        cleanup,
        initNavigation,
        initAnimations,
        initScrollEffects,
        initFAQ,
        initCostCalculator
    };
}