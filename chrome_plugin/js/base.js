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
String.prototype.trim = function () { return this.replace(/\s+/g, ""); };
String.prototype.format = function(){
    var regx = /<[img ]{3,}[\S]+?[https]{3,4}:\/\/([\S]+?\.[pngjeifbm]{3,4})[\S]+?>/gi;
    var regx2=/\<[^\<\>]+?\>/ig;
    return HtmlUtil.htmlDecode(this).trim().replace(regx,"$1").replace(regx2,"");
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
function md5(str){
    return str;
}
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
    if ($(ele).find("div.optionCnt span.u-icon-wrong").length > 0) {
        return '错误';
    }
    if ($(ele).find("div.optionCnt span.u-icon-correct").length > 0) {
        return '正确';
    }
    return $(ele).find("div.f-richEditorText")[0].innerHTML.format();
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
    return $(ele).find("div.j-title div.f-richEditorText.j-richTxt")[0].innerHTML.format();
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
//将字符串“1004441088,1004441089,1004441090|第1讲测验,第2讲测验,第3讲测验”转换成对应的对象
function parseDoneQuizs(donequiz){
    var obj={}
    var quizID=donequiz.split('\|')[0].split(',');
    var quizname=donequiz.split('\|')[1].split(',');
    quizname.forEach((name,index)=>{
        obj[name]=quizID[index];
    });
    return obj;
}
//将sqb转换成qb
res={};
function qbConverter(response){
    res=response;
    var qb=JSON.parse(response.jsonQB);
    qb = !qb?{
        correct:{},
        wrong:{}
    }:qb;
    var sqb=JSON.parse(response.sjonQB);
    if(sqb!=null){
        for(key in sqb){
            var q = sqb[key];
            var title = q.title.format();
            var correct = q.correct;
            var wrong =q.wrong;
            qb.correct[title]=merge(qb.correct[title],choiceConverter(correct));
            qb.wrong[title]=merge(qb.wrong[title],choiceConverter(wrong));
        }
    }
    return qb;
}

function choiceConverter(arr){
    var result=[];
    if(!isNull(arr)){
        arr.forEach((ele)=>{
            if(!ele.content){
                result.push(ele);
            }else{
                result.push(ele.content.format());
            }
        });
    }
    return result;
}
//上传题库
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
    message.termid = getTermID();
    message.giver = giver;
    message.giverid = getWebUser().id;
    message.curlength = Object.getOwnPropertyNames(_p.correct).length+Object.getOwnPropertyNames(_p.wrong).length;
    message.jsonQB = JSON.stringify(_p);
    chrome.runtime.sendMessage(message, (response) => {
        callback(response);
    });
}
function sendWrong(quizname) {
    console.log('send wrong')
    var message = {};
    message.action = "wrong";
    message.courseid = _courseid;
    message.termid = getTermID();
    message.quizname = quizname;
    chrome.runtime.sendMessage(message, (response) => {
    });
}

var getWindowObj = (function () {
    let _window;
    let objName='{user:window.webUser,termdto:window.termDto}';
    return function () {
        if (!_window) {
            let js = document.createElement('script');
            js.setAttribute("type", "text/javascript");
            js.text = 'var div=document.createElement("div");div.setAttribute("id","getWindow");div.setAttribute("style","display:none");div.innerText=JSON.stringify('+objName+');document.getElementsByTagName("body")[0].appendChild(div);';
            document.getElementsByTagName("head")[0].appendChild(js);
            let text = document.getElementById("getWindow").innerText;
            _window = JSON.parse(text);
        }
        return _window;
    }
})();
//获取用户对象
var getWebUser = function(){
    return getWindowObj().user;
}
var getTermID = function(){
    return getWindowObj().termdto.id + '';
}
var HtmlUtil = {
    htmlEncode:function (str){  
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
   htmlDecode:function (str){  
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