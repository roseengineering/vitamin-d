import { createApp } from 'vitamind';
import workify from 'workify';

var worker = 1 ? workify('./app') : require('./app').default;
var dispatch = createApp(document.body, worker);

dispatch({ type: null });

