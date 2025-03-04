/**
 * Galerie Modul
 * Verwaltet die Filterfunktionalität und Animationen für die Galerie
 */

/**
 * Filter-Funktionalität der Galerie
 */
function setupGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterButtons.length || !galleryItems.length) {
        console.warn('Gallery filter elements not found');
        return;
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktiven Button aktualisieren
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            // Event auslösen für andere Module (z.B. Lightbox), um zu signalisieren,
            // dass sich die sichtbaren Galerie-Elemente geändert haben
            window.dispatchEvent(new CustomEvent('galleryFiltered', {
                detail: { filter: filterValue }
            }));
        });
    });
}

/**
 * Stellt Animationsreihenfolge für die Galerie-Elemente ein
 */
function setupGalleryAnimations() {
    const items = document.querySelectorAll('.gallery-item');
    
    items.forEach((item, index) => {
        item.style.setProperty('--animation-order', index);
    });
}

/**
 * Setze Event-Listener für den "Mehr anzeigen" Button
 */
function setupLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.gallery-more .btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Hier würde die tatsächliche Funktionalität zum Laden weiterer Bilder implementiert werden
            // Derzeit nur ein Platzhalter
            alert('Hier würden weitere Fotos geladen werden.');
        });
    }
}

/**
 * Initialisiert alle Galerie-Funktionen
 */
export function initGallery() {
    console.log('Initializing gallery module...');
    setupGalleryAnimations();
    setupGalleryFilter();
    setupLoadMoreButton();
}