/**
 * Scrollytelling-Transformation Modul
 * Erstellt eine scroll-basierte Animation zur Transformation von Kinderfotos
 * Optimierte Version mit verbesserten Übergangseffekten
 */

// Prüfen, ob GSAP vorhanden ist und die benötigten Plugins registrieren
if (typeof gsap !== 'undefined') {
    // Plugins registrieren, wenn vorhanden
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    } else {
        console.warn('ScrollTrigger ist nicht verfügbar. Die Scrollytelling-Komponente benötigt ScrollTrigger für Animationen.');
    }
    
    if (typeof CustomEase !== 'undefined') {
        gsap.registerPlugin(CustomEase);
        // Benutzerdefinierte Easing-Kurven erstellen für organischere Animationen
        CustomEase.create("elasticOut", "0.64, 0.57, 0.67, 1.53");
        CustomEase.create("softBack", "0.25, 1.5, 0.35, 1");
    }
} else {
    console.warn('GSAP ist nicht verfügbar. Die Scrollytelling-Komponente benötigt GSAP für Animationen.');
}

// Aktueller Status
let currentStage = 1;
let isAnimating = false;

/**
 * Initialisiert das Scrollytelling-Transformations-Modul
 */
export function initTransformation() {
    console.log('Initialisiere Vollbild-Transformations-Modul...');
    
    // HTML-Container erstellen oder finden
    setupTransformationContainer();
    
    // Überprüfen, ob der ScrollTrigger verfügbar ist
    if (typeof ScrollTrigger === 'undefined' || typeof gsap === 'undefined') {
        console.warn('ScrollTrigger oder GSAP ist nicht verfügbar. Die Vollbild-Komponente kann nicht initialisiert werden.');
        return;
    }
    
    // Verzögerung, um sicherzustellen, dass der DOM fertig geladen ist
    setTimeout(() => {
        // Initialisiere alle Szenenelemente
        initSceneElements();
    }, 500);
}



/**
 * Initialisiert alle Szenenelemente nach dem DOM-Laden
 */
function initSceneElements() {
    // Zuerst die Layer-Elemente finden
    const layers = document.querySelectorAll('.image-layer');
    if (!layers || layers.length === 0) {
        console.error('Keine Image-Layer gefunden! Die Transformation kann nicht initialisiert werden.');
        return;
    }
    
    // Elemente initialisieren
    const transformContainer = document.getElementById('transformContainer');
    const stepIndicators = document.querySelectorAll('.step-indicator');
    const progressBar = document.querySelector('.progress-fill');
    
    // Hintergrundfarben für jede Stufe
    const bgColors = [
        "linear-gradient(120deg, #ffffff 0%, #f8f9fa 100%)",
        "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
        "linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%)",
        "linear-gradient(120deg, #f6d365 0%, #fda085 100%)",
        "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
        "linear-gradient(120deg, #6a11cb 0%, #2575fc 100%)",
        "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)"
    ];
    
    // Stufenbeschriftungen
    const stageLabels = [
        "Original",
        "Silhouette",
        "Form",
        "Ballons",
        "Koala",
        "Astronaut",
        "Traumwelt"
    ];
    
    // Szene initialisieren mit den gefundenen Layers
    initScene(layers);
    
    // Partikel für den Hintergrund erstellen
    createParticles();
    
    // Aktiviere 3D-Effekt mit verbesserter Performance
    enable3DEffect(transformContainer);
    
    // ScrollTrigger für den gesamten Transformationsprozess
    const mainScrollTrigger = ScrollTrigger.create({
        trigger: "#transformationSection",
        start: "top top",
        end: "+=600%", // 7 Schritte mit je etwa 100% Viewport-Höhe
        pin: true, // Wichtig: Pin die gesamte Sektion
        anticipatePin: 1, // Verbessertes Pinning
        scrub: 1, // Smooth scrubbing mit Verzögerung
        markers: false, // Für Debugging true setzen
        onUpdate: (self) => {
            // Aktuelle Fortschrittsposition (0-1)
            const progress = self.progress;
            
            // Schritt basierend auf Fortschritt berechnen (0-6)
            // 0 = Originalbild, 6 = fertiges Bild
            let step = Math.floor(progress * 7);
            if (step > 6) step = 6; // Maximal 7 Stufen (0-6)
            
            // Fortschritt innerhalb des aktuellen Schritts (0-1)
            const stepProgress = (progress * 7) - step;
            
            // Nur ausführen, wenn der Schritt sich geändert hat
            if (step !== currentStage) {
                // Für schnelleres Scrollen verwenden wir den immediate Parameter
                // um die Animationen zu überspringen
                showStage(step, step !== currentStage + 1 && step !== currentStage - 1);
            }
            
            // Hintergrund aktualisieren
            const bgGradient = document.getElementById('bgGradient');
            if (bgGradient) {
                bgGradient.style.opacity = step > 0 ? 1 : 0;
                bgGradient.style.background = bgColors[step];
            }
            
            // Fortschrittsanzeige aktualisieren
            if (progressBar) {
                progressBar.style.width = `${(step / 6 * 100)}%`;
            }
            
            // Aktiven Schritt markieren
            updateActiveStep(step, stepIndicators, stageLabels);
        }
    });
    
    // Click-Events für die Schritt-Indikatoren einrichten
    setupStepIndicatorClicks(stepIndicators, stageLabels);
}

