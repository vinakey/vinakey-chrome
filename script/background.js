chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    language: 'en'
  });
});

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['avim.js']
  });
});

