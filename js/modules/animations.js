/**
 * Animations Modul
 * Verwaltet die Scroll-Animationen und Parallax-Effekte
 */

/**
 * Richtet Scroll-Animationen für Elemente ein
 */
function setupScrollAnimation() {
    const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    
    if (!fadeElements.length) {
        console.warn('No animation elements found');
        return;
    }
    
    const checkScroll = () => {
        const triggerBottom = window.innerHeight * 0.8;
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            } else {
                // Optional: Entferne die Klasse wieder, wenn das Element außerhalb des Sichtfelds ist
                // element.classList.remove('visible');
            }
        });
    };
    
    // Initial prüfen
    checkScroll();
    
    // Bei Scroll prüfen
    window.addEventListener('scroll', checkScroll);
    
    // Bei Resize prüfen (für responsive Layouts)
    window.addEventListener('resize', checkScroll);
}

/**
 * Richtet Parallax-Effekte ein
 */
function setupParallaxEffect() {
    const heroElement = document.querySelector('.hero');
    const decorationElements = document.querySelectorAll('.decoration-element');
    
    if (!heroElement && !decorationElements.length) {
        console.warn('No parallax elements found');
        return;
    }
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        // Hero-Parallax (wenn vorhanden)
        if (heroElement) {
            heroElement.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
        
        // Dekorative Elemente Parallax
        decorationElements.forEach((element, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            element.style.transform = `translateY(${yPos}px) rotate(${yPos / 10}deg)`;
        });
    });
}

/**
 * Initialisiert alle Animations-Funktionen
 */
export function initScrollAnimations() {
    console.log('Initializing animations module...');
    setupScrollAnimation();
    setupParallaxEffect();
}