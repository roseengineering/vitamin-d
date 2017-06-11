'use strict';

var _vitamind = require('vitamind');

var _workify = require('workify');

var _workify2 = _interopRequireDefault(_workify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var worker = 1 ? (0, _workify2.default)('./app') : require('./app').default;
var dispatch = (0, _vitamind.createApp)(document.body, worker);

dispatch({ type: null });
