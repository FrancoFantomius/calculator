import { state } from "./state.js";
import { evaluateFormula, formatResult } from "./math.js";
import { translations, loadTranslations, initLanguage } from "./i18.js";

export { loadTranslations as setLanguage, initLanguage };


// ==========================================================================
// DOM Elements Selection & Exports
// ==========================================================================
export const expressionEl = document.getElementById("expression");
export const resultEl = document.getElementById("result");
export const themeToggle = document.getElementById("theme-toggle");
export const historyToggle = document.getElementById("history-toggle");
export const clearHistoryBtn = document.getElementById("clear-history");
export const historyList = document.getElementById("history-list");
export const historyPanel = document.getElementById("history-panel");
export const appContainer = document.querySelector(".app-container");
export const radDegToggle = document.getElementById("rad-deg-toggle");
export const sciToggle = document.getElementById("sci-toggle");

// ==========================================================================
// UI Updates & Typography Fitting
// ==========================================================================

export function updateDisplay() {
    expressionEl.innerText = state.formula || "0";
    
    // Auto-calculate preview on the fly as the user types
    if (state.formula && !state.lastEvaluated) {
        try {
            const previewResult = evaluateFormula(state.formula);
            if (previewResult !== null && !isNaN(previewResult)) {
                resultEl.innerText = formatResult(previewResult);
                resultEl.classList.add("preview-mode");
                resultEl.style.opacity = "0.5";
            } else {
                resultEl.innerText = "";
            }
        } catch (e) {
            resultEl.innerText = "";
        }
    } else if (!state.formula) {
        resultEl.innerText = "0";
        resultEl.classList.remove("preview-mode");
        resultEl.style.opacity = "1";
    }
    
    adjustFontSize();
    scrollDisplayToEnd();
}

export function adjustFontSize() {
    const len = resultEl.innerText.length;
    if (len > 12) {
        resultEl.style.fontSize = "22px";
    } else if (len > 8) {
        resultEl.style.fontSize = "30px";
    } else {
        resultEl.style.fontSize = "44px";
    }
}

export function scrollDisplayToEnd() {
    const exprWrapper = document.querySelector(".expression-wrapper");
    const resWrapper = document.querySelector(".result-wrapper");
    if (exprWrapper) exprWrapper.scrollLeft = exprWrapper.scrollWidth;
    if (resWrapper) resWrapper.scrollLeft = resWrapper.scrollWidth;
}

// ==========================================================================
// Toast Alerts
// ==========================================================================

export function showToast(message) {
    const existing = document.querySelector(".toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.innerText = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

// ==========================================================================
// Theme Management
// ==========================================================================

export function setTheme(theme, save = true) {
    if (theme === "light") {
        document.body.classList.add("light-theme");
        themeToggle.innerHTML = `<span class="material-symbols-rounded">dark_mode</span>`;
        document.querySelector("meta[name='theme-color']").setAttribute("content", "#f3f5f9");
        if (save) localStorage.setItem("calc_theme", "light");
    } else {
        document.body.classList.remove("light-theme");
        themeToggle.innerHTML = `<span class="material-symbols-rounded">light_mode</span>`;
        document.querySelector("meta[name='theme-color']").setAttribute("content", "#0a0813");
        if (save) localStorage.setItem("calc_theme", "dark");
    }
}

export function initTheme() {
    const savedTheme = localStorage.getItem("calc_theme");
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    
    if (savedTheme) {
        setTheme(savedTheme, false);
    } else {
        setTheme(prefersLight ? "light" : "dark", false);
    }
    
    if (window.matchMedia) {
        window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e) => {
            if (!localStorage.getItem("calc_theme")) {
                setTheme(e.matches ? "light" : "dark", false);
            }
        });
    }
}

// ==========================================================================
// Scientific Mode layout
// ==========================================================================

