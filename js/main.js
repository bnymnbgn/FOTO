// Import aller JS-Module
import { initNavigation } from './modules/navigation.js';
import { initGallery } from './modules/gallery.js';
import { initLightbox } from './modules/lightbox.js';
import { initComparisonSwiper } from './modules/comparison-swiper.js';
// import { initFAQ } from './modules/faq.js'; // Auskommentieren
import { initEnhancedFAQ } from './modules/enhanced-faq.js'; // Neue Zeile
import { initScrollAnimations } from './modules/animations.js';
import { initFormValidation } from './modules/form.js';
import { initFloatingElements } from './modules/floating.js';
import { enhanceAccessibility } from './utils/accessibility.js';
import { initPerspectiveHero } from './modules/perspective-hero.js';
import { initTransformation } from './modules/transformation.js';

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded, initializing modules...');

    // Initialisiere alle Module
    initNavigation();
    initGallery();
    initLightbox();
    initComparisonSwiper();
    // initFAQ(); // Auskommentieren
    initEnhancedFAQ(); // Diese Zeile hinzufügen
    initScrollAnimations();
    initFormValidation();
    initFloatingElements();
    enhanceAccessibility();
    initPerspectiveHero();
    initTransformation();

    console.log('All modules initialized successfully');
});