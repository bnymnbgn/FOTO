/**
 * Erweitertes Perspective Hero Modul mit VANTA.BIRDS
 * Professionelle 3D-Effekte und interaktive Elemente für eine immersive Hero-Sektion
 */

// VANTA-Effekt Instanz
let vantaEffect = null;

/**
 * Initialisiert den VANTA.BIRDS Effekt anstatt der Partikel
 */
function initVantaBirds() {
    // Überprüfen, ob die erforderlichen Skripte vorhanden sind
    if (typeof VANTA === 'undefined' || typeof THREE === 'undefined') {
        console.warn('VANTA.BIRDS oder THREE.js nicht gefunden. Der Vögel-Effekt kann nicht initialisiert werden.');
        return;
    }
    
    // Den Hero-Hintergrund Container finden
    const heroElement = document.querySelector('.perspective-hero');
    if (!heroElement) {
        console.warn('Element .perspective-hero nicht gefunden');
        return;
    }
    
    // Farbe aus den CSS-Variablen extrahieren
    const styles = getComputedStyle(document.documentElement);
    const primaryColor = styles.getPropertyValue('--primary-color').trim();
    const secondaryColor = styles.getPropertyValue('--secondary-color').trim();
    
    // Farben in Hex-Format konvertieren
    const primaryHex = convertCssColorToHex(primaryColor);
    const secondaryHex = convertCssColorToHex(secondaryColor);
    
    // Bestehende Instanz zerstören, falls vorhanden
    if (vantaEffect !== null) {
        vantaEffect.destroy();
    }
    
    // Prüfen, ob reduzierte Bewegung gewünscht ist
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // VANTA-Effekt initialisieren mit angepassten Parametern
    vantaEffect = VANTA.BIRDS({
        el: heroElement,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        backgroundColor: 0x0, // Transparent für den Hintergrund
        color1: primaryHex,
        color2: secondaryHex,
        colorMode: "lerp",
        birdSize: 1.30,
        wingSpan: 20.00,
        speedLimit: prefersReducedMotion ? 1.00 : 3.00,
        separation: 99.00,
        alignment: 82.00,
        cohesion: 88.00,
        quantity: prefersReducedMotion ? 1.00 : 3.00,
        backgroundAlpha: 0.0 // Transparent
    });
    
    console.log('VANTA.BIRDS Effekt erfolgreich initialisiert');
}

/**
 * Hilfsfunktion, um CSS-Farben in Hex-Format zu konvertieren
 */
function convertCssColorToHex(color) {
    // Temporäres Element erstellen
    const tempElement = document.createElement('div');
    tempElement.style.color = color;
    document.body.appendChild(tempElement);
    
    // Berechnete Farbe auslesen
    const computedColor = getComputedStyle(tempElement).color;
    document.body.removeChild(tempElement);
    
    // RGB-Werte extrahieren
    const rgbMatch = computedColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        const r = parseInt(rgbMatch[1]);
        const g = parseInt(rgbMatch[2]);
        const b = parseInt(rgbMatch[3]);
        
        // Zu Hex konvertieren
        return (r << 16) + (g << 8) + b;
    }
    
    // Fallback: Ein Standard-Hex zurückgeben
    return 0x1a1a1a;
}

/**
 * Verbesserte 3D-Mausverfolgung mit Trägheit und begrenztem Bewegungsbereich
 */
