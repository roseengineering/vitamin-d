
import h, { connect } from 'vitamind';

// reducer

var reducer = function(state, action) {
    state = state || 0;
    switch (action.type) {
    case 'INCREMENT':
        return state + 1;
    case 'DECREMENT':
        return state - 1;
    default:
        return state;
    }
}

// render

var Dash = function(props, state, children){
    return h('p', null,
        'Clicked: ',
        h('span', null, state),
        ' times ',
        h('button', { onclick: 'INCREMENT' }, '+'),
        ' ',
        h('button', { onclick: 'DECREMENT' }, '-'),
        ' ',
        h('button', { onclick: state % 2 ? 'INCREMENT' : null }, 
          'Increment if odd'),
        ' ',
        h('button', { onclick: 'INCREMENT_ASYNC' }, 
          'Increment async')
    );
};

var render = function(props, state){
    return h('.', null, h(Dash));
};

// middleware

var increment = function(dispatch){
    setTimeout(() => dispatch({ type: 'INCREMENT' }), 1000);
};

var middleware = function(action, dispatch){
    switch (action.type) {
    case 'INCREMENT_ASYNC':
        return increment;
    default:
        return action;
    }
}

// app

export default connect(reducer, render, middleware);

