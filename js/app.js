'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vitamind = require('vitamind');

var _vitamind2 = _interopRequireDefault(_vitamind);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// reducer

var reducer = function reducer(state, action) {
    state = state || 0;
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
};

// render

var Dash = function Dash(props, state, children) {
    return (0, _vitamind2.default)('p', null, 'Clicked: ', (0, _vitamind2.default)('span', null, state), ' times ', (0, _vitamind2.default)('button', { onclick: 'INCREMENT' }, '+'), ' ', (0, _vitamind2.default)('button', { onclick: 'DECREMENT' }, '-'), ' ', (0, _vitamind2.default)('button', { onclick: state % 2 ? 'INCREMENT' : null }, 'Increment if odd'), ' ', (0, _vitamind2.default)('button', { onclick: 'INCREMENT_ASYNC' }, 'Increment async'));
};

var render = function render(props, state) {
    return (0, _vitamind2.default)('.', null, (0, _vitamind2.default)(Dash));
};

// middleware

var increment = function increment(dispatch) {
    setTimeout(function () {
        return dispatch({ type: 'INCREMENT' });
    }, 1000);
};

var middleware = function middleware(action, dispatch) {
    switch (action.type) {
        case 'INCREMENT_ASYNC':
            return increment;
        default:
            return action;
    }
};

// app

exports.default = (0, _vitamind.connect)(reducer, render, middleware);
