/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // Counter Animation
    function animateValue(id, start, end, duration) {
        const obj = document.getElementById(id);
        const range = end - start;
        const increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            obj.textContent = current + (id === 'savingsCounter' ? '%' : '+');
            if (current === end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    // Start counters when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue('savingsCounter', 0, 40, 2000);
                animateValue('productsCounter', 0, 1000, 2000);
                animateValue('customersCounter', 0, 500, 2000);
                observer.unobserve(entry.target);
            }
        });
    });

    observer.observe(document.querySelector('.stats-container'));

    // Countdown Timer
    const launchDate = new Date('2024-12-31T23:59:59').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = launchDate - now;

        document.getElementById('days').textContent = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById('hours').textContent = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById('minutes').textContent = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById('seconds').textContent = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Form Submission
    document.getElementById('waitlistForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input[type="email"]').value;
        // Add your email collection logic here
        alert('Thanks for joining our waitlist! We\'ll notify you when we launch.');
        e.target.reset();
    });

    // Notification Button
    document.getElementById('notifyBtn').addEventListener('click', () => {
        const emailInput = document.querySelector('input[type="email"]');
        emailInput.scrollIntoView({ behavior: 'smooth' });
        emailInput.focus();
    });
});
