/**
 * Floating Elements Modul
 * Verwaltet die animierten schwebeneden Elemente
 */

/**
 * Richtet die schwebenden Elemente mit optimierten Animationen ein
 */
function setupFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-element');
    
    if (!floatingElements.length) {
        console.warn('No floating elements found');
        return;
    }
    
    floatingElements.forEach((element, index) => {
        // Zufällige Startverzögerung für natürlichere Bewegung
        element.style.animationDelay = `${Math.random() * 2}s`;
        
        // Leicht unterschiedliche Geschwindigkeiten
        element.style.setProperty('--float-speed', `${5 + Math.random() * 2}s`);
        
        // Unterschiedliche Bewegungsdistanz
        element.style.setProperty('--float-variance', `${10 + Math.random() * 10}px`);
        
        // Für mobiloptimierte Darstellung nur eine begrenzte Anzahl von Elementen anzeigen
        if (window.matchMedia("(max-width: 768px)").matches && index > 3) {
            element.style.display = 'none';
        }
    });
    
    // Optimierung: Verwende requestAnimationFrame für komplexere Animationen auf Hochleistungsgeräten
    if (!window.matchMedia("(max-width: 768px)").matches) {
        setupAdvancedAnimations(floatingElements);
    }
}

/**
 * Erstellt dynamisch neue schwebende Elemente
 * @param {number} count - Wie viele Elemente erstellt werden sollen
 * @param {HTMLElement} container - Der Container für die Elemente
 */
function createDynamicFloatingElements(count = 5, container = document.querySelector('.hero')) {
    if (!container) return;
    
    const icons = ['fa-star', 'fa-heart', 'fa-cloud', 'fa-magic', 'fa-sparkles', 'fa-wand-magic-sparkles'];
    const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)', '#FFB7D5', '#79E2FF'];
    
    for (let i = 0; i < count; i++) {
        const element = document.createElement('div');
        const icon = icons[Math.floor(Math.random() * icons.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 15 + Math.floor(Math.random() * 25); // Größere Variation in der Größe (15-40px)
        const rotation = Math.floor(Math.random() * 360); // Zufällige Rotation
        const parallaxSpeed = 0.3 + Math.random() * 0.7; // Zufällige Geschwindigkeit (zwischen 0.3 und 1.0)
        
        element.className = 'floating-element dynamic-element';
        element.dataset.speed = parallaxSpeed; // Speichern der Parallax-Geschwindigkeit
        element.innerHTML = `<i class="fas ${icon}"></i>`;
        
        Object.assign(element.style, {
            position: 'absolute',
            fontSize: `${size}px`,
            color: color,
            opacity: `${(3 + Math.floor(Math.random() * 4)) / 10}`, // Opacity zwischen 0.3 und 0.7
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: Math.round(parallaxSpeed * 10),
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.15s ease-out', // Sanftere Übergänge für Parallax
            textShadow: `0 0 ${Math.floor(Math.random() * 6) + 2}px ${color}80`, // Leichtes Glühen hinzufügen
            animationName: 'float3D',
            animationDuration: `${Math.floor(Math.random() * 12) + 8}s`, // 8-20s
            animationTimingFunction: 'ease-in-out',
            animationDelay: `${Math.random() * 5}s`,
            animationIterationCount: 'infinite',
            animationDirection: Math.random() > 0.5 ? 'alternate' : 'normal'
        });

        container.appendChild(element);
    }
}

/**
 * Richtet fortgeschrittene Animationen mit requestAnimationFrame ein
 * @param {NodeList} elements - Die zu animierenden Elemente
 */
function setupAdvancedAnimations(elements) {
    // Deaktiviere CSS-Animationen für diese Elemente
    elements.forEach(element => {
        element.style.animation = 'none';
    });
    
    // Verwende RequestAnimationFrame für flüssigere Animationen
    let lastTime = 0;
    
    const animate = (time) => {
        if (!lastTime) lastTime = time;
        const delta = (time - lastTime) * 0.001;
        
        elements.forEach((element, index) => {
            // Jedes Element hat einen leicht anderen Animations-"Seed"
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

/**
 * Initialisiert die Floating-Elements-Funktionen
 */
export function initFloatingElements() {
    console.log('Initializing floating elements module...');
    setupFloatingElements();
    
    // Optional: Dynamisch weitere Elemente hinzufügen
    // createDynamicFloatingElements();
}