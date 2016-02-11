import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();
import 'babel-polyfill';

console.log('It almost really works!', ...['1', '2', '3']);
