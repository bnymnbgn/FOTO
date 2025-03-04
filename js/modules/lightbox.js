/**
 * Lightbox Modul - Einfache Version ohne Comparison-Slider
 */

// Modul-weite Variablen
let lightbox;
let lightboxCaption;
let currentIndex = 0;
let galleryImages = [];

/**
 * Aktualisiert das Array der sichtbaren Galerie-Bilder
 */
function updateGalleryImages() {
    galleryImages = []; // Array zurücksetzen
    
    document.querySelectorAll('.gallery-item:not([style*="display: none"]) img').forEach((img) => {
        const item = img.closest('.gallery-item');
        const caption = item.querySelector('.gallery-overlay h3')?.textContent || '';
        const description = item.querySelector('.gallery-overlay p')?.textContent || '';
        
        galleryImages.push({
            src: img.src,
            caption: caption,
            description: description
        });
    });
}

/**
 * Lightbox öffnen mit einem bestimmten Bild
 */
function openLightbox(index) {
    currentIndex = index;
    const currentImage = galleryImages[currentIndex];
    
    // Lightbox-Inhalt vorbereiten
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    
    // Bestehende Bilder entfernen
    const existingImage = lightboxContent.querySelector('.lightbox-image');
    if (existingImage) {
        existingImage.remove();
    }
    
    // Neues Bild erstellen und einfügen
    const image = document.createElement('img');
    image.src = currentImage.src;
    image.alt = currentImage.caption;
    image.className = 'lightbox-image';
    
    // Bild vor der Caption einfügen
    if (lightboxCaption) {
        lightboxContent.insertBefore(image, lightboxCaption);
    } else {
        lightboxContent.appendChild(image);
    }
    
    // Caption aktualisieren
    if (lightboxCaption) {
        if (currentImage.caption && currentImage.description) {
            lightboxCaption.innerHTML = `<strong>${currentImage.caption}</strong><br>${currentImage.description}`;
        } else if (currentImage.caption) {
            lightboxCaption.innerHTML = `<strong>${currentImage.caption}</strong>`;
        } else {
            lightboxCaption.innerHTML = '';
        }
    }
    
    // Lightbox anzeigen
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Verhindert Scrollen
}

/**
 * Initialisiert Event-Listener für Lightbox-Steuerung
 */
function setupLightboxControls() {
    // Schließen-Button
    const closeBtn = lightbox.querySelector('.lightbox-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            closeLightbox();
            e.stopPropagation();
            e.preventDefault();
        });
    }
    
    // Navigation-Buttons
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            nextImage();
            e.stopPropagation();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            prevImage();
            e.stopPropagation();
        });
    }
    
    // Tastatur-Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
    
    // Klick auf die Lightbox-Hintergrund schließt die Lightbox
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || 
            e.target.classList.contains('lightbox-backdrop') || 
            e.target.classList.contains('dark-overlay')) {
            closeLightbox();
        }
    });
}

/**
 * Schließt die Lightbox
 */
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Scrollen wieder erlauben
}

/**
 * Wechselt zum nächsten Bild
 */
function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightboxContent();
}

/**
 * Wechselt zum vorherigen Bild
 */
function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxContent();
}

/**
 * Aktualisiert den Inhalt der Lightbox
 */
function updateLightboxContent() {
    const currentImage = galleryImages[currentIndex];
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    
    // Bestehende Bilder entfernen
    const existingImage = lightboxContent.querySelector('.lightbox-image');
    if (existingImage) {
        existingImage.remove();
    }
    
    // Neues Bild erstellen und einfügen
    const image = document.createElement('img');
    image.src = currentImage.src;
    image.alt = currentImage.caption;
    image.className = 'lightbox-image';
    
    // Bild vor der Caption einfügen
    if (lightboxCaption) {
        lightboxContent.insertBefore(image, lightboxCaption);
    } else {
        lightboxContent.appendChild(image);
    }
    
    // Caption aktualisieren
    if (lightboxCaption) {
        if (currentImage.caption && currentImage.description) {
            lightboxCaption.innerHTML = `<strong>${currentImage.caption}</strong><br>${currentImage.description}`;
        } else if (currentImage.caption) {
            lightboxCaption.innerHTML = `<strong>${currentImage.caption}</strong>`;
        } else {
            lightboxCaption.innerHTML = '';
        }
    }
}

/**
 * Initialisiert Klick-Handler für Galerie-Bilder
 */
function setupImageClickHandlers() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach((img) => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            updateGalleryImages();
            
            // Den Index des Bildes im aktuell gefilterten Array finden
            const clickedSrc = img.src;
            const clickedIndex = galleryImages.findIndex(image => image.src === clickedSrc);
            
            if (clickedIndex !== -1) {
                openLightbox(clickedIndex);
            }
        });
    });
}

/**
 * Hört auf Änderungen der gefilterten Galerie
 */
function listenForGalleryChanges() {
    window.addEventListener('galleryFiltered', () => {
        setTimeout(updateGalleryImages, 300);
    });
}

/**
 * Hauptfunktion zur Initialisierung der Lightbox
 */
export function initLightbox() {
    console.log('Initializing simple lightbox...');
    
    // Lightbox und Caption finden
    lightbox = document.getElementById('gallery-lightbox');
    
    if (!lightbox) {
        console.warn('Lightbox element not found');
        return;
    }
    
    lightboxCaption = document.getElementById('lightbox-caption');
    
    // Galerie-Bilder aktualisieren
    updateGalleryImages();
    
    // Event-Listener einrichten
    setupImageClickHandlers();
    setupLightboxControls();
    listenForGalleryChanges();
    
    console.log('Simple lightbox initialization complete');
}