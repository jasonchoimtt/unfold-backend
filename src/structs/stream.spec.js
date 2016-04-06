/* eslint-disable no-unused-expressions */
import sinon from 'sinon';
import { Subscriber, Publisher } from './stream';


describe('Redis stream', function() {
    it('works', async function() {
        let subs, deferred = new Promise(resolve => { subs = sinon.spy(resolve); });

        await Subscriber.subscribe('test_stream', subs);

        expect(subs).not.to.have.been.called;

        let message = JSON.stringify({ data: 'It works!' });

        await Publisher.publish('test_stream', message);

        await deferred;
        expect(subs).to.have.been.calledOnce;
        expect(subs.firstCall.args[0]).to.equal(message);
    });
});
