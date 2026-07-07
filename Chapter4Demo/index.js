const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

// Die images matching solution.py exactly (raw strings converted for JS)
const d4 = `
    /\\
   /  \\
  /    \\
 / d4   \\
/________\\`;

const d6 = `
+----------+
|          |
|    d6    |
|          |
+----------+`;

const d12 = `
  /--------\\
 /          \\
|    d12     |
 \\          /
  \\--------/`;

const die_images = [d4, d6, d12];
const die_sides = [4, 6, 12];
const die_names = ["d4 (4-sided)", "d6 (6-sided)", "d12 (12-sided)"];

let finished = false;

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function printLose(text) {
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

function finish() {
  finished = true;
  lineWrap.hidden = true;
  input.value = "";
  input.blur();
  runBtn.disabled = false;
  runBtn.textContent = "▶ Run again";
}

function handleEnter(event) {
  if (event.key !== "Enter") return;
  if (finished) return;

  const raw = input.value.trim();
  if (raw === "") return;

  // Echo the prompt + answer to the terminal output
  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  const userChoice = parseInt(raw, 10);

  // Show player's die if valid (matching solution.py's if/else order)
  if (userChoice >= 0 && userChoice <= 2) {
    printLine("You chose:");
    // Print each line of the die art
    die_images[userChoice].split("\n").forEach(l => printLine(l));
  }

  // Computer always picks randomly from the same three dice
  const computerChoice = randInt(0, 2);
  printLine("Computer chose:");
  die_images[computerChoice].split("\n").forEach(l => printLine(l));

  // Invalid input check first (matching solution.py's if order)
  if (isNaN(userChoice) || userChoice < 0 || userChoice > 2) {
    printLose("You typed an invalid number. You lose!");
    finish();
    return;
  }

  // Roll both dice
  const playerRoll = randInt(1, die_sides[userChoice]);
  const computerRoll = randInt(1, die_sides[computerChoice]);

  printLine(`You rolled: ${playerRoll} (out of ${die_sides[userChoice]})`);
  printLine(`Computer rolled: ${computerRoll} (out of ${die_sides[computerChoice]})`);

  if (playerRoll > computerRoll) {
    printResult("You win!");
  } else if (computerRoll > playerRoll) {
    printLose("You lose!");
  } else {
    printLine("It's a draw!");
  }

  finish();
}

function startDemo() {
  output.innerHTML = "";
  finished = false;
  runBtn.disabled = true;
  runBtn.textContent = "▶ Run";
  showPrompt("Pick your die. Type 0 for d4, 1 for d6, or 2 for d12.\n> ");
}

runBtn.addEventListener("click", startDemo);
input.addEventListener("keydown", handleEnter);
