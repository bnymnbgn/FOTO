/**
 * Erweitertes Perspective Hero Modul
 * Professionelle 3D-Effekte und interaktive Elemente für eine immersive Hero-Sektion
 */

/**
 * Partikel mit unterschiedlichen Größen, Farben und Bewegungen erstellen
 */
function createEnhancedParticles() {
    const particlesContainer = document.querySelector('.perspective-hero .particles-container');
    if (!particlesContainer) {
        console.warn('Partikel-Container nicht gefunden');
        return;
    }
    
    // Bestehende Partikel entfernen, falls vorhanden
    const existingParticles = particlesContainer.querySelectorAll('.particle');
    existingParticles.forEach(particle => particle.remove());
    
    // Verschiedene Partikeltypen und Größen definieren
    const particleTypes = [
        { 
            minSize: 2, 
            maxSize: 5, 
            count: 20, 
            opacity: '0.4',
            color: 'rgba(255, 255, 255, 0.8)',
            blur: '0px',
            speed: { min: 15, max: 25 }
        },
        { 
            minSize: 5, 
            maxSize: 12, 
            count: 10, 
            opacity: '0.25',
            color: 'rgba(255, 255, 255, 0.7)',
            blur: '1px',
            speed: { min: 25, max: 35 }
        },
        { 
            minSize: 12, 
            maxSize: 20, 
            count: 5, 
            opacity: '0.15',
            color: 'rgba(255, 255, 255, 0.6)',
            blur: '2px',
            speed: { min: 35, max: 50 }
        }
    ];
    
    // Alle Partikeltypen durchlaufen und erstellen
    particleTypes.forEach(type => {
        for (let i = 0; i < type.count; i++) {
            createParticle(
                particlesContainer,
                type.minSize,
                type.maxSize,
                type.opacity,
                type.color,
                type.blur,
                type.speed
            );
        }
    });
}

/**
 * Einzelnes Partikel mit individueller Animation erstellen
 */
function createParticle(container, minSize, maxSize, opacity, color, blur, speed) {
    // Zufällige Größe innerhalb des angegebenen Bereichs
    const size = Math.random() * (maxSize - minSize) + minSize;
    
    // Zufällige Position
    const xPos = Math.random() * 100;
    const yPos = Math.random() * 100;
    
    // Zufällige Bewegungsdistanz
    const xMovement = Math.random() * 100 + speed.min;
    const yMovement = Math.random() * 100 + speed.min;
    
    // Zufällige Animationsdauer (basierend auf Geschwindigkeitsbereich)
    const animationDuration = (Math.random() * (speed.max - speed.min) + speed.min);
    
    // Zufällige Verzögerung für versetzten Start
    const animationDelay = Math.random() * 5;
    
    // Partikel-Element erstellen
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Aussehen und Position
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${xPos}%`;
    particle.style.top = `${yPos}%`;
    particle.style.opacity = opacity;
    particle.style.backgroundColor = color;
    particle.style.filter = `blur(${blur})`;
    
    // Eigene Keyframes für jedes Partikel
    const uniqueId = Math.floor(Math.random() * 10000);
    const keyframes = `
    @keyframes floatParticle${uniqueId} {
        0% { transform: translate(0, 0); }
        25% { transform: translate(${xMovement * 0.3}px, ${-yMovement * 0.5}px); }
        50% { transform: translate(${xMovement * 0.7}px, ${-yMovement * 0.2}px); }
        75% { transform: translate(${-xMovement * 0.2}px, ${yMovement * 0.4}px); }
        100% { transform: translate(0, 0); }
    }`;
    
    // Style-Element erstellen und zum Dokument hinzufügen
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    
    // Animation auf das Partikel anwenden
    particle.style.animation = `floatParticle${uniqueId} ${animationDuration}s ease-in-out infinite`;
    particle.style.animationDelay = `${animationDelay}s`;
    
    // Partikel zum Container hinzufügen
    container.appendChild(particle);
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
    const particles = document.querySelector('.particles-container');
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
            // Parallax-Effekt für Partikel
            if (particles) {
                particles.style.transform = `translateY(${scrollProgress * 150}px)`;
                particles.style.opacity = `${1 - scrollProgress * 1.5}`;
            }
            
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
 * Exportiert die Funktion zur Initialisierung des Hero-Bereichs
 */
export function initPerspectiveHero() {
    console.log('Initialisiere erweiterte 3D-Hero-Sektion...');
    
    // Den DOM komplett laden lassen, bevor Effekte initialisiert werden
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerspectiveHeroEffects);
    } else {
        initPerspectiveHeroEffects();
    }
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
    
    // Verbesserte Partikel erstellen
    createEnhancedParticles();
    
    // Glowing Accent Circles einrichten
    setupGlowingAccents();
    
    // Schwebende Elemente einrichten
    setupFloatingElements();
    
    // Event-Listener für das Scrollen hinzufügen, um Parallax-Effekte zu aktivieren
    setupScrollParallax();
}
