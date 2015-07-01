/**
 * Created by ningfujun on 15/6/23.
 */
//运算函数
//bc  子模板block内内容 出现$parent类型
//bp  子模板block参数   出现append或者prepend
//fbc 父模版block内内容 字符串和数组类型 出现$child类型
module.exports = function(bc,bp,fbc){
    var param = require("./config");
    var nfj = require("nfj");

    var smarty = {
        "smarty.block.child":true,
        "smarty.block.parent":true
    };
    var reg = {
        schild:new RegExp("{%\\$([^%}]*)%}","ig"),
        tag:/{%([^%}]*)%}/ig
    };
    //验证是否重复继承
    var jcount = 0;

    //fbc内容净化 取出冗余的smarty外层标签
    function init(){
        fbc_fnc();
        bc_fnc();
        bp_fnc();
    }
    //console.log(reg.schild);
    function fbc_fnc(){
        for(var i  in fbc){
            //获取单个父模板内内容
            var fbckey = fbc[i];
            //父模版内继承属性
            var father_smarty = fbckey.match(reg.schild);
            if(father_smarty){
                jcount++;
                for(var j in father_smarty){
                    //提取内容辨别是否标准smarty继承语句
                    if(smarty[nfj.util.filter_EN(father_smarty[j])]){
                        bc = fbckey.replace(reg.schild,bc);
                    }
                }
            }
        }
    }

    function bc_fnc(){
        var child_smarty = bc.match(reg.schild);
        if(child_smarty){
            jcount++;
            for(var i in child_smarty){
                if(smarty[nfj.util.filter_EN(child_smarty[i])]){
                    bc = bc.replace(reg.schild,fbc);
                }
            }
        }
    }

    function bp_fnc(){
        switch (nfj.util.lrtrim(bp)){
            case "append":
                bc = fbc + bc;
                jcount++;
                break;
            case "prepend":
                bc = bc + fbc;
                jcount++;
                break;
        }
    }

    init();
    if(jcount!=1){
        fis.log.warning("不能重复定义继承模板/n"+bc);
    }

    //净化标签取出冗余的smarty外层标签
    bc = bc.replace(reg.tag,"");
    return bc;
}