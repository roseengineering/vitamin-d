
var vdom = require('virtual-dom');
var util = require('vdom-serialized-patch');
var redux = require('redux');

var h = vdom.h;
var diff = vdom.diff;
var serialize = util.serialize;
var patch = util.patch;
var createStore = redux.createStore;

var store;

exports.__esModule = true;

var hyper = exports.default = function(tag, props, children){
    children = [].slice.call(arguments, 2);
    if (typeof tag != 'string')
        return tag(props, store.getState(), children);
    return h(tag == '.' ? 'div' : tag, props, children);
}

exports.connect = function(reducer, render, middleware){
    store = createStore(reducer);

    var tree = h('div');

    var dispatch = function(action){
        if (middleware) action = middleware(action, dispatch);
        typeof action == 'function' ? 
            action(dispatch) : 
            action && store.dispatch(action);
    }

    store.subscribe(function(){
        var r = hyper(render, {});
        var patches = diff(tree, r);
        var stream = JSON.stringify(serialize(patches));
        postMessage(stream);
        tree = r;
    });

    onmessage = function(m){
        dispatch(JSON.parse(m.data));
    };

    return {
        postMessage: function(data){
            onmessage({ data: data })
        }
    };
}

exports.createApp = function(el, worker){
    var rootNode = document.createElement('div');
    el.appendChild(rootNode);

    var dispatch = function(action){
        worker.postMessage(JSON.stringify(action));
    };

    var expose = function(ob){
        var d = {};
        for (var k in ob){
            var v = ob[k];
            if (v === null || (typeof v != 'object' && typeof v != 'function'))
                d[k] = v;
        }
        return d;
    };

    var update = function(data){
        patch(rootNode, JSON.parse(data, function(key, value){
            if (!key.indexOf('on')){
                return value === null ? null : function(ev){
                    var payload = expose(ev);
                    dispatch({ type: value, payload: payload });
                };
            }
            return value;
        }));
    };

    if (worker instanceof Worker) {
        worker.onmessage = function(m){ update(m.data) };
    } else {
        postMessage = update;
    }

    return dispatch;
}

