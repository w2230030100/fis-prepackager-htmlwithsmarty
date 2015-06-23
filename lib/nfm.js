/**
 * Created by ningfujun on 15/6/23.
 */
var nfj = require("nfj");

var nfm = function(){

    var param = {
        left_delimiter:"{%",
        right_delimiter:"%}",
        extend:"extend",
        block:"block",
        extend_file:"file",
        block_name:"name",


        content:arguments[0].file.getContent(),
    }

    var plugin = this;
    var elem = fis.util.merge(param,arguments[0]);

    //正则函数类
    var reg = function(set){
        var sets = fis.util.merge({
            value:"(.*)"
        },nfj.util.safeVar(set,{}));

        switch (sets.tag){
            case elem.block:
                return new RegExp(""+elem.left_delimiter+sets.tag+"[^"+elem.right_delimiter+"]*"
                    +sets.name+"=[\"\']"+sets.value+"[\"\'][^"+elem.right_delimiter+"]*"
                    +elem.right_delimiter+"([\\s\\S]*?)"+elem.left_delimiter+"\\/"
                    +elem.block+elem.right_delimiter+"","ig");
            case elem.extend:
                return new RegExp(""+elem.left_delimiter+sets.tag+"[^"+elem.right_delimiter+"]*"
                    +sets.name+"=[\'\"]"+sets.value+"[\'\"][^"+elem.right_delimiter+"]*"
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
                scon = file.getContent(),//获取文件内容
                reg_child = reg({name:elem.block_name,tag:elem.block}),//获取匹配block正则
                vdata;//定义数据变量

            console.log(scon);
            //遍历并且替换父模版内容
            while(vdata = reg_child.exec(elem.content)){
                scon = scon.replace(reg({name:elem.block_name,tag:elem.block,value:vdata[1]}),vdata[2]);
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