const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

// Replicates global constants from solution.py
const EASY_LEVEL_TURNS = 10;
const HARD_LEVEL_TURNS = 5;

const logo = `  / _ \\_   _  ___  ___ ___  /__   \\ |__   ___    /\\ \\ \\_   _ _ __ ___ | |__   ___ _ __ 
 / /_\\/ | | |/ _ \\/ __/ __|   / /\\/ '_  / _ \\  /  \\/ / | | | '_ \` _ \\| '_ \\ / _ \\ '__|
/ /_\\\\| |_| |  __/\\__ \\__ \\  / /  | | | |  __/ / /\\  /| |_| | | | | | | |_) |  __/ |   
\\____/ \\__,_|\\___||___/___/  \\/   |_| |_|\\___| \\_\\ \\/  \\__,_|_| |_| |_|_.__/ \\___|_|`;

// Game state
let answer, turns, guess, step, finished;
// step: 0=difficulty, 1=guess-loop

// Replicates check_answer(user_guess, actual_answer, turns) from solution.py
function checkAnswer(userGuess, actualAnswer, turnsLeft) {
  if (userGuess > actualAnswer) {
    printLine("Too high.");
    return turnsLeft - 1;
  } else if (userGuess < actualAnswer) {
    printLine("Too low.");
    return turnsLeft - 1;
  } else {
    printLine(`You got it! The answer was ${actualAnswer}`, 'result-line');
    return null; // correct — signal to stop
  }
}

// Replicates set_difficulty() — returns EASY or HARD turns
function setDifficulty(level) {
  if (level === 'easy') return EASY_LEVEL_TURNS;
  return HARD_LEVEL_TURNS;
}

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

function promptGuess() {
  // Replicates: print(f"You have {turns} attempts remaining...")
  printLine(`You have ${turns} attempts remaining to guess the number.`);
  showPrompt("Make a guess: ");
}

function handleEnter(event) {
  if (event.key !== 'Enter') return;
  if (finished) return;

  const raw = input.value.trim();
  if (!raw) return;

  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  if (step === 0) {
    // Replicates: set_difficulty()
    const level = raw.toLowerCase();
    turns = setDifficulty(level);
    step = 1;
    promptGuess();
    return;
  }

  // step === 1: guess loop
  const userGuess = parseInt(raw, 10);
  if (isNaN(userGuess)) {
    printLine("Please enter a whole number.");
    showPrompt("Make a guess: ");
    return;
  }

  // Replicates: turns = check_answer(guess, answer, turns)
  const result = checkAnswer(userGuess, answer, turns);

  if (result === null) {
    // Correct guess
    finish();
    return;
  }

  turns = result;

  // Replicates: if turns == 0: print("...you lose."); return
  if (turns === 0) {
    printLine("You've run out of guesses, you lose.", 'lose-line');
    finish();
    return;
  }

  // Replicates: elif guess != answer: print("Guess again.")
  printLine("Guess again.");
  promptGuess();
}

function startDemo() {
  output.innerHTML = '';
  // Replicates: answer = randint(1, 100)
  answer = Math.floor(Math.random() * 100) + 1;
  turns = 0;
  guess = 0;
  step = 0;
  finished = false;
  runBtn.disabled = true;

  // Replicates game() opening prints
  printLine(logo);
  printLine("Welcome to the Number Guessing Game!");
  printLine("I'm thinking of a number between 1 and 100.");

  // Replicates: turns = set_difficulty()
  showPrompt("Choose a difficulty. Type 'easy' or 'hard': ");
}

runBtn.addEventListener('click', startDemo);
input.addEventListener('keydown', handleEnter);
