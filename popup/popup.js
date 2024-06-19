document.addEventListener('DOMContentLoaded', () => {
  const languageSelect = document.getElementById('language-select');

  chrome.storage.sync.get('language', ({ language }) => {
    languageSelect.value = language;
  });

  document.getElementById('save').addEventListener('click', () => {
    const language = languageSelect.value;
    chrome.storage.sync.set({ language });
  });
});

