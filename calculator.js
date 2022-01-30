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
const numberArgs = [];

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

(function main() {

    // UI BUTTONS
    // number buttons (The numbers themselves: 0-9)
    const numberButtons = document.querySelectorAll(".btn[data-number]");
    numberButtons.forEach(btn => btn.addEventListener("click", () => {
        expression.push(btn.getAttribute("data-number"));
        inputScreen.textContent = expression.join("");
    }));

    // operator buttons (Directly compute numbers:  +, -, *, /, !, x^2 etc)
    const operatorButtons = document.querySelectorAll(".btn[data-operator]");
    operatorButtons.forEach(btn => btn.addEventListener("click", () => {
        expression.push(btn.getAttribute("data-expr"));
        inputScreen.textContent = expression.join("");
    }));


    // special buttons ("Expression Modifiers" -- brackets, point, etc)


    // function buttons (these don't add to the expression, but do something)
    const deleteButton = document.querySelector(".btn[data-function=del]");
    deleteButton.addEventListener("click", del);

    const clearButton = document.querySelector(".btn[data-function=clear]");
    clearButton.addEventListener("click", clear);
})();