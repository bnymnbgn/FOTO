/**
 * Vereinfachte Comparison Slider Funktionalität mit Debugging
 */

export function initComparisonSliders() {
    console.log("Initialisiere Comparison Slider...");
    
    // Sofort ausführen statt auf DOMContentLoaded zu warten
    initSliders();
    
    // Auch nach DOMContentLoaded nochmal ausführen, um sicherzugehen
    document.addEventListener('DOMContentLoaded', initSliders);
    
    function initSliders() {
        console.log("Suche nach Slidern...");
        
        // Slider-Element finden
        const slider = document.querySelector('.comparison-slider');
        
        if (!slider) {
            console.error("Kein Comparison-Slider gefunden!");
            return;
        }
        
        console.log("Slider gefunden:", slider);
        
        const before = slider.querySelector('.comparison-before');
        const handle = slider.querySelector('.comparison-handle');
        
        if (!before || !handle) {
            console.error("Slider-Komponenten nicht gefunden:", { before, handle });
            return;
        }
        
        console.log("Slider-Komponenten gefunden:", { before, handle });
        
        // Status für Drag-Operation
        let isDragging = false;
        
        // Start-Event für Desktop und Mobile
        handle.addEventListener('mousedown', function(e) {
            console.log("Mousedown auf Handle");
            isDragging = true;
            e.preventDefault();
        });
        
        handle.addEventListener('touchstart', function(e) {
            console.log("Touchstart auf Handle");
            isDragging = true;
            e.preventDefault();
        });
        
        // Desktop-Events
        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            console.log("Mousemove während Dragging");
            
            const rect = slider.getBoundingClientRect();
            let x = e.clientX - rect.left;
            
            // Position begrenzen
            x = Math.max(0, Math.min(x, rect.width));
            
            // Position anwenden
            before.style.width = x + 'px';
            handle.style.left = x + 'px';
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                console.log("Mouseup - Dragging beendet");
            }
            isDragging = false;
        });
        
        // Mobile-Events
        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            console.log("Touchmove während Dragging");
            
            const rect = slider.getBoundingClientRect();
            let x = e.touches[0].clientX - rect.left;
            
            // Position begrenzen
            x = Math.max(0, Math.min(x, rect.width));
            
            // Position anwenden
            before.style.width = x + 'px';
            handle.style.left = x + 'px';
            
            e.preventDefault(); // Verhindert Scrollen während Drag
        });
        
        document.addEventListener('touchend', function() {
            if (isDragging) {
                console.log("Touchend - Dragging beendet");
            }
            isDragging = false;
        });
        
        // Initialisieren mit 50%
        const initialPosition = slider.offsetWidth / 2;
        before.style.width = initialPosition + 'px';
        handle.style.left = initialPosition + 'px';
        
        console.log("Slider erfolgreich initialisiert mit Position:", initialPosition);
    }
}