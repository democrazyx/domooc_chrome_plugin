const kconst = 3;        //全对kconst次则退出
p = {                   //题库对象
    "correct": {},
    "wrong": {}
}
var timeout = [500, 1000, 1500, 2000, 2500, 3000, 5000];    //设置各级时间间隔
var split = ' ^ ';                      //分隔符
var pamap_current = {};                 //保存当前的题目与选项对应关系
var pat = /[https]{4,5}[\S]+?\.[PNGJEIFBMpngjeifbm]{3,4}/;  //抓取图片地址的正则表达式
var k = kconst;                         //设置全对次数阀值
var N = 1;                              //记录迭代次数
var repeat = [];                    //记录有重复选项的题目                                          
var state=(function(){
    var obj = {};
    obj.finished=false;         //是否全部刷题完成
    obj.stop=true
    ;              //是否停止当前操作  
    obj.unitfinished=false;      //当前单元是否刷题完成
    obj.type=1;                //刷题类型1为整个课程，2为单元刷题
    obj.gotanswers=false;       //判断是否获取完所有题目
    obj.qbchecked=false;        //判断是否已获得题库
    obj.mode=1;                 //工作模式，1为一键做题模式，2为刷题模式
    obj.donemooc=true;
    return obj;
})();
//根据字符串获取正确选项下标
function getAnswerIndex(answer_text) {
    switch (answer_text) {
        case 'A': return [1];
        case 'B': return [2];
        case 'C': return [3];
        case 'D': return [4];
        case 'A、B': return [1, 2];
        case 'A、C': return [1, 3];
        case 'A、D': return [1, 4];
        case 'A、B、C': return [1, 2, 3];
        case 'A、B、D': return [1, 2, 4];
        case 'A、C、D': return [1, 3, 4];
        case 'A、B、C、D': return [1, 2, 3, 4];
        case 'B、C': return [2, 3];
        case 'B、D': return [2, 4];
        case 'B、C、D': return [2, 3, 4];
        case 'C、D': return [3, 4];
    }
}
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    while (index > -1) {
        this.splice(index, 1);
        index = this.indexOf(val);
    }
    return this;
};
Array.prototype.unique = function () {
    this.sort();
    var re = [this[0]];
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== re[re.length - 1]) {
            re.push(this[i]);
        }
    }
    return re.remove(undefined);
};
Array.prototype.repeat = function () {      //返回第一个重复元素
    this.sort();    
    var re = [this[0]];
    for (var i = 1; i < this.length; i++) {
        if (this[i] !== re[re.length - 1]) {
            re.push(this[i]);
        }else{
            return this[i];
        }
    }
    return null;
};
//判断对象是否为空
function isNull(ele) {
    if (ele === undefined || ele === null || ele === false || (typeof(ele)==="string"?ele.trim()==="":0)) {
        return true;
    }
    return false;
}
function getName(){
    var titles=["不愿透露姓名的","喜欢闷声大发财的","想要走遍西方国家的","图杨图森破的","上台拿衣服的","爱好两栖动物的","戴黑框眼镜的","跑得比谁都快的","裤腰带很高的","某人的粉丝"];
    var names=["Z同学","L同学","W同学","S同学","X同学","F同学"];
    var r1=Math.floor(Math.random()*100)%titles.length;
    var r2=Math.floor(Math.random()*60)%names.length;
    return titles[r1]+names[r2];
}
//获取选项字符串
function getChoice(ele) {
    var temp = '';
    if ($(ele).find("img").length > 0) {
        $(ele).find("img").each(function () {
            temp = temp+split+pat.exec($(this).attr("src"))[0];
        });
    }
    if ($(ele).find("div.optionCnt span.u-icon-wrong").length > 0) {
        return 'wrong';
    }
    if ($(ele).find("div.optionCnt span.u-icon-correct").length > 0) {
        return 'correct';
    }
    if(isNull(($(ele).find("div.f-richEditorText").text()+temp).trim())){
        return ele.innerText;
    }
    return $(ele).find("div.f-richEditorText").text() + split + temp;
}
//获取题目所有选项
function getChoices(ele) {
    var strs = [];
    $(ele).find("div.j-choicebox ul li").each(function () {
        strs.push(getChoice(this));
    });
    return strs;
}
//获取题目字符串
function getProblem(ele) {
    var temp = [];
    if ($(ele).find("div.j-title").find("img").length > 0) {
        $(ele).find("div.j-title").find("img").each(function (index) {
            var src = $(this).attr("src");
            if (!!pat.exec(src)) {
                temp.push(pat.exec(src)[0]);
            }
        });
    }
    return $(ele).find("div.j-title div.f-richEditorText.j-richTxt").text() + split + temp;
}
//根据题目字符串生成题目下标
function getIndex(ele) {
    return md5(getProblem(ele));
}
//判断单选多选
function classify(ele) {
    if ($(ele).find('span.duo').length > 0) {
        return 2;
    } else {
        return 1;
    }
}

