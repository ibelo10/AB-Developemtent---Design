# PowerShell script for setting up Chef 24/7 Kitchen Drip Website
# PowerShell script for setting up Chef 24/7 Kitchen Drip Website
# Add timestamp to log file name
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$logFile = "setup_log_$timestamp.txt"

# Function to write to console and log file
function Write-Log {
    param($Message)
    Write-Host $Message
    Add-Content -Path $logFile -Value $Message
}

# Function to create a file if it doesn't exist
function New-FileIfNotExists {
    param (
        [string]$Path,
        [string]$Content,
        [string]$Description
    )

    try {
        if (-not (Test-Path $Path)) {
            $Content | Out-File -FilePath $Path -Encoding UTF8
            Write-Log "✓ Created $Description"
        } else {
            Write-Log "⚠ $Description already exists, skipping..."
        }
    } catch {
        Write-Log "❌ Error creating ${Description}: $_"
    }
} # Ensure this closing brace exists




# Check if assets folder exists
Write-Log "Setting up Chef 24/7 Kitchen Drip Website..."

if (-not (Test-Path "assets")) {
    Write-Log "❌ Error: 'assets' folder not found!"
    exit 1
}

# Create required directories
@("assets/css", "assets/js", "assets/images", "assets/fonts") | ForEach-Object {
    if (-not (Test-Path $_)) {
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
        Write-Log "✓ Created directory: $_"
    }
}

# CSS Content Variables
$MAIN_CSS = @'
/* Light and Dark Theme Variables */
:root {
    /* Light Theme */
    --deep-brown: #2C1810;
    --gold: #FFD700;
    --burgundy: #800020;
    --cream: #FFFDD0;
    --mardi-purple: #58427C;
    --dark-overlay: rgba(0, 0, 0, 0.7);
    
    /* Dark Theme */
    --dark-deep-brown: #1A0F0A;
    --dark-gold: #B8860B;
    --dark-burgundy: #4A0012;
    --dark-cream: #FFF8DC;
    --dark-mardi-purple: #3C2D54;
}

/* Dark Theme Class */
.dark-theme {
    --deep-brown: var(--dark-deep-brown);
    --gold: var(--dark-gold);
    --burgundy: var(--dark-burgundy);
    --cream: var(--dark-cream);
    --mardi-purple: var(--dark-mardi-purple);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background: var(--deep-brown);
}

::-webkit-scrollbar-thumb {
    background: var(--gold);
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--dark-gold);
}

body {
    font-family: 'Georgia', serif;
    line-height: 1.6;
    background: var(--deep-brown);
    color: white;
    overflow-x: hidden;
    min-height: 100vh;
    position: relative;
    transition: background-color 0.3s ease;
}

/* Loading Spinner */
.loading-spinner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--deep-brown);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid var(--cream);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* Theme Toggle Button */
.theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    background: var(--gold);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.theme-toggle:hover {
    transform: scale(1.1);
}

/* Rest of the main CSS content... */
'@
# Modal CSS Content
$MODAL_CSS = @'
.booking-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--deep-brown);
    z-index: 1000;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    animation: modalFade 0.3s ease-in-out;
}

@keyframes modalFade {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
}

.modal-content {
    width: 100%;
    min-height: 100%;
    padding: 2rem 1rem;
    color: white;
    position: relative;
    max-width: 800px;
    margin: 0 auto;
}

/* Progress Bar */
.form-progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.1);
    z-index: 1002;
}

.progress-bar {
    height: 100%;
    background: var(--gold);
    width: 0;
    transition: width 0.3s ease;
}

/* Enhanced Form Styling */
.form-group {
    margin-bottom: 1.5rem;
    position: relative;
    transition: transform 0.3s ease;
}

.form-group:focus-within {
    transform: translateX(10px);
}

.form-group label {
    display: block;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: var(--cream);
    font-weight: bold;
    transition: color 0.3s ease;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 1rem;
    border: 2px solid rgba(255,255,255,0.2);
    border-radius: 8px;
    background: white;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: var(--gold);
    box-shadow: 0 0 10px rgba(255,215,0,0.2);
    outline: none;
}

/* Form Validation Styles */
.form-group.error input,
.form-group.error select,
.form-group.error textarea {
    border-color: #ff4444;
}

.error-message {
    color: #ff4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: none;
}

