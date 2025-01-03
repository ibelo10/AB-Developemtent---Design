// State Management
const AppState = {
    events: [
        {
            id: 1,
            title: "Raiders vs Chiefs Watch Party",
            date: "2025-01-15",
            time: "13:00",
            venue: "Allegiant Stadium",
            promoter: "Silver & Black Events",
            tags: ["Game Day", "Watch Party"],
            capacity: 200,
            registered: 145,
            price: 25.00,
            description: "Join the Raider Nation for an epic divisional showdown!"
        },
        {
            id: 2,
            title: "Raiders Tailgate Experience",
            date: "2025-01-22",
            time: "10:00",
            venue: "Allegiant Stadium Parking",
            promoter: "Raider Nation Events",
            tags: ["Tailgate", "Pre-Game"],
            capacity: 500,
            registered: 320,
            price: 35.00,
            description: "Ultimate pre-game tailgate experience with BBQ and entertainment"
        }
    ],
    promoters: [
        {
            id: 1,
            name: "Silver & Black Events",
            eventsHosted: 45,
            rating: 4.8,
            specialties: ["Game Day", "VIP Experience"],
            contact: "silverblack@raiders.com",
            verified: true,
            yearsActive: 5,
            totalAttendees: 15000
        },
        {
            id: 2,
            name: "Raider Nation Events",
            eventsHosted: 32,
            rating: 4.7,
            specialties: ["Tailgate", "Family Events"],
            contact: "nation@raiders.com",
            verified: true,
            yearsActive: 3,
            totalAttendees: 12000
        }
    ],
    currentTab: 'events',
    currentPage: 1,
    itemsPerPage: 6,
    sortBy: 'date',
    sortOrder: 'asc',
    filters: {
        tags: [],
        dateRange: null,
        priceRange: null
    }
};

// Constants
const ANIMATION_DURATION = 300;
const DATE_FORMAT_OPTIONS = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
};
const PRICE_FORMATTER = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

// DOM Elements
const elements = {
    tabs: document.querySelectorAll('.tab'),
    eventsGrid: document.getElementById('eventsGrid'),
    promotersGrid: document.getElementById('promotersGrid'),
    modal: document.getElementById('eventModal'),
    searchInput: document.getElementById('searchInput'),
    prevPageBtn: document.getElementById('prevPage'),
    nextPageBtn: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo'),
    eventForm: document.getElementById('eventForm'),
    sortSelect: document.getElementById('sortSelect'),
    filterContainer: document.getElementById('filterContainer')
};

// Event Handlers
class EventHandlers {
    static init() {
        // Tab switching
        elements.tabs.forEach(tab => {
            tab.addEventListener('click', () => UI.switchTab(tab.dataset.tab));
        });

        // Search functionality
        elements.searchInput.addEventListener('input', debounce(UI.handleSearch, 300));

        // Form submission
        elements.eventForm.addEventListener('submit', EventHandlers.handleEventSubmit);

        // Sorting
        elements.sortSelect?.addEventListener('change', UI.handleSort);

        // Keyboard shortcuts
        document.addEventListener('keydown', EventHandlers.handleKeyboard);

        // Filter changes
        document.querySelectorAll('.filter-option').forEach(filter => {
            filter.addEventListener('change', UI.applyFilters);
        });
    }

    static handleEventSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const newEvent = EventHandlers.validateEventData({
                id: Date.now(),
                title: formData.get('eventTitle'),
                date: formData.get('eventDate'),
                time: formData.get('eventTime'),
                venue: formData.get('eventVenue'),
                tags: formData.get('eventTags').split(',').map(tag => tag.trim()),
                promoter: formData.get('eventPromoter') || "Silver & Black Events",
                capacity: parseInt(formData.get('eventCapacity')) || 100,
                registered: 0,
                price: parseFloat(formData.get('eventPrice')) || 0,
                description: formData.get('eventDescription')
            });

            AppState.events.unshift(newEvent);
            UI.hideModal();
            UI.renderContent();
            UI.showNotification('Event added successfully!', 'success');
            
        } catch (error) {
            UI.showNotification(error.message, 'error');
        }
    }

    static validateEventData(eventData) {
        const errors = [];

        if (!eventData.title || eventData.title.length < 3) {
            errors.push('Event title must be at least 3 characters long');
        }

        if (!eventData.date || new Date(eventData.date) < new Date()) {
            errors.push('Event date must be in the future');
        }

        if (!eventData.venue) {
            errors.push('Venue is required');
        }

        if (eventData.price < 0) {
            errors.push('Price cannot be negative');
        }

        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        return eventData;
    }

    static handleKeyboard(e) {
        // Escape key closes modal
        if (e.key === 'Escape' && elements.modal.style.display === 'flex') {
            UI.hideModal();
        }

        // Ctrl + N opens new event form
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            UI.showModal();
        }
    }
}

// UI Management
class UI {
    static switchTab(tab) {
        AppState.currentTab = tab;
        AppState.currentPage = 1;
        
        elements.tabs.forEach(t => {
            t.classList.toggle('active', t.dataset.tab === tab);
        });

        elements.eventsGrid.style.display = tab === 'events' ? 'grid' : 'none';
        elements.promotersGrid.style.display = tab === 'promoters' ? 'grid' : 'none';

        UI.renderContent();
        history.pushState(null, '', `#${tab}`);
    }

    static handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const currentItems = AppState.currentTab === 'events' ? AppState.events : AppState.promoters;
        
