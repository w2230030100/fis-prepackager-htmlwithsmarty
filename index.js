var nfm = require("./lib/nfm");

module.exports = function(ret, conf, settings, opt) {
    fis.util.map(ret.src, function(subpath, file) {
        if (file.isHtmlLike) {
            var nfma = new nfm({file:file});
            //file.setContent("aaa");
        }
    });
};