export function toggleScientificMode(forceState) {
    state.scientificActive = forceState !== undefined ? forceState : !state.scientificActive;
    const btnGrid = document.querySelector(".calculator-buttons");
    const card = document.querySelector(".calculator-card");
    
    if (state.scientificActive) {
        btnGrid.classList.add("scientific-active");
        card.classList.add("scientific-active");
        appContainer.classList.add("scientific-active");
        sciToggle.style.background = "rgba(141, 76, 255, 0.25)";
        sciToggle.style.color = "var(--key-func-text)";
    } else {
        btnGrid.classList.remove("scientific-active");
        card.classList.remove("scientific-active");
        appContainer.classList.remove("scientific-active");
        sciToggle.style.background = "";
        sciToggle.style.color = "";
    }
    
    try {
        localStorage.setItem("calc_sci_active", state.scientificActive ? "true" : "false");
    } catch (e) {}
}

export function loadSciSettings() {
    try {
        const storedSci = localStorage.getItem("calc_sci_active");
        if (storedSci === "true") {
            toggleScientificMode(true);
        }
        
        const storedUnit = localStorage.getItem("calc_angle_unit");
        if (storedUnit) {
            state.angleUnit = storedUnit;
            radDegToggle.innerText = state.angleUnit.toUpperCase();
        }
    } catch (e) {}
}

// ==========================================================================
// History Display rendering
// ==========================================================================

export function loadHistory() {
    try {
        const stored = localStorage.getItem("calc_history");
        state.history = stored ? JSON.parse(stored) : [];
    } catch (e) {
        state.history = [];
    }
    renderHistory();
}

export function renderHistory() {
    if (!historyList) return;
    
    if (state.history.length === 0) {
        historyList.innerHTML = `<div class="history-empty">${translations.no_recent || "No recent calculations"}</div>`;
        return;
    }
    
    historyList.innerHTML = state.history.map((item, index) => `
        <div class="history-item" data-index="${index}">
            <div class="history-item-exp">${item.exp}</div>
            <div class="history-item-res">${item.res}</div>
            <div class="history-item-actions">
                <button class="history-action-btn load-exp-btn" data-index="${index}">${translations.use_formula || "Use formula"}</button>
                <button class="history-action-btn copy-btn" data-res="${item.res}">${translations.copy || "Copy"}</button>
            </div>
        </div>
    `).join("");
    
    historyList.querySelectorAll(".history-item").forEach(item => {
        item.addEventListener("click", (e) => {
            if (e.target.closest(".history-item-actions")) return;
            
            const index = item.getAttribute("data-index");
            const res = state.history[index].res;
            
            if (state.lastEvaluated) {
                state.formula = res;
                state.lastEvaluated = false;
            } else {
                const lastChar = state.formula.trim().slice(-1);
                if (/[0-9.πe)]/.test(lastChar)) {
                    state.formula += " × " + res;
                } else {
                    state.formula += res;
                }
            }
            updateDisplay();
            
            if (window.innerWidth < 768) {
                historyPanel.classList.remove("active");
            }
        });
    });
    
    historyList.querySelectorAll(".load-exp-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            state.formula = state.history[index].exp;
            state.lastEvaluated = false;
            updateDisplay();
            
            if (window.innerWidth < 768) {
                historyPanel.classList.remove("active");
            }
        });
    });
    
    historyList.querySelectorAll(".copy-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const res = btn.getAttribute("data-res");
            navigator.clipboard.writeText(res).then(() => {
                showToast(translations.copied || "Copied to clipboard!");
            });
        });
    });
}

export function initHistorySidebar() {
    if (window.innerWidth >= 768) {
        const collapsed = localStorage.getItem("calc_history_collapsed");
        if (collapsed === "true") {
            historyPanel.classList.add("hidden");
            appContainer.classList.add("history-collapsed");
        } else {
            historyPanel.classList.remove("hidden");
            appContainer.classList.remove("history-collapsed");
        }
    }
}
