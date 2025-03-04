// Import aller JS-Module
import { initNavigation } from './modules/navigation.js';
import { initGallery } from './modules/gallery.js';
import { initLightbox } from './modules/lightbox.js';
import { initComparisonSwiper } from './modules/comparison-swiper.js'; // Neues Modul
import { initFAQ } from './modules/faq.js';
import { initScrollAnimations } from './modules/animations.js';
import { initFormValidation } from './modules/form.js';
import { initFloatingElements } from './modules/floating.js';
import { enhanceAccessibility } from './utils/accessibility.js';

// Warte, bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing modules...');

    // Initialisiere alle Module
    initNavigation();
    initGallery();
    initLightbox();
    initComparisonSwiper(); // Statt initComparisonSliders()
    initFAQ();
    initScrollAnimations();
    initFormValidation();
    initFloatingElements();
    enhanceAccessibility();

    console.log('All modules initialized successfully');
});