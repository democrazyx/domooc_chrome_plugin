function filter(_str) {
    if (!_str) {
        return getName();
    }
    var ptn = /<script>|<\/script>/ig;
    var str = _str.replace(ptn, '');
    return str.slice(0, 25);
}
var _courseid;                  //保存当前的courseid
(function(){
var href=$("div.f-fl.info a.f-fl").attr("href");
var courseid_arr=href.split("/");
_courseid = courseid_arr.pop();
})();

var courseInterval = 0;
//查询题库
(function () {
    if (courseInterval !== 0) {
        return;
    }
    var responsed = false;
    var _getqb = function () {
        console.log("send message");
        chrome.runtime.sendMessage({ action: "queryQuestionBank", courseid: _courseid, termid: getTermID(), user: JSON.stringify(getWebUser()) }, (response) => {
            responsed = true;
            if (response.success) {
                p = qbConverter(response);
                p.donequizs = parseDoneQuizs(response.donequizs);
                p.giver = filter(response.giver);
                p.timestamp = response.timestamp;
                p.addedInfo = response.addedInfo;
                state.qbchecked = true;
            } else {
                state.qbchecked = false;
            }
        });
    }
    courseInterval = setInterval(function () {
        if (["doingPage", "donePage", "startPage", "unitPage"].indexOf(pageListener.page()) > -1) {
            _getqb();
            window.clearInterval(courseInterval);
            setTimeout(() => {
                if (!responsed) _getqb();
            }, 3000);
        }
    }, 300);
})();
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action == "stop") {
            //alert("hint");
            state.mode = 1;
            state.stop = true;
            sendResponse("已停止");
        } else if (!state.stop && !state.finished) {

            sendResponse("已开始刷题，请勿重复点击");
        } else if (request.action == "course") {
            //alert("course");
            state.mode = 2;
            state.stop = false;
            view.showNotExist();
            sendResponse("刷题中...本课程所有单元完成后自动停止");
            processor.startRush(1);

        } else if (request.action == "unit") {
            //alert("unit");
            view.showNotExist();
            state.mode = 2;
            state.stop = false;
            sendResponse("刷题中...本单元完成后自动停止");
            processor.startRush(2);

        } else if (request.action == "hint") {
            //alert("hint");
            hint();
            sendResponse("开发中...")
        }
        //console.log(request.action);
    }
);
pageListener.start(processor);
