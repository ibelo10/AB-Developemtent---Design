// Initialize AOS
AOS.init({
    duration: 800,
    offset: 100,
    once: true
});

// Add structured data dynamically
const addStructuredData = () => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    const data = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "Why should I own a domain name?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Owning a domain name provides brand protection, improves SEO, enables professional email addresses, and gives you complete control over your online presence."
            }
        }, {
            "@type": "Question",
            "name": "How much does a domain name cost?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Domain names are very affordable, starting at just $6.49 for the first year for a .com domain."
            }
        }, {
            "@type": "Question",
            "name": "What are the benefits of having your own domain?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Benefits include professional branding, improved SEO, custom email addresses, full control over your online presence, and the ability to create unlimited subdomains for marketing campaigns."
            }
        }]
    };
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
};

// Call function after DOM loads
document.addEventListener('DOMContentLoaded', addStructuredData);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Add intersection observer for fade-in effects
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in effect
document.querySelectorAll('.benefit-card, .additional-benefits, .cta-section').forEach(el => {
    observer.observe(el);
});

// Track CTA clicks
const trackCTAClick = () => {
    const ctaButton = document.querySelector('.affiliate-link');
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            // Add your analytics tracking code here
            console.log('CTA clicked');
        });
    }
};

// Initialize tracking
document.addEventListener('DOMContentLoaded', trackCTAClick);
