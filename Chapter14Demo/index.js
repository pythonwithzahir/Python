const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

const logo = `    __  ___       __             
   / / / (_)___ _/ /_  ___  _____
  / /_/ / / __ \`/ __ \\/ _ \\/ ___/
 / __  / / /_/ / / / /  __/ /    
/_/ /_/_/\\__, /_/ /_/\\___/_/     
   / /  /____/_      _____  _____
  / /   / __ \\ | /| / / _ \\/ ___/
 / /___/ /_/ / |/ |/ /  __/ /    
/_____/\\____/|__/|__/\\___/_/`;

const vs = `
 _    __    
| |  / /____
| | / / ___/
| |/ (__  ) 
|___/____(_)`;

// Subset of game_data.py — enough for a good game
const data = [
  { name: 'Instagram', follower_count: 346, description: 'Social media platform', country: 'United States' },
  { name: 'Cristiano Ronaldo', follower_count: 215, description: 'Footballer', country: 'Portugal' },
  { name: 'Ariana Grande', follower_count: 183, description: 'Musician and actress', country: 'United States' },
  { name: 'Dwayne Johnson', follower_count: 181, description: 'Actor and professional wrestler', country: 'United States' },
  { name: 'Selena Gomez', follower_count: 174, description: 'Musician and actress', country: 'United States' },
  { name: 'Kylie Jenner', follower_count: 166, description: 'Reality TV personality and businesswoman', country: 'United States' },
  { name: 'Kim Kardashian', follower_count: 163, description: 'Reality TV personality and businesswoman', country: 'United States' },
  { name: 'Lionel Messi', follower_count: 160, description: 'Footballer', country: 'Argentina' },
  { name: 'Beyoncé', follower_count: 141, description: 'Musician and actress', country: 'United States' },
  { name: 'National Geographic', follower_count: 138, description: 'Nature and science magazine', country: 'United States' },
  { name: 'Taylor Swift', follower_count: 136, description: 'Musician', country: 'United States' },
  { name: 'Neymar', follower_count: 134, description: 'Footballer', country: 'Brazil' },
  { name: 'Khloe Kardashian', follower_count: 97, description: 'Reality TV personality and businesswoman', country: 'United States' },
  { name: 'Rihanna', follower_count: 90, description: 'Musician and businesswoman', country: 'Barbados' },
  { name: 'Shakira', follower_count: 80, description: 'Musician', country: 'Colombia' },
];

// Replicates format_data(account) from solution.py
function formatData(account) {
  return `${account.name}, a ${account.description}, from ${account.country}`;
}

// Replicates check_answer(user_guess, a_followers, b_followers) from solution.py
function checkAnswer(userGuess, aFollowers, bFollowers) {
  if (aFollowers > bFollowers) return userGuess === 'a';
  return userGuess === 'b';
}

function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let score, gameShouldContinue, accountA, accountB, finished;

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

function showRound() {
  // Replicates: account_a = account_b; account_b = random.choice(data)
  accountA = accountB;
  accountB = randChoice(data);
  if (accountA === accountB) accountB = randChoice(data);

  printLine(`Compare A: ${formatData(accountA)}.`);
  printLine(vs);
  printLine(`Against B: ${formatData(accountB)}.`);
  showPrompt("Who has more followers? Type 'A' or 'B': ");
}

function handleEnter(event) {
  if (event.key !== 'Enter') return;
  if (finished) return;

  const raw = input.value.trim();
  if (!raw) return;

  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  const guess = raw.toLowerCase();
  // Replicates: print("\n" * 20); print(logo)
  printLine('- - - - - - - - - -');
  printLine(logo);

  const isCorrect = checkAnswer(guess, accountA.follower_count, accountB.follower_count);

  if (isCorrect) {
    score++;
    printLine(`You're right! Current score: ${score}`, 'result-line');
    showRound();
  } else {
    printLine(`Sorry, that's wrong. Final score: ${score}.`, 'lose-line');
    finish();
  }
}

function startDemo() {
  output.innerHTML = '';
  score = 0;
  gameShouldContinue = true;
  finished = false;
  runBtn.disabled = true;

  // Replicates: print(logo); account_b = random.choice(data)
  printLine(logo);
  accountB = randChoice(data);
  showRound();
}

// Add lose-line style dynamically
const style = document.createElement('style');
style.textContent = '.lose-line { color: #ff7b72; }';
document.head.appendChild(style);

runBtn.addEventListener('click', startDemo);
input.addEventListener('keydown', handleEnter);
