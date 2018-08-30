var courseid_pat = /learn\/([\S]+?)\/learn/;
var _courseid;                  //保存当前的courseid
chrome.runtime.sendMessage({ action: "queryUrl" }, (response) => {
    currentUrl = response.url;
    _courseid = courseid_pat.exec(currentUrl)[1].split("?")[0].split("#")[0];
});
var courseInterval = 0;
(function () {
    if (courseInterval !== 0) {
        return;
    }
    courseInterval = setInterval(function () {
        if (["doingPage", "donePage", "startPage", "unitPage"].indexOf(pageListener.page()) > -1) {
            console.log("send message");
            chrome.runtime.sendMessage({ action: "queryQuestionBank", courseid: _courseid }, (response) => {
                if (response.success) {
                    p = JSON.parse(response.jsonQB);
                    p.giver = response.giver;
                    p.timestamp = response.timestamp;
                    state.qbchecked = true;
                } else {
                    state.qbchecked = false;
                }
                window.clearInterval(courseInterval);
            });
        }
    }, 500);
})();
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "stop") {
            //alert("hint");
            state.mode=1;
            state.stop = true;
            sendResponse("已停止");
        }else if(!state.stop&&!state.finished){
            
            sendResponse("已开始刷题，请勿重复点击");
        }else if (request.action == "course") {
            //alert("course");
            state.mode=2;
            state.stop=false;
            view.showNotExist();
            sendResponse("刷题中...本课程所有单元完成后自动停止");
            processor.startRush(1);

        }else if (request.action == "unit") {
            //alert("unit");
            view.showNotExist();
            state.mode=2;
            state.stop=false;
            sendResponse("刷题中...本单元完成后自动停止");
            processor.startRush(2);

        }else if (request.action == "hint") {
            //alert("hint");
            hint();
            sendResponse("开发中...")
        }
        //console.log(request.action);
    }
);
pageListener.start(processor);
