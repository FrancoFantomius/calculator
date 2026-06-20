// ==========================================================================
// Imports from Modules
// ==========================================================================
import { state } from "./state.js";
import { 
    initLanguage,
    initTheme, 
    loadHistory, 
    initHistorySidebar, 
    loadSciSettings, 
    updateDisplay, 
    toggleScientificMode, 
    renderHistory,
    setTheme,
    radDegToggle, 
    sciToggle, 
    themeToggle, 
    historyToggle, 
    clearHistoryBtn, 
    historyPanel, 
    appContainer 
} from "./ui.js";
import { 
    handleNumber, 
    handleOperator, 
    handleDecimal, 
    handleBrackets, 
    handleSqrt, 
    handlePi, 
    handlePower, 
    handlePercentage, 
    handleSciFunction, 
    handleFactorial, 
    handleEuler, 
    handleInv, 
    handleCalculate 
} from "./handlers.js";

// ==========================================================================
// PWA Service Worker Registration
// ==========================================================================
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then(registration => {
        console.log("Service Worker Registered");
    }).catch(err => {
        console.log("Service Worker Failed to Register", err);
    });
} else {
    console.log("Service Worker is not supported in this browser");
}

// ==========================================================================
// Keypad Click Event Bindings
// ==========================================================================

document.getElementById("ac").addEventListener("click", () => {
    state.formula = "";
    state.lastEvaluated = false;
    updateDisplay();
});

document.getElementById("backspace").addEventListener("click", () => {
    if (state.formula.length > 0) {
        if (state.formula.endsWith(" ")) {
            state.formula = state.formula.slice(0, -3);
        } else if (state.formula.endsWith("√(")) {
            state.formula = state.formula.slice(0, -2);
        } else if (state.formula.endsWith("fact(")) {
            state.formula = state.formula.slice(0, -5);
        } else if (state.formula.endsWith("sin(") || state.formula.endsWith("cos(") || state.formula.endsWith("tan(") || state.formula.endsWith("log(")) {
            state.formula = state.formula.slice(0, -4);
        } else if (state.formula.endsWith("ln(")) {
            state.formula = state.formula.slice(0, -3);
        } else {
            state.formula = state.formula.slice(0, -1);
        }
    }
    state.lastEvaluated = false;
    updateDisplay();
});

document.getElementById("brackets").addEventListener("click", handleBrackets);
document.getElementById("percentage").addEventListener("click", handlePercentage);
document.getElementById("sqrt").addEventListener("click", handleSqrt);
document.getElementById("pi").addEventListener("click", handlePi);
document.getElementById("elevate").addEventListener("click", handlePower);
document.getElementById("calculate").addEventListener("click", handleCalculate);

document.getElementById("zero").addEventListener("click", () => handleNumber("0"));
document.getElementById("one").addEventListener("click", () => handleNumber("1"));
document.getElementById("two").addEventListener("click", () => handleNumber("2"));
document.getElementById("three").addEventListener("click", () => handleNumber("3"));
document.getElementById("four").addEventListener("click", () => handleNumber("4"));
document.getElementById("five").addEventListener("click", () => handleNumber("5"));
document.getElementById("six").addEventListener("click", () => handleNumber("6"));
document.getElementById("seven").addEventListener("click", () => handleNumber("7"));
document.getElementById("eight").addEventListener("click", () => handleNumber("8"));
document.getElementById("nine").addEventListener("click", () => handleNumber("9"));
document.getElementById("dot").addEventListener("click", handleDecimal);

document.getElementById("summ").addEventListener("click", () => handleOperator("+"));
document.getElementById("subtraction").addEventListener("click", () => handleOperator("−"));
document.getElementById("multiplication").addEventListener("click", () => handleOperator("×"));
document.getElementById("division").addEventListener("click", () => handleOperator("÷"));

// Scientific keys listeners
document.getElementById("sin").addEventListener("click", () => handleSciFunction("sin"));
document.getElementById("cos").addEventListener("click", () => handleSciFunction("cos"));
document.getElementById("tan").addEventListener("click", () => handleSciFunction("tan"));
document.getElementById("log").addEventListener("click", () => handleSciFunction("log"));
document.getElementById("ln").addEventListener("click", () => handleSciFunction("ln"));
document.getElementById("fact").addEventListener("click", handleFactorial);
document.getElementById("e").addEventListener("click", handleEuler);
document.getElementById("inv").addEventListener("click", handleInv);

// Scientific layout & unit togglers
radDegToggle.addEventListener("click", () => {
    state.angleUnit = state.angleUnit === "deg" ? "rad" : "deg";
    radDegToggle.innerText = state.angleUnit.toUpperCase();
    try {
        localStorage.setItem("calc_angle_unit", state.angleUnit);
    } catch (e) {}
    updateDisplay();
});

