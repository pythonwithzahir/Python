const runBtn = document.getElementById("run-btn");
const output = document.getElementById("terminal-output");
const lineWrap = document.getElementById("terminal-line");
const promptText = document.getElementById("prompt-text");
const input = document.getElementById("terminal-input");

// ── MenuItem class ──────────────────────────────────────────
class MenuItem {
  constructor(name, water, milk, coffee, cost) {
    this.name = name;
    this.cost = cost;
    this.ingredients = { water, milk, coffee };
  }
}

// ── Menu class ───────────────────────────────────────────────
class Menu {
  constructor() {
    this.espresso   = new MenuItem("espresso",   50,   0,  18, 1.5);
    this.latte      = new MenuItem("latte",      200, 150,  24, 2.5);
    this.cappuccino = new MenuItem("cappuccino", 250, 100,  24, 3.0);
  }
  getItems() {
    return Object.keys(this).join("/") + "/";
  }
  findDrink(orderName) {
    return this[orderName] || null;
  }
}

// ── CoffeeMaker class ────────────────────────────────────────
class CoffeeMaker {
  constructor() {
    this.resources = { water: 300, milk: 200, coffee: 100 };
  }
  report() {
    printLine(`Water: ${this.resources.water}ml`);
    printLine(`Milk: ${this.resources.milk}ml`);
    printLine(`Coffee: ${this.resources.coffee}g`);
  }
  isResourceSufficient(drink) {
    for (const item in drink.ingredients) {
      if (drink.ingredients[item] > (this.resources[item] || 0)) {
        printLine(`Sorry there is not enough ${item}.`, 'lose-line');
        return false;
      }
    }
    return true;
  }
  makeCoffee(order) {
    for (const item in order.ingredients) {
      this.resources[item] -= order.ingredients[item];
    }
    printLine(`Here is your ${order.name} ☕️. Enjoy!`, 'result-line');
  }
}

// ── MoneyMachine class ───────────────────────────────────────
class MoneyMachine {
  constructor() {
    this.profit = 0;
    this.moneyReceived = 0;
    this._coinValues = { quarters: 0.25, dimes: 0.1, nickels: 0.05, pennies: 0.01 };
    this._coinQueue = [];
    this._currentCoinIndex = 0;
    this._currentCost = 0;
    this._onPaymentDone = null;
  }
  report() {
    printLine(`Money: $${this.moneyReceived || this.profit}`);
  }
  // Async coin collection — prompts for each coin type in sequence
  makePayment(cost, onResult) {
    this._currentCost = cost;
    this._onPaymentDone = onResult;
    this.moneyReceived = 0;
    this._currentCoinIndex = 0;
    printLine('Please insert coins.');
    this._promptNextCoin();
  }
  _promptNextCoin() {
    const coins = Object.keys(this._coinValues);
    if (this._currentCoinIndex < coins.length) {
      showPrompt(`How many ${coins[this._currentCoinIndex]}?: `);
    } else {
      this._finishPayment();
    }
  }
  enterCoinCount(n) {
    const coins = Object.keys(this._coinValues);
    const coin = coins[this._currentCoinIndex];
    this.moneyReceived += n * this._coinValues[coin];
    this._currentCoinIndex++;
    this._promptNextCoin();
  }
  _finishPayment() {
    const cost = this._currentCost;
    if (this.moneyReceived >= cost) {
      const change = Math.round((this.moneyReceived - cost) * 100) / 100;
      printLine(`Here is $${change.toFixed(2)} in change.`);
      this.profit += cost;
      this.moneyReceived = 0;
      this._onPaymentDone(true);
    } else {
      printLine("Sorry that's not enough money. Money refunded.", 'lose-line');
      this.moneyReceived = 0;
      this._onPaymentDone(false);
    }
  }
}

// ── Game state ───────────────────────────────────────────────
let moneyMachine, coffeeMaker, menu, isOn, currentDrink, collectingCoins, finished;

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

function promptMain() {
  collectingCoins = false;
  const options = menu.getItems();
  showPrompt(`What would you like? (${options}): `);
}

function handleEnter(event) {
  if (event.key !== 'Enter') return;
  if (finished) return;

  const raw = input.value.trim();
  if (!raw) return;
  printLine(promptText.textContent + raw);
  lineWrap.hidden = true;

  if (collectingCoins) {
    const n = parseInt(raw, 10);
    if (isNaN(n) || n < 0) { printLine('Please enter a whole number.'); showPrompt(promptText.textContent); return; }
    moneyMachine.enterCoinCount(n);
    return;
  }

  const choice = raw.toLowerCase();

  if (choice === 'off') {
    printLine('Machine off.');
    endSession();
    return;
  }
  if (choice === 'report') {
    coffeeMaker.report();
    moneyMachine.report();
    promptMain();
    return;
  }

  const drink = menu.findDrink(choice);
  if (!drink) {
    printLine(`"${raw}" is not on the menu.`);
    promptMain();
    return;
  }

  if (!coffeeMaker.isResourceSufficient(drink)) {
    promptMain();
    return;
  }

  currentDrink = drink;
  collectingCoins = true;
  moneyMachine.makePayment(drink.cost, (success) => {
    if (success) coffeeMaker.makeCoffee(currentDrink);
    promptMain();
  });
}

function startDemo() {
  output.innerHTML = '';
  moneyMachine = new MoneyMachine();
  coffeeMaker  = new CoffeeMaker();
  menu         = new Menu();
  isOn         = true;
  finished     = false;
  collectingCoins = false;
  runBtn.disabled = true;
  promptMain();
}

runBtn.addEventListener('click', startDemo);
input.addEventListener('keydown', handleEnter);
