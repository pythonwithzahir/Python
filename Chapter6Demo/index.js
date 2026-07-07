const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

let low, high, attempts, finished;

// Replicates make_guess(low, high) from solution.py exactly
function makeGuess(low, high) {
  return Math.floor((low + high) / 2);
}

function printLine(text, cls) {
  const div = document.createElement("div");
  div.className = cls || "terminal-output-line";
  div.textContent = text;
  output.appendChild(div);
}

function showPrompt(promptStr) {
  promptText.textContent = promptStr;
  lineWrap.hidden = false;
  input.value = "";
  input.focus();
}

function finish() {
  finished = true;
  lineWrap.hidden = true;
  input.blur();
  runBtn.disabled = false;
  runBtn.textContent = "▶ Play again";
}

// Replicates the while True: loop from play() in solution.py
function doGuess() {
  const guess = makeGuess(low, high);
  attempts++;
  printLine(`\nMy guess is: ${guess}`);
  // Replicates get_feedback() prompt
  showPrompt("Type 'C' if I'm correct, 'H' if I'm too high, 'L' if I'm too low.\n> ");
}

function handleEnter(event) {
  if (event.key !== "Enter") return;
  if (finished) return;

  const raw = input.value.trim();
  if (raw === "") return;

  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  // Replicates .lower().strip() from get_feedback()
  const feedback = raw.toLowerCase().trim();
  const guess = makeGuess(low, high);

  // Replicates the if/elif/else block from play()
  if (feedback === 'c') {
    printLine(`I guessed your number in ${attempts} attempts!`, "result-line");
    finish();
  } else if (feedback === 'h') {
    printLine("Got it, guessing lower next time.");
    high = guess - 1;
    doGuess();
  } else if (feedback === 'l') {
    printLine("Got it, guessing higher next time.");
    low = guess + 1;
    doGuess();
  } else {
    // Replicates the else: print("Please type C, H, or L.")
    printLine("Please type C, H, or L.");
    showPrompt("Type 'C' if I'm correct, 'H' if I'm too high, 'L' if I'm too low.\n> ");
  }
}

function startGame() {
  output.innerHTML = "";
  low = 1;
  high = 100;
  attempts = 0;
  finished = false;
  runBtn.disabled = true;

  // Replicates play()'s opening print statements
  printLine("Think of a number between 1 and 100.");
  printLine("I will try to guess it!");
  doGuess();
}

runBtn.addEventListener("click", startGame);
input.addEventListener("keydown", handleEnter);
