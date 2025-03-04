/**
 * Accessibility Modul
 * Verbessert die Barrierefreiheit der Website
 */

/**
 * Verbessert die Tastaturnavigation durch sichtbares Fokus-Feedback
 */
function improveFocusVisibility() {
    const focusableElements = document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        // Fokus-Styles hinzufügen/entfernen
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary-color)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
}

/**
 * Fügt ARIA-Attribute zu interaktiven Elementen hinzu
 */
function addARIAAttributes() {
    // ARIA-Attribute für Navigationselemente
    const mainNav = document.querySelector('nav');
    if (mainNav) {
        mainNav.setAttribute('role', 'navigation');
        mainNav.setAttribute('aria-label', 'Hauptnavigation');
    }
    
    // ARIA-Attribute für den Hamburger-Button
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-controls', 'nav-links');
        hamburger.setAttribute('aria-label', 'Menü öffnen');
        
        // Event-Listener für ARIA-Attribut-Updates
        hamburger.addEventListener('click', () => {
            const expanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', (!expanded).toString());
            hamburger.setAttribute('aria-label', expanded ? 'Menü öffnen' : 'Menü schließen');
        });
    }
    
    // ARIA-Attribute für die Nav-Links
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.id = 'nav-links';
    }
    
    // ARIA-Attribute für Formularfelder
    const formLabels = document.querySelectorAll('label');
    formLabels.forEach(label => {
        const forAttribute = label.getAttribute('for');
        
        if (forAttribute) {
            const input = document.getElementById(forAttribute);
            
            if (input) {
                if (input.hasAttribute('required')) {
                    label.innerHTML += ' <span class="required" aria-hidden="true">*</span>';
                    input.setAttribute('aria-required', 'true');
                }
            }
        }
    });
    
    // ARIA-Attribute für Buttons ohne Text
    const iconButtons = document.querySelectorAll('button:not([aria-label])');
    iconButtons.forEach(button => {
        if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
            // Versuche, eine Beschreibung abzuleiten
            const icon = button.querySelector('i.fa, i.fas, i.far, i.fab');
            if (icon) {
                const iconClass = Array.from(icon.classList)
                    .find(cls => cls.startsWith('fa-'));
                
                if (iconClass) {
                    const iconName = iconClass.replace('fa-', '');
                    button.setAttribute('aria-label', iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-/g, ' '));
                }
            }
        }
    });
}

/**
 * Fügt Unterstützung für Screenreader-Ankündigungen hinzu
 */
function setupScreenReaderAnnouncements() {
    // Erstelle ein Element für Screenreader-Ankündigungen
    const srAnnounce = document.createElement('div');
    srAnnounce.id = 'sr-announce';
    srAnnounce.setAttribute('aria-live', 'polite');
    srAnnounce.setAttribute('aria-atomic', 'true');
    srAnnounce.style.cssText = 'position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;';
    
    document.body.appendChild(srAnnounce);

    // Globale Funktion für Ankündigungen hinzufügen
    window.announceToScreenReader = function(message) {
        if (!message) return;
        
        const srAnnounce = document.getElementById('sr-announce');
        if (srAnnounce) {
            srAnnounce.textContent = message;
            
            // Optional: Nach einer Zeit zurücksetzen
            setTimeout(() => {
                srAnnounce.textContent = '';
            }, 3000);
        }
    };
}

/**
 * Verbessert die Tastatur-Unterstützung für benutzerdefinierte Komponenten
 */
function enhanceKeyboardSupport() {
    // Lightbox-Tastaturunterstützung
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Bildanzeige');
        
        // Tastatur-Trap für das Modal (verhindert Tabbing außerhalb)
        lightbox.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusableElements = lightbox.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                // Wenn Shift+Tab gedrückt wird und das erste Element fokussiert ist
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } 
                // Wenn Tab gedrückt wird und das letzte Element fokussiert ist
                else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
    
    // Vergleichsslider-Tastaturunterstützung
    const comparisonSliders = document.querySelectorAll('.comparison-slider');
    comparisonSliders.forEach(slider => {
        // Mache den Slider per Tastatur bedienbar
        slider.setAttribute('tabindex', '0');
        slider.setAttribute('role', 'slider');
        slider.setAttribute('aria-label', 'Vorher/Nachher-Vergleich');
        slider.setAttribute('aria-valuemin', '0');
        slider.setAttribute('aria-valuemax', '100');
        slider.setAttribute('aria-valuenow', '50');
        
        slider.addEventListener('keydown', (e) => {
            const step = e.shiftKey ? 10 : 1;
            let currentValue = parseInt(slider.getAttribute('aria-valuenow'));
            
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                currentValue = Math.max(0, currentValue - step);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                currentValue = Math.min(100, currentValue + step);
            }
            
            const container = slider.closest('.comparison-container');
            const beforeImage = container.querySelector('.before-image');
            
            if (beforeImage) {
                beforeImage.style.width = `${currentValue}%`;
                slider.style.left = `${currentValue}%`;
                slider.setAttribute('aria-valuenow', currentValue.toString());
                
                // Ankündigung für Screenreader
                window.announceToScreenReader(`Vergleichsposition: ${currentValue}%`);
            }
        });
    });
}

/**
 * Exportiert die Funktion zur Verbesserung der Barrierefreiheit
 */
export function enhanceAccessibility() {
    console.log('Enhancing accessibility...');
    improveFocusVisibility();
    addARIAAttributes();
    setupScreenReaderAnnouncements();
    enhanceKeyboardSupport();
}