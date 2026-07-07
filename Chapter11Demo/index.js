const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

const logo = `.------.            _     _            _    _            _    
|A_  _ |.          | |   | |          | |  (_)          | |   
|( \\/ ).-----.     | |__ | | __ _  ___| | ___  __ _  ___| | __
| \\  /|K /\\  |     | '_  | |/ _  |/ __| |/ / |/ _  |/ __| |/ /
|  \\/ | /  \\ |     | |_) | | (_| | (__|   <| | (_| | (__|   < 
\`-----| \\  / |     |_.__/|_|\\__,_|\\___|_|\\_\\ |\\__,_|\\___|_|\\_\\
      |  \\/ K|                            _/ |                
      \`------'                           |__/`;

// Replicates cards list from deal_card() in solution.py
const CARDS = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

// Replicates deal_card() exactly
function dealCard() {
  return CARDS[Math.floor(Math.random() * CARDS.length)];
}

// Replicates calculate_score() exactly
function calculateScore(cards) {
  const c = [...cards];
  if (c.reduce((a, b) => a + b, 0) === 21 && c.length === 2) return 0;
  const idx = c.indexOf(11);
  if (idx !== -1 && c.reduce((a, b) => a + b, 0) > 21) {
    c.splice(idx, 1);
    c.push(1);
  }
  return c.reduce((a, b) => a + b, 0);
}

// Replicates compare() exactly — all 7 outcomes
function compare(uScore, cScore) {
  if (uScore === cScore) return "Draw";
  if (cScore === 0) return "Lose, opponent has Blackjack";
  if (uScore === 0) return "Win with a Blackjack";
  if (uScore > 21) return "You went over. You lose";
  if (cScore > 21) return "Opponent went over. You win";
  if (uScore > cScore) return "You win";
  return "You lose";
}

// Game state
let userCards, computerCards, isGameOver, finished, awaitingRestart;

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

function endSession() {
  finished = true;
  lineWrap.hidden = true;
  input.blur();
  runBtn.disabled = false;
  runBtn.textContent = '▶ Run again';
}

// Replicates the dealer while loop: while computer_score != 0 and computer_score < 17
function runDealerLoop(computerCardsCopy) {
  let cs = calculateScore(computerCardsCopy);
  while (cs !== 0 && cs < 17) {
    computerCardsCopy.push(dealCard());
    cs = calculateScore(computerCardsCopy);
  }
  return { cards: computerCardsCopy, score: cs };
}

function finishGame() {
  const userScore = calculateScore(userCards);
  const { cards: finalComputer, score: compScore } = runDealerLoop([...computerCards]);
  printLine(`Your final hand: [${userCards}], final score: ${userScore}`);
  printLine(`Computer's final hand: [${finalComputer}], final score: ${compScore}`);
  const result = compare(userScore, compScore);
  const isWin = result.includes('win') || result.includes('Win');
  const isLose = result.includes('lose') || result.includes('Lose') || result.includes('went over');
  printLine(result, isWin ? 'result-line' : isLose ? 'lose-line' : 'terminal-output-line');
  // Ask to play again
  awaitingRestart = true;
  showPrompt("Do you want to play a game of Blackjack? Type 'y' or 'n': ");
}

function startNewGame() {
  userCards = [];
  computerCards = [];
  isGameOver = false;
  awaitingRestart = false;

  printLine(logo);

  // Deal 2 cards each (for _ in range(2))
  for (let i = 0; i < 2; i++) {
    userCards.push(dealCard());
    computerCards.push(dealCard());
  }

  runPlayerTurn();
}

function runPlayerTurn() {
  const userScore = calculateScore([...userCards]);
  const compScore = calculateScore([...computerCards]);

  printLine(`Your cards: [${userCards}], current score: ${userScore}`);
  printLine(`Computer's first card: ${computerCards[0]}`);

  // Replicates: if user_score == 0 or computer_score == 0 or user_score > 21
  if (userScore === 0 || compScore === 0 || userScore > 21) {
    isGameOver = true;
    finishGame();
    return;
  }

  showPrompt("Type 'y' to get another card, type 'n' to pass: ");
}

function handleEnter(event) {
  if (event.key !== 'Enter') return;
  if (finished) return;

  const raw = input.value.trim().toLowerCase();
  if (!raw) return;

  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  if (awaitingRestart) {
    if (raw === 'y') {
      printLine('\n'.repeat(3));
      startNewGame();
    } else {
      endSession();
    }
    return;
  }

  if (raw === 'y') {
    userCards.push(dealCard());
    runPlayerTurn();
  } else {
    isGameOver = true;
    finishGame();
  }
}

function startDemo() {
  output.innerHTML = '';
  finished = false;
  awaitingRestart = false;
  runBtn.disabled = true;
  // Replicates: while input(...) == "y": play_game()
  awaitingRestart = true;
  showPrompt("Do you want to play a game of Blackjack? Type 'y' or 'n': ");
}

runBtn.addEventListener('click', startDemo);
input.addEventListener('keydown', handleEnter);