/**
 * Initialisiert die Szene mit den Bildebenen
 * @param {NodeList} layers - Die Bildebenen-Elemente
 */
function initScene(layers) {
    // Setze die richtigen Pfade für die Bilder, falls sie angepasst werden müssen
    const imagePaths = [
        "assets/transforms/1.png", // Originalbild
        "assets/transforms/2.png", // Silhouette
        "assets/transforms/3.png", // Form
        "assets/transforms/4.png", // Ballons
        "assets/transforms/5.png", // Koala
        "assets/transforms/6.png", // Astronaut
        "assets/transforms/7.png"  // Traumwelt
    ];

    // Alle Ebenen außer der ersten ausblenden - aber aufbauend vorbereiten
    layers.forEach((layer, index) => {
        // Überprüfen, ob das img-Element existiert und den richtigen src-Pfad hat
        const imgElement = layer.querySelector('img');
        if (imgElement && imagePaths[index]) {
            imgElement.src = imagePaths[index];
        }
        
        if (index === 0) {
            // Erste Ebene ist voll sichtbar
            gsap.set(layer, { opacity: 1 });
        } else {
            // Alle anderen Ebenen sind anfangs unsichtbar
            gsap.set(layer, { opacity: 0 });
            
            // Sicherstellen, dass die Z-Index-Staffelung stimmt
            layer.style.zIndex = index + 1;
        }
    });
}

/**
 * Event-Listener für Klick auf die Schritt-Indikatoren
 */
function setupStepIndicatorClicks(indicators, stageLabels) {
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (isAnimating) return;
            
            // Zu diesem Schritt springen
            showStage(index);
            
            // Wenn wir ScrollTrigger haben, zum entsprechenden Punkt scrollen
            const trigger = ScrollTrigger.getById('transformationTrigger');
            if (trigger) {
                const progress = index / 6; // 0-1 basierend auf 7 Schritten
                trigger.scroll(trigger.start + (trigger.end - trigger.start) * progress);
            }
        });
    });
}

