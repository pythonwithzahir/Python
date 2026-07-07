const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

const logo = `
                         ___________
                         \\         /
                          )_______( 
                          |"""""""|_.-._,.---------.,_.-._
                          |       | | |               | | ''-.
                          |       |_| |_             _| |_..-'
                          |_______| '-' \`---------\` '-'
                          )"""""""""(
                         /_________\\
                       .-------------.
                      /_______________\\`;

// Game state — mirrors solution.py variables exactly
let bids = {};       // the bids dictionary
let step = 0;        // 0=name, 1=bid, 2=continue
let currentName = '';
let finished = false;

// Replicates find_highest_bidder(bidding_record) from solution.py exactly
function findHighestBidder(biddingRecord) {
  let highestBid = 0;
  let winner = '';
  for (const bidder in biddingRecord) {
    const bidAmount = biddingRecord[bidder];
    if (bidAmount > highestBid) {
      highestBid = bidAmount;
      winner = bidder;
    }
  }
  return `The winner is ${winner} with a bid of $${highestBid}`;
}

function printLine(text, cls) {
  // Split on newlines so multi-line strings render correctly
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

function nextStep() {
  if (step === 0) {
    showPrompt('What is your name?: ');
  } else if (step === 1) {
    showPrompt('What is your bid?: $');
  } else if (step === 2) {
    showPrompt("Are there any other bidders? Type 'yes' or 'no'.\n> ");
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
    // Replicates: name = input("What is your name?: ")
    currentName = raw;
    step = 1;
    nextStep();

  } else if (step === 1) {
    // Replicates: price = int(input("What is your bid?: $"))
    const price = parseInt(raw, 10);
    if (isNaN(price) || price < 0) {
      printLine('Please enter a positive whole number.');
      showPrompt('What is your bid?: $');
      return;
    }
    // Replicates: bids[name] = price
    bids[currentName] = price;
    step = 2;
    nextStep();

  } else if (step === 2) {
    // Replicates: should_continue = input(...)
    const shouldContinue = raw.toLowerCase();

    if (shouldContinue === 'no') {
      // Replicates: find_highest_bidder(bids)
      const result = findHighestBidder(bids);
      printLine(result, 'result-line');
      finish();

    } else if (shouldContinue === 'yes') {
      // Replicates: print("\n" * 20) — scroll clear effect
      printLine('--- New bidder ---');
      step = 0;
      currentName = '';
      nextStep();

    } else {
      printLine("Please type 'yes' or 'no'.");
      showPrompt("Are there any other bidders? Type 'yes' or 'no'.\n> ");
    }
  }
}

function startDemo() {
  output.innerHTML = '';
  bids = {};
  step = 0;
  currentName = '';
  finished = false;
  runBtn.disabled = true;

  // Replicates: print(logo)
  printLine(logo);
  nextStep();
}

runBtn.addEventListener('click', startDemo);
input.addEventListener('keydown', handleEnter);
