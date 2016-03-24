import sinon from 'sinon';
import { Subscriber, Publisher } from './stream';


describe('Redis stream', function() {
    it('works', async function() {
        let subs, deferred = new Promise(resolve => { subs = sinon.spy(resolve); });

        await Subscriber.subscribe('test_stream', subs);

        expect(subs).not.to.have.been.called; // eslint-disable-line

        await Publisher.publish('test_stream', { data: 'It works!' });

        await deferred;
        expect(subs).to.have.been.calledOnce; // eslint-disable-line
        expect(subs.firstCall.args[0]).to.have.property('data', 'It works!');
    });
});
