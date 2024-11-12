// special-offer.js

document.addEventListener("DOMContentLoaded", () => {
    // Create popup HTML structure
    const createPopupHTML = () => {
      const popupContainer = document.createElement("div");
      popupContainer.id = "black-friday-popup";
      popupContainer.className = "fixed inset-0 z-50 flex items-center justify-center";
      popupContainer.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
      popupContainer.style.opacity = "0";
      popupContainer.style.transition = "opacity 0.3s ease-in-out";
  
      popupContainer.innerHTML = `
        <div class="relative max-w-2xl bg-black border border-emerald-500/20 rounded-lg p-6 m-4" 
             style="transform: translateY(20px); transition: transform 0.3s ease-in-out">
          <!-- Black Friday Banner -->
          <div class="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold px-8 py-2 rounded-full text-lg shadow-lg">
              BLACK FRIDAY EXCLUSIVE
            </div>
          </div>
  
          <!-- Timer Badge -->
          <div class="absolute -top-3 -right-3">
            <div class="bg-red-500 text-white font-bold px-4 py-1 rounded-full text-sm flex items-center gap-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Black Friday Deal
            </div>
          </div>
  
          <!-- Close Button -->
          <button class="close-popup absolute right-2 top-2 p-1 hover:bg-gray-800 rounded-full transition-colors">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
  
          <!-- Content -->
          <div class="mt-4 text-center">
            <div class="text-4xl font-bold text-white flex flex-col items-center gap-2">
              <div class="flex items-center gap-2">
                <svg class="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Starter Package Deal
                <svg class="h-8 w-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div class="flex items-center gap-3 mt-4">
                <span class="text-emerald-500 text-5xl">$300</span>
                <div class="flex flex-col items-start">
                  <span class="text-lg text-gray-500 line-through">$500</span>
                  <span class="text-emerald-500 font-semibold">40% OFF</span>
                </div>
              </div>
            </div>
  
            <!-- Package Features -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-left">
              <!-- Website Essentials -->
              <div class="space-y-3">
                <h3 class="text-emerald-500 font-semibold text-center mb-4">Website Essentials</h3>
                <ul class="space-y-2">
                  <li class="flex items-center gap-2">
                    <svg class="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-200">Landing, About, and Contact Pages</span>
                  </li>
                  <!-- Add more features here -->
                </ul>
              </div>
  
              <!-- Marketing & Optimization -->
              <div class="space-y-3">
                <h3 class="text-emerald-500 font-semibold text-center mb-4">Marketing & Optimization</h3>
                <ul class="space-y-2">
                  <li class="flex items-center gap-2">
                    <svg class="h-4 w-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-gray-200">2 Promotional Commercials (30-60s)</span>
                  </li>
                  <!-- Add more features here -->
                </ul>
              </div>
            </div>
  
            <!-- Call to Action -->
            <div class="mt-6 space-y-4">
              <div class="bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 p-4 rounded-lg">
                <p class="text-center text-emerald-500 font-semibold flex items-center justify-center gap-2">
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Black Friday Exclusive - Save $200 Today!
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </p>
              </div>
              
              <button class="claim-offer w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-bold py-4 px-4 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-[1.02] shadow-lg">
                Claim Your Black Friday Deal Now
              </button>
              <button class="close-popup w-full bg-transparent border border-gray-700 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors text-sm">
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      `;
  
      return popupContainer;
    };
  
    // Show popup with animation
    const showPopup = () => {
      if (localStorage.getItem('hasSeenBlackFridayOffer')) {
        return;
      }
  
      const popup = createPopupHTML();
      document.body.appendChild(popup);
  
      // Trigger animation
      setTimeout(() => {
        popup.style.opacity = "1";
        popup.querySelector('.relative').style.transform = "translateY(0)";
      }, 10);
  
      // Add event listeners
      const closeButtons = popup.querySelectorAll('.close-popup');
      const claimButton = popup.querySelector('.claim-offer');
  
      closeButtons.forEach(button => {
        button.addEventListener('click', () => {
          closePopup(popup);
        });
      });
  
      claimButton.addEventListener('click', () => {
        // Redirect to contact page with pre-filled form data
        window.location.href = `/contact?service=Black Friday Starter Package&price=$300`;
      });
  
      // Close on background click
      popup.addEventListener('click', (e) => {
        if (e.target === popup) {
          closePopup(popup);
        }
      });
    };
  
    // Close popup with animation
    const closePopup = (popup) => {
      popup.style.opacity = "0";
      popup.querySelector('.relative').style.transform = "translateY(20px)";
      
      setTimeout(() => {
        popup.remove();
        localStorage.setItem('hasSeenBlackFridayOffer', 'true');
      }, 300);
    };
  
    // Initialize popup
    setTimeout(showPopup, 1000);  // Show popup after 1 second
  });