function setupEnhancedMouseTracking(scene) {
    if (!scene) return;
    
    // Aktuelle und Ziel-Rotation
    let rotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };
    
    // Statusvariablen
    let isHovered = false;
    let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Bildschichten
    const imageLayers = scene.querySelectorAll('.image-layer');
    const heroContent = scene.querySelector('.hero-content');
    
    // Event-Listener für Mausbewegung mit Debounce für Performance
    let lastMouseMoveTime = 0;
    scene.addEventListener('mousemove', (e) => {
        // Throttle für bessere Performance (max. 60 FPS)
        const now = Date.now();
        if (now - lastMouseMoveTime < 16) return; // ~60fps
        lastMouseMoveTime = now;
        
        if (isReducedMotion) return;
        isHovered = true;
        
        const rect = scene.getBoundingClientRect();
        
        // Position relativ zum Zentrum des Elements (-0.5 bis 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        // Begrenzung des Rotationsbereichs für natürlichere Bewegung
        // Umwandlung von [-0.5, 0.5] zu [-12, 12] Grad mit kubischer Easing-Funktion für mehr Kontrolle an den Rändern
        targetRotation = {
            x: -y * 24 * Math.pow(Math.abs(y), 0.5), // Inverse Y-Achse für natürlichere Kippung
            y: x * 24 * Math.pow(Math.abs(x), 0.5)
        };
        
        // Parallax-Effekt auf die Bildebenen anwenden
        if (imageLayers && imageLayers.length > 0) {
            // Vorderste Ebene - stärkster Effekt
            if (imageLayers[2]) {
                imageLayers[2].style.transform = `translate3d(${-35 + x * 15}%, ${-50 + y * 10}%, 80px) rotateY(${18 + x * 5}deg)`;
            }
            
            // Mittlere Ebene - mittlerer Effekt
            if (imageLayers[1]) {
                imageLayers[1].style.transform = `translate3d(${-50 + x * 8}%, ${-50 + y * 5}%, 0px) rotateY(${x * 3}deg)`;
            }
            
            // Hinterste Ebene - schwächster Effekt
            if (imageLayers[0]) {
                imageLayers[0].style.transform = `translate3d(${-65 - x * 5}%, ${-50 + y * 2}%, -80px) rotateY(${-18 - x * 2}deg)`;
            }
        }
        
        // Parallax-Effekt auf den Textinhalt anwenden
        if (heroContent) {
            heroContent.style.transform = `translateZ(100px) translate(${x * -10}px, ${y * -10}px)`;
        }
    });
    
    // Event-Listener für Mausverlassen
    scene.addEventListener('mouseleave', () => {
        isHovered = false;
        targetRotation = { x: 0, y: 0 };
        
        // Sanft zur Ausgangsposition zurückkehren
        if (imageLayers && imageLayers.length > 0) {
            // Sanfte Transition aktivieren
            imageLayers.forEach(layer => {
                layer.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
            });
            
            // Nach Zurücksetzen der Position Transition wieder deaktivieren
            setTimeout(() => {
                if (!isHovered) { // Nur wenn immer noch nicht gehovered
                    imageLayers.forEach(layer => {
                        layer.style.transition = '';
                    });
                }
            }, 800);
            
            // Auf Ursprungspositionen zurücksetzen
            if (imageLayers[2]) {
                imageLayers[2].style.transform = 'translate3d(-35%, -50%, 80px) rotateY(18deg)';
            }
            
            if (imageLayers[1]) {
                imageLayers[1].style.transform = 'translate3d(-50%, -50%, 0)';
            }
            
            if (imageLayers[0]) {
                imageLayers[0].style.transform = 'translate3d(-65%, -50%, -80px) rotateY(-18deg)';
            }
        }
        
        // Textelement zurücksetzen
        if (heroContent) {
            heroContent.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
            heroContent.style.transform = 'translateZ(100px) translate(0, 0)';
            
            setTimeout(() => {
                if (!isHovered) {
                    heroContent.style.transition = '';
                }
            }, 800);
        }
    });
    
    // Animationsschleife für sanfte Bewegung mit verbessertem Easing
    function animateRotation() {
        // Nur aktualisieren, wenn die aktuelle Rotation von der Zielrotation abweicht
        // oder wenn die Szene aktiv ist
        if (
            Math.abs(rotation.x - targetRotation.x) > 0.01 ||
            Math.abs(rotation.y - targetRotation.y) > 0.01
        ) {
            // Sanft zur Zielposition interpolieren mit verbessertem Easing
            // Niedrigerer Wert = langsamere Bewegung für weichere Animation
            const easeFactor = 0.08;
            rotation.x += (targetRotation.x - rotation.x) * easeFactor;
            rotation.y += (targetRotation.y - rotation.y) * easeFactor;
            
            // Rotation auf die Szene anwenden
            scene.style.transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;
        }
        
        // Animationsschleife fortsetzen
        requestAnimationFrame(animateRotation);
    }
    
    // Animationsschleife starten
    animateRotation();
    
    // Event-Listener für Gyro/Beschleunigungssensor (mobile Geräte)
    if (window.DeviceOrientationEvent && !isReducedMotion) {
        window.addEventListener('deviceorientation', (e) => {
            // Nur verarbeiten wenn nicht bereits mit Maus interagiert wird
            if (!isHovered) {
                // Beta: -180 bis 180 (X-Achse - Kippen vor/zurück)
                // Gamma: -90 bis 90 (Y-Achse - Kippen links/rechts)
                const tiltX = Math.min(Math.max(e.beta - 40, -45), 45) / 45;
                const tiltY = Math.min(Math.max(e.gamma, -45), 45) / 45;
                
                // Weniger starke Bewegung für mobil
                targetRotation = {
                    x: -tiltX * 10,
                    y: tiltY * 10
                };
                
                // Parallax für die Bildebenen
                if (imageLayers && imageLayers.length > 0) {
                    if (imageLayers[2]) {
                        imageLayers[2].style.transform = `translate3d(${-35 + tiltY * 10}%, ${-50 + tiltX * 8}%, 80px) rotateY(${18 + tiltY * 4}deg)`;
                    }
                    
                    if (imageLayers[1]) {
                        imageLayers[1].style.transform = `translate3d(${-50 + tiltY * 6}%, ${-50 + tiltX * 4}%, 0px) rotateY(${tiltY * 2}deg)`;
                    }
                    
                    if (imageLayers[0]) {
                        imageLayers[0].style.transform = `translate3d(${-65 - tiltY * 4}%, ${-50 + tiltX * 2}%, -80px) rotateY(${-18 - tiltY * 2}deg)`;
                    }
                }
                
                // Parallax für den Textinhalt
                if (heroContent) {
                    heroContent.style.transform = `translateZ(100px) translate(${tiltY * -8}px, ${tiltX * -8}px)`;
                }
            }
        }, true);
    }
}

