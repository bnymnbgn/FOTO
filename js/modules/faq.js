/**
 * FAQ Modul
 * Verwaltet die FAQ Accordion-Funktionalität
 */

/**
 * Richtet die Accordion-Funktionalität für FAQ-Bereiche ein
 */
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) {
        console.warn('No FAQ items found');
        return;
    }
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (!question || !answer) {
            console.warn(`FAQ item ${index} is missing question or answer`);
            return;
        }
        
        // Füge ARIA-Attribute für Barrierefreiheit hinzu
        question.setAttribute('id', `faq-question-${index}`);
        answer.setAttribute('id', `faq-answer-${index}`);
        
        question.setAttribute('aria-expanded', 'false');
        question.setAttribute('aria-controls', `faq-answer-${index}`);
        
        answer.setAttribute('aria-labelledby', `faq-question-${index}`);
        
        // Event-Listener für Klick-Aktionen
        question.addEventListener('click', () => {
            toggleFAQItem(item, faqItems);
            
            // Aktualisiere ARIA-Attribute
            const expanded = item.classList.contains('active');
            question.setAttribute('aria-expanded', expanded.toString());
        });
    });
}

/**
 * Schaltet ein FAQ-Element um (auf/zu)
 * @param {HTMLElement} item - Das zu schaltende FAQ-Element
 * @param {NodeList} faqItems - Alle FAQ-Elemente (um andere zu schließen)
 */
function toggleFAQItem(item, faqItems) {
    const isActive = item.classList.contains('active');
    
    // Schließe alle anderen Elemente
    faqItems.forEach(faqItem => faqItem.classList.remove('active'));
    
    // Öffne das geklickte Element, wenn es zuvor nicht aktiv war
    if (!isActive) {
        item.classList.add('active');
    }
}

/**
 * Initialisiert die FAQ-Funktionalität
 */
export function initFAQ() {
    console.log('Initializing FAQ module...');
    setupFAQAccordion();
}