sciToggle.addEventListener("click", () => {
    toggleScientificMode();
});

// Theme toggle
themeToggle.addEventListener("click", () => {
    const isLight = document.body.classList.contains("light-theme");
    setTheme(isLight ? "dark" : "light", true);
});

// History Panel toggle
historyToggle.addEventListener("click", () => {
    if (window.innerWidth < 768) {
        historyPanel.classList.toggle("active");
    } else {
        const isHidden = historyPanel.classList.toggle("hidden");
        if (isHidden) {
            appContainer.classList.add("history-collapsed");
        } else {
            appContainer.classList.remove("history-collapsed");
        }
        localStorage.setItem("calc_history_collapsed", isHidden ? "true" : "false");
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
        historyPanel.classList.remove("active");
        initHistorySidebar();
    } else {
        historyPanel.classList.remove("hidden");
        appContainer.classList.remove("history-collapsed");
    }
});

clearHistoryBtn.addEventListener("click", () => {
    state.history = [];
    try {
        localStorage.removeItem("calc_history");
    } catch (e) {}
    renderHistory();
});

// ==========================================================================
// Keyboard Support
// ==========================================================================
document.addEventListener("keydown", (e) => {
    const activeEl = document.activeElement;
    if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA")) {
        return;
    }

    const key = e.key;
    
    if (/^[0-9]$/.test(key)) {
        handleNumber(key);
        e.preventDefault();
    } else if (key === "." || key === ",") {
        handleDecimal();
        e.preventDefault();
    } else if (key === "+") {
        handleOperator("+");
        e.preventDefault();
    } else if (key === "-") {
        handleOperator("−");
        e.preventDefault();
    } else if (key === "*") {
        handleOperator("×");
        e.preventDefault();
    } else if (key === "/") {
        handleOperator("÷");
        e.preventDefault();
    } else if (key === "%") {
        handlePercentage();
        e.preventDefault();
    } else if (key === "^") {
        handlePower();
        e.preventDefault();
    } else if (key === "(") {
        if (state.lastEvaluated) {
            state.formula = "(";
            state.lastEvaluated = false;
        } else {
            const lastChar = state.formula.trim().slice(-1);
            if (/[0-9.πe)]/.test(lastChar)) {
                state.formula += " × (";
            } else {
                state.formula += "(";
            }
        }
        updateDisplay();
        e.preventDefault();
    } else if (key === ")") {
        if (!state.lastEvaluated) {
            state.formula += ")";
            updateDisplay();
        }
        e.preventDefault();
    } else if (key === "!") {
        handleFactorial();
        e.preventDefault();
    } else if (key.toLowerCase() === "p") {
        handlePi();
        e.preventDefault();
    } else if (key.toLowerCase() === "s") {
        handleSciFunction("sin");
        e.preventDefault();
    } else if (key.toLowerCase() === "r") {
        handleSqrt();
        e.preventDefault();
    } else if (key.toLowerCase() === "c") {
        handleSciFunction("cos");
        e.preventDefault();
    } else if (key.toLowerCase() === "t") {
        handleSciFunction("tan");
        e.preventDefault();
    } else if (key.toLowerCase() === "l") {
        handleSciFunction("log");
        e.preventDefault();
    } else if (key.toLowerCase() === "n") {
        handleSciFunction("ln");
        e.preventDefault();
    } else if (key.toLowerCase() === "e") {
        handleEuler();
        e.preventDefault();
    } else if (key === "Backspace") {
        if (state.formula.length > 0) {
            if (state.formula.endsWith(" ")) {
                state.formula = state.formula.slice(0, -3);
            } else if (state.formula.endsWith("√(")) {
                state.formula = state.formula.slice(0, -2);
            } else if (state.formula.endsWith("fact(")) {
                state.formula = state.formula.slice(0, -5);
            } else if (state.formula.endsWith("sin(") || state.formula.endsWith("cos(") || state.formula.endsWith("tan(") || state.formula.endsWith("log(")) {
                state.formula = state.formula.slice(0, -4);
            } else if (state.formula.endsWith("ln(")) {
                state.formula = state.formula.slice(0, -3);
            } else {
                state.formula = state.formula.slice(0, -1);
            }
        }
        state.lastEvaluated = false;
        updateDisplay();
        e.preventDefault();
    } else if (key === "Escape") {
        state.formula = "";
        state.lastEvaluated = false;
        updateDisplay();
        e.preventDefault();
    } else if (key === "Enter" || key === "=") {
        handleCalculate();
        e.preventDefault();
    }
});

// ==========================================================================
// Initialization
// ==========================================================================
initLanguage();
initTheme();
loadHistory();
initHistorySidebar();
loadSciSettings();
updateDisplay();