/**
 * Schwebende Elemente im Bild positionieren und mit Interaktivität versehen
 */
function setupFloatingElements() {
    // Alle schwebenden Elemente finden
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        // Zufällige Animation-Verzögerung für versetzten Start
        const delay = Math.random() * 2;
        element.style.animationDelay = `${delay}s`;
        
        // Interaktivität hinzufügen
        element.addEventListener('mouseenter', () => {
            // Stoppe die Float-Animation und setze eigene Transformation
            element.style.animation = 'none';
            element.style.transform = 'scale(1.15) translateZ(110px)';
        });
        
        element.addEventListener('mouseleave', () => {
            // Float-Animation wieder aktivieren
            const animationName = element.classList.contains('star-element') ? 'float' : 'float';
            const duration = element.classList.contains('star-element') ? '6s' : '7s';
            
            element.style.animation = `${animationName} ${duration} ease-in-out infinite`;
            element.style.animationDelay = `${delay}s`;
        });
        
        // Klick-Effekt für interaktive Elemente
        element.addEventListener('click', createSparkleEffect);
    });
    
    // Scroll-Indikator mit Smooth-Scroll Funktionalität
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // Zum nächsten Abschnitt scrollen
            const nextSection = document.querySelector('#about') || 
                               document.querySelector('section:nth-of-type(2)');
            
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
}

/**
 * Erzeugt einen Funkel-Effekt, wenn auf ein schwebendes Element geklickt wird
 */
