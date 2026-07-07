const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

// Replicates the operations dictionary from solution.py exactly
const operations = {
  "+": (n1, n2) => n1 + n2,
  "-": (n1, n2) => n1 - n2,
  "*": (n1, n2) => n1 * n2,
  "/": (n1, n2) => n1 / n2,
};

const logo = ` _____________________
|  _________________  |
| | Calculator      | |
| |_________________| |
|  ___ ___ ___   ___  |
| | 7 | 8 | 9 | | + | |
| |___|___|___| |___| |
| | 4 | 5 | 6 | | - | |
| |___|___|___| |___| |
| | 1 | 2 | 3 | | x | |
| |___|___|___| |___| |
| | . | 0 | = | | / | |
| |___|___|___| |___| |
|_____________________|`;

// State mirrors calculator() variables from solution.py
let step = 0;     // 0=num1, 1=operation, 2=num2, 3=continue-or-new
let num1 = 0;
let operationSymbol = '';
let finished = false;

function printLine(text, cls) {
  String(text).split('\n').forEach(line => {
    const div = document.createElement('div');
    div.className = cls || 'terminal-output-line';
    div.textContent = line;
    output.appendChild(div);
  });
}

function showPrompt(str) {
  promptText.textContent = str;
  lineWrap.hidden = false;
  input.value = '';
  input.focus();
}

function finish() {
  finished = true;
  lineWrap.hidden = true;
  input.blur();
  runBtn.disabled = false;
  runBtn.textContent = '▶ Run again';
}

// Replicates: for symbol in operations: print(symbol)
function showOperations() {
  Object.keys(operations).forEach(sym => printLine(sym));
}

function nextStep() {
  if (step === 0) {
    showPrompt('What is the first number?: ');
  } else if (step === 1) {
    showOperations();
    showPrompt('Pick an operation: ');
  } else if (step === 2) {
    showPrompt('What is the next number?: ');
  } else if (step === 3) {
    // Replicates: input(f"Type 'y' to continue calculating with {answer}, or type 'n' to start...")
    showPrompt(`Type 'y' to continue calculating with ${num1}, or type 'n' to start a new calculation: `);
  }
}

function handleEnter(event) {
  if (event.key !== 'Enter') return;
  if (finished) return;

  const raw = input.value.trim();
  if (raw === '') return;

  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  if (step === 0) {
    // Replicates: num1 = float(input("What is the first number?: "))
    const val = parseFloat(raw);
    if (isNaN(val)) { printLine('Please enter a number.'); showPrompt('What is the first number?: '); return; }
    num1 = val;
    step = 1;
    nextStep();

  } else if (step === 1) {
    // Replicates: operation_symbol = input("Pick an operation: ")
    if (!operations[raw]) { printLine('Please type +, -, * or /.'); showOperations(); showPrompt('Pick an operation: '); return; }
    operationSymbol = raw;
    step = 2;
    nextStep();

  } else if (step === 2) {
    // Replicates: num2 = float(input("What is the next number?: "))
    const num2 = parseFloat(raw);
    if (isNaN(num2)) { printLine('Please enter a number.'); showPrompt('What is the next number?: '); return; }

    // Replicates: answer = operations[operation_symbol](num1, num2)
    const answer = operations[operationSymbol](num1, num2);

    // Replicates: print(f"{num1} {operation_symbol} {num2} = {answer}")
    printLine(`${num1} ${operationSymbol} ${num2} = ${answer}`, 'result-line');

    // Set num1 to answer for next step (if user continues)
    num1 = answer;
    step = 3;
    nextStep();

  } else if (step === 3) {
    const choice = raw.toLowerCase();

    if (choice === 'y') {
      // Replicates: if choice == "y": num1 = answer (already set above)
      // Loop back to pick operation
      step = 1;
      nextStep();

    } else {
      // Replicates: else: should_accumulate = False; print("\n" * 20); calculator()
      printLine('--- New calculation ---');
      step = 0;
      nextStep();
    }
  }
}

function startDemo() {
  output.innerHTML = '';
  step = 0;
  num1 = 0;
  operationSymbol = '';
  finished = false;
  runBtn.disabled = true;

  // Replicates: print(calc_art.logo)
  printLine(logo);
  nextStep();
}

runBtn.addEventListener('click', startDemo);
input.addEventListener('keydown', handleEnter);
