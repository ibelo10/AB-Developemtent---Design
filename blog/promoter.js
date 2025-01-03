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
            tags: ["Game Day", "Watch Party", "Division Rival"],
            capacity: 200,
            registered: 145,
            price: 25.00,
            description: "Join the Raider Nation for an epic divisional showdown! Includes game ticket and exclusive fan gear."
        },
        {
            id: 2,
            title: "Raiders Tailgate Experience",
            date: "2025-01-22",
            time: "10:00",
            venue: "Allegiant Stadium Parking",
            promoter: "Raider Nation Events",
            tags: ["Tailgate", "Pre-Game", "Family Friendly"],
            capacity: 500,
            registered: 320,
            price: 35.00,
            description: "Ultimate pre-game tailgate experience with BBQ, entertainment, and special guest appearances!"
        },
        {
            id: 3,
            title: "Commitment to Excellence Gala",
            date: "2025-02-05",
            time: "19:00",
            venue: "Bellagio Hotel",
            promoter: "Raiders Legacy Club",
            tags: ["VIP", "Formal", "Charity"],
            capacity: 300,
            registered: 275,
            price: 150.00,
            description: "Annual black-tie gala celebrating Raiders legacy with current and former players. Proceeds benefit Raiders Foundation."
        },
        {
            id: 4,
            title: "Raiders Draft Day Spectacular",
            date: "2025-04-24",
            time: "17:00",
            venue: "Raiders Practice Facility",
            promoter: "Silver & Black Events",
            tags: ["Draft", "Fan Event", "Meet & Greet"],
            capacity: 1000,
            registered: 850,
            price: 45.00,
            description: "Watch the NFL Draft with fellow Raiders fans! Live commentary from Raiders analysts and former players."
        },
        {
            id: 5,
            title: "Raiders Kids Football Camp",
            date: "2025-06-15",
            time: "09:00",
            venue: "Raiders Training Complex",
            promoter: "Raider Nation Youth",
            tags: ["Youth", "Training", "Family"],
            capacity: 200,
            registered: 150,
            price: 75.00,
            description: "One-day youth football camp with Raiders coaches and players. Ages 7-14 welcome."
        },
        {
            id: 6,
            title: "Al Davis Legacy Tribute",
            date: "2025-07-04",
            time: "18:00",
            venue: "Allegiant Stadium",
            promoter: "Raiders Legacy Club",
            tags: ["Special Event", "History", "Ceremony"],
            capacity: 5000,
            registered: 3200,
            price: 20.00,
            description: "Special tribute celebrating the legacy of Al Davis with exclusive documentaries and memorabilia exhibition."
        },
        {
            id: 7,
            title: "Raiders Season Kickoff Party",
            date: "2025-09-07",
            time: "16:00",
            venue: "Las Vegas Strip",
            promoter: "Silver & Black Events",
            tags: ["Season Kickoff", "Party", "Entertainment"],
            capacity: 2000,
            registered: 1500,
            price: 30.00,
            description: "Celebrate the start of the 2025 season with the biggest Raiders party in Vegas!"
        },
        {
            id: 8,
            title: "Autumn Wind Festival",
            date: "2025-10-31",
            time: "17:00",
            venue: "Downtown Las Vegas",
            promoter: "Raider Nation Events",
            tags: ["Festival", "Family", "Halloween"],
            capacity: 3000,
            registered: 2100,
            price: 25.00,
            description: "Annual Halloween festival featuring Raiders-themed activities, costumes, and trick-or-treating."
        }
    ],
    promoters: [
        {
            id: 1,
            name: "Silver & Black Events",
            eventsHosted: 145,
            rating: 4.8,
            specialties: ["Game Day", "VIP Experience", "Season Events"],
            contact: "silverblack@raiders.com",
            verified: true,
            yearsActive: 5,
            totalAttendees: 75000,
            description: "Official partner of the Las Vegas Raiders, specializing in premium game day experiences and VIP events.",
            socialMedia: {
                twitter: "@SilverBlackEvents",
                instagram: "@silverblackevents"
            }
        },
        {
            id: 2,
            name: "Raider Nation Events",
            eventsHosted: 98,
            rating: 4.7,
            specialties: ["Tailgate", "Family Events", "Community Outreach"],
            contact: "nation@raiders.com",
            verified: true,
            yearsActive: 3,
            totalAttendees: 45000,
            description: "Creating memorable family-friendly experiences for the Raider Nation community.",
            socialMedia: {
                twitter: "@RaiderNationEvents",
                instagram: "@raidernationevents"
            }
        },
        {
            id: 3,
            name: "Raiders Legacy Club",
            eventsHosted: 75,
            rating: 4.9,
            specialties: ["VIP Events", "Alumni Events", "Charity Galas"],
            contact: "legacy@raiders.com",
            verified: true,
            yearsActive: 8,
            totalAttendees: 35000,
            description: "Exclusive events featuring Raiders legends and premium experiences for dedicated fans.",
            socialMedia: {
                twitter: "@RaidersLegacy",
                instagram: "@raiderslegacyclub"
            }
        },
        {
            id: 4,
            name: "Raider Nation Youth",
            eventsHosted: 120,
            rating: 4.8,
            specialties: ["Youth Programs", "Training Camps", "Education"],
            contact: "youth@raiders.com",
            verified: true,
            yearsActive: 4,
            totalAttendees: 25000,
            description: "Dedicated to developing the next generation of Raider Nation through youth programs and camps.",
            socialMedia: {
                twitter: "@RaiderNationYouth",
                instagram: "@raidernationyouth"
            }
        },
        {
            id: 5,
            name: "Black Hole Society",
            eventsHosted: 85,
            rating: 4.6,
            specialties: ["Fan Clubs", "Watch Parties", "Travel Packages"],
            contact: "blackhole@raiders.com",
            verified: true,
            yearsActive: 6,
            totalAttendees: 40000,
            description: "The ultimate fan club experience for die-hard Raiders supporters worldwide.",
            socialMedia: {
                twitter: "@BlackHoleSociety",
                instagram: "@blackholesociety"
            }
        },
        {
            id: 6,
            name: "Vegas Raiders Tours",
            eventsHosted: 200,
            rating: 4.7,
            specialties: ["Stadium Tours", "Museum Tours", "History Events"],
            contact: "tours@raiders.com",
            verified: true,
            yearsActive: 2,
            totalAttendees: 30000,
            description: "Official tour provider for Allegiant Stadium and Raiders historical experiences.",
            socialMedia: {
                twitter: "@VegasRaidersTours",
                instagram: "@vegasraiderstours"
            }
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
            Analytics.trackEvent('Event', 'Create', newEvent.title);
            
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
        Analytics.trackPageView(tab);
    }

    static handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        const currentItems = AppState.currentTab === 'events' ? AppState.events : AppState.promoters;
        
        const filteredItems = currentItems.filter(item => {
            const searchableText = AppState.currentTab === 'events'
                ? `${item.title} ${item.venue} ${item.description} ${item.tags.join(' ')}`
                : `${item.name} ${item.specialties.join(' ')} ${item.description}`;
            
            return searchableText.toLowerCase().includes(searchTerm);
        });

        UI.renderFilteredContent(filteredItems);
        Analytics.trackEvent('Search', 'Filter', searchTerm);
    }

    static handleSort(e) {
        AppState.sortBy = e.target.value;
        UI.renderContent();
        Analytics.trackEvent('Sort', 'Change', e.target.value);
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
        const filteredItems = UI.applyFilters(currentItems);
        const sortedItems = UI.sortItems(filteredItems);
        
        const startIdx = (AppState.currentPage - 1) * AppState.itemsPerPage;
        const endIdx = startIdx + AppState.itemsPerPage;
        const itemsToRender = sortedItems.slice(startIdx, endIdx);

        if (AppState.currentTab === 'events') {
            UI.renderEvents(itemsToRender);
        } else {
            UI.renderPromoters(itemsToRender);
        }

        UI.updatePagination(sortedItems.length);
    }

    static sortItems(items) {
        return [...items].sort((a, b) => {
            const aValue = AppState.currentTab === 'events' ? a[AppState.sortBy] : a[AppState.sortBy];
            const bValue = AppState.currentTab === 'events' ? b[AppState.sortBy] : b[AppState.sortBy];
            
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
                    <div class="card-badges">
                        <span class="capacity-badge ${event.registered >= event.capacity ? 'full' : ''}">
                            ${event.registered}/${event.capacity}
                        </span>
                        ${event.registered >= event.capacity * 0.8 
                            ? '<span class="selling-fast">Selling Fast!</span>' 
                            : ''}
                    </div>
                </div>
                <div class="card-info">
                    <p class="info-row">
                        <i class="far fa-calendar"></i>
                        ${UI.formatDate(event.date)}
                    </p>
                    <p class="info-row">
                        <i class="far fa-clock"></i>
                        ${UI.formatTime(event.time)}
                    </p>
                    <p class="info-row">
                        <i class="fas fa-map-marker-alt"></i>
                        ${event.venue}
                    </p>
                    <p class="info-row">
                        <i class="fas fa-user-tie"></i>
                        ${event.promoter}
                    </p>
                    <p class="info-row price">
                        <i class="fas fa-ticket-alt"></i>
                        ${PRICE_FORMATTER.format(event.price)}
                    </p>
                    <div class="description">
                        <p>${event.description}</p>
                    </div>
                </div>
                <div class="tag-container">
                    ${event.tags.map(tag => `
                        <span class="tag" onclick="UI.handleTagClick('${tag}')">
                            ${tag}
                        </span>
                    `).join('')}
                </div>
                <div class="card-actions">
                    <button 
                        class="register-btn ${event.registered >= event.capacity ? 'disabled' : ''}"
                        onclick="UI.handleEventRegistration(${event.id})"
                        ${event.registered >= event.capacity ? 'disabled' : ''}
                    >
                        ${event.registered >= event.capacity ? 'SOLD OUT' : 'REGISTER NOW'}
                    </button>
                    <button class="share-btn" onclick="UI.handleShareEvent(${event.id})">
                        <i class="fas fa-share-alt"></i>
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
                    ${promoter.verified 
                        ? '<span class="verified-badge" title="Verified Promoter">✓</span>' 
                        : ''}
                </div>
                <div class="card-info">
                    <div class="stats-container">
                        <div class="stat">
                            <span class="stat-value">${promoter.eventsHosted}</span>
                            <span class="stat-label">Events</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${promoter.rating.toFixed(1)}</span>
                            <span class="stat-label">Rating</span>
                        </div>
                        <div class="stat">
                            <span class="stat-value">${promoter.yearsActive}</span>
                            <span class="stat-label">Years</span>
                        </div>
                    </div>
                    <p class="info-row">
                        <i class="fas fa-users"></i>
                        ${promoter.totalAttendees.toLocaleString()} Total Attendees
                    </p>
                    <p class="info-row">
                        <i class="fas fa-envelope"></i>
                        ${promoter.contact}
                    </p>
                    <div class="social-links">
                        ${promoter.socialMedia.twitter ? `
                            <a href="https://twitter.com/${promoter.socialMedia.twitter.slice(1)}" 
                               target="_blank" class="social-link">
                                <i class="fab fa-twitter"></i>
                            </a>
                        ` : ''}
                        ${promoter.socialMedia.instagram ? `
                            <a href="https://instagram.com/${promoter.socialMedia.instagram.slice(1)}" 
                               target="_blank" class="social-link">
                                <i class="fab fa-instagram"></i>
                            </a>
                        ` : ''}
                    </div>
                    <p class="description">${promoter.description}</p>
                </div>
                <div class="tag-container">
                    ${promoter.specialties.map(specialty => `
                        <span class="tag" onclick="UI.handleTagClick('${specialty}')">
                            ${specialty}
                        </span>
                    `).join('')}
                </div>
                <div class="card-actions">
                    <button class="contact-btn primary" 
                            onclick="UI.handlePromoterContact(${promoter.id})">
                        CONTACT PROMOTER
                    </button>
                    <button class="view-events-btn" 
                            onclick="UI.viewPromoterEvents('${promoter.name}')">
                        VIEW EVENTS
                    </button>
                </div>
            </div>
        `).join('');
    }

    static handleTagClick(tag) {
        const filterTags = document.querySelectorAll('.tag-checkbox input');
        filterTags.forEach(checkbox => {
            if (checkbox.value === tag) {
                checkbox.checked = true;
                checkbox.dispatchEvent(new Event('change'));
            }
        });
        Analytics.trackEvent('Tag', 'Click', tag);
    }

    static handleEventRegistration(eventId) {
        const event = AppState.events.find(e => e.id === eventId);
        if (event && event.registered < event.capacity) {
            event.registered++;
            UI.renderContent();
            UI.showNotification('Registration successful! Welcome to the Raider Nation!', 'success');
            Analytics.trackEvent('Event', 'Registration', event.title);
        }
    }

    static handleShareEvent(eventId) {
        const event = AppState.events.find(e => e.id === eventId);
        if (event) {
            const shareData = {
                title: `Join me at ${event.title}!`,
                text: `Check out this Raiders event: ${event.title} at ${event.venue} on ${UI.formatDate(event.date)}`,
                url: window.location.href
            };

            if (navigator.share) {
                navigator.share(shareData)
                    .then(() => Analytics.trackEvent('Event', 'Share', event.title))
                    .catch(err => UI.showNotification('Error sharing event', 'error'));
            } else {
                navigator.clipboard.writeText(shareData.text)
                    .then(() => {
                        UI.showNotification('Event details copied to clipboard!', 'success');
                        Analytics.trackEvent('Event', 'Copy', event.title);
                    })
                    .catch(err => UI.showNotification('Error copying event details', 'error'));
            }
        }
    }

    static handlePromoterContact(promoterId) {
        const promoter = AppState.promoters.find(p => p.id === promoterId);
        if (promoter) {
            window.location.href = `mailto:${promoter.contact}`;
            Analytics.trackEvent('Promoter', 'Contact', promoter.name);
        }
    }

    static viewPromoterEvents(promoterName) {
        AppState.currentTab = 'events';
        UI.switchTab('events');
        elements.searchInput.value = promoterName;
        UI.handleSearch({ target: { value: promoterName } });
        Analytics.trackEvent('Promoter', 'View Events', promoterName);
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

    static applyFilters(items) {
        let filtered = [...items];

        // Tag filters
        if (AppState.filters.tags.length > 0) {
            filtered = filtered.filter(item => {
                const itemTags = AppState.currentTab === 'events' ? item.tags : item.specialties;
                return AppState.filters.tags.some(tag => itemTags.includes(tag));
            });
        }

        // Price range (events only)
        if (AppState.currentTab === 'events' && 
            (AppState.filters.priceRange?.min || AppState.filters.priceRange?.max)) {
            filtered = filtered.filter(item => {
                const { min, max } = AppState.filters.priceRange;
                return (!min || item.price >= min) && (!max || item.price <= max);
            });
        }

        // Date range (events only)
        if (AppState.currentTab === 'events' && 
            (AppState.filters.dateRange?.start || AppState.filters.dateRange?.end)) {
            filtered = filtered.filter(item => {
                const itemDate = new Date(item.date);
                const start = AppState.filters.dateRange.start ? new Date(AppState.filters.dateRange.start) : null;
                const end = AppState.filters.dateRange.end ? new Date(AppState.filters.dateRange.end) : null;
                
                return (!start || itemDate >= start) && (!end || itemDate <= end);
            });
        }

        return filtered;
    }
}

// Analytics
class Analytics {
    static trackEvent(category, action, label) {
        console.log(`[Analytics] ${category} - ${action} - ${label}`);
        // Implementation for analytics tracking would go here
    }

    static trackPageView(page) {
        console.log(`[Analytics] Page View: ${page}`);
        // Implementation for page view tracking would go here
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

// Initialize the application
function init() {
    EventHandlers.init();
    UI.renderContent();
    
    // Check for deep linking
    const hash = window.location.hash.slice(1);
    if (hash && ['events', 'promoters'].includes(hash)) {
        UI.switchTab(hash);
    }

    // Initialize filters
    initializeFilters();

    // Track initial page view
    Analytics.trackPageView('home');
}

// Start the application
init();