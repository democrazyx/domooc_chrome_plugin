function domooc() {         //一键做题
    var wrongNum=0;
    if (["doingPage", "donePage"].indexOf(pageListener.page()) < 0) {
        alert("请在答题页面操作！");
        return;
    }
    var count1 = 0;
    allright = true;
    $("div.m-choiceQuestion").each(function () {
        count1++;
        index = md5(getProblem(this));
        arr = p['correct'][index];
        if (isNull(arr)) {
            wrongNum++;
            warn(this, 0);       //0表示选择题；
            //console.log(index + " :" + getProblem(this));
        } else {
            $(this).find("div.j-choicebox ul li").each(function () {
                if (!!$(this).find("input:checked")[0]) {
                    $(this).find("input:checked")[0].click();
                }
                if (arr.indexOf(getChoice(this)) > -1) {
                    $(this).find("input")[0].click();
                }
            });
        }
    });
    var count2 = 0;
    $("div.m-FillBlank").each(function () {
        count2++;
        var problem = getProblem(this);
        var index = md5(problem);
        if (!!p["correct"][index]) {
            var textarea = $(this).find("textarea.j-textarea.inputtxt")[0];
            var label = $(this).find("label.j-hint")[0];
            label.click();
            textarea.click();
            textarea.focus();
            textarea.value = p["correct"][index][0];
            textarea.blur();
        } else {
            wrongNum++;
            warn(this, 1);
            console.log(index + " :" + getProblem(this));
        }
    });
    if (wrongNum===0) {
        alert("finish!");
    } else {
        if(wrongNum>=count1+count2){
            alert("此单元可能还没上传答案，请自行答题或者用小号刷题获取题库！")
        }else{
            alert("有些题目没有答案，请自行答题。");
        }
    }
}