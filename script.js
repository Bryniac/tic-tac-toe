// First, your board and game logic (this should run immediately when the script loads)
const board = document.getElementById('board');
const boardSize = 3;
let currentPlayer = 'O';
/*  commenting just in case
let memoryMode = true; //highlights modes
let extremeMode = false; // Extreme Mode variable with no highlights
*/
let mode = 'current'; // Possible values: 'current', 'memory', 'extreme'
let score = { X: 0, O: 0 };

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
  winnerMessage.textContent = `${winner} wins! 🎉`;
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

  updateBoardHighlighting(); // <- move this to be called right after a move

  if (playerMoves.length === 3) {
    const winningCombo = checkWin(playerMoves);
    if (winningCombo) {
      showWinLine(winningCombo);
      endGame(currentPlayer);
      return; // stop here if someone won
    }
  }

  // ✅ Always switch players if game is not over
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

/*
// Memory mode toggle
memoryToggle.addEventListener('click', () => {
  if (extremeMode) {
    // Switch to Memory Mode
    extremeMode = false;
    memoryMode = true;
    memoryToggle.textContent = '🧠';
    memoryToggle.className = 'brain-floating-btn memory'; // ✅ keep floating style
  } else if (memoryMode) {
    // Switch to Extreme Mode
    memoryMode = false;
    extremeMode = true;
    memoryToggle.textContent = '💀';
    memoryToggle.className = 'brain-floating-btn extreme'; // ✅ keep floating style
  } else {
    // Switch to Current Player Mode
    memoryMode = false;
    extremeMode = false;
    memoryToggle.textContent = '🧠';
    memoryToggle.className = 'brain-floating-btn current'; // ✅ keep floating style
  }

  updateBoardHighlighting();
});
*/

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

/*
// Function to update board highlighting based on the current mode
function updateBoardHighlighting() {
  if (extremeMode) {
    // Extreme Mode: No highlighting during gameplay, just show the winning combo
    board.querySelectorAll('.cell').forEach(cell => {
      cell.classList.remove('highlight');
    });
  } else if (memoryMode) {
    // Memory Mode (highlight both players' oldest)
    ['X', 'O'].forEach(p => {
      const list = moves[p];
      if (list.length === 3) {
        const oldestIndex = list[0].index;
        board.children[oldestIndex].classList.add('highlight');
      }
    });
  } else {
    // Current Player Highlight (highlight only the current player's oldest)
    const activeMoves = moves[currentPlayer];
    if (activeMoves.length === 3) {
      const oldestIndex = activeMoves[0].index;
      board.children[oldestIndex].classList.add('highlight');
    }
  }
}
*/

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
// Wait for the DOM to be fully loaded before executing the script
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