function setLocalStorageItem(key, value) {
  chrome.storage.local.set({ [key]: value });
}

function getLocalStorageItem(key, callback) {
  chrome.storage.local.get([key], function(result) {
      callback(result[key]);
  });
}

function getPrefs(callback) {
  chrome.storage.local.get(['method', 'onOff', 'ckSpell', 'oldAccent'], function(result) {
      var prefs = {
          'method': parseInt(result.method || '0'),
          'onOff': parseInt(result.onOff || '1'),
          'ckSpell': parseInt(result.ckSpell || '1'),
          'oldAccent': parseInt(result.oldAccent || '0')
      };
      callback(prefs);
  });
}

function turnAvim(callback) {
  getLocalStorageItem('onOff', function(onOff) {
      var newOnOff = onOff == '1' ? '0' : '1';
      setLocalStorageItem('onOff', newOnOff);
      getPrefs(function(prefs) {
          updateAllTabs(prefs);
          callback();
      });
  });
}

function updateAllTabs(prefs) {
  chrome.tabs.query({}, function(tabs) {
      for (var i = 0; i < tabs.length; i++) {
          var tab = tabs[i];
          chrome.tabs.sendMessage(tab.id, prefs);
      }
  });
  updateIcon(prefs);
}

function updateIcon(prefs) {
  var txt = {};
  var bg = {};

  if (prefs.onOff == 1) {
      txt.text = "on";
      bg.color = [0, 255, 0, 255];
  } else {
      txt.text = "off";
      bg.color = [255, 0, 0, 255];
  }

  chrome.action.setBadgeText(txt);
  chrome.action.setBadgeBackgroundColor(bg);
}

function savePrefs(request, callback) {
  if (typeof request.method != 'undefined') {
      setLocalStorageItem("method", request.method);
  }
  if (typeof request.onOff != 'undefined') {
      setLocalStorageItem("onOff", request.onOff);
  }
  if (typeof request.ckSpell != 'undefined') {
      setLocalStorageItem("ckSpell", request.ckSpell);
  }
  if (typeof request.oldAccent != 'undefined') {
      setLocalStorageItem("oldAccent", request.oldAccent);
  }

  getPrefs(function(prefs) {
      updateAllTabs(prefs);
      callback();
  });
}

function processRequest(request, sender, sendResponse) {
  if (request.get_prefs) {
      getPrefs(sendResponse);
      return true;
  }

  if (request.save_prefs) {
      savePrefs(request, sendResponse);
      return true;
  }

  if (request.turn_avim) {
      turnAvim(sendResponse);
      return true;
  }
  return false;
}

chrome.runtime.onMessage.addListener(processRequest);

chrome.runtime.onInstalled.addListener(() => {
  getPrefs(updateIcon);
});
