const display = document.getElementById("display");
const historyDiv = document.getElementById("history");
let currentInput = "";

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

function formatExpression(expr) {
  const tokens = expr.split(/([+\-*/])/);
  return tokens.map(token => {
    if ("+-*/".includes(token)) return token;
    return formatWithCommas(token);
  }).join("");
}

function updateDisplay() {
  if (!currentInput) {
    display.textContent = "0";
    return;
  }
  display.textContent = formatExpression(currentInput);
}

function appendNumber(num) {
  if (currentInput === "0") currentInput = "";
  currentInput += num;
  updateDisplay();
}

function appendOperator(op) {
  if (currentInput === "") return;
  const lastChar = currentInput.slice(-1);
  if ("+-*/".includes(lastChar)) currentInput = currentInput.slice(0, -1);
  currentInput += op;
  updateDisplay();
}

function appendDecimal() {
  const parts = currentInput.split(/[\+\-\*\/]/);
  const lastPart = parts[parts.length - 1];
  if (!lastPart.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}

function clearDisplay() {
  currentInput = "";
  updateDisplay();
}

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
