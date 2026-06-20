//PWA
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").then( registration => {
        console.log("Service Worker Registered");
        console.log(registration);
    }).catch( err => {
        console.log("Service Worker Failed to Register", err)
    });
} else{
    console.log("Service Worker is not supported in this browser");
}


//Calculator

const expression = document.querySelector("#expression")
const result = document.querySelector("#result")
const more = document.querySelector("#more")
const calculate = document.querySelector("#calculate")

const squareroot = document.querySelector("#sqrt")
const pi = document.querySelector("#pi")
const elevate = document.querySelector("#elevate")
const percentage = document.querySelector("#percentage")
const summ = document.querySelector("#summ")
const subtraction = document.querySelector("#subtraction")
const multiplication = document.querySelector("#multiplication")
const division = document.querySelector("#division")

const ac = document.querySelector("#ac")
const brackets = document.querySelector("#brackets")
const dot = document.querySelector("#dot")
const backspace = document.querySelector("#backspace")

const one = document.querySelector("#one")
const two = document.querySelector("#two")
const three = document.querySelector("#three")
const four = document.querySelector("#four")
const five = document.querySelector("#five")
const six = document.querySelector("#six")
const seven = document.querySelector("#seven")
const eight = document.querySelector("#eight")
const nine = document.querySelector("#nine")
const zero = document.querySelector("#zero")

var current_expression = "";
var saved_expression = "";
var number = 0;
var open_brackets = 0;
var last_is_brackets = true;


//Numbers
one.addEventListener("click", () => {
        number = number * 10 + 1
        current_expression = saved_expression + number.toString();
        expression.innerText = current_expression;
        last_is_brackets = false;
    } )
two.addEventListener("click", () => {
    number = number * 10 + 2
    current_expression = saved_expression + number.toString();
    expression.innerText = current_expression
    last_is_brackets = false;
} )
three.addEventListener("click", () => {
    number = number * 10 + 3
    current_expression = saved_expression + number.toString();
    expression.innerText = current_expression
    last_is_brackets = false;
} )
four.addEventListener("click", () => {
    number = number * 10 + 4
    current_expression = saved_expression + number.toString();
    expression.innerText = current_expression
    last_is_brackets = false;
} )
five.addEventListener("click", () => {
    number = number * 10 + 5
    current_expression = saved_expression + number.toString();
    expression.innerText = current_expression
    last_is_brackets = false;
} )
six.addEventListener("click", () => {
    number = number * 10 + 6
    current_expression = saved_expression + number.toString();
    expression.innerText = current_expression
    last_is_brackets = false;
} )
seven.addEventListener("click", () => {
    number = number * 10 + 7
    current_expression = saved_expression + number.toString();
    expression.innerText = current_expression
    last_is_brackets = false;
} )
eight.addEventListener("click", () => {
    number = number * 10 + 8
    current_expression = saved_expression + number.toString();
    expression.innerText = current_expression
    last_is_brackets = false;
} )
nine.addEventListener("click", () => {
    number = number * 10 + 9
    current_expression = saved_expression + number.toString();
    expression.innerText = current_expression
    last_is_brackets = false;
} )
zero.addEventListener("click", () => {
    number = number * 10
    current_expression = saved_expression + number.toString();
    expression.innerText = current_expression
    last_is_brackets = false;
} )

pi.addEventListener("click", () => {
    if (number != 0){
    saved_expression = saved_expression + number.toString() + "π";
    current_expression = saved_expression;
    number = 0;
    expression.innerText = saved_expression;
    last_is_brackets = false;
    }
    else{
        saved_expression = saved_expression + "π";
        current_expression = saved_expression;
        number = 0;
        expression.innerText = saved_expression;
        last_is_brackets = false;
    }
})

//mathematical functions

squareroot.addEventListener("click", () => {
    saved_expression = current_expression + "√(";
    open_brackets +=1
    number = 0;
    expression.innerText = saved_expression;
    last_is_brackets = true;
})

