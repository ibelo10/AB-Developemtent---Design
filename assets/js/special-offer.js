// assets/js/special-offer.js

document.addEventListener("DOMContentLoaded", () => {
    // Create and append CSS
    const style = document.createElement('style');
    style.textContent = `
      .special-offer-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'Raleway', sans-serif;
      }
  
      .special-offer-content {
        background: rgba(18, 18, 18, 0.95);
        border: 1px solid rgba(46, 213, 115, 0.2);
        border-radius: 15px;
        padding: 2rem;
        position: relative;
        width: 90%;
        max-width: 700px;
        transform: translateY(20px);
        transition: transform 0.3s ease;
        box-shadow: 0 0 30px rgba(46, 213, 115, 0.1);
      }
  
      .offer-badge {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(to right, #2ed573, #1dd1a1);
        color: black;
        padding: 0.5rem 2rem;
        border-radius: 25px;
        font-weight: bold;
        font-size: 1.1rem;
        box-shadow: 0 4px 15px rgba(46, 213, 115, 0.3);
      }
  
      .timer-badge {
        position: absolute;
        top: -12px;
        right: -12px;
        background: #ff4757;
        color: white;
        padding: 0.25rem 1rem;
        border-radius: 20px;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
  
      .close-btn {
        position: absolute;
        right: 1rem;
        top: 1rem;
        color: rgba(255, 255, 255, 0.6);
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        transition: color 0.2s ease;
      }
  
      .close-btn:hover {
        color: white;
      }
  
      .offer-header {
        text-align: center;
        margin-top: 1.5rem;
      }
  
      .offer-title {
        color: white;
        font-size: 2.5rem;
        font-weight: bold;
        margin: 1rem 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
      }
  
      .price-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin: 1.5rem 0;
      }
  
      .current-price {
        color: #2ed573;
        font-size: 3rem;
        font-weight: bold;
      }
  
      .original-price {
        text-decoration: line-through;
        color: rgba(255, 255, 255, 0.5);
        font-size: 1.25rem;
      }
  
      .save-badge {
        background: rgba(46, 213, 115, 0.1);
        color: #2ed573;
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.875rem;
        font-weight: bold;
      }
  
      .features-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        margin: 2rem 0;
      }
  
      @media (min-width: 640px) {
        .features-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
  
      .feature-list {
        color: rgba(255, 255, 255, 0.9);
      }
  
      .feature-list h3 {
        color: #2ed573;
        margin-bottom: 1rem;
        font-size: 1.25rem;
        font-weight: 600;
        text-align: center;
      }
  
      .feature-list ul {
        list-style: none;
        padding: 0;
        margin: 0;
      }
  
      .feature-list li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        color: rgba(255, 255, 255, 0.8);
      }
  
      .feature-list li::before {
        content: "•";
        color: #2ed573;
      }
  
      .offer-cta {
        text-align: center;
        margin-top: 2rem;
      }
  
      .claim-btn {
        background: linear-gradient(to right, #2ed573, #1dd1a1);
        color: black;
        font-weight: bold;
        padding: 1rem 2rem;
        border-radius: 8px;
        border: none;
        cursor: pointer;
        width: 100%;
        font-size: 1.1rem;
        transition: transform 0.2s ease, filter 0.2s ease;
      }
  
      .claim-btn:hover {
        transform: translateY(-2px);
        filter: brightness(1.1);
      }
  
      .maybe-later-btn {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.7);
        padding: 0.75rem;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
        margin-top: 1rem;
        transition: background-color 0.2s ease;
      }
  
      .maybe-later-btn:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    `;
    document.head.appendChild(style);
  
    const createPopupHTML = () => {
      const popupContainer = document.createElement("div");
      popupContainer.className = "special-offer-overlay";
  
      popupContainer.innerHTML = `
        <div class="special-offer-content">
          <div class="offer-badge">BLACK FRIDAY EXCLUSIVE</div>
          <div class="timer-badge">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Black Friday Deal
          </div>
          
          <button class="close-btn">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
  
          <div class="offer-header">
            <h2 class="offer-title">
              <span>Starter Package Deal</span>
            </h2>
            <div class="price-display">
              <span class="current-price">$300</span>
              <div class="price-details">
                <div class="original-price">$500</div>
                <div class="save-badge">Save 40%</div>
              </div>
            </div>
          </div>
  
          <div class="features-grid">
            <div class="feature-list">
              <h3>Website Essentials</h3>
              <ul>
                <li>Landing, About, and Contact Pages</li>
                <li>Professional Logo Design</li>
                <li>12-Month Custom Domain Hosting</li>
                <li>Mobile Responsive Design</li>
                <li>Contact Form Setup</li>
              </ul>
            </div>
  
            <div class="feature-list">
              <h3>Marketing Package</h3>
              <ul>
                <li>2 Promotional Commercials (30-60s)</li>
                <li>3 Custom Marketing Banners</li>
                <li>Social Media Profile Setup</li>
                <li>SEO Optimization</li>
                <li>Google Business Profile</li>
              </ul>
            </div>
          </div>
  
          <div class="feature-list">
            <h3>Bonus Features</h3>
            <ul>
              <li>1 Month Free Maintenance & Support</li>
              <li>Basic Analytics Setup</li>
              <li>SSL Certificate</li>
              <li>Weekly Backup System</li>
            </ul>
          </div>
  
          <div class="offer-cta">
            <button class="claim-btn">Claim Your Black Friday Deal Now</button>
            <button class="maybe-later-btn">Maybe Later</button>
          </div>
        </div>
      `;
  
      return popupContainer;
    };
  
    const showPopup = () => {
      if (localStorage.getItem('hasSeenBlackFridayOffer')) {
        return;
      }
  
      const popup = createPopupHTML();
      document.body.appendChild(popup);
  
      // Force reflow
      popup.offsetHeight;
  
      // Add visible classes
      popup.style.opacity = "1";
      popup.querySelector('.special-offer-content').style.transform = "translateY(0)";
  
      // Add event listeners
      const closeBtn = popup.querySelector('.close-btn');
      const maybeLaterBtn = popup.querySelector('.maybe-later-btn');
      const claimBtn = popup.querySelector('.claim-btn');
  
      const closePopup = () => {
        popup.style.opacity = "0";
        popup.querySelector('.special-offer-content').style.transform = "translateY(20px)";
        setTimeout(() => {
          popup.remove();
        }, 300);
        localStorage.setItem('hasSeenBlackFridayOffer', 'true');
      };
  
      closeBtn.addEventListener('click', closePopup);
      maybeLaterBtn.addEventListener('click', closePopup);
      claimBtn.addEventListener('click', () => {
        window.location.href = '/contact?service=Black Friday Starter Package&price=$300';
      });
  
      // Close on background click
      popup.addEventListener('click', (e) => {
        if (e.target === popup) {
          closePopup();
        }
      });
    };
  
    // Initialize popup with delay
    setTimeout(showPopup, 1500);
  });