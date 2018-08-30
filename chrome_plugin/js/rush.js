function selectAll() {
    problem_index = {};
    pamap_current = {};
    $("div.m-choiceQuestion").each(function () {            //获得当前题目的题目选项
        var eachid = new Array();
        $(this).find("div.j-choicebox>ul>li").each(function () {
            eachid.push(getChoice(this));
        });
        problem = getProblem(this);
        var index = md5(problem);
        problem_index[problem] = index;
        pamap_current[index] = eachid;
    });
    $("div.m-FillBlank").each(function () {
        problem = getProblem(this);
        var index = md5(problem);
        problem_index[problem] = index;
        var answer=isNull(p["correct"][index])?["no answer"]:p["correct"][index];
            var textarea = $(this).find("textarea.j-textarea.inputtxt")[0];
            var label = $(this).find("label.j-hint")[0];
            label.click();
            textarea.click();
            textarea.focus();
            textarea.value = answer[0];
    });
    $("div.m-choiceQuestion").each(function () {
        var index = problem_index[getProblem(this)];
        if (classify(this) == 1) {
            var arr = getAnswer(index, 1);
            $(this).find("div.j-choicebox ul li").each(function () {
                if (arr.indexOf(getChoice(this)) > -1) {
                    $(this).find("input")[0].click();
                }
            });
        } else {
            var arr = getAnswer(index, 2);
            $(this).find("div.j-choicebox ul li").each(function () {
                if (arr.indexOf(getChoice(this)) > -1) {
                    $(this).find("input")[0].click();
                }
            });
        }
    });
}

//在结果分析页面获取题目的正确选项
function generateAnswers(callback) {
    repeat = [];        //记录有重复选项的题目
    var wrongNumber=0;     //记录错题数量
    //console.log('getAnswers:start' + new Date().getTime())
    $("div.m-choiceQuestion").each(function (p_index) {
        //console.log('getAnswers each' + index + ' :' + new Date().getTime())
        index = problem_index[getProblem(this)];
        choiecs = getChoices(this);
        var temp = choiecs.concat();
        var repeat_index=-1;
        if (!!temp.repeat()) {
            console.log("第" + (p_index + 1) + "题有重复选项！");
            repeat_index=choiecs.indexOf(temp.repeat());
            repeat.push(repeat_index);
        }
        if ($(this).find("span.tt2").length > 0) {
            if(!!$(this).find("div.answrong")[0]){
                wrongNumber++;
            }
            answer_index = getAnswerIndex($(this).find("span.tt2").text());
            if(repeat_index!=-1){           //如果有重复选项
                if(answer_index.length>1||answer_index[0]===repeat_index+1){
                }else{
                    p["correct"][index] = merge(p["correct"][index], choiecs[answer_index[0]-1]);
                    if (!isNull(p["wrong"][index])) {
                        toArray(p["wrong"][index]).remove(answer_index[0]-1);
                    }
                }
                return;
            }
            for (i = 0; i < choiecs.length; i++) {
                if (answer_index.indexOf(i + 1) > -1) {
                    p["correct"][index] = merge(p["correct"][index], choiecs[i]);
                    if (!isNull(p["wrong"][index])) {
                        toArray(p["wrong"][index]).remove(choiecs[i]);
                    }
                } else {
                    p["wrong"][index] = merge(p["wrong"][index], choiecs[i]);
                    if (!isNull(p["correct"][index])) {
                        toArray(p["correct"][index]).remove(choiecs[i]);
                    }
                }
            }
        } else {
            if ($(this).find("li.wrong").length > 0) {
                wrongNumber++;
            }
            if (classify(this) == 1) {
                if ($(this).find("li.wrong").length > 0) {
                    ele = $(this).find("li.wrong")[0];
                    p["wrong"][index] = merge(p["wrong"][index], getChoice(ele));
                    p["correct"][index] = differ(p["correct"][index], getChoice(ele));
                } else if ($(this).find("li.right").length > 0) {
                    ele = $(this).find("li.right")[0];
                    p["correct"][index] = merge(p["correct"][index], getChoice(ele));
                    p["wrong"][index] = differ(merge(p["wrong"][index], getChoices(this)), getChoice(ele));
                } else {
                    p["correct"][index] = undefined;
                    p["wrong"][index] = undefined;
                }
            } else {
                flag = 2;
                $(this).find("div.j-choicebox ul li").each(function () {
                    answer = getChoice(this);
                    if ($(this).attr('class').indexOf('wrong') >= 0) {
                        flag--;
                        p["wrong"][index] = merge(p["wrong"][index], answer);
                        p["correct"][index] = differ(p["correct"][index], answer);
                    } else if ($(this).attr('class').indexOf('right') >= 0) {
                        flag--;
                        p["correct"][index] = merge(p["correct"][index], answer);
                        p["wrong"][index] = differ(p["wrong"][index], answer);
                    }
                });
                if (flag > 0) {
                    p["correct"][index] = undefined;
                    p["correct"][index] = undefined;
                }
            }
        }
    });
    $("div.m-FillBlank").each(function () {
        if (!!$(this).find("span.tt2")[0]) {
            var html = $(this).find("span.tt2")[0].innerHTML;
            var text = $(this).find("span.tt2")[0].innerText;
            if(html.indexOf('<br')>-1){
                var answer=text.split('\n');
            }else{
                var answer=[text];
            }
            var answers=[];
            answer.forEach(element => {
                answers=merge(answers,element.split(" 或 "));
            });
            answers=answers.reverse();
            index = md5(getProblem(this));
            var input=$(this).find("textarea")[0].value;
            //console.log(answers);
            if((isNull(p["correct"][index])||!!$(this).find("div.answrong")[0])){
                if(!isNull(input)){
                    wrongNumber++;
                }
                p["correct"][index] = answers;
            }
        }
    });
    console.log('已迭代了' + N + '次');
    //console.log(k);
    N++;
    if (repeat.length < wrongNumber) {
        k = kconst;
    } else {
        k--;
    }
    //console.log('getAnswers:complete' + new Date().getTime())
    console.log("错误数量: " + wrongNumber);
    if(!!callback){
        callback(k);
    }
    if (k <= 0) {
        k = kconst;
        console.log('finished!');
    }
    return wrongNumber-repeat.length;
}
var courseStart = undefined;        //课程刷题函数
var _courseStart = function () {
    var length = $("a.j-quizBtn").length;
    var counter = length;
    return function () {
        state.unitfinished = false;
        //console.log(counter)
        if (counter <= 0) {
            state.finished = true;
            counter = length;
            console.log("all finished!");
            return;
        }
        $("a.j-quizBtn")[length - counter].click();
        counter--;
    }
};
