/**
 * Created by ningfujun on 15/6/23.
 */
//运算函数
//bc  子模板block内内容 出现$parent类型
//bp  子模板block参数   出现append或者prepend
//fbc 父模版block内内容 字符串和数组类型 出现$child类型
module.exports = function(bc,bp,fbc){
    var param = require("./config");

    var smarty = {
        "smarty.block.child":"true"
    };
    var reg = {
        schild:function(){
            //return new RegExp("{%\$([^%}]*)%}","ig");
            return /{%\$([^%}]*)%}/ig;
        },
        tag:/{%([^%}]*)%}/ig
};
    //验证是否重复继承
    var jcount = 0;

    //fbc内容净化 取出冗余的smarty外层标签

    for(var i  in fbc){
        //获取单个父模板内内容
        var fbckey = fbc[i];
        //父模版内继承属性
        var father_smarty = fbckey.match(reg.schild());
        for(var j in father_smarty){
            //提取内容辨别是否标准smarty继承语句
            if(smarty[father_smarty[j].match(/[a-zA-Z.]/g).join("")]){
                bc = fbckey.replace(reg.schild(),bc);
            }
        }
    }
    //净化标签取出冗余的smarty外层标签
    bc = bc.replace(reg.tag,"");
    return bc;
}