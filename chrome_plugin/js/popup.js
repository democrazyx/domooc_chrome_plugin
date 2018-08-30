function getCurrentTabId(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (callback) callback(tabs.length ? tabs[0].id : null);
    });
  }
  
  function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
      chrome.tabs.sendMessage(tabId, message, function (response) {
        if (callback) callback(response);
      });
    });
  }
  var response;
  //为popup.html绑定事件，并与content_script通信
  document.addEventListener('DOMContentLoaded', () => {
    var selectors = document.getElementById('selectors');
    $(selectors).find("button").each(function () {
      var value = $(this).attr("value");
      console.log(value);
      this.addEventListener('click', () => {
        sendMessageToContentScript({ action: value }, (response) => {
          this.innerText=response;
        })
      });
    });
  });
  