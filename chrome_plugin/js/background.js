var serverURL = "http://47.107.38.148";
//  var serverURL = "http://localhost:8080/prj1";
function isNull(arr) {
    if (arr === undefined || arr === null || arr === false) {
        return true;
    }
    return false;
  }
  //监听前端页面发来的消息
  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "queryUrl") {                //返回当前URL
      chrome.tabs.query({ active: true }, function (tabs) {
        console.log(tabs[0].url);
        sendResponse(tabs[0]);
      });
    } else if (message.action === "queryQuestionBank") {    //获取题库
      var xhr = new XMLHttpRequest();
      xhr.open("POST", serverURL+"/answers", true);
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
        "courseid":message.courseid,
        "termid":message.termid,
        "user" :message.user
      };
      xhr.send(JSON.stringify(data));
    }else if(message.action === "sendToServer"){      //发送题库到服务器
      console.log("sendToServer");
      var xhr = new XMLHttpRequest();
      xhr.open("POST", serverURL+"/answers", true);
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
        "termid":message.termid,
        "jsonQB":message.jsonQB,
        "giver":isNull(message.giver)?"不愿透露姓名的Z同学":message.giver,
        "giverid": message.giverid,
        "curlength": message.curlength
      }
      xhr.send(JSON.stringify(data));
    }else if(message.action === "wrong"){
      console.log("wrong");
      var xhr = new XMLHttpRequest();
      xhr.open("POST", serverURL+"/answers", true);
      xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
      var data={
        "action":"wrong",
        "courseid":message.courseid,
        "termid": message.termid,
        "quizname":message.quizname
      }
      xhr.send(JSON.stringify(message));
    }
    return true;
  }); 