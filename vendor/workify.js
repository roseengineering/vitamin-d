var bundleFn = arguments[3];
var sources = arguments[4];

exports.__esModule = true;

exports.default = function(name){
    var stringify = JSON.stringify;
    var src = '(' + bundleFn + ')({'
        + Object.keys(sources).map(function(key){
            return stringify(key) + ':' + sources[key];
        }).join(',') + '})(' + stringify(name) + ')';

    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
    var blob = new Blob([src], { type: 'text/javascript' });
    var workerUrl = URL.createObjectURL(blob);
    var worker = new Worker(workerUrl);
    if (typeof URL.revokeObjectURL == "function")
        URL.revokeObjectURL(workerUrl);
    return worker;
};

