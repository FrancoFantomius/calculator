import { state } from "./state.js";
import { evaluateFormula, formatResult } from "./math.js";
import { updateDisplay, adjustFontSize, showToast, renderHistory, expressionEl, resultEl } from "./ui.js";
import { translations } from "./i18.js";

// ==========================================================================
// Calculator Key Handlers
// ==========================================================================

export function handleNumber(digit) {
    if (state.lastEvaluated) {
        state.formula = digit;
        state.lastEvaluated = false;
    } else {
        if (state.formula === "0" && digit !== ".") {
            state.formula = digit;
        } else {
            state.formula += digit;
        }
    }
    updateDisplay();
}

export function handleOperator(op) {
    if (state.lastEvaluated) {
        state.lastEvaluated = false;
    }
    
    // Support unary negative sign at beginning
    if (state.formula === "" && op === "−") {
        state.formula = "−";
        updateDisplay();
        return;
    }
    
    // Support unary negative sign inside brackets
    if (state.formula.endsWith("(") && op === "−") {
        state.formula += "−";
        updateDisplay();
        return;
    }

    // Swap operators if typed consecutively
    if (state.formula.endsWith(" + ") || state.formula.endsWith(" − ") || state.formula.endsWith(" × ") || state.formula.endsWith(" ÷ ")) {
        state.formula = state.formula.slice(0, -3) + ` ${op} `;
    } else if (state.formula.length > 0 && !state.formula.endsWith("(")) {
        state.formula += ` ${op} `;
    }
    updateDisplay();
}

export function handleDecimal() {
    if (state.lastEvaluated) {
        state.formula = "0.";
        state.lastEvaluated = false;
        updateDisplay();
        return;
    }
    
    const lastToken = state.formula.split(/[\s()]/).pop();
    if (!lastToken.includes(".")) {
        if (lastToken === "") {
            state.formula += "0.";
        } else {
            state.formula += ".";
        }
    }
    updateDisplay();
}

export function handleBrackets() {
    if (state.lastEvaluated) {
        state.formula = "(";
        state.lastEvaluated = false;
        updateDisplay();
        return;
    }
    
    let openCount = 0;
    let closeCount = 0;
    for (let char of state.formula) {
        if (char === '(') openCount++;
        if (char === ')') closeCount++;
    }
    
    const lastChar = state.formula.trim().slice(-1);
    
    if (openCount > closeCount && (/[0-9.πe)]/.test(lastChar))) {
        state.formula += ")";
    } else {
        if (/[0-9.πe)]/.test(lastChar)) {
            state.formula += " × (";
        } else {
            state.formula += "(";
        }
    }
    updateDisplay();
}

export function handleSqrt() {
    if (state.lastEvaluated) {
        state.formula = "√(";
        state.lastEvaluated = false;
    } else {
        const lastChar = state.formula.trim().slice(-1);
        if (/[0-9.πe)]/.test(lastChar)) {
            state.formula += " × √(";
        } else {
            state.formula += "√(";
        }
    }
    updateDisplay();
}

export function handlePi() {
    if (state.lastEvaluated) {
        state.formula = "π";
        state.lastEvaluated = false;
    } else {
        const lastChar = state.formula.trim().slice(-1);
        if (/[0-9.πe)]/.test(lastChar)) {
            state.formula += " × π";
        } else {
            state.formula += "π";
        }
    }
    updateDisplay();
}

export function handlePower() {
    if (state.lastEvaluated) {
        state.lastEvaluated = false;
    }
    const lastChar = state.formula.trim().slice(-1);
    if (/[0-9.πe)]/.test(lastChar)) {
        state.formula += "^";
    }
    updateDisplay();
}

export function handlePercentage() {
    if (state.lastEvaluated) {
        state.lastEvaluated = false;
    }
    const lastChar = state.formula.trim().slice(-1);
    if (/[0-9.πe)]/.test(lastChar)) {
        state.formula += "%";
    }
    updateDisplay();
}

