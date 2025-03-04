/**
 * Navigation Modul
 * Verwaltet die mobile Navigation und Smooth Scrolling
 */

/**
 * Initialisiert die mobile Navigation
 */
function toggleMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) {
        console.warn('Navigation elements not found');
        return;
    }
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
    
    // Schließe das Menü, wenn ein Link geklickt wird
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
}

/**
 * Initialisiert Smooth Scrolling für Links mit Anker-Zielen
 */
function smoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset für Header
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Aktiviere Header-Schatten beim Scrollen
 */
function headerShadow() {
    const header = document.querySelector('header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Initialisiert alle Navigations-Funktionen
 */
export function initNavigation() {
    console.log('Initializing navigation module...');
    toggleMobileNav();
    smoothScrolling();
    headerShadow();
}