export function toggleElementVisibility(id, hide = false) {
  const el = document.getElementById(id);
  if (hide) {
    el.classList.add('hidden');
  } else {
    el.classList.remove('hidden');
  }
}

export function showWinnerModal(winner, translations) {
  const template = translations.winnerMessage || "{winner} wins! 🎉";
  const message = template.replace("{winner}", winner);
  document.getElementById('winnerMessage').innerHTML = message;
  document.getElementById('winnerModal').classList.remove('hidden');
}

export function updateStatusText(text) {
  const statusEl = document.getElementById('status');
  if (statusEl) statusEl.textContent = text;
}