elevate.addEventListener("click", () => {
    if (number != 0){
        saved_expression = current_expression + "^";
        number = 0;
        expression.innerText = saved_expression;
        last_is_brackets = true;
    }
})

percentage.addEventListener("click", () => {
    if (number != 0){
        saved_expression = current_expression + "%";
        number = 0;
        expression.innerText = saved_expression;
        current_expression = saved_expression
        last_is_brackets = true;
    }
})

summ.addEventListener("click", () => {
    saved_expression = current_expression + "+";
    number = 0;
    expression.innerText = saved_expression;
    last_is_brackets = true;
})

subtraction.addEventListener("click", () => {
    saved_expression = current_expression + "-";
    number = 0;
    expression.innerText = saved_expression;
    last_is_brackets = true;
})

multiplication.addEventListener("click", () => {
    if (number != 0){
        saved_expression = current_expression + "×";
        number = 0;
        expression.innerText = saved_expression;
        last_is_brackets = true;
    }
    else{
        saved_expression = current_expression + "1×";
        number = 0;
        expression.innerText = saved_expression;
        last_is_brackets = true;
    }
})

division.addEventListener("click", () => {
    if (number != 0){
        saved_expression = current_expression + "÷";
        number = 0;
        expression.innerText = saved_expression;
        last_is_brackets = true;
    }
    else{
        saved_expression = current_expression + "1÷";
        number = 0;
        expression.innerText = saved_expression;
        last_is_brackets = true;
    }
})

//calculator button
ac.addEventListener("click", () => {
    expression.innerText = "";
    current_expression = "";
    saved_expression = "";
    number = 0;
    open_brackets = 0;
    last_is_brackets = true;
})

brackets.addEventListener("click", () => {
    if (open_brackets == 0 || last_is_brackets == true){
        saved_expression = expression.innerText + "(";
        current_expression = saved_expression;
        number = 0;
        open_brackets += 1;
        last_is_brackets = true;
        expression.innerText = saved_expression
    }
    if( last_is_brackets == false){
        saved_expression = current_expression + ")";
        current_expression = saved_expression;
        number = 0;
        open_brackets -= 1;
        expression.innerText = saved_expression;
    }
})

dot.addEventListener("click", () => {
    if (number == 0){
        saved_expression = saved_expression + "0.";
        expression.innerText = saved_expression;
    }
    else{
        saved_expression = current_expression + ".";
        number = 0;
        expression.innerText = saved_expression;
    }
})

backspace.addEventListener("click", () => {
    if (saved_expression != "" || current_expression != ""){
        saved_expression = expression.innerText.slice(0, expression.innerText.length - 1);
        current_expression = saved_expression;
        expression.innerText = saved_expression;
    }
})

calculate.addEventListener("click", () =>{
    saved_expression = current_expression.replace(/\π/g, "Math.PI");
    saved_expression = saved_expression.replace(/\%/g, "/(100)")
    saved_expression = saved_expression.replace(/\×/g, "*");
    saved_expression = saved_expression.replace(/\÷/g, "/");
    saved_expression = saved_expression.replace(/\(/g, "*(");
    saved_expression = saved_expression.replace(/\)/g, ")*");
    saved_expression = saved_expression.replace(/\*\*/g, "*");
    saved_expression = saved_expression.replace(/\(\*\(/g, "((");
    saved_expression = saved_expression.replace(/\/\*\(/g, "/(")
    if (saved_expression.charAt(0) == "*"){
        saved_expression = saved_expression.slice(1, saved_expression.length);
    }
    if (saved_expression.slice( - 1) == "*"){
        saved_expression = saved_expression.slice(0, saved_expression.length - 1)
    }
    while (open_brackets > 0) {
        saved_expression = saved_expression + ")";
        open_brackets -= 1;
    }
    saved_expression = saved_expression.replace(/√\*/g, "Math.sqrt");
    console.log(saved_expression)
    result.innerText = saved_expression
    let res = eval(saved_expression);
    result.innerText = res;
    navigator.clipboard.writeText(res);
})