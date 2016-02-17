import 'babel-polyfill';
import 'source-map-support/register';

import chai from 'chai';
import dirtyChai from 'dirty-chai'; // ( ͡° ͜ʖ ͡°)
chai.use(dirtyChai);
global.expect = chai.expect;
