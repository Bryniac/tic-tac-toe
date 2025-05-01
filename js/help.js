export function loadHelpModal() {
    fetch('help.html')
      .then(res => res.text())
      .then(html => {
        document.body.insertAdjacentHTML('beforeend', html);
  
        const helpToggle = document.getElementById('helpToggle');
        const helpModal = document.getElementById('helpModal');
        const closeHelp = document.getElementById('closeHelp');
  
        helpToggle.addEventListener('click', () => helpModal.classList.remove('hidden'));
        closeHelp.addEventListener('click', () => helpModal.classList.add('hidden'));
  
        window.addEventListener('click', (e) => {
          if (e.target === helpModal) {
            helpModal.classList.add('hidden');
          }
        });
  
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && !helpModal.classList.contains('hidden')) {
            helpModal.classList.add('hidden');
          }
        });
      });
  }
  