// Board and game vars
const board = document.getElementById('board');
const boardSize = 3;
let currentPlayer = 'O';
let mode = 'current'; // Possible values: 'current', 'memory', 'extreme'
let score = { X: 0, O: 0 };
let translations = {};  // global storage for languages

// Buttons
const resetGameBtn = document.getElementById('resetGameBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const memoryToggle = document.getElementById('memoryToggle'); 

// Scores
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

// Moves
const moves = { X: [], O: [] };

// Winning combinations
const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Modal
const winnerModal = document.getElementById('winnerModal');
const winnerMessage = document.getElementById('winnerMessage');

// Win line
const winLine = document.getElementById('winLine');

function showWinLine(combo) {
  board.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('highlight');
  });
  combo.forEach(index => {
    const cell = board.children[index];
    cell.classList.add('highlight');
  });
}
//Check wins
function checkWin(playerMoves) {
  const indexes = playerMoves.map(m => m.index);
  for (const combo of winningCombos) {
    if (combo.every(i => indexes.includes(i))) {
      return combo;
    }
  }
  return null;
}

//Ends game
function endGame(winner) {
  score[winner]++;
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
  setTimeout(() => {
    showWinnerModal(winner);
  }, 800);
}

//pop up for winner
function showWinnerModal(winner) {
  const template = translations.winnerMessage || "{winner} wins! 🎉";
  const message = template.replace("{winner}", winner);
  winnerMessage.innerHTML = message;
  winnerModal.classList.remove('hidden');
}

//reset board
function resetBoard() {
  moves.X = [];
  moves.O = [];
  board.querySelectorAll('.cell').forEach(c => {
    c.textContent = '';
    c.classList.remove('highlight');
  });
  winLine.style.transform = 'scaleX(0)';
  currentPlayer = 'O';
}

//creates board
for (let i = 0; i < boardSize * boardSize; i++) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.dataset.index = i;
  board.appendChild(cell);
}

//event listener for turns
board.addEventListener('click', (e) => {
  const cell = e.target;
  if (!cell.classList.contains('cell')) return;

  const index = parseInt(cell.dataset.index);
  if (cell.textContent) return;

  const playerMoves = moves[currentPlayer];

  if (playerMoves.length === 3 && playerMoves[0].index === index) return;

  if (playerMoves.length === 3) {
    const oldest = playerMoves.shift();
    const oldCell = board.children[oldest.index];
    oldCell.textContent = '';
    oldCell.classList.remove('highlight');
  }

  cell.textContent = currentPlayer;
  playerMoves.push({ index });

  updateBoardHighlighting(); 

  if (playerMoves.length === 3) {
    const winningCombo = checkWin(playerMoves);
    if (winningCombo) {
      showWinLine(winningCombo);
      endGame(currentPlayer);
      return; // stop here if someone won
    }
  }

  //Always switch players if game is not over
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
});

// Score & Game control
resetScoreBtn.addEventListener('click', () => {
  score.X = 0;
  score.O = 0;
  scoreX.textContent = 0;
  scoreO.textContent = 0;
});

playAgainBtn.addEventListener('click', () => {
  resetBoard();
  winnerModal.classList.add('hidden');
});

resetGameBtn.addEventListener('click', () => {
  resetBoard();
});

memoryToggle.addEventListener('click', () => {
  // Cycle between modes
  if (mode === 'current') {
    mode = 'memory';
    memoryToggle.textContent = '🧠';
    memoryToggle.className = 'brain-floating-btn memory';
  } else if (mode === 'memory') {
    mode = 'extreme';
    memoryToggle.textContent = '💀';
    memoryToggle.className = 'brain-floating-btn extreme';
  } else {
    mode = 'current';
    memoryToggle.textContent = '🧠';
    memoryToggle.className = 'brain-floating-btn current';
  }

  updateBoardHighlighting();
});



function updateBoardHighlighting() {
  board.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));

  if (mode === 'extreme') return; // No highlights

  if (mode === 'memory') {
    ['X', 'O'].forEach(p => {
      const list = moves[p];
      if (list.length === 3) {
        const oldestIndex = list[0].index;
        board.children[oldestIndex].classList.add('highlight');
      }
    });
  } else if (mode === 'current') {
    const list = moves[currentPlayer];
    if (list.length === 3) {
      const oldestIndex = list[0].index;
      board.children[oldestIndex].classList.add('highlight');
    }
  }
}

//THEMES TOGGLE

document.addEventListener('DOMContentLoaded', () => {
  // Get the theme toggle button
  const themeToggleButton = document.getElementById('themeToggle');

  // Check if a theme is already saved in localStorage
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark'); // If dark theme is saved, apply it
  }

  // Toggle theme on button click
  themeToggleButton.addEventListener('click', () => {
    // Toggle the 'dark' class on the body element
    document.body.classList.toggle('dark');
    
    // Save the theme choice in localStorage
    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark'); // Save dark theme
    } else {
      localStorage.setItem('theme', 'light'); // Save light theme
    }
  });
});

// Load help modal from external HTML
fetch('help.html')
  .then(res => res.text())
  .then(html => {
    document.body.insertAdjacentHTML('beforeend', html);

    // Set up modal toggle logic once it's added to DOM
    const helpToggle = document.getElementById('helpToggle');
    const helpModal = document.getElementById('helpModal');
    const closeHelp = document.getElementById('closeHelp');

    helpToggle.addEventListener('click', () => {
      helpModal.classList.remove('hidden');
    });

    closeHelp.addEventListener('click', () => {
      helpModal.classList.add('hidden');
    });

    // Close modal on click outside content
    window.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        helpModal.classList.add('hidden');
      }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) {
        helpModal.classList.add('hidden');
      }
    });
  });

// Load language from JSON files
function loadLanguage(lang) {
  fetch(`lang/${lang}.json`)
    .then(res => res.json())
    .then(strings => {
      translations = strings;           // save for later
      applyTranslations();              // immediately translate data-i18n elements
      updateLanguageButton(lang);
    });
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) {
      el.innerHTML = translations[key];
    }
  });
}


// Update button with selected flag icon
function updateLanguageButton(lang) {
  const btn = document.getElementById('languageToggle');
  btn.classList.remove('en', 'es');
  btn.classList.add(lang);
}

// Language menu toggle logic
document.getElementById('languageToggle').addEventListener('click', () => {
  document.getElementById('languageMenu').classList.toggle('hidden');
});

// Switch language when a user selects it
document.querySelectorAll('#languageMenu button').forEach(btn => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.lang;
    loadLanguage(lang);
    document.getElementById('languageMenu').classList.add('hidden');
  });
});

// On page load
const savedLang = localStorage.getItem('lang') || 'en';
loadLanguage(savedLang);