//从arr1中移除arr2中存在的元素
function differ(arr1, arr2) {
    if (isNull(arr1)) {
        return [];
    }
    if (isNull(arr2)) {
        arr1 = arr1 instanceof Array ? arr1 : [arr1];
        return arr1;
    }
    arr1 = arr1 instanceof Array ? arr1 : [arr1];
    arr2 = arr2 instanceof Array ? arr2 : [arr2];
    var temp = new Array();
    temp = arr1.concat();
    arr2.forEach(element => {
        if (temp.indexOf(element) > -1) {
            temp.remove(element);
        }
    });
    return temp.unique();
}
//合并arr1和arr2
function merge(arr1, arr2) {
    if (isNull(arr1) && isNull(arr2)) {
        return [];
    } else if (isNull(arr1)) {
        return arr2 instanceof Array ? arr2 : [arr2];
    } else if (isNull(arr2)) {
        return arr1 instanceof Array ? arr1 : [arr1];
    }
    arr1 = arr1 instanceof Array ? arr1 : [arr1];
    arr2 = arr2 instanceof Array ? arr2 : [arr2];

    var temp = new Array();
    temp = arr1.concat(arr2);
    return temp.unique();

}
//根据题目index获取题目答案，type==1为单选，type==2为多选
function getAnswer(index, type) {
    var answers = [];
    if (type == 1) {
        if (isNull(p["correct"][index])) {
            if (isNull(p["wrong"][index])) {
                answers = pamap_current[index];
            } else {
                answers = differ(pamap_current[index], p["wrong"][index]);
            }
        } else {
            answers = p["correct"][index];
        }
        if (pamap_current[index].length === differ(pamap_current[index], answers).length) {
            answers = differ(pamap_current[index], p["wrong"][index]);
        }
    } else if (type == 2) {
        if (isNull(p["wrong"][index])) {
            answers = pamap_current[index];
        } else {
            if (isNull(p["correct"][index])) {
                answers = differ(pamap_current[index], p["wrong"][index]);
            } else {
                answers = differ(merge(pamap_current[index], p["correct"][index]),
                    p["wrong"][index]);
            }
        }
    }
    return answers;
}
//将元素类型变为数组
function toArray(ele) {
    return (ele instanceof Array ? ele : [ele]);
}
function qbUpload(giver, callback) {
    var message = {};
    var _p = {
        "correct": p["correct"],
        "wrong": p["wrong"]
    };
    delete _p["wrong"]["undefined"];
    delete _p["correct"]["undefined"];
    message.action = "sendToServer";
    message.courseid = _courseid;
    message.giver = giver;
    message.jsonQB = JSON.stringify(_p);
    chrome.runtime.sendMessage(message, (response) => {
        callback(response);
    });
}
var HtmlUtil = {
    /*1.用浏览器内部转换器实现html转码*/
    htmlEncode:function (html){
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement ("div");
        //2.然后将要转换的字符串设置为这个元素的innerText(ie支持)或者textContent(火狐，google支持)
        (temp.textContent != undefined ) ? (temp.textContent = html) : (temp.innerText = html);
        //3.最后返回这个元素的innerHTML，即得到经过HTML编码转换的字符串了
        var output = temp.innerHTML;
        temp = null;
        return output;
    },
    /*2.用浏览器内部转换器实现html解码*/
    htmlDecode:function (text){
        //1.首先动态创建一个容器标签元素，如DIV
        var temp = document.createElement("div");
        //2.然后将要转换的字符串设置为这个元素的innerHTML(ie，火狐，google都支持)
        temp.innerHTML = text;
        //3.最后返回这个元素的innerText(ie支持)或者textContent(火狐，google支持)，即得到经过HTML解码的字符串了。
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    },
    /*3.用正则表达式实现html转码*/
    htmlEncodeByRegExp:function (str){  
         var s = "";
         if(str.length == 0) return "";
         s = str.replace(/&/g,"&amp;");
         s = s.replace(/</g,"&lt;");
         s = s.replace(/>/g,"&gt;");
         s = s.replace(/ /g,"&nbsp;");
         s = s.replace(/\'/g,"&#39;");
         s = s.replace(/\"/g,"&quot;");
         return s;  
   },
   /*4.用正则表达式实现html解码*/
   htmlDecodeByRegExp:function (str){  
         var s = "";
         if(str.length == 0) return "";
         s = str.replace(/&amp;/g,"&");
         s = s.replace(/&lt;/g,"<");
         s = s.replace(/&gt;/g,">");
         s = s.replace(/&nbsp;/g," ");
         s = s.replace(/&#39;/g,"\'");
         s = s.replace(/&quot;/g,"\"");
         return s;  
   }
};