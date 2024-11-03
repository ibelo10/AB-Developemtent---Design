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
        toast.innerHTML = 
            <div class="toast-content">
                <span class="toast-icon">💬</span>
                <p>Need help? Chat with us!</p>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="toast-progress"></div>
        ;
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
