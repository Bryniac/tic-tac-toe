// language.js

// 1. Apply translation strings to all [data-i18n] elements
export function applyTranslations(strings) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (strings[key]) el.innerHTML = strings[key];
    });
  }
  
  // 2. Update the floating button’s flag icon
  export function updateLanguageButton(lang) {
    const btn = document.getElementById('languageToggle');
    btn.className = 'lang-btn';    // reset to base
    btn.classList.add(lang);       // add e.g. 'en' or 'es'
  }
  
  // 3. Fetch JSON, apply strings, update button, save preference
  export function loadLanguage(lang) {
    return fetch(`lang/${lang}.json`)
      .then(res => res.json())
      .then(strings => {
        applyTranslations(strings);
        updateLanguageButton(lang);
        localStorage.setItem('lang', lang);
        return strings;
      });
  }
  
  // 4. Toggle menu visibility
  function toggleMenu() {
    document.getElementById('languageMenu').classList.toggle('hidden');
  }
  
  // 5. When a language is clicked
  function onLanguageSelected(e) {
    const lang = e.currentTarget.dataset.lang;
    loadLanguage(lang);
    toggleMenu();
  }
  
  // 6. Wire it all up
  export function setupLanguageMenu() {
    const toggleBtn = document.getElementById('languageToggle');
    const menuButtons = document.querySelectorAll('#languageMenu button');
  
    toggleBtn.addEventListener('click', toggleMenu);
    menuButtons.forEach(btn => {
      btn.addEventListener('click', onLanguageSelected);
    });
  
    // Initialize on page load
    const initial = localStorage.getItem('lang') || 'en';
    loadLanguage(initial);
  }
  