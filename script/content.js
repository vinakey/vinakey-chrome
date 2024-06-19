try {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('script/avim.js');
    script.onload = function() {
      // Initialize AVIM after the script is loaded
      if (typeof AVIMInit === 'function') {
        AVIMInit(AVIMObj);
      }
    };
    script.onerror = function() {
      console.error('Failed to load AVIM script.');
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error loading AVIM script:', error);
  }
  
  chrome.runtime.onMessage.addListener((message) => {
    // Handle the message to update AVIM preferences
    if (typeof AVIMGlobalConfig !== 'undefined') {
      AVIMGlobalConfig.method = message.method;
      AVIMGlobalConfig.onOff = message.onOff;
      AVIMGlobalConfig.ckSpell = message.ckSpell;
      AVIMGlobalConfig.oldAccent = message.oldAccent;
      if (typeof AVIMObj !== 'undefined') {
        AVIMObj.setMethod(AVIMGlobalConfig.method);
        AVIMObj.setSpell(AVIMGlobalConfig.ckSpell);
        AVIMObj.setDauCu(AVIMGlobalConfig.oldAccent);
      }
    }
  });
  