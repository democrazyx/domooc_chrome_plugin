var processor = (function () {
    var obj = {};
    obj.pageChangeHandler = function (pre, current) {       //处理页面变化事件
        //console.log(pre+"=>"+current);
        //console.log(state.unitfinished);
        switch (state.mode) {
            case 1: this.pageChangeHandler_clickToAnswer(pre, current); break;
            case 2: this.pageChangeHandler_rushForAnswers(pre, current); break;
        }
    };
    obj.pageChangeHandler_clickToAnswer = function (pre, current) {
        if (["donePage","confirmPage"].indexOf(pre)>-1  && current === "analysisPage") {
            var wrongNumber = generateAnswers();
            if (wrongNumber > 0) {
                view.showUpload();
            }
        }
        if (["startPage", "doingPage", "donePage", "confirmPage", "analysisPage","unitPage"].indexOf(current) > -1) {
            if (state.qbchecked) {
                view.showExist(current);
                if (["doingPage", "donePage"].indexOf(current) > -1) {
                    view.showButton(current);
                } else {
                    view.hideButton(current);
                }
            } else {
                view.showNotExist(current);
                view.hideButton();
            }
        }
    };
    obj.pageChangeHandler_rushForAnswers = function (pre, current) {
        if (current === "doingPage") {
            selectAll();
        } else if (current === "analysisPage") {
            generateAnswers(function (k) {
                state.unitfinished = k <= 0 ? true : false;
                state.gotanswers = true;
            });
        } else if (current === "gotanswersPage") {
            state.gotanswers = false;
            $("a.j-backList")[0].click();
        } else if (current === "startPage") {
            if (!state.unitfinished) {
                $("a.j-startBtn")[0].click();
            } else {
                $("a.j-backList")[0].click();
            }
        } else if (current === "unitPage") {
            courseStart();
        } else if (pre !== "confirmPage" && current === "donePage") {
            $("a.j-submitBtn")[0].click();
        } else if (current === "confirmPage") {
            $("a.j-left.u-btn.u-btn-primary")[0].click();
        } else if (current === "homeworkPage") {
            state.unitfinished = true;
            $(".j-backbtn,a.j-backList")[0].click();
        } else if (["announce", "score", "content", "examlist", "forumindex"].indexOf(current) > -1) {
            $("ul#j-courseTabList li:eq(3) a")[0].click();
        }
    }
    obj.stop = function (current) {
        if (state.finished) {
            view.showUpload();
            pageListener.stop();
        } else if (state.stop) {

        }
    }
    obj.startRush = function (_type) {
        state.stop = false;
        state.unitfinished = false;
        state.finished = false;
        state.gotanswers = false;
        state.type = !_type ? 2 : _type;
        state.mode=2;
        pageListener.interval===0?pageListener.start():0;
        courseStart = !courseStart ? _courseStart() : courseStart;
        if (state.type === 2) {
            if (pageListener.page() === "donePage") {    //判断当前页面是否可以单元刷题
                obj.pageChangeHandler("doingPage", "donePage");
            } else if (pageListener.page() === "anaysisPage") {
                obj.pageChangeHandler("anaysisPage", "gotanswerPage");
            } else if (pageListener.page() === "startPage") {
                obj.pageChangeHandler("unitPage", "startPage");
            } else if (pageListener.page() === "doingPage") {
                obj.pageChangeHandler("startPage", "doingPage");
            } else {
                alert("请在开始答题界面界面运行！");
            }
        } else if (state.type === 1) {
            courseStart();
        }
    }
    return obj;
})();