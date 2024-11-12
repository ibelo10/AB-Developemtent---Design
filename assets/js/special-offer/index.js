// assets/js/special-offer/index.js
import { createRoot } from 'react-dom/client';
import { BlackFridayPopup } from './BlackFridayPopup.js';

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('special-offer-popup');
    if (container) {
        const root = createRoot(container);
        root.render(BlackFridayPopup());
    }
});