function createSparkleEffect(event) {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    
    // Anzahl der Funkel
    const sparkleCount = 15;
    
    // Hauptfarbe basierend auf Element-Klasse
    let mainColor = '#FFD166';
    if (element.classList.contains('magic-element')) {
        mainColor = '#64c4ed';
    }
    
    // Container für den Perspektiven-Hero finden
    const heroSection = document.querySelector('.perspective-hero');
    if (!heroSection) return;
    
    // Funkel erstellen
    for (let i = 0; i < sparkleCount; i++) {
        // Funkel-Element erstellen
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Zufällige Position innerhalb des Elements
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Zufällige Größe
        const size = Math.random() * 8 + 4;
        
        // Funkel-Stil festlegen
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.position = 'fixed';
        sparkle.style.borderRadius = '50%';
        sparkle.style.backgroundColor = i % 3 === 0 ? '#ffffff' : mainColor;
        sparkle.style.boxShadow = `0 0 ${size}px ${mainColor}`;
        
        // Startposition (Zentrum des Elements)
        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        sparkle.style.zIndex = '1000';
        
        // Zum Dokument hinzufügen
        document.body.appendChild(sparkle);
        
        // Zufällige Richtung und Entfernung
        const angle = Math.random() * Math.PI * 2; // 0 bis 2π
        const distance = Math.random() * 100 + 50; // 50 bis 150px
        const destinationX = centerX + Math.cos(angle) * distance;
        const destinationY = centerY + Math.sin(angle) * distance;
        
        // Animation mit GSAP
        if (window.gsap) {
            gsap.to(sparkle, {
                left: destinationX,
                top: destinationY,
                opacity: 0,
                duration: Math.random() * 0.8 + 0.6,
                ease: "power2.out",
                onComplete: () => {
                    document.body.removeChild(sparkle);
                }
            });
        } else {
            // Fallback, wenn GSAP nicht verfügbar ist
            sparkle.style.transition = `all ${Math.random() * 0.8 + 0.6}s ease-out`;
            setTimeout(() => {
                sparkle.style.left = `${destinationX}px`;
                sparkle.style.top = `${destinationY}px`;
                sparkle.style.opacity = '0';
            }, 10);
            
            // Element entfernen nach Animation
            setTimeout(() => {
                if (document.body.contains(sparkle)) {
                    document.body.removeChild(sparkle);
                }
            }, 1500);
        }
    }
    
    // Haptisches Feedback auf unterstützten Geräten
    if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
    }
}

/**
 * Erstellt die Glowing Accent Circles, die den Hintergrund dramatischer gestalten
 */
function setupGlowingAccents() {
    const heroSection = document.querySelector('.perspective-hero');
    if (!heroSection) return;
    
    // Überprüfen, ob bereits Glowing Circles vorhanden sind
    if (heroSection.querySelector('.glow-circle')) return;
    
    // Drei Glowing Circles mit unterschiedlichen Positionen und Größen erstellen
    for (let i = 1; i <= 3; i++) {
        const glowCircle = document.createElement('div');
        glowCircle.className = `glow-circle glow-circle-${i}`;
        heroSection.appendChild(glowCircle);
    }
}

/**
 * Richtet Hover-Effekte für die Bilder ein
 */
function setupImageHoverEffects() {
    const imageCards = document.querySelectorAll('.image-card');
    
    imageCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Keine Transition beim Mouse-Enter für sofortige Reaktion
            card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease';
            card.style.transform = 'scale(1.03)';
            card.style.boxShadow = '0 30px 60px -15px rgba(0, 0, 0, 0.45)';
            
            // Badge-Effekt
            const badge = card.querySelector('.image-badge');
            if (badge) {
                badge.style.transform = 'rotate(-5deg) translateZ(5px) scale(1.1)';
            }
            
            // Bild-Zoom-Effekt
            const image = card.querySelector('.image-cover');
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Sanfte Transition beim Mouseleave
            card.style.transition = 'transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.5s ease';
            card.style.transform = '';
            card.style.boxShadow = '';
            
            // Badge-Effekt zurücksetzen
            const badge = card.querySelector('.image-badge');
            if (badge) {
                badge.style.transform = 'rotate(-5deg) translateZ(5px) scale(1)';
            }
            
            // Bild-Zoom-Effekt zurücksetzen
            const image = card.querySelector('.image-cover');
            if (image) {
                image.style.transform = '';
            }
        });
    });
}

