document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
        easing: 'ease-in-out'
    });

    // Animated Background Handling
    const background = document.querySelector('.animated-background');
    
    // Mouse move handler for desktop
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        background.style.setProperty('--x', `${x}%`);
        background.style.setProperty('--y', `${y}%`);
    });

    // Touch handler for mobile
    document.addEventListener('touchmove', (e) => {
        if (e.touches[0]) {
            const x = (e.touches[0].clientX / window.innerWidth) * 100;
            const y = (e.touches[0].clientY / window.innerHeight) * 100;
            background.style.setProperty('--touch-x', `${x}%`);
            background.style.setProperty('--touch-y', `${y}%`);
        }
    });

    // Interactive elements touch animation
    const interactiveElements = document.querySelectorAll('.insight-card, .value-card, .benefit-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('touchstart', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.touches[0].clientX - rect.left;
            const y = e.touches[0].clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.classList.add('touch-ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('active');
            }
        });
    }

    // FAQ Accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.hasAttribute('open')) {
                    otherItem.removeAttribute('open');
                }
            });
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});