if (process.env.NODE_ENV !== 'production')
    require('source-map-support/register');

import chai from 'chai';
import things from 'chai-things';
import asPromised from 'chai-as-promised';
import subset from 'chai-subset';
import sinon from 'sinon-chai';
chai.use(things);
chai.use(asPromised);
chai.use(subset);
chai.use(sinon);
global.expect = chai.expect;
