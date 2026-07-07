// Three bugs from the chapter — one per debugging technique
const questions = [
  {
    label: "Bug 1 — Describe the Problem",
    code: `def my_function():
    for i in range(1, 20):
        if i == 20:
            print("You got it")

my_function()`,
    options: [
      { text: 'range(1, 20) never produces 20 — upper bound is exclusive', correct: true },
      { text: 'The if condition should use != instead of ==', correct: false },
      { text: 'The function is never called', correct: false },
      { text: 'print needs an f-string here', correct: false },
    ],
    explanation: 'Correct! range(1, 20) produces 1 through 19. The fix is range(1, 21).',
  },
  {
    label: "Bug 2 — Play Computer",
    code: `year = int(input("What's your year of birth?"))

if year > 1980 and year < 1994:
    print("You are a millennial.")
elif year > 1994:
    print("You are a Gen Z.")`,
    options: [
      { text: 'The and operator should be or', correct: false },
      { text: "Year 1994 falls through both conditions — neither branch catches it", correct: true },
      { text: 'The elif is unreachable because of the if condition', correct: false },
      { text: 'year > 1980 should be year >= 1980', correct: false },
    ],
    explanation: 'Correct! 1994 is not > 1994, and not < 1994. Fix: change year > 1994 to year >= 1994.',
  },
  {
    label: "Bug 3 — Use Print",
    code: `word_per_page = 0
pages = int(input("Number of pages: "))
word_per_page == int(input("Words per page: "))
total_words = pages * word_per_page
print(total_words)`,
    options: [
      { text: 'pages should be initialized to 0 before input', correct: false },
      { text: 'total_words should use + not *', correct: false },
      { text: '== is a comparison, not assignment — word_per_page stays 0', correct: true },
      { text: 'int() cannot accept input() directly', correct: false },
    ],
    explanation: 'Correct! == asks "is this equal?" and discards the result. Fix: change == to = on line 3.',
  },
];

let score = 0;
let answered = 0;

function updateScore() {
  document.getElementById('score-display').textContent = `Score: ${score} / ${questions.length}`;
}

function render() {
  const container = document.getElementById('questions');
  questions.forEach((q, qi) => {
    const card = document.createElement('div');
    card.className = 'bug-card';
    card.innerHTML = `
      <div class="bug-label">${q.label}</div>
      <pre>${q.code}</pre>
      <div class="options" id="opts-${qi}">
        ${q.options.map((opt, oi) =>
          `<button class="opt-btn" data-qi="${qi}" data-oi="${oi}" onclick="choose(${qi},${oi})">${opt.text}</button>`
        ).join('')}
      </div>
      <div class="feedback" id="fb-${qi}"></div>
    `;
    container.appendChild(card);
  });
}

function choose(qi, oi) {
  const q = questions[qi];
  const opts = document.querySelectorAll(`#opts-${qi} .opt-btn`);
  const fb = document.getElementById(`fb-${qi}`);

  // Disable all buttons for this question
  opts.forEach(b => { b.disabled = true; b.onclick = null; });

  if (q.options[oi].correct) {
    opts[oi].classList.add('correct');
    fb.style.color = '#a6e3a1';
    fb.textContent = '✓ ' + q.explanation;
    score++;
  } else {
    opts[oi].classList.add('wrong');
    fb.style.color = '#f38ba8';
    // Highlight correct answer
    q.options.forEach((opt, i) => { if (opt.correct) opts[i].classList.add('correct'); });
    fb.textContent = '✗ Not quite. The highlighted option shows the correct bug.';
  }

  answered++;
  updateScore();
}

render();
updateScore();
