// Initialize AOS (Animate On Scroll)
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
        "@type": "Article",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://abdevndesign.com/blog/domain-name"
        },
        "headline": "Why Own Your Domain Name: Complete Guide to Digital Identity",
        "description": "Learn everything about domain names - from choosing the perfect domain to building your brand.",
        "image": "assets/images/domain-blog-thumbnail.png",
        "author": {
            "@type": "Organization",
            "name": "AB Development & Design"
        },
        "publisher": {
            "@type": "Organization",
            "name": "AB Development & Design",
            "logo": {
                "@type": "ImageObject",
                "url": "assets/images/ABLogo.png"
            }
        },
        "datePublished": "2024-11-29",
        "dateModified": "2024-11-29"
    };
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    // Add FAQ structured data
    const faqScript = document.createElement('script');
    faqScript.type = 'application/ld+json';
    const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
            "@type": "Question",
            "name": "How long does it take to register a domain?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Domain registration is instant. Your domain will be active within 24-48 hours globally."
            }
        }, {
            "@type": "Question",
            "name": "Can I transfer my domain later?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, domains can be transferred to different registrars after 60 days of registration."
            }
        }, {
            "@type": "Question",
            "name": "What's domain privacy protection?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Domain privacy protection keeps your personal information hidden from the public WHOIS database, protecting you from spam and unwanted solicitations."
            }
        }]
    };
    faqScript.textContent = JSON.stringify(faqData);
    document.head.appendChild(faqScript);
};

// Call structured data function after DOM loads
document.addEventListener('DOMContentLoaded', addStructuredData);

// Navbar scroll effect
const handleNavbarScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleNavbarScroll);

// Mobile menu functionality
const setupMobileMenu = () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const icon = mobileMenuBtn.querySelector('i');

    const toggleMenu = () => {
        navLinks.classList.toggle('active');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
};

// Domain availability checker functionality
const setupDomainChecker = () => {
    const form = document.querySelector('.checker-form');
    const input = form.querySelector('input');
    const button = form.querySelector('button');

    button.addEventListener('click', (e) => {
        e.preventDefault();
        const domain = input.value.trim();
        if (!domain) {
            alert('Please enter a domain name');
            return;
        }
        // In a real implementation, this would make an API call to check domain availability
        window.open(`https://shareasale.com/u.cfm?d=1232940&m=46483&u=3531460&afftrack=search_${domain}`, '_blank');
    });

    // Add enter key support
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            button.click();
        }
    });
};

// Track CTA clicks
const setupAnalytics = () => {
    const trackClick = (element, label) => {
        if (element) {
            element.addEventListener('click', () => {
                // In a real implementation, this would send data to your analytics service
                console.log(`CTA clicked: ${label}`);
            });
        }
    };

    trackClick(document.querySelector('.price-tag'), 'hero_cta');
    trackClick(document.querySelector('.affiliate-link'), 'bottom_cta');
};

// FAQ accordion functionality
const setupFAQ = () => {
    const details = document.querySelectorAll('details');
    details.forEach(detail => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                // Close other open details
                details.forEach(otherDetail => {
                    if (otherDetail !== detail && otherDetail.open) {
                        otherDetail.open = false;
                    }
                });
            }
        });
    });
};

// Performance optimization
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
};

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupDomainChecker();
    setupAnalytics();
    setupFAQ();
    lazyLoadImages();
});

// Add smooth scrolling for anchor links to
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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