.form-group.error .error-message {
    display: block;
    animation: shake 0.5s ease-in-out;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

/* Tool Tips */
.form-group .tooltip {
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    background: var(--gold);
    color: var(--deep-brown);
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.form-group:hover .tooltip {
    opacity: 1;
    visibility: visible;
    right: -10px;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .modal-content {
        padding: 1rem;
    }

    .form-group .tooltip {
        display: none;
    }

    .form-group:focus-within {
        transform: none;
    }
}
'@

# Animations CSS Content
$ANIMATIONS_CSS = @'
/* Floating Icons */
#floating-icons {
    position: fixed;
    width: 100%;
    height: 100vh;
    pointer-events: none;
    overflow: hidden;
    z-index: 1;
}

.floating-icon {
    position: absolute;
    animation: float 4s linear infinite;
    pointer-events: none;
    color: var(--gold);
    opacity: 0.3;
    z-index: 1;
    filter: drop-shadow(0 0 5px rgba(255,215,0,0.3));
}

@keyframes float {
    0% {
        transform: translateY(100vh) rotate(0deg) scale(1);
        opacity: 0;
    }
    10% {
        opacity: 0.3;
        transform: translateY(90vh) rotate(36deg) scale(1.1);
    }
    50% {
        transform: translateY(50vh) rotate(180deg) scale(1.2);
    }
    90% {
        opacity: 0.3;
        transform: translateY(10vh) rotate(324deg) scale(1.1);
    }
    100% {
        transform: translateY(-20vh) rotate(360deg) scale(1);
        opacity: 0;
    }
}

/* Parallax Effect */
.parallax {
    position: relative;
    overflow: hidden;
}

.parallax-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: transform 0.1s ease-out;
}

/* Card Hover Effects */
.service-card {
    transform-style: preserve-3d;
    perspective: 1000px;
}

.service-card:hover {
    transform: rotateX(10deg) rotateY(10deg) scale(1.05);
}

/* Button Animations */
.btn {
    position: relative;
    overflow: hidden;
}

.btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
}

.btn:active::after {
    width: 300px;
    height: 300px;
}

/* Loading Animations */
@keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
}

.loading {
    background: linear-gradient(
        90deg,
        rgba(255,255,255,0.1),
        rgba(255,255,255,0.2),
        rgba(255,255,255,0.1)
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
}

/* Scroll Reveal */
.reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
}

.reveal.active {
    opacity: 1;
    transform: translateY(0);
}

/* Mobile Optimizations */
@media (max-width: 768px) {
    .floating-icon {
        font-size: 1rem;
    }

    .parallax-layer {
        transform: none !important;
    }
}
'@
# Enhanced Form JavaScript Content
$FORM_JS = @'
class Chef24Form {
    constructor() {
        this.form = document.getElementById('bookingForm');
        this.progressBar = document.querySelector('.progress-bar');
        this.formGroups = document.querySelectorAll('.form-group');
        this.totalSteps = this.formGroups.length;
        this.currentStep = 0;
        this.initialize();
    }

