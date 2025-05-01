export function setupThemeToggle() {
    const themeToggleButton = document.getElementById('themeToggle');
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark');
    }
    themeToggleButton.addEventListener('click', toggleTheme);
  }
  
  export function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  }
  