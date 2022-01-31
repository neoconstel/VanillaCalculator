// operator functions

function sum(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function product(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

/**
 * takes a mathematical function and the argument(s) to be computed
 * example use-case: operate(sum, 1,2,3); -> returns 6
 */
function operate(callback) {

    args = [...arguments].slice(1, arguments.length);
    return callback(...args);
}

// -----------end of operator functions-------------------------

const inputScreen = document.querySelector(".input");
const outputScreen = document.querySelector(".output");

const expression = [];

function evaluate(expr) {
    const basicOprMap = {
        "+": sum,
        "-": subtract,
        "*": product,
        "/": divide
    }

    // regex to find basic computations of form: 27.21+39.45*53.78
    let basicOprRegex = /([\+\-]?\d+\.?\d*)([\+\-\*\/])(\d+\.?\d*)/;
    basicOprMatch = expr.match(basicOprRegex);
    if (basicOprMatch) {
        console.log(basicOprMatch);
        let leftOperand = Number(basicOprMatch[1]);
        let rightOperand = Number(basicOprMatch[3]);
        let oprFunc = basicOprMap[basicOprMatch[2]];
        let computedMatch = oprFunc(leftOperand, rightOperand);
        if (basicOprMatch[0].length == expr.length)
            return computedMatch;
        else {
            expr = `${computedMatch}${expr.slice(basicOprMatch[0].length)}`;
            return evaluate(expr);
        }

    }
}

function del() {
    // remove the last entered element from the expression array
    expression.pop();
    // update the input screen to the contents of the expression array
    inputScreen.textContent = expression.join("");
}

function clear() {
    // clear the expression array
    expression.splice(0, expression.length);
    // clear both screens
    inputScreen.textContent = "";
    outputScreen.textContent = "";
}

function updateInputScreen() {
    inputScreen.textContent = expression.join("");
}

(function main() {

    // UI BUTTONS
    // number buttons (The numbers themselves: 0-9)
    const numberButtons = document.querySelectorAll(".btn[data-number]");
    numberButtons.forEach(btn => btn.addEventListener("click", () => {
        expression.push(btn.getAttribute("data-number"));
        updateInputScreen();
    }));

    // operator buttons (Directly compute numbers:  +, -, *, /, !, x^2 etc)
    const operatorButtons = document.querySelectorAll(".btn[data-operator]");
    operatorButtons.forEach(btn => btn.addEventListener("click", () => {
        expression.push(btn.getAttribute("data-expr"));
        updateInputScreen();
    }));


    // special buttons ("Expression Modifiers" -- brackets, point, etc)
    const specialButtons = document.querySelectorAll(".btn[data-special]");
    specialButtons.forEach(btn => btn.addEventListener("click", () => {
        expression.push(btn.getAttribute("data-expr"));
        updateInputScreen();
    }));


    // function buttons (these don't add to the expression, but do something)
    const deleteButton = document.querySelector(".btn[data-function=del]");
    deleteButton.addEventListener("click", del);

    const clearButton = document.querySelector(".btn[data-function=clear]");
    clearButton.addEventListener("click", clear);
})();