    initialize() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.setupInputValidation();
        this.setupProgressTracking();
        this.addTooltips();
    }

    setupProgressTracking() {
        this.formGroups.forEach((group, index) => {
            const input = group.querySelector('input, select, textarea');
            if (input) {
                input.addEventListener('change', () => {
                    this.updateProgress();
                });
            }
        });
    }

    updateProgress() {
        const filledInputs = Array.from(this.form.querySelectorAll('input, select, textarea'))
            .filter(input => input.value.trim() !== '').length;
        const totalInputs = this.form.querySelectorAll('input, select, textarea').length;
        const progress = (filledInputs / totalInputs) * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    addTooltips() {
        this.formGroups.forEach(group => {
            const label = group.querySelector('label');
            if (label) {
                const tooltip = document.createElement('span');
                tooltip.className = 'tooltip';
                tooltip.textContent = label.dataset.tooltip || 'Required field';
                group.appendChild(tooltip);
            }
        });
    }

    setupInputValidation() {
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = this.formatPhoneNumber(e.target.value);
                this.validateField(e.target);
            });
        }

        // Real-time validation
        this.form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', (e) => this.validateField(e.target));
            input.addEventListener('input', () => this.updateProgress());
        });
    }

    validateField(field) {
        const group = field.closest('.form-group');
        const errorElement = group.querySelector('.error-message') || 
            this.createErrorElement(group);

        let isValid = true;
        let errorMessage = '';

        switch(field.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                errorMessage = 'Please enter a valid email address';
                break;
            case 'tel':
                isValid = /^\(\d{3}\) \d{3}-\d{4}$/.test(field.value);
                errorMessage = 'Please enter a valid phone number';
                break;
            case 'number':
                isValid = field.value > 0;
                errorMessage = 'Please enter a valid number';
                break;
            default:
                isValid = field.value.trim() !== '';
                errorMessage = 'This field is required';
        }

        if (!isValid && field.required) {
            group.classList.add('error');
            errorElement.textContent = errorMessage;
        } else {
            group.classList.remove('error');
        }

        return isValid;
    }

    createErrorElement(group) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        group.appendChild(errorElement);
        return errorElement;
    }

    formatPhoneNumber(input) {
        const cleaned = input.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return input;
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        // Validate all fields
        let isValid = true;
        this.form.querySelectorAll('input, select, textarea').forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            this.showNotification('Please fill in all required fields correctly', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            const formData = new FormData(this.form);
            const formProps = Object.fromEntries(formData);
            
            const emailBody = this.createEmailBody(formProps);
            const mailtoLink = `mailto:724chef@gmail.com?subject=Chef Request - ${formProps.name} for ${formProps.date}&body=${encodeURIComponent(emailBody)}`;
            
            window.location.href = mailtoLink;
            
            this.showNotification('Request sent successfully!', 'success');
            this.form.reset();
            this.updateProgress();
            closeBookingModal();
        } catch (error) {
            this.showNotification('Error sending request. Please try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    createEmailBody(formProps) {
        return `
New Chef Request

Client Information:
----------------
Name: ${formProps.name}
Email: ${formProps.email}
Phone: ${formProps.phone}

Event Details:
----------------
Date: ${formProps.date}
Time: ${formProps.time}
Number of Guests: ${formProps.guests}
Service Type: ${formProps.serviceType}

Special Requirements:
----------------
Dietary Restrictions:
${formProps.dietary || 'None specified'}

Additional Notes:
${formProps.notes || 'None provided'}
        `;
    }
}

// Initialize form handling
document.addEventListener('DOMContentLoaded', () => {
    new Chef24Form();
});
'@
# Enhanced Animations JavaScript Content
$ANIMATIONS_JS = @'
class Chef24Animations {
    constructor() {
        this.initialize();
        this.setupParallax();
        this.setupScrollReveal();
        this.setupThemeToggle();
    }

    initialize() {
        this.startFloatingIcons();
        this.addLoadingSpinner();
    }

    addLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(spinner);

        window.addEventListener('load', () => {
            spinner.style.opacity = '0';
            setTimeout(() => spinner.remove(), 500);
        });
    }

    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-layer');
        
        window.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            parallaxElements.forEach((element, index) => {
                const depth = (index + 1) * 0.01;
                const moveX = (clientX - centerX) * depth;
                const moveY = (clientY - centerY) * depth;
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }

    setupScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        
        const revealOnScroll = () => {
            revealElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (elementTop < windowHeight - 100) {
                    element.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Initial check
    }

    setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '🌙';
        document.body.appendChild(themeToggle);

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
            localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        });

        // Check saved theme preference
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '☀️';
        }
    }

    createFloatingIcon() {
        const icons = [
            '🌶️', '🍳', '🥘', '♪', '♫', '🎵', '🎶',
            '🍽️', '👨‍🍳', '🥄', '🍴', '🥂', '🍷',
            '⚜️', '🎭', '🎪', '🎻', '🎺', '🪗'
        ];
        
        const icon = document.createElement('div');
        icon.className = 'floating-icon';
        icon.setAttribute('aria-hidden', 'true');
        
        icon.textContent = icons[Math.floor(Math.random() * icons.length)];
        icon.style.fontSize = `${Math.random() * (32 - 20) + 20}px`;
        icon.style.left = `${Math.random() * window.innerWidth}px`;
        icon.style.animationDuration = `${Math.random() * (6 - 3) + 3}s`;
        
        document.getElementById('floating-icons').appendChild(icon);
        
        icon.addEventListener('animationend', () => icon.remove());
    }

    startFloatingIcons() {
        setInterval(() => this.createFloatingIcon(), 1000);
    }
}

// Modal Controls with enhanced animations
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0)';
    });
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.opacity = '0';
    modal.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    new Chef24Animations();
});
'@

# Enhanced Utilities JavaScript Content
$UTILS_JS = @'
const Chef24Utils = {
    formatPhoneNumber(input) {
        return input.replace(/\D/g, '')
            .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    },

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    },

    getCookie(name) {
        const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
        return match ? match[2] : null;
    },

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
};

export default Chef24Utils;
'@

# Write files
Write-Log "Creating project files..."

