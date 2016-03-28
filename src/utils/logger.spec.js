import sinon from 'sinon';
import { Config } from '../config';
import { logger } from './logger';


describe('Logger', function() {
    let spy, oldLogLevel;
    beforeEach(function() {
        spy = sinon.stub(logger, 'write');
        oldLogLevel = Config.logLevel;
        Config.logLevel = 'INFO';
    });

    afterEach(function() {
        logger.write.restore();
        Config.logLevel = oldLogLevel;
    });

    it('logs with the correct level', function() {
        logger.info('test', 'aha');
        let match = /<(\d+)>/.exec(spy.firstCall.args[0]);
        expect(match).to.be.ok.and.have.property('1')
            .that.satisfies(x => x % 8 === logger.levels.INFO);

        spy.reset();

        logger.error('test', 'aha');
        match = /<(\d+)>/.exec(spy.firstCall.args[0]);
        expect(match).to.be.ok.and.have.property('1')
            .that.satisfies(x => x % 8 === logger.levels.ERROR);
    });

    it('logs the tag correctly', function() {
        logger.info('logger-test', 'aha');
        expect(spy).to.have.been.calledOnce; // eslint-disable-line
        expect(spy.firstCall.args[0]).to.match(/logger-test/);

        spy.reset();

        logger.info('a space between', 'go figure');
        expect(spy).to.have.been.calledTwice; // eslint-disable-line
        expect(spy.secondCall.args[0]).to.match(/a space between/);
    });

    it('sets up log level correctly', function() {
        Config.logLevel = 'ERROR';
        logger.warning('logger-test', 'not printed');
        expect(spy).not.to.have.been.called; // eslint-disable-line

        logger.error('logger-test', 'did print');
        expect(spy).to.have.been.called; // eslint-disable-line
        expect(spy.firstCall.args[0]).to.match(/did print/);
    });
});
