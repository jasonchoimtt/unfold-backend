import 'babel-polyfill';
import 'source-map-support/register';

import chai from 'chai';
import things from 'chai-things';
chai.use(things);
global.expect = chai.expect;
