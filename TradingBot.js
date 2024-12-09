// Mobile Navigation Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Price Toggle (if implementing monthly/annual pricing)
const priceToggle = document.querySelector('.price-toggle');
const prices = document.querySelectorAll('.price');

if (priceToggle) {
    priceToggle.addEventListener('change', () => {
        prices.forEach(price => {
            price.classList.toggle('annual');
        });
    });
}