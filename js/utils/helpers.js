/**
 * Helper Funktionen
 * Sammlung von wiederverwendbaren Hilfsfunktionen
 */

/**
 * Fügt ein Element zum DOM hinzu
 * @param {HTMLElement} parent - Das Elternelement
 * @param {HTMLElement} element - Das einzufügende Element
 */
export function appendElement(parent, element) {
    if (!parent || !element) {
        console.warn('Missing parent or element for appendElement');
        return;
    }
    parent.appendChild(element);
}

/**
 * Erzeugt eine zufällige Zahl in einem bestimmten Bereich
 * @param {number} min - Minimaler Wert (inklusive)
 * @param {number} max - Maximaler Wert (inklusive)
 * @returns {number} - Eine Zufallszahl zwischen min und max
 */
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Prüft, ob ein Element im sichtbaren Bereich des Viewports ist
 * @param {HTMLElement} element - Das zu prüfende Element
 * @param {number} offset - Ein optionaler Offset (Standard: 100px)
 * @returns {boolean} - Ob das Element sichtbar ist
 */
export function isElementInViewport(element, offset = 100) {
    if (!element) {
        console.warn('Missing element for isElementInViewport');
        return false;
    }
    
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top + offset < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom > 0 &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right > 0
    );
}

/**
 * Erzeugt einen Debouncer für Funktionen
 * @param {Function} func - Die zu debouncende Funktion
 * @param {number} wait - Wartezeit in Millisekunden
 * @returns {Function} - Die gedebouncte Funktion
 */
export function debounce(func, wait) {
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

/**
 * Erzeugt einen Throttler für Funktionen
 * @param {Function} func - Die zu throttelnde Funktion
 * @param {number} limit - Limit in Millisekunden
 * @returns {Function} - Die gedrosselte Funktion
 */
export function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Fügt ein CSS-Stylesheet dynamisch ein
 * @param {string} css - Die CSS-Regeln
 * @param {string} id - Eine optionale ID für das Style-Element
 * @returns {HTMLElement} - Das erstellte Style-Element
 */
export function addStyleSheet(css, id = null) {
    const style = document.createElement('style');
    
    if (id) {
        style.id = id;
    }
    
    style.textContent = css;
    document.head.appendChild(style);
    
    return style;
}

/**
 * Formatiert einen Preis mit Währungssymbol
 * @param {number} price - Der zu formatierende Preis
 * @param {string} currency - Die Währung (Standard: '€')
 * @param {string} locale - Das Locale (Standard: 'de-DE')
 * @returns {string} - Der formatierte Preis
 */
export function formatPrice(price, currency = '€', locale = 'de-DE') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency === '€' ? 'EUR' : currency
    }).format(price);
}