// Initialize Ripple Effect on Hero Container
$(document).ready(function() {
    try {
        $('.hero-container').ripples({
            resolution: 512,
            dropRadius: 20,
            perturbance: 0.04
        });
    } catch (e) {
        console.log('Ripples effect not supported on this device');
    }
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Scrolling Text Animation
const scrollingText = document.querySelector('.scrolling-text__item');
const phrases = [
    'build innovative solutions',
    'create amazing experiences',
    'design the future',
    'develop with passion'
];

let currentPhraseIndex = 0;

function updateScrollingText() {
    scrollingText.style.opacity = '0';
    
    setTimeout(() => {
        scrollingText.textContent = phrases[currentPhraseIndex];
        scrollingText.style.opacity = '1';
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
    }, 500);
}

// Initial text update
updateScrollingText();

// Update text every 3 seconds
setInterval(updateScrollingText, 3000);

// Navigation Active State
function updateActiveNavLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Update active state on page load
document.addEventListener('DOMContentLoaded', updateActiveNavLink);

// Add scroll event listener for navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// Add loader for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
});

// Handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields');
            }
        });
    });
});