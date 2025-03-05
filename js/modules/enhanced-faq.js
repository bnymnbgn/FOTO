/**
 * Optimiertes FAQ Modul
 * Angepasst an das Designbeispiel
 */

/**
 * Initialisiert das erweiterte FAQ-Modul
 */
export function initEnhancedFAQ() {
    console.log('Initialisiere erweitertes FAQ-Modul...');
    
    // Den vorhandenen FAQ-Container finden
    var faqContainer = document.querySelector('#faq .faq-container');
    
    if (!faqContainer) {
      console.error('FAQ-Container nicht gefunden');
      return;
    }
    
    // Ersetze den vorhandenen Container mit dem erweiterten FAQ
    createEnhancedFAQ(faqContainer);
    
    // Setup Event-Listener
    setupSearchAndFilter();
    setupAccordion();
  }
  
  /**
   * Die FAQ-Daten mit Kategorien
   */
  var faqData = [
    {
      question: "Wie lange dauert die Bearbeitung eines Fotos?",
      answer: "Je nach Komplexität des gewünschten Effekts und aktuellem Auftragsvolumen beträgt die Bearbeitungszeit zwischen 3-7 Werktagen. Bei besonders aufwändigen Projekten oder in der Hochsaison kann es etwas länger dauern. Sie werden jedoch immer über den aktuellen Status informiert.",
      category: "bearbeitung"
    },
    {
      question: "Welche Bildformate erhalte ich nach der Bearbeitung?",
      answer: "Sie erhalten Ihre bearbeiteten Bilder in hochauflösender Qualität im JPG-Format, optimal für Ausdrucke und digitale Nutzung. Auf Wunsch können wir auch andere Formate wie PNG (für transparente Hintergründe) oder TIFF (für professionelle Drucke) bereitstellen.",
      category: "technik"
    },
    {
      question: "Kann ich spezielle Wünsche für die Bearbeitung äußern?",
      answer: "Absolut! Wir legen großen Wert auf Ihre individuellen Wünsche. Im Kontaktformular können Sie Ihre Vorstellungen detailliert beschreiben. Nach Erhalt Ihres Auftrags stimmen wir uns mit Ihnen ab und senden Ihnen Vorschläge zur Bestätigung, bevor wir mit der endgültigen Bearbeitung beginnen.",
      category: "bearbeitung"
    },
    {
      question: "Welche Zahlungsmethoden werden akzeptiert?",
      answer: "Wir bieten verschiedene Zahlungsmöglichkeiten an: PayPal, Kreditkarte (Visa, Mastercard, American Express) und Banküberweisung. Die Zahlung erfolgt erst nach Ihrer Zufriedenheit mit dem Vorschau-Ergebnis.",
      category: "zahlung"
    },
    {
      question: "Wie hoch ist die Auflösung der bearbeiteten Bilder?",
      answer: "Wir bearbeiten Ihre Bilder in der höchstmöglichen Qualität, abhängig von der Auflösung Ihres Originalfotos. Für optimale Ergebnisse empfehlen wir, Bilder mit mindestens 8 Megapixeln zu verwenden. Die bearbeiteten Fotos sind für Ausdrucke bis zu 60x40 cm geeignet.",
      category: "technik"
    },
    {
      question: "Werden meine Originalbilder gespeichert?",
      answer: "Ja, wir speichern Ihre Originalbilder und die bearbeiteten Versionen für 30 Tage nach Fertigstellung Ihres Auftrags, um eventuelle Änderungswünsche umsetzen zu können. Anschließend werden die Daten gemäß unserer Datenschutzrichtlinien sicher gelöscht. Auf Wunsch können wir Ihre Daten auch früher löschen.",
      category: "datenschutz"
    },
    {
      question: "Kann ich mein Foto für mehrere verschiedene Szenen bearbeiten lassen?",
      answer: "Ja, das ist mit unserem 'Magische Kombination'-Paket möglich. Hierbei können Sie dasselbe Foto in verschiedenen kreativen Szenarien bearbeiten lassen. Dies ist besonders beliebt für thematische Serien oder um verschiedene Stile auszuprobieren.",
      category: "bearbeitung"
    },
    {
      question: "Gibt es Einschränkungen bei der Art der Fotos, die bearbeitet werden können?",
      answer: "Grundsätzlich können wir fast alle Arten von Fotos bearbeiten. Die besten Ergebnisse erzielen wir jedoch mit Bildern, die gut beleuchtet und scharf sind. Bilder mit sehr niedriger Auflösung, starker Unschärfe oder extremer Über-/Unterbelichtung können das Endergebnis beeinträchtigen.",
      category: "technik"
    },
    {
      question: "Wie erhalte ich meine bearbeiteten Bilder?",
      answer: "Nach Fertigstellung erhalten Sie einen Download-Link per E-Mail, über den Sie Ihre bearbeiteten Bilder in hoher Auflösung herunterladen können. Dieser Link ist 14 Tage gültig. Auf Wunsch bieten wir auch die Möglichkeit, Ihre Bilder auf USB-Stick oder als professionelle Ausdrucke zu erhalten (gegen Aufpreis).",
      category: "lieferung"
    },
    {
      question: "Bieten Sie auch Bearbeitung für Gruppenfotos an?",
      answer: "Ja, wir bearbeiten auch Gruppenfotos. Bitte beachten Sie, dass für Gruppenfotos mit mehr als 3 Personen ein Aufpreis anfällt, da die Bearbeitung komplexer ist. Details dazu finden Sie in unserer Preisübersicht oder nutzen Sie unseren Preisrechner.",
      category: "bearbeitung"
    },
    {
      question: "Kann ich eine Vorschau sehen, bevor ich bezahle?",
      answer: "Absolut! Wir senden Ihnen immer eine Vorschau mit Wasserzeichen zur Begutachtung, bevor die Zahlung fällig wird. Sie können dann Änderungswünsche äußern oder das Ergebnis freigeben. Erst nach Ihrer Zufriedenheit wird die Zahlung bearbeitet.",
      category: "zahlung"
    },
    {
      question: "Was ist, wenn mir das Ergebnis nicht gefällt?",
      answer: "Ihre Zufriedenheit steht für uns an erster Stelle. Wenn Sie mit dem Ergebnis nicht zufrieden sind, nehmen wir bis zu zwei Überarbeitungen kostenlos vor. Sollten Sie danach immer noch nicht zufrieden sein, bieten wir eine Geld-zurück-Garantie an.",
      category: "bearbeitung"
    }
  ];
  
  /**
   * Kategorien für Filter - exakt wie im Beispielbild
   */
  var categories = [
    { id: 'alle', label: 'Alle Fragen' },
    { id: 'bearbeitung', label: 'Bildbearbeitung' },
    { id: 'technik', label: 'Technische Fragen' },
    { id: 'zahlung', label: 'Zahlung & Preise' },
    { id: 'lieferung', label: 'Lieferung' },
    { id: 'datenschutz', label: 'Datenschutz' }
  ];
  
  /**
   * Erstellt das erweiterte FAQ im Container
   * @param {HTMLElement} container - Der Container für das FAQ
   */
  function createEnhancedFAQ(container) {
    // Bestehenden Inhalt entfernen
    container.innerHTML = '';
    
    // Äußerer Container mit weißem Hintergrund und Schatten
    container.className = 'faq-container enhanced-faq';
    container.style.marginTop = '20px';
    
    
    // Suchbereich - Angepasst an das Designbeispiel
    var searchHTML = `
      <div class="faq-search-container">
        <div class="search-box">
          <input type="text" id="faqSearch" placeholder="Wonach suchen Sie?">
          <i class="fas fa-search"></i>
          <button id="clearSearch" class="clear-search" style="display: none;">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;
    
    // Kategorie-Filter erstellen - exakt wie im Beispiel
    var categoriesHTML = `<div class="faq-categories">`;
    
    for (var i = 0; i < categories.length; i++) {
      var category = categories[i];
      categoriesHTML += `
        <button class="category-btn ${category.id === 'alle' ? 'active' : ''}" 
                data-category="${category.id}">
          ${category.label}
        </button>
      `;
    }
    
    categoriesHTML += `</div>`;
    
    // Bereich für "Keine Ergebnisse"
    var noResultsHTML = `
      <div id="noFaqResults" class="no-faq-results" style="display: none;">
        <i class="fas fa-search"></i>
        <p>Keine Fragen gefunden, die Ihren Kriterien entsprechen.</p>
        <button id="resetFaqFilters">Filter zurücksetzen</button>
      </div>
    `;
    
    // FAQ-Einträge erstellen - flaches Design wie im Beispiel
    var faqItemsHTML = `<div id="faqItems" class="faq-items">`;
    
    for (var j = 0; j < faqData.length; j++) {
      var faq = faqData[j];
      var categoryLabel = "";
      
      // Kategorie-Label finden
      for (var k = 0; k < categories.length; k++) {
        if (categories[k].id === faq.category) {
          categoryLabel = categories[k].label;
          break;
        }
      }
      
      if (!categoryLabel) {
        categoryLabel = faq.category;
      }
      
      faqItemsHTML += `
        <div class="faq-item" data-category="${faq.category}">
          <div class="faq-question">
            <h3>${faq.question}</h3>
            <span class="faq-toggle"><i class="fas fa-plus"></i></span>
          </div>
          <div class="faq-answer">
            <p>${faq.answer}</p>
            <div class="faq-category">
              <span class="category-label">Kategorie:</span>
              <span class="category-value">${categoryLabel}</span>
            </div>
          </div>
        </div>
      `;
    }
    
    faqItemsHTML += `</div>`;
    
    // FAQ-Hilfetext - Blauer Box wie im Beispiel
    var helpTextHTML = `
      <div class="faq-help-info">
        <i class="fas fa-info-circle"></i>
        <div>
          <h4>Haben Sie weitere Fragen?</h4>
          <p>Falls Sie Ihre Frage hier nicht finden konnten, kontaktieren Sie uns gerne direkt. 
          Wir helfen Ihnen gerne persönlich weiter und beantworten alle Ihre Fragen rund um unsere 
          magischen Bildbearbeitungsdienstleistungen.</p>
          <a href="#contact">
            <i class="fas fa-arrow-right"></i> Zum Kontaktformular
          </a>
        </div>
      </div>
    `;
    
    // Alles zusammensetzen
    var contentHTML = `
        <div class="faq-body">
          ${searchHTML}
          ${categoriesHTML}
          ${noResultsHTML}
          ${faqItemsHTML}
          ${helpTextHTML}
        </div>
      </div>
    `;
    
    // HTML einfügen
    container.innerHTML = contentHTML;
  }
  
  /**
   * Richtet Suche und Filterung ein
   */
  function setupSearchAndFilter() {
    var searchInput = document.getElementById('faqSearch');
    var clearButton = document.getElementById('clearSearch');
    var categoryButtons = document.querySelectorAll('.category-btn');
    var resetButton = document.getElementById('resetFaqFilters');
    var noResultsElement = document.getElementById('noFaqResults');
    
    var activeCategory = 'alle';
    var searchTerm = '';
    
    // Suchfeld
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        searchTerm = this.value.trim().toLowerCase();
        clearButton.style.display = searchTerm ? 'block' : 'none';
        filterFAQItems(searchTerm, activeCategory);
      });
    }
    
    // Clear-Button
    if (clearButton) {
      clearButton.addEventListener('click', function() {
        searchInput.value = '';
        searchTerm = '';
        this.style.display = 'none';
        filterFAQItems(searchTerm, activeCategory);
      });
    }
    
    // Kategorie-Buttons
    for (var i = 0; i < categoryButtons.length; i++) {
      categoryButtons[i].addEventListener('click', function() {
        // Aktiven Button aktualisieren
        for (var j = 0; j < categoryButtons.length; j++) {
          categoryButtons[j].classList.remove('active');
        }
        this.classList.add('active');
        
        // Kategorie speichern und filtern
        activeCategory = this.getAttribute('data-category');
        filterFAQItems(searchTerm, activeCategory);
      });
    }
    
    // Reset-Button
    if (resetButton) {
      resetButton.addEventListener('click', function() {
        // Alle Filter zurücksetzen
        searchInput.value = '';
        searchTerm = '';
        clearButton.style.display = 'none';
        
        // Alle Kategorien aktivieren
        for (var i = 0; i < categoryButtons.length; i++) {
          var btn = categoryButtons[i];
          btn.classList.remove('active');
          if (btn.getAttribute('data-category') === 'alle') {
            btn.classList.add('active');
          }
        }
        
        activeCategory = 'alle';
        filterFAQItems('', 'alle');
      });
    }
  }
  
  /**
   * Filtert FAQ-Elemente basierend auf Suchbegriff und Kategorie
   * @param {string} searchStr - Der Suchbegriff
   * @param {string} category - Die ausgewählte Kategorie
   */
  function filterFAQItems(searchStr, category) {
    var faqItems = document.querySelectorAll('.faq-item');
    var visibleCount = 0;
    var noResultsElement = document.getElementById('noFaqResults');
    
    for (var i = 0; i < faqItems.length; i++) {
      var item = faqItems[i];
      var faqQuestion = item.querySelector('.faq-question h3').textContent.toLowerCase();
      var faqAnswer = item.querySelector('.faq-answer p').textContent.toLowerCase();
      var faqCategory = item.getAttribute('data-category');
      
      var matchesCategory = category === 'alle' || faqCategory === category;
      var matchesSearch = !searchStr || 
                          faqQuestion.includes(searchStr) || 
                          faqAnswer.includes(searchStr);
      
      if (matchesCategory && matchesSearch) {
        item.style.display = 'block';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    }
    
    // "Keine Ergebnisse" anzeigen, wenn nötig
    if (noResultsElement) {
      noResultsElement.style.display = visibleCount === 0 ? 'flex' : 'none';
    }
  }
  
  /**
   * Richtet Accordion-Funktionalität ein
   */
  function setupAccordion() {
    var faqQuestions = document.querySelectorAll('.faq-question');
    
    for (var i = 0; i < faqQuestions.length; i++) {
      faqQuestions[i].addEventListener('click', function() {
        var faqItem = this.parentElement;
        var isActive = faqItem.classList.contains('active');
        
        // Alle anderen schließen
        var allItems = document.querySelectorAll('.faq-item');
        for (var j = 0; j < allItems.length; j++) {
          var item = allItems[j];
          item.classList.remove('active');
          var toggle = item.querySelector('.faq-toggle i');
          if (toggle) {
            toggle.className = 'fas fa-plus';
          }
        }
        
        // Dieses öffnen, wenn es nicht aktiv war
        if (!isActive) {
          faqItem.classList.add('active');
          var toggle = faqItem.querySelector('.faq-toggle i');
          if (toggle) {
            toggle.className = 'fas fa-minus';
          }
        }
      });
    }
  }