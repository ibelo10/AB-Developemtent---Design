// Utility Functions
const utils = {
    // DOM element selection with error handling
    select: (selector, parent = document) => {
        const element = parent.querySelector(selector);
        if (!element) console.warn(`Cannot find element: ${selector}`);
        return element;
    },
    
    selectAll: (selector, parent = document) => {
        return [...parent.querySelectorAll(selector)];
    },

    // Debounce function for performance
    debounce: (fn, delay = 300) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    },

    // Throttle function for performance
    throttle: (fn, delay = 300) => {
        let shouldWait = false;
        return (...args) => {
            if (shouldWait) return;
            fn(...args);
            shouldWait = true;
            setTimeout(() => {
                shouldWait = false;
            }, delay);
        };
    },

    // Add event listener with automatic cleanup
    addEvent: (element, event, handler, options = {}) => {
        element.addEventListener(event, handler, options);
        return () => element.removeEventListener(event, handler, options);
    }
};

// Main Application Class
class App {
    constructor() {
        // Initialize state
        this.state = {
            menuOpen: false,
            currentSection: null,
            lastScrollPosition: 0,
            isScrollingDown: false
        };

        // Cache DOM elements
        this.elements = {
            header: utils.select('header'),
            nav: utils.select('.navbar'),
            mobileMenuBtn: utils.select('.mobile-menu-btn'),
            navLinks: utils.select('.nav-links'),
            sections: utils.selectAll('section[id]'),
            faqItems: utils.selectAll('.faq-item'),
            backToTop: utils.select('#back-to-top'),
            cookieConsent: utils.select('#cookie-consent'),
            forms: utils.selectAll('form'),
            animatedElements: utils.selectAll('[data-aos]')
        };

        // Initialize components
        this.initializeComponents();
        this.setupEventListeners();
    }

    initializeComponents() {
        // Initialize third-party libraries
        this.initAOS();
        this.initLazyLoading();
        
        // Initialize custom components
        this.initNavigation();
        this.initScrollEffects();
        this.initFAQ();
        this.initCookieConsent();
        this.initForms();
        this.initAnimations();
    }

    initAOS() {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }

    initLazyLoading() {
        const lazyImages = utils.selectAll('img[loading="lazy"]');
        if ('loading' in HTMLImageElement.prototype) {
            // Browser supports native lazy loading
            return;
        }
        // Fallback for browsers that don't support native lazy loading
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => lazyLoadObserver.observe(img));
    }

    initNavigation() {
        const { mobileMenuBtn, navLinks, nav } = this.elements;

        utils.addEvent(mobileMenuBtn, 'click', () => {
            this.state.menuOpen = !this.state.menuOpen;
            navLinks.classList.toggle('active', this.state.menuOpen);
            mobileMenuBtn.setAttribute('aria-expanded', this.state.menuOpen);
        });

        // Close menu when clicking outside
        utils.addEvent(document, 'click', (e) => {
            if (this.state.menuOpen && !nav.contains(e.target)) {
                this.state.menuOpen = false;
                navLinks.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Smooth scroll for navigation links
        utils.selectAll('a[href^="#"]').forEach(link => {
            utils.addEvent(link, 'click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = utils.select(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Update URL without scroll
                    history.pushState(null, '', targetId);
                }
            });
        });
    }

    initScrollEffects() {
        const handleScroll = utils.throttle(() => {
            const currentScroll = window.pageYOffset;
            
            // Handle header visibility
            this.state.isScrollingDown = currentScroll > this.state.lastScrollPosition;
            this.elements.header.classList.toggle('hidden', this.state.isScrollingDown);
            this.state.lastScrollPosition = currentScroll;

            // Handle back to top button visibility
            this.elements.backToTop.hidden = currentScroll < 400;

            // Handle active section highlighting
            this.updateActiveSection();
        }, 100);

        utils.addEvent(window, 'scroll', handleScroll);
        
        // Back to top functionality
        utils.addEvent(this.elements.backToTop, 'click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    updateActiveSection() {
        const { sections } = this.elements;
        const activeSection = [...sections].reverse().find(section => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 100;
        });

        if (activeSection && activeSection.id !== this.state.currentSection) {
            this.state.currentSection = activeSection.id;
            this.updateNavHighlight(activeSection.id);
        }
    }

    updateNavHighlight(sectionId) {
        utils.selectAll('.nav-links a').forEach(link => {
            const isActive = link.getAttribute('href') === `#${sectionId}`;
            link.classList.toggle('active', isActive);
            if (isActive) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.removeAttribute('aria-current');
            }
        });
    }

    initFAQ() {
        this.elements.faqItems.forEach(item => {
            const summary = item.querySelector('summary');
            const content = item.querySelector('.faq-answer');

            utils.addEvent(summary, 'click', (e) => {
                e.preventDefault();
                const isOpen = item.hasAttribute('open');

                // Close other open items
                this.elements.faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.hasAttribute('open')) {
                        otherItem.removeAttribute('open');
                    }
                });

                // Toggle current item
                if (isOpen) {
                    item.removeAttribute('open');
                } else {
                    item.setAttribute('open', '');
                }
            });
        });
    }

    initCookieConsent() {
        const { cookieConsent } = this.elements;
        if (!localStorage.getItem('cookieConsent')) {
            cookieConsent.hidden = false;
        }
    }

    acceptCookies() {
        localStorage.setItem('cookieConsent', 'accepted');
        this.elements.cookieConsent.hidden = true;
    }

    rejectCookies() {
        localStorage.setItem('cookieConsent', 'rejected');
        this.elements.cookieConsent.hidden = true;
    }

    initForms() {
        this.elements.forms.forEach(form => {
            utils.addEvent(form, 'submit', this.handleFormSubmit.bind(this));
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);

        try {
            submitButton.disabled = true;
            submitButton.innerHTML = 'Submitting...';

            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Submission failed');

            const data = await response.json();
            this.showNotification('Success!', 'Your submission has been received.', 'success');
            form.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showNotification('Error', 'Something went wrong. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Submit';
        }
    }

    showNotification(title, message, type = 'info') {
        // Implementation of notification system
        console.log(`${type}: ${title} - ${message}`);
    }

    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        this.elements.animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    setupEventListeners() {
        // Handle window resize
        utils.addEvent(window, 'resize', utils.debounce(() => {
            // Update any necessary responsive elements
            AOS.refresh();
        }, 250));

        // Handle print media change
        utils.addEvent(window.matchMedia('print'), 'change', (e) => {
            if (e.matches) {
                // Prepare page for printing
                this.handlePrintMode();
            }
        });

        // Handle reduced motion preference
        utils.addEvent(window.matchMedia('(prefers-reduced-motion: reduce)'), 'change', (e) => {
            if (e.matches) {
                // Disable animations
                this.handleReducedMotion();
            }
        });
    }

    handlePrintMode() {
        // Expand all collapsed sections for printing
        this.elements.faqItems.forEach(item => item.setAttribute('open', ''));
    }

    handleReducedMotion() {
        // Disable animations
        AOS.init({ disable: true });
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}