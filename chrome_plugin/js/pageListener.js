var pageListener = (function () {
    var obj = new Object();
    var pre_qbcheck=state.qbchecked;
    obj.page = function () {        //判断当前页面属于什么类型
        var current = null;
        if(!!$("span.ux-btn.th-bk-main.ux-btn-.ux-btn-.ux-modal-btn")[0]){
            return "neterrorPage";
        }else  if (!!$("div.m-chapterQuizHwItem")[0]) {
            return "unitPage";
        } else if (!!$("div.j-doing.f-dn")[0]&&!!("a.j-startBtn")[0]) {
            return "startPage";
        } else if (!!$("a.j-left.u-btn.u-btn-primary")[0]) {
            return "confirmPage";
        } else if (!!$("div.m-choiceQuestion.u-questionItem.examMode")[0]) {
            if (!!$("div.m-choiceQuestion:last input:checked")[0]
                && $("div.m-choiceQuestion input:checked").length >= ($("div.m-choiceQuestion input").length - repeat.length) / 4
            ) {
                return "donePage";
            } else {
                return "doingPage";
            }
        } else if(!!$("div.m-FillBlank.u-questionItem.examMode")[0]){
            if(!isNull($("div.last textarea").val())){
                return "donePage";
            }else{
                return "doingPage";
            }
        } else if (state.gotanswers) {
            return "gotanswersPage";
        } else if (!!$("div.u-questionItem.analysisMode")[0]) {
            return "analysisPage";
        } else if (!!$("div.m-homeworkQuestionList")[0]) {
            return "homeworkPage";
        } else if (!!$("li.u-curtab:first")[0]) {
            var strs = $("li.u-curtab:first").find("a").attr("href").split("/");
            current = strs[strs.length - 1]; //"announce","score""content","testlist","examlist","forumindex"
            current= current==="testlist"?null:current;
        }
        return current;
    }
    obj.prePage = obj.page();           //记录前一页面
    obj.interval = 0;                   //记录以下周期运行函数
    obj.start = function () {
        obj.interval = setInterval(function () {
            if(state.mode===2&&(state.finished||state.stop)){
                obj.stop();
                processor.stop();
                return;
            }
            if(!pre_qbcheck&&state.qbchecked){
                pre_qbcheck=true;
                processor.pageChangeHandler(obj.prePage,obj.page());
            }
            if(obj.page()==="neterrorPage"){
                $("span.ux-btn.th-bk-main.ux-btn-.ux-btn-.ux-modal-btn")[0].click();    //当网络较慢时容易出现此窗口，点击确定可去除
                return;
            }
            if (obj.prePage == obj.page() || !obj.page()) {
                return;
            } else {
                //console.log("obj.page changed: " + obj.prePage + "->" + obj.page());
                var temppage = obj.prePage;
                obj.prePage = obj.page();
                processor.pageChangeHandler(temppage, obj.page());
            }
        }, 500);
    };
    obj.stop = function(){
        window.clearInterval(obj.interval);
        obj.interval = 0;
    }
    return obj;
})();