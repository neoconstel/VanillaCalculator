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

function modulo(a, b) {
    return a % b;
}

function square(n) {
    return n ** 2;
}

function squareRoot(n) {
    return Math.pow(n, 0.5);
}

function factoral(n) {
    if (n == 1)
        return n;
    else
        return n * factoral(n - 1);
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

const expressionArray = [];

function evaluate(expr) {
    const OprToFunc = {
        "+": sum,
        "-": subtract,
        "*": product,
        "/": divide,
        "%": modulo,
        "^2": square,
        "√": squareRoot,
        "!": factoral
    }

    // the order here determines operator precedence
    const oprRegexes = {
        "brackets": /\([^\()]+\)/,
        "factoral": /(\d+\.?\d*)(\!)/,
        "modulo": /([\+\-]?\d+\.?\d*)(\%)(\d+\.?\d*)/,
        "squareRoot": /(√)(\d+\.?\d*)/,
        "basic": /([\+\-]?\d+\.?\d*)([\+\-\*\/])(\d+\.?\d*)/,
    };

    for (let regexKey in oprRegexes) {
        let oprRegex = oprRegexes[regexKey];
        let oprMatch = expr.match(oprRegex);
        if (oprMatch) {
            console.log(oprMatch);

            let operand1, operand2, oprFunc, computedMatch;
            switch (regexKey) {
                case "factoral":
                    operand1 = Number(oprMatch[1]);
                    oprFunc = OprToFunc[oprMatch[2]];
                    computedMatch = oprFunc(operand1);
                    break;

                case "basic":
                    operand1 = Number(oprMatch[1]);
                    operand2 = Number(oprMatch[3]);
                    oprFunc = OprToFunc[oprMatch[2]];
                    computedMatch = oprFunc(operand1, operand2);
                    break;

                case "modulo":
                    operand1 = Number(oprMatch[1]);
                    operand2 = Number(oprMatch[3]);
                    oprFunc = OprToFunc[oprMatch[2]];
                    computedMatch = oprFunc(operand1, operand2);
                    break;

                case "brackets":
                    let innerExpression = oprMatch[0].slice(1, oprMatch[0].length - 1);
                    computedMatch = evaluate(innerExpression);
                    break;

                case "squareRoot":
                    operand1 = Number(oprMatch[2]);
                    oprFunc = OprToFunc[oprMatch[1]];
                    computedMatch = oprFunc(operand1);
                    break;
            }

            if (oprMatch[0].length == expr.length)
                return computedMatch;
            else {
                expr = expr.replace(oprRegex, `${computedMatch}`);
                return evaluate(expr);
            }
        }
    }
}

function del() {
    // remove the last entered element from the expression array
    expressionArray.pop();
    // update the input screen to the contents of the expression array
    inputScreen.textContent = expressionArray.join("");
}

function clear(screen = null) {
    // clear the expression array
    expressionArray.splice(0, expressionArray.length);
    if (screen == 0) {
        inputScreen.textContent = "";
        return;
    } else if (screen == 1) {
        outputScreen.textContent = "";
        return;
    }
    // clear both screens
    inputScreen.textContent = "";
    outputScreen.textContent = "";
}

function updateInputScreen() {
    inputScreen.textContent = expressionArray.join("");
}

(function main() {

    // UI BUTTONS
    // number buttons (The numbers themselves: 0-9)
    const numberButtons = document.querySelectorAll(".btn[data-number]");
    numberButtons.forEach(btn => btn.addEventListener("click", () => {
        expressionArray.push(btn.getAttribute("data-number"));
        updateInputScreen();
    }));

    // operator buttons (Directly compute numbers:  +, -, *, /, !, x^2 etc)
    const operatorButtons = document.querySelectorAll(".btn[data-operator]");
    operatorButtons.forEach(btn => btn.addEventListener("click", () => {
        expressionArray.push(btn.getAttribute("data-expr"));
        updateInputScreen();
    }));


    // special buttons ("Expression Modifiers" -- brackets, point, etc)
    const specialButtons = document.querySelectorAll(".btn[data-special]");
    specialButtons.forEach(btn => btn.addEventListener("click", () => {
        expressionArray.push(btn.getAttribute("data-expr"));
        updateInputScreen();
    }));


    // function buttons (these don't add to the expression, but do something)
    const deleteButton = document.querySelector(".btn[data-function=del]");
    deleteButton.addEventListener("click", del);

    const clearButton = document.querySelector(".btn[data-function=clear]");
    clearButton.addEventListener("click", clear);

    const evaluateButton = document.querySelector(".btn[data-function=evaluate]");
    evaluateButton.addEventListener("click", () => {
        let expression = expressionArray.join("");
        let result = evaluate(expression);
        // if result is a float, round off decimal places
        // result = result % 1 === 0 ? result : result.toFixed(5);
        // clear just the input screen (0)
        clear(0);
        outputScreen.textContent = `${result}`;
    });
})();