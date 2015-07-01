/**
 * Created by ningfujun on 15/6/23.
 */
var nfj = require("nfj");
var smarty = require("./smarty");
var config = require("./config");

var nfm = function(){
    var elem = {};
    var plugin = this;

    nfj.util.extend(elem,config,arguments[0]);

    elem.content=arguments[0].file.getContent();
    //正则函数类
    var reg = function(set){
        var sets = fis.util.merge({
            value:"(.*)"
        },nfj.util.safeVar(set,{}));

        switch (sets.tag){
            case elem.block:
                return new RegExp(""+elem.left_delimiter+sets.tag+"[^"+elem.right_delimiter+"]*"
                    +sets.name+"=[\"\']"+sets.value+"[\"\']([^"+elem.right_delimiter+"]*)"
                    +elem.right_delimiter+"([\\s\\S]*?)"+elem.left_delimiter+"\\/"
                    +elem.block+elem.right_delimiter+"","ig");
            case elem.extend:
                return new RegExp(""+elem.left_delimiter+sets.tag+"[^"+elem.right_delimiter+"]*"
                    +sets.name+"=[\'\"]"+sets.value+"[\'\"]([^"+elem.right_delimiter+"]*)"
                    +elem.right_delimiter+"","ig");
        }
    }

    plugin.init = function(){
        plugin.replace();
    };
    //tag模版标签 name属性名 value属性值 callback回调函数
    plugin.attr = function(tag,name,value,callback){
        var vdata,ereg = reg({tag:tag,name:name}),reVal="";
        callback = nfj.util.safeVar(callback,function(){});
        while(vdata = ereg.exec(elem.content)){
            //如果有属性值  返回模板标签内部内容
            if(vdata[1]==value){
                reVal=vdata[2];
                callback();
                //否则返回属性值
            }else{
                reVal=vdata[1];
            }
        }
        return reVal;
    };

    plugin.replace = function(){
        //获取父模版路径
        var path = fis.util.realpathSafe(plugin.attr(elem.extend,elem.extend_file));

        if(path){
            var file = fis.file.wrap(path),//fis文件类初始化 留接口方便以后使用
                scon = file.getContent(),//获取文件内容 模版内容
                reg_child = reg({name:elem.block_name,tag:elem.block}),//获取匹配block正则
                vdata;//定义数据变量

            //遍历并且替换父模版内容
            while(vdata = reg_child.exec(elem.content)){
                //匹配含有name值得正则
                var reg_child_name = reg({name:elem.block_name,tag:elem.block,value:vdata[1]});
                //匹配父模版block内容
                var scon_block = scon.match(reg_child_name);
                //子模板内容
                var child_con = vdata[3];

                child_con = smarty(child_con,vdata[2],scon_block);

                //console.log(scon_block[0]);
                scon = scon.replace(reg_child_name,child_con);
            }
            //赋值
            elem.file.setContent(scon);
        }
    };

    plugin.layout = function(){

    }

    plugin.init();
};

module.exports = nfm;