export function handleSciFunction(func) {
    if (state.lastEvaluated) {
        state.formula = `${func}(`;
        state.lastEvaluated = false;
    } else {
        const lastChar = state.formula.trim().slice(-1);
        if (/[0-9.πe)]/.test(lastChar)) {
            state.formula += ` × ${func}(`;
        } else {
            state.formula += `${func}(`;
        }
    }
    updateDisplay();
}

export function handleFactorial() {
    if (!state.formula && !state.lastEvaluated) return;

    if (state.lastEvaluated) {
        // Wrap the entire previous result
        state.formula = `fact(${state.formula})`;
        state.lastEvaluated = false;
        updateDisplay();
        return;
    }

    const lastChar = state.formula.trim().slice(-1);

    if (/[0-9.]/.test(lastChar)) {
        // Wrap the last number
        const numMatch = state.formula.match(/(\d+\.?\d*)$/);
        if (numMatch) {
            const before = state.formula.slice(0, numMatch.index);
            state.formula = before + `fact(${numMatch[0]})`;
        }
    } else if (lastChar === "π") {
        state.formula = state.formula.slice(0, -1) + "fact(π)";
    } else if (lastChar === "e") {
        state.formula = state.formula.slice(0, -1) + "fact(e)";
    } else if (lastChar === ")") {
        // Find the matching opening parenthesis
        let depth = 0;
        let i = state.formula.length - 1;
        while (i >= 0) {
            if (state.formula[i] === ")") depth++;
            if (state.formula[i] === "(") depth--;
            if (depth === 0) break;
            i--;
        }
        const before = state.formula.slice(0, i);
        const group = state.formula.slice(i);
        state.formula = before + `fact(${group})`;
    }

    updateDisplay();
}

export function handleEuler() {
    if (state.lastEvaluated) {
        state.formula = "e";
        state.lastEvaluated = false;
    } else {
        const lastChar = state.formula.trim().slice(-1);
        if (/[0-9.πe)]/.test(lastChar)) {
            state.formula += " × e";
        } else {
            state.formula += "e";
        }
    }
    updateDisplay();
}

export function handleInv() {
    if (state.lastEvaluated) {
        state.formula = "1 ÷ (";
        state.lastEvaluated = false;
    } else {
        const lastChar = state.formula.trim().slice(-1);
        if (/[0-9.πe)]/.test(lastChar)) {
            state.formula += " × 1 ÷ (";
        } else {
            state.formula += "1 ÷ (";
        }
    }
    updateDisplay();
}

export function handleCalculate() {
    if (!state.formula) return;
    try {
        const resultVal = evaluateFormula(state.formula);
        if (resultVal === null || isNaN(resultVal)) {
            resultEl.innerText = translations.error || "Error";
            resultEl.style.opacity = "1";
            return;
        }
        
        const formattedRes = formatResult(resultVal);
        
        // Copy to clipboard automatically on evaluate
        navigator.clipboard.writeText(formattedRes).then(() => {
            showToast(translations.copied || "Copied to clipboard!");
        }).catch(() => {});

        // Save to localStorage history
        saveToHistory(state.formula, formattedRes);
        
        // Render Committed result
        expressionEl.innerText = state.formula;
        resultEl.innerText = formattedRes;
        resultEl.classList.remove("preview-mode");
        resultEl.style.opacity = "1";
        
        state.formula = formattedRes;
        state.lastEvaluated = true;
        adjustFontSize();
    } catch (err) {
        resultEl.innerText = translations.error || "Error";
        resultEl.style.opacity = "1";
    }
}

export function saveToHistory(exp, res) {
    if (state.history.length > 0 && state.history[0].exp === exp && state.history[0].res === res) {
        return; // Avoid duplicates
    }
    
    state.history.unshift({ exp, res });
    if (state.history.length > 30) state.history.pop();
    
    try {
        localStorage.setItem("calc_history", JSON.stringify(state.history));
    } catch (e) {}
    
    renderHistory();
}