        const filteredItems = currentItems.filter(item => {
            const searchableText = AppState.currentTab === 'events'
                ? `${item.title} ${item.venue} ${item.description} ${item.tags.join(' ')}`
                : `${item.name} ${item.specialties.join(' ')}`;
            
            return searchableText.toLowerCase().includes(searchTerm);
        });

        UI.renderFilteredContent(filteredItems);
    }

    static handleSort(e) {
        AppState.sortBy = e.target.value;
        UI.renderContent();
    }

    static showModal() {
        elements.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        elements.eventForm.querySelector('[name="eventTitle"]').focus();
    }

    static hideModal() {
        elements.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        elements.eventForm.reset();
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, ANIMATION_DURATION);
            }, 2000);
        });
    }

    static renderContent() {
        const currentItems = AppState.currentTab === 'events' ? AppState.events : AppState.promoters;
        const startIdx = (AppState.currentPage - 1) * AppState.itemsPerPage;
        const endIdx = startIdx + AppState.itemsPerPage;
        
        // Apply sorting
        const sortedItems = UI.sortItems(currentItems);
        
        // Apply pagination
        const itemsToRender = sortedItems.slice(startIdx, endIdx);

        // Render content
        if (AppState.currentTab === 'events') {
            UI.renderEvents(itemsToRender);
        } else {
            UI.renderPromoters(itemsToRender);
        }

        UI.updatePagination(sortedItems.length);
    }

    static sortItems(items) {
        return [...items].sort((a, b) => {
            const aValue = a[AppState.sortBy];
            const bValue = b[AppState.sortBy];
            
            if (typeof aValue === 'string') {
                return AppState.sortOrder === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            
            return AppState.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        });
    }

    static renderEvents(events) {
        elements.eventsGrid.innerHTML = events.map(event => `
            <div class="card animate__animated animate__fadeIn">
                <div class="card-header">
                    <h3>${event.title}</h3>
                    <span class="capacity-badge ${event.registered >= event.capacity ? 'full' : ''}">
                        ${event.registered}/${event.capacity}
                    </span>
                </div>
                <div class="card-info">
                    <p><i class="far fa-calendar"></i> ${UI.formatDate(event.date)}</p>
                    <p><i class="far fa-clock"></i> ${UI.formatTime(event.time)}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${event.venue}</p>
                    <p><i class="fas fa-user-tie"></i> ${event.promoter}</p>
                    <p><i class="fas fa-ticket-alt"></i> ${PRICE_FORMATTER.format(event.price)}</p>
                    <p class="description">${event.description}</p>
                </div>
                <div class="tag-container">
                    ${event.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="card-actions">
                    <button class="register-btn" onclick="UI.handleEventRegistration(${event.id})"
                            ${event.registered >= event.capacity ? 'disabled' : ''}>
                        ${event.registered >= event.capacity ? 'SOLD OUT' : 'REGISTER'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    static renderPromoters(promoters) {
        elements.promotersGrid.innerHTML = promoters.map(promoter => `
            <div class="card animate__animated animate__fadeIn">
                <div class="card-header">
                    <h3>${promoter.name}</h3>
                    ${promoter.verified ? '<span class="verified-badge">✓ Verified</span>' : ''}
                </div>
                <div class="card-info">
                    <p><i class="fas fa-calendar-check"></i> Events Hosted: ${promoter.eventsHosted}</p>
                    <p><i class="fas fa-star"></i> Rating: ${promoter.rating.toFixed(1)}/5.0</p>
                    <p><i class="fas fa-users"></i> Total Attendees: ${promoter.totalAttendees.toLocaleString()}</p>
                    <p><i class="fas fa-history"></i> Years Active: ${promoter.yearsActive}</p>
                    <p><i class="fas fa-envelope"></i> ${promoter.contact}</p>
                </div>
                <div class="tag-container">
                    ${promoter.specialties.map(specialty => 
                        `<span class="tag">${specialty}</span>`
                    ).join('')}
                </div>
                <div class="card-actions">
                    <button class="contact-btn" onclick="UI.handlePromoterContact(${promoter.id})">
                        CONTACT PROMOTER
                    </button>
                </div>
            </div>
        `).join('');
    }

    static handleEventRegistration(eventId) {
        const event = AppState.events.find(e => e.id === eventId);
        if (event && event.registered < event.capacity) {
            event.registered++;
            UI.renderContent();
            UI.showNotification('Registration successful!', 'success');
        }
    }

    static handlePromoterContact(promoterId) {
        const promoter = AppState.promoters.find(p => p.id === promoterId);
        if (promoter) {
            window.location.href = `mailto:${promoter.contact}`;
        }
    }

    static updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / AppState.itemsPerPage);
        elements.prevPageBtn.disabled = AppState.currentPage === 1;
        elements.nextPageBtn.disabled = AppState.currentPage === totalPages;
        elements.pageInfo.textContent = `PAGE ${AppState.currentPage} OF ${totalPages}`;
    }

    static formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
    }

    static formatTime(timeStr) {
        return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Analytics
class Analytics {
    static trackEvent(category, action, label) {
        // Implementation for analytics tracking
        console.log(`[Analytics] ${category} - ${action} - ${label}`);
    }

    static trackPageView(page) {
        console.log(`[Analytics] Page View: ${page}`);
    }
}

// Initialize the application
function init() {
    EventHandlers.init();
    UI.renderContent();
    
    // Check for deep linking
    const hash = window.location.hash.slice(1);
    if (hash