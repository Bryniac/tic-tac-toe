export function resetBoard() {
  window.moves.X = [];
  window.moves.O = [];
  document.querySelectorAll('.cell').forEach(c => {
    c.textContent = '';
    c.classList.remove('highlight');
  });
  document.getElementById('winLine').style.transform = 'scaleX(0)';
  window.currentPlayer = 'O';
}

export function checkWin(playerMoves) {
  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  const indexes = playerMoves.map(m => m.index);
  return winningCombos.find(combo => combo.every(i => indexes.includes(i)));
}

export function showWinLine(combo) {
  document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));
  combo.forEach(index => {
    document.getElementById('board').children[index].classList.add('highlight');
  });
}

export function updateBoardHighlighting() {
  const mode = window.mode;
  const board = document.getElementById('board');
  board.querySelectorAll('.cell').forEach(c => c.classList.remove('highlight'));

  if (mode === 'extreme') return;

  if (mode === 'memory') {
    ['X', 'O'].forEach(p => {
      const list = window.moves[p];
      if (list.length === 3) {
        const oldestIndex = list[0].index;
        board.children[oldestIndex].classList.add('highlight');
      }
    });
  } else if (mode === 'current') {
    const list = window.moves[window.currentPlayer];
    if (list.length === 3) {
      const oldestIndex = list[0].index;
      board.children[oldestIndex].classList.add('highlight');
    }
  }
}
