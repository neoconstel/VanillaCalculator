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

function power(a, b) {
    return a ** b;
}

function squareRoot(n) {
    return Math.pow(n, 0.5);
}

function factoral(n) {
    // abort if negative or float
    if (n < 0 || n % 1 !== 0)
        return;

    if (n == 1 || n == 0)
        return 1;
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
        "^": power,
        "√": squareRoot,
        "!": factoral
    }

    // the order here determines operator precedence
    const oprRegexes = {
        "brackets": /\([^\()]+\)/,
        "factoral": /([\+\-]?\d+\.?\d*)(\!)/,
        "power": /([\+\-]?\d+\.?\d*)(\^)(\d+\.?\d*)/,
        "modulo": /([\+\-]?\d+\.?\d*)(\%)(\d+\.?\d*)/,
        "squareRoot": /(√)(\d+\.?\d*)/,
        "basic": /([\+\-]?\d+\.?\d*)([\+\-\*\/])([\+\-]?\d+\.?\d*)/,
        "constant": /([\+\-]?\d+\.?\d*)/,
    };

    for (let regexKey in oprRegexes) {
        let oprRegex = oprRegexes[regexKey];
        let oprMatch = expr.match(oprRegex);
        if (oprMatch) {
            console.log(oprMatch);

            let operand1, operand2, oprFunc, computedMatch;
            switch (regexKey) {

                // fallthrough (OR-like)
                case "basic":
                case "modulo":
                case "power":
                    operand1 = Number(oprMatch[1]);
                    operand2 = Number(oprMatch[3]);
                    oprFunc = OprToFunc[oprMatch[2]];
                    computedMatch = oprFunc(operand1, operand2);
                    break;

                case "factoral":
                    operand1 = Number(oprMatch[1]);
                    oprFunc = OprToFunc[oprMatch[2]];
                    computedMatch = oprFunc(operand1);
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

                case "constant":
                    computedMatch = Number(oprMatch[1]) * 1;
                    break;
            }

            /* if match is not the first in the expression (e.g x^2 in 25+x^2),
             *keep sign (+) in front
             */
            let sign = "";
            if (regexKey != "basic" && regexKey != "constant" && oprMatch.index > 0) {
                sign = oprMatch[0][0].match(/[\+\-\*\?]/) ? oprMatch[0][0] : sign;
            }

            if (oprMatch[0].length == expr.length)
                return computedMatch;
            else {
                expr = expr.replace(oprRegex, `${sign}${computedMatch}`);
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

function displayResult() {
    let expression = expressionArray.join("");
    let result = evaluate(expression);
    // if result is a float, round off decimal places
    // result = result % 1 === 0 ? result : result.toFixed(5);
    if (result % 1 !== 0 && result.toString().length > 5)
        result = result.toFixed(5);
    // clear just the input screen (0)
    clear(0);
    outputScreen.textContent = `${result}`;
}

(function main() {

    window.addEventListener("keydown", (event) => {
        if (event.key.match(/[0-9\.\+\-\*\/\^\%\!\(\)]/)) {
            expressionArray.push(event.key);
            updateInputScreen();
        } else if (event.key == "Backspace")
            del();
        else if (event.key == "Enter")
            displayResult();
    });

    // UI BUTTONS
    // number, operator, special buttons (call them expression buttons)
    const exprButtons = document.querySelectorAll(".btn[data-expr]");
    exprButtons.forEach(btn => btn.addEventListener("click", () => {
        expressionArray.push(btn.getAttribute("data-expr"));
        updateInputScreen();
    }));

    // function buttons (these don't add to the expression, but do something)
    const deleteButton = document.querySelector(".btn[data-function=del]");
    deleteButton.addEventListener("click", del);

    const clearButton = document.querySelector(".btn[data-function=clear]");
    clearButton.addEventListener("click", clear);

    const evaluateButton = document.querySelector(".btn[data-function=evaluate]");
    evaluateButton.addEventListener("click", displayResult);
})();