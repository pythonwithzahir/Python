const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

// Character lists matching solution.py exactly
const letters = [
  'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r',
  's','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J',
  'K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
];
const numbers = ['0','1','2','3','4','5','6','7','8','9'];
const symbols = ['!','#','$','%','&','(',')','+','*'];

// Linear 3-step flow: nr_letters → nr_symbols → nr_numbers → generate
const steps = [
  { prompt: "How many letters would you like in your password?\n> " },
  { prompt: "How many symbols would you like?\n> " },
  { prompt: "How many numbers would you like?\n> " },
];

let currentStep = 0;
let answers = [];
let finished = false;

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
  // Fisher-Yates — same result as random.shuffle()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function printLine(text) {
  const div = document.createElement("div");
  div.className = "terminal-output-line";
  div.textContent = text;
  output.appendChild(div);
}

function printResult(text) {
  const div = document.createElement("div");
  div.className = "result-line";
  div.textContent = text;
  output.appendChild(div);
}

function printError(text) {
  const div = document.createElement("div");
  div.className = "lose-line";
  div.textContent = text;
  output.appendChild(div);
}

function showPrompt(promptStr) {
  promptText.textContent = promptStr;
  lineWrap.hidden = false;
  input.value = "";
  input.focus();
}

function generatePassword(nrLetters, nrSymbols, nrNumbers) {
  // Replicate solution.py hard level exactly:
  // 1. Build password_list with appends
  const passwordList = [];
  for (let i = 0; i < nrLetters; i++) passwordList.push(randChoice(letters));
  for (let i = 0; i < nrSymbols; i++) passwordList.push(randChoice(symbols));
  for (let i = 0; i < nrNumbers; i++) passwordList.push(randChoice(numbers));

  // 2. random.shuffle()
  shuffle(passwordList);

  // 3. Join with for loop (password += char)
  let password = "";
  for (const char of passwordList) password += char;

  return password;
}

function finish() {
  finished = true;
  lineWrap.hidden = true;
  input.value = "";
  input.blur();
  runBtn.disabled = false;
  runBtn.textContent = "▶ Run again";
}

function runStep() {
  showPrompt(steps[currentStep].prompt);
}

function handleEnter(event) {
  if (event.key !== "Enter") return;
  if (finished) return;

  const raw = input.value.trim();
  if (raw === "") return;

  // Echo prompt + answer
  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  const value = parseInt(raw, 10);

  if (isNaN(value) || value < 0) {
    printError("Please enter a whole number of 0 or more.");
    showPrompt(steps[currentStep].prompt);
    return;
  }

  answers.push(value);
  currentStep++;

  if (currentStep < steps.length) {
    runStep();
  } else {
    // All three inputs collected — generate password
    const [nrLetters, nrSymbols, nrNumbers] = answers;
    const total = nrLetters + nrSymbols + nrNumbers;

    if (total === 0) {
      printError("You need at least one character in your password.");
      finish();
      return;
    }

    const password = generatePassword(nrLetters, nrSymbols, nrNumbers);
    printResult(`Your password is: ${password}`);
    finish();
  }
}

function startDemo() {
  output.innerHTML = "";
  currentStep = 0;
  answers = [];
  finished = false;
  runBtn.disabled = true;
  printLine("Welcome to the SecureKey Generator!");
  runStep();
}

runBtn.addEventListener("click", startDemo);
input.addEventListener("keydown", handleEnter);
