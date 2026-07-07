const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

// Word list matching game_words.py
const wordList = [
  "agent", "cipher", "signal", "radar", "covert",
  "decode", "stealth", "vector", "target", "sector",
  "breach", "decrypt", "protocol", "frequency",
  "encrypt", "mission", "pursuit", "network", "shadow",
  "bunker", "station", "contact", "channel", "archive",
  "access", "secure", "silent", "recon", "intercept"
];

// Stages matching game_art.py — stages[lives]
const stages = [
  // 0 — destroyed
  ` x     x\n  x   x\n   xxx\n    |\n  __|__\n /xxxxx\\\n/xxxxxxx\\\n  |||||`,
  // 1 — collapsed
  `    |\n  __|__\n /=====\\___\n/=========\\\n  |||||`,
  // 2 — cracked
  `    |\n  __|__\n / ~~~ \\\n/~~~~~~~\\\n   ||||\n  /||||\\`,
  // 3 — mast bent
  `   \\|\n  __|__\n /     \\\n/~~~~~~~\\\n   |||||\n  /|||||\\`,
  // 4 — weak signal
  `    |\n  __|__\n /     \\\n/~~~~~~~\\\n   |||||\n  /|||||\\`,
  // 5 — building
  `    .\n    |\n  __|__\n /     \\\n/~~~~~~~\\\n   |||||\n  /|||||\\`,
  // 6 — fully operational
  `   )))\n    |\n  __|__\n /     \\\n/~~~~~~~\\\n   |||||\n  /|||||\\\n / ||||| \\`
];

const logo = `  _____ ______   __  _____ ___  ____  ____
 / ____|  _ \\ \\ / / / ____/ _ \\|  _ \\| ___|
| |    | |_) \\ V / | |   | | | | | | |  __|
| |___ |  _ < | |  | |___| |_| | |_| | |___
 \\____|_| \\_\\|_|   \\____|\\___/|____/|_____|
       S P Y   C O D E   C R A C K E R`;

let chosenWord, display, lives, gameOver, correctLetters, finished;

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
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

function renderRound() {
  // Matches: print(f"\n{'*'*10} {lives}/6 SIGNALS REMAINING {'*'*10}")
  printLine(`\n${'*'.repeat(10)} ${lives}/6 SIGNALS REMAINING ${'*'.repeat(10)}`);
  // Matches: print(stages[lives])
  printLine(stages[lives]);
  // Matches: print("Current code: " + " ".join(display))
  printLine("Current code: " + display.join(" "));
  // Matches: input("Intercept a letter: ").lower()
  showPrompt("Intercept a letter: ");
}

function handleEnter(event) {
  if (event.key !== "Enter") return;
  if (finished || gameOver) return;

  const raw = input.value.trim();
  if (raw === "" || raw.length !== 1) return;

  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  // Replicates .lower().strip()
  const guess = raw.toLowerCase();

  // Replicates: if guess in correct_letters
  if (correctLetters.includes(guess)) {
    printLine(`You already intercepted '${guess}'.`);
  } else {
    correctLetters.push(guess);

    // Replicates: for position in range(word_length): if letter == guess or letter in correct_letters
    for (let position = 0; position < chosenWord.length; position++) {
      const letter = chosenWord[position];
      if (letter === guess || correctLetters.includes(letter)) {
        display[position] = letter;
      }
    }

    // Replicates: if guess not in chosen_word
    if (!chosenWord.includes(guess)) {
      printLine(`'${guess}' is not in the code. You lose a signal.`, "lose-line");
      lives--;
      if (lives === 0) {
        gameOver = true;
        printLine(stages[0]);
        printLine(`\nSIGNAL LOST. The code was: ${chosenWord.toUpperCase()}`, "lose-line");
        finish();
        return;
      }
    }
  }

  // Replicates: if "_" not in display
  if (!display.includes("_")) {
    gameOver = true;
    printLine(`\nCODE CRACKED: ${display.join(" ")}`, "result-line");
    printLine("Mission accomplished!", "result-line");
    finish();
    return;
  }

  renderRound();
}

function startGame() {
  output.innerHTML = "";
  chosenWord = randChoice(wordList);
  display = Array.from({ length: chosenWord.length }, () => "_");
  lives = 6;
  gameOver = false;
  correctLetters = [];
  finished = false;
  runBtn.disabled = true;

  // Replicates: print(logo) then print("Intercepting transmission...")
  printLine(logo);
  printLine("Intercepting transmission...");
  printLine(`The code word has ${chosenWord.length} letters.`);

  renderRound();
}

runBtn.addEventListener("click", startGame);
input.addEventListener("keydown", handleEnter);
