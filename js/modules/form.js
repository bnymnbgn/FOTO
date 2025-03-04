/**
 * Form Modul
 * Verwaltet die Formularvalidierung und -verarbeitung
 */

/**
 * Richtet die Formularvalidierung ein
 */
function setupFormValidation() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) {
        console.warn('Contact form not found');
        return;
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateFormFields()) {
            handleFormSubmission();
        }
    });
    
    // Live-Validierung für Felder hinzufügen
    setupLiveValidation();
}

/**
 * Richtet Live-Validierung für Formularfelder ein
 */
function setupLiveValidation() {
    const requiredInputs = document.querySelectorAll('#contactForm input[required], #contactForm textarea[required]');
    
    requiredInputs.forEach(input => {
        // Validiere bei Änderung des Feldes
        input.addEventListener('blur', function() {
            validateSingleField(this);
        });
        
        // Entferne Fehlermeldung, wenn der Benutzer beginnt zu tippen
        input.addEventListener('input', function() {
            this.classList.remove('invalid');
            
            const errorMessage = this.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
    
    // E-Mail-Feldvalidierung
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            validateEmailField(this);
        });
    }
}

/**
 * Validiert ein einzelnes Feld
 * @param {HTMLElement} field - Das zu validierende Formularfeld
 * @returns {boolean} - Ob das Feld gültig ist
 */
function validateSingleField(field) {
    let isValid = true;
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        showFieldError(field, 'Dieses Feld ist erforderlich');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validiert ein E-Mail-Feld
 * @param {HTMLElement} field - Das zu validierende E-Mail-Feld
 * @returns {boolean} - Ob das Feld eine gültige E-Mail enthält
 */
function validateEmailField(field) {
    if (!field.value.trim()) return true; // Leere Felder werden von validateSingleField behandelt
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(field.value);
    
    if (!isValid) {
        showFieldError(field, 'Bitte geben Sie eine gültige E-Mail-Adresse ein');
    }
    
    return isValid;
}

/**
 * Zeigt eine Fehlermeldung für ein Feld an
 * @param {HTMLElement} field - Das Feld, für das ein Fehler angezeigt werden soll
 * @param {string} message - Die anzuzeigende Fehlermeldung
 */
function showFieldError(field, message) {
    field.classList.add('invalid');
    
    // Entferne vorhandene Fehlermeldungen
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Erstelle neues Fehlermeldungs-Element
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // Füge nach dem Feld ein
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

/**
 * Validiert alle erforderlichen Formularfelder
 * @returns {boolean} - Ob alle Felder gültig sind
 */
function validateFormFields() {
    const form = document.getElementById('contactForm');
    let isValid = true;
    
    // Validiere alle erforderlichen Felder
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!validateSingleField(field)) {
            isValid = false;
        }
    });
    
    // Validiere E-Mail-Format
    const emailField = document.getElementById('email');
    if (emailField && emailField.value.trim() && !validateEmailField(emailField)) {
        isValid = false;
    }
    
    // Validiere Zustimmung zu Datenschutz
    const consentCheckbox = document.getElementById('consent');
    if (consentCheckbox && !consentCheckbox.checked) {
        showFieldError(consentCheckbox, 'Bitte stimmen Sie der Datenschutzerklärung zu');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Behandelt die Formularabsendung
 */
function handleFormSubmission() {
    const form = document.getElementById('contactForm');
    
    // In einer echten Anwendung würde hier AJAX verwendet werden
    // um das Formular zu senden, ohne die Seite neu zu laden
    
    // Beispiel für eine einfache Erfolgsmeldung
    alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
    
    // Formular zurücksetzen
    form.reset();
    
    // Entferne alle Fehlermarkierungen
    form.querySelectorAll('.invalid').forEach(field => {
        field.classList.remove('invalid');
    });
    
    form.querySelectorAll('.error-message').forEach(message => {
        message.remove();
    });
}

/**
 * Initialisiert die Formular-Funktionen
 */
export function initFormValidation() {
    console.log('Initializing form validation module...');
    setupFormValidation();
}