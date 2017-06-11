
import os
import sys
import re, json

entrypoint = './main'

def norm(path):
    name, ext = os.path.splitext(path)
    name = re.sub('^js/', './', name)
    name = re.sub('^src/', '', name)
    name = re.sub('^vendor/', '', name)
    name = re.sub('^node_modules/', '', name)
    name = re.sub('/index$', '', name)
    return name

############################

args = sys.argv[1:]
if len(args) > 1 and args[0] == "-e":
    entrypoint = args[1]
    args = args[2:]


print("""\
var module = module || {};
module.exports = (function bundler(modules){
    var cache = {};
    return function require(name){
        var m, e = cache[name];
        if(!e && modules[name]){
            m = { exports: {} };
            modules[name].call(null, require, m, m.exports, bundler, modules);
            e = cache[name] = m.exports;
        }
        return e;
    }
})({""")

for filename in args:
    with open(filename, encoding='utf-8') as f:  # for utf-8
        buf = f.read()
        print("'%s':function(require, module, exports){" % norm(filename))
        print(buf)
        print("\n},")

print("})('%s');" % entrypoint)

