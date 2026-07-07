const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

// Matches alphabet list from solution.py exactly
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

const logo = ` ____  _                   _  ____  _       _               _
/ ___|(_) __ _ _ __   __ _| |/ ___(_)_ __ | |__   ___ _ __| |
\\___ \\| |/ _\` | '_ \\ / _\` | | |   | | '_ \\| '_ \\ / _ \\ '__| |
 ___) | | (_| | | | | (_| | | |___| | |_) | | | |  __/ |  |_|
|____/|_|\\__, |_| |_|\\__,_|_|\\____|_| .__/|_| |_|\\___|_|  (_)
         |___/                       |_|
       T R A I N   S T A T I O N   S I G N A L   C I P H E R`;

// Game state
let stepIndex = 0;
let direction = '';
let text = '';
let shiftRaw = '';
let finished = false;

// Replicates signal_cipher() from solution.py exactly
function signalCipher(originalText, shiftAmount, encodeOrDecode) {
  let outputText = '';
  if (encodeOrDecode === 'decode') shiftAmount *= -1;
  for (const letter of originalText) {
    if (!alphabet.includes(letter)) {
      outputText += letter;
    } else {
      let shiftedPosition = alphabet.indexOf(letter) + shiftAmount;
      shiftedPosition = ((shiftedPosition % 26) + 26) % 26; // handles negative wrap
      outputText += alphabet[shiftedPosition];
    }
  }
  return outputText;
}

function printLine(text, cls) {
  text.split('\n').forEach(line => {
    const div = document.createElement("div");
    div.className = cls || "terminal-output-line";
    div.textContent = line;
    output.appendChild(div);
  });
}

function showPrompt(str) {
  promptText.textContent = str;
  lineWrap.hidden = false;
  input.value = "";
  input.focus();
}

function finish() {
  finished = true;
  lineWrap.hidden = true;
  input.blur();
  runBtn.disabled = false;
  runBtn.textContent = "▶ Run again";
}

function nextStep() {
  if (stepIndex === 0) {
    showPrompt("Type 'encode' to scramble, type 'decode' to unscramble:\n> ");
  } else if (stepIndex === 1) {
    showPrompt("Type your message:\n> ");
  } else if (stepIndex === 2) {
    showPrompt("Type the rotation number:\n> ");
  } else if (stepIndex === 3) {
    showPrompt("Type 'yes' to go again, or 'no' to quit.\n> ");
  }
}

function handleEnter(event) {
  if (event.key !== "Enter") return;
  if (finished) return;

  const raw = input.value.trim();
  if (raw === "") return;

  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  if (stepIndex === 0) {
    direction = raw.toLowerCase();
    stepIndex = 1;
    nextStep();

  } else if (stepIndex === 1) {
    text = raw.toLowerCase();
    stepIndex = 2;
    nextStep();

  } else if (stepIndex === 2) {
    const shift = parseInt(raw, 10);
    if (isNaN(shift)) {
      printLine("Please enter a whole number.");
      showPrompt("Type the rotation number:\n> ");
      return;
    }
    const result = signalCipher(text, shift, direction);
    // Replicates: print(f"Here is the {encode_or_decode}d signal: {output_text}")
    printLine(`Here is the ${direction}d signal: ${result}`, "result-line");
    stepIndex = 3;
    nextStep();

  } else if (stepIndex === 3) {
    const restart = raw.toLowerCase();
    if (restart === "no") {
      // Replicates: print("Transmission ended.")
      printLine("Transmission ended.");
      finish();
    } else {
      // Loop back — replicates: while should_continue
      stepIndex = 0;
      nextStep();
    }
  }
}

function startDemo() {
  output.innerHTML = "";
  stepIndex = 0;
  direction = '';
  text = '';
  finished = false;
  runBtn.disabled = true;

  // Replicates: print(signal_art.logo)
  printLine(logo);
  nextStep();
}

runBtn.addEventListener("click", startDemo);
input.addEventListener("keydown", handleEnter);