/**
 * Richtet Parallax-Effekte beim Scrollen ein
 */
function setupScrollParallax() {
    // Das Hero-Element
    const hero = document.querySelector('.perspective-hero');
    if (!hero) return;
    
    // Die Elemente, die parallax-Effekte erhalten sollen
    const scene = document.getElementById('perspectiveScene');
    const glowCircles = document.querySelectorAll('.glow-circle');
    
    // Event-Listener für das Scrollen
    window.addEventListener('scroll', () => {
        // Scrollfortschritt im Hero-Bereich (0 bis 1)
        const heroHeight = hero.offsetHeight;
        const scrollPosition = window.scrollY;
        const scrollProgress = Math.min(scrollPosition / heroHeight, 1);
        
        // Nur anwenden, wenn im sichtbaren Bereich
        if (scrollProgress <= 1) {
            // Parallax-Effekt für die Szene
            if (scene) {
                scene.style.transform = `translateY(${scrollProgress * 100}px)`;
                scene.style.opacity = `${1 - scrollProgress * 1.2}`;
            }
            
            // Parallax-Effekt für Glowing Circles
            glowCircles.forEach((circle, index) => {
                const direction = index % 2 === 0 ? 1 : -1;
                const speed = index === 1 ? 200 : 150;
                circle.style.transform = `translateY(${scrollProgress * speed * direction}px)`;
            });
        }
    });
}

/**
 * Beendet aktive Effekte und räumt auf
 */
function cleanupVantaEffects() {
    if (vantaEffect !== null) {
        vantaEffect.destroy();
        vantaEffect = null;
    }
}

/**
 * Event-Listener für Fenstergröße, um Vanta-Effekt anzupassen
 */
function setupResizeListener() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        // Debounce für bessere Performance
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Bei Größenänderung Vanta neu initialisieren
            if (vantaEffect !== null) {
                const oldEffect = vantaEffect;
                vantaEffect = null;
                oldEffect.destroy();
                initVantaBirds();
            }
        }, 250);
    });
}

/**
 * Exportiert die Funktion zur Initialisierung des Hero-Bereichs
 */
export function initPerspectiveHero() {
    console.log('Initialisiere erweiterte 3D-Hero-Sektion mit VANTA.BIRDS...');
    
    // Den DOM komplett laden lassen, bevor Effekte initialisiert werden
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerspectiveHeroEffects);
    } else {
        initPerspectiveHeroEffects();
    }
    
    // Cleanup bei Entladen der Seite
    window.addEventListener('beforeunload', cleanupVantaEffects);
}

/**
 * Initialisiert alle Effekte für die Hero-Sektion
 */
function initPerspectiveHeroEffects() {
    // Das Scene-Element finden
    const scene = document.getElementById('perspectiveScene');
    
    // Prüfen, ob das Element existiert, bevor wir weitermachen
    if (scene) {
        // 3D-Mauseffekte einrichten
        setupEnhancedMouseTracking(scene);
        
        // Bilder-Hover-Effekte einrichten
        setupImageHoverEffects();
    } else {
        console.warn('Element #perspectiveScene nicht gefunden. Mauseffekte werden nicht initialisiert.');
    }
    
    // VANTA.BIRDS statt Partikel initialisieren
    initVantaBirds();
    
    // Glowing Accent Circles einrichten
    setupGlowingAccents();
    
    // Schwebende Elemente einrichten
    setupFloatingElements();
    
    // Event-Listener für das Scrollen hinzufügen, um Parallax-Effekte zu aktivieren
    setupScrollParallax();
    
    // Event-Listener für Fenstergröße einrichten
    setupResizeListener();
}