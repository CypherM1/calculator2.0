const display = document.getElementById("display");
const historyDiv = document.getElementById("history");
const buttons = document.querySelectorAll(".buttons button");
let currentInput = "";

// Format number with commas
function formatWithCommas(value) {
  if (!value) return value;
  if (value === "-") return value;
  if (value.includes(".")) {
    const [intPart, decPart] = value.split(".");
    const neg = intPart.startsWith("-") ? "-" : "";
    const intPartAbs = neg ? intPart.slice(1) : intPart;
    const formattedInt = Number(intPartAbs).toLocaleString();
    return neg + formattedInt + "." + decPart;
  }
  if (value.startsWith("-")) {
    return "-" + Number(value.slice(1)).toLocaleString();
  }
  return Number(value).toLocaleString();
}

// Format full expression (numbers with commas, keep operators)
function formatExpression(expr) {
  const tokens = expr.split(/([+\-*/])/);
  return tokens.map(token => {
    if ("+-*/".includes(token)) return token;
    return formatWithCommas(token);
  }).join("");
}

function updateDisplay() {
  display.textContent = currentInput ? formatExpression(currentInput) : "0";
}

// Append number with rules: prevent multiple leading zeros
function appendNumber(num) {
  const parts = currentInput.split(/([+\-*/])/);
  const lastPart = parts[parts.length - 1];

  if (lastPart === "0" && num === "0") return; // prevent "00"
  if (lastPart === "0" && num !== "0" && !lastPart.includes(".")) {
    currentInput = currentInput.slice(0, -1); // replace leading zero
  }

  currentInput += num;
  updateDisplay();
}

// Append operator: prevent multiple consecutive operators
function appendOperator(op) {
  if (!currentInput) return;
  const lastChar = currentInput.slice(-1);
  if ("+-*/".includes(lastChar)) {
    currentInput = currentInput.slice(0, -1); // replace last operator
  }
  currentInput += op;
  updateDisplay();
}

// Append decimal: only one per number segment
function appendDecimal() {
  const parts = currentInput.split(/([+\-*/])/);
  const lastPart = parts[parts.length - 1];
  if (!lastPart.includes(".")) {
    if (lastPart === "") {
      currentInput += "0."; // add leading zero if decimal at start
    } else {
      currentInput += ".";
    }
    updateDisplay();
  }
}

// Clear display
function clearDisplay() {
  currentInput = "";
  updateDisplay();
}

// Evaluate expression safely
function calculateResult() {
  try {
    const result = eval(currentInput);
    addToHistory(currentInput + " = " + result);
    currentInput = result.toString();
    updateDisplay();
  } catch {
    currentInput = "";
    display.textContent = "Error";
  }
}

// Add entry to history with formatted commas
function addToHistory(entry) {
  const [expr, res] = entry.split("=");
  const formattedExpr = formatExpression(expr.trim());
  const formattedRes = formatWithCommas(res.trim());
  const formattedEntry = `${formattedExpr} = ${formattedRes}`;

  const div = document.createElement("div");
  div.className = "history-entry";
  div.textContent = formattedEntry;
  historyDiv.appendChild(div);
  historyDiv.scrollTop = historyDiv.scrollHeight;
}

// Button event listeners
buttons.forEach(button => {
  const action = button.dataset.action;
  if (action === "number") {
    button.addEventListener("click", () => appendNumber(button.dataset.value));
  } else if (action === "operator") {
    button.addEventListener("click", () => appendOperator(button.dataset.value));
  } else if (action === "decimal") {
    button.addEventListener("click", appendDecimal);
  } else if (action === "clear") {
    button.addEventListener("click", clearDisplay);
  } else if (action === "equals") {
    button.addEventListener("click", calculateResult);
  }
});

// Keyboard support
document.addEventListener("keydown", function (e) {
  if (e.key >= "0" && e.key <= "9") {
    appendNumber(e.key);
  } else if ("+-*/".includes(e.key)) {
    appendOperator(e.key);
  } else if (e.key === "." || e.key === ",") {
    appendDecimal();
  } else if (e.key === "Enter" || e.key === "=") {
    e.preventDefault();
    calculateResult();
  } else if (e.key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
  } else if (e.key === "Escape" || e.key.toLowerCase() === "c") {
    clearDisplay();
  }
});
