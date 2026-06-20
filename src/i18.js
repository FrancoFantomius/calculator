export let translations = {};

/**
 * Load translation JSON for the given language.
 * @param {string} lang - Language code (e.g., 'en', 'it', 'es', 'fr', 'de')
 */
export async function loadTranslations(lang) {
  try {
    const response = await fetch(`./langs/${lang}.json`);
    translations = await response.json();
    applyTranslations();
    localStorage.setItem("calc_lang", lang);
  } catch (e) {
    console.error("Failed to load translations", e);
  }
}

/** Apply loaded translations to UI elements */
export function applyTranslations() {
  // Title translation
  const appTitle = document.querySelector(".app-title");
  if (appTitle && translations.app_title) appTitle.textContent = translations.app_title;

  // Buttons aria-labels
  const radDegBtn = document.getElementById("rad-deg-toggle");
  if (radDegBtn && translations.toggle_angle) radDegBtn.setAttribute("aria-label", translations.toggle_angle);
  const sciBtn = document.getElementById("sci-toggle");
  if (sciBtn && translations.toggle_scientific) sciBtn.setAttribute("aria-label", translations.toggle_scientific);
  const themeBtn = document.getElementById("theme-toggle");
  if (themeBtn && translations.toggle_theme) themeBtn.setAttribute("aria-label", translations.toggle_theme);
  const historyBtn = document.getElementById("history-toggle");
  if (historyBtn && translations.toggle_history) historyBtn.setAttribute("aria-label", translations.toggle_history);

  // History panel texts
  const historyHeader = document.querySelector(".history-header h2");
  if (historyHeader && translations.history_title) historyHeader.textContent = translations.history_title;
  const clearHistoryBtn = document.getElementById("clear-history");
  if (clearHistoryBtn && translations.clear_history) clearHistoryBtn.setAttribute("aria-label", translations.clear_history);
  const historyEmpty = document.querySelector(".history-empty");
  if (historyEmpty && translations.no_recent) historyEmpty.textContent = translations.no_recent;
}

/** Initialize language on startup */
export function initLanguage() {
  const saved = localStorage.getItem("calc_lang");
  const supported = ["en", "it", "es", "fr", "de", "ru", "zh"];
  let defaultLang = saved;
  if (!defaultLang) {
    const browserLang = (navigator.language || "en").substring(0, 2);
    defaultLang = supported.includes(browserLang) ? browserLang : "en";
  }
  loadTranslations(defaultLang);
}
