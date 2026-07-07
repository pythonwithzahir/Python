const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

// Replicates MENU dict from solution.py exactly
const MENU = {
  espresso: { ingredients: { water: 50, coffee: 18 }, cost: 1.5 },
  latte:    { ingredients: { water: 200, milk: 150, coffee: 24 }, cost: 2.5 },
  cappuccino:{ ingredients: { water: 250, milk: 100, coffee: 24 }, cost: 3.0 },
};

// Replicates starting resources and profit from solution.py
let resources = { water: 300, milk: 200, coffee: 100 };
let profit = 0;

// Game state machine
// steps: 'main' | 'coins_quarters' | 'coins_dimes' | 'coins_nickles' | 'coins_pennies'
let step, currentDrink, coinQuarters, coinDimes, coinNickles, finished;

// Replicates is_resource_sufficient(order_ingredients) from solution.py
function isResourceSufficient(orderIngredients) {
  for (const item in orderIngredients) {
    if (orderIngredients[item] > (resources[item] || 0)) {
      printLine(`Sorry there is not enough ${item}.`, 'lose-line');
      return false;
    }
  }
  return true;
}

// Replicates is_transaction_successful(money_received, drink_cost) from solution.py
function isTransactionSuccessful(moneyReceived, drinkCost) {
  if (moneyReceived >= drinkCost) {
    const change = Math.round((moneyReceived - drinkCost) * 100) / 100;
    printLine(`Here is $${change.toFixed(2)} in change.`);
    profit += drinkCost;
    return true;
  } else {
    printLine("Sorry that's not enough money. Money refunded.", 'lose-line');
    return false;
  }
}

// Replicates make_coffee(drink_name, order_ingredients) from solution.py
function makeCoffee(drinkName, orderIngredients) {
  for (const item in orderIngredients) {
    resources[item] -= orderIngredients[item];
  }
  printLine(`Here is your ${drinkName} ☕️. Enjoy!`, 'result-line');
}

function printLine(text, cls) {
  const div = document.createElement('div');
  div.className = cls || 'terminal-output-line';
  div.textContent = text;
  output.appendChild(div);
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

function showMain() {
  step = 'main';
  showPrompt('What would you like? (espresso/latte/cappuccino): ');
}

function handleEnter(event) {
  if (event.key !== 'Enter') return;
  if (finished) return;

  const raw = input.value.trim();
  if (!raw) return;

  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  const val = raw.toLowerCase();

  // ---- MAIN PROMPT ----
  if (step === 'main') {
    if (val === 'off') {
      printLine('Machine off.');
      endSession();
      return;
    }
    if (val === 'report') {
      // Replicates: print(f"Water: {resources['water']}ml") etc.
      printLine(`Water: ${resources.water}ml`);
      printLine(`Milk: ${resources.milk}ml`);
      printLine(`Coffee: ${resources.coffee}g`);
      printLine(`Money: $${profit.toFixed(2)}`);
      showMain();
      return;
    }
    if (!MENU[val]) {
      printLine(`"${raw}" is not on the menu. Try espresso, latte, or cappuccino.`);
      showMain();
      return;
    }
    currentDrink = val;
    // Check resources before asking for coins
    if (!isResourceSufficient(MENU[val].ingredients)) {
      showMain();
      return;
    }
    // Replicates: print("Please insert coins.")
    printLine('Please insert coins.');
    step = 'coins_quarters';
    coinQuarters = 0; coinDimes = 0; coinNickles = 0;
    showPrompt('how many quarters?: ');
    return;
  }

  // ---- COIN STEPS ----
  const n = parseInt(val, 10);
  if (isNaN(n) || n < 0) {
    printLine('Please enter a whole number.');
    showPrompt(promptText.textContent);
    return;
  }

  if (step === 'coins_quarters') {
    coinQuarters = n;
    step = 'coins_dimes';
    showPrompt('how many dimes?: ');
    return;
  }
  if (step === 'coins_dimes') {
    coinDimes = n;
    step = 'coins_nickles';
    showPrompt('how many nickles?: ');
    return;
  }
  if (step === 'coins_nickles') {
    coinNickles = n;
    step = 'coins_pennies';
    showPrompt('how many pennies?: ');
    return;
  }
  if (step === 'coins_pennies') {
    const coinPennies = n;
    // Replicates: total = quarters*0.25 + dimes*0.1 + nickles*0.05 + pennies*0.01
    const total = coinQuarters * 0.25 + coinDimes * 0.1 + coinNickles * 0.05 + coinPennies * 0.01;
    const drink = MENU[currentDrink];
    if (isTransactionSuccessful(total, drink.cost)) {
      makeCoffee(currentDrink, drink.ingredients);
    }
    showMain();
  }
}

function startDemo() {
  output.innerHTML = '';
  // Reset to initial state matching solution.py
  resources = { water: 300, milk: 200, coffee: 100 };
  profit = 0;
  finished = false;
  runBtn.disabled = true;
  showMain();
}

runBtn.addEventListener('click', startDemo);
input.addEventListener('keydown', handleEnter);
