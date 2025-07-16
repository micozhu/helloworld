const LOVE_LANGUAGES = [
  "Words of Affirmation",
  "Acts of Service",
  "Receiving Gifts",
  "Quality Time",
  "Physical Touch"
];

// Provide a storage object even if localStorage is unavailable (e.g. in Node)
const STORAGE = (typeof localStorage !== 'undefined') ? localStorage : (() => {
  let store = {};
  return {
    getItem: key => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: key => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

const QUESTIONS = [
  {
    text: "Which action would make you feel most loved?",
    options: [
      "Hearing someone tell you how much they appreciate you",
      "Having someone help you with chores or tasks",
      "Receiving a thoughtful present",
      "Spending uninterrupted time together",
      "Getting a warm hug"
    ]
  },
  {
    text: "What do you value most when in a relationship?",
    options: [
      "Encouraging words",
      "Helpful gestures",
      "Surprise gifts",
      "Doing fun things together",
      "Physical closeness"
    ]
  },
  {
    text: "If you had a bad day, what would cheer you up most?",
    options: [
      "A heartfelt compliment",
      "Someone doing you a favor",
      "A small token of affection",
      "Quality time with a friend",
      "A comforting touch"
    ]
  },
  {
    text: "Which scenario sounds best?",
    options: [
      "Receiving a sincere thank you",
      "Someone running an errand for you",
      "A surprise gift from a loved one",
      "A walk or talk with someone you care about",
      "Holding hands"
    ]
  },
  {
    text: "You most often show love by...",
    options: [
      "Telling people supportive things",
      "Doing tasks for others",
      "Buying or making gifts",
      "Hanging out together",
      "Offering hugs"
    ]
  }
];

function loadStats() {
  const saved = STORAGE.getItem('ll_stats');
  if (saved) return JSON.parse(saved);
  const top = {};
  LOVE_LANGUAGES.forEach(l => top[l] = 0);
  return {tests:0, top_counts:top};
}

function saveStats(stats) {
  STORAGE.setItem('ll_stats', JSON.stringify(stats));
}

function buildQuiz() {
  const quizDiv = document.getElementById('quiz');
  QUESTIONS.forEach((q, qi) => {
    const div = document.createElement('div');
    div.className = 'question';
    const p = document.createElement('p');
    p.textContent = q.text;
    div.appendChild(p);
    q.options.forEach((opt, oi) => {
      const label = document.createElement('label');
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'q' + qi;
      input.value = oi;
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + opt));
      div.appendChild(label);
      div.appendChild(document.createElement('br'));
    });
    quizDiv.appendChild(div);
  });
}

function computeScores() {
  const scores = {};
  LOVE_LANGUAGES.forEach(l => scores[l] = 0);
  for (let i=0;i<QUESTIONS.length;i++) {
    const val = document.querySelector(`input[name=q${i}]:checked`);
    if (!val) return null; // unanswered
    scores[LOVE_LANGUAGES[parseInt(val.value)]] += 1;
  }
  return scores;
}

function computeCompatibility(a, b) {
  const maxScore = QUESTIONS.length;
  let diff = 0;
  LOVE_LANGUAGES.forEach(l => {
    diff += Math.abs((a[l]||0) - (b[l]||0));
  });
  const maxTotal = maxScore * LOVE_LANGUAGES.length;
  return Math.max(0, 100 - Math.round((diff / maxTotal) * 100));
}

function showResults(scores) {
  const share = JSON.stringify(scores);
  document.getElementById('shareCode').value = share;
  let text = '';
  for (const l of LOVE_LANGUAGES) {
    text += `${l}: ${scores[l]}\n`;
  }
  const topLang = LOVE_LANGUAGES.reduce((a,b)=> scores[a]>scores[b]?a:b);
  text += `\nYour primary love language is: ${topLang}`;
  document.getElementById('scores').textContent = text;

  const stats = loadStats();
  stats.tests += 1;
  stats.top_counts[topLang] += 1;
  saveStats(stats);
  updateStatsDisplay(stats);

  document.getElementById('result').style.display = 'block';
  window.scrollTo(0, document.body.scrollHeight);
}

function updateStatsDisplay(stats) {
  document.getElementById('statTests').textContent = stats.tests;
  const list = document.getElementById('statTop');
  list.innerHTML = '';
  for (const l of LOVE_LANGUAGES) {
    const li = document.createElement('li');
    li.textContent = `${l}: ${stats.top_counts[l]}`;
    list.appendChild(li);
  }
}

function setupEvents() {
  document.getElementById('submit').addEventListener('click', () => {
    const scores = computeScores();
    if (!scores) { alert('Please answer all questions.'); return; }
    showResults(scores);
  });

  document.getElementById('copyCode').addEventListener('click', () => {
    const txt = document.getElementById('shareCode');
    txt.select();
    document.execCommand('copy');
    alert('Share code copied! Paste it to your friend in WeChat.');
  });

  document.getElementById('computeCompat').addEventListener('click', () => {
    try {
      const friend = JSON.parse(document.getElementById('friendCode').value);
      const mine = JSON.parse(document.getElementById('shareCode').value);
      const score = computeCompatibility(mine, friend);
      document.getElementById('compatibilityScore').textContent = `Compatibility score: ${score}%`;
    } catch(e) {
      alert('Invalid friend code.');
    }
  });
}

function init() {
  buildQuiz();
  setupEvents();
  const stats = loadStats();
  updateStatsDisplay(stats);
}

document.addEventListener('DOMContentLoaded', init);
