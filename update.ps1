# Setup script for Messenger integration

# Function to create directory if it doesn't exist
function New-DirectoryIfNotExists {
    param([string]$path)
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
        Write-Host "Created directory: $path" -ForegroundColor Green
    }
}

# Function to update file content
function Update-FileContent {
    param(
        [string]$filePath,
        [string]$content,
        [string]$description
    )
    Set-Content -Path $filePath -Value $content
    Write-Host "Updated $description at: $filePath" -ForegroundColor Green
}

# Create _headers file for GitHub Pages
$headersContent = @"
/*
  Access-Control-Allow-Origin: *.facebook.com
  Access-Control-Allow-Methods: GET, POST, OPTIONS
  Access-Control-Allow-Headers: DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type
  Content-Security-Policy: default-src 'self' *.facebook.com *.fbcdn.net *.facebook.net; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.facebook.com *.fbcdn.net *.facebook.net connect.facebook.net; style-src 'self' 'unsafe-inline' *.facebook.com *.fbcdn.net; img-src 'self' data: blob: *.facebook.com *.fbcdn.net; connect-src 'self' *.facebook.com *.fbcdn.net wss://*.facebook.com:* wss://*.fbcdn.net; frame-src 'self' *.facebook.com *.fbcdn.net; font-src 'self' data: *.facebook.com *.fbcdn.net;
  X-Frame-Options: SAMEORIGIN
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
"@

Update-FileContent "_headers" $headersContent "GitHub Pages headers"

# Create messenger.css
$messengerCSS = @"
/* Messenger Chat Styles */
.fb_dialog,
.fb-customerchat {
    position: fixed !important;
    z-index: 10000 !important;
}

.fb_dialog {
    bottom: 80px !important;
    right: 18pt !important;
}

.fb_dialog_content iframe {
    transition: transform 0.3s ease !important;
    background: none !important;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1)) !important;
}

.fb_dialog:hover .fb_dialog_content iframe {
    transform: scale(1.05) !important;
}

.fb-customerchat iframe {
    right: 18pt !important;
    bottom: 70px !important;
}

/* Toast Notification */
.chat-toast {
    position: fixed;
    bottom: 100px;
    right: 20px;
    background: rgba(46, 204, 113, 0.95);
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    transform: translateY(100px);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 999;
}

.chat-toast.show {
    transform: translateY(0);
    opacity: 1;
}

.toast-content {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    color: white;
    gap: 10px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .chat-toast {
        bottom: 90px;
        left: 20px;
        right: 20px;
        text-align: center;
    }

    .fb_dialog {
        bottom: 70px !important;
    }
}
"@

Update-FileContent "assets/css/messenger.css" $messengerCSS "Messenger styles"

# Create messenger.js
$messengerJS = @"
// Messenger Component
export function initializeMessenger() {
    const config = {
        page_id: '113394291657712',
        theme_color: '#2ecc71',
        greeting_delay: 5,
        logged_in_greeting: "Hi! 👋 How can we help you today?",
        logged_out_greeting: "Hi! 👋 Log in to chat with us."
    };

    function initChat() {
        const chatbox = document.getElementById('fb-customer-chat');
        if (!chatbox) return;

        // Apply configuration
        Object.entries(config).forEach(([key, value]) => {
            chatbox.setAttribute(key, value);
        });

        // Initialize toast notification
        initToastNotification();
    }

    function initToastNotification() {
        if (shouldShowToast()) {
            setTimeout(showToast, 3000);
        }
    }

    function shouldShowToast() {
        const lastShown = localStorage.getItem('chatToastShown');
        if (!lastShown) return true;

        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        return (Date.now() - new Date(lastShown).getTime()) > sevenDays;
    }

    function showToast() {
        const toast = createToastElement();
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        localStorage.setItem('chatToastShown', Date.now().toString());

        setTimeout(() => {
            hideToast(toast);
        }, 5000);
    }

    function createToastElement() {
        const toast = document.createElement('div');
        toast.className = 'chat-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-icon">💬</span>
                <p>Need help? Chat with us!</p>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="toast-progress"></div>
        `;
        return toast;
    }

    function hideToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }

    return {
        showToast,
        hideToast
    };
}
"@

Update-FileContent "assets/js/components/messenger.js" $messengerJS "Messenger component"

# Update HTML files with Messenger integration
$htmlFiles = @("index.html", "portfolio.html", "contact.html")

foreach ($file in $htmlFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        
        # Add messenger.css link if not present
        if (-not ($content -match "messenger\.css")) {
            $content = $content -replace "(<link.*styles\.css.*>)", "`$1`n    <link rel=`"stylesheet`" href=`"assets/css/messenger.css`">"
        }

        # Add Messenger chat code if not present
        if (-not ($content -match "fb-root")) {
            $messengerCode = @"
    <!-- Messenger Chat Plugin Code -->
    <div id="fb-root"></div>
    <div id="fb-customer-chat" class="fb-customerchat"></div>

    <script>
        window.fbAsyncInit = function() {
            FB.init({
                xfbml: true,
                version: 'v18.0'
            });
        };

        (function(d, s, id) {
            try {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
                js.crossOrigin = 'anonymous';
                fjs.parentNode.insertBefore(js, fjs);
            } catch (e) {
                console.error('Failed to load Messenger chat:', e);
            }
        }(document, 'script', 'facebook-jssdk'));
    </script>
"@
            $content = $content -replace "</body>", "$messengerCode`n</body>"
        }

        # Add messenger.js import if not present
        if (-not ($content -match "messenger\.js")) {
            $content = $content -replace "main\.js", "main.js`"></script>`n    <script src=`"assets/js/components/messenger.js`" type=`"module"
        }

        Set-Content $file $content
        Write-Host "Updated Messenger integration in: $file" -ForegroundColor Green
    }
}

Write-Host "`nMessenger integration setup complete!" -ForegroundColor Cyan
Write-Host "Please ensure all files are committed to your repository." -ForegroundColor Yellow
Write-Host "The chat widget should now be available on your site." -ForegroundColor Yellow