// In transformation.js oder page3.html Script-Bereich
// Verwenden Sie requestAnimationFrame für komplexe Animationen statt nur GSAP
function setupAdvancedAnimations() {
    const transformContainer = document.getElementById('transformContainer');
    let lastTime = 0;
    
    const animate = (time) => {
        if (!lastTime) lastTime = time;
        const delta = (time - lastTime) * 0.001;
        
        // Animate floating elements with more complex paths
        const elements = document.querySelectorAll('.floating-element, .element');
        elements.forEach((element, index) => {
            const seed = index * 0.1;
            element.style.transform = `translateY(${
                Math.sin((time * 0.001) + seed) * 15
            }px) rotate(${
                Math.sin((time * 0.0007) + seed) * 3
            }deg) translateX(${
                Math.sin((time * 0.0008) + seed + 2) * 8
            }px)`;
        });
        
        lastTime = time;
        requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
}     

// Ersetzen Sie die enable3DEffect Funktion in der transformation.js
function enable3DEffect(transformContainer) {
    if (!transformContainer) return;
    
    let isMouseOver = false;
    let lastMouseX = 0;
    let lastMouseY = 0;
    let rotationX = 0;
    let rotationY = 0;
    
    // Sanfte Verfolgung für organischere Bewegung
    function updateRotation() {
        if (!isMouseOver) {
            // Rückstellung, wenn keine Maus über dem Element
            rotationX += (0 - rotationX) * 0.05;
            rotationY += (0 - rotationY) * 0.05;
        }
        
        // Aktualisiere Container-Rotation mit Dämpfung für natürlichere Bewegung
        gsap.set(transformContainer, {
            rotateX: rotationX,
            rotateY: rotationY
        });
        
        requestAnimationFrame(updateRotation);
    }
    
    // Starte den Animation-Loop
    updateRotation();
    
    transformContainer.addEventListener('mouseenter', () => {
        isMouseOver = true;
    });
    
    transformContainer.addEventListener('mouseleave', () => {
        isMouseOver = false;
    });
    
    transformContainer.addEventListener('mousemove', (e) => {
        if (isAnimating) return;
        
        const rect = transformContainer.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Berechne Mausposition relativ zum Zentrum (-1 bis 1)
        const mouseX = (e.clientX - rect.left - centerX) / centerX;
        const mouseY = (e.clientY - rect.top - centerY) / centerY;
        
        // Ziel-Rotation (maximaler Ausschlag: 15 Grad)
        const targetRotationX = -mouseY * 15;
        const targetRotationY = mouseX * 15;
        
        // Sanfte Interpolation für organische Bewegung
        rotationX += (targetRotationX - rotationX) * 0.1;
        rotationY += (targetRotationY - rotationY) * 0.1;
    });
}

// Fügen Sie diese Funktion zu transformation.js hinzu
function createSequencedTransition(stage, layer, immediate = false) {
    if (immediate) {
        gsap.set(layer, { opacity: 1, scale: 1 });
        return;
    }
    
    const tl = gsap.timeline({
        defaults: { duration: 0.7, ease: "power2.out" }
    });
    
    switch (stage) {
        case 7: // Finale Transformation mit sequentiellen Highlights
            // Anfänglicher Reset
            gsap.set(layer, { opacity: 0, scale: 1.05 });
            
            // Lichtblitz-Overlay
            const flashOverlay = document.createElement('div');
            flashOverlay.className = 'flash-overlay';
            flashOverlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                opacity: 0;
                z-index: 100;
                pointer-events: none;
            `;
            layer.parentNode.appendChild(flashOverlay);
            
            // Sequentielle Animation
            tl.to(flashOverlay, { opacity: 0.9, duration: 0.2 })
              .to(flashOverlay, { opacity: 0, duration: 0.6 }, "+=0.1")
              .to(layer, { opacity: 1, scale: 1 }, "-=0.5")
              .to(layer, { filter: "brightness(1.2) saturate(1.2)" }, "-=0.3")
              .to(layer, { filter: "brightness(1) saturate(1)" }, "+=0.2")
              .add(() => {
                  // Finale Partikel explodieren
                  createParticleExplosion();
              }, "-=0.3")
              .add(() => {
                  // Animation beenden und aufräumen
                  layer.parentNode.removeChild(flashOverlay);
                  layer.classList.add('finalized');
                  isAnimating = false;
              });
            break;
            
        // Weitere fallspezifische Animationen hier
    }
    
    return tl;
}

function showStage(stage, immediate = false) {
    if (isAnimating && !immediate) return;
    
    isAnimating = true;
    
    // Debug-Ausgabe, um zu sehen, welche Stage angezeigt wird
    console.log(`Showing stage ${stage}, immediate: ${immediate}`);
    
    // Aktualisiere den stageLabel
    const stageLabel = document.getElementById('stageLabel');
    if (stageLabel) {
        const stageLabels = [
            "Original",
            "Silhouette",
            "Form",
            "Ballons",
            "Koala",
            "Astronaut",
            "Traumwelt"
        ];
        stageLabel.textContent = stageLabels[stage] || `Schritt ${stage + 1}`;
    }
    
    // WICHTIG: Alle Layer bis einschließlich der aktuellen Stufe anzeigen
    // Höhere Layer ausblenden
    for (let i = 1; i <= 7; i++) {
        const layer = document.getElementById(`layer${i}`);
        if (!layer) {
            console.warn(`Layer ${i} not found`);
            continue;
        }
        
        // Wenn der Layer-Index kleiner oder gleich der aktuellen Stufe ist, anzeigen
        // Beachte: stage beginnt bei 0, Layer-Indizes bei 1
        if (i <= stage + 1) {
            // Layer einblenden
            gsap.to(layer, {
                opacity: 1,
                duration: immediate ? 0 : 0.5,
                ease: "power2.out"
            });
        } else {
            // Höhere Layer ausblenden
            gsap.to(layer, {
                opacity: 0,
                duration: immediate ? 0 : 0.3,
                ease: "power2.inOut"
            });
        }
    }
    
    // Spezielle Animation nur für den neuen Layer, der gerade hinzugefügt wird
    const newLayer = document.getElementById(`layer${stage + 1}`);
    if (!newLayer) {
        console.warn(`New layer (${stage + 1}) not found`);
        isAnimating = false;
        return;
    }
    
    // Spezifische Animationen für jede Stufe
    switch (stage) {
        case 0: // Ersten Layer einblenden (Original)
            if (!immediate) {
                gsap.fromTo(newLayer, 
                    { opacity: 0, scale: 0.9 },
                    {
                        opacity: 1, 
                        scale: 1,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete: () => { isAnimating = false; }
                    }
                );
            } else {
                gsap.set(newLayer, { opacity: 1, scale: 1 });
                isAnimating = false;
            }
            break;
            
        case 1: // Zweiten Layer hinzufügen
            if (!immediate) {
                gsap.fromTo(newLayer, 
                    { opacity: 0, scale: 1.2 },
                    {
                        opacity: 1, 
                        scale: 1,
                        duration: 1.2,
                        ease: "power2.out",
                        onComplete: () => { isAnimating = false; }
                    }
                );
                
                // Wolken-Animation
                const clouds = document.querySelectorAll('.cloud');
                if (clouds.length > 0) {
                    gsap.fromTo(clouds, 
                        { opacity: 0, y: -50, scale: 0.5 },
                        {
                            opacity: 0.9,
                            y: 0,
                            scale: 1,
                            duration: 1,
                            stagger: 0.1,
                            ease: "back.out(1.7)"
                        }
                    );
                }
            } else {
                gsap.set(newLayer, { opacity: 1, scale: 1 });
                gsap.set(document.querySelectorAll('.cloud'), { opacity: 0.9, y: 0, scale: 1 });
                isAnimating = false;
            }
            break;
            
        case 2: // Dritten Layer hinzufügen
            if (!immediate) {
                gsap.fromTo(newLayer, 
                    { opacity: 0, clipPath: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)" },
                    { 
                        opacity: 1, 
                        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                        duration: 1.4,
                        ease: "power2.inOut",
                        onComplete: () => { isAnimating = false; }
                    }
                );
                
                // Zusätzlicher Effekt: pulsierender Glow-Effekt
                gsap.fromTo(newLayer, 
                    { filter: "brightness(1.5) blur(10px)" },
                    { 
                        filter: "brightness(1) blur(0px)", 
                        duration: 1.2, 
                        delay: 0.3,
                        ease: "power2.out" 
                    }
                );
            } else {
                gsap.set(newLayer, { 
                    opacity: 1, 
                    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    filter: "brightness(1) blur(0px)"
                });
                isAnimating = false;
            }
            break;
            
// In transformation.js oder showStage() Funktion
// Fügen Sie diese spezifischeren Übergänge für Stage 3 hinzu

case 3: // Vierten Layer hinzufügen (Ballons)
    if (!immediate) {
        // Intelligenter Übergang mit Maske
        const clipPathValues = [
            "circle(0% at 50% 50%)",
            "circle(100% at 50% 50%)"
        ];
        
        gsap.set(newLayer, { 
            opacity: 1,
            clipPath: clipPathValues[0],
            scale: 0.9
        });
        
        const tl = gsap.timeline({
            onComplete: () => { isAnimating = false; }
        });
        
        // Einblende-Animation mit radialem Wachstum
        tl.to(newLayer, {
            clipPath: clipPathValues[1],
            scale: 1,
            duration: 1.4,
            ease: "power3.out"
        });
        
        // Ballons-Animation mit Physik-ähnlichem Verhalten
        const balloons = document.querySelectorAll('.balloon');
        balloons.forEach((balloon, index) => {
            const delay = 0.8 + index * 0.05;
            const randomX = -20 + Math.random() * 40;
            
            tl.fromTo(balloon, 
                { 
                    opacity: 0, 
                    y: 100, 
                    scale: 0.2,
                    x: 0
                },
                { 
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    x: randomX,
                    duration: 1.5,
                    ease: "elastic.out(1, 0.5)"
                }, 
                delay
            );
            
            // Nachschwingendes Verhalten für die Ballons
            gsap.to(balloon, {
                y: '-=20',
                x: `+=${Math.random() * 10 - 5}`,
                duration: 2 + Math.random() * 2,
                delay: delay + 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
    } else {
        // Sofortige Anzeige ohne Animation
        gsap.set(newLayer, { opacity: 1, scale: 1, clipPath: "circle(100% at 50% 50%)" });
        gsap.set(document.querySelectorAll('.balloon'), { opacity: 1, scale: 1, y: 0 });
        isAnimating = false;
    }
    break;
            
        case 4: // Fünften Layer hinzufügen
            if (!immediate) {
                gsap.fromTo(newLayer, 
                    { opacity: 0, rotation: -10, x: '100%' },
                    {
                        opacity: 1,
                        rotation: 0,
                        x: 0,
                        duration: 1.5,
                        ease: typeof softBack !== 'undefined' ? softBack : "back.out(1.5)",
                        onComplete: () => { isAnimating = false; }
                    }
                );
                
                // Tier-Animation
                const animals = document.querySelectorAll('.animal');
                if (animals.length > 0) {
                    gsap.fromTo(animals, 
                        { opacity: 0, scale: 0.5, rotation: -10 },
                        {
                            opacity: 1,
                            scale: 1,
                            rotation: 0,
                            duration: 1,
                            stagger: 0.15,
                            ease: "back.out(1.7)"
                        }
                    );
                }
            } else {
                gsap.set(newLayer, { opacity: 1, rotation: 0, x: 0 });
                gsap.set(document.querySelectorAll('.animal'), { opacity: 1, scale: 1, rotation: 0 });
                isAnimating = false;
            }
            break;
            
        case 5: // Sechsten Layer hinzufügen
            if (!immediate) {
                gsap.fromTo(newLayer, 
                    { opacity: 0, scale: 1.1 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 1.2,
                        ease: "power3.out",
                        onComplete: () => { isAnimating = false; }
                    }
                );
                
                // Wolken ausblenden und Sterne anzeigen
                const clouds = document.querySelectorAll('.cloud');
                if (clouds.length > 0) {
                    gsap.to(clouds, {
                        opacity: 0,
                        y: -30,
                        duration: 0.5,
                        stagger: 0.05
                    });
                }
                
                // Sterne-Effekt erstellen
                createStarsEffect();
            } else {
                gsap.set(newLayer, { opacity: 1, scale: 1 });
                gsap.set(document.querySelectorAll('.cloud'), { opacity: 0, y: -30 });
                isAnimating = false;
            }
            break;
            
            case 6: // Siebten Layer hinzufügen
            if (!immediate) {
                // Dramatisches Finale mit Lichteffekten
                gsap.set(newLayer, { 
                    opacity: 0,
                    scale: 1.1,
                    filter: "brightness(2) saturate(1.2) hue-rotate(5deg)"
                });
                
                const tl = gsap.timeline({
                    onComplete: () => { isAnimating = false; }
                });
                
                // Einblende-Animation mit Farbkorrektur
                tl.to(newLayer, {
                    opacity: 1,
                    scale: 1,
                    filter: "brightness(1) saturate(1) hue-rotate(0deg)",
                    duration: 1.8,
                    ease: "power3.out"
                }, 0);
                
                // Container-Animation für Tiefenwahrnehmung
                tl.fromTo(transformContainer,
                    { 
                        scale: 0.97, 
                        rotationX: 2,
                        transformOrigin: "center center"
                    },
                    { 
                        scale: 1, 
                        rotationX: 0,
                        duration: 2,
                        ease: "elastic.out(1, 0.5)"
                    }, 0.2);
                
                // Abschlusseffekt - Lichtblitz
                tl.fromTo(transformContainer, 
                    { boxShadow: "0 0 0 rgba(255,255,255,0)" },
                    { 
                        boxShadow: "0 0 30px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4)", 
                        duration: 0.6,
                        ease: "power2.in"
                    }, 0.5)
                .to(transformContainer, { 
                    boxShadow: "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)", 
                    duration: 1.2,
                    ease: "power2.out"
                }, 1.1);
            } else {
                gsap.set(newLayer, { opacity: 1, scale: 1, filter: "brightness(1) saturate(1) hue-rotate(0deg)" });
                isAnimating = false;
            }
            break;
            
        default:
            gsap.to(newLayer, {
                opacity: 1,
                duration: immediate ? 0 : 0.5,
                ease: "power2.out",
                onComplete: () => { isAnimating = false; }
            });
            break;
    }
    
    // Update current stage
    currentStage = stage;
    
    // Animation is complete if immediate
    if (immediate) {
        isAnimating = false;
    }
}

/**
 * Aktualisiert den aktiven Schritt in der Schritt-Anzeige
 */
function updateActiveStep(step, indicators, stageLabels) {
    if (!indicators || !indicators.length) return;
    
    // Aktiven Schritt markieren, andere zurücksetzen
    indicators.forEach((indicator, index) => {
        if (index === step) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
    
    // Aktuellen Schritt-Text anzeigen
    const stepInfos = document.querySelectorAll('.step-info');
    stepInfos.forEach(info => {
        const infoStep = parseInt(info.dataset.step);
        if (infoStep === step) {
            gsap.to(info, { opacity: 1, y: 0, duration: 0.5 });
        } else {
            gsap.to(info, { opacity: 0, y: 20, duration: 0.3 });
        }
    });
}

/**
 * Sterne-Effekt für Stufe 6 erstellen
 */
function createStarsEffect() {
    const particlesContainer = document.getElementById('particlesContainer');
    
    if (!particlesContainer) return;
    
    // Bestehende Partikel löschen
    particlesContainer.innerHTML = '';
    
    // Sterne erstellen
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.classList.add('particle', 'star-particle');
        
        const size = 1 + Math.random() * 3;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        star.style.opacity = 0.5 + Math.random() * 0.5;
        star.style.backgroundColor = '#ffffff';
        
        particlesContainer.appendChild(star);
        
        // Funkelnde Animation
        gsap.to(star, {
            opacity: 0.2 + Math.random() * 0.8,
            duration: 1 + Math.random() * 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}

/**
 * Hintergrund-Partikel erstellen
 */
function createParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = 2 + Math.random() * 5;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.opacity = 0.3 + Math.random() * 0.5;
        
        particlesContainer.appendChild(particle);
        
        // Partikel animieren
        gsap.to(particle, {
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
            duration: 20 + Math.random() * 40,
            repeat: -1,
            yoyo: true,
            ease: "none"
        });
    }
}


/**
 * Transformations-Container im DOM einrichten (direkt nach dem Hero-Bereich)
 */
function setupTransformationContainer() {
    // Container finden oder erstellen
    let transformSection = document.getElementById('transformationSection');
    
    if (!transformSection) {
        transformSection = document.createElement('section');
        transformSection.id = 'transformationSection';
        
        // Nach der Hero-Section einfügen
        const heroSection = document.querySelector('.perspective-hero') || document.getElementById('home');
        if (heroSection) {
            heroSection.parentNode.insertBefore(transformSection, heroSection.nextElementSibling);
        } else {
            document.body.appendChild(transformSection);
        }
    }
    
    // Container-HTML einfügen
    transformSection.innerHTML = `
        <div class="transform-bg-wrapper">
            <div class="transform-bg-gradient" id="bgGradient"></div>
            <div class="particles-container" id="particlesContainer"></div>
        </div>
        
        <div class="transform-content">
            <div class="transform-header">
                <h2>Die Magie der Transformation</h2>
                <p>Erleben Sie, wie ein gewöhnliches Kinderfoto Schritt für Schritt in ein magisches Kunstwerk verwandelt wird.</p>
            </div>
            
            <div class="transform-container" id="transformContainer">
                <!-- Bildebenen -->
                <div class="image-layer" id="layer1">
                    <img src="assets/transforms/1.png" alt="Baby im Strampler">
                </div>
                
                <div class="image-layer" id="layer2">
                    <img src="assets/transforms/2.png" alt="Baby Silhouette mit Wolken">
                </div>
                
                <div class="image-layer" id="layer3">
                    <img src="assets/transforms/3.png" alt="Baby Silhouette mit Beinen">
                </div>
                
                <div class="image-layer" id="layer4">
                    <img src="assets/transforms/4.png" alt="Baby Hand mit Ballons">
                </div>
                
                <div class="image-layer" id="layer5">
                    <img src="assets/transforms/5.png" alt="Koala mit Ball">
                </div>
                
                <div class="image-layer" id="layer6">
                    <img src="assets/transforms/6.png" alt="Baby als Astronaut">
                </div>
                
                <div class="image-layer" id="layer7">
                    <img src="assets/transforms/7.png" alt="Baby in Fantasiewelt">
                </div>
                
                <!-- Container für individuelle Animationselemente -->
                <div class="elements-container" id="elementsContainer">
                    <!-- Wolken, Tiere und Ballons werden via JavaScript hinzugefügt -->
                </div>
                
                <!-- 3D-Würfel für Übergänge -->
                <div class="cube-container">
                    <div class="cube" id="animationCube">
                        <div class="cube-face front"></div>
                        <div class="cube-face back"></div>
                        <div class="cube-face right"></div>
                        <div class="cube-face left"></div>
                        <div class="cube-face top"></div>
                        <div class="cube-face bottom"></div>
                    </div>
                </div>
            </div>
            
            <!-- Stage Label -->
            <div class="stage-label" id="stageLabel">Baby</div>
            
            <!-- Schritt-Anzeigen am unteren Bildrand -->
            <div class="transform-steps-indicator">
                <div class="current-step-info">
                    <div class="step-info" data-step="0">
                        <h3>Das Original</h3>
                        <p>Wir beginnen mit Ihrem Originalfoto. Auch wenn es bereits schön ist, sehen Sie, wie wir es Schritt für Schritt in etwas Magisches verwandeln.</p>
                    </div>
                    <div class="step-info" data-step="1">
                        <h3>Grundformen & Silhouette</h3>
                        <p>Zuerst analysieren wir das Bild und arbeiten die Grundformen und Silhouette heraus. Dies bildet die Basis für die kreative Umgestaltung.</p>
                    </div>
                    <div class="step-info" data-step="2">
                        <h3>Neue Umgebung</h3>
                        <p>Als nächstes erschaffen wir eine völlig neue Umgebung, die den emotionalen Charakter Ihres Kindes widerspiegelt.</p>
                    </div>
                    <div class="step-info" data-step="3">
                        <h3>Magische Elemente</h3>
                        <p>Hier fügen wir fantasievolle Elemente hinzu, die der Szene Leben und Magie einhauchen – von schwebenden Ballons bis hin zu fantastischen Kreaturen.</p>
                    </div>
                    <div class="step-info" data-step="4">
                        <h3>Lichtstimmung & Atmosphäre</h3>
                        <p>Die richtige Lichtstimmung verleiht dem Bild Tiefe und Atmosphäre. Wir arbeiten mit Licht- und Schatteneffekten, um die Magie zu verstärken.</p>
                    </div>
                    <div class="step-info" data-step="5">
                        <h3>Feinschliff & Details</h3>
                        <p>In diesem Schritt fügen wir feine Details und Texturen hinzu, die dem Bild Charakter und Tiefe verleihen und es noch lebendiger wirken lassen.</p>
                    </div>
                    <div class="step-info" data-step="6">
                        <h3>Fertiges Kunstwerk</h3>
                        <p>Voilà! Das fertige Kunstwerk ist bereit. Aus einem alltäglichen Foto ist eine magische Traumwelt geworden, die Ihr Kind verzaubern wird.</p>
                    </div>
                </div>
                
                <div class="steps-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="step-indicators">
                        <div class="step-indicator active" data-step="0">1</div>
                        <div class="step-indicator" data-step="1">2</div>
                        <div class="step-indicator" data-step="2">3</div>
                        <div class="step-indicator" data-step="3">4</div>
                        <div class="step-indicator" data-step="4">5</div>
                        <div class="step-indicator" data-step="5">6</div>
                        <div class="step-indicator" data-step="6">7</div>
                    </div>
                </div>
                
                <!-- Scroll-Anzeige -->
                <div class="scroll-indicator">
                    <span>Scrollen für Transformation</span>
                    <div class="scroll-arrow">
                        <i class="fas fa-arrow-down"></i>
                    </div>
                </div>
            </div>
        </div>
    `;
}