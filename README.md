
This repo provides the module vitamind which is a virtual dom framework
for creating single page javascript apps.

The module uses pure functions for components.  The components are also
stateless. The current redux state is passed to them every time 
they are called.  So no this.state stuff.

Lastly, the module moves the virtual dom generation code out of the
main thread and into a web worker.  The web worker contains all the components 
and reducers.  The main thread only receives dom patches and applies them.

A simple counter app, with source code in js/, is provided as an
example of the framework's use.


## How it works

When a change in the redux state occurs, the render function 
is called.  This render function will call the first component.
The component returns a virtual dom which is in turn returned by
the render function.

The returned virtual dom is then diffed against the current one and the diff sent
to the main thread.  The main thread patches the dom using the diff.

To accomplish this the module uses nolanlawson/vdom-serialized-patch and 
Matt-Esch/virtual-dom as well as reactjs/redux.

The external module files redux.js, vdom-serialized-patch.js, and virtual-dom.js 
are prewrapped into the module so they are not required.


## API

1. vitamind provides a hypertext function:

```javascript
     import h from 'vitamind';
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
```

*  If a string is passed as the first parameter then h takes the
   following parameters: (tag, properties, children).  This is the vdom
   syntax.

   Since pure functions cannot be passed to the main thread
   from web workers, functions cannot be used as attribute values with the
   properties object.  However if a constant, like a string, is used
   for "onevent" values,
   then when the event occurs a redux action will be dispatch with the 
   constant as the action type and the dom event as the payload

*  If a function is passed as the first parameter then h takes the 
   following parameters: (component, properties, children).  This is the component
   syntax.

   When this happens, h calls the component function using 
   (properties, state, children) where properties and children are from above
   and the state is the current state of the redux store.

   This means you can represent your dom using pure functions.


2. To create the backend you call connect:  

```javascript
     import { connect } from 'vitamind';
     var render = function(props, state){
         return h('.', null, h(Dash));
     };
     connect(reducer, render, middleware);
```


*  connect takes the following parameters (reducer, render, [ middleware ])
   where render is a function that returns the vdom from your base component 
   and reducer is your base redux reducer.

   The middleware is optional.  The middleware is called with 
   (action, dispatch) to intercept actions dispatched from the main 
   thread.  Since pure functions cannot cross over from the main thread 
   to web workers the redux thunk middleware cannot be used.  So this
   middleware function is used instead.  This is where you can call dispatch.

*  connect() uses these arguments to set up the web worker background
   code.  This code is then passed to Worker() either through a blob 
   or a url.  So connect does not need to return anything.  But as a 
   convenience connect returns a mock web worker object.  This
   can be passed to the createApp function to debug the backend in the
   main thead if needed.


3. To create the main thread app call createApp:  

```javascript
     import { createApp } from 'vitamind';
     var worker = workify('./app');
     var dispatch = createApp(document.body, worker);
     dispatch({ type: null });
```


*  This bridges the main thread with the backend web worker.  The
   function return a dispatch function which can be used to kickoff
   the first rendering of the app.  The './app' module here is the
   backend module.


Copyright 2017 roseengineering

