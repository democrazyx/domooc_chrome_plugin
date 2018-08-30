function isNull(arr) {
    if (arr === undefined || arr === null || arr === false) {
        return true;
    }
    return false;
  }
  //监听前端页面发来的消息
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "queryUrl") {
      chrome.tabs.query({ active: true }, function (tabs) {
        console.log(tabs[0].url);
        sendResponse(tabs[0]);
      });
    } else if (message.action === "queryQuestionBank") {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://47.107.38.148/answers", true);
      xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
      xhr.onreadystatechange = function () {
          var resp={};
          resp.success=false;
        if (xhr.readyState == 4&&xhr.status==200) {
            resp=JSON.parse(xhr.responseText);
            sendResponse(resp);
        }else if(xhr.readyState == 4 && xhr.status!=200){
          sendResponse(resp);
        }
      }
      var data={
        "action":"get",
        "courseid":message.courseid
      };
      xhr.send(JSON.stringify(data));
    }else if(message.action === "sendToServer"){
      console.log("sendToServer");
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "http://47.107.38.148/answers", true);
      xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
      xhr.onreadystatechange = function () {
          var resp={};
          resp.success=false;
        if (xhr.readyState == 4 && xhr.status==200) {
            resp=JSON.parse(xhr.responseText);
            sendResponse(resp);
        }else if(xhr.readyState == 4 && xhr.status!=200){
          sendResponse(resp);
        }
      }
      var data={
        "action":"add",
        "courseid":message.courseid,
        "jsonQB":message.jsonQB,
        "giver":isNull(message.giver)?"不愿透露姓名的Z同学":message.giver
      }
      xhr.send(JSON.stringify(data));
    }
    return true;
  });