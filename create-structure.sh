#!/bin/bash

# Create directory structure
mkdir -p {assets/{css,js,images},blog,services,portfolio,contact}

# Move existing files to correct locations
mv -f src/assets/images/ABLogo.png assets/images/ 2>/dev/null

# Create CSS files
cat > assets/css/styles.css << 'EOL'
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

/* Body Styles */
body {
  line-height: 1.6;
  min-height: 100vh;
  background: #f5f5f5;
}

/* Navbar Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-img {
  height: 40px;
  width: auto;
}

.nav-logo span {
  font-weight: 600;
  font-size: 1.2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover,
.nav-links a.active {
  color: #2ecc71;
}

/* Hero Section */
.hero-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.logo-large {
  margin-bottom: 2rem;
}

.logo-img-large {
  height: 120px;
  width: auto;
  animation: pulse 2s infinite;
}

.content-wrapper {
  max-width: 800px;
  width: 100%;
}

.content-wrapper h1 {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  color: #333;
}

/* Animations */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    padding: 1rem;
  }

  .nav-links {
    margin-top: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
}
EOL

cat > assets/css/messenger.css << 'EOL'
.chat-toast {
  position: fixed;
  bottom: 100px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 999;
  display: none;
}

.toast-content {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.toast-progress {
  height: 3px;
  background: #2ecc71;
  width: 100%;
}

.fb_dialog,
.fb-customerchat iframe {
  z-index: 1000 !important;
}
EOL

# Create JavaScript files
cat > assets/js/main.js << 'EOL'
document.addEventListener('DOMContentLoaded', function() {
  // Initialize ripple effect if available
  try {
    $('.hero-container').ripples({
      resolution: 512,
      dropRadius: 20,
      perturbance: 0.04
    });
  } catch (e) {
    console.log('Ripples effect not supported');
  }

  // Update active nav link
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});
EOL

cat > assets/js/messenger.js << 'EOL'
function initializeChatToast() {
  setTimeout(showToast, 5000);
}

function showToast() {
  const toast = document.getElementById('chatToast');
  if (toast && !localStorage.getItem('chatToastShown')) {
    toast.style.display = 'block';
    startToastProgress();
  }
}

function hideToast() {
  const toast = document.getElementById('chatToast');
  if (toast) {
    toast.style.display = 'none';
    localStorage.setItem('chatToastShown', 'true');
  }
}

function closeToast() {
  hideToast();
}

function startToastProgress() {
  const progress = document.querySelector('.toast-progress');
  if (progress) {
    progress.style.width = '100%';
    progress.style.transition = 'width 5s linear';
    setTimeout(() => {
      progress.style.width = '0';
    }, 100);
    setTimeout(hideToast, 5000);
  }
}

export {
  initializeChatToast,
  showToast,
  hideToast,
  closeToast,
  startToastProgress
};
EOL

# Create placeholder HTML files for routes
for dir in blog services portfolio contact; do
  echo '<!DOCTYPE html><html><head><title>AB Development & Design - '${dir^}'</title></head><body><h1>'${dir^}'</h1></body></html>' > $dir/index.html
done

echo "Directory structure and files created successfully!"