# Function to ensure directory exists
function New-Directory {
    param([string]$Path)
    if (-not (Test-Path $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Log "Created directory: $Path"
    }
}

# Ensure all directories exist
Ensure-Directory "assets/css"
Ensure-Directory "assets/js"
Ensure-Directory "assets/images"
Ensure-Directory "assets/fonts"

# Create CSS files
Create-FileIfNotExists -Path "assets/css/chef24-main.css" -Content $MAIN_CSS -Description "Main CSS"
Create-FileIfNotExists -Path "assets/css/chef24-modal.css" -Content $MODAL_CSS -Description "Modal CSS"
Create-FileIfNotExists -Path "assets/css/chef24-animations.css" -Content $ANIMATIONS_CSS -Description "Animations CSS"

# Create JavaScript files
Create-FileIfNotExists -Path "assets/js/chef24-form.js" -Content $FORM_JS -Description "Form JavaScript"
Create-FileIfNotExists -Path "assets/js/chef24-animations.js" -Content $ANIMATIONS_JS -Description "Animations JavaScript"
Create-FileIfNotExists -Path "assets/js/chef24-utils.js" -Content $UTILS_JS -Description "Utilities JavaScript"

# Create HTML Template
$HTML_TEMPLATE = @'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Chef 24/7 Kitchen Drip - Authentic New Orleans cuisine, private chef services, and catering in Fort Worth. Experience genuine Creole and Cajun flavors.">
    <meta name="keywords" content="New Orleans chef, Fort Worth catering, private chef, Creole food, Cajun cuisine, Louisiana cooking">
    <meta name="author" content="Chef 24/7 Kitchen Drip">
    <meta name="theme-color" content="#2C1810">
    <meta property="og:title" content="Chef 24/7 Kitchen Drip | Authentic New Orleans Cuisine">
    <meta property="og:description" content="Experience authentic New Orleans cuisine with our private chef services, catering, and cooking classes in Fort Worth.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://yourwebsite.com">
    <meta property="og:image" content="path-to-your-logo.jpg">
    
    <title>Chef 24/7 Kitchen Drip | Authentic New Orleans Private Chef & Catering</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="assets/css/chef24-main.css">
    <link rel="stylesheet" href="assets/css/chef24-modal.css">
    <link rel="stylesheet" href="assets/css/chef24-animations.css">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://www.youtube.com">
    <link rel="preconnect" href="https://www.facebook.com">
</head>
<body>
    <!-- Main content from previous HTML -->
    
    <!-- JavaScript -->
    <script type="module" src="assets/js/chef24-utils.js"></script>
    <script src="assets/js/chef24-form.js"></script>
    <script src="assets/js/chef24-animations.js"></script>
</body>
</html>
'@

Create-FileIfNotExists -Path "index.html" -Content $HTML_TEMPLATE -Description "HTML Template"

# Create gitignore
$GITIGNORE_CONTENT = @"
# System files
.DS_Store
Thumbs.db

# IDE files
.idea/
.vscode/
*.sublime-project
*.sublime-workspace

# Dependencies
node_modules/
vendor/

# Environment files
.env
.env.local
.env.*.local

# Build files
dist/
build/
*.log

# Cache
.cache/
.sass-cache/

# Temporary files
*.tmp
*.temp
*~

# Local development
*.local
"@

Create-FileIfNotExists -Path ".gitignore" -Content $GITIGNORE_CONTENT -Description ".gitignore"

# Create README
$README_CONTENT = @"
# Chef 24/7 Kitchen Drip Website

## Overview
Website for Chef 24/7 Kitchen Drip, featuring authentic New Orleans cuisine, private chef services, and catering.

## Features
- Responsive design
- Dark/Light theme
- Booking system
- Social media integration
- Animations
- Form validation

## Setup
1. Clone the repository
2. Open index.html in your browser
3. For development, use a local server

## Structure
- assets/
  - css/
  - js/
  - images/
  - fonts/
- index.html

## Development
- Main styles: assets/css/chef24-main.css
- Modal styles: assets/css/chef24-modal.css
- Animations: assets/css/chef24-animations.css
- JavaScript modules in assets/js/

## Contact
For inquiries: 724chef@gmail.com
"@

Create-FileIfNotExists -Path "README.md" -Content $README_CONTENT -Description "README"

# Final setup steps
Write-Log "`nProject setup complete! Directory structure:"
Get-ChildItem -Recurse | Where-Object { !$_.PSIsContainer } | Select-Object FullName

Write-Log "`nSetup completed successfully! Check the log file for details: $logFile"
Write-Log @"

Next steps:
1. Open index.html in a web browser to view the site
2. Customize the content and styling as needed
3. Add your images to the assets/images directory
4. Update social media links and contact information
5. Test the booking form functionality

For development:
- Use a local server for better development experience
- Test across different browsers and devices
- Optimize images before deployment
- Update meta tags with your specific information
"@