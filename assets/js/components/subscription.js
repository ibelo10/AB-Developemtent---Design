// assets/js/components/subscription.js

export function initializeSubscription() {
    // Show popup after delay if first visit
    if (!localStorage.getItem('hasVisited')) {
        setTimeout(() => {
            const modalBtn = document.getElementById('modal-btn');
            if (modalBtn) modalBtn.checked = true;
        }, 2000);
        localStorage.setItem('hasVisited', 'true');
    }

    // Setup form handler
    const form = document.getElementById('subscription-form');
    if (form) {
        form.addEventListener('submit', handleSubscribe);
    }

    // Setup outside click handler
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                const modalBtn = document.getElementById('modal-btn');
                if (modalBtn) modalBtn.checked = false;
            }
        });
    }
}

async function handleSubscribe(event) {
    event.preventDefault();
    const form = event.target;
    const email = document.getElementById('email')?.value;

    if (!email) {
        alert('Please enter a valid email address');
        return;
    }

    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const modalBtn = document.getElementById('modal-btn');
            if (modalBtn) modalBtn.checked = false;
            
            alert('Thank you for subscribing!');
            localStorage.setItem('subscribed', 'true');
        } else {
            throw new Error('Submission failed');
        }
    } catch (error) {
        console.error('Subscription error:', error);
        alert('Sorry, there was an error. Please try again later.');
    }
}
