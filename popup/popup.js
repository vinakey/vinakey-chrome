document.addEventListener('DOMContentLoaded', () => {
  const methodSelect = document.getElementById('method-select');
  const onOffSelect = document.getElementById('onOff-select');
  const ckSpellSelect = document.getElementById('ckSpell-select');
  const oldAccentSelect = document.getElementById('oldAccent-select');

  // Load current preferences
  chrome.storage.local.get(['method', 'onOff', 'ckSpell', 'oldAccent'], (prefs) => {
      methodSelect.value = prefs.method || '0';
      onOffSelect.value = prefs.onOff || '1';
      ckSpellSelect.value = prefs.ckSpell || '1';
      oldAccentSelect.value = prefs.oldAccent || '0';
  });

  document.getElementById('save').addEventListener('click', () => {
      const prefs = {
          method: methodSelect.value,
          onOff: onOffSelect.value,
          ckSpell: ckSpellSelect.value,
          oldAccent: oldAccentSelect.value
      };

      // Save preferences
      chrome.storage.local.set(prefs, () => {
          chrome.runtime.sendMessage({ save_prefs: true, ...prefs });
      });
  });
});
