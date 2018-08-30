function warn(ele, index) {      //当没有该题目答案时做出相应的动作 
    //alert('第' + count + '道' + ['选择题', '填空题'][index] + '无答案');
    index == 0 ? $(ele).find("input")[0].click() : 0;
    console.log($(ele).find("div.j-title").text())
    $(ele).find("div.j-title").attr("style", "background-color: #FFD700");
}
function clearWarn(ele){
    $(ele).find("div.j-title").attr("style", "");
}
var view = (function () {
    var obj = new Object();
    var 
    selectors = ["h2.f-fl.j-moduleName", "h2.j-title.f-fl"];
    obj._showExist = function (selector) {
        $(selector).after("<h4 class='j-title' id='timestamp' style='margin: 0 15px 0 15px;color:black;'>&nbsp;&nbsp;&nbsp;上次更新时间为 " + p.timestamp + " </h4>");
        $(selector).after("<h4 class='j-title' id='giver' style='margin: 0 15px 0 15px;color:black;'>&nbsp;&nbsp;&nbsp;本测验题库由 " + (isNull(p.giver) ? getName() : p.giver) + " 提供</h4>");
    };
    obj._showNotExist = function (selector) {
        $(selector).after("<h2 class='j-title' id='qb_check_fail' style='margin: 0 15px 0 15px;color:red;'>&nbsp;&nbsp;&nbsp;暂无对应题库，您可以自行用小号刷题获取题库</h2>");
    };
    obj._showButton = function (selector){
        $(selector).after("<div class='f-fl u-btn u-btn-whiteGreen' id='domooc' style='margin: 0 15px 0 15px;'>一键答题</div>");
        $("#domooc").click(function () {
            domooc();
        });
    };
    obj.showExist = function (current) {
        $("h2#qb_check_fail").hide();
        if (!$("h4#timestamp")[0] && !$("h4#giver")[0]) {
            if (current === "unitPage") {
                obj._showExist(selectors[0]);
            } else {
                obj._showExist(selectors[1]);
            }
        } else {
            $("h4#timestamp").show();
            $("h4#giver").show();
        }
    };
    obj.showNotExist = function (current) {
        $("h4#timestamp").hide();
        $("h4#giver").hide();
        if (!$("#qb_check_fail")[0]) {
            if (current === "unitPage") {
                obj._showNotExist(selectors[0]);
            } else {
                obj._showNotExist(selectors[1]);
            }
        } else {
            $("#qb_check_fail").show();
        }
    };
    obj.showButton = function (current) {
        if (!$("#domooc")[0]) {
            obj._showButton(selectors[1]);
        } else {
            $("#domooc").show();
        }
    };
    obj.hideButton = function () {
        $("#domooc").hide();
    };
    obj.showUpload = function () {
        var details=["检测到答案有错误，若要修正题库造福其他同学，请在下方输入框中输入您的昵称（不超过25字）并提交","若要分享题库造福其他同学，请在下方输入框中输入您的昵称（不超过25字）并提交","上传失败！请关闭当前标签页后重试","上传成功！感谢您的参与，请刷新以获取您的题库信息，本信息将在五秒后消失"];
        if (!!$("div.g-mn1c.m-learnbox")[0]) {
            if (!$("div#upload")[0]) {
                var giver_name = getName();
                $("div.g-mn1c.m-learnbox").prepend("<div id='upload' style='display:none'><div class='empty j-empty' id='upload' style='margin-top:10px;padding-top:5px;' ><span class='f-f0 f-fl' style='display:inline'>若要分享题库造福其他同学，请在下方输入框中输入您的昵称（不超过25字）</span></div><div class='u-baseinputui' style='width: 250px; height: 35px;'><textarea id='giver_text' class='j-textarea inputtxt' value='" + giver_name + "' cols='25'>" + giver_name + "</textarea></div><div class='f-fl u-btn u-btn-whiteGreen' id='giver_submit' style='margin: 15px 0px 20px 0px;margin-right:100%'>提交</div></div>");
            }
            $("div#upload span").text(details[state.mode-1]);
            $("div#upload span").css("color", "");
            $("div#upload").show();
            $("div#giver_submit").click(function () {
                var giver = $("textarea#giver_text").val();
                qbUpload(giver, function (response) {
                    if (!response || !response.success) {
                        $("div#upload span").text(details[2]);      //上传失败
                        $("div#upload span").css("color", "red");   
                    } else {
                        $("div#upload span").text(details[3]);      //上传成功
                        $("div#upload span").css("color", "red");
                    }
                    setTimeout(function () {
                    $("div#upload").hide();
                    }, 5000);
                });
            });
        }
    };
    obj.showStop=function(){
        
    }
    return obj;
})();