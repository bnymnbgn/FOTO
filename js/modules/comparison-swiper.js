/**
 * Multiple Comparison Slider Module
 * Verhindert Überlagerung von Swiper- und Comparison-Slider-Interaktionen
 */

export function initComparisonSwiper() {
    console.log("Initialisiere Multiple Comparison Swiper...");
    
    // Swiper initialisieren
    const swiper = initSwiper();
    
    // Alle Comparison Slider initialisieren
    initAllComparisonSliders(swiper);
}

/**
 * Initialisiert Swiper für die Carousel-Funktionalität
 * mit Konfliktprävention für Comparison Slider
 */
function initSwiper() {
    if (typeof Swiper === 'undefined') {
        console.warn("Swiper nicht gefunden. Bitte Swiper-Bibliothek einbinden.");
        return null;
    }
    
    const swiperContainer = document.querySelector('.comparison-swiper');
    if (!swiperContainer) {
        console.warn("Comparison Swiper Container nicht gefunden.");
        return null;
    }
    
    // Swiper initialisieren mit besonderen Einstellungen für Interaktionsprävention
    const swiper = new Swiper('.comparison-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        preventInteractionOnTransition: true, // Verhindert Interaktion während der Transition
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        // WICHTIG: Verhindert, dass Swiper während des Slider-Ziehens aktiviert wird
        touchStartPreventDefault: false,
        on: {
            slideChange: function() {
                // Reset isDragging für alle Slider beim Slide-Wechsel
                document.querySelectorAll('.comparison-handle').forEach(handle => {
                    handle.dataset.isDragging = 'false';
                });
                
                // Initialisiere den Slider im aktuellen Slide
                const activeSlide = this.slides[this.activeIndex];
                const slider = activeSlide.querySelector('.comparison-slider');
                if (slider) {
                    initSlider(slider, swiper);
                }
            },
            touchStart: function(swiper, event) {
                // Prüfen, ob der Touch auf einem Handle stattfindet
                const handle = event.target.closest('.comparison-handle');
                if (handle) {
                    // Swiper-Bewegung unterbinden, wenn das Handle berührt wird
                    swiper.allowTouchMove = false;
                }
            },
            touchEnd: function(swiper) {
                // Swiper-Bewegung wieder erlauben, wenn Touch endet
                swiper.allowTouchMove = true;
            }
        }
    });
    
    return swiper;
}

/**
 * Initialisiert alle Comparison Slider auf der Seite
 * @param {Swiper} swiper - Die Swiper-Instanz für Konfliktprävention
 */
function initAllComparisonSliders(swiper) {
    console.log("Initialisiere Comparison Slider...");
    
    // Slider-Elemente finden
    const sliders = document.querySelectorAll('.comparison-slider');
    
    if (!sliders.length) {
        console.error("Keine Comparison-Slider gefunden!");
        return;
    }
    
    console.log("Slider gefunden:", sliders.length);
    
    // Initialisiere jeden Slider einzeln
    sliders.forEach(slider => {
        initSlider(slider, swiper);
    });
}

/**
 * Initialisiert einen einzelnen Slider mit verbesserter Konfliktprävention
 * @param {HTMLElement} slider - Der Slider, der initialisiert werden soll
 * @param {Swiper} swiper - Die Swiper-Instanz für Konfliktprävention
 */
function initSlider(slider, swiper) {
    const before = slider.querySelector('.comparison-before');
    const handle = slider.querySelector('.comparison-handle');
    
    if (!before || !handle) {
        console.error("Slider-Komponenten nicht gefunden:", { before, handle });
        return;
    }
    
    // Status für Drag-Operation
    handle.dataset.isDragging = 'false';
    
    // Start-Event für Desktop und Mobile
    handle.addEventListener('mousedown', function(e) {
        handle.dataset.isDragging = 'true';
        handle.classList.add('active');
        
        // Swiper-Bewegung deaktivieren während des Sliders
        if (swiper) {
            swiper.allowTouchMove = false;
            swiper.params.touchStartPreventDefault = false;
        }
        
        e.stopPropagation(); // Verhindert Bubblen zum Swiper
        e.preventDefault();
    });
    
    handle.addEventListener('touchstart', function(e) {
        handle.dataset.isDragging = 'true';
        handle.classList.add('active');
        
        // Swiper-Bewegung deaktivieren während des Sliders
        if (swiper) {
            swiper.allowTouchMove = false;
            swiper.params.touchStartPreventDefault = false;
        }
        
        e.stopPropagation(); // Verhindert Bubblen zum Swiper
        e.preventDefault();
    });
    
    // Desktop-Events
    document.addEventListener('mousemove', function(e) {
        if (handle.dataset.isDragging !== 'true') return;
        
        const rect = slider.getBoundingClientRect();
        let x = e.clientX - rect.left;
        
        // Position begrenzen
        x = Math.max(0, Math.min(x, rect.width));
        
        // Position anwenden
        before.style.width = x + 'px';
        handle.style.left = x + 'px';
        
        e.preventDefault();
        e.stopPropagation();
    });
    
    document.addEventListener('mouseup', function() {
        if (handle.dataset.isDragging === 'true') {
            handle.dataset.isDragging = 'false';
            handle.classList.remove('active');
            
            // Swiper-Bewegung wieder aktivieren
            if (swiper) {
                swiper.allowTouchMove = true;
            }
        }
    });
    
    // Mobile-Events
    document.addEventListener('touchmove', function(e) {
        if (handle.dataset.isDragging !== 'true') return;
        
        const rect = slider.getBoundingClientRect();
        let x = e.touches[0].clientX - rect.left;
        
        // Position begrenzen
        x = Math.max(0, Math.min(x, rect.width));
        
        // Position anwenden
        before.style.width = x + 'px';
        handle.style.left = x + 'px';
        
        e.preventDefault(); // Verhindert Scrollen während Drag
        e.stopPropagation();
    });
    
    document.addEventListener('touchend', function() {
        if (handle.dataset.isDragging === 'true') {
            handle.dataset.isDragging = 'false';
            handle.classList.remove('active');
            
            // Swiper-Bewegung wieder aktivieren
            if (swiper) {
                swiper.allowTouchMove = true;
            }
        }
    });
    
    // Initialisieren mit 50%
    const initialPosition = slider.offsetWidth / 2;
    before.style.width = initialPosition + 'px';
    handle.style.left = initialPosition + 'px';
}