import { resetBoard, checkWin, showWinLine, updateBoardHighlighting } from './game.js';
import { toggleElementVisibility, showWinnerModal, updateStatusText } from './ui.js';
import { loadLanguage, applyTranslations, setupLanguageMenu } from './language.js';
import { toggleTheme, setupThemeToggle } from './theme.js';
import { loadHelpModal } from './help.js';

// Global game state
let currentPlayer = 'O';
let score = { X: 0, O: 0 };
let mode = 'current';
let translations = {};

// DOM references
const resetGameBtn = document.getElementById('resetGameBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const memoryToggle = document.getElementById('memoryToggle');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

// Game Setup
document.addEventListener('DOMContentLoaded', () => {
  loadLanguage(localStorage.getItem('lang') || 'en').then(strings => {
    translations = strings;
    applyTranslations(strings);
  });
  setupLanguageMenu();
  setupThemeToggle();
  loadHelpModal();
});

// Board Setup
const board = document.getElementById('board');
for (let i = 0; i < 9; i++) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.dataset.index = i;
  board.appendChild(cell);
}

board.addEventListener('click', handleCellClick);

function handleCellClick(e) {
  const cell = e.target;
  if (!cell.classList.contains('cell')) return;
  if (cell.textContent) return;

  const index = parseInt(cell.dataset.index);
  const playerMoves = window.moves[currentPlayer];

  if (playerMoves.length === 3) {
    const oldest = playerMoves.shift();
    board.children[oldest.index].textContent = '';
  }

  cell.textContent = currentPlayer;
  playerMoves.push({ index });

  updateBoardHighlighting();

  if (playerMoves.length === 3) {
    const winningCombo = checkWin(playerMoves);
    if (winningCombo) {
      showWinLine(winningCombo);
      endGame(currentPlayer);
      return;
    }
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function endGame(winner) {
  score[winner]++;
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
  setTimeout(() => {
    showWinnerModal(winner, translations);
  }, 500);
}

// Button handlers
resetScoreBtn.addEventListener('click', () => {
  score = { X: 0, O: 0 };
  scoreX.textContent = 0;
  scoreO.textContent = 0;
});

resetGameBtn.addEventListener('click', () => {
  resetBoard();
});

playAgainBtn.addEventListener('click', () => {
  resetBoard();
  toggleElementVisibility('winnerModal', true);
});

memoryToggle.addEventListener('click', () => {
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

// Initialize moves
window.moves = { X: [], O: [] };
resetBoard();
