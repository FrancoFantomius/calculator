import { state } from "./state.js";

// Factorial helper computation
export function factorial(n) {
    if (n < 0) return NaN;
    if (!Number.isInteger(n)) return NaN;
    if (n > 170) return Infinity; // Math overflow limit in JS
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Mathematical Parser / Sandbox Evaluator
export function evaluateFormula(f) {
    if (!f) return null;
    let expr = f;
    
    // Balance open parentheses automatically before evaluating
    let openCount = 0;
    for (let char of expr) {
        if (char === '(') openCount++;
        else if (char === ')') openCount--;
    }
    while (openCount > 0) {
        expr += ')';
        openCount--;
    }

    // Convert display operators to javascript math standards
    expr = expr.replace(/×/g, "*");
    expr = expr.replace(/÷/g, "/");
    expr = expr.replace(/−/g, "-");
    expr = expr.replace(/\^/g, "**");
    expr = expr.replace(/√\(/g, "Math.sqrt(");
    
    // Factorial and Euler e
    expr = expr.replace(/fact\(/g, "factorial(");
    expr = expr.replace(/\be\b/g, "Math.E");
    expr = expr.replace(/π/g, "Math.PI");
    
    // Logarithms
    expr = expr.replace(/log\(/g, "Math.log10(");
    expr = expr.replace(/ln\(/g, "Math.log(");
    
    // Trigonometric functions based on unit mode (DEG vs RAD)
    if (state.angleUnit === "deg") {
        expr = expr.replace(/sin\(/g, "Math.sin((Math.PI/180)*");
        expr = expr.replace(/cos\(/g, "Math.cos((Math.PI/180)*");
        expr = expr.replace(/tan\(/g, "Math.tan((Math.PI/180)*");
    } else {
        expr = expr.replace(/sin\(/g, "Math.sin(");
        expr = expr.replace(/cos\(/g, "Math.cos(");
        expr = expr.replace(/tan\(/g, "Math.tan(");
    }
    
    // Implicit multiplication patterns (only bare numbers/parens, not Math.* calls)
    expr = expr.replace(/(?<![a-zA-Z.])(\d+)\(/g, "$1*(");
    expr = expr.replace(/\)(\d+)/g, ")*$1");
    expr = expr.replace(/\)\(/g, ")*(");
    
    // Implicit multiplication: number directly before Math.* or factorial
    // Use lookbehind to avoid matching digits inside names like log10
    expr = expr.replace(/(?<![a-zA-Z.])(\d)(Math\.)/g, "$1*$2");
    expr = expr.replace(/(?<![a-zA-Z.])(\d)(factorial)/g, "$1*$2");
    // Implicit multiplication: closing paren before Math.* or factorial
    expr = expr.replace(/\)(Math\.)/g, ")*Math.");
    expr = expr.replace(/\)(factorial)/g, ")*factorial");
    // Implicit multiplication: Math.PI or Math.E directly before ( or Math.*
    expr = expr.replace(/(Math\.PI|Math\.E)(\()/g, "$1*$2");
    expr = expr.replace(/(Math\.PI|Math\.E)(Math\.)/g, "$1*$2");
    expr = expr.replace(/(Math\.PI|Math\.E)(factorial)/g, "$1*$2");
    
    // Percentage handling: e.g. "50%" -> "(50/100)"
    expr = expr.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
    expr = expr.replace(/Math\.PI%/g, "(Math.PI/100)");
    expr = expr.replace(/Math\.E%/g, "(Math.E/100)");

    // Safe mathematical validation
    const safeTokens = [
        "Math\\.PI", "Math\\.E", "Math\\.sqrt", 
        "Math\\.sin", "Math\\.cos", "Math\\.tan", 
        "Math\\.log10", "Math\\.log", "factorial"
    ];
    let checkExpr = expr;
    safeTokens.forEach(kw => {
        checkExpr = checkExpr.replace(new RegExp(kw, 'g'), "");
    });
    // Remove temporary visual helper characters
    checkExpr = checkExpr.replace(/e/g, "").replace(/deg/g, "").replace(/rad/g, "");
    
    if (!/^[0-9.+\-*/() ]*$/.test(checkExpr)) {
        throw new Error("Unsafe input");
    }

    // Run clean calculation (factorial injected into eval scope)
    const _factorial = factorial;
    return Function("factorial", `"use strict"; return (${expr})`).call(null, _factorial);
}

// Trim decimals nicely and format numbers
export function formatResult(res) {
    if (res === Infinity || res === -Infinity) return "Errore";
    if (isNaN(res)) return "Errore";
    
    if (Number.isInteger(res)) {
        return res.toString();
    }
    
    // Restrict floating point errors (e.g. 0.1 + 0.2)
    let formatted = parseFloat(res.toFixed(10));
    return formatted.toString();
}
